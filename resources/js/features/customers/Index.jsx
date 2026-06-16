import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput, Button, Badge } from '../../shared/components'
import { Plus, Mail, Phone, MoreHorizontal } from 'lucide-react'

const sampleCustomers = [
    { id: 1, name: 'Ahmed Hassan',   email: 'ahmed@email.com',   phone: '+20 100 123 4567', orders: 24, spent: '$1,250', status: 'active',   joined: 'Jan 2026' },
    { id: 2, name: 'Sara Ali',       email: 'sara@email.com',    phone: '+20 111 234 5678', orders: 18, spent: '$890',   status: 'active',   joined: 'Feb 2026' },
    { id: 3, name: 'Mohamed Youssef',email: 'mohamed@email.com', phone: '+20 122 345 6789', orders: 32, spent: '$2,100', status: 'active',   joined: 'Dec 2025' },
    { id: 4, name: 'Fatma Ibrahim',  email: 'fatma@email.com',   phone: '+20 100 456 7890', orders: 5,  spent: '$180',   status: 'inactive', joined: 'Mar 2026' },
    { id: 5, name: 'Omar Khaled',    email: 'omar@email.com',    phone: '+20 155 567 8901', orders: 12, spent: '$620',   status: 'active',   joined: 'Jan 2026' },
    { id: 6, name: 'Nour Mahmoud',   email: 'nour@email.com',    phone: '+20 106 678 9012', orders: 8,  spent: '$340',   status: 'active',   joined: 'Apr 2026' },
]

export default function CustomersIndex() {
    const [search, setSearch] = useState('')

    const filtered = sampleCustomers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AppLayout title="Customers" subtitle={`${filtered.length} registered customers`}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <SearchInput
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sm:w-72"
                />
                <Button icon={Plus}>Add Customer</Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((customer, i) => (
                    <div
                        key={customer.id}
                        className="rounded-2xl p-5 transition-all duration-300 animate-fade-in hover:shadow-md"
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #EAE8E2',
                            animationDelay: `${i * 60}ms`,
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#ADCBBB'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#EAE8E2'}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                    style={{ background: 'linear-gradient(135deg, #559476, #2E5A44)' }}
                                >
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold" style={{ color: '#1A2D23' }}>{customer.name}</h3>
                                    <p className="text-xs" style={{ color: '#B8B5AE' }}>Since {customer.joined}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Badge variant={customer.status === 'active' ? 'success' : 'neutral'} dot>
                                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                                <button className="p-1.5 rounded-lg transition-colors hover:bg-[#EAE8E2]">
                                    <MoreHorizontal className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                                </button>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9A978F' }} />
                                <span className="text-sm truncate" style={{ color: '#7C7870' }}>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9A978F' }} />
                                <span className="text-sm" style={{ color: '#7C7870' }}>{customer.phone}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #EAE8E2' }}>
                            <div className="text-center">
                                <p className="text-lg font-bold" style={{ color: '#1A2D23' }}>{customer.orders}</p>
                                <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: '#B8B5AE' }}>Orders</p>
                            </div>
                            <div className="w-px h-8" style={{ backgroundColor: '#EAE8E2' }} />
                            <div className="text-center">
                                <p className="text-lg font-bold" style={{ color: '#2E5A44' }}>{customer.spent}</p>
                                <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: '#B8B5AE' }}>Total Spent</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    )
}
