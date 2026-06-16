import { useState } from 'react'
import { Sidebar, Header } from '../components'

export default function AppLayout({ children, title, subtitle }) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F6' }}>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 lg:hidden"
                    style={{ backgroundColor: 'rgba(26,29,22,0.35)' }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setMobileOpen(!mobileOpen)}
                />
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
