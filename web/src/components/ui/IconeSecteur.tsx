import type { Secteur } from '../../types/domain'

/**
 * Pictogramme d'un secteur d'investissement.
 *
 * Les huit secteurs s'affichaient en toutes lettres, y compris là où la place
 * manque : une carte de projet, une ligne de tableau, une légende de carte. Un
 * pictogramme s'y reconnaît d'un coup d'œil, et le libellé reste à côté pour
 * qui ne l'a pas encore appris.
 *
 * Les tracés vivent dans `public/secteurs.svg`, chargés une fois et mis en
 * cache par le navigateur, plutôt que recopiés dans le bundle à chaque usage.
 */

const FICHIER = '/secteurs.svg'

/** Correspondance entre le secteur du modèle et le symbole du fichier. */
const SYMBOLE: Record<Secteur, string> = {
  EAU: 'secteur-eau',
  EDUCATION: 'secteur-education',
  SANTE: 'secteur-sante',
  ROUTES: 'secteur-routes',
  AGRICULTURE: 'secteur-agriculture',
  ENERGIE: 'secteur-energie',
  JEUNESSE: 'secteur-jeunesse',
  ASSAINISSEMENT: 'secteur-assainissement',
}

/** Libellé lisible, repris pour l'accessibilité et les infobulles. */
export const LIBELLE_SECTEUR: Record<Secteur, string> = {
  EAU: 'Eau potable',
  EDUCATION: 'Éducation',
  SANTE: 'Santé',
  ROUTES: 'Routes et pistes',
  AGRICULTURE: 'Agriculture',
  ENERGIE: 'Énergie',
  JEUNESSE: 'Jeunesse et sport',
  ASSAINISSEMENT: 'Assainissement',
}

export function IconeSecteur({
  secteur,
  className = 'size-4',
  /**
   * Décoratif par défaut : le secteur est presque toujours écrit à côté, et
   * l'annoncer deux fois alourdit la lecture au lecteur d'écran.
   */
  titre = false,
}: {
  secteur: Secteur
  className?: string
  titre?: boolean
}) {
  const symbole = SYMBOLE[secteur]
  if (!symbole) return null

  return (
    <svg
      className={className}
      role={titre ? 'img' : undefined}
      aria-label={titre ? LIBELLE_SECTEUR[secteur] : undefined}
      aria-hidden={titre ? undefined : true}
      focusable="false"
    >
      <use href={`${FICHIER}#${symbole}`} />
    </svg>
  )
}
