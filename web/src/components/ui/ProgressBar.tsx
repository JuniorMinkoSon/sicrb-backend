import { cn } from './cn'

export function ProgressBar({ value, label, size = 'sm' }: { value: number; label?: string; size?: 'sm' | 'md' }) {
  const v = Math.min(100, Math.max(0, Math.round(value)))
  const tone = v >= 80 ? 'bg-emerald-600' : v >= 40 ? 'bg-brand-600' : 'bg-amber-500'
  return (
    <div className="min-w-28">
      <div className="flex items-center justify-between text-[11px] text-ink-500">
        <span>{label}</span>
        <span className="font-medium tabular-nums text-ink-700">{v} %</span>
      </div>
      <div
        className={cn('mt-1 w-full overflow-hidden rounded-full bg-ink-100', size === 'md' ? 'h-2.5' : 'h-1.5')}
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tone)} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}
