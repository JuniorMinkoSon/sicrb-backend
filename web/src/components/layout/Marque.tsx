import { Link } from 'react-router-dom'

/**
 * Identité visuelle commune au site vitrine et à la solution interne.
 *
 * Le dossier institutionnel nomme la plateforme **BAGOUÉ 360** ; le Conseil
 * régional de la Bagoué en est le porteur, LOCACONNECTÉ le partenaire
 * technologique. Le code l'appelait « SICRB », un sigle interne qui
 * n'apparaissait nulle part dans le dossier : deux noms pour une même chose,
 * c'est un nom de trop dès qu'on présente l'outil à un élu.
 */
export function Marque({ compact = false, to = '/' }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-bold tracking-tight text-white ring-1 ring-inset ring-white/20">
        360
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-white">BAGOUÉ 360</span>
          <span className="block truncate text-[11px] text-brand-200/80">
            Conseil Régional de la Bagoué
          </span>
        </span>
      )}
    </Link>
  )
}

/** Baseline du dossier institutionnel, reprise au pied des écrans publics. */
export const BASELINE = 'Planifier · Décider · Suivre · Contrôler · Valoriser · Rendre compte'

/** Intitulé complet, pour les en-têtes de page et les exports. */
export const INTITULE_COMPLET =
  "Système d'Information Régional Intégré de Gouvernance, de Planification et de Pilotage des Investissements"

export const PARTENAIRE = 'LOCACONNECTÉ'

export const MENTION_DEMO =
  'BAGOUÉ 360 — maquette fonctionnelle. Les données affichées sont des données de démonstration, sans valeur officielle.'
