import { useForm, usePage, Link } from '@inertiajs/react'
import { Leaf, Lock, ArrowLeft } from 'lucide-react'

export default function Login() {
    const { errors, flash } = usePage().props
    const { data, setData, post, processing } = useForm({
        password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/auth/login')
    }

    const appendPin = (num) => {
        if (data.password.length < 8) {
            setData('password', data.password + num)
        }
    }

    const clearPin = () => {
        setData('password', '')
    }

    const backspacePin = () => {
        setData('password', data.password.slice(0, -1))
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
                        <Leaf className="w-7 h-7 text-white animate-pulse" />
                    </div>
                    <h1
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: '#2E5A44', fontFamily: 'Literata, serif' }}
                    >
                        أبو الدهب
                    </h1>
                    <p className="text-xs mt-1 font-medium" style={{ color: '#9A978F' }}>
                        منظومة إدارة المخزون ونقاط البيع
                    </p>
                </div>

                {/* Status / Flash Alerts */}
                {(flash?.error || errors?.password) && (
                    <div
                        className="p-4 mb-4 rounded-xl text-sm font-semibold text-center animate-fade-in"
                        style={{ backgroundColor: '#FDEEEC', color: '#922B21', border: '1px solid #E8A09A' }}
                    >
                        {flash?.error || errors?.password}
                    </div>
                )}
                {flash?.success && (
                    <div
                        className="p-4 mb-4 rounded-xl text-sm font-semibold text-center animate-fade-in"
                        style={{ backgroundColor: '#EBF5EF', color: '#2E5A44', border: '1px solid #ADCBBB' }}
                    >
                        {flash?.success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#5C5950' }}>
                            كلمة المرور للدخول
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-4 pr-12 py-3.5 rounded-xl text-lg font-bold text-center tracking-widest transition-all duration-200 focus:outline-none"
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
                                autoFocus
                            />
                            <Lock
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
                                style={{ color: '#B8B5AE' }}
                            />
                        </div>
                        <div className="flex justify-start mt-2">
                            <Link
                                href="/auth/reset-password"
                                className="text-xs font-semibold hover:underline"
                                style={{ color: '#2E5A44' }}
                            >
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                    </div>

                    {/* PIN Pad (Optional / Quick Access) */}
                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => appendPin(num)}
                                className="h-12 rounded-xl text-lg font-bold transition-all duration-150 active:scale-95"
                                style={{
                                    backgroundColor: '#F4F3EF',
                                    border: '1px solid #E2E0DA',
                                    color: '#3C3A33',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EAE8E2')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F4F3EF')}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={clearPin}
                            className="h-12 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95"
                            style={{
                                backgroundColor: '#EAE8E2',
                                border: '1px solid #D6D4CE',
                                color: '#922B21',
                            }}
                        >
                            تفريغ
                        </button>
                        <button
                            type="button"
                            onClick={() => appendPin(0)}
                            className="h-12 rounded-xl text-lg font-bold transition-all duration-150 active:scale-95"
                            style={{
                                backgroundColor: '#F4F3EF',
                                border: '1px solid #E2E0DA',
                                color: '#3C3A33',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EAE8E2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F4F3EF')}
                        >
                            0
                        </button>
                        <button
                            type="button"
                            onClick={backspacePin}
                            className="h-12 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95"
                            style={{
                                backgroundColor: '#EAE8E2',
                                border: '1px solid #D6D4CE',
                                color: '#5C5950',
                            }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-95 active:scale-[0.98] shadow-md disabled:opacity-50"
                        style={{
                            backgroundColor: '#2E5A44',
                            boxShadow: '0 4px 12px rgba(46,90,68,0.25)',
                        }}
                    >
                        {processing ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <p className="text-[11px] mt-6 font-medium text-center" style={{ color: '#B8B5AE' }}>
                أبو الدهب لمستلزمات الحدائق والزراعة © {new Date().getFullYear()}
            </p>
        </div>
    )
}
