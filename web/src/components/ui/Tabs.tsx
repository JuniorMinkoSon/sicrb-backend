import { cn } from './cn'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export function Tabs({ items, active, onChange }: { items: TabItem[]; active: string; onChange: (id: string) => void }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1 border-b border-ink-200">
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            '-mb-px border-b-2 px-3 py-2 text-sm font-medium',
            active === t.id ? 'border-brand-700 text-brand-800' : 'border-transparent text-ink-500 hover:text-ink-800',
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 text-xs text-ink-400">({t.count})</span>}
        </button>
      ))}
    </div>
  )
}
