/**
 * Jeu de données de DÉMONSTRATION du SICRB.
 *
 * AVERTISSEMENT : aucune de ces données n'est officielle. Elles sont générées de
 * façon déterministe (graine fixe) uniquement pour éprouver l'ergonomie et les
 * volumes de l'application avant le branchement des services Quarkus.
 * Les découpages administratifs et les coordonnées sont approximatifs.
 */

import type {
  Alerte,
  Arbitrage,
  AuditEntree,
  Controleur,
  DemarcheEntreprise,
  Engagement,
  Equipement,
  GedDocument,
  ImpactMesure,
  Indicateur,
  Infrastructure,
  Jalon,
  LigneBudgetaire,
  Maintenance,
  MissionControle,
  Pai,
  Programme,
  Prestataire,
  Projet,
  RapportModele,
  RequeteCitoyenne,
  Secteur,
  SessionDeliberante,
  Territoire,
  Utilisateur,
  WorkflowInstance,
} from '../types/domain'

/** PRNG déterministe (mulberry32) : mêmes données à chaque exécution. */
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = rng(20260818)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const int = (min: number, max: number) => Math.floor(min + rand() * (max - min + 1))
const round = (n: number, step = 1000) => Math.round(n / step) * step
const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const dateBetween = (y1: number, y2: number) => iso(int(y1, y2), int(1, 12), int(1, 28))
const stamp = (y1: number, y2: number) =>
  `${dateBetween(y1, y2)}T${String(int(6, 20)).padStart(2, '0')}:${String(int(0, 59)).padStart(2, '0')}:00Z`

/* ------------------------------------------------------------------ Territoire */

export const territoires: Territoire[] = [
  {
    id: 'ter-region',
    nom: 'Région de la Bagoué',
    type: 'REGION',
    parentId: null,
    chefLieu: 'Boundiali',
    population: 508000,
    superficieKm2: 9500,
    latitude: 9.87,
    longitude: -6.47,
    tauxAccesEau: 62,
    tauxElectrification: 48,
    nbLocalites: 412,
  },
  {
    id: 'ter-boundiali',
    nom: 'Boundiali',
    type: 'DEPARTEMENT',
    parentId: 'ter-region',
    chefLieu: 'Boundiali',
    population: 214000,
    superficieKm2: 4210,
    latitude: 9.52,
    longitude: -6.49,
    tauxAccesEau: 66,
    tauxElectrification: 55,
    nbLocalites: 168,
  },
  {
    id: 'ter-kouto',
    nom: 'Kouto',
    type: 'DEPARTEMENT',
    parentId: 'ter-region',
    chefLieu: 'Kouto',
    population: 172000,
    superficieKm2: 2980,
    latitude: 9.9,
    longitude: -6.41,
    tauxAccesEau: 59,
    tauxElectrification: 43,
    nbLocalites: 134,
  },
  {
    id: 'ter-tengrela',
    nom: 'Tengréla',
    type: 'DEPARTEMENT',
    parentId: 'ter-region',
    chefLieu: 'Tengréla',
    population: 122000,
    superficieKm2: 2310,
    latitude: 10.48,
    longitude: -6.4,
    tauxAccesEau: 57,
    tauxElectrification: 41,
    nbLocalites: 110,
  },
]

const sousPrefectures: [string, string, number, number][] = [
  ['Boundiali', 'ter-boundiali', 9.52, -6.49],
  ['Baya', 'ter-boundiali', 9.63, -6.63],
  ['Ganaoni', 'ter-boundiali', 9.73, -6.32],
  ['Kasséré', 'ter-boundiali', 9.42, -6.72],
  ['Siempurgo', 'ter-boundiali', 9.36, -6.28],
  ['Kolia', 'ter-boundiali', 9.79, -6.75],
  ['Kouto', 'ter-kouto', 9.9, -6.41],
  ['Gbon', 'ter-kouto', 9.83, -6.29],
  ['Sianhala', 'ter-kouto', 10.05, -6.55],
  ['Blességué', 'ter-kouto', 9.96, -6.2],
  ['Tengréla', 'ter-tengrela', 10.48, -6.4],
  ['Débété', 'ter-tengrela', 10.35, -6.55],
  ['Kanakono', 'ter-tengrela', 10.29, -6.24],
]

sousPrefectures.forEach(([nom, parentId, lat, lng], i) => {
  territoires.push({
    id: `ter-sp-${i + 1}`,
    nom,
    type: 'SOUS_PREFECTURE',
    parentId,
    chefLieu: nom,
    population: int(9000, 48000),
    superficieKm2: int(320, 1150),
    latitude: lat,
    longitude: lng,
    tauxAccesEau: int(38, 82),
    tauxElectrification: int(22, 74),
    nbLocalites: int(9, 42),
  })
})

export const territoiresOperationnels = territoires.filter((t) => t.type === 'SOUS_PREFECTURE')

/* ----------------------------------------------------------------- Gouvernance */

export const sessions: SessionDeliberante[] = Array.from({ length: 14 }, (_, i) => {
  const type = pick(['PLENIERE', 'BUREAU', 'COMMISSION'] as const)
  const presents = int(18, 41)
  return {
    id: `ses-${i + 1}`,
    intitule: `${type === 'PLENIERE' ? 'Session plénière' : type === 'BUREAU' ? 'Réunion du bureau' : 'Commission sectorielle'} n°${i + 1}`,
    type,
    date: dateBetween(2024, 2026),
    statut: pick(['PLANIFIEE', 'EN_COURS', 'CLOTUREE'] as const),
    presents,
    quorum: 21,
    deliberations: int(1, 9),
    documentIds: [],
  }
})

