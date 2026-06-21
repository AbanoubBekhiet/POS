<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrdersController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Order::with(['user', 'products'])
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', '%' . $search . '%')
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'like', '%' . $search . '%'));
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $paginator = $query->simplePaginate(20);

        $orders = collect($paginator->items())->map(function ($order) {
            return [
                'id'         => '#ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                'raw_id'     => $order->id,
                'customer'   => $order->user?->name ?? 'غير معروف',
                'email'      => $order->user?->email ?? '—',
                'items'      => $order->products->count(),
                'total'      => number_format(floatval($order->total_price), 2) . ' ج.م',
                'status'     => $order->status ?? 'pending',
                'date'       => $order->created_at ? $order->created_at->format('d M Y') : '—',
            ];
        });

        // Stats
        $todayTotal = Order::whereDate('created_at', today())->sum('total_price');
        $completedToday = Order::whereDate('created_at', today())->where('status', 'completed')->count();
        $pendingCount = Order::where('status', 'pending')->count();
        $totalOrders = Order::count();

        return Inertia::render('orders/Index', [
            'orders' => [
                'data'         => $orders,
                'next_page'    => $paginator->hasMorePages() ? $paginator->currentPage() + 1 : null,
                'current_page' => $paginator->currentPage(),
            ],
            'stats' => [
                'today_total'     => number_format(floatval($todayTotal), 2) . ' ج.م',
                'completed_today' => $completedToday,
                'pending_count'   => $pendingCount,
                'total_orders'    => $totalOrders,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
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
}
