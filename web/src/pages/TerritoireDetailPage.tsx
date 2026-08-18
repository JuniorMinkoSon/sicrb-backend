import { Link, useParams } from 'react-router-dom'
import { SigMap, type MapPoint } from '../components/map/SigMap'
import {
  Badge,
  Card,
  ErrorState,
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
} from '../components/ui'
import { useTerritoire } from '../hooks/useApi'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

export default function TerritoireDetailPage() {
  const { id } = useParams()
  const { data, isLoading, error, refetch } = useTerritoire(id)

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Chargement de la fiche territoriale…" />

  const { territoire, enfants, projets, infrastructures, requetes } = data
  const budget = projets.reduce((s, p) => s + p.budgetPrevu, 0)
  const paye = projets.reduce((s, p) => s + p.budgetPaye, 0)
  const points: MapPoint[] = [
    ...projets.map((p) => ({
      id: p.id,
      latitude: p.latitude,
      longitude: p.longitude,
      libelle: `${p.code} — ${p.intitule}`,
      sousTitre: humaniser(p.statut),
      montant: p.budgetPrevu,
      couche: 'PROJETS' as const,
      tone: p.risque === 'ELEVE' ? ('critique' as const) : ('ok' as const),
      href: `/projets/${p.id}`,
    })),
    ...infrastructures.map((i) => ({
      id: i.id,
      latitude: i.latitude,
      longitude: i.longitude,
      libelle: i.designation,
      sousTitre: `${i.type} · ${humaniser(i.etat)}`,
      couche: 'INFRASTRUCTURES' as const,
      tone: i.etat === 'HORS_SERVICE' ? ('critique' as const) : i.etat === 'DEGRADE' ? ('alerte' as const) : ('ok' as const),
    })),
  ]

  return (
    <>
      <PageHeader
        title={territoire.nom}
        subtitle={`${humaniser(territoire.type)} · chef-lieu ${territoire.chefLieu}`}
        crumbs={[{ label: 'Territoire', to: '/territory' }, { label: territoire.nom }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Population" value={formatNombre(territoire.population)} hint={`${formatNombre(territoire.superficieKm2)} km² · ${territoire.nbLocalites} localités`} />
        <StatCard label="Projets" value={formatNombre(projets.length)} hint={`${infrastructures.length} infrastructures`} />
        <StatCard label="Budget mobilisé" value={formatFcfaCourt(budget)} hint={`Payé : ${formatFcfaCourt(paye)}`} />
        <StatCard label="Requêtes citoyennes" value={formatNombre(requetes.length)} hint={`${requetes.filter((r) => r.statut === 'TRAITEE').length} traitées`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Localisation des opérations" className="xl:col-span-2" bodyClassName="p-0">
          <SigMap points={points} center={[territoire.latitude, territoire.longitude]} zoom={territoire.type === 'REGION' ? 8 : 10} height={380} />
        </Card>
        <div className="space-y-4">
          <Card title="Indicateurs de service" description="Situation de référence du territoire">
            <div className="space-y-3">
              <ProgressBar value={territoire.tauxAccesEau} label="Accès à l'eau potable" />
              <ProgressBar value={territoire.tauxElectrification} label="Taux d'électrification" />
              <ProgressBar value={budget > 0 ? (paye / budget) * 100 : 0} label="Exécution financière" />
            </div>
          </Card>
          <Card title="Échelons rattachés">
            {enfants.length === 0 ? (
              <EmptyState title="Aucun échelon inférieur" description="Ce territoire est au dernier niveau du découpage disponible." />
            ) : (
              <ul className="space-y-1 text-sm">
                {enfants.map((e) => (
                  <li key={e.id}>
                    <Link to={`/territoire/${e.id}`} className="text-brand-800 hover:underline">
                      {e.nom}
                    </Link>
                    <span className="ml-2 text-xs text-ink-500">{formatNombre(e.population)} hab.</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card className="mt-4" title="Projets du territoire" description="Opérations rattachées à cet échelon et à ses échelons inférieurs">
        {projets.length === 0 ? (
          <EmptyState title="Aucun projet rattaché" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Code</Th>
                <Th>Intitulé</Th>
                <Th>Secteur</Th>
                <Th>Statut</Th>
                <Th className="text-right">Budget</Th>
                <Th>Avancement</Th>
              </tr>
            </Thead>
            <tbody>
              {projets.slice(0, 25).map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <Link to={`/projets/${p.id}`} className="font-medium text-brand-800 hover:underline">
                      {p.code}
                    </Link>
                  </Td>
                  <Td>{p.intitule}</Td>
                  <Td>{humaniser(p.secteur)}</Td>
                  <Td>
                    <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge>
                  </Td>
                  <Td className="text-right tabular-nums">{formatFcfaCourt(p.budgetPrevu)}</Td>
                  <Td>
                    <ProgressBar value={p.avancementPhysique} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card className="mt-4" title="Requêtes citoyennes" description="Doléances remontées depuis le portail citoyen">
        {requetes.length === 0 ? (
          <EmptyState title="Aucune requête enregistrée" />
        ) : (
          <ul className="divide-y divide-ink-100 text-sm">
            {requetes.slice(0, 12).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span>
                  <span className="font-medium text-ink-900">{r.reference}</span> — {r.objet}
                  <span className="ml-2 text-xs text-ink-500">{formatDate(r.deposeeLe)}</span>
                </span>
                <Badge tone={toneForStatut(r.statut)}>{humaniser(r.statut)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
