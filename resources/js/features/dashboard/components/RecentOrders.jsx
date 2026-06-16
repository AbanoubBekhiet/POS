import { Badge } from '../../../shared/components'
import { MoreHorizontal } from 'lucide-react'

const orders = [
    { id: '#ORD-2847', customer: 'Ahmed Hassan',   items: 3, total: '$42.50', status: 'completed', time: '5 min ago'  },
    { id: '#ORD-2846', customer: 'Sara Ali',        items: 2, total: '$28.00', status: 'processing', time: '12 min ago' },
    { id: '#ORD-2845', customer: 'Mohamed Youssef', items: 5, total: '$67.80', status: 'completed', time: '25 min ago' },
    { id: '#ORD-2844', customer: 'Fatma Ibrahim',   items: 1, total: '$12.99', status: 'pending',   time: '32 min ago' },
    { id: '#ORD-2843', customer: 'Omar Khaled',     items: 4, total: '$55.20', status: 'cancelled', time: '1 hr ago'   },
]

const statusMap = {
    completed:  { variant: 'success', label: 'Completed'  },
    processing: { variant: 'info',    label: 'Processing' },
    pending:    { variant: 'warning', label: 'Pending'    },
    cancelled:  { variant: 'danger',  label: 'Cancelled'  },
}

export default function RecentOrders() {
    return (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6" style={{ borderBottom: '1px solid #EAE8E2' }}>
                <div>
                    <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>Recent Orders</h3>
                    <p className="text-sm mt-0.5" style={{ color: '#9A978F' }}>Latest transactions overview</p>
                </div>
                <button className="text-sm font-semibold transition-colors" style={{ color: '#2E5A44' }}
                    onMouseEnter={e => e.target.style.color = '#1A2D23'}
                    onMouseLeave={e => e.target.style.color = '#2E5A44'}
                >
                    View All
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr style={{ borderBottom: '1px solid #F4F3EF' }}>
                            {['Order ID','Customer','Items','Total','Status','Time',''].map(h => (
                                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-3" style={{ color: '#B8B5AE' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, i) => (
                            <tr
                                key={order.id}
                                className="transition-colors animate-fade-in group"
                                style={{ borderBottom: '1px solid #FAF9F6' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF9F6'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                {...{ style: { animationDelay: `${i * 50}ms` } }}
                            >
                                <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#2E5A44' }}>{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #ADCBBB, #7FAF98)', color: '#1A2D23' }}>
                                            {order.customer.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: '#3C3A33' }}>{order.customer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#7C7870' }}>{order.items} items</td>
                                <td className="px-6 py-4 text-sm font-bold" style={{ color: '#1A2D23' }}>{order.total}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={statusMap[order.status].variant} dot>{statusMap[order.status].label}</Badge>
                                </td>
                                <td className="px-6 py-4 text-sm" style={{ color: '#B8B5AE' }}>{order.time}</td>
                                <td className="px-6 py-4">
                                    <button className="p-1.5 rounded-lg transition-colors hover:bg-[#EAE8E2]">
                                        <MoreHorizontal className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y" style={{ borderColor: '#EAE8E2' }}>
                {orders.map((order) => (
                    <div key={order.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #ADCBBB, #7FAF98)', color: '#1A2D23' }}>
                                {order.customer.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: '#3C3A33' }}>{order.customer}</p>
                                <p className="text-xs" style={{ color: '#B8B5AE' }}>{order.id} · {order.items} items</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.total}</p>
                            <Badge variant={statusMap[order.status].variant} className="mt-1">{statusMap[order.status].label}</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
