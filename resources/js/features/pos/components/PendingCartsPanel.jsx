import { useState, useEffect, useRef, useCallback } from 'react'
import { usePage, router } from '@inertiajs/react'
import { Trash2, RefreshCw, Archive } from 'lucide-react'

export default function PendingCartsPanel({ onResume }) {
    const { pendingCarts: pageData } = usePage().props

    // Accumulate pages locally — Inertia replaces props on each reload
    const [allCarts, setAllCarts] = useState(pageData?.data || [])
    const [currentPage, setCurrentPage] = useState(pageData?.current_page || 1)
    const [lastPage, setLastPage]     = useState(pageData?.last_page || 1)
    const [isLoading, setIsLoading]   = useState(false)

    const loadMoreRef = useRef(null)
    const canLoadMore = currentPage < lastPage

    // ── Watch for Inertia prop updates ────────────────────────────────
    // When a save/delete/load-more partial reload completes, pageData changes.
    useEffect(() => {
        if (!pageData) return

        if (pageData.current_page === 1) {
            // Fresh first page (after save or delete)
            setAllCarts(pageData.data || [])
        } else {
            // Appending subsequent pages (infinite scroll)
            setAllCarts(prev => {
                const existingIds = new Set(prev.map(c => c.id))
                const unique = (pageData.data || []).filter(c => !existingIds.has(c.id))
                return [...prev, ...unique]
            })
        }

        setCurrentPage(pageData.current_page || 1)
        setLastPage(pageData.last_page || 1)
        setIsLoading(false)
    }, [pageData])

    // ── Load next page via Inertia partial reload ─────────────────────
    const loadMore = useCallback(() => {
        if (isLoading || !canLoadMore) return
        setIsLoading(true)
        router.get(
            '/pos',
            { pending_page: currentPage + 1 },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['pendingCarts'],
            }
        )
    }, [isLoading, canLoadMore, currentPage])

    // ── Infinite scroll observer ───────────────────────────────────────
    useEffect(() => {
        if (!canLoadMore) return
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore() },
            { threshold: 0.1 }
        )
        const el = loadMoreRef.current
        if (el) observer.observe(el)
        return () => { if (el) observer.unobserve(el) }
    }, [canLoadMore, loadMore])

    // ── Delete a pending cart ─────────────────────────────────────────
    const handleDelete = (id, e) => {
        e.stopPropagation()
        router.delete(`/pos/pending-carts/${id}`, {
            preserveState: true,
            preserveScroll: true,
            only: ['pendingCarts'],
        })
    }

    // ── Resume a cart (move it to the active working cart) ────────────
    const handleResume = (cart) => {
        onResume(cart)
    }

    const formatTime = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="hidden xl:flex w-72 flex-col bg-white border-l border-[#EAE8E2] flex-shrink-0 overflow-hidden">
            {/* Panel Header */}
            <div className="p-4 border-b border-[#EAE8E2] flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] text-[#5C5950]">
                    {allCarts.length}
                </span>
                <h3 className="text-sm font-bold text-[#1A2D23]">السلات المعلقة</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {allCarts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 gap-3 pt-12">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center">
                            <Archive className="w-6 h-6 text-[#C8C5BE]" />
                        </div>
                        <p className="text-xs font-semibold text-[#9A978F]">لا توجد سلات معلقة</p>
                    </div>
                ) : (
                    <>
                        {allCarts.map((cart) => (
                            <div
                                key={cart.id}
                                onClick={() => handleResume(cart)}
                                className="p-3 rounded-xl border border-[#EAE8E2] bg-[#FAF9F6]/50 hover:bg-[#FAF9F6] hover:border-[#ADCBBB] cursor-pointer transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-[#9A978F]">
                                        {formatTime(cart.created_at)}
                                    </span>
                                    <h4 className="text-xs font-bold text-[#1A2D23] truncate max-w-[150px]">
                                        {cart.customer?.name || 'عميل غير محدد'}
                                    </h4>
                                </div>
                                <div className="flex items-center justify-between mt-2.5">
                                    <button
                                        onClick={(e) => handleDelete(cart.id, e)}
                                        className="p-1 rounded hover:bg-[#FDEEEC] text-[#9A978F] hover:text-[#C0392B] opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="حذف السلة"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="text-left">
                                        <p className="text-xs font-semibold" style={{ color: '#2E5A44' }}>
                                            {parseFloat(cart.total).toFixed(2)} ج
                                        </p>
                                        <p className="text-[10px] text-[#9A978F]">{cart.items_count} عناصر</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Infinite scroll anchor */}
                        <div ref={loadMoreRef} className="py-2 flex justify-center">
                            {isLoading && (
                                <span className="flex items-center gap-1.5 text-[10px] text-[#9A978F] animate-pulse">
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    تحميل المزيد...
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
