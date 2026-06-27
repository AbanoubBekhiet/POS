<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderReturn;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrdersController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Order::with(['user', 'products', 'returns'])
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', '%' . $search . '%')
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'like', '%' . $search . '%'))
                  ->orWhereHas('products', fn($pq) => $pq->where('name', 'like', '%' . $search . '%'));
            });
        }

        $paginator = $query->simplePaginate(15);

        $orders = collect($paginator->items())->map(fn($order) => $this->formatOrder($order));

        return Inertia::render('orders/Index', [
            'orders' => [
                'data'         => $orders,
                'next_page'    => $paginator->hasMorePages() ? $paginator->currentPage() + 1 : null,
                'current_page' => $paginator->currentPage(),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Return a single order's full details (for the details modal).
     */
    public function show($id)
    {
        $order = Order::with(['user', 'products', 'returns.product'])->findOrFail($id);

        return response()->json([
            'order' => $this->formatOrder($order, true),
        ]);
    }

    /**
     * Apply a discount to an order.
     */
    public function applyDiscount(Request $request, $id)
    {
        $request->validate([
            'discount' => 'required|numeric|min:0',
        ]);

        $order = Order::findOrFail($id);

        if ($request->discount > floatval($order->total_price)) {
            return back()->withErrors(['discount' => 'الخصم لا يمكن أن يكون أكبر من إجمالي الطلب.']);
        }

        try {
            $order->update(['discount' => $request->discount]);
            session()->flash('success', 'تم تطبيق الخصم بنجاح.');
        } catch (\Exception $e) {
            Log::error("Failed to apply discount on order {$id}: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء تطبيق الخصم.');
        }

        return redirect()->route('orders');
    }

    /**
     * Return one or more items (or the whole order).
     * Restores stock for returned quantities.
     */
    public function returnItems(Request $request, $id)
    {
        $request->validate([
            'items'          => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'reason'         => 'nullable|string|max:500',
        ]);

        $order = Order::with('products')->findOrFail($id);

        DB::beginTransaction();
        try {
            $totalRefund = 0;

            foreach ($request->items as $item) {
                // Find the pivot record to verify quantity
                $pivot = $order->products->firstWhere('id', $item['product_id']);

                if (!$pivot) {
                    throw new \Exception("المنتج غير موجود في هذا الطلب.");
                }

                $orderedQty = $pivot->pivot->quantity;

                // Check already returned quantity for this product
                $alreadyReturned = OrderReturn::where('order_id', $order->id)
                    ->where('product_id', $item['product_id'])
                    ->sum('quantity');

                $available = $orderedQty - $alreadyReturned;

                if ($item['quantity'] > $available) {
                    throw new \Exception("الكمية المطلوبة للمرتجع أكبر من الكمية المتاحة للمنتج.");
                }

                $unitPrice = floatval($pivot->pivot->price);
                $refund = $unitPrice * $item['quantity'];
                $totalRefund += $refund;

                // Create return record
                OrderReturn::create([
                    'order_id'      => $order->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $item['quantity'],
                    'refund_amount' => $refund,
                    'reason'        => $request->reason,
                ]);

                // Restore stock
                Product::where('id', $item['product_id'])->increment('stock', $item['quantity']);
            }

            // Determine if the order is fully or partially returned
            $order->refresh()->load('products', 'returns');
            $isFullReturn = $order->products->every(function ($product) use ($order) {
                $orderedQty = $product->pivot->quantity;
                $returnedQty = $order->returns->where('product_id', $product->id)->sum('quantity');
                return $returnedQty >= $orderedQty;
            });

            $order->update(['return_status' => $isFullReturn ? 'full' : 'partial']);

            DB::commit();
            session()->flash('success', 'تم تسجيل المرتجع بنجاح. مبلغ الاسترداد: ' . number_format($totalRefund, 2) . ' ج.م');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to return items for order {$id}: " . $e->getMessage());
            session()->flash('error', $e->getMessage() ?: 'حدث خطأ أثناء تسجيل المرتجع.');
        }

        return redirect()->route('orders');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'     => 'required|exists:users,id',
            'product_id'  => 'required|exists:products,id',
            'total_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id'     => $request->user_id,
                'product_id'  => $request->product_id,
                'total_price' => $request->total_price,
                'status'      => 'pending',
            ]);

            DB::commit();
            session()->flash('success', 'تم إنشاء الطلب بنجاح!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create order: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء إنشاء الطلب.');
        }

        return redirect()->route('orders');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        try {
            $order->update(['status' => $request->status]);
            session()->flash('success', 'تم تحديث حالة الطلب بنجاح!');
        } catch (\Exception $e) {
            Log::error("Failed to update order {$id}: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء تحديث الطلب.');
        }

        return redirect()->route('orders');
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        try {
            $order->delete();
            session()->flash('success', 'تم حذف الطلب بنجاح!');
        } catch (\Exception $e) {
            Log::error("Failed to delete order {$id}: " . $e->getMessage());
            session()->flash('error', 'حدث خطأ أثناء حذف الطلب.');
        }

        return redirect()->route('orders');
    }

    // ── Private helper ─────────────────────────────────────────────────────

    private function formatOrder(Order $order, bool $withProducts = false): array
    {
        $base = [
            'id'            => '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
            'raw_id'        => $order->id,
            'customer'      => $order->user?->name ?? 'غير معروف',
            'items'         => $order->products->count(),
            'total'         => number_format(floatval($order->total_price), 2) . ' ج.م',
            'discount'      => floatval($order->discount ?? 0),
            'net_total'     => number_format(max(0, floatval($order->total_price) - floatval($order->discount ?? 0)), 2) . ' ج.م',
            'return_status' => $order->return_status,
            'date'          => $order->created_at ? $order->created_at->format('d M Y') : '—',
        ];

        if ($withProducts) {
            $returnedMap = $order->returns->groupBy('product_id')->map(fn($r) => $r->sum('quantity'));

            $base['products'] = $order->products->map(function ($product) use ($returnedMap) {
                $orderedQty  = $product->pivot->quantity;
                $returnedQty = $returnedMap->get($product->id, 0);
                return [
                    'id'           => $product->id,
                    'name'         => $product->name,
                    'quantity'     => $orderedQty,
                    'price'        => floatval($product->pivot->price),
                    'total_price'  => floatval($product->pivot->total_price),
                    'returned_qty' => $returnedQty,
                    'available_qty'=> max(0, $orderedQty - $returnedQty),
                ];
            })->values()->toArray();

            $base['returns'] = $order->returns->map(fn($r) => [
                'product_name'  => $r->product?->name ?? '—',
                'quantity'      => $r->quantity,
                'refund_amount' => floatval($r->refund_amount),
                'reason'        => $r->reason,
                'date'          => $r->created_at?->format('d M Y'),
            ])->values()->toArray();
        }

        return $base;
    }
}
