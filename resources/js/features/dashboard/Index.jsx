import AppLayout from '../../shared/layouts/AppLayout'
import RecentOrders from './components/RecentOrders'
import TopProducts from './components/TopProducts'
import SalesChart from './components/SalesChart'

export default function DashboardIndex({
    salesData    = [],
    topProducts  = [],
    recentOrders = [],
}) {
    return (
        <AppLayout title="لوحة التحكم" subtitle="أهلاً بك مجدداً! إليك نظرة سريعة على أداء المتجر.">
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 mb-7">
                <div className="xl:col-span-2">
                    <SalesChart salesData={salesData} />
                </div>
                <TopProducts topProducts={topProducts} />
            </div>

            {/* Recent Orders */}
            <RecentOrders recentOrders={recentOrders} />
        </AppLayout>
    )
}
