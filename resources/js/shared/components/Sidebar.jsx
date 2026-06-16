import { Link, usePage } from '@inertiajs/react'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    ClipboardList,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Leaf,
} from 'lucide-react'

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'POS', icon: ShoppingCart, href: '/pos' },
    { name: 'Products', icon: Package, href: '/products' },
    { name: 'Orders', icon: ClipboardList, href: '/orders' },
    { name: 'Customers', icon: Users, href: '/customers' },
    { name: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar({ collapsed, onToggle }) {
    const { url } = usePage()

    const isActive = (href) => {
        if (href === '/') return url === '/'
        return url.startsWith(href)
    }

    return (
        <aside
            style={{ backgroundColor: '#F4F3EF' }}
            className={`
                fixed top-0 left-0 z-40 h-screen
                border-r border-[#E2E0DA]
                transition-all duration-300 ease-in-out
                flex flex-col
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-[#E2E0DA]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#2E5A44' }}>
                    <Leaf className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <div className="animate-fade-in">
                        <h1 className="text-lg font-bold tracking-tight" style={{ color: '#1A2D23' }}>QuickPOS</h1>
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: '#9A978F' }}>Point of Sale</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group flex items-center gap-3 px-3 py-2.5 rounded-xl
                                transition-all duration-200 relative
                                ${collapsed ? 'justify-center' : ''}
                            `}
                            style={active
                                ? { backgroundColor: '#E8EBE9', color: '#2E5A44' }
                                : { color: '#7C7870' }
                            }
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon
                                className="w-5 h-5 flex-shrink-0 transition-colors"
                                style={{ color: active ? '#2E5A44' : '#9A978F' }}
                            />
                            {!collapsed && (
                                <span className="text-sm font-semibold animate-fade-in">
                                    {item.name}
                                </span>
                            )}
                            {active && !collapsed && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full animate-scale-in" style={{ backgroundColor: '#2E5A44' }} />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-[#E2E0DA]">
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#E8EBE9]"
                    style={{ color: '#9A978F' }}
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    )
}
