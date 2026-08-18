import { LigneChart } from '../components/charts/Charts'
import { Badge, Card, ErrorState, FilterBar, LoadingState, PageHeader, Pagination, ProgressBar, Select, StatCard } from '../components/ui'
import { SECTEURS } from '../constants/referentiels'
import { useIndicateurs } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import { formatNombre, formatPourcent, humaniser } from '../utils/format'

/** Indicateurs adossés aux mêmes données métier que les programmes et projets. */
export default function IndicateursPage() {
  const t = useTableQuery({ size: 6 })
  const { data, isLoading, error, refetch } = useIndicateurs(t.query)
  const tous = useIndicateurs({ size: 100 })

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />

  const items = tous.data?.items ?? []
  const atteints = items.filter((i) => i.valeur >= i.cible).length

  return (
    <>
      <PageHeader
        title="Indicateurs de performance"
        subtitle="Suivi des cibles sectorielles alimenté par les programmes, les projets et les territoires."
        crumbs={[{ label: 'Pilotage' }, { label: 'Indicateurs' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Indicateurs suivis" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Cibles atteintes" value={formatNombre(atteints)} tone="positive" />
        <StatCard label="En progression" value={formatNombre(items.filter((i) => i.tendance === 'HAUSSE').length)} />
        <StatCard label="En recul" value={formatNombre(items.filter((i) => i.tendance === 'BAISSE').length)} tone="warning" />
      </div>

      <Card className="mt-4" title="Filtres">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Code, libellé, source…">
          <Select
            aria-label="Secteur"
            className="w-44"
            placeholder="Tous secteurs"
            value={t.filtres.secteur ?? ''}
            onChange={(e) => t.setFiltre('secteur', e.target.value)}
            options={SECTEURS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
        </FilterBar>
      </Card>

      {isLoading && !data ? (
        <div className="mt-4">
          <LoadingState label="Chargement des indicateurs…" />
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {data?.items.map((ind) => (
              <Card
                key={ind.id}
                title={`${ind.code} — ${ind.libelle}`}
                description={`Source : ${ind.source} · ${humaniser(ind.secteur)}`}
                actions={
                  <Badge tone={ind.valeur >= ind.cible ? 'success' : ind.tendance === 'BAISSE' ? 'danger' : 'warning'}>
                    {ind.tendance === 'HAUSSE' ? 'En hausse' : ind.tendance === 'BAISSE' ? 'En baisse' : 'Stable'}
                  </Badge>
                }
              >
                <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                  <p className="text-2xl font-semibold tabular-nums text-ink-900">
                    {formatNombre(ind.valeur)} <span className="text-sm font-normal text-ink-500">{ind.unite}</span>
                  </p>
                  <p className="text-xs text-ink-500">
                    Cible : {formatNombre(ind.cible)} {ind.unite}
                  </p>
                </div>
                <ProgressBar value={(ind.valeur / ind.cible) * 100} label={`Atteinte de la cible (${formatPourcent((ind.valeur / ind.cible) * 100)})`} />
                <div className="mt-3">
                  <LigneChart height={180} data={ind.serie} xKey="periode" series={[{ key: 'valeur', label: ind.unite }]} />
                </div>
              </Card>
            ))}
          </div>
          {data && <Pagination page={data.page} size={data.size} total={data.total} onPage={t.setPage} onSize={t.setSize} />}
        </>
      )}
    </>
  )
}
