<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\ReceivedOrder;
use App\Models\ReceivedOrderItem;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SuppliersController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Supplier::withCount('receivedOrders')
            ->withSum('receivedOrders', 'total_price');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('contact_name', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }

        $suppliers = $query->latest()->get()->map(fn($s) => [
            'id'                    => $s->id,
            'name'                  => $s->name,
            'contact_name'          => $s->contact_name ?? '—',
            'phone'                 => $s->phone ?? '—',
            'address'               => $s->address ?? '—',
            'received_orders_count' => $s->received_orders_count,
            'total_purchased'       => number_format($s->received_orders_sum_total_price ?? 0, 2),
        ]);

        $products = Product::select('id', 'name', 'stock', 'price')
            ->orderBy('name')
            ->get()
            ->map(fn($p) => [
                'id'    => $p->id,
                'name'  => $p->name,
                'stock' => $p->stock,
                'price' => floatval($p->price),
            ]);

        return Inertia::render('suppliers/Index', [
            'suppliers' => $suppliers,
            'products'  => $products,
            'filters'   => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone'        => 'nullable|string|max:50',
            'address'      => 'nullable|string|max:500',
        ]);

        Supplier::create($data);

        return back()->with('success', 'تم إضافة المورد بنجاح.');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone'        => 'nullable|string|max:50',
            'address'      => 'nullable|string|max:500',
        ]);

        $supplier->update($data);

        return back()->with('success', 'تم تحديث بيانات المورد.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return back()->with('success', 'تم حذف المورد.');
    }

    // ── Received Orders ──────────────────────────────────────────────────────

    public function receivedOrders(Supplier $supplier)
    {
        $orders = $supplier->receivedOrders()
            ->with('items.product')
            ->latest()
            ->get()
            ->map(fn($o) => [
                'id'          => $o->id,
                'total_price' => floatval($o->total_price),
                'notes'       => $o->notes,
                'created_at'  => $o->created_at->translatedFormat('d M Y'),
                'items'       => $o->items->map(fn($item) => [
                    'id'           => $item->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name ?? '—',
                    'quantity'     => $item->quantity,
                    'price'        => floatval($item->price),
                    'total_price'  => floatval($item->total_price),
                ]),
            ]);

        return response()->json(['orders' => $orders]);
    }

    public function storeReceivedOrder(Request $request, Supplier $supplier)
    {
        $data = $request->validate([
            'notes'              => 'nullable|string',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $totalPrice = 0;
            foreach ($data['items'] as $item) {
                $totalPrice += $item['quantity'] * $item['price'];
            }

            $order = ReceivedOrder::create([
                'supplier_id' => $supplier->id,
                'total_price' => $totalPrice,
                'notes'       => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                ReceivedOrderItem::create([
                    'received_order_id' => $order->id,
                    'product_id'        => $item['product_id'],
                    'quantity'          => $item['quantity'],
                    'price'             => $item['price'],
                    'total_price'       => $item['quantity'] * $item['price'],
                ]);

                $product = Product::find($item['product_id']);
                $product->increment('stock', $item['quantity']);
                if ($product->price < $item['price']) {
                    $product->update(['price' => $item['price']]);
                }
            }

            DB::commit();
            return back()->with('success', 'تم تسجيل الطلب الوارد وتحديث المخزون بنجاح.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'حدث خطأ أثناء تسجيل الطلب: ' . $e->getMessage()]);
        }
    }
}
