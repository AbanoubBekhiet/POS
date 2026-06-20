import { Badge } from '../../../shared/components'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function ProductCard({ product, onAddToCart, onEdit, onDelete }) {
    return (
        <div
            className="rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-lg text-right"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#ADCBBB'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#EAE8E2'}
            dir="rtl"
        >
            {/* Image area */}
            <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#F4F3EF' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                    {product.image_url ? (
                        <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    ) : (
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                            style={{ backgroundColor: '#EEF4F1' }}
                        >
                            <span className="text-3xl">📦</span>
                        </div>
                    )}
                </div>

                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="warning">مخزون منخفض</Badge>
                    </div>
                )}
                {product.stock === 0 && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="danger">نفذت الكمية</Badge>
                    </div>
                )}

                {/* Quick Add */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={() => onAddToCart?.(product)}
                        disabled={product.stock === 0}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 shadow-md"
                        style={{ backgroundColor: '#2E5A44', color: '#fff' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#234535'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2E5A44'}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-right" style={{ color: '#9A978F' }}>{product.category_name}</p>
                <h3 className="text-sm font-bold mt-1 line-clamp-1 transition-colors text-right" style={{ color: '#1A2D23' }}>
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mt-3 flex-row-reverse">
                    <p className="text-lg font-bold" style={{ color: '#1A2D23' }}>{product.price.toFixed(2)}ج</p>
                    <p className="text-xs font-bold" style={{ color: '#2E5A44' }}>المخزون: {product.stock}</p>
                </div>
            
                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#FAF9F6]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(product);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#7C7870] hover:text-[#2E5A44] transition-colors"
                        title="تعديل"
                    >
                        <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(product);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#7C7870] hover:text-[#C0392B] transition-colors"
                        title="حذف"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
