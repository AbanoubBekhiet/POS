import { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput, Button, StatCard } from '../../shared/components'
import OrderRow from './components/OrderRow'
import StatusFilter from './components/StatusFilter'
import { Download, DollarSign, CheckCircle2, AlertCircle, ShoppingBag, X } from 'lucide-react'

const STATUS_OPTIONS = [
    { value: 'all',        label: 'كل الطلبات' },
    { value: 'pending',    label: 'معلق' },
    { value: 'processing', label: 'قيد المعالجة' },
    { value: 'completed',  label: 'مكتمل' },
    { value: 'delivered',  label: 'تم التوصيل' },
    { value: 'cancelled',  label: 'ملغي' },
]

export default function OrdersIndex({
    orders = { data: [], current_page: 1, next_page: null },
    stats = { today_total: '0.00 ج.م', completed_today: 0, pending_count: 0, total_orders: 0 },
    filters = {},
}) {
    const { flash } = usePage().props
    const [alert, setAlert] = useState(null)

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
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all')

    // Backend filtering
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {}
            if (search) params.search = search
            if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus

            router.get('/orders', params, { preserveState: true, replace: true })
        }, 300)
        return () => clearTimeout(timer)
    }, [search, selectedStatus])

    const handleStatusChange = (orderId, newStatus) => {
        router.put(`/orders/${orderId}`, { status: newStatus }, { preserveScroll: true })
    }

    const handleDelete = (orderId) => {
        if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            router.delete(`/orders/${orderId}`, { preserveScroll: true })
        }
    }

    const statuses = STATUS_OPTIONS.map(s => ({
        ...s,
        count: s.value === 'all'
            ? orders.data.length
            : orders.data.filter(o => o.status === s.value).length
    }))

    const thStyle = { color: '#B8B5AE', borderBottom: '1px solid #EAE8E2', backgroundColor: '#FAF9F6' }

    return (
        <AppLayout title="إدارة الطلبات" subtitle="متابعة وإدارة جميع معاملات المبيعات">
            {/* Flash Alert */}
            {alert && (
                <div
                    className="p-4 rounded-xl text-sm font-semibold border transition-all animate-fade-in relative flex items-center justify-between gap-4 mb-6"
                    style={{
                        backgroundColor: alert.type === 'success' ? '#EBF5EF' : '#FDEEEC',
                        borderColor: alert.type === 'success' ? '#ADCBBB' : '#E8A09A',
                        color: alert.type === 'success' ? '#2E5A44' : '#922B21'
                    }}
                    dir="rtl"
                >
                    <span className="flex-1 text-right">{alert.message}</span>
                    <button onClick={() => setAlert(null)} className="opacity-70 hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
                <StatCard title="مبيعات اليوم" value={stats.today_total} icon={DollarSign} color="green" />
                <StatCard title="طلبات مكتملة اليوم" value={`${stats.completed_today} طلب`} icon={CheckCircle2} color="teal" />
                <StatCard title="طلبات معلقة" value={`${stats.pending_count} طلب`} icon={AlertCircle} color="amber" />
                <StatCard title="إجمالي الطلبات" value={`${stats.total_orders} طلب`} icon={ShoppingBag} color="green" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6 text-right" dir="rtl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <SearchInput
                        placeholder="البحث عن الطلبات..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:w-72"
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" icon={Download}>تصدير</Button>
                    </div>
                </div>
                <StatusFilter statuses={statuses} selected={selectedStatus} onChange={setSelectedStatus} />
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden text-right" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }} dir="rtl">
                {/* Desktop */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr style={thStyle}>
                                {['معرف الطلب', 'العميل', 'العناصر', 'الإجمالي', 'الحالة', 'التاريخ', ''].map(h => (
                                    <th key={h} className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: '#B8B5AE' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-sm font-semibold text-[#9A978F]">
                                        لا توجد طلبات مطابقة للبحث
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map(order => (
                                    <OrderRow
                                        key={order.raw_id}
                                        order={order}
                                        onStatusChange={(newStatus) => handleStatusChange(order.raw_id, newStatus)}
                                        onDelete={() => handleDelete(order.raw_id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="sm:hidden">
                    {orders.data.map(order => (
                        <OrderRow
                            key={order.raw_id}
                            order={order}
                            onStatusChange={(newStatus) => handleStatusChange(order.raw_id, newStatus)}
                            onDelete={() => handleDelete(order.raw_id)}
                        />
                    ))}
                    {orders.data.length === 0 && (
                        <div className="p-8 text-center text-sm font-semibold text-[#9A978F]">لا توجد طلبات</div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #EAE8E2' }}>
                    <p className="text-sm" style={{ color: '#9A978F' }}>
                        عرض <span className="font-semibold" style={{ color: '#1A2D23' }}>{orders.data.length}</span> طلب
                    </p>
                    {orders.next_page && (
                        <button
                            onClick={() => {
                                const params = { page: orders.next_page }
                                if (search) params.search = search
                                if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus
                                router.get('/orders', params, { preserveState: true, preserveScroll: true })
                            }}
                            className="px-4 py-1.5 text-sm rounded-lg border font-semibold transition-colors hover:bg-[#EEF4F1]"
                            style={{ borderColor: '#2E5A44', color: '#2E5A44' }}
                        >
                            تحميل المزيد
                        </button>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
