import { useMemo } from 'react'
import { SigMap, type MapPoint } from '../components/map/SigMap'
import { Card, ErrorState, LoadingState, PageHeader, Select, StatCard } from '../components/ui'
import { useInfrastructures, useProjetsGeo, useRequetes, useTerritoires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import { formatFcfaCourt, formatNombre, humaniser } from '../utils/format'
import { SECTEURS, PROJET_STATUTS } from '../constants/referentiels'

/**
 * SIG : la carte est alimentée par les mêmes services que les modules
 * opérationnels (projets, patrimoine, requêtes citoyennes).
 */
export default function MapPage() {
  const { filtres, setFiltre, reset, query } = useTableQuery()
  const projets = useProjetsGeo(query)
  const infrastructures = useInfrastructures({ size: 200 })
  const requetes = useRequetes({ size: 200 })
  const territoires = useTerritoires({ size: 100 })

  const points = useMemo<MapPoint[]>(() => {
    const out: MapPoint[] = []
    ;(projets.data ?? []).forEach((p) =>
      out.push({
        id: `p-${p.id}`,
        latitude: p.latitude,
        longitude: p.longitude,
        libelle: `${p.code} — ${p.intitule}`,
        sousTitre: `${humaniser(p.secteur)} · ${humaniser(p.statut)} · ${p.avancementPhysique} % réalisé`,
        montant: p.budgetPrevu,
        couche: 'PROJETS',
        tone: p.risque === 'ELEVE' ? 'critique' : p.risque === 'MOYEN' ? 'alerte' : 'ok',
        href: `/projets/${p.id}`,
      }),
    )
    ;(infrastructures.data?.items ?? []).forEach((i) =>
      out.push({
        id: `i-${i.id}`,
        latitude: i.latitude,
        longitude: i.longitude,
        libelle: i.designation,
        sousTitre: `${i.type} · état ${humaniser(i.etat)}`,
        montant: i.valeurPatrimoniale,
        couche: 'INFRASTRUCTURES',
        tone: i.etat === 'HORS_SERVICE' ? 'critique' : i.etat === 'DEGRADE' ? 'alerte' : 'ok',
      }),
    )
    const parTerritoire = new Map((territoires.data?.items ?? []).map((t) => [t.id, t]))
    ;(requetes.data?.items ?? []).forEach((r) => {
      const t = parTerritoire.get(r.territoireId)
      if (!t) return
      out.push({
        id: `r-${r.id}`,
        latitude: t.latitude + (Number(r.id.replace(/\D/g, '')) % 7) * 0.01,
        longitude: t.longitude - (Number(r.id.replace(/\D/g, '')) % 5) * 0.01,
        libelle: r.objet,
        sousTitre: `${r.reference} · ${humaniser(r.statut)} · ${t.nom}`,
        couche: 'REQUETES',
        tone: r.statut === 'TRAITEE' ? 'ok' : 'alerte',
      })
    })
    return out
  }, [infrastructures.data, projets.data, requetes.data, territoires.data])

  if (projets.error) return <ErrorState error={projets.error} onRetry={() => projets.refetch()} />

  const investissement = (projets.data ?? []).reduce((s, p) => s + p.budgetPrevu, 0)

  return (
    <>
      <PageHeader
        title="SIG — Système d'information géographique"
        subtitle="Lecture spatiale de la chaîne planification → exécution → contrôle : projets, patrimoine et sollicitations citoyennes sur un même fond de carte."
        crumbs={[{ label: 'Territoire' }, { label: 'SIG cartographique' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Projets géolocalisés" value={formatNombre((projets.data ?? []).length)} />
        <StatCard label="Investissement cartographié" value={formatFcfaCourt(investissement)} />
        <StatCard label="Infrastructures" value={formatNombre(infrastructures.data?.total ?? 0)} />
        <StatCard label="Requêtes localisées" value={formatNombre(requetes.data?.total ?? 0)} />
      </div>

      <Card
        className="mt-4"
        title="Couches cartographiques"
        description="Filtres appliqués côté service : projets, infrastructures et requêtes restent synchronisés avec les modules."
        bodyClassName="p-0"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              aria-label="Secteur"
              className="h-9 w-40 text-xs"
              value={filtres.secteur ?? ''}
              placeholder="Tous les secteurs"
              onChange={(e) => setFiltre('secteur', e.target.value)}
              options={SECTEURS.map((s) => ({ value: s, label: humaniser(s) }))}
            />
            <Select
              aria-label="Statut"
              className="h-9 w-40 text-xs"
              value={filtres.statut ?? ''}
              placeholder="Tous les statuts"
              onChange={(e) => setFiltre('statut', e.target.value)}
              options={PROJET_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
            />
            <Select
              aria-label="Zone"
              className="h-9 w-44 text-xs"
              value={filtres.territoireId ?? ''}
              placeholder="Toute la région"
              onChange={(e) => setFiltre('territoireId', e.target.value)}
              options={(territoires.data?.items ?? []).filter((t) => t.type !== 'REGION').map((t) => ({ value: t.id, label: t.nom }))}
            />
            <button onClick={reset} className="text-xs font-medium text-brand-700 underline">
              Réinitialiser
            </button>
          </div>
        }
      >
        {projets.isLoading && !projets.data ? (
          <div className="p-4">
            <LoadingState label="Chargement des couches…" rows={3} />
          </div>
        ) : (
          <SigMap points={points} height={560} />
        )}
      </Card>
    </>
  )
}
