import type { ReactNode } from 'react'
import { AlertTriangle, CircleCheck, Info, OctagonAlert } from 'lucide-react'
import { cn } from './cn'

type Level = 'info' | 'success' | 'warning' | 'danger'

const styles: Record<Level, { box: string; Icon: typeof Info }> = {
  info: { box: 'border-brand-200 bg-brand-50 text-brand-900', Icon: Info },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', Icon: CircleCheck },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', Icon: AlertTriangle },
  danger: { box: 'border-red-200 bg-red-50 text-red-900', Icon: OctagonAlert },
}

export function Alert({ level = 'info', title, children, className }: { level?: Level; title?: ReactNode; children?: ReactNode; className?: string }) {
  const { box, Icon } = styles[level]
  return (
    <div className={cn('flex gap-3 rounded-md border p-3 text-sm', box, className)} role={level === 'danger' ? 'alert' : 'status'}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-xs leading-relaxed">{children}</div>}
      </div>
    </div>
  )
}
