export type RoleApplicatif =
  | 'PRESIDENT'
  | 'DDP'
  | 'DT'
  | 'DAF'
  | 'CONTROLLER'
  | 'CONTRACTOR'
  | 'ADMIN'
  | 'PUBLIC'
  | 'CITIZEN'

export interface RoleDefinition {
  code: RoleApplicatif
  libelle: string
  description: string
}

/** Comptes de démonstration associés aux rôles (aucun compte réel). */
export const ROLES_META: Record<RoleApplicatif, { libelle: string; utilisateurDemo: string }> = {
  PRESIDENT: { libelle: 'Président du Conseil Régional', utilisateurDemo: 'Session de démonstration — Présidence' },
  DDP: { libelle: 'Direction de la Planification', utilisateurDemo: 'Session de démonstration — DDP' },
  DT: { libelle: 'Direction Technique', utilisateurDemo: 'Session de démonstration — DT' },
  DAF: { libelle: 'Direction des Affaires Financières', utilisateurDemo: 'Session de démonstration — DAF' },
  CONTROLLER: { libelle: 'Contrôleur', utilisateurDemo: 'Session de démonstration — Contrôle' },
  CONTRACTOR: { libelle: 'Entrepreneur / Prestataire', utilisateurDemo: 'Session de démonstration — Prestataire' },
  ADMIN: { libelle: 'Administrateur', utilisateurDemo: 'Session de démonstration — Administration' },
  PUBLIC: { libelle: 'Portail public', utilisateurDemo: 'Consultation publique' },
  CITIZEN: { libelle: 'Citoyen', utilisateurDemo: 'Session de démonstration — Citoyen' },
}

/**
 * Rôles applicatifs préparés côté frontend. Ils pilotent l'affichage du menu et
 * des actions, mais ne constituent PAS un contrôle de sécurité : l'autorisation
 * réelle devra être appliquée par le backend Quarkus (aucune sécurité n'existe
 * à ce stade dans `sicrb-backend`).
 */
export const roles: RoleDefinition[] = [
  { code: 'PRESIDENT', libelle: 'Président du Conseil Régional', description: 'Pilotage stratégique, arbitrages, rapports.' },
  { code: 'DDP', libelle: 'Direction de la Planification', description: 'PAI, programmes, besoins territoriaux, indicateurs.' },
  { code: 'DT', libelle: 'Direction Technique', description: 'Projets, chantiers, missions, infrastructures.' },
  { code: 'DAF', libelle: 'Direction des Affaires Financières', description: 'Budgets, engagements, liquidations, paiements.' },
  { code: 'CONTROLLER', libelle: 'Contrôleur', description: 'Missions de contrôle, visites, PV, observations.' },
  { code: 'CONTRACTOR', libelle: 'Entrepreneur / Prestataire', description: 'Marchés, documents, paiements.' },
  { code: 'ADMIN', libelle: 'Administrateur', description: 'Utilisateurs, référentiels, audit.' },
  { code: 'PUBLIC', libelle: 'Portail public', description: 'Consultation ouverte des investissements.' },
  { code: 'CITIZEN', libelle: 'Citoyen', description: 'Requêtes et suivi de leur traitement.' },
]
