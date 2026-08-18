import { Link } from 'react-router-dom'
import { RepartitionChart } from '../components/charts/Charts'
import { Badge, Card, ErrorState, LoadingState, PageHeader, ProgressBar, StatCard, Table, Td, Th, Thead, Tr, toneForStatut } from '../components/ui'
import { usePais, useProgrammes } from '../hooks/useApi'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

/** Programme Annuel/Pluriannuel d'Investissement : axes, enveloppes, adoption. */
export default function PaiPage() {
  const { data: pais, isLoading, error, refetch } = usePais()
  const programmes = useProgrammes({ size: 200 })

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !pais) return <LoadingState label="Chargement des programmes d'investissement…" />

  return (
    <>
      <PageHeader
        title="Programme d'investissement (PAI)"
        subtitle="Cadre de planification : axes stratégiques, enveloppes prévisionnelles et rattachement des programmes."
        crumbs={[{ label: 'Planification' }, { label: 'PAI' }]}
      />

      <div className="space-y-6">
        {pais.map((pai) => {
          const rattaches = (programmes.data?.items ?? []).filter((p) => p.paiId === pai.id)
          const engage = rattaches.reduce((s, p) => s + p.budgetEngage, 0)
          return (
            <section key={pai.id}>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <StatCard label="Cadre" value={pai.intitule} hint={`${pai.anneeDebut} – ${pai.anneeFin}`} />
                <StatCard label="Statut" value={humaniser(pai.statut)} hint={pai.adopteLe ? `Adopté le ${formatDate(pai.adopteLe)}` : 'Non adopté'} />
                <StatCard label="Enveloppe prévue" value={formatFcfaCourt(pai.budgetPrevu)} />
                <StatCard label="Programmes rattachés" value={formatNombre(rattaches.length)} />
                <StatCard label="Engagements" value={formatFcfaCourt(engage)} />
              </div>

              <div className="mt-3 grid gap-4 xl:grid-cols-3">
                <Card title="Axes stratégiques" className="xl:col-span-2" description={pai.deliberation ? `Délibération ${pai.deliberation}` : undefined}>
                  <Table>
                    <Thead>
                      <tr>
                        <Th>Code</Th>
                        <Th>Axe</Th>
                        <Th className="text-right">Enveloppe</Th>
                        <Th className="text-right">Programmes</Th>
                        <Th>Part</Th>
                      </tr>
                    </Thead>
                    <tbody>
                      {pai.axes.map((axe) => (
                        <Tr key={axe.id}>
                          <Td>{axe.code}</Td>
                          <Td>{axe.libelle}</Td>
                          <Td className="text-right tabular-nums">{formatFcfaCourt(axe.budgetPrevu)}</Td>
                          <Td className="text-right tabular-nums">{axe.programmeIds.length}</Td>
                          <Td>
                            <ProgressBar value={(axe.budgetPrevu / pai.budgetPrevu) * 100} />
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
                <Card title="Répartition des enveloppes">
                  <RepartitionChart data={pai.axes.map((a) => ({ axe: a.code, budget: a.budgetPrevu }))} nameKey="axe" valueKey="budget" />
                </Card>
              </div>

              <Card className="mt-3" title="Programmes rattachés">
                <ul className="grid gap-2 md:grid-cols-2">
                  {rattaches.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-2 rounded-md border border-ink-200 p-3">
                      <Link to={`/programmes/${p.id}`} className="text-sm text-brand-800 hover:underline">
                        {p.code} — {p.intitule}
                      </Link>
                      <Badge tone={toneForStatut(p.statut)}>{humaniser(p.statut)}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          )
        })}
      </div>
    </>
  )
}
