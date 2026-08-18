/**
 * Modèle de données du SI du Conseil Régional de la Bagoué (SICRB).
 *
 * Ces types décrivent le contrat attendu du backend Quarkus (`sicrb-backend`).
 * Ils sont partagés par les adapters (mock ou HTTP) : changer de source de
 * données ne doit pas impacter les composants.
 */

export type Id = string

export interface Page<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface PageQuery {
  page?: number
  size?: number
  q?: string
  sort?: string
  [key: string]: string | number | undefined
}

/* ---------------------------------------------------------------- Territoire */

export type CollectiviteType = 'REGION' | 'DEPARTEMENT' | 'SOUS_PREFECTURE' | 'COMMUNE'

export interface Territoire {
  id: Id
  nom: string
  type: CollectiviteType
  parentId: Id | null
  chefLieu: string
  population: number
  superficieKm2: number
  latitude: number
  longitude: number
  tauxAccesEau: number
  tauxElectrification: number
  nbLocalites: number
}

/* --------------------------------------------------------------- Gouvernance */

export type SessionType = 'PLENIERE' | 'BUREAU' | 'COMMISSION'
export type SessionStatut = 'PLANIFIEE' | 'EN_COURS' | 'CLOTUREE'

export interface SessionDeliberante {
  id: Id
  intitule: string
  type: SessionType
  date: string
  statut: SessionStatut
  presents: number
  quorum: number
  deliberations: number
  documentIds: Id[]
}

/* -------------------------------------------------------------- Planification */

export type PaiStatut = 'BROUILLON' | 'CONCERTATION' | 'ADOPTE' | 'EN_EXECUTION' | 'CLOTURE'

export interface Pai {
  id: Id
  intitule: string
  anneeDebut: number
  anneeFin: number
  statut: PaiStatut
  budgetPrevu: number
  axes: PaiAxe[]
  adopteLe: string | null
  deliberation: string | null
}

export interface PaiAxe {
  id: Id
  code: string
  libelle: string
  budgetPrevu: number
  programmeIds: Id[]
}

/* ---------------------------------------------------------------- Programmes */

export type ProgrammeStatut = 'PREPARATION' | 'EN_COURS' | 'SUSPENDU' | 'CLOTURE'
export type Secteur =
  | 'EAU'
  | 'EDUCATION'
  | 'SANTE'
  | 'ROUTES'
  | 'AGRICULTURE'
  | 'ENERGIE'
  | 'JEUNESSE'
  | 'ASSAINISSEMENT'

export interface Programme {
  id: Id
  code: string
  intitule: string
  paiId: Id
  axeId: Id
  secteur: Secteur
  statut: ProgrammeStatut
  budgetPrevu: number
  budgetEngage: number
  budgetPaye: number
  dateDebut: string
  dateFin: string
  responsable: string
  nbProjets: number
  avancement: number
}

/* ------------------------------------------------------------------- Projets */

export type ProjetStatut =
  | 'IDENTIFIE'
  | 'ETUDE'
  | 'PASSATION'
  | 'EN_TRAVAUX'
  | 'RECEPTION'
  | 'EXPLOITATION'
  | 'SUSPENDU'
  | 'ABANDONNE'

export type NiveauRisque = 'FAIBLE' | 'MOYEN' | 'ELEVE'

export interface Projet {
  id: Id
  code: string
  intitule: string
  programmeId: Id
  territoireId: Id
  secteur: Secteur
  statut: ProjetStatut
  avancementPhysique: number
  avancementFinancier: number
  budgetPrevu: number
  budgetEngage: number
  budgetPaye: number
  dateDebut: string
  dateFinPrevue: string
  dateFinReelle: string | null
  prestataireId: Id | null
  controleurId: Id | null
  risque: NiveauRisque
  latitude: number
  longitude: number
  beneficiaires: number
  maitreOuvrage: string
}

export type JalonStatut = 'PREVU' | 'EN_COURS' | 'ATTEINT' | 'RETARD'

export interface Jalon {
  id: Id
  projetId: Id
  libelle: string
  datePrevue: string
  dateReelle: string | null
  statut: JalonStatut
  commentaire: string | null
}

/* ---------------------------------------------------------- Infrastructures */

export type EtatOuvrage = 'BON' | 'MOYEN' | 'DEGRADE' | 'HORS_SERVICE'

