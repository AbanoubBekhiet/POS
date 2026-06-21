import { useState } from 'react'
import { Badge } from '../../../shared/components'
import { Trash2, ChevronDown } from 'lucide-react'

const statusMap = {
    completed:  { variant: 'success', label: 'مكتمل' },
    processing: { variant: 'info',    label: 'قيد المعالجة' },
    pending:    { variant: 'warning', label: 'معلق' },
    cancelled:  { variant: 'danger',  label: 'ملغي' },
    delivered:  { variant: 'success', label: 'تم التوصيل' },
}

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'delivered', 'cancelled']

export default function OrderRow({ order, onStatusChange, onDelete }) {
    const [showStatusMenu, setShowStatusMenu] = useState(false)
    const status = statusMap[order.status] || statusMap.pending

    return (
        <>
            {/* Desktop Row */}
            <tr
                className="hidden sm:table-row transition-colors group text-right"
                style={{ borderBottom: '1px solid #FAF9F6' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAF9F6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                dir="rtl"
            >
                <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold" style={{ color: '#2E5A44' }}>{order.id}</span>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-3 justify-start">
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
                <td className="px-6 py-4 text-sm text-right" style={{ color: '#7C7870' }}>{order.items} منتجات</td>
                <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: '#1A2D23' }}>{order.total}</td>
                <td className="px-6 py-4 text-right">
                    {/* Status dropdown */}
                    {onStatusChange ? (
                        <div className="relative inline-block">
                            <button
                                onClick={() => setShowStatusMenu(!showStatusMenu)}
                                className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors hover:opacity-80"
                                style={{ borderColor: '#EAE8E2' }}
                            >
                                <Badge variant={status.variant} dot>{status.label}</Badge>
                                <ChevronDown className="w-3 h-3 text-[#9A978F]" />
                            </button>
                            {showStatusMenu && (
                                <div
                                    className="absolute top-full mt-1 right-0 bg-white border border-[#EAE8E2] rounded-xl shadow-xl z-10 min-w-[140px] overflow-hidden"
                                    onBlur={() => setShowStatusMenu(false)}
                                >
                                    {STATUS_OPTIONS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                onStatusChange(s)
                                                setShowStatusMenu(false)
                                            }}
                                            className="w-full text-right px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#FAF9F6]"
                                            style={{
                                                color: s === order.status ? '#2E5A44' : '#5C5950',
                                                backgroundColor: s === order.status ? '#EEF4F1' : 'transparent',
                                            }}
                                        >
                                            {statusMap[s]?.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Badge variant={status.variant} dot>{status.label}</Badge>
                    )}
                </td>
                <td className="px-6 py-4 text-sm text-right" style={{ color: '#B8B5AE' }}>{order.date}</td>
                <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-1.5 rounded-lg transition-colors hover:bg-[#FDEEEC] hover:text-[#C0392B]"
                                title="حذف الطلب"
                            >
                                <Trash2 className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Mobile Card */}
            <div
                className="sm:hidden p-4 text-right"
                style={{ borderBottom: '1px solid #EAE8E2' }}
                dir="rtl"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: 'linear-gradient(135deg, #D5E6DC, #ADCBBB)', color: '#1A2D23' }}
                        >
                            {order.customer.charAt(0)}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold" style={{ color: '#3C3A33' }}>{order.customer}</p>
                            <p className="text-xs" style={{ color: '#B8B5AE' }}>{order.id} · {order.date}</p>
                        </div>
                    </div>
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="p-1.5 rounded-lg hover:bg-[#FDEEEC] transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-[#B8B5AE]" />
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-between mt-3 flex-row-reverse">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.total}</span>
                        <span className="text-xs" style={{ color: '#B8B5AE' }}>{order.items} منتجات</span>
                    </div>
                    <Badge variant={status.variant} dot>{status.label}</Badge>
                </div>
            </div>
        </>
    )
}
