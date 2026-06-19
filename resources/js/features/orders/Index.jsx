import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput, Button, StatCard } from '../../shared/components'
import OrderRow from './components/OrderRow'
import StatusFilter from './components/StatusFilter'
import { Download, Filter, DollarSign, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react'

const sampleOrders = [
    { id: '#ORD-2847', customer: 'أحمد حسن',   email: 'ahmed@email.com',   items: 3, total: '42.50 د.إ', status: 'completed',  date: '15 يونيو 2026' },
    { id: '#ORD-2846', customer: 'سارة علي',        email: 'sara@email.com',    items: 2, total: '28.00 د.إ', status: 'processing', date: '15 يونيو 2026' },
    { id: '#ORD-2845', customer: 'محمد يوسف', email: 'mohamed@email.com', items: 5, total: '67.80 د.إ', status: 'completed',  date: '14 يونيو 2026' },
    { id: '#ORD-2844', customer: 'فاطمة إبراهيم',   email: 'fatma@email.com',   items: 1, total: '12.99 د.إ', status: 'pending',    date: '14 يونيو 2026' },
    { id: '#ORD-2843', customer: 'عمر خالد',     email: 'omar@email.com',    items: 4, total: '55.20 د.إ', status: 'cancelled',  date: '13 يونيو 2026' },
    { id: '#ORD-2842', customer: 'نور محمود',    email: 'nour@email.com',    items: 2, total: '31.00 د.إ', status: 'delivered',  date: '13 يونيو 2026' },
    { id: '#ORD-2841', customer: 'يارا سيد',      email: 'yara@email.com',    items: 6, total: '89.40 د.إ', status: 'completed',  date: '12 يونيو 2026' },
    { id: '#ORD-2840', customer: 'كريم عادل',      email: 'karim@email.com',   items: 3, total: '45.00 د.إ', status: 'processing', date: '12 يونيو 2026' },
]

const buildStatuses = (orders) => [
    { value: 'all',        label: 'كل الطلبات',  count: orders.length },
    { value: 'pending',    label: 'معلق',     count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'قيد المعالجة',  count: orders.filter(o => o.status === 'processing').length },
    { value: 'completed',  label: 'مكتمل',   count: orders.filter(o => o.status === 'completed').length },
    { value: 'delivered',  label: 'تم التوصيل',   count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled',  label: 'ملغي',   count: orders.filter(o => o.status === 'cancelled').length },
]

export default function OrdersIndex() {
    const [search, setSearch]               = useState('')
    const [selectedStatus, setSelectedStatus] = useState('all')

    const filtered = sampleOrders.filter((o) => {
        const matchesSearch  = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
        const matchesStatus  = selectedStatus === 'all' || o.status === selectedStatus
        return matchesSearch && matchesStatus
    })

    const thStyle = { color: '#B8B5AE', borderBottom: '1px solid #EAE8E2', backgroundColor: '#FAF9F6' }

    return (
        <AppLayout title="إدارة الطلبات" subtitle="متابعة وإدارة جميع معاملات المبيعات بنقاط البيع">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
                <StatCard title="إجمالي مبيعات اليوم" value="1,840 د.إ" change={8.4} changeLabel="مقارنة بأمس" icon={DollarSign} color="green" />
                <StatCard title="طلبات مكتملة" value="45 طلب" change={12.1} changeLabel="مقارنة بأمس" icon={CheckCircle2} color="teal" />
                <StatCard title="طلبات معلقة" value="3 طلبات" change={-15} changeLabel="مقارنة بأمس" icon={AlertCircle} color="amber" />
                <StatCard title="إجمالي الطلبات" value="1,257 طلب" change={4.2} changeLabel="مقارنة بالشهر الماضي" icon={ShoppingBag} color="green" />
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
                        <Button variant="secondary" icon={Filter}>تصفية</Button>
                        <Button variant="secondary" icon={Download}>تصدير</Button>
                    </div>
                </div>
                <StatusFilter statuses={buildStatuses(sampleOrders)} selected={selectedStatus} onChange={setSelectedStatus} />
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
                            {filtered.map(order => <OrderRow key={order.id} order={order} />)}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="sm:hidden">
                    {filtered.map(order => <OrderRow key={order.id} order={order} />)}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #EAE8E2' }}>
                    <p className="text-sm" style={{ color: '#9A978F' }}>
                        عرض <span className="font-semibold" style={{ color: '#1A2D23' }}>{filtered.length}</span> طلبات
                    </p>
                    <div className="flex items-center gap-1">
                        {['التالي', '3', '2', '1', 'السابق'].map((p, i) => (
                            <button
                                key={p}
                                className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                                style={p === '1'
                                    ? { backgroundColor: '#2E5A44', color: '#fff' }
                                    : { border: '1px solid #D6D4CE', color: '#7C7870', backgroundColor: '#FFFFFF' }
                                }
                                onMouseEnter={e => { if (p !== '1') e.currentTarget.style.backgroundColor = '#EAE8E2' }}
                                onMouseLeave={e => { if (p !== '1') e.currentTarget.style.backgroundColor = '#FFFFFF' }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
