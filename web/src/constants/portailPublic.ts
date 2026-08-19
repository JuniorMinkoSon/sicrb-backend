import type { Projet, ProjetStatut } from '../types/domain'
import { formatNombre, humaniser } from '../utils/format'

/**
 * Référentiel du portail public : présentation citoyenne des projets
 * (libellés simplifiés, couleurs de carte, regroupements de transparence).
 */

export type GroupePublic = 'REALISES' | 'EN_COURS' | 'PROGRAMMES' | 'AUTRES'

export interface StatutPublic {
  libelle: string
  couleur: string
  groupe: GroupePublic
}

export const STATUTS_PUBLICS: Record<ProjetStatut, StatutPublic> = {
  EXPLOITATION: { libelle: 'En exploitation', couleur: '#059669', groupe: 'REALISES' },
  RECEPTION: { libelle: 'Réceptionné', couleur: '#10b981', groupe: 'REALISES' },
  EN_TRAVAUX: { libelle: 'En travaux', couleur: '#ea580c', groupe: 'EN_COURS' },
  ETUDE: { libelle: 'En étude', couleur: '#2563eb', groupe: 'PROGRAMMES' },
  PASSATION: { libelle: 'En passation', couleur: '#7c3aed', groupe: 'PROGRAMMES' },
  IDENTIFIE: { libelle: 'Programmé', couleur: '#0891b2', groupe: 'PROGRAMMES' },
  SUSPENDU: { libelle: 'Suspendu', couleur: '#b45309', groupe: 'AUTRES' },
  ABANDONNE: { libelle: 'Abandonné', couleur: '#be123c', groupe: 'AUTRES' },
}

export const LEGENDE_CARTE: { statut: ProjetStatut; libelle: string; couleur: string }[] = [
  { statut: 'EXPLOITATION', libelle: 'Exploitation', couleur: STATUTS_PUBLICS.EXPLOITATION.couleur },
  { statut: 'EN_TRAVAUX', libelle: 'En travaux', couleur: STATUTS_PUBLICS.EN_TRAVAUX.couleur },
  { statut: 'ETUDE', libelle: 'Étude', couleur: STATUTS_PUBLICS.ETUDE.couleur },
  { statut: 'PASSATION', libelle: 'Passation', couleur: STATUTS_PUBLICS.PASSATION.couleur },
]

/** L'entreprise responsable n'est publiée qu'après contractualisation. */
export const publicationEntrepriseAutorisee = (statut: ProjetStatut) =>
  statut === 'EN_TRAVAUX' || statut === 'RECEPTION' || statut === 'EXPLOITATION'

/** Description citoyenne synthétique construite à partir de la fiche projet. */
export const descriptionPublique = (p: Projet) =>
  `Projet ${humaniser(p.secteur).toLowerCase()} porté par ${p.maitreOuvrage}, au bénéfice d'environ ${formatNombre(p.beneficiaires)} habitants de la région.`
