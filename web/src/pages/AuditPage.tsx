import { Badge, Card, DataTable, FilterBar, PageHeader, Select, StatCard, type Column } from '../components/ui'
import { useAudits } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { AuditEntree } from '../types/domain'
import { formatDateHeure, formatNombre, humaniser } from '../utils/format'

export default function AuditPage() {
  const t = useTableQuery({ size: 15, sort: 'horodatage:desc' })
  const { data, isLoading, error, refetch } = useAudits(t.query)
  const tous = useAudits({ size: 400 })

  const columns: Column<AuditEntree>[] = [
    { key: 'horodatage', header: 'Horodatage', sortable: true, render: (a) => formatDateHeure(a.horodatage) },
    { key: 'acteur', header: 'Acteur', sortable: true, render: (a) => <span className="font-medium text-ink-900">{a.acteur}</span> },
    { key: 'action', header: 'Action', sortable: true, render: (a) => humaniser(a.action) },
    { key: 'module', header: 'Module', sortable: true, render: (a) => a.module },
    { key: 'cible', header: 'Cible', render: (a) => <span className="text-ink-600">{a.cible}</span> },
    { key: 'adresseIp', header: 'Adresse IP', render: (a) => a.adresseIp },
    { key: 'resultat', header: 'Résultat', sortable: true, render: (a) => <Badge tone={a.resultat === 'SUCCES' ? 'success' : 'danger'}>{humaniser(a.resultat)}</Badge> },
  ]

  const items = tous.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Journal d'audit"
        subtitle="Traçabilité des actions réalisées dans le système d'information, par acteur, module et résultat."
        crumbs={[{ label: 'Pilotage' }, { label: 'Audit' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Entrées" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Échecs" value={formatNombre(items.filter((a) => a.resultat === 'ECHEC').length)} tone="critical" />
        <StatCard label="Acteurs distincts" value={formatNombre(new Set(items.map((a) => a.acteur)).size)} />
        <StatCard label="Modules couverts" value={formatNombre(new Set(items.map((a) => a.module)).size)} />
      </div>

      <Card className="mt-4" title="Traces d'activité">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Acteur, action, cible…">
          <Select
            aria-label="Module"
            className="w-44"
            placeholder="Tous modules"
            value={t.filtres.module ?? ''}
            onChange={(e) => t.setFiltre('module', e.target.value)}
            options={Array.from(new Set(items.map((a) => a.module))).map((m) => ({ value: m, label: m }))}
          />
          <Select
            aria-label="Résultat"
            className="w-36"
            placeholder="Tous résultats"
            value={t.filtres.resultat ?? ''}
            onChange={(e) => t.setFiltre('resultat', e.target.value)}
            options={[
              { value: 'SUCCES', label: 'Succès' },
              { value: 'ECHEC', label: 'Échec' },
            ]}
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
          rowKey={(a) => a.id}
        />
      </Card>
    </>
  )
}
