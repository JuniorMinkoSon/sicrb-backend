import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  ErrorState,
  Label,
  LoadingState,
  Modal,
  PageHeader,
  ProgressBar,
  StatCard,
  Textarea,
  Timeline,
  toneForStatut,
  useToast,
  type TimelineItem,
} from '../components/ui'
import { useTraiterEtape, useWorkflow } from '../hooks/useApi'
import { formatDate, formatDateHeure, humaniser } from '../utils/format'

export default function WorkflowDetailPage() {
  const { id } = useParams()
  const { data: wf, isLoading, error, refetch } = useWorkflow(id)
  const traiter = useTraiterEtape()
  const { notify } = useToast()
  const [decision, setDecision] = useState<'VALIDE' | 'REJETE' | null>(null)
  const [commentaire, setCommentaire] = useState('')

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !wf) return <LoadingState label="Chargement du circuit…" />

  const courante = wf.etapes.find((e) => e.statut === 'EN_COURS')
  const validees = wf.etapes.filter((e) => e.statut === 'VALIDE').length
  const timeline: TimelineItem[] = wf.etapes.map((e) => ({
    id: e.id,
    titre: `${e.ordre}. ${e.libelle}`,
    date: e.traiteLe ? formatDateHeure(e.traiteLe) : null,
    statut: e.statut,
    detail: (
      <>
        <span className="block">Responsable : {e.responsable}</span>
        {e.commentaire && <span className="block italic">« {e.commentaire} »</span>}
        {e.statut === 'EN_COURS' && <span className="block text-amber-700">Étape en attente de décision</span>}
      </>
    ),
  }))

  return (
    <>
      <PageHeader
        title={`${humaniser(wf.type)} — ${wf.reference}`}
        subtitle={wf.objet}
        crumbs={[{ label: 'Contrôle' }, { label: 'Workflows', to: '/workflows' }, { label: wf.reference }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={toneForStatut(wf.statut)}>{humaniser(wf.statut)}</Badge>
            {wf.projetId && (
              <Link to={`/projets/${wf.projetId}`} className="text-xs font-medium text-brand-700 underline">
                Voir le projet
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Étapes validées" value={`${validees} / ${wf.etapes.length}`} />
        <StatCard label="Ouvert le" value={formatDate(wf.ouvertLe)} />
        <StatCard label="Clôturé le" value={wf.clotureLe ? formatDate(wf.clotureLe) : '—'} />
        <StatCard label="Étape en cours" value={courante?.libelle ?? 'Aucune'} hint={courante?.responsable} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Déroulé du circuit" className="xl:col-span-2">
          <div className="mb-4">
            <ProgressBar value={(validees / wf.etapes.length) * 100} label="Progression du circuit" />
          </div>
          <Timeline items={timeline} />
        </Card>
        <Card title="Décision" description="Traitement de l'étape en cours">
          {wf.statut !== 'EN_COURS' ? (
            <Alert level={wf.statut === 'VALIDE' ? 'success' : 'danger'} title={`Circuit ${humaniser(wf.statut).toLowerCase()}`}>
              Ce circuit est clôturé le {formatDate(wf.clotureLe)} : aucune décision supplémentaire n'est possible.
            </Alert>
          ) : !courante ? (
            <Alert level="warning" title="Aucune étape active">
              Le circuit est ouvert mais aucune étape n'est en attente de décision.
            </Alert>
          ) : (
            <>
              <p className="text-sm text-ink-700">
                Étape <strong>{courante.libelle}</strong>, à traiter par <strong>{courante.responsable}</strong>.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => setDecision('VALIDE')}>Valider l'étape</Button>
                <Button variant="danger" onClick={() => setDecision('REJETE')}>
                  Rejeter
                </Button>
              </div>
              <p className="mt-3 text-xs text-ink-500">
                Le rejet clôture le circuit ; une validation fait passer le dossier à l'étape suivante. L'action est idempotente : une étape déjà
                tranchée n'est pas rejouée.
              </p>
            </>
          )}
        </Card>
      </div>

      <Modal
        open={decision !== null}
        title={decision === 'REJETE' ? 'Rejeter l’étape' : 'Valider l’étape'}
        description={courante ? `${wf.reference} · ${courante.libelle}` : undefined}
        onClose={() => setDecision(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDecision(null)}>
              Annuler
            </Button>
            <Button
              variant={decision === 'REJETE' ? 'danger' : 'primary'}
              disabled={traiter.isPending || (decision === 'REJETE' && commentaire.trim().length < 5)}
              onClick={() => {
                if (!courante || !decision) return
                traiter.mutate(
                  { workflowId: wf.id, etapeId: courante.id, decision, commentaire: commentaire || undefined },
                  {
                    onSuccess: () => {
                      notify(decision === 'VALIDE' ? 'Étape validée, le dossier passe à l’étape suivante.' : 'Étape rejetée, circuit clôturé.', decision === 'VALIDE' ? 'success' : 'info')
                      setDecision(null)
                      setCommentaire('')
                    },
                    onError: (e) => notify(e instanceof Error ? e.message : 'Échec du traitement', 'error'),
                  },
                )
              }}
            >
              {traiter.isPending ? 'Traitement…' : 'Confirmer'}
            </Button>
          </>
        }
      >
        <Label htmlFor="commentaire">{decision === 'REJETE' ? 'Motivation (obligatoire)' : 'Motivation (facultative)'}</Label>
        <Textarea id="commentaire" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Observation portée au dossier." />
      </Modal>
    </>
  )
}
