import { Search, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { Input } from './Field'

export function FilterBar({
  q,
  onQ,
  children,
  onReset,
  placeholder = 'Rechercher…',
}: {
  q: string
  onQ: (v: string) => void
  children?: ReactNode
  onReset?: () => void
  placeholder?: string
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-ink-400" aria-hidden />
        <Input aria-label="Recherche" value={q} placeholder={placeholder} onChange={(e) => onQ(e.target.value)} className="pl-9" />
      </div>
      {children}
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} icon={<X className="size-4" />}>
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
