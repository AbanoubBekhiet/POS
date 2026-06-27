import { useState, useEffect, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import { SearchInput } from '../../shared/components'
import Cart from './components/Cart'
import POSProductCard from './components/POSProductCard'
import PendingCartsPanel from './components/PendingCartsPanel'
import CategoryFilter from '../products/components/CategoryFilter'
import { Minimize2, ArrowLeft, RefreshCw, ShoppingBag, Printer, X, Check, AlertCircle } from 'lucide-react'

export default function POSIndex({ products: paginationData, categories, customers, pendingCarts }) {
    const { flash } = usePage().props

    // ── Active cart state (starts empty) ──────────────────────────────
    const [cart, setCart]                         = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [showCart, setShowCart]                 = useState(false)
    const [isSaving, setIsSaving]                 = useState(false)

    // Receipt print preview state
    const [receipt, setReceipt]                   = useState(null)

    // Notification states
    const [notice, setNotice]                     = useState(null)

    // ── Products infinite-scroll ───────────────────────────────────────
    const [isSearching, setIsSearching]           = useState(false)
    const [displayedProducts, setDisplayedProducts] = useState([])
    const [productSearch, setProductSearch]        = useState({ query: '', category_id: '' })
    const loadMoreRef = useRef(null)

    useEffect(() => {
        if (!paginationData) return
        if (!paginationData.prev_page_url) {
            setDisplayedProducts(paginationData.data || [])
        } else {
            setDisplayedProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id))
                const uniqueNew = (paginationData.data || []).filter(p => !existingIds.has(p.id))
                return [...prev, ...uniqueNew]
            })
        }
    }, [paginationData])

    useEffect(() => {
        setIsSearching(true)
        const timer = setTimeout(() => {
            router.get(window.location.pathname, {
                query: productSearch.query || undefined,
                category_id: productSearch.category_id || undefined,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                onFinish: () => setIsSearching(false),
            })
        }, 300)
        return () => clearTimeout(timer)
    }, [productSearch.query, productSearch.category_id])

    useEffect(() => {
        if (!paginationData?.next_page_url || isSearching) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    router.get(paginationData.next_page_url, {
                        query: productSearch.query || undefined,
                        category_id: productSearch.category_id || undefined,
                    }, {
                        preserveState: true,
                        preserveScroll: true,
                        only: ['products'],
                    })
                }
            },
            { threshold: 0.1 }
        )
        const el = loadMoreRef.current
        if (el) observer.observe(el)
        return () => { if (el) observer.unobserve(el) }
    }, [paginationData?.next_page_url, isSearching, productSearch])

    // ── Flash notifications handler ────────────────────────────────────
    useEffect(() => {
        if (flash?.success) {
            setNotice({ type: 'success', text: flash.success })
            const t = setTimeout(() => setNotice(null), 4000)
            return () => clearTimeout(t)
        }
        if (flash?.error) {
            setNotice({ type: 'error', text: flash.error })
            const t = setTimeout(() => setNotice(null), 5000)
            return () => clearTimeout(t)
        }
    }, [flash?.success, flash?.error])

    // Handle resumed cart flash
    useEffect(() => {
        if (flash?.resumed_cart) {
            setCart(flash.resumed_cart.items || [])
            setSelectedCustomer(flash.resumed_cart.customer || null)
        }
    }, [flash?.resumed_cart])

    // Handle completed order flash (receipt)
    useEffect(() => {
        if (flash?.completed_order) {
            setReceipt(flash.completed_order)
            setCart([])
            setSelectedCustomer(null)
        }
    }, [flash?.completed_order])

    // ── Cart manipulation ──────────────────────────────────────────────
    const addToCart = (product) => {
        // Find product stock in database
        if (product.stock <= 0) {
            setNotice({ type: 'error', text: 'المنتج نفذ من المخزون!' })
            return
        }

        setCart(prev => {
            const existing = prev.find(i => i.id === product.id)
            if (existing) {
                if (existing.quantity >= product.stock) {
                    setNotice({ type: 'error', text: 'لا يمكن إضافة كمية أكبر من المخزون المتوفر!' })
                    return prev
                }
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const increment = (id) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                if (i.quantity >= i.stock) {
                    setNotice({ type: 'error', text: 'الكمية المطلوبة تتجاوز المخزون المتوفر!' })
                    return i
                }
                return { ...i, quantity: i.quantity + 1 }
            }
            return i
        }))
    }

    const decrement = (id) => setCart(prev => {
        const item = prev.find(i => i.id === id)
        if (item && item.quantity === 1) {
            return prev.filter(i => i.id !== id)
        }
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
    })
    const changeQuantity = (id, newQty) => {
        if (newQty <= 0) {
            setCart(prev => prev.filter(i => i.id !== id))
            return
        }
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                if (newQty > i.stock) {
                    setNotice({ type: 'error', text: `الكمية المطلوبة تتجاوز المخزون المتوفر (${i.stock})!` })
                    return { ...i, quantity: i.stock }
                }
                return { ...i, quantity: newQty }
            }
            return i
        }))
    }
    const remove    = (id) => setCart(prev => prev.filter(i => i.id !== id))
    const changePrice = (id, newPrice) => setCart(prev => prev.map(i => i.id === id ? { ...i, price: newPrice } : i))
    const clearCart = ()   => {
        setCart([])
        setSelectedCustomer(null)
    }

    // ── Save current cart as pending (Inertia POST) ────────────────────
    const handleSaveCart = (customer) => {
        if (cart.length === 0 || isSaving) return

        const total      = cart.reduce((s, i) => s + i.price * i.quantity, 0)
        const items_count = cart.reduce((s, i) => s + i.quantity, 0)

        setIsSaving(true)
        router.post('/pos/pending-carts', {
            customer_id: customer.id,
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total: parseFloat(total.toFixed(2)),
            items_count,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['pendingCarts', 'flash'],
            onFinish: () => {
                setIsSaving(false)
                clearCart()
            },
        })
    }

    // ── Swap/Resume a pending cart ─────────────────────────────────────
    const handleResume = (pendingCart) => {
        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
        const items_count = cart.reduce((s, i) => s + i.quantity, 0)

        if (cart.length > 0) {
            if (!selectedCustomer) {
                setNotice({ type: 'error', text: 'يرجى اختيار عميل أولاً لحفظ السلة الحالية كسلة معلقة قبل الاستبدال' })
                return
            }

            // Sync swap: save current active cart to DB and resume the target pending cart
            setIsSaving(true)
            router.post('/pos/pending-carts/swap', {
                resume_pending_cart_id: pendingCart.id,
                customer_id: selectedCustomer.id,
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: parseFloat(total.toFixed(2)),
                items_count,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['pendingCarts', 'flash'],
                onFinish: () => setIsSaving(false),
            })
        } else {
            // Direct resume (active cart is empty): loads target and deletes from DB
            setIsSaving(true)
            router.post('/pos/pending-carts/swap', {
                resume_pending_cart_id: pendingCart.id,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['pendingCarts', 'flash'],
                onFinish: () => setIsSaving(false),
            })
        }
    }

    // ── Complete order (creates order, reduces stock) ─────────────────
    const handleCompleteOrder = (customer) => {
        if (cart.length === 0 || isSaving) return

        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

        setIsSaving(true)
        router.post('/pos/complete-order', {
            customer_id: customer.id,
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total_price: parseFloat(total.toFixed(2)),
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        })
    }

    const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0)

    return (
        <div className="h-screen flex flex-col overflow-hidden text-right" style={{ backgroundColor: '#FAF9F6' }} dir="rtl">
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-receipt-area, #print-receipt-area * {
                        visibility: visible;
                    }
                    #print-receipt-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}} />

            {/* ── Header ── */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-[#EAE8E2] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.visit('/')}
                        className="p-2 rounded-xl hover:bg-[#FAF9F6] transition-colors border border-[#EAE8E2]"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#5C5950]" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#1A2D23] font-serif">شاشة المبيعات</h1>
                        <p className="text-xs text-[#9A978F]">نظام نقاط البيع السريع</p>
                    </div>
                </div>

                {/* Toast Notification area */}
                {notice && (
                    <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all shadow-sm ${
                        notice.type === 'success'
                            ? 'bg-[#EAF6EE] border-[#B7E1C5] text-[#2E5A44]'
                            : 'bg-[#FDEEEC] border-[#F5C2C0] text-[#C0392B]'
                    }`}>
                        {notice.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {notice.text}
                    </div>
                )}

                {/* Mobile cart toggle */}
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="lg:hidden relative p-2.5 rounded-xl bg-[#D5E6DC] text-[#2E5A44] border border-[#ADCBBB]"
                >
                    <ShoppingBag className="w-5 h-5" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2E5A44] text-white text-[10px] font-bold flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </header>

            {/* Mobile notification fallback */}
            {notice && (
                <div className={`md:hidden flex items-center gap-2 p-3 border-b text-xs font-bold ${
                    notice.type === 'success'
                        ? 'bg-[#EAF6EE] border-[#B7E1C5] text-[#2E5A44]'
                        : 'bg-[#FDEEEC] border-[#F5C2C0] text-[#C0392B]'
                }`}>
                    {notice.text}
                </div>
            )}

            {/* ── Main Workspace ── */}
            <div className="flex-1 flex overflow-hidden">

                {/* COLUMN 1: Pending Carts */}
                <PendingCartsPanel onResume={handleResume} />

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
                            onChange={(categoryId) => setProductSearch({
                                ...productSearch,
                                category_id: categoryId === 'all' ? '' : categoryId,
                            })}
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

                                {/* Infinite scroll anchor for products */}
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

                {/* COLUMN 3: Active Cart */}
                <div className={`w-full lg:w-96 xl:w-[400px] flex-shrink-0 border-r border-[#EAE8E2] bg-white ${showCart ? 'flex' : 'hidden lg:flex'} flex-col h-full overflow-hidden`}>
                    <div className="lg:hidden p-3 border-b border-[#EAE8E2] bg-[#FAF9F6]">
                        <button
                            onClick={() => setShowCart(false)}
                            className="flex items-center gap-2 text-sm font-bold text-[#5C5950] hover:text-[#1A2D23]"
                        >
                            <Minimize2 className="w-4 h-4" />
                            العودة لقائمة المنتجات
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <Cart
                            items={cart}
                            onIncrement={increment}
                            onDecrement={decrement}
                            onQuantityChange={changeQuantity}
                            onRemove={remove}
                            onPriceChange={changePrice}
                            onClear={clearCart}
                            onSaveCart={handleSaveCart}
                            onCompleteOrder={handleCompleteOrder}
                            customers={customers}
                            selectedCustomer={selectedCustomer}
                            setSelectedCustomer={setSelectedCustomer}
                            isSaving={isSaving}
                        />
                    </div>
                </div>
            </div>

            {/* ── Receipt Print Modal with Blurred Background ── */}
            {receipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2D23]/40 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-[zoomIn_0.2s_ease-out]">
                        
                        {/* Header controls (No print) */}
                        <div className="no-print flex items-center justify-between px-6 py-4 bg-[#FAF9F6] border-b border-[#EAE8E2]">
                            <h3 className="text-base font-bold text-[#1A2D23]">معاينة وتفاصيل الفاتورة</h3>
                            <button
                                onClick={() => setReceipt(null)}
                                className="p-1.5 rounded-lg hover:bg-[#EAE8E2] text-[#9A978F] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Printable Area */}
                        <div className="p-8 overflow-y-auto max-h-[70vh] flex-1" id="print-receipt-area">
                            <div className="flex flex-col items-center text-center pb-6 border-b border-dashed border-[#EAE8E2]">
                                <div className="w-14 h-14 rounded-full bg-[#EAF6EE] text-[#2E5A44] flex items-center justify-center mb-3">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-[#1A2D23]">فاتورة بيع نقدي</h2>
                                <p className="text-xs text-[#9A978F] mt-1">متجر نقاط البيع المتكاملة</p>
                            </div>

                            {/* Details list */}
                            <div className="py-4 space-y-2.5 text-sm border-b border-dashed border-[#EAE8E2]">
                                <div className="flex justify-between flex-row-reverse text-right">
                                    <span className="text-[#9A978F]">رقم الفاتورة:</span>
                                    <span className="font-bold text-[#1A2D23] font-serif">{receipt.order_number}</span>
                                </div>
                                <div className="flex justify-between flex-row-reverse text-right">
                                    <span className="text-[#9A978F]">تاريخ الفاتورة:</span>
                                    <span className="font-semibold text-[#5C5950]">{receipt.date}</span>
                                </div>
                                <div className="flex justify-between flex-row-reverse text-right">
                                    <span className="text-[#9A978F]">العميل:</span>
                                    <span className="font-bold text-[#2E5A44]">{receipt.customer_name}</span>
                                </div>
                            </div>

                            {/* Items table */}
                            <div className="py-4 border-b border-dashed border-[#EAE8E2]">
                                <h4 className="text-xs font-bold text-[#9A978F] mb-3 text-right">المنتجات</h4>
                                <div className="space-y-3">
                                    {receipt.items.map((item, idx) => (
                                        <div key={idx} className="flex items-start justify-between text-sm flex-row-reverse text-right">
                                            <div className="flex-1 pr-2">
                                                <p className="font-bold text-[#1A2D23]">{item.name}</p>
                                                <p className="text-xs text-[#9A978F]">
                                                    {item.quantity} × {parseFloat(item.price).toFixed(2)} ج.م
                                                </p>
                                            </div>
                                            <span className="font-semibold text-[#1A2D23]">
                                                {parseFloat(item.total_price).toFixed(2)} ج
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total summary */}
                            <div className="pt-6 flex justify-between items-center flex-row-reverse text-right">
                                <span className="text-base font-bold text-[#1A2D23]">الإجمالي المستحق</span>
                                <span className="text-2xl font-black text-[#2E5A44] font-serif">
                                    {parseFloat(receipt.total_price).toFixed(2)} ج.م
                                </span>
                            </div>

                            {/* Footer note */}
                            <div className="mt-8 text-center text-xs text-[#C8C5BE] border-t border-dashed border-[#EAE8E2] pt-4">
                                شكراً لتعاملكم معنا ونتمنى لكم يوماً سعيداً
                            </div>
                        </div>

                        {/* Actions (No print) */}
                        <div className="no-print px-6 py-4 bg-[#FAF9F6] border-t border-[#EAE8E2] flex gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#2E5A44] hover:bg-[#234533] text-white transition-all shadow-md active:scale-95"
                            >
                                <Printer className="w-4 h-4" />
                                طباعة الفاتورة
                            </button>
                            <button
                                onClick={() => setReceipt(null)}
                                className="flex-1 py-3 rounded-xl font-bold text-sm bg-white border border-[#D6D4CE] text-[#5C5950] hover:bg-[#EAE8E2] transition-all active:scale-95"
                            >
                                إغلاق
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}