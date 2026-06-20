export default function CategoryFilter({ categories, selected, onChange }) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" dir="rtl">
            <button
                onClick={() => onChange('all')}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={selected === 'all'
                    ? { backgroundColor: '#2E5A44', color: '#fff', boxShadow: '0 2px 8px rgba(46,90,68,0.25)' }
                    : { backgroundColor: '#FFFFFF', color: '#5C5950', border: '1px solid #D6D4CE' }
                }
                onMouseEnter={e => { if (selected !== 'all') e.currentTarget.style.borderColor = '#7FAF98' }}
                onMouseLeave={e => { if (selected !== 'all') e.currentTarget.style.borderColor = '#D6D4CE' }}
            >
                الكل
            </button>
            {categories.map((cat) => {
                const active = String(selected) === String(cat.id)
                return (
                    <button
                        key={cat.id}
                        onClick={() => onChange(cat.id)}
                        className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={active
                            ? { backgroundColor: '#2E5A44', color: '#fff', boxShadow: '0 2px 8px rgba(46,90,68,0.25)' }
                            : { backgroundColor: '#FFFFFF', color: '#5C5950', border: '1px solid #D6D4CE' }
                        }
                        onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = '#7FAF98' }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = '#D6D4CE' }}
                    >
                        {cat.name}
                    </button>
                )
            })}
        </div>
    )
}
