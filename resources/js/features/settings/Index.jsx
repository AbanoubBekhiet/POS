import { useState, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
import AppLayout from '../../shared/layouts/AppLayout'
import { Store, Save, UploadCloud, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react'

export default function SettingsIndex({ settings = {} }) {
    const { flash } = usePage().props

    const [receiptName, setReceiptName] = useState(settings.receipt_name || 'أبو الدهب')
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState(settings.receipt_logo_url || null)
    const [processing, setProcessing] = useState(false)
    const fileRef = useRef(null)

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setLogoFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setLogoPreview(reader.result)
        reader.readAsDataURL(file)
    }

    const removeLogo = () => {
        setLogoFile(null)
        setLogoPreview(null)
        if (fileRef.current) fileRef.current.value = ''
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setProcessing(true)

        const formData = new FormData()
        formData.append('receipt_name', receiptName)
        if (logoFile) formData.append('receipt_logo', logoFile)

        router.post('/settings', formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <AppLayout title="الإعدادات" subtitle="إعدادات الفاتورة وبيانات المحل">
            <div className="max-w-2xl mx-auto" dir="rtl">

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold animate-fade-in"
                        style={{ backgroundColor: '#EBF5EF', border: '1px solid #ADCBBB', color: '#2E5A44' }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold animate-fade-in"
                        style={{ backgroundColor: '#FDEEEC', border: '1px solid #E8A09A', color: '#922B21' }}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {flash.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#EEF4F1' }}>
                            <Store className="w-5 h-5" style={{ color: '#2E5A44' }} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold" style={{ color: '#1A2D23' }}>إعدادات الفاتورة</h2>
                            <p className="text-xs" style={{ color: '#9A978F' }}>هذه البيانات ستظهر على الفاتورة المطبوعة</p>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl p-6 space-y-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAE8E2' }}>

                        {/* Receipt Name */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: '#1A2D23' }}>
                                اسم المحل / البرنامج
                            </label>
                            <p className="text-xs mb-3" style={{ color: '#9A978F' }}>
                                هذا الاسم سيُطبع في أعلى الفاتورة
                            </p>
                            <input
                                type="text"
                                value={receiptName}
                                onChange={e => setReceiptName(e.target.value)}
                                placeholder="مثال: أبو الدهب للتجارة"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all"
                                style={{ backgroundColor: '#F4F3EF', border: '1.5px solid #E2E0DA', color: '#1A2D23' }}
                                onFocus={e => { e.target.style.borderColor = '#3A7259'; e.target.style.boxShadow = '0 0 0 3px rgba(58,114,89,0.1)' }}
                                onBlur={e => { e.target.style.borderColor = '#E2E0DA'; e.target.style.boxShadow = 'none' }}
                            />
                        </div>

                        {/* Divider */}
                        <div style={{ borderTop: '1px solid #EAE8E2' }} />

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: '#1A2D23' }}>
                                شعار المحل (اختياري)
                            </label>
                            <p className="text-xs mb-3" style={{ color: '#9A978F' }}>
                                سيظهر الشعار في أعلى الفاتورة المطبوعة — PNG أو JPG بحد أقصى 2 ميجابايت
                            </p>

                            {logoPreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={logoPreview}
                                        alt="شعار المحل"
                                        className="w-40 h-40 object-contain rounded-2xl border"
                                        style={{ borderColor: '#E2E0DA', backgroundColor: '#F4F3EF' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md transition-opacity hover:opacity-90"
                                        style={{ backgroundColor: '#C0392B' }}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="mt-3 flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                                        style={{ color: '#2E5A44', backgroundColor: '#EEF4F1', border: '1px solid #ADCBBB' }}
                                    >
                                        <UploadCloud className="w-3.5 h-3.5" />
                                        تغيير الشعار
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className="flex flex-col items-center justify-center w-full h-44 rounded-2xl cursor-pointer transition-colors hover:opacity-80"
                                    style={{ border: '2px dashed #E2E0DA', backgroundColor: '#FAF9F6' }}
                                >
                                    <ImageIcon className="w-10 h-10 mb-3" style={{ color: '#B8B5AE' }} />
                                    <p className="text-sm font-semibold" style={{ color: '#5C5950' }}>اضغط لرفع الشعار</p>
                                    <p className="text-xs mt-1" style={{ color: '#B8B5AE' }}>PNG, JPG — حتى 2 ميجابايت</p>
                                    <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                </label>
                            )}

                            {/* Hidden file input for change button */}
                            {logoPreview && (
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            )}
                        </div>
                    </div>

                    {/* Preview box */}
                    <div className="rounded-2xl p-5" style={{ backgroundColor: '#F4F3EF', border: '1px solid #E2E0DA' }}>
                        <p className="text-xs font-bold mb-3 text-right" style={{ color: '#7C7870' }}>معاينة الفاتورة</p>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: '1px dashed #E2E0DA' }}>
                            {logoPreview && (
                                <img src={logoPreview} alt="شعار" className="h-14 object-contain mx-auto mb-2" />
                            )}
                            <p className="text-base font-black" style={{ color: '#1A2D23' }}>{receiptName || 'اسم المحل'}</p>
                            <p className="text-xs mt-1" style={{ color: '#9A978F' }}>فاتورة بيع</p>
                            <div className="mt-3 pt-3 text-xs text-right space-y-1" style={{ borderTop: '1px dashed #E2E0DA', color: '#7C7870' }}>
                                <p>المنتج ............... 100.00 ج.م</p>
                                <p className="font-bold text-sm" style={{ color: '#1A2D23' }}>الإجمالي: 100.00 ج.م</p>
                            </div>
                        </div>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 shadow-md"
                            style={{ backgroundColor: '#2E5A44', boxShadow: '0 4px 12px rgba(46,90,68,0.3)' }}
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
