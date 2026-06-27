<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PendingCart;
use App\Models\PendingCartItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class posController extends Controller
{
    public function pos(Request $request)
    {
        $customers = User::where('role', 'customer')->get(['id', 'name']);
        $categories = Category::all();

        $productQuery = Product::with('category');

        if ($request->filled('query')) {
            $productQuery->where('name', 'like', '%' . $request->input('query') . '%');
        }

        if ($request->filled('category_id')) {
            $productQuery->where('category_id', $request->input('category_id'));
        }

        $products = $productQuery->cursorPaginate(20)->withQueryString();
        $products->getCollection()->transform(function ($product) {
            return [
                'id'                       => $product->id,
                'name'                     => $product->name,
                'price'                    => floatval($product->price),
                'stock'                    => intval($product->stock),
                'unit'                     => $product->unit,
                'number_of_items_in_unit'  => intval($product->number_of_items_in_unit),
                'category_name'            => optional($product->category)->name ?? 'بدون قسم',
            ];
        });

        // Support pending_page for infinite scroll partial reloads
        // We load items and their product info so frontend can resume them.
        $pendingCarts = PendingCart::with(['customer:id,name', 'items.product'])
            ->latest()
            ->paginate(10, ['*'], 'page', $request->input('pending_page', 1));

        return Inertia::render('pos/Index', [
            'customers'    => $customers,
            'products'     => $products,
            'categories'   => $categories,
            'pendingCarts' => $pendingCarts,
        ]);
    }

    /**
     * Save the current working cart as a pending (held) cart.
     */
    public function saveCart(Request $request)
    {
        Log::info('saveCart Input:', $request->all());
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'items'       => 'required|array|min:1',
            'items.*.id'  => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total'       => 'required|numeric|min:0',
            'items_count' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            $pendingCart = PendingCart::create([
                'customer_id' => $request->customer_id,
                'total'       => $request->total,
                'items_count' => $request->items_count,
            ]);

            foreach ($request->items as $item) {
                PendingCartItem::create([
                    'pending_cart_id' => $pendingCart->id,
                    'product_id'      => $item['id'],
                    'quantity'        => $item['quantity'],
                    'price'           => $item['price'],
                    'total_price'     => $item['price'] * $item['quantity'],
                ]);
            }

            DB::commit();
            session()->flash('success', 'تم حفظ السلة المعلقة بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to save pending cart: ' . $e->getMessage());
            session()->flash('error', 'فشل حفظ السلة المعلقة');
        }

        return redirect()->route('pos');
    }

    /**
     * Swaps the current working cart with a pending cart.
     * The current working cart is saved as pending, and the target pending cart is resumed.
     */
    public function swapCarts(Request $request)
    {
        Log::info('swapCarts Input:', $request->all());
        $request->validate([
            'resume_pending_cart_id' => 'required|exists:pending_carts,id',
            // Active cart details (if active cart is not empty)
            'customer_id'            => 'nullable|exists:users,id',
            'items'                  => 'nullable|array',
            'items.*.id'             => 'nullable|exists:products,id',
            'items.*.quantity'       => 'nullable|integer|min:1',
            'items.*.price'          => 'nullable|numeric|min:0',
            'total'                  => 'nullable|numeric|min:0',
            'items_count'            => 'nullable|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            // 1. If active cart has items, save it as a new pending cart
            if (!empty($request->items)) {
                if (!$request->customer_id) {
                    session()->flash('error', 'يجب تحديد عميل لحفظ السلة الحالية');
                    return redirect()->route('pos');
                }

                $pendingCart = PendingCart::create([
                    'customer_id' => $request->customer_id,
                    'total'       => $request->total,
                    'items_count' => $request->items_count,
                ]);

                foreach ($request->items as $item) {
                    PendingCartItem::create([
                        'pending_cart_id' => $pendingCart->id,
                        'product_id'      => $item['id'],
                        'quantity'        => $item['quantity'],
                        'price'           => $item['price'],
                        'total_price'     => $item['price'] * $item['quantity'],
                    ]);
                }
            }

            // 2. Retrieve the pending cart to resume
            $resumedCart = PendingCart::with(['customer:id,name', 'items.product'])->findOrFail($request->resume_pending_cart_id);

            // 3. Format the data to pass back to the frontend
            $formattedItems = [];
            foreach ($resumedCart->items as $item) {
                $formattedItems[] = [
                    'id'          => $item->product->id,
                    'name'        => $item->product->name,
                    'price'       => floatval($item->price),
                    'quantity'    => intval($item->quantity),
                    'unit'        => $item->product->unit,
                    'image'       => $item->product->image,
                    'stock'       => $item->product->stock,
                ];
            }

            $resumedData = [
                'customer' => $resumedCart->customer,
                'items'    => $formattedItems,
            ];

            // 4. Delete the resumed cart from the database
            $resumedCart->delete();

            DB::commit();

            session()->flash('resumed_cart', $resumedData);
            session()->flash('success', 'تم استدعاء السلة المعلقة بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to swap carts: ' . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء تبديل السلات');
        }

        return redirect()->route('pos');
    }

    /**
     * Delete a pending cart by ID.
     */
    public function deletePendingCart($id)
    {
        $pendingCart = PendingCart::findOrFail($id);
        $pendingCart->delete();

        session()->flash('success', 'تم حذف السلة المعلقة بنجاح');
        return redirect()->route('pos');
    }

    /**
     * Completes making products in the cart as an order, deducts stock, and flashes details for receipt printing.
     */
    public function completeOrder(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'items'       => 'required|array|min:1',
            'items.*.id'  => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Verify stock first
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);
                if ($product->stock < $item['quantity']) {
                    session()->flash('error', "الكمية المطلوبة من المنتج '{$product->name}' غير متوفرة بالمخزن");
                    return redirect()->route('pos');
                }
            }

            // Create Order
            // Use the first product ID for the legacy product_id column in orders table
            $firstProduct = $request->items[0];

            $order = Order::create([
                'user_id'     => $request->customer_id,
                'product_id'  => $firstProduct['id'],
                'total_price' => $request->total_price,
                'status'      => 'completed',
            ]);

            // Save order items & deduct stock
            $receiptItems = [];
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);

                // Insert into products_orders pivot
                DB::table('products_orders')->insert([
                    'order_id'    => $order->id,
                    'product_id'  => $item['id'],
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                    'total_price' => $item['price'] * $item['quantity'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // Deduct stock
                $product->decrement('stock', $item['quantity']);

                $receiptItems[] = [
                    'name'        => $product->name,
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                    'total_price' => $item['price'] * $item['quantity'],
                ];
            }

            $customer = User::findOrFail($request->customer_id);

            // Save receipt details for frontend print modal
            $completedOrderDetails = [
                'order_number'  => '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                'customer_name' => $customer->name,
                'date'          => now()->format('Y-m-d h:i A'),
                'items'         => $receiptItems,
                'total_price'   => floatval($request->total_price),
            ];

            DB::commit();

            session()->flash('completed_order', $completedOrderDetails);
            session()->flash('success', 'تم تسجيل الطلب وخصم الكميات بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to complete order: ' . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء إتمام الطلب');
        }

        return redirect()->route('pos');
    }
}
