export default function POSProductCard({ product, onAdd }) {
    return (
        <button
            onClick={() => onAdd(product)}
            disabled={product.stock === 0}
            className={`
                w-full text-right bg-white rounded-2xl border border-[#EAE8E2] p-4
                transition-all duration-200
                ${product.stock === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-[#ADCBBB] hover:shadow-md active:scale-[0.97] cursor-pointer'
                }
            `}
            dir="rtl"
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FAF9F6] to-[#EAE8E2] flex items-center justify-center text-2xl flex-shrink-0">
                    {product.emoji || '📦'}
                </div>
                <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-bold text-[#1A2D23] truncate">{product.name}</p>
                    <p className="text-xs text-[#9A978F] mt-0.5">{product.category}</p>
                </div>
                <div className="text-left flex-shrink-0">
                    <p className="text-sm font-bold text-[#2E5A44]">{product.price.toFixed(2)} ج</p>
                    {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-[10px] text-[#D4A017] font-semibold">بقي {product.stock} فقط</p>
                    )}
                    {product.stock > 5 && (
                        <p className="text-[10px] text-[#9A978F]">متوفر: {product.stock}</p>
                    )}
                    {product.stock === 0 && (
                        <p className="text-[10px] text-[#C0392B] font-semibold">نفذت الكمية</p>
                    )}
                </div>
            </div>
        </button>
    )
}
