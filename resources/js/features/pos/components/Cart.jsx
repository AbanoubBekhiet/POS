import CartItem from './CartItem'
import { Button } from '../../../shared/components'
import { ShoppingBag, CreditCard, Banknote, Trash2 } from 'lucide-react'

export default function Cart({ items, onIncrement, onDecrement, onRemove, onClear, onCheckout }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.14
    const total = subtotal + tax

    return (
        <div className="bg-white rounded-2xl border border-surface-100 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-600" />
                    <h2 className="text-base font-bold text-surface-900">Current Order</h2>
                    {items.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                            {items.reduce((sum, i) => sum + i.quantity, 0)}
                        </span>
                    )}
                </div>
                {items.length > 0 && (
                    <button
                        onClick={onClear}
                        className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors"
                        title="Clear cart"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-3">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-3">
                            <ShoppingBag className="w-8 h-8 text-surface-300" />
                        </div>
                        <p className="text-sm font-semibold text-surface-500">Cart is empty</p>
                        <p className="text-xs text-surface-400 mt-1">Tap products to add them</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrement={onIncrement}
                                onDecrement={onDecrement}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
                <div className="border-t border-surface-100 p-5 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-500">Subtotal</span>
                            <span className="font-medium text-surface-700">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-500">Tax (14%)</span>
                            <span className="font-medium text-surface-700">${tax.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-surface-100 my-2" />
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-surface-900">Total</span>
                            <span className="text-xl font-bold text-primary-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            icon={Banknote}
                            className="w-full"
                            onClick={() => onCheckout?.('cash')}
                        >
                            Cash
                        </Button>
                        <Button
                            icon={CreditCard}
                            className="w-full"
                            onClick={() => onCheckout?.('card')}
                        >
                            Card
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
