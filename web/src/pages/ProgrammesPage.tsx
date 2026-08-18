import { useNavigate } from 'react-router-dom'
import { BarreChart } from '../components/charts/Charts'
import { Badge, Card, DataTable, FilterBar, PageHeader, ProgressBar, Select, StatCard, toneForStatut, type Column } from '../components/ui'
import { PROGRAMME_STATUTS, SECTEURS } from '../constants/referentiels'
import { useProgrammes } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Programme } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function ProgrammesPage() {
  const t = useTableQuery({ size: 10, sort: 'code:asc' })
  const { data, isLoading, error, refetch } = useProgrammes(t.query)
  const tous = useProgrammes({ size: 200 })
  const navigate = useNavigate()

  const columns: Column<Programme>[] = [
    { key: 'code', header: 'Code', sortable: true, render: (p) => <span className="font-medium text-brand-800">{p.code}</span> },
    { key: 'intitule', header: 'Intitulé', sortable: true, render: (p) => <span className="block max-w-80 truncate">{p.intitule}</span> },
    { key: 'secteur', header: 'Secteur', sortable: true, render: (p) => humaniser(p.secteur) },
    { key: 'statut', header: 'Statut', sortable: true, render: (p) => <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge> },
    { key: 'nbProjets', header: 'Projets', sortable: true, className: 'text-right tabular-nums', render: (p) => formatNombre(p.nbProjets) },
    { key: 'budgetPrevu', header: 'Budget prévu', sortable: true, className: 'text-right tabular-nums', render: (p) => formatFcfaCourt(p.budgetPrevu) },
    { key: 'budgetEngage', header: 'Engagé', sortable: true, className: 'text-right tabular-nums', render: (p) => formatFcfaCourt(p.budgetEngage) },
    { key: 'avancement', header: 'Avancement', sortable: true, render: (p) => <ProgressBar value={p.avancement} /> },
    { key: 'dateFin', header: 'Échéance', sortable: true, render: (p) => formatDate(p.dateFin) },
  ]

  const parSecteur = Object.values(
    (tous.data?.items ?? []).reduce<Record<string, { secteur: string; budget: number }>>((acc, p) => {
      const key = humaniser(p.secteur)
      acc[key] = { secteur: key, budget: (acc[key]?.budget ?? 0) + p.budgetPrevu }
      return acc
    }, {}),
  )

  return (
    <>
      <PageHeader
        title="Programmes"
        subtitle="Déclinaison opérationnelle des axes du PAI en programmes sectoriels et suivi de leur exécution."
        crumbs={[{ label: 'Planification' }, { label: 'Programmes' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Programmes" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Budget programmé" value={formatFcfaCourt((tous.data?.items ?? []).reduce((s, p) => s + p.budgetPrevu, 0))} />
        <StatCard label="Budget engagé" value={formatFcfaCourt((tous.data?.items ?? []).reduce((s, p) => s + p.budgetEngage, 0))} />
        <StatCard label="Programmes en cours" value={formatNombre((tous.data?.items ?? []).filter((p) => p.statut === 'EN_COURS').length)} />
      </div>

      <Card className="mt-4" title="Budget programmé par secteur">
        <BarreChart money data={parSecteur} xKey="secteur" series={[{ key: 'budget', label: 'Budget prévu' }]} />
      </Card>

      <Card className="mt-4" title="Liste des programmes">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Code, intitulé, responsable…">
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
            options={PROGRAMME_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
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
          onRowClick={(p) => navigate(`/programmes/${p.id}`)}
        />
      </Card>
    </>
  )
}
