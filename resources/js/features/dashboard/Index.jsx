import AppLayout from '../../shared/layouts/AppLayout'
import { StatCard } from '../../shared/components'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import RecentOrders from './components/RecentOrders'
import TopProducts from './components/TopProducts'
import SalesChart from './components/SalesChart'

export default function DashboardIndex() {
    const stats = [
        { title: 'Total Revenue',    value: '$45,231', change: 12.5, changeLabel: 'vs last month', icon: DollarSign, color: 'green'  },
        { title: 'Total Orders',     value: '1,257',   change: 8.2,  changeLabel: 'vs last month', icon: ShoppingBag, color: 'teal'  },
        { title: 'Total Customers',  value: '842',     change: 3.1,  changeLabel: 'vs last month', icon: Users,       color: 'amber' },
        { title: 'Avg. Order Value', value: '$35.99',  change: -2.4, changeLabel: 'vs last month', icon: TrendingUp,  color: 'rose'  },
    ]

    return (
        <AppLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
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
