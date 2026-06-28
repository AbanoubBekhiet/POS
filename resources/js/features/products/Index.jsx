import { useState, useEffect, useRef } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Button, SearchInput } from '../../shared/components'
import ProductCard from './components/ProductCard'
import CategoryFilter from './components/CategoryFilter'
import { Plus, LayoutGrid, List, Edit2, Trash2, X, Image as ImageIcon, UploadCloud, Info } from 'lucide-react'

export default function ProductsIndex({ products = { data: [], current_page: 1, next_page: null }, total_count = 0, categories = [], filters = {} }) {
    const { flash } = usePage().props
    const [alert, setAlert] = useState(null)

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success })
            const timer = setTimeout(() => setAlert(null), 4000)
            return () => clearTimeout(timer)
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error })
            const timer = setTimeout(() => setAlert(null), 8000) 
            return () => clearTimeout(timer)
        }
    }, [flash])

    const [search, setSearch] = useState(filters?.search || '')
    const [selectedCategory, setSelectedCategory] = useState(filters?.category_id || 'all')
    const [viewMode, setViewMode] = useState('grid')
    
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [importFile, setImportFile] = useState(null)

    // Infinite Scroll States
    const [loadedProducts, setLoadedProducts] = useState(products.data || [])
    const [nextPage, setNextPage] = useState(products.next_page)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadMoreRef = useRef(null)

    // Sync loaded products when products prop changes
    useEffect(() => {
        if (products.current_page === 1) {
            setLoadedProducts(products.data || [])
        } else {
            setLoadedProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id))
                const newItems = (products.data || []).filter(p => !existingIds.has(p.id))
                return [...prev, ...newItems]
            })
        }
        setNextPage(products.next_page)
        setIsLoadingMore(false)
    }, [products])

    // Backend filtering (resets to page 1)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '') || selectedCategory !== (filters?.category_id || 'all')) {
                const queryParams = { page: 1 }
                if (search) queryParams.search = search
                if (selectedCategory && selectedCategory !== 'all') {
                    queryParams.category_id = selectedCategory
                }
                
                router.get('/products', queryParams, { 
                    preserveState: true,
                    replace: true
                })
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [search, selectedCategory])

    // Load more nextPage items
    const loadMore = () => {
        if (!nextPage || isLoadingMore) return
        setIsLoadingMore(true)

        const queryParams = { page: nextPage }
        if (search) queryParams.search = search
        if (selectedCategory && selectedCategory !== 'all') {
            queryParams.category_id = selectedCategory
        }

        router.get('/products', queryParams, {
            preserveState: true,
            preserveScroll: true,
            only: ['products']
        })
    }

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        if (!nextPage || isLoadingMore) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore()
            }
        }, { threshold: 0.1 })

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current)
            }
        }
    }, [nextPage, isLoadingMore, search, selectedCategory])

    const { data, setData, post, processing, reset, clearErrors, errors } = useForm({
        name: '',
        price: '',
        cost_price: '',
        stock: '',
        unit: 'علبة',
        number_of_items_in_unit: 1,
        category_id: '',
        description: '',
        image: null,
        _method: 'POST'
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setData('image', file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const openAddModal = () => {
        clearErrors()
        reset()
        setData({
            name: '',
            price: '',
            cost_price: '',
            stock: '',
            unit: 'علبة',
            number_of_items_in_unit: 1,
            category_id: categories[0]?.id || '',
            description: '',
            image: null,
            _method: 'POST'
        })
        setImagePreview(null)
        setIsAddOpen(true)
    }

    const openEditModal = (product) => {
        clearErrors()
        setEditingProduct(product)
        setData({
            name: product.name,
            price: product.price,
            cost_price: product.cost_price || '',
            stock: product.stock,
            unit: product.unit,
            number_of_items_in_unit: product.number_of_items_in_unit,
            category_id: product.category_id,
            description: product.description || '',
            image: null,
            _method: 'PUT'
        })
        setImagePreview(product.image_url || null)
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post('/products', {
            onSuccess: () => {
                setIsAddOpen(false)
                reset()
                setImagePreview(null)
            }
        })
    }

    const handleEditSubmit = (e) => {
        e.preventDefault()
        post(`/products/${editingProduct.id}`, {
            onSuccess: () => {
                setEditingProduct(null)
                reset()
                setImagePreview(null)
            }
        })
    }

    const handleDelete = (product) => {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            router.delete(`/products/${product.id}`)
        }
    }

    const handleImportSubmit = (e) => {
        e.preventDefault()
        if (!importFile) return

        const formData = new FormData()
        formData.append('file', importFile)

        router.post('/products/import', formData, {
            onSuccess: () => {
                setIsImportOpen(false)
                setImportFile(null)
            }
        })
    }

    return (
        <AppLayout title="المنتجات" subtitle={`إجمالي ${total_count || loadedProducts.length} منتج متوفر`}>
            {/* Status/Flash Alerts */}
            {alert && (
                <div 
                    className="p-4 rounded-xl text-sm font-semibold text-center mb-6 border transition-all animate-fade-in relative flex items-center justify-between gap-4"
                    style={{
                        backgroundColor: alert.type === 'success' ? '#EBF5EF' : '#FDEEEC',
                        borderColor: alert.type === 'success' ? '#ADCBBB' : '#E8A09A',
                        color: alert.type === 'success' ? '#2E5A44' : '#922B21'
                    }}
                    dir="rtl"
                >
                    <span className="flex-1 text-right">{alert.message}</span>
                    <button 
                        onClick={() => setAlert(null)}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

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
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="px-4 py-2.5 rounded-xl font-bold text-sm border border-[#2E5A44] text-[#2E5A44] transition-all hover:bg-[#EEF4F1] active:scale-95 flex items-center justify-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        استيراد (CSV)
                    </button>
                    <Button icon={Plus} onClick={openAddModal}>إضافة منتج</Button>
                </div>
            </div>

            {/* Product Grid / List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {loadedProducts.map((product, i) => (
                        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                            <ProductCard 
                                product={product} 
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                    {loadedProducts.length === 0 && (
                        <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-[#EAE8E2]">
                            <p className="text-sm font-semibold text-[#9A978F]">لم يتم العثور على أي منتج مطابق للبحث</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden text-right" dir="rtl">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-[#EAE8E2]" style={{ backgroundColor: '#FAF9F6' }}>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3">المنتج</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3 hidden sm:table-cell">القسم</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3">سعر البيع</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3 hidden lg:table-cell">سعر التكلفة</th>
                                <th className="text-right text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3 hidden md:table-cell">المخزون</th>
                                <th className="text-left text-xs font-semibold text-[#9A978F] uppercase tracking-wider px-6 py-3">الخيارات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadedProducts.map((product) => (
                                <tr key={product.id} className="border-b border-[#FAF9F6] hover:bg-[#FAF9F6]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.image_url ? (
                                                <img 
                                                    src={product.image_url} 
                                                    alt={product.name} 
                                                    className="w-10 h-10 rounded-xl object-cover border border-[#EAE8E2]"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-[#EEF4F1] flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-[#2E5A44]" />
                                                </div>
                                            )}
                                            <span className="text-sm font-semibold text-[#1A2D23]">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#7C7870] hidden sm:table-cell">{product.category_name}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-[#1A2D23]">{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        {product.cost_price > 0
                                            ? <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>{product.cost_price.toFixed(2)} ج.م</span>
                                            : <span className="text-xs text-[#B8B5AE]">—</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#7C7870] hidden md:table-cell">
                                        {product.stock === 0 ? (
                                            <span className="text-[#C0392B] font-semibold">نفذت الكمية</span>
                                        ) : product.stock <= 5 ? (
                                            <span className="text-[#D4A017] font-semibold">مخزون منخفض ({product.stock} {product.unit})</span>
                                        ) : (
                                            <span>{product.stock} {product.unit}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#7C7870] hover:text-[#2E5A44] transition-colors"
                                                title="تعديل"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product)}
                                                className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#7C7870] hover:text-[#C0392B] transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {loadedProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm font-semibold text-[#9A978F]">
                                        لم يتم العثور على أي منتج مطابق للبحث
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Infinite Scroll Loader Target */}
            {nextPage && (
                <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                    <div className="w-6 h-6 border-2 border-[#2E5A44] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* ADD MODAL with BLURRED BACKGROUND */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF9F6]/70 backdrop-blur-md overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#EAE8E2] w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setIsAddOpen(false)}
                            className="absolute left-6 top-6 p-2 rounded-xl hover:bg-[#FAF9F6] text-[#9A978F] hover:text-[#1A2D23] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-bold text-[#1A2D23] mb-6 text-right">إضافة منتج جديد</h3>

                        <form onSubmit={handleAddSubmit} className="space-y-5 text-right" dir="rtl">
                            {/* Image Upload Zone */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>صورة المنتج</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-[#FAF9F6] transition-colors" style={{ borderColor: '#E2E0DA' }}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-8 h-8 text-[#9A978F] mb-2" />
                                                <p className="text-xs font-semibold text-[#5C5950]">اضغط لرفع صورة المنتج</p>
                                                <p className="text-[10px] text-[#B8B5AE] mt-1">PNG, JPG أو GIF بحد أقصى 2 ميجابايت</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                                {errors.image && <p className="text-xs text-[#C0392B] mt-1">{errors.image}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>اسم المنتج</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: سماد عضوي 10كجم"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-[#C0392B] mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>القسم</label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium appearance-none"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                        required
                                    >
                                        <option value="" disabled>اختر القسم</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-[#C0392B] mt-1">{errors.category_id}</p>}
                                </div>
                            </div>

                            {/* Price row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>سعر البيع</label>
                                    <input type="number" step="0.01" placeholder="0.00" value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required />
                                    {errors.price && <p className="text-xs text-[#C0392B] mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>سعر التكلفة</label>
                                    <input type="number" step="0.01" placeholder="0.00" value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #FDE68A', color: '#1A2D23' }} />
                                    {errors.cost_price && <p className="text-xs text-[#C0392B] mt-1">{errors.cost_price}</p>}
                                </div>
                            </div>
                            {/* Stock / Unit / Items row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الكمية المتوفرة</label>
                                    <input type="number" placeholder="0" value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required />
                                    {errors.stock && <p className="text-xs text-[#C0392B] mt-1">{errors.stock}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الوحدة</label>
                                    <select value={data.unit} onChange={(e) => setData('unit', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium appearance-none"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required>
                                        {['شكارة', 'علبة', 'كرتونة', 'شريط', 'دستة', 'لفة'].map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                    {errors.unit && <p className="text-xs text-[#C0392B] mt-1">{errors.unit}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>القطع داخل الوحدة</label>
                                    <input type="number" placeholder="1" value={data.number_of_items_in_unit}
                                        onChange={(e) => setData('number_of_items_in_unit', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required />
                                    {errors.number_of_items_in_unit && <p className="text-xs text-[#C0392B] mt-1">{errors.number_of_items_in_unit}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الوصف</label>
                                <textarea
                                    placeholder="اكتب وصفاً مبسطاً للمنتج..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium resize-none"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                                {errors.description && <p className="text-xs text-[#C0392B] mt-1">{errors.description}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#2E5A44' }}
                                >
                                    {processing ? 'جاري الحفظ...' : 'إضافة المنتج'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="flex-1 py-3 rounded-xl font-bold transition-all hover:bg-[#EAE8E2] border border-[#E2E0DA]"
                                    style={{ color: '#5C5950' }}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL with BLURRED BACKGROUND */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF9F6]/70 backdrop-blur-md overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-3xl border border-[#EAE8E2] w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative">
                        <button
                            onClick={() => setEditingProduct(null)}
                            className="absolute left-6 top-6 p-2 rounded-xl hover:bg-[#FAF9F6] text-[#9A978F] hover:text-[#1A2D23] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-bold text-[#1A2D23] mb-6 text-right">تعديل المنتج</h3>

                        <form onSubmit={handleEditSubmit} className="space-y-5 text-right" dir="rtl">
                            {/* Image Upload Zone */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>صورة المنتج</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-[#FAF9F6] transition-colors" style={{ borderColor: '#E2E0DA' }}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-8 h-8 text-[#9A978F] mb-2" />
                                                <p className="text-xs font-semibold text-[#5C5950]">اضغط لرفع صورة منتج جديدة</p>
                                                <p className="text-[10px] text-[#B8B5AE] mt-1">PNG, JPG أو GIF بحد أقصى 2 ميجابايت</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                                {errors.image && <p className="text-xs text-[#C0392B] mt-1">{errors.image}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>اسم المنتج</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: سماد عضوي 10كجم"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-[#C0392B] mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>القسم</label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium appearance-none"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                        required
                                    >
                                        <option value="" disabled>اختر القسم</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-[#C0392B] mt-1">{errors.category_id}</p>}
                                </div>
                            </div>

                            {/* Price row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>سعر البيع</label>
                                    <input type="number" step="0.01" placeholder="0.00" value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required />
                                    {errors.price && <p className="text-xs text-[#C0392B] mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>سعر التكلفة</label>
                                    <input type="number" step="0.01" placeholder="0.00" value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #FDE68A', color: '#1A2D23' }} />
                                    {errors.cost_price && <p className="text-xs text-[#C0392B] mt-1">{errors.cost_price}</p>}
                                </div>
                            </div>
                            {/* Stock / Unit / Items row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الكمية المتوفرة</label>
                                    <input type="number" placeholder="0" value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required />
                                    {errors.stock && <p className="text-xs text-[#C0392B] mt-1">{errors.stock}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الوحدة</label>
                                    <select value={data.unit} onChange={(e) => setData('unit', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium appearance-none"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required>
                                        {['شكارة', 'علبة', 'كرتونة', 'شريط', 'دستة', 'لفة'].map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                    {errors.unit && <p className="text-xs text-[#C0392B] mt-1">{errors.unit}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>القطع داخل الوحدة</label>
                                    <input type="number" placeholder="1" value={data.number_of_items_in_unit}
                                        onChange={(e) => setData('number_of_items_in_unit', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }} required />
                                    {errors.number_of_items_in_unit && <p className="text-xs text-[#C0392B] mt-1">{errors.number_of_items_in_unit}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>الوصف</label>
                                <textarea
                                    placeholder="اكتب وصفاً مبسطاً للمنتج..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium resize-none"
                                    style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                />
                                {errors.description && <p className="text-xs text-[#C0392B] mt-1">{errors.description}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-2"
                                    style={{ backgroundColor: '#2E5A44' }}
                                >
                                    {processing ? 'جاري الحفظ...' : 'تعديل المنتج'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 py-3 rounded-xl font-bold transition-all hover:bg-[#EAE8E2] border border-[#E2E0DA]"
                                    style={{ color: '#5C5950' }}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Excel/CSV Modal */}
            {isImportOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-[#EAE8E2] shadow-2xl">
                        <div className="px-6 py-4 border-b border-[#FAF9F6] flex items-center justify-between bg-[#FAF9F6]">
                            <h3 className="font-bold text-lg text-[#1A2D23] flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-primary-600" />
                                استيراد منتجات من ملف إكسل (CSV)
                            </h3>
                            <button onClick={() => setIsImportOpen(false)} className="p-1 rounded-lg hover:bg-white transition-colors">
                                <X className="w-5 h-5 text-[#9A978F]" />
                            </button>
                        </div>
                        <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
                            <div className="bg-[#FAF9F6] border border-[#EAE8E2] p-4 rounded-xl space-y-2 text-right">
                                <h4 className="font-bold text-xs text-[#1A2D23] flex items-center gap-1.5 justify-end">
                                    <span>تعليمات هامة للاستيراد</span>
                                    <Info className="w-4 h-4 text-primary-600" />
                                </h4>
                                <p className="text-xs text-[#7C7870] leading-relaxed font-semibold">
                                    يرجى حفظ ملف الإكسل بصيغة <strong>CSV (Comma Delimited)</strong> قبل رفعه. يجب أن يحتوي الصف الأول على الأسماء التالية للأعمدة:
                                </p>
                                <div className="bg-white p-2 rounded-lg border border-[#EAE8E2] text-xs font-mono text-center select-all block overflow-x-auto whitespace-nowrap">
                                    الاسم, السعر, سعر التكلفة, التصنيف, المخزون, الوحدة, القطع داخل الوحدة, الوصف
                                </div>
                                <p className="text-[10px] text-[#9A978F]">
                                    * أعمدة "الاسم"، "السعر"، و "التصنيف" مطلوبة بشكل أساسي لإتمام عملية الاستيراد. إذا كان التصنيف غير موجود، فسيقوم النظام بإنشائه تلقائياً.
                                </p>
                            </div>

                            <div className="space-y-1 text-right">
                                <label className="text-xs font-bold text-[#7C7870]">اختر ملف CSV</label>
                                <input
                                    type="file"
                                    accept=".csv,text/csv"
                                    onChange={e => setImportFile(e.target.files[0])}
                                    className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FAF9F6]">
                                <button
                                    type="button"
                                    onClick={() => setIsImportOpen(false)}
                                    className="px-4 py-2 border border-[#EAE8E2] rounded-xl text-sm font-bold text-[#7C7870] hover:bg-[#FAF9F6]"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={!importFile}
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                                    style={{ backgroundColor: '#2E5A44' }}
                                >
                                    بدء الاستيراد
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}
