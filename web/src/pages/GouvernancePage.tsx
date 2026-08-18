import { Badge, Card, DataTable, FilterBar, PageHeader, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { useSessions } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { SessionDeliberante } from '../types/domain'
import { formatDate, formatNombre, humaniser } from '../utils/format'

export default function GouvernancePage() {
  const t = useTableQuery({ size: 10, sort: 'date:desc' })
  const { data, isLoading, error, refetch } = useSessions(t.query)
  const toutes = useSessions({ size: 200 })

  const columns: Column<SessionDeliberante>[] = [
    { key: 'intitule', header: 'Session', sortable: true, render: (s) => <span className="font-medium text-ink-900">{s.intitule}</span> },
    { key: 'type', header: 'Type', sortable: true, render: (s) => humaniser(s.type) },
    { key: 'date', header: 'Date', sortable: true, render: (s) => formatDate(s.date) },
    { key: 'statut', header: 'Statut', sortable: true, render: (s) => <Badge tone={toneForStatut(s.statut)}>{humaniser(s.statut)}</Badge> },
    {
      key: 'presents',
      header: 'Quorum',
      className: 'text-right tabular-nums',
      render: (s) => (
        <span className={s.presents >= s.quorum ? 'text-emerald-700' : 'text-red-700'}>
          {s.presents} / {s.quorum}
        </span>
      ),
    },
    { key: 'deliberations', header: 'Délibérations', sortable: true, className: 'text-right tabular-nums', render: (s) => formatNombre(s.deliberations) },
    { key: 'documentIds', header: 'Pièces', className: 'text-right tabular-nums', render: (s) => s.documentIds.length },
  ]

  return (
    <>
      <PageHeader
        title="Gouvernance — sessions et délibérations"
        subtitle="Instances délibérantes du Conseil Régional : plénières, bureau et commissions, quorum et actes produits."
        crumbs={[{ label: 'Gouvernance' }, { label: 'Sessions & délibérations' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Sessions" value={formatNombre(toutes.data?.total ?? 0)} />
        <StatCard label="Délibérations adoptées" value={formatNombre((toutes.data?.items ?? []).reduce((s, x) => s + x.deliberations, 0))} />
        <StatCard label="Sessions clôturées" value={formatNombre((toutes.data?.items ?? []).filter((s) => s.statut === 'CLOTUREE').length)} />
        <StatCard label="Sessions planifiées" value={formatNombre((toutes.data?.items ?? []).filter((s) => s.statut === 'PLANIFIEE').length)} />
      </div>

      <Card className="mt-4" title="Registre des sessions">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Intitulé de session…">
          <Select
            aria-label="Type"
            className="w-40"
            placeholder="Tous types"
            value={t.filtres.type ?? ''}
            onChange={(e) => t.setFiltre('type', e.target.value)}
            options={['PLENIERE', 'BUREAU', 'COMMISSION'].map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Statut"
            className="w-40"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={['PLANIFIEE', 'EN_COURS', 'CLOTUREE'].map((s) => ({ value: s, label: humaniser(s) }))}
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
          rowKey={(s) => s.id}
        />
      </Card>
    </>
  )
}
