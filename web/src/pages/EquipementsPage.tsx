import { Badge, Card, DataTable, FilterBar, PageHeader, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { EQUIPEMENT_STATUTS } from '../constants/referentiels'
import { useEquipements, useTerritoires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Equipement } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function EquipementsPage() {
  const t = useTableQuery({ size: 10, sort: 'designation:asc' })
  const { data, isLoading, error, refetch } = useEquipements(t.query)
  const tous = useEquipements({ size: 200 })
  const territoires = useTerritoires({ size: 100 })

  const columns: Column<Equipement>[] = [
    { key: 'code', header: 'Code', sortable: true, render: (e) => <span className="font-medium text-brand-800">{e.code}</span> },
    { key: 'designation', header: 'Désignation', sortable: true, render: (e) => e.designation },
    { key: 'categorie', header: 'Catégorie', sortable: true, render: (e) => e.categorie },
    { key: 'immatriculation', header: 'Immatriculation', render: (e) => e.immatriculation ?? '—' },
    { key: 'statut', header: 'Statut', sortable: true, render: (e) => <Badge tone={toneForStatut(e.statut)}>{humaniser(e.statut)}</Badge> },
    { key: 'affectation', header: 'Affectation', render: (e) => e.affectation ?? 'Non affecté' },
    {
      key: 'territoireId',
      header: 'Territoire',
      render: (e) => territoires.data?.items.find((x) => x.id === e.territoireId)?.nom ?? '—',
    },
    { key: 'acquisLe', header: 'Acquis le', sortable: true, render: (e) => formatDate(e.acquisLe) },
    { key: 'valeurAcquisition', header: 'Valeur', sortable: true, className: 'text-right tabular-nums', render: (e) => formatFcfaCourt(e.valeurAcquisition) },
  ]

  const items = tous.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Équipements"
        subtitle="Parc régional : véhicules, matériels et équipements affectés aux directions et aux chantiers."
        crumbs={[{ label: 'Exécution' }, { label: 'Équipements' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Équipements" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Affectés" value={formatNombre(items.filter((e) => e.statut === 'AFFECTE').length)} />
        <StatCard label="En panne" value={formatNombre(items.filter((e) => e.statut === 'EN_PANNE').length)} tone="critical" />
        <StatCard label="Valeur d'acquisition" value={formatFcfaCourt(items.reduce((s, e) => s + e.valeurAcquisition, 0))} />
      </div>

      <Card className="mt-4" title="Inventaire du parc">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Code, désignation, immatriculation…">
          <Select
            aria-label="Statut"
            className="w-40"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={EQUIPEMENT_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Catégorie"
            className="w-48"
            placeholder="Toutes catégories"
            value={t.filtres.categorie ?? ''}
            onChange={(e) => t.setFiltre('categorie', e.target.value)}
            options={Array.from(new Set(items.map((e) => e.categorie))).map((c) => ({ value: c, label: c }))}
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
          rowKey={(e) => e.id}
        />
      </Card>
    </>
  )
}
