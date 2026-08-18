import type { ReactNode } from 'react'
import { cn } from './cn'

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'neutral',
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  tone?: 'neutral' | 'positive' | 'warning' | 'critical'
}) {
  const accents = {
    neutral: 'text-ink-900',
    positive: 'text-emerald-700',
    warning: 'text-amber-700',
    critical: 'text-red-700',
  }
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
        {icon && <span className="text-ink-400">{icon}</span>}
      </div>
      <p className={cn('mt-2 text-2xl font-semibold tabular-nums', accents[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  )
}
