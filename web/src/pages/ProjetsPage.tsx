import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Card,
  DataTable,
  FilterBar,
  PageHeader,
  ProgressBar,
  Select,
  StatCard,
  toneForStatut,
  type Column,
} from '../components/ui'
import { PROJET_STATUTS, SECTEURS } from '../constants/referentiels'
import { useProjets, useTerritoires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Projet } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function ProjetsPage() {
  const t = useTableQuery({ size: 10, sort: 'code:asc' })
  const { data, isLoading, error, refetch } = useProjets(t.query)
  const territoires = useTerritoires({ size: 100 })
  const navigate = useNavigate()

  const nomTerritoire = (id: string) => territoires.data?.items.find((x) => x.id === id)?.nom ?? '—'

  const columns: Column<Projet>[] = [
    { key: 'code', header: 'Code', sortable: true, render: (p) => <span className="font-medium text-brand-800">{p.code}</span> },
    { key: 'intitule', header: 'Intitulé', sortable: true, render: (p) => <span className="block max-w-80 truncate">{p.intitule}</span> },
    { key: 'secteur', header: 'Secteur', sortable: true, render: (p) => humaniser(p.secteur) },
    { key: 'territoireId', header: 'Territoire', render: (p) => nomTerritoire(p.territoireId) },
    { key: 'statut', header: 'Statut', sortable: true, render: (p) => <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge> },
    { key: 'budgetPrevu', header: 'Budget', sortable: true, className: 'text-right tabular-nums', render: (p) => formatFcfaCourt(p.budgetPrevu) },
    { key: 'avancementPhysique', header: 'Avancement', sortable: true, render: (p) => <ProgressBar value={p.avancementPhysique} /> },
    { key: 'dateFinPrevue', header: 'Fin prévue', sortable: true, render: (p) => formatDate(p.dateFinPrevue) },
    {
      key: 'risque',
      header: 'Risque',
      sortable: true,
      render: (p) => <Badge tone={p.risque === 'ELEVE' ? 'danger' : p.risque === 'MOYEN' ? 'warning' : 'success'}>{humaniser(p.risque)}</Badge>,
    },
  ]

  const budget = data?.items.reduce((s, p) => s + p.budgetPrevu, 0) ?? 0

  return (
    <>
      <PageHeader
        title="Projets"
        subtitle="Portefeuille d'opérations d'investissement : identification, passation, travaux, réception et exploitation."
        crumbs={[{ label: 'Exécution' }, { label: 'Projets' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Projets filtrés" value={formatNombre(data?.total ?? 0)} />
        <StatCard label="Budget de la page" value={formatFcfaCourt(budget)} />
        <StatCard label="Chantiers en cours" value={formatNombre(data?.items.filter((p) => p.statut === 'EN_TRAVAUX').length ?? 0)} />
        <StatCard label="Risque élevé" value={formatNombre(data?.items.filter((p) => p.risque === 'ELEVE').length ?? 0)} tone="critical" />
      </div>

      <Card className="mt-4" title="Liste des projets" description="Recherche plein texte, filtres, tri et pagination assurés par la couche service.">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Code, intitulé, maître d'ouvrage…">
          <Select
            aria-label="Secteur"
            className="w-40"
            placeholder="Tous secteurs"
            value={t.filtres.secteur ?? ''}
            onChange={(e) => t.setFiltre('secteur', e.target.value)}
            options={SECTEURS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Statut"
            className="w-40"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={PROJET_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Territoire"
            className="w-44"
            placeholder="Toute la région"
            value={t.filtres.territoireId ?? ''}
            onChange={(e) => t.setFiltre('territoireId', e.target.value)}
            options={(territoires.data?.items ?? []).filter((x) => x.type !== 'REGION').map((x) => ({ value: x.id, label: x.nom }))}
          />
          <Select
            aria-label="Risque"
            className="w-36"
            placeholder="Tous risques"
            value={t.filtres.risque ?? ''}
            onChange={(e) => t.setFiltre('risque', e.target.value)}
            options={['FAIBLE', 'MOYEN', 'ELEVE'].map((s) => ({ value: s, label: humaniser(s) }))}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          page={data}
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
          sort={t.sort}
          onSort={t.setSort}
          onPage={t.setPage}
          onSize={t.setSize}
          rowKey={(p) => p.id}
          onRowClick={(p) => navigate(`/projets/${p.id}`)}
        />
      </Card>
    </>
  )
}