/* ---------------------------------------------------------------------- PAI */

const secteurs: Secteur[] = [
  'EAU',
  'EDUCATION',
  'SANTE',
  'ROUTES',
  'AGRICULTURE',
  'ENERGIE',
  'JEUNESSE',
  'ASSAINISSEMENT',
]

const axesLibelles: [string, string][] = [
  ['AX1', 'Accès à l’eau potable et assainissement'],
  ['AX2', 'Infrastructures scolaires et éducation'],
  ['AX3', 'Santé de proximité'],
  ['AX4', 'Désenclavement et pistes rurales'],
  ['AX5', 'Développement agricole et pastoral'],
  ['AX6', 'Jeunesse, emploi et cohésion sociale'],
]

export const pais: Pai[] = [
  {
    id: 'pai-2023-2027',
    intitule: 'Programme Annuel d’Investissement 2023-2027',
    anneeDebut: 2023,
    anneeFin: 2027,
    statut: 'EN_EXECUTION',
    budgetPrevu: 0,
    axes: axesLibelles.map(([code, libelle], i) => ({
      id: `axe-${i + 1}`,
      code,
      libelle,
      budgetPrevu: round(int(900, 4200) * 1_000_000, 1_000_000),
      programmeIds: [],
    })),
    adopteLe: '2023-02-17',
    deliberation: 'DEL-2023-014',
  },
  {
    id: 'pai-2028-2032',
    intitule: 'Programme Annuel d’Investissement 2028-2032 (projet)',
    anneeDebut: 2028,
    anneeFin: 2032,
    statut: 'CONCERTATION',
    budgetPrevu: 0,
    axes: axesLibelles.slice(0, 4).map(([code, libelle], i) => ({
      id: `axe-n-${i + 1}`,
      code,
      libelle,
      budgetPrevu: round(int(1200, 5200) * 1_000_000, 1_000_000),
      programmeIds: [],
    })),
    adopteLe: null,
    deliberation: null,
  },
]
pais.forEach((p) => {
  p.budgetPrevu = p.axes.reduce((s, a) => s + a.budgetPrevu, 0)
})

/* ------------------------------------------------------------------ Programmes */

const responsables = [
  'Direction des Infrastructures',
  'Direction de la Planification',
  'Direction des Affaires Financières',
  'Direction du Développement Rural',
  'Direction des Affaires Sociales',
]

export const programmes: Programme[] = Array.from({ length: 16 }, (_, i) => {
  const pai = pais[0]
  const axe = pai.axes[i % pai.axes.length]
  const budgetPrevu = round(int(180, 1400) * 1_000_000, 1_000_000)
  const budgetEngage = round(budgetPrevu * (0.35 + rand() * 0.6), 100_000)
  const budgetPaye = round(budgetEngage * (0.3 + rand() * 0.65), 100_000)
  axe.programmeIds.push(`prg-${i + 1}`)
  return {
    id: `prg-${i + 1}`,
    code: `PRG-${String(i + 1).padStart(3, '0')}`,
    intitule: [
      'Hydraulique villageoise améliorée',
      'Construction de salles de classe',
      'Réhabilitation des centres de santé ruraux',
      'Pistes rurales et ouvrages de franchissement',
      'Appui aux coopératives agricoles',
      'Électrification rurale décentralisée',
      'Centres multifonctionnels pour la jeunesse',
      'Assainissement des chefs-lieux',
      'Équipements marchands de proximité',
      'Adduction d’eau potable de Kouto',
      'Cantines scolaires régionales',
      'Maternités rurales',
      'Reprofilage des pistes cotonnières',
      'Magasins de stockage céréalier',
      'Éclairage public solaire',
      'Aménagement de bas-fonds rizicoles',
    ][i],
    paiId: pai.id,
    axeId: axe.id,
    secteur: secteurs[i % secteurs.length],
    statut: i < 12 ? 'EN_COURS' : pick(['PREPARATION', 'CLOTURE', 'SUSPENDU'] as const),
    budgetPrevu,
    budgetEngage,
    budgetPaye,
    dateDebut: dateBetween(2023, 2024),
    dateFin: dateBetween(2026, 2028),
    responsable: pick(responsables),
    nbProjets: 0,
    avancement: int(5, 96),
  }
})

/* ---------------------------------------------------------------- Prestataires */

const categoriesPrestataire = [
  'BTP / Génie civil',
  'Hydraulique',
  'Bureau d’études',
  'Fournitures & équipements',
  'Électricité',
  'Transport & logistique',
]

