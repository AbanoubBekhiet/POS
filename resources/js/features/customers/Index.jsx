import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput, Button, Badge } from '../../shared/components'
import { Plus, Mail, Phone, MoreHorizontal } from 'lucide-react'

const sampleCustomers = [
    { id: 1, name: 'أحمد حسن - مشتل الوادي الأخضر',   email: 'ahmed.nursery@email.com',   phone: '+20 100 123 4567', orders: 24, spent: '1,250 د.إ', status: 'active',   joined: 'يناير 2026' },
    { id: 2, name: 'سارة علي - زهور الريف',       email: 'sara.flowers@email.com',    phone: '+20 111 234 5678', orders: 18, spent: '890 د.إ',   status: 'active',   joined: 'فبراير 2026' },
    { id: 3, name: 'محمد يوسف - مزرعة الروابي',email: 'mohamed.farm@email.com', phone: '+20 122 345 6789', orders: 32, spent: '2,100 د.إ', status: 'active',   joined: 'ديسمبر 2025' },
    { id: 4, name: 'فاطمة إبراهيم - حدائق الشروق',  email: 'fatma.garden@email.com',   phone: '+20 100 456 7890', orders: 5,  spent: '180 د.إ',   status: 'inactive', joined: 'مارس 2026' },
    { id: 5, name: 'عمر خالد - تنسيق بستان',    email: 'omar.boustan@email.com',    phone: '+20 155 567 8901', orders: 12, spent: '620 د.إ',   status: 'active',   joined: 'يناير 2026' },
    { id: 6, name: 'نور محمود - أشجار النخيل',   email: 'nour.palms@email.com',    phone: '+20 106 678 9012', orders: 8,  spent: '340  د.إ',   status: 'active',   joined: 'أبريل 2026' },
]

export default function CustomersIndex() {
    const [search, setSearch] = useState('')

    const filtered = sampleCustomers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AppLayout title="إدارة العملاء" subtitle={`${filtered.length} عميل مسجل بالنظام`}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" dir="rtl">
                <SearchInput
                    placeholder="البحث عن العملاء..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sm:w-72"
                />
                <Button icon={Plus}>إضافة عميل</Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5" dir="rtl">
                {filtered.map((customer, i) => (
                    <div
                        key={customer.id}
                        className="rounded-2xl p-5 transition-all duration-300 animate-fade-in hover:shadow-md text-right"
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #EAE8E2',
                            animationDelay: `${i * 60}ms`,
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#ADCBBB'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#EAE8E2'}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4 flex-row-reverse">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                    style={{ background: 'linear-gradient(135deg, #559476, #2E5A44)' }}
                                >
                                    {customer.name.charAt(0)}
                                </div>
                                <div className="text-right">
                                    <h3 className="text-sm font-bold" style={{ color: '#1A2D23' }}>{customer.name}</h3>
                                    <p className="text-xs" style={{ color: '#B8B5AE' }}>عضو منذ {customer.joined}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-row-reverse">
                                <Badge variant={customer.status === 'active' ? 'success' : 'neutral'} dot>
                                    {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                                </Badge>
                                <button className="p-1.5 rounded-lg transition-colors hover:bg-[#EAE8E2]">
                                    <MoreHorizontal className="w-4 h-4" style={{ color: '#B8B5AE' }} />
                                </button>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 mb-4 text-right">
                            <div className="flex items-center gap-2 justify-start">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9A978F' }} />
                                <span className="text-sm truncate" style={{ color: '#7C7870' }}>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-start">
                                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9A978F' }} />
                                <span className="text-sm" style={{ color: '#7C7870' }}>{customer.phone}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #EAE8E2' }}>
                            <div className="text-center flex-1">
                                <p className="text-lg font-bold" style={{ color: '#1A2D23' }}>{customer.orders}</p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#B8B5AE' }}>الطلبات</p>
                            </div>
                            <div className="w-px h-8" style={{ backgroundColor: '#EAE8E2' }} />
                            <div className="text-center flex-1">
                                <p className="text-lg font-bold" style={{ color: '#2E5A44' }}>{customer.spent}</p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#B8B5AE' }}>إجمالي المشتريات</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    )
}
