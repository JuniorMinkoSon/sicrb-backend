import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1 text-xs text-ink-500">
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3" aria-hidden />}
          {c.to ? (
            <Link to={c.to} className="hover:text-brand-700 hover:underline">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink-700">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
