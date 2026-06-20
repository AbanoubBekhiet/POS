import { useState, useEffect } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import AppLayout from '../../shared/layouts/AppLayout'
import { SearchInput } from '../../shared/components'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, UploadCloud } from 'lucide-react'

export default function CategoriesIndex({ categories, filters }) {
    const { flash } = usePage().props
    const [search, setSearch] = useState(filters?.search || '')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get('/categories', { search }, { preserveState: true, replace: true })
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const { data, setData, post, processing, reset, clearErrors, errors } = useForm({
        name: '',
        image: null,
    })

    const openAddModal = () => {
        reset()
        setImagePreview(null)
        clearErrors()
        setIsAddOpen(true)
    }

    const openEditModal = (cat) => {
        clearErrors()
        setEditingCategory(cat)
        setData({
            name: cat.name,
            image: null,
        })
        setImagePreview(cat.image_url)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setData('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post('/categories', {
            onSuccess: () => {
                setIsAddOpen(false)
                reset()
                setImagePreview(null)
            }
        })
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        router.post(`/categories/${editingCategory.id}`, {
            _method: 'PUT',
            name: data.name,
            image: data.image,
        }, {
            onSuccess: () => {
                setEditingCategory(null)
                reset()
                setImagePreview(null)
            }
        })
    }

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
            router.delete(`/categories/${id}`)
        }
    }

    return (
        <AppLayout title="تصنيفات المخزون" subtitle="إدارة وتصنيف المنتجات لسهولة الوصول والمبيعات">
            <div className="space-y-5" dir="rtl">
                {/* Status/Flash Alerts */}
                {flash?.error && (
                    <div className="p-4 rounded-xl text-sm font-semibold text-center bg-[#FDEEEC] text-[#922B21] border border-[#E8A09A]">
                        {flash.error}
                    </div>
                )}
                {flash?.success && (
                    <div className="p-4 rounded-xl text-sm font-semibold text-center bg-[#EBF5EF] text-[#2E5A44] border border-[#ADCBBB]">
                        {flash.success}
                    </div>
                )}

                {/* Toolbar */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <SearchInput
                        placeholder="ابحث عن تصنيف..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80"
                    />
                    <button
                        onClick={openAddModal}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#2E5A44' }}
                    >
                        <Plus className="w-4 h-4" />
                        إضافة تصنيف جديد
                    </button>
                </div>

                {/* Categories List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {categories.map((cat, i) => (
                        <div
                            key={cat.id}
                            className="bg-white rounded-2xl p-5 border border-[#EAE8E2] flex flex-col justify-between transition-all hover:shadow-md hover:border-[#ADCBBB] animate-fade-in text-right"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div>
                                {/* Card Image / Emoji Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    {cat.image_url ? (
                                        <img
                                            src={cat.image_url}
                                            alt={cat.name}
                                            className="w-14 h-14 rounded-xl object-cover border border-[#EAE8E2]"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-2xl text-[#9A978F]">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1A2D23]">{cat.name}</h4>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] text-[#5C5950]">
                                            {cat.products_count} منتج
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#FAF9F6]">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => openEditModal(cat)}
                                        className="p-2 rounded-lg hover:bg-[#EAE8E2] text-[#5C5950] transition-colors"
                                        title="تعديل"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 rounded-lg hover:bg-[#FDEEEC] text-[#C0392B] transition-colors"
                                        title="حذف"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-[#EAE8E2]">
                            <p className="text-sm font-semibold text-[#9A978F]">لم يتم العثور على أي تصنيف مطابق للبحث</p>
                        </div>
                    )}
                </div>

                {isAddOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF9F6]/70 backdrop-blur-md overflow-y-auto animate-fade-in">
                        <div className="bg-white rounded-3xl border border-[#EAE8E2] w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="absolute left-6 top-6 p-2 rounded-xl hover:bg-[#FAF9F6] text-[#9A978F] hover:text-[#1A2D23] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-lg font-bold text-[#1A2D23] mb-6 text-right">إضافة تصنيف جديد</h3>

                            <form onSubmit={handleAddSubmit} className="space-y-5 text-right">
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>صورة التصنيف</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-[#FAF9F6] transition-colors" style={{ borderColor: '#E2E0DA' }}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 text-[#9A978F] mb-2" />
                                                    <p className="text-xs font-semibold text-[#5C5950]">اضغط لرفع صورة التصنيف</p>
                                                    <p className="text-[10px] text-[#B8B5AE] mt-1">PNG, JPG أو GIF بحد أقصى 2 ميجابايت</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                    {errors.image && <p className="text-xs text-[#C0392B] mt-1">{errors.image}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>اسم التصنيف</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: نباتات زينة"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-[#C0392B] mt-1">{errors.name}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-2"
                                        style={{ backgroundColor: '#2E5A44' }}
                                    >
                                        {processing ? 'جاري الحفظ...' : 'إضافة التصنيف'}
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

                {editingCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF9F6]/70 backdrop-blur-md overflow-y-auto animate-fade-in">
                        <div className="bg-white rounded-3xl border border-[#EAE8E2] w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="absolute left-6 top-6 p-2 rounded-xl hover:bg-[#FAF9F6] text-[#9A978F] hover:text-[#1A2D23] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-lg font-bold text-[#1A2D23] mb-6 text-right">تعديل التصنيف: {editingCategory.name}</h3>

                            <form onSubmit={handleUpdateSubmit} className="space-y-5 text-right">
                                {/* Image Upload Zone */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>صورة التصنيف</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-[#FAF9F6] transition-colors" style={{ borderColor: '#E2E0DA' }}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 text-[#9A978F] mb-2" />
                                                    <p className="text-xs font-semibold text-[#5C5950]">اضغط لرفع صورة التصنيف</p>
                                                    <p className="text-[10px] text-[#B8B5AE] mt-1">PNG, JPG أو GIF بحد أقصى 2 ميجابايت</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    </div>
                                    {errors.image && <p className="text-xs text-[#C0392B] mt-1">{errors.image}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1.5" style={{ color: '#5C5950' }}>اسم التصنيف</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: نباتات زينة"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none text-right font-medium"
                                        style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA', color: '#1A2D23' }}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-[#C0392B] mt-1">{errors.name}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-3 rounded-xl font-bold text-white transition-all hover:opacity-95 active:scale-95 shadow-md flex items-center justify-center gap-2"
                                        style={{ backgroundColor: '#2E5A44' }}
                                    >
                                        {processing ? 'جاري التحديث...' : 'تحديث التصنيف'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingCategory(null)}
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
            </div>
        </AppLayout>
    )
}
