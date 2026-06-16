export default function POSProductCard({ product, onAdd }) {
    return (
        <button
            onClick={() => onAdd(product)}
            disabled={product.stock === 0}
            className={`
                w-full text-left bg-white rounded-2xl border border-surface-100 p-4
                transition-all duration-200
                ${product.stock === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50 active:scale-[0.97] cursor-pointer'
                }
            `}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {product.emoji || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-surface-900 truncate">{product.name}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{product.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary-600">${product.price.toFixed(2)}</p>
                    {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-[10px] text-amber-500 font-medium">{product.stock} left</p>
                    )}
                </div>
            </div>
        </button>
    )
}
