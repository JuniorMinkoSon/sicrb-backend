import { Link } from 'react-router-dom'
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  PageHeader,
  ProgressBar,
  StatCard,
  Table,
  Td,
  Th,
  Thead,
  Tr,
  toneForStatut,
  type Column,
} from '../components/ui'
import { useDemarches, useDocuments, useEngagements, usePrestataires, useProjets } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { DemarcheEntreprise } from '../types/domain'
import { formatDate, formatFcfa, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

/** Portail prestataire : marchés, projets, pièces et paiements du premier prestataire agréé (session de démonstration). */
export default function PortailEntrepreneurPage() {
  const prestataires = usePrestataires({ size: 1, statut: 'AGREE', sort: 'montantCumule:desc' })
  const prestataire = prestataires.data?.items[0]
  const projets = useProjets({ size: 50, prestataireId: prestataire?.id })
  const engagements = useEngagements({ size: 50, prestataireId: prestataire?.id })
  const documents = useDocuments({ size: 10, sort: 'deposeLe:desc' })
  const t = useTableQuery({ size: 10, sort: 'deposeeLe:desc' })
  const demarches = useDemarches(t.query)

  const colonnes: Column<DemarcheEntreprise>[] = [
    { key: 'reference', header: 'Référence', sortable: true, render: (d) => <span className="font-medium text-brand-800">{d.reference}</span> },
    { key: 'objet', header: 'Objet', sortable: true, render: (d) => d.objet },
    { key: 'entreprise', header: 'Entreprise', sortable: true, render: (d) => d.entreprise },
    {
      key: 'pieces',
      header: 'Pièces',
      className: 'text-right tabular-nums',
      render: (d) => `${d.piecesFournies} / ${d.piecesRequises}`,
    },
    { key: 'statut', header: 'Statut', sortable: true, render: (d) => <Badge tone={toneForStatut(d.statut)}>{humaniser(d.statut)}</Badge> },
    { key: 'deposeeLe', header: 'Déposée le', sortable: true, render: (d) => formatDate(d.deposeeLe) },
    { key: 'echeance', header: 'Échéance', sortable: true, render: (d) => formatDate(d.echeance) },
  ]

  if (prestataires.isLoading) return <LoadingState label="Chargement du portail prestataire…" />

  return (
    <>
      <PageHeader
        title="Portail entrepreneur"
        subtitle={prestataire ? `Espace de suivi de ${prestataire.raisonSociale}` : 'Espace de suivi des marchés attribués'}
        crumbs={[{ label: 'Portails' }, { label: 'Entrepreneur' }]}
        actions={prestataire && <Badge tone={toneForStatut(prestataire.statut)}>{humaniser(prestataire.statut)}</Badge>}
      />

      {!prestataire ? (
        <EmptyState title="Aucun prestataire agréé" description="Aucun compte prestataire n'est disponible dans le jeu de démonstration." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Marchés attribués" value={formatNombre(prestataire.marchesAttribues)} />
            <StatCard label="Projets suivis" value={formatNombre(projets.data?.total ?? 0)} />
            <StatCard label="Montant contractualisé" value={formatFcfaCourt(prestataire.montantCumule)} />
            <StatCard
              label="Paiements en attente"
              value={formatFcfaCourt((engagements.data?.items ?? []).filter((e) => e.statut !== 'PAYE').reduce((s, e) => s + e.montant, 0))}
              tone="warning"
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <Card title="Mes projets">
              {(projets.data?.items.length ?? 0) === 0 ? (
                <EmptyState title="Aucun projet attribué" />
              ) : (
                <Table>
                  <Thead>
                    <tr>
                      <Th>Projet</Th>
                      <Th>Statut</Th>
                      <Th>Avancement</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {projets.data?.items.map((p) => (
                      <Tr key={p.id}>
                        <Td>
                          <Link to={`/projets/${p.id}`} className="text-brand-800 hover:underline">
                            {p.code} — {p.intitule}
                          </Link>
                        </Td>
                        <Td>
                          <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge>
                        </Td>
                        <Td>
                          <ProgressBar value={p.avancementPhysique} />
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
            <Card title="Mes paiements">
              {(engagements.data?.items.length ?? 0) === 0 ? (
                <EmptyState title="Aucun engagement à mon nom" />
              ) : (
                <Table>
                  <Thead>
                    <tr>
                      <Th>Référence</Th>
                      <Th className="text-right">Montant</Th>
                      <Th>Statut</Th>
                      <Th>Payé le</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {engagements.data?.items.map((e) => (
                      <Tr key={e.id}>
                        <Td>{e.reference}</Td>
                        <Td className="text-right tabular-nums">{formatFcfa(e.montant)}</Td>
                        <Td>
                          <Badge tone={toneForStatut(e.statut)}>{humaniser(e.statut)}</Badge>
                        </Td>
                        <Td>{formatDate(e.datePaiement)}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </div>

          <Card className="mt-4" title="Mes démarches" description="Candidatures, agréments, avenants et réclamations">
            <DataTable
              columns={colonnes}
              page={demarches.data}
              isLoading={demarches.isLoading}
              error={demarches.error}
              onRetry={() => demarches.refetch()}
              sort={t.sort}
              onSort={t.setSort}
              onPage={t.setPage}
              onSize={t.setSize}
              rowKey={(d) => d.id}
            />
          </Card>

          <Card className="mt-4" title="Dernières pièces déposées">
            <ul className="divide-y divide-ink-100 text-sm">
              {(documents.data?.items ?? []).map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2 py-2">
                  <span>
                    {d.reference} — {d.titre}
                  </span>
                  <span className="text-xs text-ink-500">{formatDate(d.deposeLe)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </>
  )
}
