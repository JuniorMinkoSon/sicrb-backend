/**
 * Contrat de service du SICRB : c'est la SEULE frontière entre l'UI et les
 * données. Deux implémentations existent :
 *  - `mockApi`  : jeu de données de démonstration en mémoire (par défaut) ;
 *  - `httpApi`  : appels REST vers le backend Quarkus `sicrb-backend`.
 *
 * Aucun composant ne doit importer les mocks directement : ils passent par
 * `useApi()` / les hooks de `src/api/hooks.ts`. Le remplacement des mocks par
 * Quarkus se fait donc sans réécrire l'application.
 */

import type {
  Alerte,
  Arbitrage,
  AuditEntree,
  Controleur,
  DashboardSynthese,
  DemarcheEntreprise,
  Engagement,
  Equipement,
  GedDocument,
  Id,
  ImpactMesure,
  Indicateur,
  Infrastructure,
  Jalon,
  LigneBudgetaire,
  Maintenance,
  MissionControle,
  Page,
  PageQuery,
  Pai,
  Prestataire,
  Programme,
  Projet,
  RapportModele,
  RequeteCitoyenne,
  SessionDeliberante,
  Territoire,
  Utilisateur,
  WorkflowEtape,
  WorkflowInstance,
} from '../types/domain'

export interface ProjetDetail {
  projet: Projet
  programme: Programme | null
  territoire: Territoire | null
  prestataire: Prestataire | null
  controleur: Controleur | null
  jalons: Jalon[]
  engagements: Engagement[]
  documents: GedDocument[]
  missions: MissionControle[]
  infrastructures: Infrastructure[]
  workflows: WorkflowInstance[]
}

export interface ProgrammeDetail {
  programme: Programme
  pai: Pai | null
  projets: Projet[]
  indicateurs: Indicateur[]
  lignes: LigneBudgetaire[]
}

export interface TerritoireDetail {
  territoire: Territoire
  enfants: Territoire[]
  projets: Projet[]
  infrastructures: Infrastructure[]
  requetes: RequeteCitoyenne[]
}

export interface SicrbApi {
  dashboard(): Promise<DashboardSynthese>

  territoires(query?: PageQuery): Promise<Page<Territoire>>
  territoire(id: Id): Promise<TerritoireDetail>

  sessions(query?: PageQuery): Promise<Page<SessionDeliberante>>

  pais(): Promise<Pai[]>

  programmes(query?: PageQuery): Promise<Page<Programme>>
  programme(id: Id): Promise<ProgrammeDetail>

  projets(query?: PageQuery): Promise<Page<Projet>>
  projet(id: Id): Promise<ProjetDetail>
  projetsGeo(query?: PageQuery): Promise<Projet[]>

  infrastructures(query?: PageQuery): Promise<Page<Infrastructure>>
  maintenances(query?: PageQuery): Promise<Page<Maintenance>>
  demanderMaintenance(input: { infrastructureId: Id; type: Maintenance['type']; description: string }): Promise<Maintenance>

  controleurs(): Promise<Controleur[]>
  missions(query?: PageQuery): Promise<Page<MissionControle>>

  lignes(query?: PageQuery): Promise<Page<LigneBudgetaire>>
  engagements(query?: PageQuery): Promise<Page<Engagement>>

  prestataires(query?: PageQuery): Promise<Page<Prestataire>>
  prestataire(id: Id): Promise<{ prestataire: Prestataire; projets: Projet[]; engagements: Engagement[] }>

  equipements(query?: PageQuery): Promise<Page<Equipement>>

  documents(query?: PageQuery): Promise<Page<GedDocument>>

  workflows(query?: PageQuery): Promise<Page<WorkflowInstance>>
  workflow(id: Id): Promise<WorkflowInstance>
  traiterEtape(input: { workflowId: Id; etapeId: Id; decision: 'VALIDE' | 'REJETE'; commentaire?: string }): Promise<WorkflowInstance>

  indicateurs(query?: PageQuery): Promise<Page<Indicateur>>
  impacts(query?: PageQuery): Promise<Page<ImpactMesure>>

  alertes(): Promise<Alerte[]>
  arbitrages(): Promise<Arbitrage[]>
  arbitrer(input: { id: Id; option: string }): Promise<Arbitrage>

  rapports(): Promise<RapportModele[]>
  audits(query?: PageQuery): Promise<Page<AuditEntree>>
  utilisateurs(query?: PageQuery): Promise<Page<Utilisateur>>
  basculerUtilisateur(id: Id): Promise<Utilisateur>

  requetes(query?: PageQuery): Promise<Page<RequeteCitoyenne>>
  deposerRequete(input: { objet: string; territoireId: Id; categorie: string }): Promise<RequeteCitoyenne>
  demarches(query?: PageQuery): Promise<Page<DemarcheEntreprise>>

  recherche(q: string): Promise<
    { module: string; libelle: string; sousTitre: string; href: string }[]
  >
}

export type { WorkflowEtape }
