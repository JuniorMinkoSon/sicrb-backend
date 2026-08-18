import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AireChart, BarreChart } from '../components/charts/Charts'
import {
  Badge,
  Card,
  DataTable,
  FilterBar,
  PageHeader,
  ProgressBar,
  Select,
  StatCard,
  Tabs,
  toneForStatut,
  type Column,
} from '../components/ui'
import { ENGAGEMENT_STATUTS, SOURCES_FINANCEMENT } from '../constants/referentiels'
import { useDashboard, useEngagements, useLignes } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Engagement, LigneBudgetaire } from '../types/domain'
import { formatDate, formatFcfa, formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

export default function FinancesPage() {
  const [onglet, setOnglet] = useState('lignes')
  const lignesQuery = useTableQuery({ size: 10, sort: 'code:asc' })
  const engQuery = useTableQuery({ size: 10, sort: 'dateCreation:desc' })
  const lignes = useLignes(lignesQuery.query)
  const toutesLignes = useLignes({ size: 200 })
  const engagements = useEngagements(engQuery.query)
  const tousEngagements = useEngagements({ size: 400 })
  const { data: synthese } = useDashboard()

  const colonnesLignes: Column<LigneBudgetaire>[] = [
    { key: 'code', header: 'Imputation', sortable: true, render: (l) => <span className="font-medium text-brand-800">{l.code}</span> },
    { key: 'libelle', header: 'Libellé', sortable: true, render: (l) => l.libelle },
    { key: 'exercice', header: 'Exercice', sortable: true, render: (l) => l.exercice },
    { key: 'source', header: 'Source', sortable: true, render: (l) => humaniser(l.source) },
    { key: 'dotation', header: 'Dotation', sortable: true, className: 'text-right tabular-nums', render: (l) => formatFcfa(l.dotation) },
    { key: 'engage', header: 'Engagé', sortable: true, className: 'text-right tabular-nums', render: (l) => formatFcfa(l.engage) },
    { key: 'paye', header: 'Payé', sortable: true, className: 'text-right tabular-nums', render: (l) => formatFcfa(l.paye) },
    { key: 'reste', header: 'Reste à payer', className: 'text-right tabular-nums', render: (l) => formatFcfa(l.engage - l.paye) },
    { key: 'taux', header: 'Consommation', render: (l) => <ProgressBar value={(l.paye / l.dotation) * 100} /> },
    {
      key: 'programmeId',
      header: 'Programme',
      render: (l) =>
        l.programmeId ? (
          <Link to={`/programmes/${l.programmeId}`} className="text-brand-800 hover:underline">
            Fiche
          </Link>
        ) : (
          '—'
        ),
    },
  ]

  const colonnesEngagements: Column<Engagement>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (e) => <span className="font-medium text-brand-800">{e.reference}</span> },
    { key: 'objet', header: 'Objet', sortable: true, render: (e) => <span className="block max-w-80 truncate">{e.objet}</span> },
    { key: 'montant', header: 'Montant', sortable: true, className: 'text-right tabular-nums', render: (e) => formatFcfa(e.montant) },
    { key: 'statut', header: 'Statut', sortable: true, render: (e) => <Badge tone={toneForStatut(e.statut)}>{humaniser(e.statut)}</Badge> },
    { key: 'dateCreation', header: 'Créé le', sortable: true, render: (e) => formatDate(e.dateCreation) },
    { key: 'datePaiement', header: 'Payé le', sortable: true, render: (e) => formatDate(e.datePaiement) },
    {
      key: 'projetId',
      header: 'Projet',
      render: (e) =>
        e.projetId ? (
          <Link to={`/projets/${e.projetId}`} className="text-brand-800 hover:underline">
            {e.projetId}
          </Link>
        ) : (
          '—'
        ),
    },
  ]

  const eng = tousEngagements.data?.items ?? []
  const dotation = (toutesLignes.data?.items ?? []).reduce((s, l) => s + l.dotation, 0)
  const engage = (toutesLignes.data?.items ?? []).reduce((s, l) => s + l.engage, 0)
  const paye = (toutesLignes.data?.items ?? []).reduce((s, l) => s + l.paye, 0)

  const parSource = SOURCES_FINANCEMENT.map((source) => ({
    source: humaniser(source),
    dotation: (toutesLignes.data?.items ?? []).filter((l) => l.source === source).reduce((s, l) => s + l.dotation, 0),
  })).filter((x) => x.dotation > 0)

  return (
    <>
      <PageHeader
        title="Finances"
        subtitle="Chaîne d'exécution budgétaire : dotations, engagements, liquidations, paiements et restes à payer."
        crumbs={[{ label: 'Finances' }, { label: 'Exécution budgétaire' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Dotations" value={formatFcfaCourt(dotation)} />
        <StatCard label="Engagements" value={formatFcfaCourt(engage)} hint={dotation ? formatPourcent((engage / dotation) * 100) : undefined} />
        <StatCard label="Paiements" value={formatFcfaCourt(paye)} hint={dotation ? formatPourcent((paye / dotation) * 100) : undefined} />
        <StatCard label="Restes à payer" value={formatFcfaCourt(engage - paye)} tone="warning" />
        <StatCard label="Dossiers bloqués" value={formatNombre(eng.filter((e) => e.statut === 'REJETE').length)} tone="critical" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Dotations par source de financement">
          <BarreChart money data={parSource} xKey="source" series={[{ key: 'dotation', label: 'Dotation' }]} />
        </Card>
        <Card title="Rythme d'exécution" description="Engagements et paiements mensuels consolidés">
          {synthese && (
            <AireChart
              money
              data={synthese.executionMensuelle}
              xKey="periode"
              series={[
                { key: 'engage', label: 'Engagé' },
                { key: 'paye', label: 'Payé' },
              ]}
            />
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Tabs
          items={[
            { id: 'lignes', label: 'Lignes budgétaires', count: toutesLignes.data?.total },
            { id: 'engagements', label: 'Engagements & paiements', count: tousEngagements.data?.total },
          ]}
          active={onglet}
          onChange={setOnglet}
        />
      </div>

      {onglet === 'lignes' ? (
        <Card className="mt-4" title="Lignes budgétaires">
          <FilterBar q={lignesQuery.q} onQ={lignesQuery.setQ} onReset={lignesQuery.reset} placeholder="Imputation, libellé…">
            <Select
              aria-label="Source"
              className="w-48"
              placeholder="Toutes sources"
              value={lignesQuery.filtres.source ?? ''}
              onChange={(e) => lignesQuery.setFiltre('source', e.target.value)}
              options={SOURCES_FINANCEMENT.map((s) => ({ value: s, label: humaniser(s) }))}
            />
            <Select
              aria-label="Exercice"
              className="w-32"
              placeholder="Exercices"
              value={lignesQuery.filtres.exercice ?? ''}
              onChange={(e) => lignesQuery.setFiltre('exercice', e.target.value)}
              options={Array.from(new Set((toutesLignes.data?.items ?? []).map((l) => String(l.exercice)))).map((y) => ({ value: y, label: y }))}
            />
          </FilterBar>
          <DataTable
            columns={colonnesLignes}
            page={lignes.data}
            isLoading={lignes.isLoading}
            error={lignes.error}
            onRetry={() => lignes.refetch()}
            sort={lignesQuery.sort}
            onSort={lignesQuery.setSort}
            onPage={lignesQuery.setPage}
            onSize={lignesQuery.setSize}
            rowKey={(l) => l.id}
          />
        </Card>
      ) : (
        <Card className="mt-4" title="Engagements et paiements">
          <FilterBar q={engQuery.q} onQ={engQuery.setQ} onReset={engQuery.reset} placeholder="Référence, objet…">
            <Select
              aria-label="Statut"
              className="w-44"
              placeholder="Tous statuts"
              value={engQuery.filtres.statut ?? ''}
              onChange={(e) => engQuery.setFiltre('statut', e.target.value)}
              options={ENGAGEMENT_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
            />
          </FilterBar>
          <DataTable
            columns={colonnesEngagements}
            page={engagements.data}
            isLoading={engagements.isLoading}
            error={engagements.error}
            onRetry={() => engagements.refetch()}
            sort={engQuery.sort}
            onSort={engQuery.setSort}
            onPage={engQuery.setPage}
            onSize={engQuery.setSize}
            rowKey={(e) => e.id}
          />
        </Card>
      )}
    </>
  )
}
