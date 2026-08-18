import * as db from '../../mocks/dataset'
import type {
  Alerte,
  Arbitrage,
  DashboardSynthese,
  Id,
  Maintenance,
  PageQuery,
  ProjetStatut,
  RequeteCitoyenne,
  Secteur,
  Utilisateur,
  WorkflowInstance,
} from '../../types/domain'
import type { SicrbApi } from '../contracts'
import { delay, eq, matchesText, paginate } from '../query'

/** Copies mutables : les actions (workflow, maintenance, requêtes) restent locales. */
const state = {
  workflows: db.workflows.map((w) => ({ ...w, etapes: w.etapes.map((e) => ({ ...e })) })),
  maintenances: [...db.maintenances],
  requetes: [...db.requetes],
  arbitrages: db.arbitrages.map((a) => ({ ...a })),
  utilisateurs: db.utilisateurs.map((u) => ({ ...u })),
}

const territoireNom = (id: Id | null) => db.territoires.find((t) => t.id === id)?.nom ?? '—'

export const mockAdapter: SicrbApi = {
  async dashboard(): Promise<DashboardSynthese> {
    await delay()
    const budgetPrevu = db.programmes.reduce((s, p) => s + p.budgetPrevu, 0)
    const budgetEngage = db.programmes.reduce((s, p) => s + p.budgetEngage, 0)
    const budgetPaye = db.programmes.reduce((s, p) => s + p.budgetPaye, 0)
    const parSecteur = Array.from(
      db.projets.reduce((m, p) => {
        const cur = m.get(p.secteur) ?? { secteur: p.secteur, budget: 0, projets: 0 }
        cur.budget += p.budgetPrevu
        cur.projets += 1
        m.set(p.secteur, cur)
        return m
      }, new Map<Secteur, { secteur: Secteur; budget: number; projets: number }>()).values(),
    )
    const parStatut = Array.from(
      db.projets.reduce((m, p) => {
        m.set(p.statut, (m.get(p.statut) ?? 0) + 1)
        return m
      }, new Map<ProjetStatut, number>()),
    ).map(([statut, projets]) => ({ statut, projets }))
    const periodes = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08']
    return {
      budgetPrevu,
      budgetEngage,
      budgetPaye,
      nbProgrammes: db.programmes.length,
      nbProjets: db.projets.length,
      nbProjetsEnTravaux: db.projets.filter((p) => p.statut === 'EN_TRAVAUX').length,
      nbProjetsEnRetard: db.projets.filter((p) => p.risque === 'ELEVE').length,
      nbInfrastructures: db.infrastructures.length,
      beneficiaires: db.projets.reduce((s, p) => s + p.beneficiaires, 0),
      tauxExecutionPhysique: Math.round(
        db.projets.reduce((s, p) => s + p.avancementPhysique, 0) / db.projets.length,
      ),
      tauxExecutionFinanciere: Math.round((budgetPaye / budgetPrevu) * 100),
      parSecteur,
      parStatut,
      executionMensuelle: periodes.map((periode, i) => ({
        periode,
        engage: Math.round((budgetEngage / periodes.length) * (0.7 + ((i % 5) + 1) / 10)),
        paye: Math.round((budgetPaye / periodes.length) * (0.6 + ((i % 4) + 1) / 10)),
      })),
      parTerritoire: db.territoiresOperationnels.map((t) => {
        const projets = db.projets.filter((p) => p.territoireId === t.id)
        return {
          territoireId: t.id,
          nom: t.nom,
          projets: projets.length,
          budget: projets.reduce((s, p) => s + p.budgetPrevu, 0),
        }
      }),
    }
  },

  async territoires(query: PageQuery = {}) {
    await delay()
    const rows = db.territoires.filter(
      (t) => eq(t.type, query.type as string) && eq(t.parentId ?? '', query.parentId as string) && matchesText(t, query.q),
    )
    return paginate(rows, { size: 20, ...query })
  },

  async territoire(id: Id) {
    await delay()
    const territoire = db.territoires.find((t) => t.id === id)
    if (!territoire) throw new Error(`Territoire ${id} introuvable`)
    const ids = [id, ...db.territoires.filter((t) => t.parentId === id).map((t) => t.id)]
    return {
      territoire,
      enfants: db.territoires.filter((t) => t.parentId === id),
      projets: db.projets.filter((p) => ids.includes(p.territoireId)),
      infrastructures: db.infrastructures.filter((i) => ids.includes(i.territoireId)),
      requetes: state.requetes.filter((r) => ids.includes(r.territoireId)),
    }
  },

  async sessions(query: PageQuery = {}) {
    await delay()
    const rows = db.sessions.filter((s) => eq(s.statut, query.statut as string) && eq(s.type, query.type as string) && matchesText(s, query.q))
    return paginate(rows, { size: 10, sort: 'date:desc', ...query })
  },

  async pais() {
    await delay()
    return db.pais
  },

  async programmes(query: PageQuery = {}) {
    await delay()
    const rows = db.programmes.filter(
      (p) =>
        eq(p.statut, query.statut as string) &&
        eq(p.secteur, query.secteur as string) &&
        eq(p.paiId, query.paiId as string) &&
        matchesText(p, query.q),
    )
    return paginate(rows, { size: 10, ...query })
  },

  async programme(id: Id) {
    await delay()
    const programme = db.programmes.find((p) => p.id === id)
    if (!programme) throw new Error(`Programme ${id} introuvable`)
    return {
      programme,
      pai: db.pais.find((p) => p.id === programme.paiId) ?? null,
      projets: db.projets.filter((p) => p.programmeId === id),
      indicateurs: db.indicateurs.filter((i) => i.programmeId === id),
      lignes: db.lignes.filter((l) => l.programmeId === id),
    }
  },

  async projets(query: PageQuery = {}) {
    await delay()
    return paginate(filtrerProjets(query), { size: 10, sort: 'code:asc', ...query })
  },

  async projetsGeo(query: PageQuery = {}) {
    await delay()
    return filtrerProjets(query)
  },

  async projet(id: Id) {
    await delay()
    const projet = db.projets.find((p) => p.id === id)
    if (!projet) throw new Error(`Projet ${id} introuvable`)
    return {
      projet,
      programme: db.programmes.find((p) => p.id === projet.programmeId) ?? null,
      territoire: db.territoires.find((t) => t.id === projet.territoireId) ?? null,
      prestataire: db.prestataires.find((p) => p.id === projet.prestataireId) ?? null,
      controleur: db.controleurs.find((c) => c.id === projet.controleurId) ?? null,
      jalons: db.jalons.filter((j) => j.projetId === id),
      engagements: db.engagements.filter((e) => e.projetId === id),
      documents: db.documents.filter((d) => d.projetId === id),
      missions: db.missions.filter((m) => m.projetId === id),
      infrastructures: db.infrastructures.filter((i) => i.projetId === id),
      workflows: state.workflows.filter((w) => w.projetId === id),
    }
  },

  async infrastructures(query: PageQuery = {}) {
    await delay()
    const rows = db.infrastructures.filter(
      (i) =>
        eq(i.etat, query.etat as string) &&
        eq(i.territoireId, query.territoireId as string) &&
        eq(i.type, query.type as string) &&
        matchesText(i, query.q),
    )
    return paginate(rows, { size: 10, ...query })
  },

  async maintenances(query: PageQuery = {}) {
    await delay()
    const rows = state.maintenances.filter(
      (m) => eq(m.statut, query.statut as string) && eq(m.type, query.type as string) && matchesText(m, query.q),
    )
    return paginate(rows, { size: 10, sort: 'signaleLe:desc', ...query })
  },

  async demanderMaintenance(input) {
    await delay(320)
    const created: Maintenance = {
      id: `mnt-${state.maintenances.length + 1}`,
      reference: `MNT-2026-${String(state.maintenances.length + 1).padStart(4, '0')}`,
      infrastructureId: input.infrastructureId,
      type: input.type,
      statut: 'DEMANDEE',
      signaleLe: new Date().toISOString(),
      planifieLe: null,
      clotureLe: null,
      cout: 0,
      description: input.description,
      prestataireId: null,
    }
    state.maintenances = [created, ...state.maintenances]
    return created
  },

  async controleurs() {
    await delay()
    return db.controleurs
  },

  async missions(query: PageQuery = {}) {
    await delay()
    const rows = db.missions.filter(
      (m) => eq(m.statut, query.statut as string) && eq(m.controleurId, query.controleurId as string) && matchesText(m, query.q),
    )
    return paginate(rows, { size: 10, sort: 'dateVisite:desc', ...query })
  },

  async lignes(query: PageQuery = {}) {
    await delay()
    const rows = db.lignes.filter(
      (l) => eq(l.exercice, query.exercice as number) && eq(l.source, query.source as string) && matchesText(l, query.q),
    )
    return paginate(rows, { size: 10, ...query })
  },

  async engagements(query: PageQuery = {}) {
    await delay()
    const rows = db.engagements.filter(
      (e) => eq(e.statut, query.statut as string) && eq(e.ligneId, query.ligneId as string) && matchesText(e, query.q),
    )
    return paginate(rows, { size: 10, sort: 'dateCreation:desc', ...query })
  },

  async prestataires(query: PageQuery = {}) {
    await delay()
    const rows = db.prestataires.filter(
      (p) => eq(p.statut, query.statut as string) && eq(p.categorie, query.categorie as string) && matchesText(p, query.q),
    )
    return paginate(rows, { size: 10, ...query })
  },

  async prestataire(id: Id) {
    await delay()
    const prestataire = db.prestataires.find((p) => p.id === id)
    if (!prestataire) throw new Error(`Prestataire ${id} introuvable`)
    return {
      prestataire,
      projets: db.projets.filter((p) => p.prestataireId === id),
      engagements: db.engagements.filter((e) => e.prestataireId === id),
    }
  },

  async equipements(query: PageQuery = {}) {
    await delay()
    const rows = db.equipements.filter(
      (e) => eq(e.statut, query.statut as string) && eq(e.categorie, query.categorie as string) && matchesText(e, query.q),
    )
    return paginate(rows, { size: 10, ...query })
  },

  async documents(query: PageQuery = {}) {
    await delay()
    const rows = db.documents.filter(
      (d) =>
        eq(d.type, query.type as string) &&
        eq(d.projetId ?? '', query.projetId as string) &&
        matchesText(d, query.q),
    )
    return paginate(rows, { size: 10, sort: 'deposeLe:desc', ...query })
  },

  async workflows(query: PageQuery = {}) {
    await delay()
    const rows = state.workflows.filter(
      (w) => eq(w.statut, query.statut as string) && eq(w.type, query.type as string) && matchesText(w, query.q),
    )
    return paginate(rows as unknown as Record<string, unknown>[], { size: 10, sort: 'ouvertLe:desc', ...query }) as unknown as {
      items: WorkflowInstance[]
      total: number
      page: number
      size: number
    }
  },

  async workflow(id: Id) {
    await delay()
    const wf = state.workflows.find((w) => w.id === id)
    if (!wf) throw new Error(`Workflow ${id} introuvable`)
    return wf
  },

  async traiterEtape({ workflowId, etapeId, decision, commentaire }) {
    await delay(300)
    const wf = state.workflows.find((w) => w.id === workflowId)
    if (!wf) throw new Error(`Workflow ${workflowId} introuvable`)
    if (wf.statut !== 'EN_COURS') return wf
    const etape = wf.etapes.find((e) => e.id === etapeId)
    if (!etape) throw new Error(`Étape ${etapeId} introuvable`)
    if (etape.statut === 'VALIDE' || etape.statut === 'REJETE') return wf // idempotent
    etape.statut = decision
    etape.traiteLe = new Date().toISOString()
    etape.commentaire = commentaire ?? null
    if (decision === 'REJETE') {
      wf.statut = 'REJETE'
      wf.clotureLe = new Date().toISOString()
    } else {
      const suivante = wf.etapes.find((e) => e.statut === 'A_FAIRE')
      if (suivante) suivante.statut = 'EN_COURS'
      else {
        wf.statut = 'VALIDE'
        wf.clotureLe = new Date().toISOString()
      }
    }
    return wf
  },

  async indicateurs(query: PageQuery = {}) {
    await delay()
    const rows = db.indicateurs.filter((i) => eq(i.secteur, query.secteur as string) && matchesText(i, query.q))
    return paginate(rows as unknown as Record<string, unknown>[], { size: 12, ...query }) as unknown as {
      items: typeof db.indicateurs
      total: number
      page: number
      size: number
    }
  },

  async impacts(query: PageQuery = {}) {
    await delay()
    const rows = db.impacts.filter((i) => eq(i.secteur, query.secteur as string) && matchesText(i, query.q))
    return paginate(rows, { size: 12, ...query })
  },

  async alertes(): Promise<Alerte[]> {
    await delay()
    return db.alertes
  },

  async arbitrages(): Promise<Arbitrage[]> {
    await delay()
    return state.arbitrages
  },

  async arbitrer({ id, option }) {
    await delay(280)
    const arb = state.arbitrages.find((a) => a.id === id)
    if (!arb) throw new Error(`Arbitrage ${id} introuvable`)
    if (arb.statut === 'ARBITRE') return arb // idempotent
    arb.statut = 'ARBITRE'
    arb.optionRetenue = option
    arb.decideLe = new Date().toISOString().slice(0, 10)
    return arb
  },

  async rapports() {
    await delay()
    return db.rapports
  },

  async audits(query: PageQuery = {}) {
    await delay()
    const rows = db.audits.filter(
      (a) => eq(a.module, query.module as string) && eq(a.resultat, query.resultat as string) && matchesText(a, query.q),
    )
    return paginate(rows, { size: 15, sort: 'horodatage:desc', ...query })
  },

  async utilisateurs(query: PageQuery = {}) {
    await delay()
    const rows = state.utilisateurs.filter((u) => eq(u.role, query.role as string) && matchesText(u, query.q))
    return paginate(rows, { size: 10, ...query })
  },

  async basculerUtilisateur(id: Id): Promise<Utilisateur> {
    await delay(220)
    const u = state.utilisateurs.find((x) => x.id === id)
    if (!u) throw new Error(`Utilisateur ${id} introuvable`)
    u.actif = !u.actif
    return u
  },

  async requetes(query: PageQuery = {}) {
    await delay()
    const rows = state.requetes.filter(
      (r) =>
        eq(r.statut, query.statut as string) &&
        eq(r.territoireId, query.territoireId as string) &&
        eq(r.categorie, query.categorie as string) &&
        matchesText(r, query.q),
    )
    return paginate(rows, { size: 10, sort: 'deposeeLe:desc', ...query })
  },

  async deposerRequete(input): Promise<RequeteCitoyenne> {
    await delay(320)
    const created: RequeteCitoyenne = {
      id: `req-${state.requetes.length + 1}`,
      reference: `REQ-2026-${String(state.requetes.length + 1).padStart(4, '0')}`,
      objet: input.objet,
      territoireId: input.territoireId,
      categorie: input.categorie,
      statut: 'RECUE',
      deposeeLe: new Date().toISOString(),
      traiteeLe: null,
      canal: 'PORTAIL',
    }
    state.requetes = [created, ...state.requetes]
    return created
  },

  async demarches(query: PageQuery = {}) {
    await delay()
    const rows = db.demarches.filter((d) => eq(d.statut, query.statut as string) && matchesText(d, query.q))
    return paginate(rows, { size: 10, sort: 'deposeeLe:desc', ...query })
  },

  async recherche(q: string) {
    await delay(120)
    if (!q.trim()) return []
    const out: { module: string; libelle: string; sousTitre: string; href: string }[] = []
    db.projets.filter((p) => matchesText(p, q)).slice(0, 5).forEach((p) =>
      out.push({ module: 'Projet', libelle: `${p.code} — ${p.intitule}`, sousTitre: territoireNom(p.territoireId), href: `/projets/${p.id}` }),
    )
    db.programmes.filter((p) => matchesText(p, q)).slice(0, 4).forEach((p) =>
      out.push({ module: 'Programme', libelle: `${p.code} — ${p.intitule}`, sousTitre: p.secteur, href: `/programmes/${p.id}` }),
    )
    db.prestataires.filter((p) => matchesText(p, q)).slice(0, 3).forEach((p) =>
      out.push({ module: 'Prestataire', libelle: p.raisonSociale, sousTitre: p.ville, href: `/prestataires/${p.id}` }),
    )
    db.documents.filter((d) => matchesText(d, q)).slice(0, 3).forEach((d) =>
      out.push({ module: 'Document', libelle: d.titre, sousTitre: d.reference, href: `/documents?q=${encodeURIComponent(d.reference)}` }),
    )
    db.territoires.filter((t) => matchesText(t, q)).slice(0, 3).forEach((t) =>
      out.push({ module: 'Territoire', libelle: t.nom, sousTitre: t.type, href: `/territoire/${t.id}` }),
    )
    return out
  },
}

function filtrerProjets(query: PageQuery) {
  return db.projets.filter(
    (p) =>
      eq(p.statut, query.statut as string) &&
      eq(p.secteur, query.secteur as string) &&
      eq(p.programmeId, query.programmeId as string) &&
      eq(p.territoireId, query.territoireId as string) &&
      eq(p.risque, query.risque as string) &&
      matchesText(p, query.q),
  )
}
