import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
            {/* Emoji / Image */}
            <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0 text-lg">
                {item.emoji || '📦'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-800 truncate">{item.name}</p>
                <p className="text-xs text-surface-400">${item.price.toFixed(2)} each</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onDecrement(item.id)}
                    className="w-7 h-7 rounded-lg bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors"
                >
                    <Minus className="w-3.5 h-3.5 text-surface-600" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-surface-800">{item.quantity}</span>
                <button
                    onClick={() => onIncrement(item.id)}
                    className="w-7 h-7 rounded-lg bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                >
                    <Plus className="w-3.5 h-3.5 text-primary-600" />
                </button>
            </div>

            {/* Subtotal + Remove */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-surface-800 w-16 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
            </div>
        </div>
    )
}
