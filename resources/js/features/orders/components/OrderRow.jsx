import { Badge } from '../../../shared/components'
import { Eye, MoreHorizontal, Printer } from 'lucide-react'

const statusMap = {
    completed:  { variant: 'success', label: 'Completed'  },
    processing: { variant: 'info',    label: 'Processing' },
    pending:    { variant: 'warning', label: 'Pending'    },
    cancelled:  { variant: 'danger',  label: 'Cancelled'  },
    delivered:  { variant: 'success', label: 'Delivered'  },
}

export default function OrderRow({ order }) {
    const status = statusMap[order.status] || statusMap.pending

    return (
        <>
            {/* Desktop Row */}
            <tr
                className="hidden sm:table-row transition-colors group"
                style={{ borderBottom: '1px solid #FAF9F6' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF9F6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <td className="px-6 py-4">
                    <span className="text-sm font-semibold" style={{ color: '#2E5A44' }}>{order.id}</span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, #D5E6DC, #ADCBBB)', color: '#1A2D23' }}
                        >
                            {order.customer.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: '#3C3A33' }}>{order.customer}</p>
                            <p className="text-xs" style={{ color: '#B8B5AE' }}>{order.email}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: '#7C7870' }}>{order.items} items</td>
                <td className="px-6 py-4 text-sm font-bold" style={{ color: '#1A2D23' }}>{order.total}</td>
                <td className="px-6 py-4">
                    <Badge variant={status.variant} dot>{status.label}</Badge>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: '#B8B5AE' }}>{order.date}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {[Eye, Printer, MoreHorizontal].map((Icon, i) => (
                            <button key={i} className="p-1.5 rounded-lg transition-colors hover:bg-[#EAE8E2]">
                                <Icon className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                            </button>
                        ))}
                    </div>
                </td>
            </tr>

            {/* Mobile Card */}
            <div
                className="sm:hidden p-4"
                style={{ borderBottom: '1px solid #EAE8E2' }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #D5E6DC, #ADCBBB)', color: '#1A2D23' }}
                        >
                            {order.customer.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: '#3C3A33' }}>{order.customer}</p>
                            <p className="text-xs" style={{ color: '#B8B5AE' }}>{order.id} · {order.date}</p>
                        </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-[#EAE8E2] transition-colors">
                        <MoreHorizontal className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-3 ml-13">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.total}</span>
                        <span className="text-xs" style={{ color: '#B8B5AE' }}>{order.items} items</span>
                    </div>
                    <Badge variant={status.variant} dot>{status.label}</Badge>
                </div>
            </div>
        </>
    )
}
