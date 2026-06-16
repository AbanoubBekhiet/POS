import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Button } from '../../shared/components'
import { Store, Bell, Shield, Palette, Save, User, Receipt } from 'lucide-react'

const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'receipt', label: 'Receipt', icon: Receipt },
]

export default function SettingsIndex() {
    const [activeTab, setActiveTab] = useState('general')

    return (
        <AppLayout title="Settings" subtitle="Manage your store preferences">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-56 flex-shrink-0">
                    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                                    }
                                `}
                            >
                                <tab.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-2xl border border-surface-100 p-6 space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 mb-1">Store Information</h3>
                                <p className="text-sm text-surface-500">Basic details about your business</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Store Name</label>
                                    <input
                                        type="text"
                                        defaultValue="QuickPOS Store"
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="admin@quickpos.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue="+20 100 123 4567"
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Currency</label>
                                    <select className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all bg-white">
                                        <option>USD ($)</option>
                                        <option>EGP (E£)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Address</label>
                                    <textarea
                                        defaultValue="123 Main Street, Cairo, Egypt"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                                <Button variant="secondary">Cancel</Button>
                                <Button icon={Save}>Save Changes</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-2xl border border-surface-100 p-6 space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 mb-1">Notification Preferences</h3>
                                <p className="text-sm text-surface-500">Choose how you want to be notified</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'New Orders', desc: 'Get notified when a new order is placed' },
                                    { title: 'Low Stock Alerts', desc: 'Alert when product stock falls below threshold' },
                                    { title: 'Daily Summary', desc: 'Receive a daily sales summary email' },
                                    { title: 'Customer Signups', desc: 'Notification for new customer registrations' },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:bg-surface-50/50 transition-colors">
                                        <div>
                                            <p className="text-sm font-semibold text-surface-800">{item.title}</p>
                                            <p className="text-xs text-surface-400 mt-0.5">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-surface-200 rounded-full peer peer-checked:bg-primary-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white rounded-2xl border border-surface-100 p-6 space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 mb-1">Security Settings</h3>
                                <p className="text-sm text-surface-500">Manage your account security</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Current Password</label>
                                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all sm:max-w-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">New Password</label>
                                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all sm:max-w-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Confirm New Password</label>
                                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all sm:max-w-md" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                                <Button icon={Shield}>Update Password</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="bg-white rounded-2xl border border-surface-100 p-6 space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 mb-1">Appearance</h3>
                                <p className="text-sm text-surface-500">Customize the look and feel</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-3">Theme</label>
                                <div className="grid grid-cols-3 gap-3 max-w-sm">
                                    {[
                                        { name: 'Light', bg: 'bg-white', ring: 'ring-primary-500', active: true },
                                        { name: 'Dark', bg: 'bg-surface-900', ring: 'ring-surface-300', active: false },
                                        { name: 'System', bg: 'bg-gradient-to-br from-white to-surface-900', ring: 'ring-surface-300', active: false },
                                    ].map((theme) => (
                                        <button
                                            key={theme.name}
                                            className={`p-3 rounded-xl border-2 transition-all ${theme.active ? `border-primary-500 ${theme.ring}` : 'border-surface-200 hover:border-surface-300'}`}
                                        >
                                            <div className={`w-full h-12 rounded-lg ${theme.bg} border border-surface-200 mb-2`} />
                                            <p className="text-xs font-semibold text-surface-700">{theme.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-surface-700 mb-3">Accent Color</label>
                                <div className="flex items-center gap-3">
                                    {['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'].map((color, i) => (
                                        <button
                                            key={color}
                                            className={`w-8 h-8 rounded-full ${color} transition-transform hover:scale-110 ${i === 0 ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'receipt' && (
                        <div className="bg-white rounded-2xl border border-surface-100 p-6 space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 mb-1">Receipt Settings</h3>
                                <p className="text-sm text-surface-500">Customize your printed receipts</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Header Text</label>
                                    <input
                                        type="text"
                                        defaultValue="QuickPOS Store"
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Footer Text</label>
                                    <input
                                        type="text"
                                        defaultValue="Thank you for your visit!"
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="flex items-center gap-3 p-4 rounded-xl border border-surface-100 hover:bg-surface-50/50 transition-colors cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                                        <div>
                                            <p className="text-sm font-semibold text-surface-800">Show Tax Details</p>
                                            <p className="text-xs text-surface-400">Display tax breakdown on receipt</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                                <Button variant="secondary">Cancel</Button>
                                <Button icon={Save}>Save Changes</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
