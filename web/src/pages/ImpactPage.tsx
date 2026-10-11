import { BarreChart } from '../components/charts/Charts'
import { Card, DataTable, FilterBar, PageHeader, Select, StatCard, type Column } from '../components/ui'
import { SECTEURS } from '../constants/referentiels'
import { useImpacts, useTerritoires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { ImpactMesure } from '../types/domain'
import { formatDate, formatNombre, formatPourcent, humaniser } from '../utils/format'

export default function ImpactPage() {
  const t = useTableQuery({ size: 10 })
  const { data, isLoading, error, refetch } = useImpacts(t.query)
  const tous = useImpacts({ size: 200 })
  const territoires = useTerritoires({ size: 100 })

  const nomTerritoire = (id: string) => territoires.data?.items.find((x) => x.id === id)?.nom ?? id
  const variation = (m: ImpactMesure) => ((m.apresIntervention - m.avantIntervention) / (m.avantIntervention || 1)) * 100

  const columns: Column<ImpactMesure>[] = [
    { key: 'libelle', header: 'Mesure', sortable: true, render: (m) => <span className="font-medium text-ink-900">{m.libelle}</span> },
    { key: 'secteur', header: 'Secteur', sortable: true, render: (m) => humaniser(m.secteur) },
    { key: 'territoireId', header: 'Territoire', render: (m) => nomTerritoire(m.territoireId) },
    { key: 'beneficiaires', header: 'Bénéficiaires', sortable: true, className: 'text-right tabular-nums', render: (m) => formatNombre(m.beneficiaires) },
    { key: 'avantIntervention', header: 'Avant', sortable: true, className: 'text-right tabular-nums', render: (m) => `${formatNombre(m.avantIntervention)} ${m.unite}` },
    { key: 'apresIntervention', header: 'Après', sortable: true, className: 'text-right tabular-nums', render: (m) => `${formatNombre(m.apresIntervention)} ${m.unite}` },
    {
      key: 'variation',
      header: 'Variation',
      className: 'text-right tabular-nums',
      render: (m) => <span className={variation(m) >= 0 ? 'text-emerald-700' : 'text-red-700'}>{formatPourcent(variation(m))}</span>,
    },
    { key: 'mesureLe', header: 'Mesuré le', sortable: true, render: (m) => formatDate(m.mesureLe) },
  ]

  const items = tous.data?.items ?? []
  const parSecteur = SECTEURS.map((s) => ({
    secteur: humaniser(s),
    beneficiaires: items.filter((m) => m.secteur === s).reduce((acc, m) => acc + m.beneficiaires, 0),
  })).filter((x) => x.beneficiaires > 0)

  return (
    <>
      <PageHeader
        title="Impact territorial"
        subtitle="Effets mesurés des investissements sur les conditions de vie : situation avant/après et populations touchées."
        crumbs={[{ label: 'Pilotage' }, { label: 'Impact' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Mesures d'impact" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Bénéficiaires cumulés" value={formatNombre(items.reduce((s, m) => s + m.beneficiaires, 0))} />
        <StatCard label="Mesures en progrès" value={formatNombre(items.filter((m) => m.apresIntervention > m.avantIntervention).length)} tone="positive" />
        <StatCard label="Mesures en recul" value={formatNombre(items.filter((m) => m.apresIntervention < m.avantIntervention).length)} tone="warning" />
      </div>

      <Card className="mt-4" title="Bénéficiaires par secteur">
        <BarreChart data={parSecteur} xKey="secteur" series={[{ key: 'beneficiaires', label: 'Bénéficiaires' }]} />
      </Card>

      <Card className="mt-4" title="Mesures d'impact">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Mesure, unité…">
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
        />
      </Card>
    </>
  )
}
