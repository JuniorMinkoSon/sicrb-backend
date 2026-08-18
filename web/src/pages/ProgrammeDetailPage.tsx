import { Link, useParams } from 'react-router-dom'
import { LigneChart } from '../components/charts/Charts'
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
import { useProgramme } from '../hooks/useApi'
import { formatDate, formatFcfa, formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

export default function ProgrammeDetailPage() {
  const { id } = useParams()
  const { data, isLoading, error, refetch } = useProgramme(id)

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Chargement du programme…" />

  const { programme, pai, projets, indicateurs, lignes } = data

  return (
    <>
      <PageHeader
        title={`${programme.code} — ${programme.intitule}`}
        subtitle={`${humaniser(programme.secteur)} · responsable : ${programme.responsable}${pai ? ` · ${pai.intitule}` : ''}`}
        crumbs={[{ label: 'Planification' }, { label: 'Programmes', to: '/programmes' }, { label: programme.code }]}
        actions={<Badge tone={toneForStatut(programme.statut)}>{humaniser(programme.statut)}</Badge>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Budget prévu" value={formatFcfaCourt(programme.budgetPrevu)} />
        <StatCard label="Engagé" value={formatFcfaCourt(programme.budgetEngage)} hint={formatPourcent((programme.budgetEngage / programme.budgetPrevu) * 100)} />
        <StatCard label="Payé" value={formatFcfaCourt(programme.budgetPaye)} hint={formatPourcent((programme.budgetPaye / programme.budgetPrevu) * 100)} />
        <StatCard label="Projets" value={formatNombre(projets.length)} />
        <StatCard label="Période" value={`${formatDate(programme.dateDebut)} → ${formatDate(programme.dateFin)}`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Avancement du programme">
          <ProgressBar value={programme.avancement} label="Avancement consolidé" />
          <p className="mt-3 text-xs text-ink-600">
            Avancement moyen des {projets.length} projets rattachés :{' '}
            {formatPourcent(projets.length ? projets.reduce((s, p) => s + p.avancementPhysique, 0) / projets.length : 0)}
          </p>
          {pai && (
            <p className="mt-2 text-xs text-ink-600">
              Rattaché au{' '}
              <Link to="/pai" className="text-brand-700 underline">
                {pai.intitule}
              </Link>{' '}
              ({humaniser(pai.statut)})
            </p>
          )}
        </Card>
        <Card title="Indicateurs du programme" className="xl:col-span-2">
          {indicateurs.length === 0 ? (
            <EmptyState title="Aucun indicateur rattaché" description="Ce programme ne dispose pas encore d'indicateur de résultat." />
          ) : (
            <LigneChart
              data={indicateurs[0].serie.map((s) => {
                const row: Record<string, unknown> = { periode: s.periode }
                indicateurs.forEach((ind) => {
                  row[ind.code] = ind.serie.find((x) => x.periode === s.periode)?.valeur ?? null
                })
                return row
              })}
              xKey="periode"
              series={indicateurs.map((i) => ({ key: i.code, label: `${i.libelle} (${i.unite})` }))}
            />
          )}
        </Card>
      </div>

      <Card className="mt-4" title="Projets du programme">
        {projets.length === 0 ? (
          <EmptyState title="Aucun projet rattaché" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Code</Th>
                <Th>Intitulé</Th>
                <Th>Statut</Th>
                <Th className="text-right">Budget</Th>
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

      <Card className="mt-4" title="Lignes budgétaires mobilisées">
        {lignes.length === 0 ? (
          <EmptyState title="Aucune ligne budgétaire rattachée" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Code</Th>
                <Th>Libellé</Th>
                <Th>Exercice</Th>
                <Th>Source</Th>
                <Th className="text-right">Dotation</Th>
                <Th className="text-right">Engagé</Th>
                <Th className="text-right">Payé</Th>
              </tr>
            </Thead>
            <tbody>
              {lignes.map((l) => (
                <Tr key={l.id}>
                  <Td>{l.code}</Td>
                  <Td>{l.libelle}</Td>
                  <Td>{l.exercice}</Td>
                  <Td>{humaniser(l.source)}</Td>
                  <Td className="text-right tabular-nums">{formatFcfa(l.dotation)}</Td>
                  <Td className="text-right tabular-nums">{formatFcfa(l.engage)}</Td>
                  <Td className="text-right tabular-nums">{formatFcfa(l.paye)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
