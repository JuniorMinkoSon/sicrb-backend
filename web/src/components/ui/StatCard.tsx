import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'
import { cn } from './cn'

export type StatTone = 'brand' | 'positive' | 'warning' | 'critical' | 'accent' | 'neutral'

const tuiles: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  positive: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  critical: 'bg-red-50 text-red-700 ring-red-100',
  accent: 'bg-violet-50 text-violet-700 ring-violet-100',
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200',
}

interface Props {
  label: string
  value: ReactNode
  /** Valeur numérique animée : `value` est alors utilisée comme gabarit de rendu. */
  count?: number
  format?: (n: number) => string
  hint?: string
  icon?: ReactNode
  tone?: StatTone
  trend?: { value: number; label?: string }
}

export function StatCard({ label, value, count, format, hint, icon, tone = 'brand', trend }: Props) {
  const anime = useCountUp(count ?? 0)
  const affiche = count !== undefined ? (format ? format(anime) : Math.round(anime).toLocaleString('fr-FR')) : value

  return (
    <div className="group rounded-xl border border-ink-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-3">
        {icon && (
          <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg ring-1 ring-inset', tuiles[tone])} aria-hidden>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold leading-tight tabular-nums text-ink-900">{affiche}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {hint && <span className="text-xs text-ink-500">{hint}</span>}
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  trend.value >= 0 ? 'text-emerald-700' : 'text-red-700',
                )}
              >
                {trend.value >= 0 ? <TrendingUp className="size-3.5" aria-hidden /> : <TrendingDown className="size-3.5" aria-hidden />}
                {Math.abs(Math.round(trend.value))} %{trend.label ? ` · ${trend.label}` : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
