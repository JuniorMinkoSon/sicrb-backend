import { Link } from 'react-router-dom'
import { BarreChart } from '../components/charts/Charts'
import { SigMap } from '../components/map/SigMap'
import { Alert, Badge, Card, DataTable, FilterBar, LoadingState, PageHeader, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { SECTEURS } from '../constants/referentiels'
import { useDashboard, useProjets, useProjetsGeo } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Projet } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

/** Portail public : transparence sur l'investissement régional, sans donnée nominative. */
export default function PortailPublicPage() {
  const t = useTableQuery({ size: 10, sort: 'budgetPrevu:desc' })
  const projets = useProjets(t.query)
  const geo = useProjetsGeo({ size: 400 })
  const { data: synthese, isLoading } = useDashboard()

  const colonnes: Column<Projet>[] = [
    { key: 'intitule', header: 'Projet', sortable: true, render: (p) => <span className="font-medium text-ink-900">{p.intitule}</span> },
    { key: 'secteur', header: 'Secteur', sortable: true, render: (p) => humaniser(p.secteur) },
    { key: 'statut', header: 'Statut', sortable: true, render: (p) => <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge> },
    { key: 'budgetPrevu', header: 'Investissement', sortable: true, className: 'text-right tabular-nums', render: (p) => formatFcfaCourt(p.budgetPrevu) },
    { key: 'beneficiaires', header: 'Bénéficiaires', sortable: true, className: 'text-right tabular-nums', render: (p) => formatNombre(p.beneficiaires) },
    { key: 'dateFinPrevue', header: 'Livraison prévue', sortable: true, render: (p) => formatDate(p.dateFinPrevue) },
  ]

  if (isLoading || !synthese) return <LoadingState label="Chargement des données publiques…" />

  return (
    <>
      <PageHeader
        title="Portail public — investissement régional"
        subtitle="Information ouverte sur les projets financés par le Conseil Régional de la Bagoué."
        crumbs={[{ label: 'Portails' }, { label: 'Public' }]}
      />

      <Alert level="info" title="Données de démonstration">
        Les montants et localisations présentés ici proviennent d'un jeu de données de démonstration ; ils n'ont aucune valeur officielle.
      </Alert>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Projets financés" value={formatNombre(synthese.nbProjets)} />
        <StatCard label="Investissement programmé" value={formatFcfaCourt(synthese.budgetPrevu)} />
        <StatCard label="Investissement exécuté" value={formatFcfaCourt(synthese.budgetPaye)} hint={formatPourcent(synthese.tauxExecutionFinanciere)} />
        <StatCard label="Ouvrages livrés" value={formatNombre(synthese.nbInfrastructures)} />
        <StatCard label="Population bénéficiaire" value={formatNombre(synthese.beneficiaires)} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Investissement par secteur">
          <BarreChart money data={synthese.parSecteur} xKey="secteur" series={[{ key: 'budget', label: 'Investissement' }]} />
        </Card>
        <Card title="Carte des projets" bodyClassName="p-0">
          <SigMap
            height={320}
            points={(geo.data ?? []).map((p) => ({
              id: p.id,
              latitude: p.latitude,
              longitude: p.longitude,
              libelle: p.intitule,
              sousTitre: `${humaniser(p.secteur)} · ${humaniser(p.statut)}`,
              montant: p.budgetPrevu,
              couche: 'PROJETS' as const,
            }))}
          />
        </Card>
      </div>

      <Card className="mt-4" title="Projets ouverts à la consultation">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Rechercher un projet, une localité…">
          <Select
            aria-label="Secteur"
            className="w-44"
            placeholder="Tous secteurs"
            value={t.filtres.secteur ?? ''}
            onChange={(e) => t.setFiltre('secteur', e.target.value)}
            options={SECTEURS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
        </FilterBar>
        <DataTable
          columns={colonnes}
          page={projets.data}
          isLoading={projets.isLoading}
          error={projets.error}
          onRetry={() => projets.refetch()}
          sort={t.sort}
          onSort={t.setSort}
          onPage={t.setPage}
          onSize={t.setSize}
          rowKey={(p) => p.id}
        />
        <p className="mt-3 text-xs text-ink-500">
          Pour signaler un besoin, utilisez le{' '}
          <Link to="/portail/citoyen" className="text-brand-700 underline">
            portail citoyen
          </Link>
          .
        </p>
      </Card>
    </>
  )
}
