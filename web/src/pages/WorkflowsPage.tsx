import { useNavigate } from 'react-router-dom'
import { Badge, Card, DataTable, FilterBar, PageHeader, ProgressBar, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { WORKFLOW_TYPES } from '../constants/referentiels'
import { useWorkflows } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { WorkflowInstance } from '../types/domain'
import { formatDate, formatNombre, humaniser } from '../utils/format'

/** Circuits métier : validation projet, passation, engagement, réception, maintenance. */
export default function WorkflowsPage() {
  const t = useTableQuery({ size: 10, sort: 'ouvertLe:desc' })
  const { data, isLoading, error, refetch } = useWorkflows(t.query)
  const tous = useWorkflows({ size: 300 })
  const navigate = useNavigate()

  const columns: Column<WorkflowInstance>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (w) => <span className="font-medium text-brand-800">{w.reference}</span> },
    { key: 'type', header: 'Circuit', sortable: true, render: (w) => humaniser(w.type) },
    { key: 'objet', header: 'Objet', sortable: true, render: (w) => <span className="block max-w-80 truncate">{w.objet}</span> },
    { key: 'statut', header: 'Statut', sortable: true, render: (w) => <Badge tone={toneForStatut(w.statut)}>{humaniser(w.statut)}</Badge> },
    {
      key: 'etapes',
      header: 'Progression',
      render: (w) => <ProgressBar value={(w.etapes.filter((e) => e.statut === 'VALIDE').length / w.etapes.length) * 100} label={`${w.etapes.filter((e) => e.statut === 'VALIDE').length}/${w.etapes.length} étapes`} />,
    },
    {
      key: 'encours',
      header: 'Étape en cours',
      render: (w) => w.etapes.find((e) => e.statut === 'EN_COURS')?.libelle ?? (w.statut === 'EN_COURS' ? '—' : 'Circuit clôturé'),
    },
    { key: 'ouvertLe', header: 'Ouvert le', sortable: true, render: (w) => formatDate(w.ouvertLe) },
    { key: 'clotureLe', header: 'Clôturé le', sortable: true, render: (w) => formatDate(w.clotureLe) },
  ]

  const items = tous.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Workflows"
        subtitle="Circuits de validation du cahier des charges : validation de projet, passation de marché, engagement de dépense, réception d'ouvrage et demande de maintenance."
        crumbs={[{ label: 'Contrôle' }, { label: 'Workflows' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Circuits" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="En cours" value={formatNombre(items.filter((w) => w.statut === 'EN_COURS').length)} tone="warning" />
        <StatCard label="Validés" value={formatNombre(items.filter((w) => w.statut === 'VALIDE').length)} tone="positive" />
        <StatCard label="Rejetés" value={formatNombre(items.filter((w) => w.statut === 'REJETE').length)} tone="critical" />
      </div>

      <Card className="mt-4" title="Circuits ouverts et clôturés" description="Ouvrez un circuit pour traiter l'étape en cours.">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Référence, objet…">
          <Select
            aria-label="Circuit"
            className="w-52"
            placeholder="Tous les circuits"
            value={t.filtres.type ?? ''}
            onChange={(e) => t.setFiltre('type', e.target.value)}
            options={WORKFLOW_TYPES.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Statut"
            className="w-40"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={['EN_COURS', 'VALIDE', 'REJETE'].map((s) => ({ value: s, label: humaniser(s) }))}
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
          rowKey={(w) => w.id}
          onRowClick={(w) => navigate(`/workflows/${w.id}`)}
        />
      </Card>
    </>
  )
}
