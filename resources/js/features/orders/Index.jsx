import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput, Button } from '../../shared/components'
import OrderRow from './components/OrderRow'
import StatusFilter from './components/StatusFilter'
import { Download, Filter } from 'lucide-react'

const sampleOrders = [
    { id: '#ORD-2847', customer: 'Ahmed Hassan',   email: 'ahmed@email.com',   items: 3, total: '$42.50', status: 'completed',  date: 'Jun 15, 2026' },
    { id: '#ORD-2846', customer: 'Sara Ali',        email: 'sara@email.com',    items: 2, total: '$28.00', status: 'processing', date: 'Jun 15, 2026' },
    { id: '#ORD-2845', customer: 'Mohamed Youssef', email: 'mohamed@email.com', items: 5, total: '$67.80', status: 'completed',  date: 'Jun 14, 2026' },
    { id: '#ORD-2844', customer: 'Fatma Ibrahim',   email: 'fatma@email.com',   items: 1, total: '$12.99', status: 'pending',    date: 'Jun 14, 2026' },
    { id: '#ORD-2843', customer: 'Omar Khaled',     email: 'omar@email.com',    items: 4, total: '$55.20', status: 'cancelled',  date: 'Jun 13, 2026' },
    { id: '#ORD-2842', customer: 'Nour Mahmoud',    email: 'nour@email.com',    items: 2, total: '$31.00', status: 'delivered',  date: 'Jun 13, 2026' },
    { id: '#ORD-2841', customer: 'Yara Sayed',      email: 'yara@email.com',    items: 6, total: '$89.40', status: 'completed',  date: 'Jun 12, 2026' },
    { id: '#ORD-2840', customer: 'Karim Adel',      email: 'karim@email.com',   items: 3, total: '$45.00', status: 'processing', date: 'Jun 12, 2026' },
]

const buildStatuses = (orders) => [
    { value: 'all',        label: 'All Orders',  count: orders.length },
    { value: 'pending',    label: 'Pending',     count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'Processing',  count: orders.filter(o => o.status === 'processing').length },
    { value: 'completed',  label: 'Completed',   count: orders.filter(o => o.status === 'completed').length },
    { value: 'delivered',  label: 'Delivered',   count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled',  label: 'Cancelled',   count: orders.filter(o => o.status === 'cancelled').length },
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
        <AppLayout title="Orders" subtitle="Manage and track all your orders">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <SearchInput
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:w-72"
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" icon={Filter}>Filters</Button>
                        <Button variant="secondary" icon={Download}>Export</Button>
                    </div>
                </div>
                <StatusFilter statuses={buildStatuses(sampleOrders)} selected={selectedStatus} onChange={setSelectedStatus} />
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }}>
                {/* Desktop */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={thStyle}>
                                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: '#B8B5AE' }}>{h}</th>
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
                        Showing <span className="font-semibold" style={{ color: '#1A2D23' }}>{filtered.length}</span> orders
                    </p>
                    <div className="flex items-center gap-1">
                        {['Prev', '1', '2', '3', 'Next'].map((p, i) => (
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
