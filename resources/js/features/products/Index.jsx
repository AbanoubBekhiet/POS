import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Button, SearchInput } from '../../shared/components'
import ProductCard from './components/ProductCard'
import CategoryFilter from './components/CategoryFilter'
import { Plus, LayoutGrid, List } from 'lucide-react'

const sampleProducts = [
    { id: 1, name: 'مزيج بذور الطماطم', category: 'بذور ونباتات', price: 15.00, stock: 120, emoji: '🍅' },
    { id: 2, name: 'مجرفة حديد مطروق', category: 'أدوات زراعية', price: 45.00, stock: 3, emoji: '🛠️' },
    { id: 3, name: 'تربة عضوية ممتازة 10كجم', category: 'تربة وأسمدة', price: 25.00, stock: 60, emoji: '🪴' },
    { id: 4, name: 'خرطوم ري مرن 20م', category: 'مستلزمات الحديقة', price: 75.00, stock: 18, emoji: '🚰' },
    { id: 5, name: 'سماد نتروجين سائل 1 لتر', category: 'تربة وأسمدة', price: 30.00, stock: 45, emoji: '🧪' },
    { id: 6, name: 'بذور ريحان إيطالي', category: 'بذور ونباتات', price: 5.00, stock: 200, emoji: '🌱' },
    { id: 7, name: 'مقص تقليم أشجار', category: 'أدوات زراعية', price: 35.00, stock: 8, emoji: '✂️' },
    { id: 8, name: 'مرش مياه يدوي 2 لتر', category: 'أدوات زراعية', price: 18.00, stock: 0, emoji: '💦' },
    { id: 9, name: 'حوض زهور فخار كبير', category: 'مستلزمات الحديقة', price: 40.00, stock: 12, emoji: '🏺' },
    { id: 10, name: 'قفازات حماية زراعية', category: 'مستلزمات الحديقة', price: 12.00, stock: 50, emoji: '🧤' },
]

const categories = ['بذور ونباتات', 'أدوات زراعية', 'تربة وأسمدة', 'مستلزمات الحديقة']

export default function ProductsIndex() {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [viewMode, setViewMode] = useState('grid')

    const filtered = sampleProducts.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <AppLayout title="المنتجات" subtitle={`${filtered.length} منتج متوفر حالياً`}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" dir="rtl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <SearchInput
                        placeholder="البحث عن المنتجات..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sm:w-72"
                    />
                    <CategoryFilter
                        categories={categories}
                        selected={selectedCategory}
                        onChange={setSelectedCategory}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center bg-[#EAE8E2] rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-[#7C7870]'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-[#7C7870]'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button icon={Plus}>إضافة منتج</Button>
                </div>
            </div>

            {/* Product Grid / List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {filtered.map((product, i) => (
                        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden text-right" dir="rtl">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#EAE8E2]" style={{ backgroundColor: '#FAF9F6' }}>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3">المنتج</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3 hidden sm:table-cell">القسم</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3">السعر</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3 hidden md:table-cell">المخزون</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((product) => (
                                <tr key={product.id} className="border-b border-[#FAF9F6] hover:bg-[#FAF9F6]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{product.emoji}</span>
                                            <span className="text-sm font-semibold text-[#1A2D23]">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#7C7870] hidden sm:table-cell">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-[#1A2D23]">{product.price.toFixed(2)} د.إ</td>
                                    <td className="px-6 py-4 text-sm text-[#7C7870] hidden md:table-cell">
                                        {product.stock === 0 ? (
                                            <span className="text-[#C0392B] font-semibold">نفذت الكمية</span>
                                        ) : product.stock <= 5 ? (
                                            <span className="text-[#D4A017] font-semibold">مخزون منخفض ({product.stock})</span>
                                        ) : (
                                            <span>{product.stock} وحدات</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AppLayout>
    )
}
