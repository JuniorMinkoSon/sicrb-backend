import { Link } from 'react-router-dom'
import { BarreChart } from '../components/charts/Charts'
import { Card, ErrorState, LoadingState, PageHeader, StatCard, Table, Td, Th, Thead, Tr } from '../components/ui'
import { useDashboard, useTerritoires } from '../hooks/useApi'
import { formatFcfaCourt, formatNombre, formatPourcent } from '../utils/format'

/** Hiérarchie Région → Département → Sous-préfecture/Commune → Localités. */
export default function TerritoirePage() {
  const { data, isLoading, error, refetch } = useTerritoires({ size: 100, sort: 'type:asc' })
  const { data: synthese } = useDashboard()

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Chargement du référentiel territorial…" />

  const region = data.items.find((t) => t.type === 'REGION')
  const departements = data.items.filter((t) => t.type === 'DEPARTEMENT')
  const projetsPar = new Map((synthese?.parTerritoire ?? []).map((t) => [t.territoireId, t]))

  return (
    <>
      <PageHeader
        title="Territoire"
        subtitle="Découpage administratif de la région, population, patrimoine et opérations rattachées à chaque échelon."
        crumbs={[{ label: 'Territoire' }, { label: 'Découpage régional' }]}
      />

      {region && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Région" value={region.nom} hint={`Chef-lieu : ${region.chefLieu}`} />
          <StatCard label="Population" value={formatNombre(region.population)} hint={`${formatNombre(region.superficieKm2)} km²`} />
          <StatCard label="Localités" value={formatNombre(region.nbLocalites)} hint={`${departements.length} départements`} />
          <StatCard label="Accès à l'eau" value={formatPourcent(region.tauxAccesEau)} />
          <StatCard label="Électrification" value={formatPourcent(region.tauxElectrification)} />
        </div>
      )}

      <Card className="mt-4" title="Échelons territoriaux" description="Cliquez sur un échelon pour ouvrir sa fiche consolidée">
        <Table>
          <Thead>
            <tr>
              <Th>Échelon</Th>
              <Th>Niveau</Th>
              <Th>Chef-lieu</Th>
              <Th className="text-right">Population</Th>
              <Th className="text-right">Localités</Th>
              <Th className="text-right">Projets</Th>
              <Th className="text-right">Budget</Th>
              <Th />
            </tr>
          </Thead>
          <tbody>
            {data.items
              .filter((t) => t.type !== 'REGION')
              .map((t) => {
                const agg = projetsPar.get(t.id)
                const parent = data.items.find((p) => p.id === t.parentId)
                return (
                  <Tr key={t.id}>
                    <Td>
                      <Link to={`/territoire/${t.id}`} className="font-medium text-brand-800 hover:underline">
                        {t.nom}
                      </Link>
                      {parent && <span className="ml-2 text-xs text-ink-500">{parent.nom}</span>}
                    </Td>
                    <Td>{t.type === 'DEPARTEMENT' ? 'Département' : t.type === 'COMMUNE' ? 'Commune' : 'Sous-préfecture'}</Td>
                    <Td>{t.chefLieu}</Td>
                    <Td className="text-right tabular-nums">{formatNombre(t.population)}</Td>
                    <Td className="text-right tabular-nums">{formatNombre(t.nbLocalites)}</Td>
                    <Td className="text-right tabular-nums">{agg ? formatNombre(agg.projets) : '—'}</Td>
                    <Td className="text-right tabular-nums">{agg ? formatFcfaCourt(agg.budget) : '—'}</Td>
                    <Td>
                      <Link to={`/territoire/${t.id}`} className="text-xs font-medium text-brand-700 underline">
                        Fiche
                      </Link>
                    </Td>
                  </Tr>
                )
              })}
          </tbody>
        </Table>
      </Card>

      {synthese && (
        <Card className="mt-4" title="Investissement par territoire" description="Budget prévu consolidé par échelon opérationnel">
          <BarreChart money data={synthese.parTerritoire.map((t) => ({ nom: t.nom, budget: t.budget }))} xKey="nom" series={[{ key: 'budget', label: 'Budget prévu' }]} />
        </Card>
      )}
    </>
  )
}
