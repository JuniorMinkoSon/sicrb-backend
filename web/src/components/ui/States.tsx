import type { ReactNode } from 'react'
import { FileQuestion, Loader2, TriangleAlert } from 'lucide-react'
import { Button } from './Button'
import { cn } from './cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-ink-200/70', className)} aria-hidden />
}

export function LoadingState({ label = 'Chargement des données…', rows = 4 }: { label?: string; rows?: number }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <p className="flex items-center gap-2 text-xs text-ink-500">
        <Loader2 className="size-4 animate-spin" aria-hidden /> {label}
      </p>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-ink-300 px-6 py-10 text-center">
      <FileQuestion className="size-6 text-ink-400" aria-hidden />
      <p className="text-sm font-medium text-ink-800">{title}</p>
      {description && <p className="max-w-md text-xs text-ink-500">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : 'Erreur inattendue'
  return (
    <div role="alert" className="flex flex-col items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-red-800">
        <TriangleAlert className="size-4" aria-hidden /> Impossible de charger les données
      </p>
      <p className="text-xs text-red-700">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  )
}