export const prestataires: Prestataire[] = Array.from({ length: 42 }, (_, i) => {
  const ville = pick(['Boundiali', 'Kouto', 'Tengréla', 'Korhogo', 'Abidjan', 'Ferkessédougou'])
  return {
    id: `pst-${i + 1}`,
    raisonSociale: `${pick(['ETS', 'SARL', 'SA', 'GIE'])} ${pick(['BAGOUÉ', 'SAVANE', 'DENGUELÉ', 'TIÉBA', 'NIANGBO', 'PALMIER', 'HORIZON', 'KAFOLO'])}-${pick(['CONSTRUCTION', 'HYDRO', 'TECH', 'SERVICES', 'INGÉNIERIE', 'ÉNERGIE'])} ${i + 1}`,
    rccm: `CI-BDL-${int(2015, 2025)}-B-${int(1000, 9999)}`,
    categorie: pick(categoriesPrestataire),
    ville,
    statut: i % 11 === 0 ? 'SUSPENDU' : i % 7 === 0 ? 'EN_VALIDATION' : 'AGREE',
    contact: `${pick(['Coulibaly', 'Ouattara', 'Silué', 'Soro', 'Koné', 'Diomandé', 'Bakayoko'])} ${pick(['Ibrahim', 'Aminata', 'Salif', 'Mariam', 'Yacouba', 'Fatoumata'])}`,
    telephone: `+225 ${int(1, 7)}${int(1000000, 9999999)}`,
    email: `contact${i + 1}@prestataire-demo.ci`,
    marchesAttribues: int(0, 14),
    montantCumule: round(int(12, 980) * 1_000_000, 100_000),
    notePerformance: Number((2.4 + rand() * 2.6).toFixed(1)),
  }
})

/* ----------------------------------------------------------------- Contrôleurs */

export const controleurs: Controleur[] = Array.from({ length: 9 }, (_, i) => ({
  id: `ctl-${i + 1}`,
  nom: `${pick(['Silué', 'Soro', 'Koné', 'Touré', 'Yéo', 'Doumbia'])} ${pick(['Adama', 'Sékou', 'Awa', 'Bakary', 'Nadège', 'Moussa'])}`,
  fonction: pick([
    'Ingénieur de contrôle',
    'Technicien supérieur génie civil',
    'Contrôleur hydraulique',
    'Chargé de suivi-évaluation',
  ]),
  zone: pick(['Boundiali', 'Kouto', 'Tengréla', 'Région']),
  telephone: `+225 ${int(1, 7)}${int(1000000, 9999999)}`,
  email: `controleur${i + 1}@sicrb-demo.ci`,
  missionsEnCours: int(0, 6),
}))

/* --------------------------------------------------------------------- Projets */

const statutsProjet = [
  'IDENTIFIE',
  'ETUDE',
  'PASSATION',
  'EN_TRAVAUX',
  'RECEPTION',
  'EXPLOITATION',
  'SUSPENDU',
] as const

const intitulesProjet = [
  'Construction de {n} forages équipés de pompes à motricité humaine',
  'Réhabilitation du groupe scolaire de {loc}',
  'Construction d’un dispensaire à {loc}',
  'Reprofilage lourd de la piste {loc} — {loc2} ({n} km)',
  'Aménagement d’un bas-fond rizicole à {loc}',
  'Électrification solaire du centre de santé de {loc}',
  'Construction d’un foyer des jeunes à {loc}',
  'Réalisation de {n} latrines scolaires à {loc}',
  'Construction d’un magasin de stockage à {loc}',
  'Extension du réseau d’adduction d’eau de {loc}',
  'Construction de {n} salles de classe à {loc}',
  'Réhabilitation de la maternité de {loc}',
]

export const projets: Projet[] = Array.from({ length: 132 }, (_, i) => {
  const programme = programmes[i % programmes.length]
  const territoire = territoiresOperationnels[i % territoiresOperationnels.length]
  const autre = territoiresOperationnels[(i + 3) % territoiresOperationnels.length]
  const statut = i < 8 ? 'EN_TRAVAUX' : pick(statutsProjet)
  const budgetPrevu = round(int(12, 420) * 1_000_000, 500_000)
  const engageRatio =
    statut === 'IDENTIFIE' ? 0 : statut === 'ETUDE' ? 0.05 + rand() * 0.1 : 0.3 + rand() * 0.7
  const budgetEngage = round(budgetPrevu * engageRatio, 100_000)
  const budgetPaye = round(budgetEngage * (0.2 + rand() * 0.75), 100_000)
  const avancementPhysique =
    statut === 'IDENTIFIE'
      ? 0
      : statut === 'ETUDE'
        ? int(2, 12)
        : statut === 'PASSATION'
          ? int(5, 20)
          : statut === 'EN_TRAVAUX'
            ? int(15, 92)
            : statut === 'SUSPENDU'
              ? int(10, 60)
              : 100
  const dateFinPrevue = dateBetween(2025, 2027)
  const enRetard = statut === 'EN_TRAVAUX' && dateFinPrevue < '2026-08-18'
  programme.nbProjets += 1
  return {
    id: `prj-${i + 1}`,
    code: `PRJ-${String(i + 1).padStart(4, '0')}`,
    intitule: pick(intitulesProjet)
      .replaceAll('{loc2}', autre.nom)
      .replaceAll('{loc}', territoire.nom)
      .replaceAll('{n}', String(int(2, 18))),
    programmeId: programme.id,
    territoireId: territoire.id,
    secteur: programme.secteur,
    statut,
    avancementPhysique,
    avancementFinancier: budgetPrevu ? Math.round((budgetPaye / budgetPrevu) * 100) : 0,
    budgetPrevu,
    budgetEngage,
    budgetPaye,
    dateDebut: dateBetween(2023, 2025),
    dateFinPrevue,
    dateFinReelle: statut === 'EXPLOITATION' || statut === 'RECEPTION' ? dateBetween(2025, 2026) : null,
    prestataireId: statut === 'IDENTIFIE' || statut === 'ETUDE' ? null : pick(prestataires).id,
    controleurId: statut === 'IDENTIFIE' ? null : pick(controleurs).id,
    risque: enRetard ? 'ELEVE' : avancementPhysique < 30 && statut === 'EN_TRAVAUX' ? 'MOYEN' : pick(['FAIBLE', 'FAIBLE', 'MOYEN'] as const),
    latitude: Number((territoire.latitude + (rand() - 0.5) * 0.18).toFixed(5)),
    longitude: Number((territoire.longitude + (rand() - 0.5) * 0.18).toFixed(5)),
    beneficiaires: int(350, 24000),
    maitreOuvrage: 'Conseil Régional de la Bagoué',
  }
})

