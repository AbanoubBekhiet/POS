import { X, Printer, Package, RotateCcw, Tag } from 'lucide-react'

export default function OrderDetailsModal({ order, onClose, onDiscount, onReturn }) {
    const handlePrint = () => {
        const printContent = buildPrintHTML(order)
        const w = window.open('', '_blank', 'width=400,height=600')
        w.document.write(printContent)
        w.document.close()
        w.focus()
        setTimeout(() => { w.print(); w.close() }, 300)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#EAE8E2] flex-shrink-0">
                    <div>
                        <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>تفاصيل الطلب</h3>
                        <p className="text-xs font-semibold" style={{ color: '#2E5A44' }}>{order.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint} title="طباعة" className="p-1.5 rounded-lg hover:bg-[#EEF4F1] transition-colors">
                            <Printer className="w-4 h-4" style={{ color: '#2E5A44' }} />
                        </button>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F4F3EF] transition-colors">
                            <X className="w-4 h-4 text-[#9A978F]" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Customer & Date */}
                    <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#FAF9F6' }}>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#9A978F' }}>العميل</span>
                            <span className="font-bold" style={{ color: '#1A2D23' }}>{order.customer}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#9A978F' }}>التاريخ</span>
                            <span className="font-semibold" style={{ color: '#5C5950' }}>{order.date}</span>
                        </div>
                        {order.return_status && (
                            <div className="flex justify-between text-sm">
                                <span style={{ color: '#9A978F' }}>المرتجع</span>
                                <span className="font-bold text-amber-600">{order.return_status === 'full' ? 'إرجاع كامل' : 'إرجاع جزئي'}</span>
                            </div>
                        )}
                    </div>

                    {/* Products */}
                    <div>
                        <p className="text-xs font-bold mb-2" style={{ color: '#5C5950' }}>المنتجات</p>
                        <div className="space-y-2">
                            {(order.products || []).map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: '#EAE8E2' }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF4F1' }}>
                                            <Package className="w-3.5 h-3.5" style={{ color: '#2E5A44' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold" style={{ color: '#1A2D23' }}>{p.name}</p>
                                            <p className="text-xs" style={{ color: '#9A978F' }}>
                                                {p.quantity} × {p.price.toFixed(2)} ج.م
                                                {p.returned_qty > 0 && <span className="text-amber-600 mr-1">· مُرجع: {p.returned_qty}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>{p.total_price.toFixed(2)} ج.م</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Returns history */}
                    {(order.returns || []).length > 0 && (
                        <div>
                            <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: '#5C5950' }}>
                                <RotateCcw className="w-3 h-3" /> سجل المرتجعات
                            </p>
                            <div className="space-y-2">
                                {order.returns.map((r, i) => (
                                    <div key={i} className="p-3 rounded-xl text-xs space-y-1" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-amber-800">{r.product_name}</span>
                                            <span className="font-bold text-amber-800">{r.refund_amount.toFixed(2)} ج.م</span>
                                        </div>
                                        <p className="text-amber-700">الكمية: {r.quantity} · {r.date}</p>
                                        {r.reason && <p className="text-amber-700">السبب: {r.reason}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Totals */}
                    <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#FAF9F6' }}>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: '#7C7870' }}>إجمالي الطلب</span>
                            <span className="font-bold" style={{ color: '#1A2D23' }}>{order.total}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span style={{ color: '#7C7870' }}>الخصم</span>
                                <span className="font-bold text-orange-600">- {order.discount.toFixed(2)} ج.م</span>
                            </div>
                        )}
                        <div className="border-t border-[#EAE8E2] pt-2 flex justify-between">
                            <span className="text-sm font-bold" style={{ color: '#1A2D23' }}>الصافي</span>
                            <span className="text-base font-bold" style={{ color: '#2E5A44' }}>{order.net_total}</span>
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex gap-2 p-4 border-t border-[#EAE8E2] flex-shrink-0">
                    <button onClick={() => { onClose(); onDiscount(order) }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-[#EAE8E2] hover:bg-[#F4F3EF] transition-colors"
                        style={{ color: '#5C5950' }}>
                        <Tag className="w-3.5 h-3.5" /> خصم
                    </button>
                    <button onClick={() => { onClose(); onReturn(order) }}
                        className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border hover:opacity-90 transition-colors"
                        style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}>
                        <RotateCcw className="w-3.5 h-3.5" /> مرتجع
                    </button>
                    <button onClick={handlePrint}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                        style={{ backgroundColor: '#2E5A44' }}>
                        <Printer className="w-3.5 h-3.5" /> طباعة
                    </button>
                </div>
            </div>
        </div>
    )
}

function buildPrintHTML(order) {
    const rows = (order.products || []).map(p => `
        <tr>
            <td style="padding:6px 4px;border-bottom:1px solid #eee">${p.name}</td>
            <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:center">${p.quantity}</td>
            <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:left">${p.price.toFixed(2)}</td>
            <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:left">${p.total_price.toFixed(2)}</td>
        </tr>`).join('')

    return `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>طباعة الطلب</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:13px;padding:20px;color:#111}
    h2{text-align:center;margin-bottom:4px;font-size:16px}p.sub{text-align:center;color:#666;margin-bottom:14px;font-size:11px}
    table{width:100%;border-collapse:collapse}th{background:#f5f5f5;padding:6px 4px;text-align:right;font-size:11px}
    .totals{margin-top:12px;border-top:1.5px solid #111;padding-top:8px}
    .totals div{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
    .totals .net{font-weight:bold;font-size:14px;margin-top:6px;border-top:1px solid #ccc;padding-top:6px}</style>
    </head><body>
    <h2>فاتورة طلب</h2>
    <p class="sub">${order.id} · ${order.date} · ${order.customer}</p>
    <table><thead><tr><th>المنتج</th><th style="text-align:center">الكمية</th><th style="text-align:left">السعر</th><th style="text-align:left">الإجمالي</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="totals">
        <div><span>الإجمالي</span><span>${order.total}</span></div>
        ${order.discount > 0 ? `<div><span>الخصم</span><span>- ${order.discount.toFixed(2)} ج.م</span></div>` : ''}
        <div class="net"><span>الصافي</span><span>${order.net_total}</span></div>
    </div>
    </body></html>`
}
