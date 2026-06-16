import { useState } from 'react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Button, SearchInput } from '../../shared/components'
import ProductCard from './components/ProductCard'
import CategoryFilter from './components/CategoryFilter'
import { Plus, LayoutGrid, List } from 'lucide-react'

const sampleProducts = [
    { id: 1, name: 'Espresso Shot', category: 'Beverages', price: 5.00, stock: 120, emoji: '☕' },
    { id: 2, name: 'Chicken Sandwich', category: 'Food', price: 8.00, stock: 45, emoji: '🥪' },
    { id: 3, name: 'Caesar Salad', category: 'Food', price: 7.00, stock: 30, emoji: '🥗' },
    { id: 4, name: 'Iced Latte', category: 'Beverages', price: 5.00, stock: 85, emoji: '🧊' },
    { id: 5, name: 'Blueberry Muffin', category: 'Bakery', price: 3.00, stock: 60, emoji: '🧁' },
    { id: 6, name: 'Orange Juice', category: 'Beverages', price: 4.50, stock: 0, emoji: '🍊' },
    { id: 7, name: 'Margherita Pizza', category: 'Food', price: 12.00, stock: 3, emoji: '🍕' },
    { id: 8, name: 'Chocolate Cake', category: 'Bakery', price: 6.50, stock: 18, emoji: '🍰' },
    { id: 9, name: 'Green Tea', category: 'Beverages', price: 3.50, stock: 90, emoji: '🍵' },
    { id: 10, name: 'Croissant', category: 'Bakery', price: 2.50, stock: 42, emoji: '🥐' },
    { id: 11, name: 'Beef Burger', category: 'Food', price: 10.00, stock: 25, emoji: '🍔' },
    { id: 12, name: 'Milkshake', category: 'Beverages', price: 6.00, stock: 55, emoji: '🥤' },
]

const categories = ['Beverages', 'Food', 'Bakery']

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
        <AppLayout title="Products" subtitle={`${filtered.length} products available`}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <SearchInput
                        placeholder="Search products..."
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
                    <div className="flex items-center bg-surface-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button icon={Plus}>Add Product</Button>
                </div>
            </div>

            {/* Product Grid */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {filtered.map((product, i) => (
                        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-100">
                                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Product</th>
                                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Category</th>
                                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">Price</th>
                                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((product) => (
                                <tr key={product.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{product.emoji}</span>
                                            <span className="text-sm font-semibold text-surface-800">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-surface-500 hidden sm:table-cell">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-surface-800">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-surface-500 hidden md:table-cell">{product.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AppLayout>
    )
}