const jalonsLibelles = [
  'Étude technique validée',
  'Publication de l’appel d’offres',
  'Attribution du marché',
  'Ordre de service / démarrage',
  'Exécution à 50 %',
  'Réception provisoire',
  'Réception définitive',
]

export const jalons: Jalon[] = projets.flatMap((p) =>
  jalonsLibelles.map((libelle, k) => {
    const atteint = p.avancementPhysique >= ((k + 1) / jalonsLibelles.length) * 100
    const datePrevue = iso(
      Number(p.dateDebut.slice(0, 4)) + Math.floor(k / 4),
      ((Number(p.dateDebut.slice(5, 7)) + k * 2 - 1) % 12) + 1,
      int(1, 28),
    )
    return {
      id: `jal-${p.id}-${k + 1}`,
      projetId: p.id,
      libelle,
      datePrevue,
      dateReelle: atteint ? datePrevue : null,
      statut: atteint
        ? 'ATTEINT'
        : p.risque === 'ELEVE' && k <= 4
          ? 'RETARD'
          : p.avancementPhysique > (k / jalonsLibelles.length) * 100
            ? 'EN_COURS'
            : 'PREVU',
      commentaire: atteint ? null : p.risque === 'ELEVE' ? 'Retard constaté lors de la dernière mission de contrôle.' : null,
    }
  }),
)

/* ------------------------------------------------------------- Infrastructures */

const typesInfra = [
  'Forage équipé',
  'Salle de classe',
  'Centre de santé',
  'Piste rurale',
  'Marché de proximité',
  'Château d’eau',
  'Latrines scolaires',
  'Magasin de stockage',
]

export const infrastructures: Infrastructure[] = Array.from({ length: 78 }, (_, i) => {
  const projet = projets[(i * 3) % projets.length]
  const etat = pick(['BON', 'BON', 'MOYEN', 'DEGRADE', 'HORS_SERVICE'] as const)
  return {
    id: `inf-${i + 1}`,
    code: `INF-${String(i + 1).padStart(4, '0')}`,
    designation: `${pick(typesInfra)} — ${territoires.find((t) => t.id === projet.territoireId)?.nom}`,
    type: pick(typesInfra),
    territoireId: projet.territoireId,
    projetId: projet.id,
    etat,
    miseEnServiceLe: dateBetween(2016, 2025),
    latitude: projet.latitude,
    longitude: projet.longitude,
    valeurPatrimoniale: round(int(8, 260) * 1_000_000, 500_000),
    derniereVisite: dateBetween(2025, 2026),
    prochaineVisite: dateBetween(2026, 2027),
  }
})

export const maintenances: Maintenance[] = Array.from({ length: 96 }, (_, i) => {
  const infra = infrastructures[i % infrastructures.length]
  const statut = pick(['DEMANDEE', 'PLANIFIEE', 'EN_COURS', 'REALISEE', 'REALISEE', 'REJETEE'] as const)
  return {
    id: `mnt-${i + 1}`,
    reference: `MNT-2026-${String(i + 1).padStart(4, '0')}`,
    infrastructureId: infra.id,
    type: pick(['PREVENTIVE', 'CORRECTIVE', 'URGENCE'] as const),
    statut,
    signaleLe: stamp(2025, 2026),
    planifieLe: statut === 'DEMANDEE' ? null : dateBetween(2026, 2026),
    clotureLe: statut === 'REALISEE' ? dateBetween(2026, 2026) : null,
    cout: round(int(150, 9500) * 1000, 50_000),
    description: pick([
      'Pompe hors service signalée par le comité de gestion.',
      'Toiture endommagée après les vents violents.',
      'Ouvrage de franchissement affouillé.',
      'Entretien préventif annuel du groupe électrogène.',
      'Réfection du dallage et des enduits.',
    ]),
    prestataireId: statut === 'DEMANDEE' ? null : pick(prestataires).id,
  }
})

/* --------------------------------------------------------------------- Missions */

export const missions: MissionControle[] = Array.from({ length: 88 }, (_, i) => {
  const projet = projets[(i * 5) % projets.length]
  const statut = pick(['PLANIFIEE', 'EN_COURS', 'RAPPORT_DEPOSE', 'CLOTUREE'] as const)
  return {
    id: `mis-${i + 1}`,
    reference: `MIS-2026-${String(i + 1).padStart(3, '0')}`,
    projetId: projet.id,
    controleurId: projet.controleurId ?? pick(controleurs).id,
    statut,
    dateVisite: dateBetween(2025, 2026),
    conformite: int(45, 100),
    observations: pick([
      'Ferraillage conforme au plan d’exécution.',
      'Écart sur la qualité du remblai, réserve émise.',
      'Cadence des travaux insuffisante au regard du planning.',
      'Ouvrage conforme, réception provisoire recommandée.',
      'Absence de plan de sécurité sur le chantier.',
    ]),
    reservesLevees: statut === 'CLOTUREE',
    documentIds: [],
  }
})

