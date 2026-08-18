import { Link } from 'react-router-dom'

/** Identité visuelle commune au site vitrine et à la solution interne. */
export function Marque({ compact = false, to = '/' }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-bold tracking-tight text-white ring-1 ring-inset ring-white/20">
        CRB
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-white">Conseil Régional de la Bagoué</span>
          <span className="block truncate text-[11px] text-brand-200/80">Système d'information des investissements</span>
        </span>
      )}
    </Link>
  )
}

export const MENTION_DEMO =
  'SICRB — maquette fonctionnelle. Les données affichées sont des données de démonstration, sans valeur officielle.'
