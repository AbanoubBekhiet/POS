const salesData = [
    { month: 'يناير', sales: 4200 },
    { month: 'فبراير', sales: 3800 },
    { month: 'مارس', sales: 5100 },
    { month: 'أبريل', sales: 4600 },
    { month: 'مايو', sales: 5800 },
    { month: 'يونيو', sales: 6200 },
    { month: 'يوليو', sales: 5900 },
]

export default function SalesChart() {
    const maxSales = Math.max(...salesData.map(d => d.sales))

    return (
        <div className="rounded-2xl p-5 sm:p-6 h-full" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }} dir="rtl">
            <div className="flex items-center justify-between mb-6">
                <div className="text-right">
                    <h3 className="text-base font-bold" style={{ color: '#1A2D23' }}>نظرة عامة على المبيعات</h3>
                    <p className="text-sm mt-0.5" style={{ color: '#9A978F' }}>مخطط الإيرادات الشهري</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3A7259' }} />
                    <span className="text-xs font-medium" style={{ color: '#9A978F' }}>الإيرادات</span>
                </div>
            </div>

            {/* Chart Bars */}
            <div className="flex items-end justify-between gap-2 sm:gap-3 h-52">
                {salesData.map((item, i) => {
                    const height = (item.sales / maxSales) * 100
                    return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                            <div
                                className="text-xs font-semibold transition-opacity opacity-0 group-hover:opacity-100"
                                style={{ color: '#2E5A44' }}
                            >
                                {item.sales} د.إ
                            </div>
                            <div className="w-full relative" style={{ height: `${height}%` }}>
                                <div
                                    className="absolute bottom-0 w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(to top, #2E5A44, #559476)',
                                        animation: `growUp 0.7s ease-out ${i * 0.08}s both`,
                                        borderRadius: '6px 6px 0 0',
                                    }}
                                />
                            </div>
                            <span className="text-xs font-medium" style={{ color: '#B8B5AE' }}>{item.month}</span>
                        </div>
                    )
                })}
            </div>

            <style>{`
                @keyframes growUp {
                    from { height: 0%; opacity: 0; }
                    to   { height: 100%; opacity: 1; }
                }
            `}</style>
        </div>
    )
}
