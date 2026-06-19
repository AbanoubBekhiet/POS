import AppLayout from '../../shared/layouts/AppLayout'
import { StatCard } from '../../shared/components'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import RecentOrders from './components/RecentOrders'
import TopProducts from './components/TopProducts'
import SalesChart from './components/SalesChart'

export default function DashboardIndex() {
    const stats = [
        { title: 'إجمالي الإيرادات',    value: '45,231 د.إ', change: 12.5, changeLabel: 'مقارنة بالشهر الماضي', icon: DollarSign, color: 'green'  },
        { title: 'إجمالي الطلبات',     value: '1,257 طلب',   change: 8.2,  changeLabel: 'مقارنة بالشهر الماضي', icon: ShoppingBag, color: 'teal'  },
        { title: 'إجمالي العملاء',  value: '842 عميل',     change: 3.1,  changeLabel: 'مقارنة بالشهر الماضي', icon: Users,       color: 'amber' },
        { title: 'متوسط قيمة الطلب', value: '35.99 د.إ',  change: -2.4, changeLabel: 'مقارنة بالشهر الماضي', icon: TrendingUp,  color: 'rose'  },
    ]

    return (
        <AppLayout title="لوحة التحكم" subtitle="أهلاً بك مجدداً في منظومة أبو الدهب! إليك نظرة سريعة على أداء اليوم.">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-7">
                {stats.map((stat, i) => (
                    <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 mb-7">
                <div className="xl:col-span-2">
                    <SalesChart />
                </div>
                <TopProducts />
            </div>

            {/* Recent Orders */}
            <RecentOrders />
        </AppLayout>
    )
}
