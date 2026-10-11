import type {
  DocumentType,
  EngagementStatut,
  EquipementStatut,
  EtatOuvrage,
  MaintenanceStatut,
  MaintenanceType,
  MissionStatut,
  PrestataireStatut,
  ProgrammeStatut,
  ProjetStatut,
  RequeteCitoyenneStatut,
  Secteur,
  SourceFinancement,
  WorkflowType,
} from '../types/domain'

export const SECTEURS: Secteur[] = ['EAU', 'EDUCATION', 'SANTE', 'ROUTES', 'AGRICULTURE', 'ENERGIE', 'JEUNESSE', 'ASSAINISSEMENT']

export const PROJET_STATUTS: ProjetStatut[] = [
  'IDENTIFIE',
  'ETUDE',
  'PASSATION',
  'EN_TRAVAUX',
  'RECEPTION',
  'EXPLOITATION',
  'SUSPENDU',
  'ABANDONNE',
]

export const PROGRAMME_STATUTS: ProgrammeStatut[] = ['PREPARATION', 'EN_COURS', 'SUSPENDU', 'CLOTURE']

export const ETATS_OUVRAGE: EtatOuvrage[] = ['BON', 'MOYEN', 'DEGRADE', 'HORS_SERVICE']

export const MAINTENANCE_TYPES: MaintenanceType[] = ['PREVENTIVE', 'CORRECTIVE', 'URGENCE']
export const MAINTENANCE_STATUTS: MaintenanceStatut[] = ['DEMANDEE', 'PLANIFIEE', 'EN_COURS', 'REALISEE', 'REJETEE']

export const MISSION_STATUTS: MissionStatut[] = ['PLANIFIEE', 'EN_COURS', 'RAPPORT_DEPOSE', 'CLOTUREE']

export const ENGAGEMENT_STATUTS: EngagementStatut[] = ['PROPOSE', 'VISE', 'ENGAGE', 'LIQUIDE', 'PAYE', 'REJETE']
export const SOURCES_FINANCEMENT: SourceFinancement[] = ['BUDGET_REGIONAL', 'ETAT', 'FONDS_DEV_LOCAL', 'PARTENAIRE', 'EMPRUNT']

export const PRESTATAIRE_STATUTS: PrestataireStatut[] = ['AGREE', 'EN_VALIDATION', 'SUSPENDU', 'RADIE']

export const EQUIPEMENT_STATUTS: EquipementStatut[] = ['DISPONIBLE', 'AFFECTE', 'EN_PANNE', 'REFORME']

export const DOCUMENT_TYPES: DocumentType[] = [
  'DELIBERATION',
  'MARCHE',
  'RAPPORT_MISSION',
  'PV_RECEPTION',
  'FACTURE',
  'ETUDE',
  'ARRETE',
  'PLAN',
]

export const WORKFLOW_TYPES: WorkflowType[] = [
  'VALIDATION_PROJET',
  'PASSATION_MARCHE',
  'ENGAGEMENT_DEPENSE',
  'RECEPTION_OUVRAGE',
  'DEMANDE_MAINTENANCE',
]

export const REQUETE_STATUTS: RequeteCitoyenneStatut[] = ['RECUE', 'EN_INSTRUCTION', 'TRAITEE', 'REJETEE']

export const CATEGORIES_REQUETE = ['EAU', 'ROUTE', 'ECOLE', 'SANTE', 'ELECTRIFICATION', 'ASSAINISSEMENT', 'AUTRE']
