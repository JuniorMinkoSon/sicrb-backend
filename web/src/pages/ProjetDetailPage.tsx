import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SigMap } from '../components/map/SigMap'
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
  Tabs,
  Td,
  Th,
  Thead,
  Timeline,
  Tr,
  toneForStatut,
  type TimelineItem,
} from '../components/ui'
import { useProjet } from '../hooks/useApi'
import { formatDate, formatFcfa, formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

const ONGLETS = [
  { id: 'synthese', label: 'Synthèse' },
  { id: 'jalons', label: 'Jalons' },
  { id: 'finances', label: 'Finances' },
  { id: 'controle', label: 'Contrôle' },
  { id: 'documents', label: 'Documents' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'patrimoine', label: 'Patrimoine' },
]

export default function ProjetDetailPage() {
  const { id } = useParams()
  const [onglet, setOnglet] = useState('synthese')
  const { data, isLoading, error, refetch } = useProjet(id)

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Chargement de la fiche projet…" />

  const { projet, programme, territoire, prestataire, controleur, jalons, engagements, documents, missions, infrastructures, workflows } = data
  const timeline: TimelineItem[] = jalons.map((j) => ({
    id: j.id,
    titre: j.libelle,
    date: formatDate(j.dateReelle ?? j.datePrevue),
    statut: j.statut,
    detail: j.commentaire ?? (j.dateReelle ? 'Réalisé' : `Échéance prévue : ${formatDate(j.datePrevue)}`),
  }))

  return (
    <>
      <PageHeader
        title={`${projet.code} — ${projet.intitule}`}
        subtitle={`${humaniser(projet.secteur)} · ${territoire?.nom ?? '—'} · maître d'ouvrage : ${projet.maitreOuvrage}`}
        crumbs={[
          { label: 'Exécution' },
          { label: 'Projets', to: '/projets' },
          { label: projet.code },
        ]}
        actions={<Badge tone={toneForStatut(projet.statut)}>{humaniser(projet.statut)}</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Budget prévu" value={formatFcfaCourt(projet.budgetPrevu)} />
        <StatCard label="Engagé" value={formatFcfaCourt(projet.budgetEngage)} hint={formatPourcent((projet.budgetEngage / projet.budgetPrevu) * 100)} />
        <StatCard label="Payé" value={formatFcfaCourt(projet.budgetPaye)} hint={formatPourcent(projet.avancementFinancier)} />
        <StatCard label="Bénéficiaires" value={formatNombre(projet.beneficiaires)} />
        <StatCard
          label="Risque"
          value={humaniser(projet.risque)}
          tone={projet.risque === 'ELEVE' ? 'critical' : projet.risque === 'MOYEN' ? 'warning' : 'positive'}
          hint={`Fin prévue : ${formatDate(projet.dateFinPrevue)}`}
        />
      </div>

      <div className="mt-4">
        <Tabs items={ONGLETS} active={onglet} onChange={setOnglet} />
      </div>

      {onglet === 'synthese' && (
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <Card title="Avancement" className="xl:col-span-1">
            <div className="space-y-3">
              <ProgressBar value={projet.avancementPhysique} label="Avancement physique" />
              <ProgressBar value={projet.avancementFinancier} label="Avancement financier" />
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Programme</dt>
                <dd>{programme ? <Link className="text-brand-800 hover:underline" to={`/programmes/${programme.id}`}>{programme.code}</Link> : '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Territoire</dt>
                <dd>{territoire ? <Link className="text-brand-800 hover:underline" to={`/territoire/${territoire.id}`}>{territoire.nom}</Link> : '—'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Prestataire</dt>
                <dd>{prestataire ? <Link className="text-brand-800 hover:underline" to={`/prestataires/${prestataire.id}`}>{prestataire.raisonSociale}</Link> : 'Non attribué'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Contrôleur</dt>
                <dd>{controleur?.nom ?? 'Non affecté'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Période</dt>
                <dd>
                  {formatDate(projet.dateDebut)} → {formatDate(projet.dateFinReelle ?? projet.dateFinPrevue)}
                </dd>
              </div>
            </dl>
          </Card>
          <Card title="Localisation" className="xl:col-span-2" bodyClassName="p-0">
            <SigMap
              height={360}
              zoom={11}
              center={[projet.latitude, projet.longitude]}
              points={[
                {
                  id: projet.id,
                  latitude: projet.latitude,
                  longitude: projet.longitude,
                  libelle: projet.intitule,
                  sousTitre: humaniser(projet.statut),
                  montant: projet.budgetPrevu,
                  couche: 'PROJETS',
                  tone: projet.risque === 'ELEVE' ? 'critique' : 'ok',
                },
                ...infrastructures.map((i) => ({
                  id: i.id,
                  latitude: i.latitude,
                  longitude: i.longitude,
                  libelle: i.designation,
                  sousTitre: humaniser(i.etat),
                  couche: 'INFRASTRUCTURES' as const,
                })),
              ]}
            />
          </Card>
        </div>
      )}

      {onglet === 'jalons' && (
        <Card className="mt-4" title="Jalons du projet" description="Historique et échéances contractuelles">
          {timeline.length === 0 ? <EmptyState title="Aucun jalon enregistré" /> : <Timeline items={timeline} />}
        </Card>
      )}

      {onglet === 'finances' && (
        <Card className="mt-4" title="Engagements financiers" description="Chaîne engagement → liquidation → paiement">
          {engagements.length === 0 ? (
            <EmptyState title="Aucun engagement rattaché" />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Référence</Th>
                  <Th>Objet</Th>
                  <Th className="text-right">Montant</Th>
                  <Th>Statut</Th>
                  <Th>Créé le</Th>
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
                    <Td>{formatDate(e.dateCreation)}</Td>
                    <Td>{e.datePaiement ? formatDate(e.datePaiement) : '—'}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      {onglet === 'controle' && (
        <Card className="mt-4" title="Missions de contrôle" description="Visites, conformité et réserves">
          {missions.length === 0 ? (
            <EmptyState title="Aucune mission de contrôle" />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Référence</Th>
                  <Th>Visite</Th>
                  <Th>Statut</Th>
                  <Th>Conformité</Th>
                  <Th>Réserves levées</Th>
                  <Th>Observations</Th>
                </tr>
              </Thead>
              <tbody>
                {missions.map((m) => (
                  <Tr key={m.id}>
                    <Td>{m.reference}</Td>
                    <Td>{formatDate(m.dateVisite)}</Td>
                    <Td>
                      <Badge tone={toneForStatut(m.statut)}>{humaniser(m.statut)}</Badge>
                    </Td>
                    <Td>
                      <ProgressBar value={m.conformite} />
                    </Td>
                    <Td>{m.reservesLevees ? 'Oui' : 'Non'}</Td>
                    <Td className="max-w-80 truncate">{m.observations}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      {onglet === 'documents' && (
        <Card className="mt-4" title="Pièces du dossier (GED)" description="Marchés, PV, factures et études rattachés au projet">
          {documents.length === 0 ? (
            <EmptyState title="Aucune pièce déposée" description="Le dossier ne comporte encore aucun document rattaché." />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Référence</Th>
                  <Th>Titre</Th>
                  <Th>Type</Th>
                  <Th>Version</Th>
                  <Th>Déposé le</Th>
                  <Th>Déposé par</Th>
                </tr>
              </Thead>
              <tbody>
                {documents.map((d) => (
                  <Tr key={d.id}>
                    <Td>{d.reference}</Td>
                    <Td>{d.titre}</Td>
                    <Td>{humaniser(d.type)}</Td>
                    <Td>v{d.version}</Td>
                    <Td>{formatDate(d.deposeLe)}</Td>
                    <Td>{d.deposePar}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      {onglet === 'workflows' && (
        <Card className="mt-4" title="Circuits de validation" description="Cycles métier ouverts sur ce projet">
          {workflows.length === 0 ? (
            <EmptyState title="Aucun circuit ouvert" />
          ) : (
            <ul className="space-y-2">
              {workflows.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-ink-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{humaniser(w.type)}</p>
                    <p className="text-xs text-ink-500">
                      {w.reference} · ouvert le {formatDate(w.ouvertLe)} · {w.etapes.filter((e) => e.statut === 'VALIDE').length}/{w.etapes.length} étapes validées
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={toneForStatut(w.statut)}>{humaniser(w.statut)}</Badge>
                    <Link to={`/workflows/${w.id}`} className="text-xs font-medium text-brand-700 underline">
                      Ouvrir
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {onglet === 'patrimoine' && (
        <Card className="mt-4" title="Ouvrages livrés" description="Infrastructures issues du projet et versées au patrimoine régional">
          {infrastructures.length === 0 ? (
            <EmptyState title="Aucun ouvrage réceptionné" />
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Code</Th>
                  <Th>Désignation</Th>
                  <Th>Type</Th>
                  <Th>État</Th>
                  <Th>Mise en service</Th>
                  <Th className="text-right">Valeur</Th>
                </tr>
              </Thead>
              <tbody>
                {infrastructures.map((i) => (
                  <Tr key={i.id}>
                    <Td>{i.code}</Td>
                    <Td>{i.designation}</Td>
                    <Td>{i.type}</Td>
                    <Td>
                      <Badge tone={toneForStatut(i.etat)}>{humaniser(i.etat)}</Badge>
                    </Td>
                    <Td>{formatDate(i.miseEnServiceLe)}</Td>
                    <Td className="text-right tabular-nums">{formatFcfaCourt(i.valeurPatrimoniale)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </>
  )
}
