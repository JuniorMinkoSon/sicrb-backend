/**
 * Génère la migration de données initiales du backend à partir du jeu de
 * démonstration du frontend.
 *
 * Le jeu est produit par une graine fixe : il est donc reproductible, et c'est
 * ce qui permet de le transposer en SQL. Le backend sert ainsi exactement ce
 * que montrent les maquettes, et basculer `VITE_API_MODE` de `mock` à `http`
 * ne change rien à l'écran — c'est précisément ce qui permet de vérifier que le
 * branchement est correct.
 *
 * À relancer dès que `src/mocks/dataset.ts` change, sans quoi les deux sources
 * divergent en silence :
 *
 *     npm run seed:sql
 *
 * Écrit en test plutôt qu'en script autonome parce que vitest exécute le
 * TypeScript du projet tel quel, avec ses chemins et sa configuration ; un
 * script séparé demanderait sa propre chaîne de compilation pour le même
 * résultat. Il est exclu des exécutions ordinaires de la suite.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { test } from 'vitest'
import * as d from '../src/mocks/dataset'

const SORTIE = resolve(
  import.meta.dirname,
  '../../src/main/resources/db/migration/V2__donnees_initiales.sql',
)

/** Échappement SQL : une apostrophe doublée, un absent devient NULL. */
function v(x: unknown): string {
  if (x === null || x === undefined) return 'NULL'
  if (typeof x === 'number') return Number.isFinite(x) ? String(x) : 'NULL'
  if (typeof x === 'boolean') return x ? 'true' : 'false'
  return `'${String(x).replace(/'/g, "''")}'`
}

const snake = (s: string) => s.replace(/([A-Z])/g, '_$1').toLowerCase()

/** Une table, ses colonnes, ses lignes. */
function insert(table: string, rows: Record<string, unknown>[], cols: string[]): string {
  if (rows.length === 0) return ''
  const head = `INSERT INTO ${table} (${cols.map(snake).join(', ')}) VALUES`
  const body = rows.map((r) => '  (' + cols.map((c) => v(r[c])).join(', ') + ')').join(',\n')
  return `${head}\n${body};\n`
}

/** Table de rattachement : une ligne par élément de la collection. */
function children(
  table: string,
  parentCol: string,
  childCols: string[],
  rows: { parent: string; items: unknown[] }[],
): string {
  const values: string[] = []
  rows.forEach(({ parent, items }) => {
    items.forEach((item) => {
      const cells =
        childCols.length === 1
          ? [v(item)]
          : childCols.map((c) => v((item as Record<string, unknown>)[c]))
      values.push('  (' + [v(parent), ...cells].join(', ') + ')')
    })
  })
  if (values.length === 0) return ''
  return `INSERT INTO ${table} (${[parentCol, ...childCols.map(snake)].join(', ')}) VALUES\n${values.join(',\n')};\n`
}

