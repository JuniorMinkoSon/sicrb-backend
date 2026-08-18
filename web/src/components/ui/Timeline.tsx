import type { ReactNode } from 'react'
import { cn } from './cn'

export interface TimelineItem {
  id: string
  titre: string
  date?: string | null
  statut: 'ATTEINT' | 'EN_COURS' | 'PREVU' | 'RETARD' | 'VALIDE' | 'REJETE' | 'A_FAIRE'
  detail?: ReactNode
}

const dots: Record<TimelineItem['statut'], string> = {
  ATTEINT: 'bg-emerald-600',
  VALIDE: 'bg-emerald-600',
  EN_COURS: 'bg-brand-600',
  RETARD: 'bg-red-600',
  REJETE: 'bg-red-600',
  PREVU: 'bg-ink-300',
  A_FAIRE: 'bg-ink-300',
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-2 border-l border-ink-200 pl-5">
      {items.map((i) => (
        <li key={i.id} className="mb-5 last:mb-0">
          <span className={cn('absolute -left-[5px] mt-1.5 size-2.5 rounded-full ring-2 ring-white', dots[i.statut])} aria-hidden />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-ink-900">{i.titre}</p>
            {i.date && <time className="text-xs text-ink-500">{i.date}</time>}
          </div>
          {i.detail && <div className="mt-1 text-xs text-ink-600">{i.detail}</div>}
        </li>
      ))}
    </ol>
  )
}
