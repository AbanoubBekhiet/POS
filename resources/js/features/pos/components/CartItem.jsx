import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF9F6] transition-colors group" dir="rtl">
            {/* Emoji / Image */}
            <div className="w-10 h-10 rounded-lg bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center flex-shrink-0 text-lg">
                {item.emoji || '📦'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-right">
                <p className="text-sm font-semibold text-[#1A2D23] truncate">{item.name}</p>
                <p className="text-xs text-[#9A978F]">{item.price.toFixed(2)} د.إ للوحدة</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-1.5 flex-row-reverse">
                <button
                    onClick={() => onDecrement(item.id)}
                    className="w-7 h-7 rounded-lg bg-[#EAE8E2] hover:bg-[#D6D4CE] flex items-center justify-center transition-colors"
                >
                    <Minus className="w-3.5 h-3.5 text-[#5C5950]" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#1A2D23]">{item.quantity}</span>
                <button
                    onClick={() => onIncrement(item.id)}
                    className="w-7 h-7 rounded-lg bg-[#D5E6DC] hover:bg-[#B9D8C6] flex items-center justify-center transition-colors"
                >
                    <Plus className="w-3.5 h-3.5 text-[#2E5A44]" />
                </button>
            </div>

            {/* Subtotal + Remove */}
            <div className="flex items-center gap-2 flex-row-reverse">
                <span className="text-sm font-bold text-[#1A2D23] w-20 text-left">
                    {(item.price * item.quantity).toFixed(2)} د.إ
                </span>
                <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#FDEEEC] transition-all"
                >
                    <Trash2 className="w-3.5 h-3.5 text-[#C0392B]" />
                </button>
            </div>
        </div>
    )
}
