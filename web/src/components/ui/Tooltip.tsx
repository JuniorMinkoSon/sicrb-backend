import type { ReactNode } from 'react'

/** Tooltip accessible et sobre (CSS only, pas de dépendance supplémentaire). */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      <span tabIndex={0} aria-label={label} className="inline-flex">
        {children}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink-900 px-2 py-1 text-[11px] text-white group-hover:block group-focus-within:block">
        {label}
      </span>
    </span>
  )
}