export interface Infrastructure {
  id: Id
  code: string
  designation: string
  type: string
  territoireId: Id
  projetId: Id | null
  etat: EtatOuvrage
  miseEnServiceLe: string | null
  latitude: number
  longitude: number
  valeurPatrimoniale: number
  derniereVisite: string | null
  prochaineVisite: string | null
}

export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'URGENCE'
export type MaintenanceStatut = 'DEMANDEE' | 'PLANIFIEE' | 'EN_COURS' | 'REALISEE' | 'REJETEE'

export interface Maintenance {
  id: Id
  reference: string
  infrastructureId: Id
  type: MaintenanceType
  statut: MaintenanceStatut
  signaleLe: string
  planifieLe: string | null
  clotureLe: string | null
  cout: number
  description: string
  prestataireId: Id | null
}

/* -------------------------------------------------------------- Contrôleurs */

export type MissionStatut = 'PLANIFIEE' | 'EN_COURS' | 'RAPPORT_DEPOSE' | 'CLOTUREE'

export interface Controleur {
  id: Id
  nom: string
  fonction: string
  zone: string
  telephone: string
  email: string
  missionsEnCours: number
}

export interface MissionControle {
  id: Id
  reference: string
  projetId: Id
  controleurId: Id
  statut: MissionStatut
  dateVisite: string
  conformite: number
  observations: string
  reservesLevees: boolean
  documentIds: Id[]
}

/* ------------------------------------------------------------------ Finances */

export type EngagementStatut = 'PROPOSE' | 'VISE' | 'ENGAGE' | 'LIQUIDE' | 'PAYE' | 'REJETE'
export type SourceFinancement =
  | 'BUDGET_REGIONAL'
  | 'ETAT'
  | 'FONDS_DEV_LOCAL'
  | 'PARTENAIRE'
  | 'EMPRUNT'

export interface LigneBudgetaire {
  id: Id
  code: string
  libelle: string
  exercice: number
  source: SourceFinancement
  dotation: number
  engage: number
  paye: number
  programmeId: Id | null
}

export interface Engagement {
  id: Id
  reference: string
  ligneId: Id
  projetId: Id | null
  prestataireId: Id | null
  objet: string
  montant: number
  statut: EngagementStatut
  dateCreation: string
  datePaiement: string | null
}

/* --------------------------------------------------------------- Prestataires */

export type PrestataireStatut = 'AGREE' | 'EN_VALIDATION' | 'SUSPENDU' | 'RADIE'

export interface Prestataire {
  id: Id
  raisonSociale: string
  rccm: string
  categorie: string
  ville: string
  statut: PrestataireStatut
  contact: string
  telephone: string
  email: string
  marchesAttribues: number
  montantCumule: number
  notePerformance: number
}

/* ---------------------------------------------------------------- Équipements */

export type EquipementStatut = 'DISPONIBLE' | 'AFFECTE' | 'EN_PANNE' | 'REFORME'

export interface Equipement {
  id: Id
  code: string
  designation: string
  categorie: string
  statut: EquipementStatut
  affectation: string | null
  territoireId: Id | null
  acquisLe: string
  valeurAcquisition: number
  immatriculation: string | null
}

/* ------------------------------------------------------------------ Documents */

export type DocumentType =
  | 'DELIBERATION'
  | 'MARCHE'
  | 'RAPPORT_MISSION'
  | 'PV_RECEPTION'
  | 'FACTURE'
  | 'ETUDE'
  | 'ARRETE'
  | 'PLAN'

export interface GedDocument {
  id: Id
  reference: string
  titre: string
  type: DocumentType
  version: number
  taillekB: number
  deposeLe: string
  deposePar: string
  projetId: Id | null
  programmeId: Id | null
  engagementId: Id | null
  missionId: Id | null
  confidentiel: boolean
  tags: string[]
}

/* ------------------------------------------------------------------ Workflows */

export type WorkflowEtapeStatut = 'A_FAIRE' | 'EN_COURS' | 'VALIDE' | 'REJETE'

export interface WorkflowEtape {
  id: Id
  ordre: number
  libelle: string
  responsable: string
  statut: WorkflowEtapeStatut
  traiteLe: string | null
  commentaire: string | null
}

export type WorkflowType =
  | 'VALIDATION_PROJET'
  | 'PASSATION_MARCHE'
  | 'ENGAGEMENT_DEPENSE'
  | 'RECEPTION_OUVRAGE'
  | 'DEMANDE_MAINTENANCE'

