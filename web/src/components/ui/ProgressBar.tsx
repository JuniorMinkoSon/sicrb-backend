export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const v = Math.min(100, Math.max(0, Math.round(value)))
  const tone = v >= 80 ? 'bg-emerald-600' : v >= 40 ? 'bg-brand-600' : 'bg-amber-500'
  return (
    <div className="min-w-28">
      <div className="flex items-center justify-between text-[11px] text-ink-500">
        <span>{label}</span>
        <span className="tabular-nums">{v} %</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-200" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full ${tone}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}
