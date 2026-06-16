const products = [
    { name: 'Espresso Shot',    category: 'Beverages', sales: 342, revenue: '$1,710' },
    { name: 'Chicken Sandwich', category: 'Food',       sales: 280, revenue: '$2,240' },
    { name: 'Caesar Salad',     category: 'Food',       sales: 215, revenue: '$1,505' },
    { name: 'Iced Latte',       category: 'Beverages', sales: 198, revenue: '$990'   },
    { name: 'Blueberry Muffin', category: 'Bakery',    sales: 175, revenue: '$525'   },
]

const maxSales = Math.max(...products.map(p => p.sales))

export default function TopProducts() {
    return (
        <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }}>
            <div className="mb-5">
                <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>Top Products</h3>
                <p className="text-sm mt-0.5" style={{ color: '#9A978F' }}>Best sellers this month</p>
            </div>

            <div className="space-y-4">
                {products.map((product, i) => (
                    <div key={product.name} className="group animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold w-5" style={{ color: '#B8B5AE' }}>#{i + 1}</span>
                                <div>
                                    <p className="text-sm font-semibold transition-colors" style={{ color: '#1A2D23' }}>{product.name}</p>
                                    <p className="text-xs" style={{ color: '#B8B5AE' }}>{product.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold" style={{ color: '#1A2D23' }}>{product.revenue}</p>
                                <p className="text-xs" style={{ color: '#B8B5AE' }}>{product.sales} sold</p>
                            </div>
                        </div>
                        <div className="ml-8 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EAE8E2' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${(product.sales / maxSales) * 100}%`,
                                    background: 'linear-gradient(to right, #2E5A44, #7FAF98)',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