test('génère la migration de données initiales', () => {
  const parts: string[] = [
    '-- BAGOUÉ 360 : jeu de données initial.',
    '--',
    '-- FICHIER GÉNÉRÉ — ne pas modifier à la main.',
    '-- Source : web/src/mocks/dataset.ts · Régénérer : cd web && npm run seed:sql',
    '--',
    "-- AVERTISSEMENT : aucune de ces données n'est officielle. Les découpages",
    '-- administratifs, les montants et les coordonnées sont approximatifs et',
    '-- devront être remplacés par les données réelles du Conseil régional à la',
    '-- mise en service.',
    '',
  ]

  const P = (s: string) => parts.push(s)

  P(insert('territoire', d.territoires as never, [
    'id', 'nom', 'type', 'parentId', 'chefLieu', 'population', 'superficieKm2',
    'latitude', 'longitude', 'tauxAccesEau', 'tauxElectrification', 'nbLocalites',
  ]))

  P(insert('session_deliberante', d.sessions as never, [
    'id', 'intitule', 'type', 'date', 'statut', 'presents', 'quorum', 'deliberations',
  ]))
  P(children('session_document', 'session_id', ['documentId'],
    d.sessions.map((s) => ({ parent: s.id, items: s.documentIds }))))

  P(insert('pai', d.pais as never, [
    'id', 'intitule', 'anneeDebut', 'anneeFin', 'statut', 'budgetPrevu', 'adopteLe', 'deliberation',
  ]))
  const axes = d.pais.flatMap((p) => p.axes.map((a) => ({ ...a, paiId: p.id })))
  P(insert('pai_axe', axes as never, ['id', 'code', 'libelle', 'budgetPrevu', 'paiId']))
  P(children('pai_axe_programme', 'axe_id', ['programmeId'],
    axes.map((a) => ({ parent: a.id, items: a.programmeIds }))))

  P(insert('programme', d.programmes as never, [
    'id', 'code', 'intitule', 'paiId', 'axeId', 'secteur', 'statut', 'budgetPrevu',
    'budgetEngage', 'budgetPaye', 'dateDebut', 'dateFin', 'responsable', 'nbProjets', 'avancement',
  ]))

  P(insert('prestataire', d.prestataires as never, [
    'id', 'raisonSociale', 'rccm', 'categorie', 'ville', 'statut', 'contact', 'telephone',
    'email', 'marchesAttribues', 'montantCumule', 'notePerformance',
  ]))

  P(insert('controleur', d.controleurs as never, [
    'id', 'nom', 'fonction', 'zone', 'telephone', 'email', 'missionsEnCours',
  ]))

  P(insert('projet', d.projets as never, [
    'id', 'code', 'intitule', 'programmeId', 'territoireId', 'secteur', 'statut',
    'avancementPhysique', 'avancementFinancier', 'budgetPrevu', 'budgetEngage', 'budgetPaye',
    'dateDebut', 'dateFinPrevue', 'dateFinReelle', 'prestataireId', 'controleurId', 'risque',
    'latitude', 'longitude', 'beneficiaires', 'maitreOuvrage',
  ]))

  P(insert('jalon', d.jalons as never, [
    'id', 'projetId', 'libelle', 'datePrevue', 'dateReelle', 'statut', 'commentaire',
  ]))

  P(insert('infrastructure', d.infrastructures as never, [
    'id', 'code', 'designation', 'type', 'territoireId', 'projetId', 'etat', 'miseEnServiceLe',
    'latitude', 'longitude', 'valeurPatrimoniale', 'derniereVisite', 'prochaineVisite',
  ]))

  P(insert('maintenance', d.maintenances as never, [
    'id', 'reference', 'infrastructureId', 'type', 'statut', 'signaleLe', 'planifieLe',
    'clotureLe', 'cout', 'description', 'prestataireId',
  ]))

  P(insert('ligne_budgetaire', d.lignes as never, [
    'id', 'code', 'libelle', 'exercice', 'source', 'dotation', 'engage', 'paye', 'programmeId',
  ]))

  P(insert('engagement', d.engagements as never, [
    'id', 'reference', 'ligneId', 'projetId', 'prestataireId', 'objet', 'montant', 'statut',
    'dateCreation', 'datePaiement',
  ]))

  P(insert('equipement', d.equipements as never, [
    'id', 'code', 'designation', 'categorie', 'statut', 'affectation', 'territoireId',
    'acquisLe', 'valeurAcquisition', 'immatriculation',
  ]))

  P(insert('ged_document', d.documents as never, [
    'id', 'reference', 'titre', 'type', 'version', 'taillekB', 'deposeLe', 'deposePar',
    'projetId', 'programmeId', 'engagementId', 'missionId', 'confidentiel',
  ]))
  P(children('ged_document_tag', 'document_id', ['tag'],
    d.documents.map((x) => ({ parent: x.id, items: x.tags }))))

  P(insert('mission_controle', d.missions as never, [
    'id', 'reference', 'projetId', 'controleurId', 'statut', 'dateVisite', 'conformite',
    'observations', 'reservesLevees',
  ]))
  P(children('mission_document', 'mission_id', ['documentId'],
    d.missions.map((m) => ({ parent: m.id, items: m.documentIds }))))

  P(insert('workflow_instance', d.workflows as never, [
    'id', 'reference', 'type', 'objet', 'projetId', 'statut', 'ouvertLe', 'clotureLe',
  ]))
  const etapes = d.workflows.flatMap((w) => w.etapes.map((e) => ({ ...e, workflowId: w.id })))
  P(insert('workflow_etape', etapes as never, [
    'id', 'ordre', 'libelle', 'responsable', 'statut', 'traiteLe', 'commentaire', 'workflowId',
  ]))

  P(insert('indicateur', d.indicateurs as never, [
    'id', 'code', 'libelle', 'unite', 'secteur', 'cible', 'valeur', 'tendance',
    'territoireId', 'programmeId', 'source',
  ]))
  P(children('indicateur_serie', 'indicateur_id', ['periode', 'valeur'],
    d.indicateurs.map((i) => ({ parent: i.id, items: i.serie }))))

  P(insert('impact_mesure', d.impacts as never, [
    'id', 'libelle', 'secteur', 'territoireId', 'beneficiaires', 'avantIntervention',
    'apresIntervention', 'unite', 'mesureLe',
  ]))

  P(insert('alerte', d.alertes as never, [
    'id', 'niveau', 'titre', 'detail', 'moduleCible', 'lienId', 'detecteLe',
  ]))

  P(insert('arbitrage', d.arbitrages as never, [
    'id', 'intitule', 'contexte', 'optionRetenue', 'statut', 'decideLe',
  ]))
  P(children('arbitrage_option', 'arbitrage_id', ['libelle', 'cout', 'impact', 'delaiMois'],
    d.arbitrages.map((a) => ({ parent: a.id, items: a.options }))))

  P(insert('rapport_modele', d.rapports as never, [
    'id', 'intitule', 'perimetre', 'periodicite', 'dernierGenereLe',
  ]))
  P(children('rapport_format', 'rapport_id', ['format'],
    d.rapports.map((r) => ({ parent: r.id, items: r.formats }))))

  P(insert('audit_entree', d.audits as never, [
    'id', 'horodatage', 'acteur', 'action', 'module', 'cible', 'adresseIp', 'resultat',
  ]))

  P(insert('utilisateur', d.utilisateurs as never, [
    'id', 'nom', 'email', 'role', 'direction', 'actif', 'dernierAcces',
  ]))

  P(insert('requete_citoyenne', d.requetes as never, [
    'id', 'reference', 'objet', 'territoireId', 'categorie', 'statut', 'deposeeLe',
    'traiteeLe', 'canal',
  ]))

  P(insert('demarche_entreprise', d.demarches as never, [
    'id', 'reference', 'entreprise', 'objet', 'statut', 'deposeeLe', 'echeance',
    'piecesFournies', 'piecesRequises',
  ]))

  writeFileSync(SORTIE, parts.filter(Boolean).join('\n'), 'utf8')
})
