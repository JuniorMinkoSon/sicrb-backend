import type { ReactNode } from 'react'
import { cn } from './cn'

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  info: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
}

const points: Record<Tone, string> = {
  neutral: 'bg-ink-400',
  info: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
  dot = false,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', points[tone])} aria-hidden />}
      {children}
    </span>
  )
}

/** Correspondance statut métier → tonalité visuelle, partagée par tous les modules. */
export function toneForStatut(statut: string): Tone {
  const s = statut.toUpperCase()
  if (['VALIDE', 'PAYE', 'REALISEE', 'CLOTUREE', 'ATTEINT', 'EXPLOITATION', 'ADOPTE', 'AGREE', 'BON', 'TRAITEE', 'VALIDEE', 'SUCCES', 'DISPONIBLE'].includes(s))
    return 'success'
  if (['REJETE', 'REJETEE', 'ABANDONNE', 'HORS_SERVICE', 'RADIE', 'ECHEC', 'CRITIQUE', 'EN_PANNE', 'RETARD'].includes(s)) return 'danger'
  if (['SUSPENDU', 'DEGRADE', 'VIGILANCE', 'MOYEN', 'A_ARBITRER', 'EN_VALIDATION', 'DEMANDEE', 'RECUE', 'BROUILLON'].includes(s)) return 'warning'
  if (['EN_COURS', 'EN_TRAVAUX', 'EN_INSTRUCTION', 'PASSATION', 'ENGAGE', 'VISE', 'LIQUIDE', 'PLANIFIEE', 'RAPPORT_DEPOSE', 'AFFECTE', 'DEPOSEE', 'INSTRUITE'].includes(s))
    return 'info'
  return 'neutral'
}
