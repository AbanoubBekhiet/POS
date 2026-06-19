import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Button, SearchInput, Badge } from '../../shared/components'
import { Plus, Mail, Phone, MapPin, Trash2, Edit2, ShieldAlert } from 'lucide-react'

export default function SuppliersIndex() {
    const [search, setSearch] = useState('')
    const [suppliers, setSuppliers] = useState([
        { id: 1, name: 'شركة الأمل للأسمدة الزراعية', category: 'أسمدة وأتربة', contactName: 'م. أشرف سليم', phone: '+20 100 876 5432', email: 'ashraf@alamal-fert.com', address: 'المنطقة الصناعية، السادات', status: 'active' },
        { id: 2, name: 'مستورد بذور الدلتا والشرق الأوسط', category: 'بذور ونباتات', contactName: 'أ. سامح فوزي', phone: '+20 111 987 6543', email: 'sameh@deltaseeds.com', address: 'ميدان التحرير، القاهرة', status: 'active' },
        { id: 3, name: 'المصنع الحديث للأواني واللدائن', category: 'مستلزمات الحديقة', contactName: 'أ. حسين بكري', phone: '+20 122 135 2468', email: 'factory@modernpots.com', address: 'المنطقة الحرة، الإسكندرية', status: 'active' },
        { id: 4, name: 'الشركة العربية لشبكات الري الحديث', category: 'شبكات ري وأدوات', contactName: 'م. طارق عبد الله', phone: '+20 155 765 4321', email: 'tariq@arabianirrigation.com', address: 'المنطقة الصناعية الثالثة، السادس من أكتوبر', status: 'active' },
    ])

    const [name, setName] = useState('')
    const [category, setCategory] = useState('بذور ونباتات')
    const [contact, setContact] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')

    const filtered = suppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contactName.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (e) => {
        e.preventDefault()
        if (!name.trim()) return
        const newSupplier = {
            id: Date.now(),
            name,
            category,
            contactName: contact,
            phone: phone || 'غير متوفر',
            email: email || 'غير متوفر',
            address: address || 'غير متوفر',
            status: 'active'
        }
        setSuppliers([...suppliers, newSupplier])
        setName('')
        setContact('')
        setPhone('')
        setEmail('')
        setAddress('')
        alert('تم تسجيل المورد الجديد بنجاح.')
    }

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف بيانات هذا المورد؟')) {
            setSuppliers(suppliers.filter(s => s.id !== id))
        }
    }

    return (
        <AppLayout title="إدارة الموردين" subtitle="متابعة جهات توريد البذور، المعدات، الأسمدة والمستلزمات">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE8E2] text-right">
                        <h3 className="text-base font-bold text-[#1A2D23] mb-4">تسجيل مورد جديد</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>اسم الشركة / المورد</label>
                                <input
                                    type="text"
                                    placeholder="مثال: شركة النيل للتوريدات"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>قسم التوريد</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium cursor-pointer"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                >
                                    <option value="بذور ونباتات">بذور ونباتات</option>
                                    <option value="أسمدة وأتربة">أسمدة وأتربة</option>
                                    <option value="أدوات زراعية">أدوات زراعية</option>
                                    <option value="مستلزمات الحديقة">مستلزمات الحديقة</option>
                                    <option value="شبكات ري وأدوات">شبكات ري وأدوات</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>المسؤول (اسم جهة الاتصال)</label>
                                <input
                                    type="text"
                                    placeholder="مثال: م. أحمد الدلجاوي"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>رقم الهاتف</label>
                                <input
                                    type="text"
                                    placeholder="مثال: 0100xxxxxxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    placeholder="supplier@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-left font-medium"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>العنوان</label>
                                <input
                                    type="text"
                                    placeholder="المنطقة، المدينة"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-2"
                                style={{ backgroundColor: '#2E5A44' }}
                            >
                                <Plus className="w-4 h-4" />
                                تسجيل المورد
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE8E2] flex items-center justify-between">
                        <SearchInput
                            placeholder="ابحث عن مورد، ممثل الشركة، أو قسم..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full max-w-md"
                        />
                        <span className="text-xs font-semibold" style={{ color: '#9A978F' }}>
                            {filtered.length} جهات توريد مسجلة
                        </span>
                    </div>

                    <div className="space-y-4">
                        {filtered.map((sup, i) => (
                            <div
                                key={sup.id}
                                className="bg-white rounded-2xl p-5 border border-[#EAE8E2] transition-all hover:shadow-md hover:border-[#ADCBBB] animate-fade-in text-right"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="text-right">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-base font-bold text-[#1A2D23]">{sup.name}</h4>
                                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EEF4F1] text-[#2E5A44] border border-[#ADCBBB]">
                                                {sup.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#9A978F] mt-1">المسؤول عن التوريد: <span className="font-bold text-[#5C5950]">{sup.contactName}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:self-start">
                                        <Badge variant={sup.status === 'active' ? 'success' : 'neutral'}>
                                            {sup.status === 'active' ? 'نشط' : 'غير نشط'}
                                        </Badge>
                                        <button className="p-2 rounded-lg hover:bg-[#EAE8E2] text-[#B8B5AE] hover:text-[#5C5950] transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sup.id)}
                                            className="p-2 rounded-lg hover:bg-[#FDEEEC] text-[#B8B5AE] hover:text-[#C0392B] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#FAF9F6]">
                                    <div className="flex items-center gap-2 justify-start">
                                        <Phone className="w-4 h-4 text-[#9A978F]" />
                                        <span className="text-xs font-semibold text-[#5C5950]">{sup.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-start">
                                        <Mail className="w-4 h-4 text-[#9A978F]" />
                                        <span className="text-xs font-semibold text-[#5C5950] truncate">{sup.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-start sm:col-span-1">
                                        <MapPin className="w-4 h-4 text-[#9A978F]" />
                                        <span className="text-xs font-semibold text-[#5C5950] truncate">{sup.address}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
