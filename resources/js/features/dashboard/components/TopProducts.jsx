const products = [
    { name: 'مزيج بذور الطماطم',    category: 'بذور ونباتات', sales: 342, revenue: '1,710 د.إ' },
    { name: 'مجرفة حديد مطروق', category: 'أدوات زراعية',       sales: 280, revenue: '2,240 د.إ' },
    { name: 'وعاء فخار تيراكوتا',     category: 'مستلزمات الحديقة',       sales: 215, revenue: '1,505 د.إ' },
    { name: 'تربة عضوية ممتازة',       category: 'تربة وأسمدة', sales: 198, revenue: '990 د.إ'   },
    { name: 'مقص تقليم الأشجار', category: 'أدوات زراعية',    sales: 175, revenue: '525 د.إ'   },
]

const maxSales = Math.max(...products.map(p => p.sales))

export default function TopProducts() {
    return (
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }} dir="rtl">
            <div className="mb-5 text-right">
                <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>المنتجات الأكثر مبيعاً</h3>
                <p className="text-sm mt-0.5" style={{ color: '#9A978F' }}>المنتجات الأكثر طلباً هذا الشهر</p>
            </div>

            <div className="space-y-4">
                {products.map((product, i) => (
                    <div key={product.name} className="group animate-fade-in text-right" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold w-5" style={{ color: '#B8B5AE' }}>#{i + 1}</span>
                                <div>
                                    <p className="text-sm font-semibold transition-colors" style={{ color: '#1A2D23' }}>{product.name}</p>
                                    <p className="text-xs" style={{ color: '#B8B5AE' }}>{product.category}</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold" style={{ color: '#1A2D23' }}>{product.revenue}</p>
                                <p className="text-xs" style={{ color: '#B8B5AE' }}>تم بيع {product.sales}</p>
                            </div>
                        </div>
                        <div className="mr-8 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EAE8E2' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${(product.sales / maxSales) * 100}%`,
                                    background: 'linear-gradient(to left, #2E5A44, #7FAF98)',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
