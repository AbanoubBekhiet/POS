import { useState } from 'react'
import CartItem from './CartItem'
import { Button } from '../../../shared/components'
import { ShoppingBag, CreditCard, Banknote, Trash2, User, Pause } from 'lucide-react'

export default function Cart({ items, onIncrement, onDecrement, onRemove, onClear, onCheckout, onHold }) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const [selectedCustomer, setSelectedCustomer] = useState('cash')

    const customers = [
        { id: 'cash', name: 'عميل نقدي (افتراضي)' },
        { id: 'c1',   name: 'مشتل الوادي الأخضر' },
        { id: 'c2',   name: 'مزرعة الروابي الزراعية' },
        { id: 'c3',   name: 'مؤسسة زهور الريف' },
        { id: 'c4',   name: 'تنسيق حدائق الشروق' },
    ]

    return (
        <div className="bg-white rounded-2xl border border-[#EAE8E2] flex flex-col h-full text-right" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE8E2]">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#2E5A44]" />
                    <h2 className="text-base font-bold text-[#1A2D23]">الطلب الحالي</h2>
                    {items.length > 0 && (
                        <span className="mr-1 px-2.5 py-0.5 rounded-full bg-[#D5E6DC] text-[#2E5A44] text-xs font-bold">
                            {items.reduce((sum, i) => sum + i.quantity, 0)} عناصر
                        </span>
                    )}
                </div>
                {items.length > 0 && (
                    <button
                        onClick={onClear}
                        className="p-2 rounded-lg hover:bg-[#FDEEEC] text-[#9A978F] hover:text-[#C0392B] transition-colors"
                        title="تفريغ السلة"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Customer Selector */}
            <div className="p-3 border-b border-[#FAF9F6] bg-[#FAF9F6]/50">
                <div className="relative">
                    <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full pl-8 pr-10 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none appearance-none cursor-pointer"
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E0DA',
                            color: '#3C3A33',
                        }}
                    >
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9A978F] pointer-events-none" />
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-3">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#FAF9F6] flex items-center justify-center mb-3 border border-[#EAE8E2]">
                            <ShoppingBag className="w-8 h-8 text-[#FAF9F6]/80" style={{ stroke: '#B8B5AE' }} />
                        </div>
                        <p className="text-sm font-bold text-[#5C5950]">السلة فارغة حالياً</p>
                        <p className="text-xs text-[#9A978F] mt-1">اختر المنتجات لإضافتها للطلب</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrement={onIncrement}
                                onDecrement={onDecrement}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
                <div className="border-t border-[#EAE8E2] p-5 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between flex-row-reverse">
                            <span className="text-base font-bold text-[#1A2D23]">الإجمالي الكلي</span>
                            <span className="text-xl font-bold text-[#2E5A44]">{total.toFixed(2)} ج</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <button
                            onClick={() => onHold?.(selectedCustomer)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 bg-[#FAF9F6] border border-[#D6D4CE] text-[#5C5950] hover:bg-[#EAE8E2] active:scale-95"
                        >
                            <Pause className="w-3.5 h-3.5" />
                            تعليق السلة الحالية
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
