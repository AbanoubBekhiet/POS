import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Button, SearchInput, Badge } from '../../shared/components'
import { Plus, Folder, Edit2, Trash2, ArrowRight } from 'lucide-react'

export default function CategoriesIndex() {
    const [search, setSearch] = useState('')
    const [categories, setCategories] = useState([
        { id: 1, name: 'بذور ونباتات', description: 'بذور الزهور، الخضروات، الشتلات والنباتات الطبيعية', count: 142, status: 'active', emoji: '🌱' },
        { id: 2, name: 'أدوات زراعية', description: 'المجارف، مقصات التقليم، الفؤوس والمعدات اليدوية والآلية', count: 48, status: 'active', emoji: '🛠️' },
        { id: 3, name: 'تربة وأسمدة', description: 'التربة العضوية المخصبة، المغذيات والأسمدة الكيماوية والبيولوجية', count: 32, status: 'active', emoji: '🪴' },
        { id: 4, name: 'مستلزمات الحديقة', description: 'أحواض الفخار، الزينة، الإضاءة الخارجية والديكورات والملابس', count: 75, status: 'active', emoji: '🏺' },
        { id: 5, name: 'شبكات ري', description: 'خراطيم ري، مرشات المياه، مؤقتات الري الذكية والصمامات', count: 18, status: 'active', emoji: '🚰' },
    ])

    const [newName, setNewName] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [newEmoji, setNewEmoji] = useState('📦')

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (e) => {
        e.preventDefault()
        if (!newName.trim()) return
        const newCat = {
            id: Date.now(),
            name: newName,
            description: newDesc,
            count: 0,
            status: 'active',
            emoji: newEmoji
        }
        setCategories([...categories, newCat])
        setNewName('')
        setNewDesc('')
        setNewEmoji('📦')
        alert('تم إضافة التصنيف الجديد بنجاح.')
    }

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
            setCategories(categories.filter(c => c.id !== id))
        }
    }

    return (
        <AppLayout title="تصنيفات المخزون" subtitle="إدارة وتصنيف المنتجات لسهولة الوصول والمبيعات">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
                {/* Form: Add Category */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE8E2] text-right">
                        <h3 className="text-base font-bold text-[#1A2D23] mb-4">إضافة تصنيف جديد</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>رمز التعبير (Emoji)</label>
                                <input
                                    type="text"
                                    value={newEmoji}
                                    onChange={(e) => setNewEmoji(e.target.value)}
                                    className="w-16 text-center py-2 rounded-xl text-lg transition-all focus:outline-none"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>اسم التصنيف</label>
                                <input
                                    type="text"
                                    placeholder="مثال: نباتات زينة"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الوصف</label>
                                <textarea
                                    placeholder="تفاصيل حول المنتجات المندرجة تحت هذا القسم..."
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium resize-none"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-2"
                                style={{ backgroundColor: '#2E5A44' }}
                            >
                                <Plus className="w-4 h-4" />
                                إضافة التصنيف
                            </button>
                        </form>
                    </div>
                </div>

                {/* List: Categories */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE8E2] flex items-center justify-between">
                        <SearchInput
                            placeholder="ابحث عن تصنيف..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full max-w-md"
                        />
                        <span className="text-xs font-semibold" style={{ color: '#9A978F' }}>
                            {filtered.length} تصنيفات متاحة
                        </span>
                    </div>

                    <div className="space-y-3">
                        {filtered.map((cat, i) => (
                            <div
                                key={cat.id}
                                className="bg-white rounded-2xl p-4 border border-[#EAE8E2] flex items-center justify-between transition-all hover:shadow-md hover:border-[#ADCBBB] animate-fade-in text-right"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-2xl flex-shrink-0">
                                        {cat.emoji}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1A2D23]">{cat.name}</h4>
                                        <p className="text-xs text-[#9A978F] mt-0.5 max-w-sm sm:max-w-md truncate">{cat.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-left hidden sm:block">
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] text-[#5C5950]">
                                            {cat.count} منتج
                                        </span>
                                    </div>
                                    <Badge variant={cat.status === 'active' ? 'success' : 'neutral'}>نشط</Badge>
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 rounded-lg hover:bg-[#EAE8E2] text-[#B8B5AE] hover:text-[#5C5950] transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 rounded-lg hover:bg-[#FDEEEC] text-[#B8B5AE] hover:text-[#C0392B] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
