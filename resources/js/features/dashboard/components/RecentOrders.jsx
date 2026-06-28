import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { Eye, Tag, RotateCcw, Printer, Trash2 } from 'lucide-react'
import OrderDetailsModal from '../../orders/components/OrderDetailsModal'
import DiscountModal from '../../orders/components/DiscountModal'
import ReturnModal from '../../orders/components/ReturnModal'

function printOrder(order) {
    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>فاتورة طلب</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:13px;padding:20px;color:#111}
    h2{text-align:center;margin-bottom:4px;font-size:16px}p.sub{text-align:center;color:#666;margin-bottom:14px;font-size:11px}
    .totals{margin-top:12px;border-top:1.5px solid #111;padding-top:8px}
    .totals div{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
    .net{font-weight:bold;font-size:14px;margin-top:6px;border-top:1px solid #ccc;padding-top:6px}</style>
    </head><body>
    <h2>فاتورة طلب</h2>
    <p class="sub">${order.id} · ${order.date} · ${order.customer}</p>
    <div class="totals">
        <div><span>الإجمالي</span><span>${order.total}</span></div>
        ${order.discount > 0 ? `<div><span>الخصم</span><span>- ${order.discount.toFixed(2)} ج.م</span></div>` : ''}
        <div class="net"><span>الصافي</span><span>${order.net_total}</span></div>
    </div></body></html>`
    const w = window.open('', '_blank', 'width=400,height=400')
    w.document.write(html); w.document.close(); w.focus()
    setTimeout(() => { w.print(); w.close() }, 300)
}

const returnBadgeFor = (status) =>
    status === 'full'    ? { label: 'مُرجع كلياً',   bg: '#FEF3C7', color: '#92400E' } :
    status === 'partial' ? { label: 'مرتجع جزئي', bg: '#FFEDD5', color: '#9A3412' } : null

export default function RecentOrders({ recentOrders = [] }) {
    const [detailsOrder, setDetailsOrder] = useState(null)
    const [discountOrder, setDiscountOrder] = useState(null)
    const [returnOrder, setReturnOrder] = useState(null)
    const [loadingId, setLoadingId] = useState(null)

    const fetchFull = async (order, callback) => {
        setLoadingId(order.raw_id)
        try {
            const res = await fetch(`/orders/${order.raw_id}`, { headers: { Accept: 'application/json' } })
            const json = await res.json()
            callback(json.order)
        } catch { /* silent */ } finally {
            setLoadingId(null)
        }
    }

    const handleDelete = (orderId) => {
        if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            router.delete(`/orders/${orderId}`, { preserveScroll: true })
        }
    }

    return (
        <>
            {detailsOrder && (
                <OrderDetailsModal
                    order={detailsOrder}
                    onClose={() => setDetailsOrder(null)}
                    onDiscount={(o) => { setDetailsOrder(null); setDiscountOrder(o) }}
                    onReturn={(o)   => { setDetailsOrder(null); setReturnOrder(o) }}
                />
            )}
            {discountOrder && <DiscountModal order={discountOrder} onClose={() => setDiscountOrder(null)} />}
            {returnOrder   && <ReturnModal   order={returnOrder}   onClose={() => setReturnOrder(null)} />}

            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6" style={{ borderBottom: '1px solid #EAE8E2' }}>
                    <div className="text-right">
                        <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>أحدث الطلبات</h3>
                        <p className="text-sm mt-0.5" style={{ color: '#9A978F' }}>آخر {recentOrders.length} معاملة</p>
                    </div>
                    <Link href="/orders" className="text-sm font-semibold transition-colors" style={{ color: '#2E5A44' }}
                        onMouseEnter={e => e.target.style.color = '#1A2D23'}
                        onMouseLeave={e => e.target.style.color = '#2E5A44'}>
                        عرض الكل
                    </Link>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead>
                            <tr style={{ borderBottom: '1px solid #F4F3EF' }}>
                                {['معرف الطلب', 'العميل', 'العناصر', 'الإجمالي', 'التاريخ', ''].map(h => (
                                    <th key={h} className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: '#B8B5AE' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-sm font-semibold" style={{ color: '#9A978F' }}>لا توجد طلبات حتى الآن</td></tr>
                            ) : recentOrders.map((order, i) => {
                                const badge = returnBadgeFor(order.return_status)
                                const isLoading = loadingId === order.raw_id
                                return (
                                    <tr key={order.raw_id}
                                        className="transition-colors animate-fade-in group"
                                        style={{ borderBottom: '1px solid #FAF9F6', animationDelay: `${i * 50}ms` }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF9F6'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#2E5A44' }}>{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #ADCBBB, #7FAF98)', color: '#1A2D23' }}>
                                                    {order.customer.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium" style={{ color: '#3C3A33' }}>{order.customer}</span>
                                                    {badge && <div><span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span></div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm" style={{ color: '#7C7870' }}>{order.items} منتجات</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.net_total}</span>
                                            {order.discount > 0 && <div className="text-[11px] text-orange-500 line-through">{order.total}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm" style={{ color: '#B8B5AE' }}>{order.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => fetchFull(order, setDetailsOrder)} title="تفاصيل"
                                                    className="p-1.5 rounded-lg hover:bg-[#EEF4F1] transition-colors" disabled={isLoading}>
                                                    {isLoading ? <div className="w-3.5 h-3.5 border border-[#2E5A44] border-t-transparent rounded-full animate-spin" /> : <Eye className="w-3.5 h-3.5" style={{ color: '#2E5A44' }} />}
                                                </button>
                                                <button onClick={() => setDiscountOrder(order)} title="خصم"
                                                    className="p-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                                                    <Tag className="w-3.5 h-3.5 text-orange-400" />
                                                </button>
                                                <button onClick={() => fetchFull(order, setReturnOrder)} title="مرتجع"
                                                    className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors" disabled={isLoading}>
                                                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                                                </button>
                                                <button onClick={() => printOrder(order)} title="طباعة"
                                                    className="p-1.5 rounded-lg hover:bg-[#EEF4F1] transition-colors">
                                                    <Printer className="w-3.5 h-3.5" style={{ color: '#7C7870' }} />
                                                </button>
                                                <button onClick={() => handleDelete(order.raw_id)} title="حذف"
                                                    className="p-1.5 rounded-lg hover:bg-[#FDEEEC] transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" style={{ color: '#B8B5AE' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="sm:hidden divide-y text-right" style={{ borderColor: '#EAE8E2' }} dir="rtl">
                    {recentOrders.map((order) => {
                        const badge = returnBadgeFor(order.return_status)
                        return (
                            <div key={order.raw_id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #ADCBBB, #7FAF98)', color: '#1A2D23' }}>
                                        {order.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: '#3C3A33' }}>{order.customer}</p>
                                        <p className="text-xs" style={{ color: '#B8B5AE' }}>{order.id} · {order.items} منتجات</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-left">
                                        <p className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.net_total}</p>
                                        {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span>}
                                    </div>
                                    <button onClick={() => fetchFull(order, setDetailsOrder)}
                                        className="p-1.5 rounded-lg hover:bg-[#EEF4F1] transition-colors">
                                        <Eye className="w-4 h-4" style={{ color: '#2E5A44' }} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                    {recentOrders.length === 0 && (
                        <div className="p-8 text-center text-sm font-semibold" style={{ color: '#9A978F' }}>لا توجد طلبات</div>
                    )}
                </div>
            </div>
        </>
    )
}
