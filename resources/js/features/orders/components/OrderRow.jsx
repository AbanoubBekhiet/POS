import { Trash2, Eye, Tag, RotateCcw, Printer } from 'lucide-react'

export default function OrderRow({ order, onDelete, onDetails, onDiscount, onReturn, onPrint }) {
    const hasDiscount = order.discount > 0
    const returnBadge = order.return_status === 'full'
        ? { label: 'مُرجع كلياً', bg: '#FEF3C7', color: '#92400E' }
        : order.return_status === 'partial'
        ? { label: 'مرتجع جزئي', bg: '#FFEDD5', color: '#9A3412' }
        : null

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
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #D5E6DC, #ADCBBB)', color: '#1A2D23' }}>
                            {order.customer.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium" style={{ color: '#3C3A33' }}>{order.customer}</p>
                            {returnBadge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: returnBadge.bg, color: returnBadge.color }}>
                                    {returnBadge.label}
                                </span>
                            )}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-right" style={{ color: '#7C7870' }}>{order.items} منتجات</td>
                <td className="px-6 py-4 text-right">
                    <div>
                        <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.net_total}</span>
                        {hasDiscount && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <Tag className="w-3 h-3 text-orange-400" />
                                <span className="text-[11px] text-orange-500 line-through">{order.total}</span>
                                <span className="text-[11px] text-orange-500">- {order.discount.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-right" style={{ color: '#B8B5AE' }}>{order.date}</td>
                <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onDetails} title="تفاصيل الطلب"
                            className="p-1.5 rounded-lg transition-colors hover:bg-[#EEF4F1]">
                            <Eye className="w-4 h-4" style={{ color: '#2E5A44' }} />
                        </button>
                        <button onClick={onDiscount} title="تطبيق خصم"
                            className="p-1.5 rounded-lg transition-colors hover:bg-orange-50">
                            <Tag className="w-4 h-4 text-orange-400" />
                        </button>
                        <button onClick={onReturn} title="تسجيل مرتجع"
                            className="p-1.5 rounded-lg transition-colors hover:bg-amber-50">
                            <RotateCcw className="w-4 h-4 text-amber-500" />
                        </button>
                        <button onClick={onPrint} title="طباعة"
                            className="p-1.5 rounded-lg transition-colors hover:bg-[#EEF4F1]">
                            <Printer className="w-4 h-4" style={{ color: '#7C7870' }} />
                        </button>
                        {onDelete && (
                            <button onClick={onDelete} title="حذف الطلب"
                                className="p-1.5 rounded-lg transition-colors hover:bg-[#FDEEEC] hover:text-[#C0392B]">
                                <Trash2 className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Mobile Card */}
            <div className="sm:hidden p-4 text-right" style={{ borderBottom: '1px solid #EAE8E2' }} dir="rtl">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #D5E6DC, #ADCBBB)', color: '#1A2D23' }}>
                            {order.customer.charAt(0)}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold" style={{ color: '#3C3A33' }}>{order.customer}</p>
                            <p className="text-xs" style={{ color: '#B8B5AE' }}>{order.id} · {order.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onDetails} className="p-1.5 rounded-lg hover:bg-[#EEF4F1] transition-colors"><Eye className="w-4 h-4" style={{ color: '#2E5A44' }} /></button>
                        {onDelete && <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-[#FDEEEC] transition-colors"><Trash2 className="w-4 h-4 text-[#B8B5AE]" /></button>}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <div>
                        <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>{order.net_total}</span>
                        {hasDiscount && <span className="text-xs text-orange-500 line-through mr-1">{order.total}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        {returnBadge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: returnBadge.bg, color: returnBadge.color }}>{returnBadge.label}</span>}
                        <span className="text-xs" style={{ color: '#B8B5AE' }}>{order.items} منتجات</span>
                    </div>
                </div>
            </div>
        </>
    )
}