export interface WorkflowInstance {
  id: Id
  reference: string
  type: WorkflowType
  objet: string
  projetId: Id | null
  statut: 'EN_COURS' | 'VALIDE' | 'REJETE'
  ouvertLe: string
  clotureLe: string | null
  etapes: WorkflowEtape[]
}

/* ----------------------------------------------------------------- Indicateurs */

export type IndicateurTendance = 'HAUSSE' | 'BAISSE' | 'STABLE'

export interface Indicateur {
  id: Id
  code: string
  libelle: string
  unite: string
  secteur: Secteur
  cible: number
  valeur: number
  tendance: IndicateurTendance
  territoireId: Id | null
  programmeId: Id | null
  serie: { periode: string; valeur: number }[]
  source: string
}

export interface ImpactMesure {
  id: Id
  libelle: string
  secteur: Secteur
  territoireId: Id
  beneficiaires: number
  avantIntervention: number
  apresIntervention: number
  unite: string
  mesureLe: string
}

/* -------------------------------------------------------------------- Décision */

export type AlerteNiveau = 'INFO' | 'VIGILANCE' | 'CRITIQUE'

export interface Alerte {
  id: Id
  niveau: AlerteNiveau
  titre: string
  detail: string
  moduleCible: string
  lienId: Id | null
  detecteLe: string
}

export interface Arbitrage {
  id: Id
  intitule: string
  contexte: string
  optionRetenue: string | null
  options: { libelle: string; cout: number; impact: number; delaiMois: number }[]
  statut: 'A_ARBITRER' | 'ARBITRE'
  decideLe: string | null
}

/* --------------------------------------------------------------------- Rapports */

export interface RapportModele {
  id: Id
  intitule: string
  perimetre: string
  periodicite: 'MENSUEL' | 'TRIMESTRIEL' | 'ANNUEL' | 'A_LA_DEMANDE'
  dernierGenereLe: string | null
  formats: ('PDF' | 'XLSX' | 'CSV')[]
}

/* ----------------------------------------------------------------------- Audit */

export interface AuditEntree {
  id: Id
  horodatage: string
  acteur: string
  action: string
  module: string
  cible: string
  adresseIp: string
  resultat: 'SUCCES' | 'ECHEC'
}

/* -------------------------------------------------------------- Administration */

export type RoleUtilisateur =
  | 'ADMIN'
  | 'PRESIDENT'
  | 'DIRECTEUR'
  | 'CHEF_SERVICE'
  | 'CONTROLEUR'
  | 'AGENT'
  | 'PRESTATAIRE'
  | 'CITOYEN'

export interface Utilisateur {
  id: Id
  nom: string
  email: string
  role: RoleUtilisateur
  direction: string
  actif: boolean
  dernierAcces: string | null
}

/* --------------------------------------------------------------------- Portails */

export type RequeteCitoyenneStatut = 'RECUE' | 'EN_INSTRUCTION' | 'TRAITEE' | 'REJETEE'

export interface RequeteCitoyenne {
  id: Id
  reference: string
  objet: string
  territoireId: Id
  categorie: string
  statut: RequeteCitoyenneStatut
  deposeeLe: string
  traiteeLe: string | null
  canal: 'PORTAIL' | 'GUICHET' | 'TELEPHONE'
}

export type DemarcheEntrepriseStatut = 'BROUILLON' | 'DEPOSEE' | 'INSTRUITE' | 'VALIDEE' | 'REJETEE'

export interface DemarcheEntreprise {
  id: Id
  reference: string
  entreprise: string
  objet: string
  statut: DemarcheEntrepriseStatut
  deposeeLe: string
  echeance: string | null
  piecesFournies: number
  piecesRequises: number
}

/* ------------------------------------------------------------------ Dashboards */

export interface DashboardSynthese {
  budgetPrevu: number
  budgetEngage: number
  budgetPaye: number
  nbProgrammes: number
  nbProjets: number
  nbProjetsEnTravaux: number
  nbProjetsEnRetard: number
  nbInfrastructures: number
  beneficiaires: number
  tauxExecutionPhysique: number
  tauxExecutionFinanciere: number
  parSecteur: { secteur: Secteur; budget: number; projets: number }[]
  parStatut: { statut: ProjetStatut; projets: number }[]
  executionMensuelle: { periode: string; engage: number; paye: number }[]
  parTerritoire: { territoireId: Id; nom: string; projets: number; budget: number }[]
}
