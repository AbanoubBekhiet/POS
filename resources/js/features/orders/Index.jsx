import { useState, useEffect, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput } from '../../shared/components'
import OrderRow from './components/OrderRow'
import OrderDetailsModal from './components/OrderDetailsModal'
import DiscountModal from './components/DiscountModal'
import ReturnModal from './components/ReturnModal'
import { X } from 'lucide-react'

// Print helper (no details needed — just what we have in the row)
function printOrder(order) {
    const rows = (order.products || []).map(p => `
        <tr>
            <td style="padding:6px 4px;border-bottom:1px solid #eee">${p.name}</td>
            <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:center">${p.quantity}</td>
            <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:left">${p.price.toFixed(2)}</td>
            <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:left">${p.total_price.toFixed(2)}</td>
        </tr>`).join('')
    const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>طباعة الطلب</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:13px;padding:20px;color:#111}
    h2{text-align:center;margin-bottom:4px;font-size:16px}p.sub{text-align:center;color:#666;margin-bottom:14px;font-size:11px}
    table{width:100%;border-collapse:collapse}th{background:#f5f5f5;padding:6px 4px;text-align:right;font-size:11px}
    .totals{margin-top:12px;border-top:1.5px solid #111;padding-top:8px}
    .totals div{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
    .totals .net{font-weight:bold;font-size:14px;margin-top:6px;border-top:1px solid #ccc;padding-top:6px}</style>
    </head><body>
    <h2>فاتورة طلب</h2>
    <p class="sub">${order.id} · ${order.date} · ${order.customer}</p>
    ${rows ? `<table><thead><tr><th>المنتج</th><th style="text-align:center">الكمية</th><th style="text-align:left">السعر</th><th style="text-align:left">الإجمالي</th></tr></thead><tbody>${rows}</tbody></table>` : ''}
    <div class="totals">
        <div><span>الإجمالي</span><span>${order.total}</span></div>
        ${order.discount > 0 ? `<div><span>الخصم</span><span>- ${order.discount.toFixed(2)} ج.م</span></div>` : ''}
        <div class="net"><span>الصافي</span><span>${order.net_total}</span></div>
    </div></body></html>`
    const w = window.open('', '_blank', 'width=400,height=600')
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 300)
}

export default function OrdersIndex({
    orders = { data: [], current_page: 1, next_page: null },
    filters = {},
}) {
    const { flash } = usePage().props
    const [alert, setAlert] = useState(null)

    // Modals
    const [detailsOrder, setDetailsOrder] = useState(null)      // full order with products
    const [discountOrder, setDiscountOrder] = useState(null)    // row-level data
    const [returnOrder, setReturnOrder] = useState(null)        // full order with products

    const [loadingDetails, setLoadingDetails] = useState(false)

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success })
            const t = setTimeout(() => setAlert(null), 4000)
            return () => clearTimeout(t)
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error })
            const t = setTimeout(() => setAlert(null), 8000)
            return () => clearTimeout(t)
        }
    }, [flash])

    const [search, setSearch] = useState(filters?.search || '')

    // Infinite Scroll
    const [loadedOrders, setLoadedOrders] = useState(orders.data || [])
    const [nextPage, setNextPage] = useState(orders.next_page)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadMoreRef = useRef(null)

    useEffect(() => {
        if (orders.current_page === 1) {
            setLoadedOrders(orders.data || [])
        } else {
            setLoadedOrders(prev => {
                const existingIds = new Set(prev.map(o => o.raw_id))
                const newItems = (orders.data || []).filter(o => !existingIds.has(o.raw_id))
                return [...prev, ...newItems]
            })
        }
        setNextPage(orders.next_page)
        setIsLoadingMore(false)
    }, [orders])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get('/orders', { search }, { preserveState: true, replace: true })
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const loadMore = () => {
        if (!nextPage || isLoadingMore) return
        setIsLoadingMore(true)
        const queryParams = { page: nextPage }
        if (search) queryParams.search = search
        router.get('/orders', queryParams, { preserveState: true, preserveScroll: true, only: ['orders'] })
    }

    useEffect(() => {
        if (!nextPage || isLoadingMore) return
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore()
        }, { threshold: 0.1 })
        if (loadMoreRef.current) observer.observe(loadMoreRef.current)
        return () => { if (loadMoreRef.current) observer.unobserve(loadMoreRef.current) }
    }, [nextPage, isLoadingMore, search])

    // Fetch full order details (products + returns)
    const openDetails = async (order) => {
        setLoadingDetails(true)
        try {
            const res = await fetch(`/orders/${order.raw_id}`, { headers: { Accept: 'application/json' } })
            const json = await res.json()
            setDetailsOrder(json.order)
        } catch {
            setAlert({ type: 'error', message: 'تعذر تحميل تفاصيل الطلب' })
        } finally {
            setLoadingDetails(false)
        }
    }

    const openReturn = async (order) => {
        setLoadingDetails(true)
        try {
            const res = await fetch(`/orders/${order.raw_id}`, { headers: { Accept: 'application/json' } })
            const json = await res.json()
            setReturnOrder(json.order)
        } catch {
            setAlert({ type: 'error', message: 'تعذر تحميل بيانات الطلب' })
        } finally {
            setLoadingDetails(false)
        }
    }

    const handleDelete = (orderId) => {
        if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            router.delete(`/orders/${orderId}`, { preserveScroll: true })
        }
    }

    const thStyle = { color: '#B8B5AE', borderBottom: '1px solid #EAE8E2', backgroundColor: '#FAF9F6' }

    return (
        <AppLayout title="إدارة الطلبات" subtitle="متابعة وإدارة جميع معاملات المبيعات">
            {/* Modals */}
            {detailsOrder && (
                <OrderDetailsModal
                    order={detailsOrder}
                    onClose={() => setDetailsOrder(null)}
                    onDiscount={(o) => setDiscountOrder(o)}
                    onReturn={(o) => setReturnOrder(o)}
                />
            )}
            {discountOrder && <DiscountModal order={discountOrder} onClose={() => setDiscountOrder(null)} />}
            {returnOrder && <ReturnModal order={returnOrder} onClose={() => setReturnOrder(null)} />}

            {/* Loading overlay */}
            {loadingDetails && (
                <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div className="w-8 h-8 border-2 border-[#2E5A44] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Flash Alert */}
            {alert && (
                <div className="p-4 rounded-xl text-sm font-semibold border transition-all relative flex items-center justify-between gap-4 mb-6"
                    style={{ backgroundColor: alert.type === 'success' ? '#EBF5EF' : '#FDEEEC', borderColor: alert.type === 'success' ? '#ADCBBB' : '#E8A09A', color: alert.type === 'success' ? '#2E5A44' : '#922B21' }}
                    dir="rtl">
                    <span className="flex-1 text-right">{alert.message}</span>
                    <button onClick={() => setAlert(null)} className="opacity-70 hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex mb-6" dir="rtl">
                <SearchInput placeholder="البحث عن الطلبات..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:w-72" />
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden text-right mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }} dir="rtl">
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr style={thStyle}>
                                {['معرف الطلب', 'العميل', 'العناصر', 'الإجمالي', 'التاريخ', ''].map(h => (
                                    <th key={h} className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: '#B8B5AE' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loadedOrders.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-sm font-semibold text-[#9A978F]">لا توجد طلبات مطابقة للبحث</td></tr>
                            ) : (
                                loadedOrders.map(order => (
                                    <OrderRow
                                        key={order.raw_id}
                                        order={order}
                                        onDetails={() => openDetails(order)}
                                        onDiscount={() => setDiscountOrder(order)}
                                        onReturn={() => openReturn(order)}
                                        onPrint={() => printOrder(order)}
                                        onDelete={() => handleDelete(order.raw_id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="sm:hidden">
                    {loadedOrders.map(order => (
                        <OrderRow
                            key={order.raw_id}
                            order={order}
                            onDetails={() => openDetails(order)}
                            onDiscount={() => setDiscountOrder(order)}
                            onReturn={() => openReturn(order)}
                            onPrint={() => printOrder(order)}
                            onDelete={() => handleDelete(order.raw_id)}
                        />
                    ))}
                    {loadedOrders.length === 0 && <div className="p-8 text-center text-sm font-semibold text-[#9A978F]">لا توجد طلبات</div>}
                </div>

                <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #EAE8E2' }}>
                    <p className="text-sm" style={{ color: '#9A978F' }}>
                        عرض <span className="font-semibold" style={{ color: '#1A2D23' }}>{loadedOrders.length}</span> طلب
                    </p>
                </div>
            </div>

            {nextPage && (
                <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                    <div className="w-6 h-6 border-2 border-[#2E5A44] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </AppLayout>
    )
}
