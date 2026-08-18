/**
 * Couche HOOK : seul point d'entrée des pages/features vers les données.
 * PAGE → FEATURE → HOOK → SERVICE → ADAPTER → (MOCK | QUARKUS REST API)
 */
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { sicrbService } from '../services'
import type { Id, Maintenance, PageQuery } from '../types/domain'

const clean = (query?: PageQuery) => query ?? {}

/* ------------------------------------------------------------------ Lectures */

export const useDashboard = () => useQuery({ queryKey: ['dashboard'], queryFn: () => sicrbService.dashboard() })

export const useTerritoires = (query?: PageQuery) =>
  useQuery({ queryKey: ['territoires', clean(query)], queryFn: () => sicrbService.territoires(query) })

export const useTerritoire = (id?: Id) =>
  useQuery({ queryKey: ['territoire', id], queryFn: () => sicrbService.territoire(id as Id), enabled: Boolean(id) })

export const useSessions = (query?: PageQuery) =>
  useQuery({ queryKey: ['sessions', clean(query)], queryFn: () => sicrbService.sessions(query) })

export const usePais = () => useQuery({ queryKey: ['pais'], queryFn: () => sicrbService.pais() })

export const useProgrammes = (query?: PageQuery) =>
  useQuery({ queryKey: ['programmes', clean(query)], queryFn: () => sicrbService.programmes(query) })

export const useProgramme = (id?: Id) =>
  useQuery({ queryKey: ['programme', id], queryFn: () => sicrbService.programme(id as Id), enabled: Boolean(id) })

export const useProjets = (query?: PageQuery, options?: Partial<UseQueryOptions<Awaited<ReturnType<typeof sicrbService.projets>>>>) =>
  useQuery({ queryKey: ['projets', clean(query)], queryFn: () => sicrbService.projets(query), ...options })

export const useProjet = (id?: Id) =>
  useQuery({ queryKey: ['projet', id], queryFn: () => sicrbService.projet(id as Id), enabled: Boolean(id) })

export const useProjetsGeo = (query?: PageQuery) =>
  useQuery({ queryKey: ['projets-geo', clean(query)], queryFn: () => sicrbService.projetsGeo(query) })

export const useInfrastructures = (query?: PageQuery) =>
  useQuery({ queryKey: ['infrastructures', clean(query)], queryFn: () => sicrbService.infrastructures(query) })

export const useMaintenances = (query?: PageQuery) =>
  useQuery({ queryKey: ['maintenances', clean(query)], queryFn: () => sicrbService.maintenances(query) })

export const useControleurs = () => useQuery({ queryKey: ['controleurs'], queryFn: () => sicrbService.controleurs() })

export const useMissions = (query?: PageQuery) =>
  useQuery({ queryKey: ['missions', clean(query)], queryFn: () => sicrbService.missions(query) })

export const useLignes = (query?: PageQuery) =>
  useQuery({ queryKey: ['lignes', clean(query)], queryFn: () => sicrbService.lignes(query) })

export const useEngagements = (query?: PageQuery) =>
  useQuery({ queryKey: ['engagements', clean(query)], queryFn: () => sicrbService.engagements(query) })

export const usePrestataires = (query?: PageQuery) =>
  useQuery({ queryKey: ['prestataires', clean(query)], queryFn: () => sicrbService.prestataires(query) })

export const usePrestataire = (id?: Id) =>
  useQuery({ queryKey: ['prestataire', id], queryFn: () => sicrbService.prestataire(id as Id), enabled: Boolean(id) })

export const useEquipements = (query?: PageQuery) =>
  useQuery({ queryKey: ['equipements', clean(query)], queryFn: () => sicrbService.equipements(query) })

export const useDocuments = (query?: PageQuery) =>
  useQuery({ queryKey: ['documents', clean(query)], queryFn: () => sicrbService.documents(query) })

export const useWorkflows = (query?: PageQuery) =>
  useQuery({ queryKey: ['workflows', clean(query)], queryFn: () => sicrbService.workflows(query) })

export const useWorkflow = (id?: Id) =>
  useQuery({ queryKey: ['workflow', id], queryFn: () => sicrbService.workflow(id as Id), enabled: Boolean(id) })

export const useIndicateurs = (query?: PageQuery) =>
  useQuery({ queryKey: ['indicateurs', clean(query)], queryFn: () => sicrbService.indicateurs(query) })

export const useImpacts = (query?: PageQuery) =>
  useQuery({ queryKey: ['impacts', clean(query)], queryFn: () => sicrbService.impacts(query) })

export const useAlertes = () => useQuery({ queryKey: ['alertes'], queryFn: () => sicrbService.alertes() })

export const useArbitrages = () => useQuery({ queryKey: ['arbitrages'], queryFn: () => sicrbService.arbitrages() })

export const useRapports = () => useQuery({ queryKey: ['rapports'], queryFn: () => sicrbService.rapports() })

export const useAudits = (query?: PageQuery) =>
  useQuery({ queryKey: ['audits', clean(query)], queryFn: () => sicrbService.audits(query) })

export const useUtilisateurs = (query?: PageQuery) =>
  useQuery({ queryKey: ['utilisateurs', clean(query)], queryFn: () => sicrbService.utilisateurs(query) })

export const useRequetes = (query?: PageQuery) =>
  useQuery({ queryKey: ['requetes', clean(query)], queryFn: () => sicrbService.requetes(query) })

export const useDemarches = (query?: PageQuery) =>
  useQuery({ queryKey: ['demarches', clean(query)], queryFn: () => sicrbService.demarches(query) })

export const useRecherche = (q: string) =>
  useQuery({ queryKey: ['recherche', q], queryFn: () => sicrbService.recherche(q), enabled: q.trim().length >= 2 })

/* ------------------------------------------------------------------ Écritures */

export function useTraiterEtape() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { workflowId: Id; etapeId: Id; decision: 'VALIDE' | 'REJETE'; commentaire?: string }) =>
      sicrbService.traiterEtape(input),
    onSuccess: (wf) => {
      qc.setQueryData(['workflow', wf.id], wf)
      void qc.invalidateQueries({ queryKey: ['workflows'] })
      void qc.invalidateQueries({ queryKey: ['projet'] })
    },
  })
}

export function useDemanderMaintenance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { infrastructureId: Id; type: Maintenance['type']; description: string }) =>
      sicrbService.demanderMaintenance(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['maintenances'] })
      void qc.invalidateQueries({ queryKey: ['workflows'] })
    },
  })
}

export function useDeposerRequete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { objet: string; territoireId: Id; categorie: string }) => sicrbService.deposerRequete(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['requetes'] }),
  })
}

export function useArbitrer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: Id; option: string }) => sicrbService.arbitrer(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['arbitrages'] }),
  })
}

export function useBasculerUtilisateur() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => sicrbService.basculerUtilisateur(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['utilisateurs'] })
      void qc.invalidateQueries({ queryKey: ['audits'] })
    },
  })
}
