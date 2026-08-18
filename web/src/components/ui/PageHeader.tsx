import type { ReactNode } from 'react'
import { Breadcrumb, type Crumb } from './Breadcrumb'

export function PageHeader({
  title,
  subtitle,
  crumbs,
  actions,
}: {
  title: string
  subtitle?: string
  crumbs?: Crumb[]
  actions?: ReactNode
}) {
  return (
    <header className="mb-5">
      {crumbs && <Breadcrumb items={crumbs} />}
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-900">{title}</h1>
          {subtitle && <p className="mt-1 max-w-3xl text-sm text-ink-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