/* --------------------------------------------------------------------- Finances */

const sources = ['BUDGET_REGIONAL', 'ETAT', 'FONDS_DEV_LOCAL', 'PARTENAIRE', 'EMPRUNT'] as const

export const lignes: LigneBudgetaire[] = Array.from({ length: 36 }, (_, i) => {
  const programme = programmes[i % programmes.length]
  const dotation = round(int(60, 900) * 1_000_000, 1_000_000)
  const engage = round(dotation * (0.2 + rand() * 0.75), 100_000)
  return {
    id: `lig-${i + 1}`,
    code: `${int(6, 9)}${int(10, 99)}-${String(i + 1).padStart(3, '0')}`,
    libelle: `${pick(['Travaux', 'Études', 'Équipements', 'Subventions', 'Entretien'])} — ${programme.intitule}`,
    exercice: 2024 + (i % 3),
    source: sources[i % sources.length],
    dotation,
    engage,
    paye: round(engage * (0.25 + rand() * 0.7), 100_000),
    programmeId: programme.id,
  }
})

export const engagements: Engagement[] = Array.from({ length: 210 }, (_, i) => {
  const ligne = lignes[i % lignes.length]
  const projet = projets[(i * 7) % projets.length]
  const statut = pick(['PROPOSE', 'VISE', 'ENGAGE', 'LIQUIDE', 'PAYE', 'PAYE', 'REJETE'] as const)
  return {
    id: `eng-${i + 1}`,
    reference: `ENG-${ligne.exercice}-${String(i + 1).padStart(4, '0')}`,
    ligneId: ligne.id,
    projetId: projet.id,
    prestataireId: projet.prestataireId,
    objet: `${pick(['Décompte', 'Avance de démarrage', 'Solde', 'Prestation intellectuelle', 'Fournitures'])} — ${projet.code}`,
    montant: round(int(2, 180) * 1_000_000, 100_000),
    statut,
    dateCreation: dateBetween(2024, 2026),
    datePaiement: statut === 'PAYE' ? dateBetween(2025, 2026) : null,
  }
})

/* ------------------------------------------------------------------ Équipements */

export const equipements: Equipement[] = Array.from({ length: 64 }, (_, i) => {
  const statut = pick(['DISPONIBLE', 'AFFECTE', 'AFFECTE', 'EN_PANNE', 'REFORME'] as const)
  const categorie = pick([
    'Véhicule de liaison',
    'Engin de travaux publics',
    'Matériel informatique',
    'Groupe électrogène',
    'Mobilier',
    'Matériel topographique',
  ])
  return {
    id: `equ-${i + 1}`,
    code: `EQP-${String(i + 1).padStart(4, '0')}`,
    designation: `${categorie} ${pick(['Toyota', 'Mitsubishi', 'Caterpillar', 'HP', 'Dell', 'Perkins', 'Leica'])} ${int(100, 990)}`,
    categorie,
    statut,
    affectation: statut === 'AFFECTE' ? pick(responsables) : null,
    territoireId: pick(territoiresOperationnels).id,
    acquisLe: dateBetween(2017, 2026),
    valeurAcquisition: round(int(400, 85000) * 1000, 50_000),
    immatriculation: categorie.includes('Véhicule') || categorie.includes('Engin') ? `${int(1000, 9999)} ${pick(['AB', 'CD', 'EF'])} 01` : null,
  }
})

/* -------------------------------------------------------------------- Documents */

const typesDoc = [
  'DELIBERATION',
  'MARCHE',
  'RAPPORT_MISSION',
  'PV_RECEPTION',
  'FACTURE',
  'ETUDE',
  'ARRETE',
  'PLAN',
] as const

export const documents: GedDocument[] = Array.from({ length: 186 }, (_, i) => {
  const type = typesDoc[i % typesDoc.length]
  const projet = projets[(i * 11) % projets.length]
  const mission = missions[i % missions.length]
  const engagement = engagements[i % engagements.length]
  const lie = type === 'RAPPORT_MISSION' ? 'mission' : type === 'FACTURE' ? 'engagement' : 'projet'
  return {
    id: `doc-${i + 1}`,
    reference: `GED-${String(i + 1).padStart(5, '0')}`,
    titre: {
      DELIBERATION: `Délibération portant approbation de ${projet.code}`,
      MARCHE: `Contrat de marché ${projet.code}`,
      RAPPORT_MISSION: `Rapport de mission ${mission.reference}`,
      PV_RECEPTION: `Procès-verbal de réception ${projet.code}`,
      FACTURE: `Facture ${engagement.reference}`,
      ETUDE: `Étude technique détaillée — ${projet.code}`,
      ARRETE: `Arrêté d’affectation n°${i + 1}`,
      PLAN: `Plan d’exécution — ${projet.code}`,
    }[type],
    type,
    version: int(1, 3),
    taillekB: int(120, 8600),
    deposeLe: stamp(2024, 2026),
    deposePar: pick(responsables),
    projetId: lie === 'projet' ? projet.id : null,
    programmeId: lie === 'projet' ? projet.programmeId : null,
    engagementId: lie === 'engagement' ? engagement.id : null,
    missionId: lie === 'mission' ? mission.id : null,
    confidentiel: i % 17 === 0,
    tags: [projet.secteur.toLowerCase(), type.toLowerCase()],
  }
})

