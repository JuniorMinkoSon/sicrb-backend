import { useEffect, useState, type FormEvent } from 'react'
import { Gavel, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Input,
  Label,
  LoadingState,
  Modal,
  PageHeader,
  ProgressBar,
  StatCard,
  Table,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  toneForStatut,
  useToast,
  type Column,
} from '../components/ui'
import { useDemarches, useDocuments, useEngagements, usePrestataires, useProjets } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { DemarcheEntreprise, Projet } from '../types/domain'
import { formatDate, formatFcfa, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

/** Soumissions déposées par l'entreprise (démonstration locale : aucun dossier officiel). */
interface SoumissionEntreprise {
  numero: string
  projetId: string
  projetCode: string
  objet: string
  montant: number
  delaiJours: number
  memoire: string
  pieces: string[]
  deposeeLe: string
  statut: 'Déposée' | 'En évaluation'
}

const CLE_SOUMISSIONS = 'sicrb.entrepreneur.soumissions'

function chargerSoumissions(): SoumissionEntreprise[] {
  try {
    const brut = localStorage.getItem(CLE_SOUMISSIONS)
    return brut ? (JSON.parse(brut) as SoumissionEntreprise[]) : []
  } catch {
    return []
  }
}

/** Portail prestataire : appels d'offres, marchés, projets, pièces et paiements (session de démonstration). */
export default function PortailEntrepreneurPage() {
  const prestataires = usePrestataires({ size: 1, statut: 'AGREE', sort: 'montantCumule:desc' })
  const prestataire = prestataires.data?.items[0]
  const projets = useProjets({ size: 50, prestataireId: prestataire?.id })
  const appelsOffres = useProjets({ size: 50, statut: 'PASSATION', sort: 'dateDebut:asc' })
  const engagements = useEngagements({ size: 50, prestataireId: prestataire?.id })
  const documents = useDocuments({ size: 10, sort: 'deposeLe:desc' })
  const t = useTableQuery({ size: 10, sort: 'deposeeLe:desc' })
  const demarches = useDemarches(t.query)
  const { notify } = useToast()

  const [soumissions, setSoumissions] = useState<SoumissionEntreprise[]>(chargerSoumissions)
  const [appelOuvert, setAppelOuvert] = useState<Projet | null>(null)
  const [montant, setMontant] = useState('')
  const [delai, setDelai] = useState('')
  const [memoire, setMemoire] = useState('')
  const [pieces, setPieces] = useState<string[]>([])
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(CLE_SOUMISSIONS, JSON.stringify(soumissions))
  }, [soumissions])

  const ouvrirSoumission = (p: Projet) => {
    setMontant('')
    setDelai('')
    setMemoire('')
    setPieces([])
    setErreur(null)
    setAppelOuvert(p)
  }

  const soumissionner = (e: FormEvent) => {
    e.preventDefault()
    if (!appelOuvert) return
    const montantNum = Number(montant)
    const delaiNum = Number(delai)
    if (!montantNum || montantNum <= 0 || !delaiNum || delaiNum <= 0 || !memoire.trim()) {
      setErreur('Renseignez un montant, un délai (en jours) et un mémoire technique.')
      return
    }
    const numero = `AO-2026-${String(101 + soumissions.length).padStart(5, '0')}`
    setSoumissions((s) => [
      {
        numero,
        projetId: appelOuvert.id,
        projetCode: appelOuvert.code,
        objet: appelOuvert.intitule,
        montant: montantNum,
        delaiJours: delaiNum,
        memoire: memoire.trim(),
        pieces,
        deposeeLe: new Date().toISOString(),
        statut: 'Déposée',
      },
      ...s,
    ])
    setAppelOuvert(null)
    notify(`Offre ${numero} déposée — elle sera examinée par la commission des marchés (démonstration).`)
  }

  const dejaSoumis = (projetId: string) => soumissions.some((s) => s.projetId === projetId)

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

          <Card
            className="mt-4"
            title="Appels d'offres ouverts"
            description="Projets en passation de marché : consultez le dossier et déposez votre offre"
          >
            {(appelsOffres.data?.items.length ?? 0) === 0 ? (
              <EmptyState title="Aucun appel d'offres ouvert" description="Aucun projet n'est actuellement en phase de passation." />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Projet</Th>
                    <Th>Secteur</Th>
                    <Th className="text-right">Budget prévisionnel</Th>
                    <Th>Démarrage prévu</Th>
                    <Th className="text-right">Action</Th>
                  </tr>
                </Thead>
                <tbody>
                  {appelsOffres.data?.items.map((p) => (
                    <Tr key={p.id}>
                      <Td>
                        <Link to={`/projets/${p.id}`} className="font-medium text-brand-800 hover:underline">
                          {p.code} — {p.intitule}
                        </Link>
                      </Td>
                      <Td>{humaniser(p.secteur)}</Td>
                      <Td className="text-right tabular-nums">{formatFcfaCourt(p.budgetPrevu)}</Td>
                      <Td>{formatDate(p.dateDebut)}</Td>
                      <Td className="text-right">
                        {dejaSoumis(p.id) ? (
                          <Badge tone="success">Offre déposée</Badge>
                        ) : (
                          <Button size="sm" icon={<Gavel className="size-4" />} onClick={() => ouvrirSoumission(p)}>
                            Soumissionner
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>

          {soumissions.length > 0 && (
            <Card className="mt-4" title="Mes soumissions" description="Offres déposées sur les appels d'offres (démonstration locale)">
              <Table>
                <Thead>
                  <tr>
                    <Th>N° soumission</Th>
                    <Th>Appel d'offres</Th>
                    <Th className="text-right">Montant proposé</Th>
                    <Th className="text-right">Délai</Th>
                    <Th>Pièces</Th>
                    <Th>Déposée le</Th>
                    <Th>Statut</Th>
                  </tr>
                </Thead>
                <tbody>
                  {soumissions.map((s) => (
                    <Tr key={s.numero}>
                      <Td className="font-medium text-brand-800">{s.numero}</Td>
                      <Td>
                        {s.projetCode} — {s.objet}
                      </Td>
                      <Td className="text-right tabular-nums">{formatFcfa(s.montant)}</Td>
                      <Td className="text-right tabular-nums">{s.delaiJours} j</Td>
                      <Td className="text-xs text-ink-600">{s.pieces.length ? s.pieces.join(', ') : '—'}</Td>
                      <Td>{formatDate(s.deposeeLe)}</Td>
                      <Td>
                        <Badge tone="info">{s.statut}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

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

      <Modal
        open={appelOuvert !== null}
        title={appelOuvert ? `Soumissionner — ${appelOuvert.code}` : 'Soumissionner'}
        description={appelOuvert?.intitule}
        onClose={() => setAppelOuvert(null)}
      >
        <form className="space-y-4" onSubmit={soumissionner} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ao-montant">Montant proposé (FCFA)</Label>
              <Input
                id="ao-montant"
                type="number"
                min="1"
                placeholder="250000000"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ao-delai">Délai d'exécution (jours)</Label>
              <Input id="ao-delai" type="number" min="1" placeholder="180" value={delai} onChange={(e) => setDelai(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="ao-memoire">Mémoire technique</Label>
            <Textarea
              id="ao-memoire"
              rows={4}
              placeholder="Méthodologie, moyens humains et matériels, planning d'exécution…"
              value={memoire}
              onChange={(e) => setMemoire(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ao-pieces">Pièces du dossier (attestations, références, offre financière…)</Label>
            <Input
              id="ao-pieces"
              type="file"
              multiple
              onChange={(e) => setPieces(Array.from(e.target.files ?? []).map((f) => f.name))}
            />
            {pieces.length > 0 && <p className="mt-1 text-xs text-ink-500">{pieces.length} pièce(s) : {pieces.join(', ')}</p>}
          </div>
          {erreur && <p className="text-xs font-medium text-red-700">{erreur}</p>}
          <p className="text-xs text-ink-500">
            Démonstration : la soumission est conservée dans ce navigateur, aucun dossier officiel n'est transmis à la commission des marchés.
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAppelOuvert(null)}>
              Annuler
            </Button>
            <Button type="submit" icon={<Send className="size-4" />}>
              Déposer mon offre
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
