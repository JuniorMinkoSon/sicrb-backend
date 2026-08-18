import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { Select } from './Field'

interface Props {
  page: number
  size: number
  total: number
  onPage: (page: number) => void
  onSize?: (size: number) => void
}

export function Pagination({ page, size, total, onPage, onSize }: Props) {
  const pages = Math.max(1, Math.ceil(total / size))
  const from = total === 0 ? 0 : (page - 1) * size + 1
  const to = Math.min(page * size, total)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 px-1 py-3 text-xs text-ink-600">
      <p>
        {from}–{to} sur <strong className="text-ink-900">{total}</strong> résultats
      </p>
      <div className="flex items-center gap-2">
        {onSize && (
          <Select
            aria-label="Résultats par page"
            className="h-8 w-28 text-xs"
            value={String(size)}
            onChange={(e) => onSize(Number(e.target.value))}
            options={[10, 20, 50, 100].map((n) => ({ value: String(n), label: `${n} / page` }))}
          />
        )}
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)} icon={<ChevronLeft className="size-4" />}>
          Précédent
        </Button>
        <span aria-live="polite">
          Page {page} / {pages}
        </span>
        <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Suivant <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
