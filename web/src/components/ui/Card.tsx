import type { ReactNode } from 'react'
import { cn } from './cn'

interface CardProps {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  className?: string
  bodyClassName?: string
}

export function Card({ title, description, actions, children, className, bodyClassName }: CardProps) {
  return (
    <section className={cn('rounded-lg border border-ink-200 bg-white shadow-xs', className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-200 px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-ink-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  )
}
