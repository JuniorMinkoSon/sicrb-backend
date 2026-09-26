import type { Secteur } from '../../types/domain'

/**
 * Une couleur par secteur d'investissement.
 *
 * Toute l'application était bleue : le bleu de la marque servait aussi bien à
 * l'eau qu'aux routes ou à la santé, et rien ne distinguait un projet d'un
 * autre avant d'en avoir lu le libellé. Les huit secteurs du dossier ont
 * chacun leur teinte, reprise partout où un secteur s'affiche — carte, tuile,
 * légende de carte.
 *
 * Les teintes ne remplacent jamais le libellé : environ un homme sur douze
 * distingue mal le rouge du vert, et une information portée par la seule
 * couleur lui serait perdue. Le pictogramme et le nom du secteur restent donc
 * affichés à côté.
 *
 * Classes écrites en toutes lettres, jamais composées à la volée : Tailwind
 * lit les sources telles quelles, et `bg-${x}-50` ne produirait aucune règle.
 */
export interface TeinteSecteur {
  /** Fond discret, pour une tuile ou une pastille. */
  fond: string
  /** Texte et pictogramme. */
  texte: string
  /** Liseré, pour détacher la tuile du fond de page. */
  bordure: string
  /** Aplat vif, pour une barre ou un bandeau. */
  aplat: string
  /** Dégradé de couverture, sur les grandes tuiles. */
  degrade: string
}

export const TEINTE_SECTEUR: Record<Secteur, TeinteSecteur> = {
  EAU: {
    fond: 'bg-sky-50',
    texte: 'text-sky-700',
    bordure: 'border-sky-200',
    aplat: 'bg-sky-500',
    degrade: 'from-sky-500 to-cyan-600',
  },
  EDUCATION: {
    fond: 'bg-indigo-50',
    texte: 'text-indigo-700',
    bordure: 'border-indigo-200',
    aplat: 'bg-indigo-500',
    degrade: 'from-indigo-500 to-violet-600',
  },
  SANTE: {
    fond: 'bg-rose-50',
    texte: 'text-rose-700',
    bordure: 'border-rose-200',
    aplat: 'bg-rose-500',
    degrade: 'from-rose-500 to-red-600',
  },
  ROUTES: {
    fond: 'bg-amber-50',
    texte: 'text-amber-800',
    bordure: 'border-amber-200',
    aplat: 'bg-amber-500',
    degrade: 'from-amber-500 to-orange-600',
  },
  AGRICULTURE: {
    fond: 'bg-lime-50',
    texte: 'text-lime-800',
    bordure: 'border-lime-200',
    aplat: 'bg-lime-500',
    degrade: 'from-lime-500 to-green-600',
  },
  ENERGIE: {
    fond: 'bg-yellow-50',
    texte: 'text-yellow-800',
    bordure: 'border-yellow-200',
    aplat: 'bg-yellow-500',
    degrade: 'from-yellow-400 to-amber-600',
  },
  JEUNESSE: {
    fond: 'bg-fuchsia-50',
    texte: 'text-fuchsia-700',
    bordure: 'border-fuchsia-200',
    aplat: 'bg-fuchsia-500',
    degrade: 'from-fuchsia-500 to-purple-600',
  },
  ASSAINISSEMENT: {
    fond: 'bg-teal-50',
    texte: 'text-teal-700',
    bordure: 'border-teal-200',
    aplat: 'bg-teal-500',
    degrade: 'from-teal-500 to-emerald-600',
  },
}

/**
 * La teinte d'un secteur, avec un repli neutre.
 *
 * Un secteur inconnu peut arriver du serveur : le contrat évoluera avant
 * l'interface. Mieux vaut une tuile grise qu'un écran blanc.
 */
const NEUTRE: TeinteSecteur = {
  fond: 'bg-ink-50',
  texte: 'text-ink-700',
  bordure: 'border-ink-200',
  aplat: 'bg-ink-400',
  degrade: 'from-ink-500 to-ink-700',
}

export const teinteSecteur = (secteur: Secteur | string | null | undefined): TeinteSecteur =>
  TEINTE_SECTEUR[secteur as Secteur] ?? NEUTRE
