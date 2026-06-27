import { useState } from 'react'
import { router } from '@inertiajs/react'
import { X, RotateCcw, AlertCircle, Package } from 'lucide-react'

export default function ReturnModal({ order, onClose }) {
    const [quantities, setQuantities] = useState({})
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const returnableProducts = (order.products || []).filter(p => p.available_qty > 0)

    const setQty = (productId, val) => {
        setQuantities(prev => ({ ...prev, [productId]: val }))
        setError('')
    }

    const selectedItems = Object.entries(quantities)
        .filter(([, qty]) => parseInt(qty) > 0)
        .map(([productId, qty]) => ({
            product_id: parseInt(productId),
            quantity: parseInt(qty),
        }))

    const totalRefund = selectedItems.reduce((sum, item) => {
        const product = (order.products || []).find(p => p.id === item.product_id)
        return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedItems.length === 0) { setError('اختر منتجاً واحداً على الأقل للمرتجع'); return }
        for (const item of selectedItems) {
            const product = (order.products || []).find(p => p.id === item.product_id)
            if (product && item.quantity > product.available_qty) {
                setError(`الكمية المطلوبة تتجاوز الكمية المتاحة لـ ${product.name}`)
                return
            }
        }
        setSubmitting(true)
        router.post(`/orders/${order.raw_id}/return`, { items: selectedItems, reason }, {
            onSuccess: () => onClose(),
            onError: () => { setError('حدث خطأ أثناء تسجيل المرتجع'); setSubmitting(false) },
            onFinish: () => setSubmitting(false),
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EAE8E2] flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                            <RotateCcw className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>تسجيل مرتجع</h3>
                            <p className="text-xs" style={{ color: '#9A978F' }}>{order.id} · {order.customer}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F3EF] transition-colors"><X className="w-4 h-4 text-[#9A978F]" /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {returnableProducts.length === 0 ? (
                            <div className="text-center py-8 text-sm font-semibold text-[#9A978F]">
                                <Package className="w-10 h-10 mx-auto mb-2 text-[#B8B5AE]" />
                                لا توجد منتجات قابلة للإرجاع في هذا الطلب
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs font-bold" style={{ color: '#5C5950' }}>حدد الكميات المُرادة للإرجاع</p>
                                {returnableProducts.map(product => (
                                    <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#EAE8E2' }}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate" style={{ color: '#1A2D23' }}>{product.name}</p>
                                            <p className="text-xs" style={{ color: '#9A978F' }}>
                                                المُطلوب: {product.quantity} · المُرتجع: {product.returned_qty} · المتاح: <span className="font-bold text-[#2E5A44]">{product.available_qty}</span>
                                            </p>
                                            <p className="text-xs font-bold mt-0.5" style={{ color: '#7C7870' }}>{product.price.toFixed(2)} ج.م / وحدة</p>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            max={product.available_qty}
                                            value={quantities[product.id] || ''}
                                            onChange={e => setQty(product.id, e.target.value)}
                                            placeholder="0"
                                            className="w-20 text-center px-2 py-1.5 rounded-lg text-sm font-bold focus:outline-none"
                                            style={{ backgroundColor: '#F4F3EF', border: '1.5px solid #E2E0DA', color: '#1A2D23' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold" style={{ color: '#5C5950' }}>سبب الإرجاع (اختياري)</label>
                            <textarea
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                rows={2}
                                placeholder="اكتب سبب الإرجاع..."
                                className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
                                style={{ backgroundColor: '#F4F3EF', border: '1.5px solid #E2E0DA', color: '#1A2D23' }}
                            />
                        </div>

                        {totalRefund > 0 && (
                            <div className="rounded-xl p-3 text-sm flex justify-between items-center" style={{ backgroundColor: '#EBF5EF', border: '1px solid #ADCBBB' }}>
                                <span style={{ color: '#2E5A44' }}>إجمالي مبلغ الاسترداد</span>
                                <span className="font-bold text-lg" style={{ color: '#2E5A44' }}>{totalRefund.toFixed(2)} ج.م</span>
                            </div>
                        )}

                        {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
                    </div>

                    <div className="flex gap-3 p-5 border-t border-[#EAE8E2] flex-shrink-0">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#EAE8E2] hover:bg-[#F4F3EF] transition-colors" style={{ color: '#5C5950' }}>إلغاء</button>
                        <button type="submit" disabled={submitting || returnableProducts.length === 0} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60" style={{ backgroundColor: '#B45309' }}>
                            {submitting ? 'جارٍ الحفظ...' : 'تأكيد الإرجاع'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
