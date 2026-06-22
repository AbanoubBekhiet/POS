import { useState, useEffect, useRef } from 'react'
import { SearchInput, Button } from '../../shared/components'
import Cart from './components/Cart'
import POSProductCard from './components/POSProductCard'
import CategoryFilter from '../products/components/CategoryFilter'
import { Zap, Maximize2, Minimize2, Trash2, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react'
import { router } from '@inertiajs/react' 

export default function POSIndex({ products: paginationData, categories ,customers,carts}) {
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    
    const [displayedProducts, setDisplayedProducts] = useState([])
    
    const [productSearch, setProductSearch] = useState({
        query: '',
        category_id: '',
    })
    
    const loadMoreRef = useRef(null)

    useEffect(() => {
        if (!paginationData) return

        // If there's no previous page URL, it means a fresh search/filter or route initial render occurred
        if (!paginationData.prev_page_url) {
            setDisplayedProducts(paginationData.data || [])
        } else {
            // Append incoming subsequent pagination pages cleanly
            setDisplayedProducts((prev) => {
                const existingIds = new Set(prev.map(p => p.id))
                const uniqueNew = (paginationData.data || []).filter(p => !existingIds.has(p.id))
                return [...prev, ...uniqueNew]
            })
        }
    }, [paginationData])

    useEffect(() => {
        setIsSearching(true)
        const delayDebounce = setTimeout(() => {
            router.get(window.location.pathname, {
                query: productSearch.query || undefined,
                category_id: productSearch.category_id || undefined
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['products'], // Request ONLY the updated products data array from Laravel
                onFinish: () => setIsSearching(false)
            })
        }, 300) 

        return () => clearTimeout(delayDebounce)
    }, [productSearch.query, productSearch.category_id])

    useEffect(() => {
        if (!paginationData?.next_page_url || isSearching) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    router.get(
                        paginationData.next_page_url,
                        {
                            query: productSearch.query || undefined,
                            category_id: productSearch.category_id || undefined
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            only: ['products']
                        }
                    )
                }
            },
            { threshold: 0.1 }
        )

        const currentTarget = loadMoreRef.current
        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) observer.unobserve(currentTarget)
        }
    }, [paginationData?.next_page_url, isSearching, productSearch])

    const [pendingCarts, setPendingCarts] = useState(carts)

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
        setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
    }

    const remove = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id))
    }

    const clearCart = () => setCart([])

    const handleCheckout = (method, customerId) => {
        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) * 1.14
        alert(`تم إتمام الطلب بنجاح!\nطريقة الدفع: ${method === 'cash' ? 'نقدي' : 'شبكة/فيزا'}\nالعميل: ${customerId}\nالقيمة الكلية: ${total.toFixed(2)} د.إ`)
        clearCart()
    }

    const handleHoldCart = (customerId) => {
        if (cart.length === 0) return
        const customerName = customerId === 'cash' ? 'عميل نقدي' :
            customerId === 'c1' ? 'مشتل الوادي الأخضر' :
            customerId === 'c2' ? 'مزرعة الروابي الزراعية' :
            customerId === 'c3' ? 'مؤسسة زهور الريف' : 'تنسيق حدائق الشروق'

        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) * 1.14
        const count = cart.reduce((s, i) => s + i.quantity, 0)

        const newHold = {
            id: 'pc_' + Date.now(),
            customerName,
            itemsCount: count,
            total: parseFloat(total.toFixed(2)),
            time: 'الآن',
            items: [...cart]
        }

        setPendingCarts([newHold, ...pendingCarts])
        clearCart()
        alert('تم تعليق السلة الحالية بنجاح.')
    }

    const resumeCart = (heldCart) => {
        if (cart.length > 0) {
            const confirmSwap = window.confirm('لديك عناصر في السلة الحالية. هل تود استبدالها بالسلة المعلقة؟')
            if (!confirmSwap) return
        }
        setCart(heldCart.items)
        setPendingCarts(pendingCarts.filter(c => c.id !== heldCart.id))
    }

    const deletePendingCart = (id, e) => {
        e.stopPropagation()
        setPendingCarts(pendingCarts.filter(c => c.id !== id))
    }

    const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <div className="h-screen flex flex-col overflow-hidden text-right" style={{ backgroundColor: '#FAF9F6' }} dir="rtl">
            {/* Header */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-[#EAE8E2] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="p-2 rounded-xl hover:bg-[#FAF9F6] transition-colors border border-[#EAE8E2]">
                        <ArrowLeft className="w-4 h-4 text-[#5C5950]" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#1A2D23] font-serif">شاشة المبيعات (أبو الدهب)</h1>
                        <p className="text-xs text-[#9A978F]">نظام نقاط البيع السريع</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setShowCart(!showCart)} className="lg:hidden relative p-2.5 rounded-xl bg-[#D5E6DC] text-[#2E5A44] border border-[#ADCBBB]">
                        <ShoppingBag className="w-5 h-5" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2E5A44] text-white text-[10px] font-bold flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* COLUMN 1: Pending Carts */}
                <div className="hidden xl:flex w-72 flex-col bg-white border-l border-[#EAE8E2] flex-shrink-0 overflow-hidden">
                    <div className="p-4 border-b border-[#EAE8E2] flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] text-[#5C5950]">
                            {pendingCarts.length}
                        </span>
                        <h3 className="text-sm font-bold text-[#1A2D23]">السلات المعلقة</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {pendingCarts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <p className="text-xs font-semibold text-[#9A978F]">لا توجد سلات معلقة</p>
                            </div>
                        ) : (
                            pendingCarts.map((item) => (
                                <div key={item.id} onClick={() => resumeCart(item)} className="p-3 rounded-xl border border-[#EAE8E2] bg-[#FAF9F6]/50 hover:bg-[#FAF9F6] cursor-pointer transition-all group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-[#9A978F]">{item.time}</span>
                                        <h4 className="text-xs font-bold text-[#1A2D23] truncate max-w-[150px]">{item.customerName}</h4>
                                    </div>
                                    <div className="flex items-center justify-between mt-2.5">
                                        <button onClick={(e) => deletePendingCart(item.id, e)} className="p-1 rounded hover:bg-[#FDEEEC] text-[#9A978F] hover:text-[#C0392B] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold" style={{ color: '#2E5A44' }}>{item.total.toFixed(2)} د.إ</p>
                                            <p className="text-[10px] text-[#9A978F]">{item.itemsCount} عناصر</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* COLUMN 2: Products Catalogue */}
                <div className={`flex-1 flex flex-col overflow-hidden ${showCart ? 'hidden lg:flex' : ''}`}>
                    <div className="p-4 space-y-3 bg-white border-b border-[#EAE8E2] flex-shrink-0">
                        <SearchInput
                            placeholder="ابحث باسم المنتج أو الباركود..."
                            value={productSearch.query}
                            onChange={(e) => setProductSearch({ ...productSearch, query: e.target.value })}
                        />
                        <CategoryFilter
                            categories={categories}
                            selected={productSearch.category_id}
                            onChange={(categoryId) => {
                                setProductSearch({ 
                                    ...productSearch, 
                                    category_id: categoryId === 'all' ? '' : categoryId 
                                })
                            }}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        {displayedProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <p className="text-sm font-semibold text-[#9A978F]">لم يتم العثور على أي منتج يطابق البحث</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
                                    {displayedProducts.map((product) => (
                                        <POSProductCard
                                            key={product.id}
                                            product={product}
                                            onAdd={addToCart}
                                        />
                                    ))}
                                </div>

                                {/* Anchor Element to trigger next page load */}
                                <div ref={loadMoreRef} className="py-6 flex justify-center text-sm text-[#5C5950]">
                                    {isSearching && (
                                        <span className="flex items-center gap-2 animate-pulse">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            جاري تحميل المزيد من المنتجات...
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: Current Checkout */}
                <div className={`w-full lg:w-96 xl:w-[400px] flex-shrink-0 border-r border-[#EAE8E2] bg-white ${showCart ? 'flex' : 'hidden lg:flex'} flex-col h-full overflow-hidden`}>
                    <div className="lg:hidden p-3 border-b border-[#EAE8E2] bg-[#FAF9F6]">
                        <button onClick={() => setShowCart(false)} className="flex items-center gap-2 text-sm font-bold text-[#5C5950] hover:text-[#1A2D23]">
                            <Minimize2 className="w-4 h-4" />
                            العودة لقائمة المنتجات
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
                            onHold={handleHoldCart}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}