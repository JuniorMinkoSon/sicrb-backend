import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { RepartitionChart } from '../components/charts/Charts'
import {
  Badge,
  Button,
  Card,
  DataTable,
  FilterBar,
  Label,
  Modal,
  PageHeader,
  Select,
  StatCard,
  Textarea,
  toneForStatut,
  useToast,
  type Column,
} from '../components/ui'
import { ETATS_OUVRAGE, MAINTENANCE_TYPES } from '../constants/referentiels'
import { useDemanderMaintenance, useInfrastructures, useTerritoires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Infrastructure, MaintenanceType } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

/** Patrimoine régional + point d'entrée du workflow « demande de maintenance ». */
export default function InfrastructuresPage() {
  const t = useTableQuery({ size: 10, sort: 'designation:asc' })
  const { data, isLoading, error, refetch } = useInfrastructures(t.query)
  const toutes = useInfrastructures({ size: 300 })
  const territoires = useTerritoires({ size: 100 })
  const demande = useDemanderMaintenance()
  const { notify } = useToast()
  const [cible, setCible] = useState<Infrastructure | null>(null)
  const [type, setType] = useState<MaintenanceType>('CORRECTIVE')
  const [description, setDescription] = useState('')

  const nomTerritoire = (id: string) => territoires.data?.items.find((x) => x.id === id)?.nom ?? '—'

  const columns: Column<Infrastructure>[] = [
    { key: 'code', header: 'Code', sortable: true, render: (i) => <span className="font-medium text-brand-800">{i.code}</span> },
    { key: 'designation', header: 'Désignation', sortable: true, render: (i) => i.designation },
    { key: 'type', header: 'Type', sortable: true, render: (i) => i.type },
    { key: 'territoireId', header: 'Territoire', render: (i) => nomTerritoire(i.territoireId) },
    { key: 'etat', header: 'État', sortable: true, render: (i) => <Badge tone={toneForStatut(i.etat)}>{humaniser(i.etat)}</Badge> },
    { key: 'miseEnServiceLe', header: 'Mise en service', sortable: true, render: (i) => formatDate(i.miseEnServiceLe) },
    { key: 'valeurPatrimoniale', header: 'Valeur', sortable: true, className: 'text-right tabular-nums', render: (i) => formatFcfaCourt(i.valeurPatrimoniale) },
    { key: 'prochaineVisite', header: 'Prochaine visite', sortable: true, render: (i) => formatDate(i.prochaineVisite) },
    {
      key: 'actions',
      header: '',
      render: (i) => (
        <Button
          size="sm"
          variant="outline"
          icon={<Wrench className="size-4" />}
          onClick={() => {
            setCible(i)
            setDescription('')
          }}
        >
          Maintenance
        </Button>
      ),
    },
  ]

  const parEtat = ETATS_OUVRAGE.map((etat) => ({
    etat: humaniser(etat),
    ouvrages: (toutes.data?.items ?? []).filter((i) => i.etat === etat).length,
  }))

  return (
    <>
      <PageHeader
        title="Infrastructures"
        subtitle="Patrimoine régional issu des projets réceptionnés : état des ouvrages, valeur patrimoniale et programmation des visites."
        crumbs={[{ label: 'Exécution' }, { label: 'Infrastructures' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Ouvrages suivis" value={formatNombre(toutes.data?.total ?? 0)} />
        <StatCard label="Valeur du patrimoine" value={formatFcfaCourt((toutes.data?.items ?? []).reduce((s, i) => s + i.valeurPatrimoniale, 0))} />
        <StatCard label="Ouvrages dégradés" value={formatNombre((toutes.data?.items ?? []).filter((i) => i.etat === 'DEGRADE').length)} tone="warning" />
        <StatCard label="Hors service" value={formatNombre((toutes.data?.items ?? []).filter((i) => i.etat === 'HORS_SERVICE').length)} tone="critical" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <Card title="État du patrimoine" className="xl:col-span-1">
          <RepartitionChart data={parEtat} nameKey="etat" valueKey="ouvrages" height={220} />
        </Card>
        <Card title="Inventaire" className="xl:col-span-3">
          <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Code, désignation, type d'ouvrage…">
            <Select
              aria-label="État"
              className="w-40"
              placeholder="Tous états"
              value={t.filtres.etat ?? ''}
              onChange={(e) => t.setFiltre('etat', e.target.value)}
              options={ETATS_OUVRAGE.map((s) => ({ value: s, label: humaniser(s) }))}
            />
            <Select
              aria-label="Territoire"
              className="w-44"
              placeholder="Toute la région"
              value={t.filtres.territoireId ?? ''}
              onChange={(e) => t.setFiltre('territoireId', e.target.value)}
              options={(territoires.data?.items ?? []).filter((x) => x.type !== 'REGION').map((x) => ({ value: x.id, label: x.nom }))}
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
            rowKey={(i) => i.id}
          />
        </Card>
      </div>

      <Modal
        open={cible !== null}
        title="Demande d'intervention"
        description={cible ? `${cible.code} — ${cible.designation}` : undefined}
        onClose={() => setCible(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCible(null)}>
              Annuler
            </Button>
            <Button
              disabled={demande.isPending || description.trim().length < 5}
              onClick={() => {
                if (!cible) return
                demande.mutate(
                  { infrastructureId: cible.id, type, description },
                  {
                    onSuccess: (m) => {
                      notify(`Demande ${m.reference} enregistrée et transmise au circuit de maintenance.`)
                      setCible(null)
                    },
                    onError: (e) => notify(e instanceof Error ? e.message : 'Échec de la demande', 'error'),
                  },
                )
              }}
            >
              {demande.isPending ? 'Enregistrement…' : 'Transmettre la demande'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label htmlFor="type-maintenance">Nature de l'intervention</Label>
            <Select
              id="type-maintenance"
              value={type}
              onChange={(e) => setType(e.target.value as MaintenanceType)}
              options={MAINTENANCE_TYPES.map((s) => ({ value: s, label: humaniser(s) }))}
            />
          </div>
          <div>
            <Label htmlFor="desc-maintenance">Constat</Label>
            <Textarea
              id="desc-maintenance"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrire la dégradation constatée, la localisation précise et l'urgence."
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
