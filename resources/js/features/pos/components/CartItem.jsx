import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartItem({ item, onIncrement, onDecrement, onQuantityChange, onRemove, onPriceChange }) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempPrice, setTempPrice] = useState(item.price)
    const [tempQty, setTempQty] = useState(item.quantity)

    useEffect(() => {
        setTempQty(item.quantity)
    }, [item.quantity])

    const handleSave = () => {
        setIsEditing(false)
        onPriceChange(item.id, parseFloat(tempPrice) || 0)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave()
        }
    }

    const handleQtyChange = (e) => {
        const valStr = e.target.value;
        setTempQty(valStr);
        
        const val = parseInt(valStr, 10);
        if (!isNaN(val) && val > 0) {
            onQuantityChange(item.id, val);
        }
    }

    const handleQtyBlur = () => {
        const val = parseInt(tempQty, 10);
        if (isNaN(val) || val <= 0) {
            onRemove(item.id);
        } else {
            onQuantityChange(item.id, val);
        }
    }

    const handleQtyKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    }

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF9F6] transition-colors group" dir="rtl">

            <div className="flex flex-col w-full items-center">
                <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm font-semibold text-[#1A2D23] truncate">{item.name}</p>
                <div className="flex items-center gap-1 mt-1 justify-end">
                    {isEditing ? (
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-[#9A978F]">ج</span>
                            <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="w-16 px-1.5 py-0.5 text-xs text-right border border-[#ADCBBB] rounded-md focus:outline-none font-semibold text-[#1A2D23]"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setTempPrice(item.price)
                                setIsEditing(true)
                            }}
                            className="text-xs text-[#5C5950] font-semibold hover:text-[#2E5A44] hover:underline flex items-center gap-0.5"
                            title="اضغط لتعديل السعر"
                        >
                            <span>{parseFloat(item.price).toFixed(2)} ج</span>
                            <span className="text-[10px] text-[#9A978F] font-normal">(تعديل)</span>
                        </button>
                    )}
                </div>
                </div>

                <div className="flex items-center gap-1.5 flex-row-reverse">
                    <button
                        onClick={() => onDecrement(item.id)}
                        className="w-7 h-7 rounded-lg bg-[#EAE8E2] hover:bg-[#D6D4CE] flex items-center justify-center transition-colors"
                    >
                        <Minus className="w-3.5 h-3.5 text-[#5C5950]" />
                    </button>
                    <input
                        type="number"
                        value={tempQty}
                        onChange={handleQtyChange}
                        onBlur={handleQtyBlur}
                        onKeyDown={handleQtyKeyDown}
                        className="w-10 text-center text-sm font-bold text-[#1A2D23] bg-transparent border-b border-transparent hover:border-[#E2E0DA] focus:border-[#2E5A44] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                        onClick={() => onIncrement(item.id)}
                        className="w-7 h-7 rounded-lg bg-[#D5E6DC] hover:bg-[#B9D8C6] flex items-center justify-center transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5 text-[#2E5A44]" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-row-reverse">
                <span className="text-sm font-bold text-[#1A2D23] w-20 text-left">
                    {(item.price * item.quantity).toFixed(2)} ج
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