missions.forEach((m) => {
  m.documentIds = documents.filter((d) => d.missionId === m.id).map((d) => d.id)
})

/* -------------------------------------------------------------------- Workflows */

const workflowsModeles: Record<string, string[]> = {
  VALIDATION_PROJET: [
    'Instruction technique (Direction Planification)',
    'Avis financier (DAF)',
    'Avis de la commission sectorielle',
    'Approbation du Président du Conseil Régional',
  ],
  PASSATION_MARCHE: [
    'Constitution du dossier d’appel d’offres',
    'Publication et réception des offres',
    'Analyse et attribution',
    'Approbation et notification',
  ],
  ENGAGEMENT_DEPENSE: [
    'Proposition d’engagement',
    'Visa du contrôleur financier',
    'Liquidation',
    'Ordonnancement et paiement',
  ],
  RECEPTION_OUVRAGE: [
    'Convocation de la commission de réception',
    'Visite contradictoire',
    'Levée des réserves',
    'Réception définitive',
  ],
  DEMANDE_MAINTENANCE: [
    'Signalement terrain',
    'Diagnostic technique',
    'Validation budgétaire',
    'Exécution et clôture',
  ],
}

export const workflows: WorkflowInstance[] = Array.from({ length: 72 }, (_, i) => {
  const type = (Object.keys(workflowsModeles) as (keyof typeof workflowsModeles)[])[
    i % Object.keys(workflowsModeles).length
  ] as WorkflowInstance['type']
  const projet = projets[(i * 13) % projets.length]
  const libelles = workflowsModeles[type]
  const etapeCourante = int(0, libelles.length)
  const rejete = i % 19 === 0
  return {
    id: `wfl-${i + 1}`,
    reference: `WF-2026-${String(i + 1).padStart(4, '0')}`,
    type,
    objet: `${type.replaceAll('_', ' ').toLowerCase()} — ${projet.code}`,
    projetId: projet.id,
    statut: rejete ? 'REJETE' : etapeCourante >= libelles.length ? 'VALIDE' : 'EN_COURS',
    ouvertLe: stamp(2025, 2026),
    clotureLe: etapeCourante >= libelles.length || rejete ? stamp(2026, 2026) : null,
    etapes: libelles.map((libelle, k) => ({
      id: `wfe-${i + 1}-${k + 1}`,
      ordre: k + 1,
      libelle,
      responsable: pick(responsables),
      statut:
        rejete && k === etapeCourante
          ? 'REJETE'
          : k < etapeCourante
            ? 'VALIDE'
            : k === etapeCourante
              ? 'EN_COURS'
              : 'A_FAIRE',
      traiteLe: k < etapeCourante ? stamp(2025, 2026) : null,
      commentaire: rejete && k === etapeCourante ? 'Pièces justificatives incomplètes.' : null,
    })),
  }
})

/* ------------------------------------------------------------------ Indicateurs */

const periodes = ['2024-T1', '2024-T2', '2024-T3', '2024-T4', '2025-T1', '2025-T2', '2025-T3', '2025-T4', '2026-T1', '2026-T2']

export const indicateurs: Indicateur[] = [
  ['IND-001', 'Taux d’accès à l’eau potable', '%', 'EAU', 85],
  ['IND-002', 'Ratio élèves / salle de classe', 'élèves', 'EDUCATION', 45],
  ['IND-003', 'Taux de couverture sanitaire', '%', 'SANTE', 78],
  ['IND-004', 'Pistes rurales praticables en saison des pluies', 'km', 'ROUTES', 640],
  ['IND-005', 'Superficies aménagées', 'ha', 'AGRICULTURE', 1200],
  ['IND-006', 'Localités électrifiées', 'localités', 'ENERGIE', 220],
  ['IND-007', 'Jeunes insérés via les dispositifs régionaux', 'personnes', 'JEUNESSE', 3500],
  ['IND-008', 'Ménages desservis en assainissement', 'ménages', 'ASSAINISSEMENT', 14000],
  ['IND-009', 'Taux d’exécution physique du PAI', '%', 'EAU', 90],
  ['IND-010', 'Taux d’exécution financière du PAI', '%', 'EAU', 88],
  ['IND-011', 'Délai moyen de passation des marchés', 'jours', 'ROUTES', 90],
  ['IND-012', 'Ouvrages en bon état', '%', 'EAU', 80],
].map(([code, libelle, unite, secteur, cible], i) => {
  const valeur = Math.round(Number(cible) * (0.45 + rand() * 0.5))
  return {
    id: `ind-${i + 1}`,
    code: String(code),
    libelle: String(libelle),
    unite: String(unite),
    secteur: secteur as Secteur,
    cible: Number(cible),
    valeur,
    tendance: pick(['HAUSSE', 'HAUSSE', 'STABLE', 'BAISSE'] as const),
    territoireId: null,
    programmeId: programmes[i % programmes.length].id,
    serie: periodes.map((periode, k) => ({
      periode,
      valeur: Math.round(valeur * (0.6 + (k / periodes.length) * 0.5 + (rand() - 0.5) * 0.08)),
    })),
    source: pick(['Suivi-évaluation CRB', 'Enquête régionale', 'Direction sectorielle', 'Rapports de mission']),
  }
})

