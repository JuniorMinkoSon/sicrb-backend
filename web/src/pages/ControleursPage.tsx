import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Card,
  DataTable,
  FilterBar,
  PageHeader,
  ProgressBar,
  Select,
  StatCard,
  Table,
  Tabs,
  Td,
  Th,
  Thead,
  Tr,
  toneForStatut,
  type Column,
} from '../components/ui'
import { MISSION_STATUTS } from '../constants/referentiels'
import { useControleurs, useMissions } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { MissionControle } from '../types/domain'
import { formatDate, formatNombre, formatPourcent, humaniser } from '../utils/format'

export default function ControleursPage() {
  const [onglet, setOnglet] = useState('missions')
  const t = useTableQuery({ size: 10, sort: 'dateVisite:desc' })
  const { data, isLoading, error, refetch } = useMissions(t.query)
  const toutes = useMissions({ size: 300 })
  const { data: controleurs = [] } = useControleurs()

  const nomControleur = (id: string) => controleurs.find((c) => c.id === id)?.nom ?? id

  const columns: Column<MissionControle>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (m) => <span className="font-medium text-brand-800">{m.reference}</span> },
    { key: 'projetId', header: 'Projet', render: (m) => <Link to={`/projets/${m.projetId}`} className="text-brand-800 hover:underline">{m.projetId}</Link> },
    { key: 'controleurId', header: 'Contrôleur', render: (m) => nomControleur(m.controleurId) },
    { key: 'dateVisite', header: 'Visite', sortable: true, render: (m) => formatDate(m.dateVisite) },
    { key: 'statut', header: 'Statut', sortable: true, render: (m) => <Badge tone={toneForStatut(m.statut)}>{humaniser(m.statut)}</Badge> },
    { key: 'conformite', header: 'Conformité', sortable: true, render: (m) => <ProgressBar value={m.conformite} /> },
    { key: 'reservesLevees', header: 'Réserves', render: (m) => (m.reservesLevees ? <Badge tone="success">Levées</Badge> : <Badge tone="warning">En cours</Badge>) },
    { key: 'documentIds', header: 'PV / photos', className: 'text-right tabular-nums', render: (m) => m.documentIds.length },
  ]

  const items = toutes.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Contrôle & missions"
        subtitle="Le contrôleur constate et documente (visites, PV) ; la Direction technique décide et finalise sur la base de ce constat indépendant."
        crumbs={[{ label: 'Contrôle' }, { label: 'Contrôleurs & missions' }]}
      />

      <Card className="mb-4" title="Circuit contrôle → décision technique" description="Constat indépendant du contrôleur, décision et finalisation par la DT">
        <ol className="flex flex-wrap items-center gap-y-2 text-[11px] font-medium">
          {[
            'Contrôle terrain',
            'Constat documenté (PV)',
            'Réserves ?',
          ].map((e, i) => (
            <li key={e} className="flex items-center">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-800 ring-1 ring-inset ring-brand-200">{e}</span>
              {i < 2 && <span className="mx-1.5 text-ink-300">→</span>}
            </li>
          ))}
        </ol>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-xs font-semibold text-amber-800">OUI — réserves constatées</p>
            <p className="mt-1 text-xs text-ink-700">Corrections par le prestataire → nouveau contrôle → validation DT.</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
            <p className="text-xs font-semibold text-emerald-800">NON — conforme</p>
            <p className="mt-1 text-xs text-ink-700">Finalisation par la DT → réception → exploitation.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Missions" value={formatNombre(toutes.data?.total ?? 0)} />
        <StatCard label="Contrôleurs mobilisés" value={formatNombre(controleurs.length)} />
        <StatCard label="Conformité moyenne" value={formatPourcent(items.length ? items.reduce((s, m) => s + m.conformite, 0) / items.length : 0)} />
        <StatCard label="Réserves non levées" value={formatNombre(items.filter((m) => !m.reservesLevees).length)} tone="warning" />
      </div>

      <div className="mt-4">
        <Tabs
          items={[
            { id: 'missions', label: 'Missions', count: toutes.data?.total },
            { id: 'controleurs', label: 'Contrôleurs', count: controleurs.length },
          ]}
          active={onglet}
          onChange={setOnglet}
        />
      </div>

      {onglet === 'missions' ? (
        <Card className="mt-4" title="Missions de contrôle">
          <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Référence, observations…">
            <Select
              aria-label="Statut"
              className="w-44"
              placeholder="Tous statuts"
              value={t.filtres.statut ?? ''}
              onChange={(e) => t.setFiltre('statut', e.target.value)}
              options={MISSION_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
            />
            <Select
              aria-label="Contrôleur"
              className="w-48"
              placeholder="Tous contrôleurs"
              value={t.filtres.controleurId ?? ''}
              onChange={(e) => t.setFiltre('controleurId', e.target.value)}
              options={controleurs.map((c) => ({ value: c.id, label: c.nom }))}
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
      ) : (
        <Card className="mt-4" title="Corps de contrôle" description="Affectation territoriale et charge de travail">
          <Table>
            <Thead>
              <tr>
                <Th>Contrôleur</Th>
                <Th>Fonction</Th>
                <Th>Zone</Th>
                <Th>Contact</Th>
                <Th className="text-right">Missions en cours</Th>
              </tr>
            </Thead>
            <tbody>
              {controleurs.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium text-ink-900">{c.nom}</Td>
                  <Td>{c.fonction}</Td>
                  <Td>{c.zone}</Td>
                  <Td>
                    <span className="block text-xs text-ink-600">{c.telephone}</span>
                    <span className="block text-xs text-ink-500">{c.email}</span>
                  </Td>
                  <Td className="text-right tabular-nums">{c.missionsEnCours}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  )
}
