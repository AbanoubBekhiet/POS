<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    /**
     * Verify admin credentials and return stats inline — no page reload needed.
     */
    public function verifyAdmin(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->where('role', 'admin')
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['ok' => false, 'message' => 'بيانات الاعتماد غير صحيحة أو المستخدم ليس مسؤولاً.'], 401);
        }

        // Store session so the range endpoint keeps working during this visit
        session(['stats_unlocked' => true]);

        // Return stats inline — frontend shows data without a full reload
        $stats = $this->buildStats(today(), today());

        return response()->json(['ok' => true, 'stats' => $stats]);
    }

    /**
     * Main statistics page — always clears the session so password is required every visit.
     */
    public function index(Request $request)
    {
        session()->forget('stats_unlocked');

        return Inertia::render('statistics/Index', [
            'unlocked' => false,
            'stats'    => null,
        ]);
    }

    /**
     * AJAX: get stats for a custom date range (requires active session unlock).
     */
    public function range(Request $request)
    {
        if (!session('stats_unlocked', false)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'from' => 'required|date',
            'to'   => 'required|date|after_or_equal:from',
        ]);

        return response()->json($this->buildStats($request->from, $request->to));
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private function buildStats($from, $to): array
    {
        $totalCapital = Product::selectRaw('SUM(stock * cost_price) as cap')->value('cap') ?? 0;

        $todaySales    = $this->salesInRange(today(), today());
        $todayProfit   = $this->profitInRange(today(), today());
        $todayOrders   = Order::whereDate('created_at', today())->count();
        $todayDiscount = $this->discountInRange(today(), today());

        $monthSales    = $this->salesInRange(now()->startOfMonth(), now()->endOfMonth());
        $monthProfit   = $this->profitInRange(now()->startOfMonth(), now()->endOfMonth());
        $monthDiscount = $this->discountInRange(now()->startOfMonth(), now()->endOfMonth());

        $rangeSales    = $this->salesInRange($from, $to);
        $rangeProfit   = $this->profitInRange($from, $to);
        $rangeDiscount = $this->discountInRange($from, $to);
        $rangeOrders   = Order::whereBetween('created_at', [
            \Carbon\Carbon::parse($from)->startOfDay(),
            \Carbon\Carbon::parse($to)->endOfDay(),
        ])->count();

        return [
            'total_capital' => $this->fmt($totalCapital),
            'today' => [
                'sales'    => $this->fmt($todaySales),
                'profit'   => $this->fmt($todayProfit),
                'orders'   => $todayOrders,
                'discount' => $this->fmt($todayDiscount),
            ],
            'month' => [
                'sales'    => $this->fmt($monthSales),
                'profit'   => $this->fmt($monthProfit),
                'discount' => $this->fmt($monthDiscount),
            ],
            'range' => [
                'sales'    => $this->fmt($rangeSales),
                'profit'   => $this->fmt($rangeProfit),
                'orders'   => $rangeOrders,
                'discount' => $this->fmt($rangeDiscount),
                'from'     => $from,
                'to'       => $to,
            ],
        ];
    }

    private function salesInRange($from, $to): float
    {
        return (float) Order::whereBetween('created_at', [
            \Carbon\Carbon::parse($from)->startOfDay(),
            \Carbon\Carbon::parse($to)->endOfDay(),
        ])->selectRaw('SUM(total_price - COALESCE(discount,0)) as s')->value('s');
    }

    private function discountInRange($from, $to): float
    {
        return (float) Order::whereBetween('created_at', [
            \Carbon\Carbon::parse($from)->startOfDay(),
            \Carbon\Carbon::parse($to)->endOfDay(),
        ])->selectRaw('SUM(COALESCE(discount,0)) as d')->value('d');
    }

    private function profitInRange($from, $to): float
    {
        return (float) DB::table('products_orders')
            ->join('orders', 'orders.id', '=', 'products_orders.order_id')
            ->join('products', 'products.id', '=', 'products_orders.product_id')
            ->whereBetween('orders.created_at', [
                \Carbon\Carbon::parse($from)->startOfDay(),
                \Carbon\Carbon::parse($to)->endOfDay(),
            ])
            ->selectRaw('SUM((products_orders.price - products.cost_price) * products_orders.quantity) as p')
            ->value('p');
    }

    private function fmt(float $value): string
    {
        return number_format($value, 2) . ' ج.م';
    }
}
