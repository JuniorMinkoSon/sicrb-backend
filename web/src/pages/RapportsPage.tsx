import { Badge, Button, Card, EmptyState, LoadingState, PageHeader, StatCard, Table, Td, Th, Thead, Tr, useToast } from '../components/ui'
import { useDashboard, useRapports } from '../hooks/useApi'
import { formatDate, formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

export default function RapportsPage() {
  const { data: modeles = [], isLoading } = useRapports()
  const { data: synthese } = useDashboard()
  const { notify } = useToast()

  return (
    <>
      <PageHeader
        title="Rapports"
        subtitle="Modèles de restitution périodique alimentés par les données consolidées des modules opérationnels."
        crumbs={[{ label: 'Pilotage' }, { label: 'Rapports' }]}
      />

      {synthese && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Projets au portefeuille" value={formatNombre(synthese.nbProjets)} />
          <StatCard label="Budget consolidé" value={formatFcfaCourt(synthese.budgetPrevu)} />
          <StatCard label="Taux d'exécution financière" value={formatPourcent(synthese.tauxExecutionFinanciere)} />
          <StatCard label="Modèles disponibles" value={formatNombre(modeles.length)} />
        </div>
      )}

      <Card className="mt-4" title="Modèles de rapports" description="La génération sera branchée sur le service de reporting du backend Quarkus.">
        {isLoading ? (
          <LoadingState rows={3} />
        ) : modeles.length === 0 ? (
          <EmptyState title="Aucun modèle de rapport" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Rapport</Th>
                <Th>Périmètre</Th>
                <Th>Périodicité</Th>
                <Th>Dernière génération</Th>
                <Th>Formats</Th>
                <Th />
              </tr>
            </Thead>
            <tbody>
              {modeles.map((m) => (
                <Tr key={m.id}>
                  <Td className="font-medium text-ink-900">{m.intitule}</Td>
                  <Td>{m.perimetre}</Td>
                  <Td>{humaniser(m.periodicite)}</Td>
                  <Td>{m.dernierGenereLe ? formatDate(m.dernierGenereLe) : 'Jamais'}</Td>
                  <Td>
                    <span className="flex gap-1">
                      {m.formats.map((fmt) => (
                        <Badge key={fmt}>{fmt}</Badge>
                      ))}
                    </span>
                  </Td>
                  <Td>
                    <Button size="sm" variant="outline" onClick={() => notify(`La génération de « ${m.intitule} » nécessite le service de reporting Quarkus, non encore disponible.`, 'info')}>
                      Générer
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