export const impacts: ImpactMesure[] = Array.from({ length: 22 }, (_, i) => {
  const territoire = territoiresOperationnels[i % territoiresOperationnels.length]
  const avant = int(20, 60)
  return {
    id: `imp-${i + 1}`,
    libelle: pick([
      'Réduction de la distance moyenne au point d’eau',
      'Progression du taux de scolarisation des filles',
      'Baisse du délai d’accès à un centre de santé',
      'Hausse des rendements rizicoles',
      'Augmentation des localités éclairées',
    ]),
    secteur: secteurs[i % secteurs.length],
    territoireId: territoire.id,
    beneficiaires: int(800, 32000),
    avantIntervention: avant,
    apresIntervention: avant + int(5, 38),
    unite: pick(['%', 'minutes', 't/ha', 'localités']),
    mesureLe: dateBetween(2025, 2026),
  }
})

/* --------------------------------------------------------------------- Décision */

export const alertes: Alerte[] = [
  ...projets
    .filter((p) => p.risque === 'ELEVE')
    .slice(0, 9)
    .map((p, i) => ({
      id: `alr-p-${i + 1}`,
      niveau: 'CRITIQUE' as const,
      titre: `Retard critique sur ${p.code}`,
      detail: `${p.intitule} — avancement physique ${p.avancementPhysique} % pour une échéance au ${p.dateFinPrevue}.`,
      moduleCible: 'projets',
      lienId: p.id,
      detecteLe: stamp(2026, 2026),
    })),
  ...lignes
    .filter((l) => l.engage / l.dotation > 0.9)
    .slice(0, 6)
    .map((l, i) => ({
      id: `alr-l-${i + 1}`,
      niveau: 'VIGILANCE' as const,
      titre: `Ligne budgétaire ${l.code} presque saturée`,
      detail: `${Math.round((l.engage / l.dotation) * 100)} % de la dotation ${l.exercice} est engagée.`,
      moduleCible: 'finances',
      lienId: l.id,
      detecteLe: stamp(2026, 2026),
    })),
  ...infrastructures
    .filter((inf) => inf.etat === 'HORS_SERVICE')
    .slice(0, 6)
    .map((inf, i) => ({
      id: `alr-i-${i + 1}`,
      niveau: 'CRITIQUE' as const,
      titre: `Ouvrage hors service : ${inf.code}`,
      detail: `${inf.designation} nécessite une intervention corrective.`,
      moduleCible: 'infrastructures',
      lienId: inf.id,
      detecteLe: stamp(2026, 2026),
    })),
  {
    id: 'alr-w-1',
    niveau: 'INFO',
    titre: 'Workflows en attente de visa financier',
    detail: `${workflows.filter((w) => w.statut === 'EN_COURS').length} circuits sont en cours d’instruction.`,
    moduleCible: 'workflows',
    lienId: null,
    detecteLe: stamp(2026, 2026),
  },
]

export const arbitrages: Arbitrage[] = Array.from({ length: 8 }, (_, i) => ({
  id: `arb-${i + 1}`,
  intitule: pick([
    'Priorisation des forages en zone de Tengréla',
    'Choix du mode de réalisation des pistes cotonnières',
    'Redéploiement des crédits non consommés',
    'Arbitrage sur l’extension du réseau AEP de Kouto',
  ]),
  contexte:
    'Les crédits disponibles ne permettent pas de couvrir l’ensemble des demandes exprimées par les sous-préfectures.',
  options: [
    { libelle: 'Concentrer sur 3 sous-préfectures', cout: round(int(300, 900) * 1_000_000, 1_000_000), impact: int(55, 90), delaiMois: int(8, 18) },
    { libelle: 'Répartition uniforme régionale', cout: round(int(400, 1100) * 1_000_000, 1_000_000), impact: int(35, 70), delaiMois: int(12, 26) },
    { libelle: 'Report partiel à l’exercice suivant', cout: round(int(150, 500) * 1_000_000, 1_000_000), impact: int(15, 45), delaiMois: int(18, 30) },
  ],
  statut: i % 3 === 0 ? 'ARBITRE' : 'A_ARBITRER',
  optionRetenue: i % 3 === 0 ? 'Concentrer sur 3 sous-préfectures' : null,
  decideLe: i % 3 === 0 ? dateBetween(2026, 2026) : null,
}))

/* --------------------------------------------------------------------- Rapports */

