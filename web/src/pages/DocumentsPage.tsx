import { useState } from 'react'
import { FileText, Lock } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  DataTable,
  Drawer,
  FilterBar,
  PageHeader,
  Select,
  StatCard,
  Tooltip,
  type Column,
} from '../components/ui'
import { DOCUMENT_TYPES } from '../constants/referentiels'
import { useDocuments } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { GedDocument } from '../types/domain'
import { formatDate, formatNombre, humaniser } from '../utils/format'

/** GED : les pièces restent rattachées aux projets, marchés, missions et finances. */
export default function DocumentsPage() {
  const [params] = useSearchParams()
  const t = useTableQuery({ size: 10, sort: 'deposeLe:desc', q: params.get('q') ?? undefined })
  const { data, isLoading, error, refetch } = useDocuments(t.query)
  const tous = useDocuments({ size: 400 })
  const [fiche, setFiche] = useState<GedDocument | null>(null)

  const columns: Column<GedDocument>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (d) => <span className="font-medium text-brand-800">{d.reference}</span> },
    {
      key: 'titre',
      header: 'Titre',
      sortable: true,
      render: (d) => (
        <span className="flex items-center gap-2">
          <FileText className="size-4 text-ink-400" aria-hidden />
          <span className="block max-w-72 truncate">{d.titre}</span>
          {d.confidentiel && (
            <Tooltip label="Pièce confidentielle">
              <Lock className="size-3.5 text-amber-700" aria-hidden />
            </Tooltip>
          )}
        </span>
      ),
    },
    { key: 'type', header: 'Type', sortable: true, render: (d) => <Badge tone="neutral">{humaniser(d.type)}</Badge> },
    { key: 'version', header: 'Version', sortable: true, render: (d) => `v${d.version}` },
    { key: 'deposeLe', header: 'Déposé le', sortable: true, render: (d) => formatDate(d.deposeLe) },
    { key: 'deposePar', header: 'Déposé par', sortable: true, render: (d) => d.deposePar },
    {
      key: 'rattachement',
      header: 'Rattachement',
      render: (d) => (
        <span className="text-xs text-ink-600">
          {d.projetId ? `Projet ${d.projetId}` : d.programmeId ? `Programme ${d.programmeId}` : d.engagementId ? `Engagement ${d.engagementId}` : d.missionId ? `Mission ${d.missionId}` : 'Non rattaché'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (d) => (
        <Button size="sm" variant="outline" onClick={() => setFiche(d)}>
          Fiche
        </Button>
      ),
    },
  ]

  const items = tous.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Gestion électronique des documents"
        subtitle="Pièces du cycle d'investissement : délibérations, marchés, PV de réception, rapports de mission et factures."
        crumbs={[{ label: 'Documents' }, { label: 'GED' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pièces archivées" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Rattachées à un projet" value={formatNombre(items.filter((d) => d.projetId).length)} />
        <StatCard label="Pièces financières" value={formatNombre(items.filter((d) => d.engagementId || d.type === 'FACTURE').length)} />
        <StatCard label="Confidentielles" value={formatNombre(items.filter((d) => d.confidentiel).length)} tone="warning" />
      </div>

      <Card className="mt-4" title="Fonds documentaire">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Référence, titre, mot-clé…">
          <Select
            aria-label="Type"
            className="w-48"
            placeholder="Tous types"
            value={t.filtres.type ?? ''}
            onChange={(e) => t.setFiltre('type', e.target.value)}
            options={DOCUMENT_TYPES.map((s) => ({ value: s, label: humaniser(s) }))}
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
          rowKey={(d) => d.id}
        />
      </Card>

      <Drawer open={fiche !== null} title="Fiche documentaire" onClose={() => setFiche(null)}>
        {fiche && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">{fiche.reference}</p>
              <h3 className="text-base font-semibold text-ink-900">{fiche.titre}</h3>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Type</dt>
                <dd>{humaniser(fiche.type)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Version</dt>
                <dd>v{fiche.version}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Taille</dt>
                <dd>{formatNombre(fiche.taillekB)} kB</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Dépôt</dt>
                <dd>
                  {formatDate(fiche.deposeLe)} — {fiche.deposePar}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Confidentialité</dt>
                <dd>{fiche.confidentiel ? 'Diffusion restreinte' : 'Diffusion interne'}</dd>
              </div>
            </dl>
            <div>
              <p className="mb-1 text-xs font-medium text-ink-600">Mots-clés</p>
              <div className="flex flex-wrap gap-1">
                {fiche.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              {fiche.projetId && (
                <Link to={`/projets/${fiche.projetId}`} className="block text-brand-700 underline" onClick={() => setFiche(null)}>
                  Ouvrir le projet rattaché
                </Link>
              )}
              {fiche.programmeId && (
                <Link to={`/programmes/${fiche.programmeId}`} className="block text-brand-700 underline" onClick={() => setFiche(null)}>
                  Ouvrir le programme rattaché
                </Link>
              )}
            </div>
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              Le téléchargement des pièces sera disponible lorsque le service GED du backend Quarkus sera exposé.
            </p>
          </div>
        )}
      </Drawer>
    </>
  )
}
