/**
 * Implémentation HTTP du contrat `SicrbApi`, prête pour le backend Quarkus.
 *
 * ATTENTION : à ce jour, `sicrb-backend` n'expose que `/hello`, un health check
 * et une ressource Panache d'exemple. Aucun de ces endpoints n'existe encore ;
 * cette classe documente le contrat attendu et devient utilisable dès que les
 * ressources Quarkus correspondantes sont implémentées.
 *
 * Activation : `VITE_API_MODE=http` (voir `.env.example`).
 */

import type { PageQuery } from '../../types/domain'
import type { SicrbApi } from '../contracts'

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function qs(query: PageQuery = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  })
  const s = params.toString()
  return s ? `?${s}` : ''
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    throw new ApiError(`Requête ${path} en échec (HTTP ${res.status})`, res.status, url)
  }
  return (await res.json()) as T
}

const post = <T,>(path: string, body: unknown) =>
  req<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const quarkusAdapter: SicrbApi = {
  dashboard: () => req('/dashboard/synthese'),

  territoires: (query) => req(`/territoires${qs(query)}`),
  territoire: (id) => req(`/territoires/${id}`),

  sessions: (query) => req(`/gouvernance/sessions${qs(query)}`),

  pais: () => req('/planification/pai'),

  programmes: (query) => req(`/programmes${qs(query)}`),
  programme: (id) => req(`/programmes/${id}`),

  projets: (query) => req(`/projets${qs(query)}`),
  projet: (id) => req(`/projets/${id}`),
  projetsGeo: (query) => req(`/projets/geo${qs(query)}`),

  infrastructures: (query) => req(`/infrastructures${qs(query)}`),
  maintenances: (query) => req(`/maintenances${qs(query)}`),
  demanderMaintenance: (input) => post('/maintenances', input),

  controleurs: () => req('/controleurs'),
  missions: (query) => req(`/controle/missions${qs(query)}`),

  lignes: (query) => req(`/finances/lignes${qs(query)}`),
  engagements: (query) => req(`/finances/engagements${qs(query)}`),

  prestataires: (query) => req(`/prestataires${qs(query)}`),
  prestataire: (id) => req(`/prestataires/${id}`),

  equipements: (query) => req(`/equipements${qs(query)}`),

  documents: (query) => req(`/ged/documents${qs(query)}`),

  workflows: (query) => req(`/workflows${qs(query)}`),
  workflow: (id) => req(`/workflows/${id}`),
  traiterEtape: ({ workflowId, etapeId, decision, commentaire }) =>
    post(`/workflows/${workflowId}/etapes/${etapeId}/decision`, { decision, commentaire }),

  indicateurs: (query) => req(`/indicateurs${qs(query)}`),
  impacts: (query) => req(`/impact/mesures${qs(query)}`),

  alertes: () => req('/decision/alertes'),
  arbitrages: () => req('/decision/arbitrages'),
  arbitrer: ({ id, option }) => post(`/decision/arbitrages/${id}/decision`, { option }),

  rapports: () => req('/rapports/modeles'),
  audits: (query) => req(`/audit${qs(query)}`),
  utilisateurs: (query) => req(`/administration/utilisateurs${qs(query)}`),
  basculerUtilisateur: (id) => post(`/administration/utilisateurs/${id}/bascule`, {}),

  requetes: (query) => req(`/portail/citoyen/requetes${qs(query)}`),
  deposerRequete: (input) => post('/portail/citoyen/requetes', input),
  demarches: (query) => req(`/portail/entrepreneur/demarches${qs(query)}`),

  recherche: (q) => req(`/recherche${qs({ q })}`),
}
