import { useState } from 'react'
import { SearchInput } from '../../shared/components'
import Cart from './components/Cart'
import POSProductCard from './components/POSProductCard'
import CategoryFilter from '../products/components/CategoryFilter'
import { Zap, Maximize2, Minimize2 } from 'lucide-react'

const products = [
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

export default function POSIndex() {
    const [cart, setCart] = useState([])
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showCart, setShowCart] = useState(false)

    const filtered = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id)
            if (existing) {
                return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const increment = (id) => {
        setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    }

    const decrement = (id) => {
        setCart((prev) =>
            prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i)
        )
    }

    const remove = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id))
    }

    const clearCart = () => setCart([])

    const handleCheckout = (method) => {
        alert(`Order placed via ${method}! Total: $${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`)
        clearCart()
    }

    const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <div className="h-screen flex flex-col bg-surface-50 overflow-hidden">
            {/* POS Header */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-surface-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                        <Zap className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-surface-900">Point of Sale</h1>
                        <p className="text-xs text-surface-400">Quick checkout terminal</p>
                    </div>
                </div>

                {/* Mobile cart toggle */}
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="lg:hidden relative p-2.5 rounded-xl bg-primary-50 text-primary-600"
                >
                    <Maximize2 className="w-5 h-5" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Products Side */}
                <div className={`flex-1 flex flex-col overflow-hidden ${showCart ? 'hidden lg:flex' : ''}`}>
                    {/* Filters */}
                    <div className="px-4 sm:px-6 py-4 space-y-3 border-b border-surface-100 bg-white flex-shrink-0">
                        <SearchInput
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <CategoryFilter
                            categories={categories}
                            selected={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {filtered.map((product) => (
                                <POSProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={addToCart}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Side */}
                <div className={`
                    w-full lg:w-96 xl:w-[420px] flex-shrink-0 border-l border-surface-100
                    ${showCart ? '' : 'hidden lg:block'}
                `}>
                    <div className="h-full flex flex-col">
                        {/* Mobile back button */}
                        <div className="lg:hidden p-3 border-b border-surface-100">
                            <button
                                onClick={() => setShowCart(false)}
                                className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700"
                            >
                                <Minimize2 className="w-4 h-4" />
                                Back to products
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <Cart
                                items={cart}
                                onIncrement={increment}
                                onDecrement={decrement}
                                onRemove={remove}
                                onClear={clearCart}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
