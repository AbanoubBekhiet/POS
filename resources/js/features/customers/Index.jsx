import { useState, useEffect, useRef } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput, Button, Badge } from '../../shared/components'
import { Plus, Mail, Phone, MapPin, Store, Tag, X, Edit2, Trash2, UploadCloud, Info } from 'lucide-react'

export default function CustomersIndex({ customers = { data: [], current_page: 1, next_page: null }, filters = {} }) {
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
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [importFile, setImportFile] = useState(null)

    // Infinite Scroll States
    const [loadedCustomers, setLoadedCustomers] = useState(customers.data || [])
    const [nextPage, setNextPage] = useState(customers.next_page)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadMoreRef = useRef(null)

    // Sync loaded customers when customers prop changes
    useEffect(() => {
        if (customers.current_page === 1) {
            setLoadedCustomers(customers.data || [])
        } else {
            setLoadedCustomers(prev => {
                const existingIds = new Set(prev.map(c => c.id))
                const newItems = (customers.data || []).filter(c => !existingIds.has(c.id))
                return [...prev, ...newItems]
            })
        }
        setNextPage(customers.next_page)
        setIsLoadingMore(false)
    }, [customers])

    // Trigger search filter (resets to page 1)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get('/customers', { search }, { preserveState: true, replace: true })
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    // Load more nextPage items
    const loadMore = () => {
        if (!nextPage || isLoadingMore) return
        setIsLoadingMore(true)

        const queryParams = { page: nextPage }
        if (search) queryParams.search = search

        router.get('/customers', queryParams, {
            preserveState: true,
            preserveScroll: true,
            only: ['customers']
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
    }, [nextPage, isLoadingMore, search])

    // Forms
    const { data, setData, post, put, processing, reset, clearErrors, errors } = useForm({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        shop_name: '',
        category_of_place: '',
    })

    const openAddModal = () => {
        reset()
        clearErrors()
        setIsAddOpen(true)
    }

    const openEditModal = (cust) => {
        clearErrors()
        setEditingCustomer(cust)
        setData({
            name: cust.name,
            email: cust.email === '—' ? '' : cust.email,
            phone_number: cust.phone === '—' ? '' : cust.phone,
            address: cust.address === '—' ? '' : cust.address,
            shop_name: cust.shop_name === '—' ? '' : cust.shop_name,
            category_of_place: cust.category_of_place === '—' ? '' : cust.category_of_place,
        })
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post('/customers', {
            onSuccess: () => {
                setIsAddOpen(false)
                reset()
            }
        })
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        put(`/customers/${editingCustomer.id}`, {
            onSuccess: () => {
                setEditingCustomer(null)
                reset()
            }
        })
    }

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
            router.delete(`/customers/${id}`)
        }
    }

    const handleImportSubmit = (e) => {
        e.preventDefault()
        if (!importFile) return

        const formData = new FormData()
        formData.append('file', importFile)

        router.post('/customers/import', formData, {
            onSuccess: () => {
                setIsImportOpen(false)
                setImportFile(null)
            }
        })
    }

    return (
        <AppLayout title="إدارة العملاء" subtitle={`${loadedCustomers.length} عميل مسجل بالنظام`}>
            <div className="space-y-5" dir="rtl">
                {/* Status/Flash Alerts */}
                {alert && (
                    <div 
                        className="p-4 rounded-xl text-sm font-semibold text-center border transition-all animate-fade-in relative flex items-center justify-between gap-4"
                        style={{
                            backgroundColor: alert.type === 'success' ? '#EBF5EF' : '#FDEEEC',
                            borderColor: alert.type === 'success' ? '#ADCBBB' : '#E8A09A',
                            color: alert.type === 'success' ? '#2E5A44' : '#922B21'
                        }}
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
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <SearchInput
                        placeholder="البحث عن العملاء..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80"
                    />
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm border border-[#2E5A44] text-[#2E5A44] transition-all hover:bg-[#EEF4F1] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <UploadCloud className="w-4.5 h-4.5" />
                            استيراد من إكسل (CSV)
                        </button>
                        <button
                            onClick={openAddModal}
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-95 active:scale-95 flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#2E5A44' }}
                        >
                            <Plus className="w-4.5 h-4.5" />
                            إضافة عميل
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                {loadedCustomers.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#EAE8E2] p-12 text-center text-[#7C7870]">
                        <span className="text-4xl block mb-3">👥</span>
                        <p className="font-bold">لا يوجد عملاء مطبقين للبحث أو مسجلين بالنظام حالياً.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                            {loadedCustomers.map((customer, i) => (
                                <div
                                    key={customer.id}
                                    className="rounded-2xl p-5 transition-all duration-300 animate-fade-in hover:shadow-md text-right relative flex flex-col justify-between"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #EAE8E2',
                                        animationDelay: `${i * 40}ms`,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#ADCBBB'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#EAE8E2'}
                                >
                                <div>
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
                                    </div>

                                    {/* Shop details */}
                                    <div className="bg-[#FAF9F6] p-3 rounded-xl mb-4 space-y-2 text-sm text-[#7C7870]">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                            <span className="font-bold text-[#1A2D23]">{customer.shop_name}</span>
                                        </div>
                                        {customer.category_of_place && customer.category_of_place !== '—' && (
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-3.5 h-3.5" />
                                                <span>تصنيف المحل: {customer.category_of_place}</span>
                                            </div>
                                        )}
                                        {customer.address && customer.address !== '—' && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate">{customer.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact */}
                                    <div className="space-y-2 mb-4 text-right px-1">
                                        {customer.email && customer.email !== '—' && (
                                            <div className="flex items-center gap-2 justify-start">
                                                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#9A978F]" />
                                                <span className="text-sm truncate" style={{ color: '#7C7870' }}>{customer.email}</span>
                                            </div>
                                        )}
                                        {customer.phone && customer.phone !== '—' && (
                                            <div className="flex items-center gap-2 justify-start">
                                                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#9A978F]" />
                                                <span className="text-sm" style={{ color: '#7C7870' }}>{customer.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats and Actions */}
                                <div>
                                    <div className="flex items-center justify-between pt-4 mb-3 border-t border-[#EAE8E2]">
                                        <div className="text-center flex-1">
                                            <p className="text-base font-bold" style={{ color: '#1A2D23' }}>{customer.orders_count}</p>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#B8B5AE' }}>الطلبات</p>
                                        </div>
                                        <div className="w-px h-8 bg-[#EAE8E2]" />
                                        <div className="text-center flex-1">
                                            <p className="text-base font-bold" style={{ color: '#2E5A44' }}>{customer.total_spent}</p>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#B8B5AE' }}>إجمالي المشتريات</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FAF9F6]">
                                        <button
                                            onClick={() => openEditModal(customer)}
                                            className="p-2 rounded-xl bg-[#FAF9F6] text-[#7C7870] hover:text-[#2E5A44] transition-all hover:bg-[#EEF4F1] flex items-center justify-center"
                                            title="تعديل"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer.id)}
                                            className="p-2 rounded-xl bg-[#FAF9F6] text-[#7C7870] hover:text-[#C0392B] transition-all hover:bg-[#FDEEEC] flex items-center justify-center"
                                            title="حذف"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Infinite Scroll Loader Target */}
                    {nextPage && (
                        <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                            <div className="w-6 h-6 border-2 border-[#2E5A44] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </>
            )}

                {/* Add Customer Modal */}
                {isAddOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-[#EAE8E2] shadow-2xl">
                            <div className="px-6 py-4 border-b border-[#FAF9F6] flex items-center justify-between bg-[#FAF9F6]">
                                <h3 className="font-bold text-lg text-[#1A2D23]">إضافة عميل جديد</h3>
                                <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg hover:bg-white transition-colors">
                                    <X className="w-5 h-5 text-[#9A978F]" />
                                </button>
                            </div>
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">اسم العميل *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                            required
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">اسم المحل / المزرعة *</label>
                                        <input
                                            type="text"
                                            value={data.shop_name}
                                            onChange={e => setData('shop_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                            required
                                        />
                                        {errors.shop_name && <p className="text-xs text-red-500">{errors.shop_name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">رقم الهاتف</label>
                                        <input
                                            type="text"
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">العنوان</label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">تصنيف النشاط</label>
                                        <input
                                            type="text"
                                            placeholder="مشتل، مزرعة، محل تنسيق..."
                                            value={data.category_of_place}
                                            onChange={e => setData('category_of_place', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.category_of_place && <p className="text-xs text-red-500">{errors.category_of_place}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FAF9F6]">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddOpen(false)}
                                        className="px-4 py-2 border border-[#EAE8E2] rounded-xl text-sm font-bold text-[#7C7870] hover:bg-[#FAF9F6]"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                                        style={{ backgroundColor: '#2E5A44' }}
                                    >
                                        {processing ? 'جاري الحفظ...' : 'حفظ العميل'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Customer Modal */}
                {editingCustomer && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-[#EAE8E2] shadow-2xl">
                            <div className="px-6 py-4 border-b border-[#FAF9F6] flex items-center justify-between bg-[#FAF9F6]">
                                <h3 className="font-bold text-lg text-[#1A2D23]">تعديل بيانات العميل</h3>
                                <button onClick={() => setEditingCustomer(null)} className="p-1 rounded-lg hover:bg-white transition-colors">
                                    <X className="w-5 h-5 text-[#9A978F]" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">اسم العميل *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                            required
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">اسم المحل / المزرعة *</label>
                                        <input
                                            type="text"
                                            value={data.shop_name}
                                            onChange={e => setData('shop_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                            required
                                        />
                                        {errors.shop_name && <p className="text-xs text-red-500">{errors.shop_name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">رقم الهاتف</label>
                                        <input
                                            type="text"
                                            value={data.phone_number}
                                            onChange={e => setData('phone_number', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">العنوان</label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <label className="text-xs font-bold text-[#7C7870]">تصنيف النشاط</label>
                                        <input
                                            type="text"
                                            value={data.category_of_place}
                                            onChange={e => setData('category_of_place', e.target.value)}
                                            className="w-full px-3 py-2 border border-[#EAE8E2] rounded-xl text-sm focus:outline-none focus:border-[#2E5A44]"
                                        />
                                        {errors.category_of_place && <p className="text-xs text-red-500">{errors.category_of_place}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FAF9F6]">
                                    <button
                                        type="button"
                                        onClick={() => setEditingCustomer(null)}
                                        className="px-4 py-2 border border-[#EAE8E2] rounded-xl text-sm font-bold text-[#7C7870] hover:bg-[#FAF9F6]"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                                        style={{ backgroundColor: '#2E5A44' }}
                                    >
                                        {processing ? 'جاري الحفظ...' : 'تحديث البيانات'}
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
                                    استيراد عملاء من ملف إكسل (CSV)
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
                                    <p className="text-xs text-[#7C7870] leading-relaxed">
                                        يرجى حفظ ملف الإكسل بصيغة <strong>CSV (Comma Delimited)</strong> قبل رفعه. يجب أن يحتوي الصف الأول على الأسماء التالية للأعمدة:
                                    </p>
                                    <div className="bg-white p-2 rounded-lg border border-[#EAE8E2] text-xs font-mono text-center select-all block overflow-x-auto whitespace-nowrap">
                                        الاسم, اسم المحل, الهاتف, العنوان, البريد, تصنيف المحل
                                    </div>
                                    <p className="text-[10px] text-[#9A978F]">
                                        * عمود "الاسم" و "اسم المحل" مطلوبة بشكل أساسي لإتمام عملية الاستيراد.
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
            </div>
        </AppLayout>
    )
}
