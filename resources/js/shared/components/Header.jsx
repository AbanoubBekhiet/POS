import { Bell, Settings, Search, Menu } from 'lucide-react'

export default function Header({ title, subtitle, onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 glass">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
                {/* Left: Menu + Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl transition-colors hover:bg-[#EAE8E2]"
                    >
                        <Menu className="w-5 h-5" style={{ color: '#5C5950' }} />
                    </button>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-lg hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#B8B5AE' }} />
                        <input
                            type="text"
                            placeholder="Search orders, inventory, or customers..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none"
                            style={{
                                backgroundColor: '#F4F3EF',
                                border: '1px solid #E2E0DA',
                                color: '#3C3A33',
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = '#3A7259'
                                e.target.style.boxShadow = '0 0 0 3px rgba(58,114,89,0.1)'
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#E2E0DA'
                                e.target.style.boxShadow = 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Right: Notifications + Settings + User */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl transition-colors hover:bg-[#EAE8E2]">
                        <Bell className="w-5 h-5" style={{ color: '#5C5950' }} />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white" style={{ backgroundColor: '#C0392B' }} />
                    </button>

                    {/* Settings */}
                    <button className="p-2.5 rounded-xl transition-colors hover:bg-[#EAE8E2]">
                        <Settings className="w-5 h-5" style={{ color: '#5C5950' }} />
                    </button>

                    {/* User Avatar */}
                    <div className="flex items-center gap-3 pl-2 ml-1 border-l" style={{ borderColor: '#E2E0DA' }}>
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold leading-tight" style={{ color: '#1A2D23' }}>Admin User</p>
                            <p className="text-xs" style={{ color: '#9A978F' }}>Manager</p>
                        </div>
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white"
                            style={{ background: 'linear-gradient(135deg, #559476, #2E5A44)' }}
                        >
                            A
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
