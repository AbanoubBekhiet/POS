import { useState } from 'react'
import { useForm, usePage, Link } from '@inertiajs/react'
import { Leaf, Lock, KeyRound } from 'lucide-react'

export default function ResetPassword() {
    const { errors, flash } = usePage().props
    const { data, setData, post, processing } = useForm({
        password: '',
        new_password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/auth/reset-password')
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
            dir="rtl"
            style={{ backgroundColor: '#FAF9F6' }}
        >
            <div
                className="w-full max-w-md rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-xl"
                style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE8E2',
                    boxShadow: '0 4px 20px rgba(46, 50, 48, 0.05)',
                }}
            >
                {/* Brand / Logo */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md"
                        style={{ backgroundColor: '#2E5A44' }}
                    >
                        <KeyRound className="w-7 h-7 text-white" />
                    </div>
                    <h1
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: '#2E5A44', fontFamily: 'Literata, serif' }}
                    >
                        تغيير كلمة المرور
                    </h1>
                    <p className="text-xs mt-1 font-medium" style={{ color: '#9A978F' }}>
                        قم بتحديث كلمة المرور الخاصة بالنظام
                    </p>
                </div>

                {/* Alerts */}
                {(flash?.error || errors?.password || errors?.new_password) && (
                    <div
                        className="p-4 mb-4 rounded-xl text-sm font-semibold text-center animate-fade-in"
                        style={{ backgroundColor: '#FDEEEC', color: '#922B21', border: '1px solid #E8A09A' }}
                    >
                        {flash?.error || errors?.password || errors?.new_password}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>
                            كلمة المرور الحالية
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-4 pr-12 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none font-bold"
                                style={{
                                    backgroundColor: '#F4F3EF',
                                    border: '1px solid #E2E0DA',
                                    color: '#1A2D23',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#2E5A44'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(46,90,68,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E2E0DA'
                                    e.target.style.boxShadow = 'none'
                                }}
                                required
                            />
                            <Lock
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
                                style={{ color: '#B8B5AE' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>
                            كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={data.new_password}
                                onChange={(e) => setData('new_password', e.target.value)}
                                className="w-full pl-4 pr-12 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none font-bold"
                                style={{
                                    backgroundColor: '#F4F3EF',
                                    border: '1px solid #E2E0DA',
                                    color: '#1A2D23',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#2E5A44'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(46,90,68,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E2E0DA'
                                    e.target.style.boxShadow = 'none'
                                }}
                                required
                            />
                            <Lock
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
                                style={{ color: '#B8B5AE' }}
                            />
                        </div>
                    </div>

                    {/* Submit & Cancel */}
                    <div className="pt-2 space-y-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-95 active:scale-[0.98] shadow-md disabled:opacity-50"
                            style={{
                                backgroundColor: '#2E5A44',
                                boxShadow: '0 4px 12px rgba(46,90,68,0.25)',
                            }}
                        >
                            {processing ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
                        </button>
                        <Link
                            href="/"
                            className="block w-full py-3 rounded-xl font-bold text-center transition-all duration-200 hover:bg-[#EAE8E2]"
                            style={{
                                border: '1px solid #E2E0DA',
                                color: '#5C5950',
                            }}
                        >
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
