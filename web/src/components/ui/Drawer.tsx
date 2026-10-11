import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-900/40">
      <aside role="dialog" aria-modal="true" aria-label={title} className="flex h-full w-full max-w-md flex-col bg-white shadow-lg">
        <header className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          <Button variant="ghost" size="sm" aria-label="Fermer" onClick={onClose} icon={<X className="size-4" />} />
        </header>
        <div className="flex-1 overflow-auto px-5 py-4 text-sm">{children}</div>
      </aside>
    </div>
  )
}
