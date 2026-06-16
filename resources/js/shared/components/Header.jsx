import { Bell, Search, ChevronDown, Menu } from 'lucide-react'
import SearchInput from './SearchInput'

export default function Header({ title, subtitle, onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 glass">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                {/* Left: Menu + Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl transition-colors hover:bg-[#EAE8E2]"
                    >
                        <Menu className="w-5 h-5" style={{ color: '#5C5950' }} />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#1A2D23' }}>
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-sm mt-0.5" style={{ color: '#9A978F' }}>{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right: Search + Notifications + User */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <SearchInput placeholder="Search anything..." />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl transition-colors hover:bg-[#EAE8E2]">
                        <Bell className="w-5 h-5" style={{ color: '#7C7870' }} />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white" style={{ backgroundColor: '#C0392B' }} />
                    </button>

                    {/* User */}
                    <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl transition-colors hover:bg-[#EAE8E2]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #559476, #2E5A44)' }}>
                            A
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold" style={{ color: '#1A2D23' }}>Admin</p>
                            <p className="text-xs" style={{ color: '#9A978F' }}>Manager</p>
                        </div>
                        <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: '#B8B5AE' }} />
                    </button>
                </div>
            </div>
        </header>
    )
}
