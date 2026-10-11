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
  { code: 'PRESIDENT', libelle: 'Président du Conseil Régional', description: 'Pilote et arbitre : décisions stratégiques, indicateurs, rapports.' },
  { code: 'DDP', libelle: 'Direction de la Planification', description: 'Programme et suit les objectifs : PAI, programmes, indicateurs.' },
  { code: 'DT', libelle: 'Direction Technique', description: 'Supervise, décide techniquement et finalise : chantiers, réception, exploitation.' },
  { code: 'DAF', libelle: 'Direction des Affaires Financières', description: 'Gère les finances : budgets, engagements, liquidations, paiements.' },
  { code: 'CONTROLLER', libelle: 'Contrôleur', description: 'Constate et contrôle : visites terrain, PV, rapports indépendants pour la décision de la DT.' },
  { code: 'CONTRACTOR', libelle: 'Entrepreneur / Prestataire', description: 'Réalise les travaux : marchés, documents, paiements.' },
  { code: 'ADMIN', libelle: 'Administrateur', description: 'Administre le système : utilisateurs, référentiels, audit.' },
  { code: 'PUBLIC', libelle: 'Portail public', description: 'Consultation ouverte des investissements.' },
  { code: 'CITIZEN', libelle: 'Citoyen', description: 'Propose, consulte et signale : projets, suivi, réclamations.' },
]
