import { Badge, Card, DataTable, FilterBar, PageHeader, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { MAINTENANCE_STATUTS, MAINTENANCE_TYPES } from '../constants/referentiels'
import { useInfrastructures, useMaintenances } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Maintenance } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function MaintenancePage() {
  const t = useTableQuery({ size: 10, sort: 'signaleLe:desc' })
  const { data, isLoading, error, refetch } = useMaintenances(t.query)
  const toutes = useMaintenances({ size: 300 })
  const infrastructures = useInfrastructures({ size: 300 })

  const ouvrage = (id: string) => infrastructures.data?.items.find((i) => i.id === id)?.designation ?? id

  const columns: Column<Maintenance>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (m) => <span className="font-medium text-brand-800">{m.reference}</span> },
    { key: 'infrastructureId', header: 'Ouvrage', render: (m) => ouvrage(m.infrastructureId) },
    { key: 'type', header: 'Nature', sortable: true, render: (m) => <Badge tone={m.type === 'URGENCE' ? 'danger' : m.type === 'CORRECTIVE' ? 'warning' : 'info'}>{humaniser(m.type)}</Badge> },
    { key: 'statut', header: 'Statut', sortable: true, render: (m) => <Badge tone={toneForStatut(m.statut)}>{humaniser(m.statut)}</Badge> },
    { key: 'signaleLe', header: 'Signalé le', sortable: true, render: (m) => formatDate(m.signaleLe) },
    { key: 'planifieLe', header: 'Planifié le', sortable: true, render: (m) => formatDate(m.planifieLe) },
    { key: 'clotureLe', header: 'Clôturé le', sortable: true, render: (m) => formatDate(m.clotureLe) },
    { key: 'cout', header: 'Coût', sortable: true, className: 'text-right tabular-nums', render: (m) => (m.cout ? formatFcfaCourt(m.cout) : '—') },
    { key: 'description', header: 'Constat', render: (m) => <span className="block max-w-72 truncate text-ink-600">{m.description}</span> },
  ]

  const items = toutes.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Maintenance"
        subtitle="Cycle de maintenance du patrimoine : signalement, planification, exécution et clôture des interventions."
        crumbs={[{ label: 'Exécution' }, { label: 'Maintenance' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Demandes" value={formatNombre(toutes.data?.total ?? 0)} />
        <StatCard label="En attente de planification" value={formatNombre(items.filter((m) => m.statut === 'DEMANDEE').length)} tone="warning" />
        <StatCard label="Interventions réalisées" value={formatNombre(items.filter((m) => m.statut === 'REALISEE').length)} tone="positive" />
        <StatCard label="Coût cumulé" value={formatFcfaCourt(items.reduce((s, m) => s + m.cout, 0))} />
      </div>

      <Card className="mt-4" title="Registre des interventions">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Référence, constat…">
          <Select
            aria-label="Statut"
            className="w-40"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={MAINTENANCE_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Nature"
            className="w-40"
            placeholder="Toutes natures"
            value={t.filtres.type ?? ''}
            onChange={(e) => t.setFiltre('type', e.target.value)}
            options={MAINTENANCE_TYPES.map((s) => ({ value: s, label: humaniser(s) }))}
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
          rowKey={(m) => m.id}
          emptyTitle="Aucune intervention"
          emptyDescription="Aucune demande de maintenance ne correspond aux critères."
        />
      </Card>
    </>
  )
}
