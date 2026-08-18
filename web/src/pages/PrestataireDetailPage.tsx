import { Link, useParams } from 'react-router-dom'
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
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
} from '../components/ui'
import { usePrestataire } from '../hooks/useApi'
import { formatDate, formatFcfa, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function PrestataireDetailPage() {
  const { id } = useParams()
  const { data, isLoading, error, refetch } = usePrestataire(id)

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Chargement de la fiche prestataire…" />

  const { prestataire, projets, engagements } = data
  const paye = engagements.filter((e) => e.statut === 'PAYE').reduce((s, e) => s + e.montant, 0)

  return (
    <>
      <PageHeader
        title={prestataire.raisonSociale}
        subtitle={`${prestataire.categorie} · ${prestataire.ville} · RCCM ${prestataire.rccm}`}
        crumbs={[{ label: 'Finances' }, { label: 'Prestataires', to: '/prestataires' }, { label: prestataire.raisonSociale }]}
        actions={<Badge tone={toneForStatut(prestataire.statut)}>{humaniser(prestataire.statut)}</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Marchés attribués" value={formatNombre(prestataire.marchesAttribues)} hint={`${projets.length} projets suivis`} />
        <StatCard label="Montant contractualisé" value={formatFcfaCourt(prestataire.montantCumule)} />
        <StatCard label="Paiements reçus" value={formatFcfaCourt(paye)} />
        <StatCard
          label="Note de performance"
          value={`${prestataire.notePerformance} / 100`}
          tone={prestataire.notePerformance >= 75 ? 'positive' : prestataire.notePerformance >= 50 ? 'warning' : 'critical'}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Contact">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-ink-500">Interlocuteur</dt>
              <dd>{prestataire.contact}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-ink-500">Téléphone</dt>
              <dd>{prestataire.telephone}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-ink-500">Courriel</dt>
              <dd>{prestataire.email}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Projets attribués" className="xl:col-span-2">
          {projets.length === 0 ? (
            <EmptyState title="Aucun projet attribué" />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Code</Th>
                  <Th>Intitulé</Th>
                  <Th>Statut</Th>
                  <Th>Avancement</Th>
                </tr>
              </Thead>
              <tbody>
                {projets.map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      <Link to={`/projets/${p.id}`} className="font-medium text-brand-800 hover:underline">
                        {p.code}
                      </Link>
                    </Td>
                    <Td>{p.intitule}</Td>
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
      </div>

      <Card className="mt-4" title="Engagements et paiements">
        {engagements.length === 0 ? (
          <EmptyState title="Aucun engagement enregistré" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Référence</Th>
                <Th>Objet</Th>
                <Th className="text-right">Montant</Th>
                <Th>Statut</Th>
                <Th>Payé le</Th>
              </tr>
            </Thead>
            <tbody>
              {engagements.map((e) => (
                <Tr key={e.id}>
                  <Td>{e.reference}</Td>
                  <Td>{e.objet}</Td>
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
    </>
  )
}
