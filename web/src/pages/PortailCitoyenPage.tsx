import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  DataTable,
  FilterBar,
  Input,
  Label,
  Modal,
  PageHeader,
  Select,
  StatCard,
  toneForStatut,
  useToast,
  type Column,
} from '../components/ui'
import { CATEGORIES_REQUETE, REQUETE_STATUTS } from '../constants/referentiels'
import { useDeposerRequete, useRequetes, useTerritoires } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { RequeteCitoyenne } from '../types/domain'
import { formatDate, formatNombre, humaniser } from '../utils/format'

/** Portail citoyen : dépôt et suivi des requêtes territoriales. */
export default function PortailCitoyenPage() {
  const t = useTableQuery({ size: 10, sort: 'deposeeLe:desc' })
  const { data, isLoading, error, refetch } = useRequetes(t.query)
  const toutes = useRequetes({ size: 300 })
  const territoires = useTerritoires({ size: 100 })
  const deposer = useDeposerRequete()
  const { notify } = useToast()
  const [ouvert, setOuvert] = useState(false)
  const [objet, setObjet] = useState('')
  const [categorie, setCategorie] = useState(CATEGORIES_REQUETE[0])
  const [territoireId, setTerritoireId] = useState('')

  const communes = (territoires.data?.items ?? []).filter((x) => x.type !== 'REGION')
  const nomTerritoire = (id: string) => territoires.data?.items.find((x) => x.id === id)?.nom ?? id

  const colonnes: Column<RequeteCitoyenne>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (r) => <span className="font-medium text-brand-800">{r.reference}</span> },
    { key: 'objet', header: 'Objet', sortable: true, render: (r) => <span className="block max-w-80 truncate">{r.objet}</span> },
    { key: 'categorie', header: 'Catégorie', sortable: true, render: (r) => humaniser(r.categorie) },
    { key: 'territoireId', header: 'Localité', render: (r) => nomTerritoire(r.territoireId) },
    { key: 'statut', header: 'Statut', sortable: true, render: (r) => <Badge tone={toneForStatut(r.statut)}>{humaniser(r.statut)}</Badge> },
    { key: 'canal', header: 'Canal', sortable: true, render: (r) => humaniser(r.canal) },
    { key: 'deposeeLe', header: 'Déposée le', sortable: true, render: (r) => formatDate(r.deposeeLe) },
    { key: 'traiteeLe', header: 'Traitée le', sortable: true, render: (r) => formatDate(r.traiteeLe) },
  ]

  const items = toutes.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Portail citoyen"
        subtitle="Dépôt des requêtes territoriales et suivi de leur instruction par les services régionaux."
        crumbs={[{ label: 'Portails' }, { label: 'Citoyen' }]}
        actions={
          <Button icon={<MessageSquarePlus className="size-4" />} onClick={() => setOuvert(true)}>
            Déposer une requête
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Requêtes déposées" value={formatNombre(toutes.data?.total ?? 0)} />
        <StatCard label="En instruction" value={formatNombre(items.filter((r) => r.statut === 'EN_INSTRUCTION').length)} tone="warning" />
        <StatCard label="Traitées" value={formatNombre(items.filter((r) => r.statut === 'TRAITEE').length)} tone="positive" />
        <StatCard label="Localités concernées" value={formatNombre(new Set(items.map((r) => r.territoireId)).size)} />
      </div>

      <Card className="mt-4" title="Suivi des requêtes">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Référence, objet…">
          <Select
            aria-label="Statut"
            className="w-44"
            placeholder="Tous statuts"
            value={t.filtres.statut ?? ''}
            onChange={(e) => t.setFiltre('statut', e.target.value)}
            options={REQUETE_STATUTS.map((s) => ({ value: s, label: humaniser(s) }))}
          />
          <Select
            aria-label="Catégorie"
            className="w-44"
            placeholder="Toutes catégories"
            value={t.filtres.categorie ?? ''}
            onChange={(e) => t.setFiltre('categorie', e.target.value)}
            options={CATEGORIES_REQUETE.map((c) => ({ value: c, label: humaniser(c) }))}
          />
        </FilterBar>
        <DataTable
          columns={colonnes}
          page={data}
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
          sort={t.sort}
          onSort={t.setSort}
          onPage={t.setPage}
          onSize={t.setSize}
          rowKey={(r) => r.id}
        />
      </Card>

      <Modal
        open={ouvert}
        title="Déposer une requête"
        description="La requête est transmise au service territorial compétent."
        onClose={() => setOuvert(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOuvert(false)}>
              Annuler
            </Button>
            <Button
              disabled={deposer.isPending || objet.trim().length < 5 || !territoireId}
              onClick={() =>
                deposer.mutate(
                  { objet, categorie, territoireId },
                  {
                    onSuccess: (r) => {
                      notify(`Requête ${r.reference} enregistrée.`)
                      setOuvert(false)
                      setObjet('')
                    },
                    onError: (e) => notify(e instanceof Error ? e.message : 'Échec du dépôt', 'error'),
                  },
                )
              }
            >
              {deposer.isPending ? 'Envoi…' : 'Déposer'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label htmlFor="objet">Objet de la requête</Label>
            <Input id="objet" value={objet} onChange={(e) => setObjet(e.target.value)} placeholder="Ex. : réhabilitation du forage du quartier Nord" />
          </div>
          <div>
            <Label htmlFor="categorie">Catégorie</Label>
            <Select id="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} options={CATEGORIES_REQUETE.map((c) => ({ value: c, label: humaniser(c) }))} />
          </div>
          <div>
            <Label htmlFor="territoire">Localité concernée</Label>
            <Select
              id="territoire"
              value={territoireId}
              placeholder="Sélectionner une localité"
              onChange={(e) => setTerritoireId(e.target.value)}
              options={communes.map((c) => ({ value: c.id, label: c.nom }))}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
