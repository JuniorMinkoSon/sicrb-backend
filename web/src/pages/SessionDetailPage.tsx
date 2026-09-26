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
  toneForStatut,
} from '../components/ui'
import { useSession } from '../hooks/useApi'
import type { PointOrdreDuJour } from '../types/domain'
import { formatDate, formatNombre, humaniser } from '../utils/format'

/**
 * L'écran d'une séance délibérante.
 *
 * Le registre des sessions disait combien d'actes une séance avait produits,
 * jamais lesquels : on savait qu'il y avait eu sept délibérations sans pouvoir
 * lire une seule décision. C'est cet écran qui manquait — l'ordre du jour, le
 * point en cours, les demandes de parole et le décompte des voix.
 *
 * Le point en cours n'est pas désigné par un champ : c'est celui que son statut
 * désigne. Deux sources auraient pu se contredire sur le point à l'écran.
 */

/** Le décompte des voix, quand il existe. */
function Resultat({ point, presents }: { point: PointOrdreDuJour; presents: number }) {
  if (point.pour === null || point.contre === null || point.abstention === null) {
    return <p className="text-sm text-ink-500">Le point n'a pas encore été mis aux voix.</p>
  }
  const exprimes = point.pour + point.contre
  const lignes = [
    { libelle: 'Pour', valeur: point.pour, classe: 'bg-emerald-500' },
    { libelle: 'Contre', valeur: point.contre, classe: 'bg-red-500' },
    { libelle: 'Abstention', valeur: point.abstention, classe: 'bg-ink-300' },
  ]
  return (
    <div className="space-y-2">
      {lignes.map((l) => (
        <div key={l.libelle}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-ink-700">{l.libelle}</span>
            <span className="font-medium tabular-nums text-ink-900">{l.valeur}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
            <div
              className={`h-full rounded-full ${l.classe}`}
              style={{ width: `${presents > 0 ? (l.valeur / presents) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-ink-500">
        {formatNombre(exprimes)} suffrages exprimés sur {formatNombre(presents)} présents
        {point.deliberation && <> · acte {point.deliberation}</>}
      </p>
    </div>
  )
}

export default function SessionDetailPage() {
  const { id } = useParams()
  const { data, isLoading, error, refetch } = useSession(id)

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Chargement de la séance…" />

  const { session, points, paroles, documents } = data
  const enCours = points.find((p) => p.statut === 'EN_DISCUSSION' || p.statut === 'VOTE_EN_COURS')
  const traites = points.filter((p) => ['ADOPTE', 'REJETE', 'REPORTE'].includes(p.statut)).length
  const quorumAtteint = session.presents >= session.quorum
  const attente = paroles.filter((p) => p.statut === 'EN_ATTENTE')
  const auMicro = paroles.find((p) => p.statut === 'ACCORDEE')

  return (
    <>
      <PageHeader
        title={session.intitule}
        subtitle={`${humaniser(session.type)} du ${formatDate(session.date)}`}
        crumbs={[
          { label: 'Gouvernance' },
          { label: 'Sessions & délibérations', to: '/gouvernance' },
          { label: session.intitule },
        ]}
        actions={<Badge tone={toneForStatut(session.statut)}>{humaniser(session.statut)}</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Quorum"
          value={`${session.presents} / ${session.quorum}`}
          hint={quorumAtteint ? 'Atteint, l’assemblée peut délibérer' : 'Non atteint, aucun vote valable'}
        />
        <StatCard label="Points à l’ordre du jour" value={formatNombre(points.length)} hint={`${traites} traité(s)`} />
        <StatCard
          label="Délibérations adoptées"
          value={formatNombre(points.filter((p) => p.statut === 'ADOPTE').length)}
        />
        <StatCard label="Pièces de séance" value={formatNombre(documents.length)} />
      </div>

      {!quorumAtteint && session.statut !== 'PLANIFIEE' && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Le quorum n'est pas atteint : {session.presents} présents pour {session.quorum} requis. Les votes
          enregistrés sont sans valeur délibérative.
        </div>
      )}

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Ordre du jour" className="xl:col-span-2">
          <div className="mb-4">
            <ProgressBar
              value={points.length > 0 ? (traites / points.length) * 100 : 0}
              label="Avancement de la séance"
            />
          </div>

          <ol className="space-y-2">
            {points.map((p) => {
              const actif = p.id === enCours?.id
              return (
                <li
                  key={p.id}
                  className={`rounded-lg border px-3 py-2.5 ${
                    actif ? 'border-brand-400 bg-brand-50/60 ring-1 ring-brand-200' : 'border-ink-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900">
                        <span className="tabular-nums text-ink-500">{p.ordre}.</span> {p.intitule}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        Rapporteur : {p.rapporteur} · {p.dureePrevueMin} min
                        {p.projetId && (
                          <>
                            {' · '}
                            <Link to={`/projets/${p.projetId}`} className="font-medium text-brand-700 underline">
                              voir le projet
                            </Link>
                          </>
                        )}
                        {p.programmeId && (
                          <>
                            {' · '}
                            <Link to={`/programmes/${p.programmeId}`} className="font-medium text-brand-700 underline">
                              voir le programme
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                    <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge>
                  </div>

                  {p.deliberation && (
                    <p className="mt-1.5 text-xs font-medium text-emerald-700">Délibération {p.deliberation}</p>
                  )}
                </li>
              )
            })}
          </ol>
          {points.length === 0 && <EmptyState title="Ordre du jour non arrêté" />}
        </Card>

        <div className="space-y-4">
          <Card
            title={enCours ? 'Point en cours' : 'Séance'}
            description={enCours ? humaniser(enCours.statut) : undefined}
          >
            {enCours ? (
              <>
                <p className="text-sm font-medium text-ink-900">{enCours.intitule}</p>
                <p className="mt-0.5 text-xs text-ink-500">Rapporteur : {enCours.rapporteur}</p>
                <div className="mt-3">
                  <Resultat point={enCours} presents={session.presents} />
                </div>
              </>
            ) : session.statut === 'PLANIFIEE' ? (
              <p className="text-sm text-ink-600">
                La séance est convoquée pour le {formatDate(session.date)}. L'ordre du jour est arrêté ; aucun point
                n'est encore ouvert.
              </p>
            ) : (
              <p className="text-sm text-ink-600">
                La séance est close. Les {formatNombre(points.length)} points ont été examinés et les actes adoptés
                figurent ci-contre.
              </p>
            )}
          </Card>

          <Card title="Demandes de parole" description={auMicro ? `Au micro : ${auMicro.demandeur}` : undefined}>
            {paroles.length === 0 ? (
              <p className="text-sm text-ink-500">
                Aucune demande de parole — la file ne s'alimente que pendant l'examen d'un point.
              </p>
            ) : (
              <ul className="space-y-2">
                {paroles.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-900">{d.demandeur}</span>
                      <span className="block text-xs text-ink-500">
                        {d.fonction} · demandée à {d.demandeeA}
                      </span>
                    </span>
                    <Badge
                      tone={d.statut === 'ACCORDEE' ? 'success' : d.statut === 'EN_ATTENTE' ? 'warning' : 'neutral'}
                    >
                      {humaniser(d.statut)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            {attente.length > 0 && (
              <p className="mt-3 text-xs text-ink-500">
                {attente.length} orateur(s) en attente d'être appelé(s) par la présidence.
              </p>
            )}
          </Card>

          <Card title="Pièces de séance">
            {documents.length === 0 ? (
              <p className="text-sm text-ink-500">Aucune pièce rattachée.</p>
            ) : (
              <ul className="space-y-1.5">
                {documents.map((d) => (
                  <li key={d.id} className="text-sm">
                    <span className="font-medium text-ink-900">{d.titre}</span>
                    <span className="block text-xs text-ink-500">
                      {d.reference} · {humaniser(d.type)} · v{d.version}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
