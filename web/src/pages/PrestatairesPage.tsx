import { useNavigate } from 'react-router-dom'
import { Badge, Card, DataTable, FilterBar, PageHeader, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { PRESTATAIRE_STATUTS } from '../constants/referentiels'
import { usePrestataires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Prestataire } from '../types/domain'
import { formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function PrestatairesPage() {
  const t = useTableQuery({ size: 10, sort: 'raisonSociale:asc' })
  const { data, isLoading, error, refetch } = usePrestataires(t.query)
  const tous = usePrestataires({ size: 200 })
  const navigate = useNavigate()

  const columns: Column<Prestataire>[] = [
    { key: 'raisonSociale', header: 'Raison sociale', sortable: true, render: (p) => <span className="font-medium text-brand-800">{p.raisonSociale}</span> },
    { key: 'rccm', header: 'RCCM', render: (p) => p.rccm },
    { key: 'categorie', header: 'Catégorie', sortable: true, render: (p) => p.categorie },
    { key: 'ville', header: 'Ville', sortable: true, render: (p) => p.ville },
    { key: 'statut', header: 'Statut', sortable: true, render: (p) => <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge> },
    { key: 'marchesAttribues', header: 'Marchés', sortable: true, className: 'text-right tabular-nums', render: (p) => formatNombre(p.marchesAttribues) },
    { key: 'montantCumule', header: 'Montant cumulé', sortable: true, className: 'text-right tabular-nums', render: (p) => formatFcfaCourt(p.montantCumule) },
    {
      key: 'notePerformance',
      header: 'Performance',
      sortable: true,
      render: (p) => <Badge tone={p.notePerformance >= 75 ? 'success' : p.notePerformance >= 50 ? 'warning' : 'danger'}>{p.notePerformance} / 100</Badge>,
    },
  ]

  const items = tous.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Prestataires"
        subtitle="Référentiel des entreprises et bureaux d'études : agrément, marchés attribués et performance constatée."
        crumbs={[{ label: 'Finances' }, { label: 'Prestataires' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Prestataires" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Agréés" value={formatNombre(items.filter((p) => p.statut === 'AGREE').length)} tone="positive" />
        <StatCard label="Suspendus / radiés" value={formatNombre(items.filter((p) => p.statut === 'SUSPENDU' || p.statut === 'RADIE').length)} tone="critical" />
        <StatCard label="Montant contractualisé" value={formatFcfaCourt(items.reduce((s, p) => s + p.montantCumule, 0))} />
      </div>

      <Card className="mt-4" title="Référentiel des prestataires">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Raison sociale, RCCM, contact…">
          <Select
            aria-label="Statut"
            className="w-44"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={PRESTATAIRE_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Catégorie"
            className="w-48"
            placeholder="Toutes catégories"
            value={t.filtres.categorie ?? ''}
            onChange={(e) => t.setFiltre('categorie', e.target.value)}
            options={Array.from(new Set(items.map((p) => p.categorie))).map((c) => ({ value: c, label: c }))}
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
          onRowClick={(p) => navigate(`/prestataires/${p.id}`)}
        />
      </Card>
    </>
  )
}
