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
            <div className="flex items-start gap-3">
                
                <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-bold text-[#1A2D23] leading-snug">{product.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap justify-end">
                        <p className="text-xs text-[#9A978F]">{product.category_name || product.category}</p>
                        {product.unit && (
                            <span className="text-[10px] font-bold bg-[#D5E6DC] text-[#2E5A44] px-1.5 py-0.5 rounded-full">
                                {product.unit}
                            </span>
                        )}
                    </div>
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