export const rapports: RapportModele[] = [
  { id: 'rap-1', intitule: 'Rapport d’exécution du PAI', perimetre: 'Programmes & projets', periodicite: 'TRIMESTRIEL', dernierGenereLe: '2026-07-08', formats: ['PDF', 'XLSX'] },
  { id: 'rap-2', intitule: 'État d’avancement des chantiers', perimetre: 'Projets en travaux', periodicite: 'MENSUEL', dernierGenereLe: '2026-08-05', formats: ['PDF'] },
  { id: 'rap-3', intitule: 'Situation budgétaire consolidée', perimetre: 'Finances', periodicite: 'MENSUEL', dernierGenereLe: '2026-08-02', formats: ['PDF', 'XLSX', 'CSV'] },
  { id: 'rap-4', intitule: 'Patrimoine et état des ouvrages', perimetre: 'Infrastructures', periodicite: 'ANNUEL', dernierGenereLe: '2026-01-20', formats: ['PDF', 'XLSX'] },
  { id: 'rap-5', intitule: 'Performance des prestataires', perimetre: 'Prestataires & marchés', periodicite: 'TRIMESTRIEL', dernierGenereLe: null, formats: ['PDF', 'CSV'] },
  { id: 'rap-6', intitule: 'Tableau de bord des indicateurs régionaux', perimetre: 'Indicateurs & impact', periodicite: 'TRIMESTRIEL', dernierGenereLe: '2026-07-11', formats: ['PDF', 'XLSX'] },
  { id: 'rap-7', intitule: 'Rapport de contrôle et de conformité', perimetre: 'Missions de contrôle', periodicite: 'A_LA_DEMANDE', dernierGenereLe: '2026-06-30', formats: ['PDF'] },
]

/* ----------------------------------------------------------------------- Audit */

const actions = [
  'CONNEXION',
  'CREATION_PROJET',
  'MODIFICATION_PROJET',
  'VALIDATION_WORKFLOW',
  'REJET_WORKFLOW',
  'DEPOT_DOCUMENT',
  'SUPPRESSION_DOCUMENT',
  'ENGAGEMENT_DEPENSE',
  'EXPORT_RAPPORT',
  'MODIFICATION_UTILISATEUR',
]

export const utilisateurs: Utilisateur[] = Array.from({ length: 28 }, (_, i) => ({
  id: `usr-${i + 1}`,
  nom: `${pick(['Coulibaly', 'Ouattara', 'Silué', 'Soro', 'Koné', 'Yéo', 'Doumbia', 'Bamba'])} ${pick(['Adama', 'Awa', 'Sékou', 'Mariam', 'Yacouba', 'Nadège', 'Ibrahim'])}`,
  email: `agent${i + 1}@sicrb-demo.ci`,
  role: pick([
    'ADMIN',
    'PRESIDENT',
    'DIRECTEUR',
    'CHEF_SERVICE',
    'CONTROLEUR',
    'AGENT',
    'AGENT',
    'PRESTATAIRE',
  ] as const),
  direction: pick(responsables),
  actif: i % 9 !== 0,
  dernierAcces: i % 9 !== 0 ? stamp(2026, 2026) : null,
}))

export const audits: AuditEntree[] = Array.from({ length: 240 }, (_, i) => {
  const user = utilisateurs[i % utilisateurs.length]
  return {
    id: `aud-${i + 1}`,
    horodatage: stamp(2026, 2026),
    acteur: user.nom,
    action: actions[i % actions.length],
    module: pick(['projets', 'finances', 'documents', 'workflows', 'administration', 'infrastructures']),
    cible: pick([...projets.slice(0, 20).map((p) => p.code), ...documents.slice(0, 20).map((d) => d.reference)]),
    adresseIp: `10.${int(0, 40)}.${int(0, 255)}.${int(2, 254)}`,
    resultat: i % 23 === 0 ? 'ECHEC' : 'SUCCES',
  }
})

/* --------------------------------------------------------------------- Portails */

export const requetes: RequeteCitoyenne[] = Array.from({ length: 64 }, (_, i) => {
  const territoire = territoiresOperationnels[i % territoiresOperationnels.length]
  const statut = pick(['RECUE', 'EN_INSTRUCTION', 'TRAITEE', 'TRAITEE', 'REJETEE'] as const)
  return {
    id: `req-${i + 1}`,
    reference: `REQ-2026-${String(i + 1).padStart(4, '0')}`,
    objet: pick([
      'Pompe du village en panne depuis deux semaines',
      'Demande de réhabilitation d’une salle de classe',
      'Piste impraticable en saison des pluies',
      'Demande d’éclairage public au marché',
      'Signalement d’un caniveau bouché',
    ]),
    territoireId: territoire.id,
    categorie: pick(['Eau', 'Éducation', 'Routes', 'Énergie', 'Assainissement']),
    statut,
    deposeeLe: stamp(2025, 2026),
    traiteeLe: statut === 'TRAITEE' ? stamp(2026, 2026) : null,
    canal: pick(['PORTAIL', 'GUICHET', 'TELEPHONE'] as const),
  }
})

export const demarches: DemarcheEntreprise[] = Array.from({ length: 38 }, (_, i) => {
  const statut = pick(['BROUILLON', 'DEPOSEE', 'INSTRUITE', 'VALIDEE', 'REJETEE'] as const)
  const requises = int(4, 8)
  return {
    id: `dem-${i + 1}`,
    reference: `DEM-2026-${String(i + 1).padStart(4, '0')}`,
    entreprise: pick(prestataires).raisonSociale,
    objet: pick([
      'Demande d’agrément régional',
      'Candidature à un appel d’offres',
      'Renouvellement d’attestation',
      'Demande d’autorisation d’occupation du domaine',
    ]),
    statut,
    deposeeLe: stamp(2025, 2026),
    echeance: statut === 'DEPOSEE' || statut === 'INSTRUITE' ? dateBetween(2026, 2026) : null,
    piecesRequises: requises,
    piecesFournies: statut === 'BROUILLON' ? int(0, requises - 1) : requises,
  }
})
