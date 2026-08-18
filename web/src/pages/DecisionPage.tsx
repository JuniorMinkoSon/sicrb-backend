import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingState,
  Modal,
  PageHeader,
  Select,
  StatCard,
  Table,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '../components/ui'
import { useAlertes, useArbitrer, useArbitrages } from '../hooks/useApi'
import type { Arbitrage } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, humaniser } from '../utils/format'

const niveauTone = { CRITIQUE: 'danger', VIGILANCE: 'warning', INFO: 'info' } as const

/** Aide à la décision : alertes consolidées et arbitrages budgétaires. */
export default function DecisionPage() {
  const { data: alertes = [], isLoading: chargementAlertes } = useAlertes()
  const { data: arbitrages = [], isLoading: chargementArbitrages } = useArbitrages()
  const arbitrer = useArbitrer()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [cible, setCible] = useState<Arbitrage | null>(null)
  const [option, setOption] = useState('')

  return (
    <>
      <PageHeader
        title="Aide à la décision"
        subtitle="Alertes consolidées de la chaîne d'investissement et arbitrages soumis à l'exécutif régional."
        crumbs={[{ label: 'Pilotage' }, { label: 'Aide à la décision' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Alertes actives" value={formatNombre(alertes.length)} />
        <StatCard label="Alertes critiques" value={formatNombre(alertes.filter((a) => a.niveau === 'CRITIQUE').length)} tone="critical" />
        <StatCard label="Arbitrages en attente" value={formatNombre(arbitrages.filter((a) => a.statut === 'A_ARBITRER').length)} tone="warning" />
        <StatCard label="Arbitrages rendus" value={formatNombre(arbitrages.filter((a) => a.statut === 'ARBITRE').length)} tone="positive" />
      </div>

      <Card className="mt-4" title="Alertes de la chaîne d'investissement" description="Retards, dépassements budgétaires, pièces manquantes, paiements bloqués, ouvrages critiques">
        {chargementAlertes ? (
          <LoadingState rows={3} />
        ) : alertes.length === 0 ? (
          <Alert level="success" title="Aucune alerte active" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Niveau</Th>
                <Th>Alerte</Th>
                <Th>Détail</Th>
                <Th>Détectée le</Th>
                <Th />
              </tr>
            </Thead>
            <tbody>
              {alertes.map((a) => (
                <Tr key={a.id}>
                  <Td>
                    <Badge tone={niveauTone[a.niveau]}>{a.niveau}</Badge>
                  </Td>
                  <Td className="font-medium text-ink-900">{a.titre}</Td>
                  <Td className="text-ink-600">{a.detail}</Td>
                  <Td>{formatDate(a.detecteLe)}</Td>
                  <Td>
                    <Button size="sm" variant="outline" onClick={() => navigate(a.moduleCible)}>
                      Traiter
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card className="mt-4" title="Arbitrages" description="Options chiffrées soumises à décision : coût, impact attendu et délai">
        {chargementArbitrages ? (
          <LoadingState rows={3} />
        ) : arbitrages.length === 0 ? (
          <EmptyState title="Aucun arbitrage en instance" />
        ) : (
          <ul className="space-y-3">
            {arbitrages.map((a) => (
              <li key={a.id} className="rounded-md border border-ink-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{a.intitule}</p>
                    <p className="mt-1 max-w-3xl text-xs text-ink-600">{a.contexte}</p>
                  </div>
                  <Badge tone={a.statut === 'ARBITRE' ? 'success' : 'warning'}>{a.statut === 'ARBITRE' ? 'Arbitré' : 'À arbitrer'}</Badge>
                </div>
                <Table className="mt-3">
                  <Thead>
                    <tr>
                      <Th>Option</Th>
                      <Th className="text-right">Coût</Th>
                      <Th className="text-right">Impact</Th>
                      <Th className="text-right">Délai</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {a.options.map((o) => (
                      <Tr key={o.libelle} className={a.optionRetenue === o.libelle ? 'bg-emerald-50/60' : undefined}>
                        <Td>
                          {o.libelle}
                          {a.optionRetenue === o.libelle && <Badge className="ml-2" tone="success">Retenue</Badge>}
                        </Td>
                        <Td className="text-right tabular-nums">{formatFcfaCourt(o.cout)}</Td>
                        <Td className="text-right tabular-nums">{o.impact} / 100</Td>
                        <Td className="text-right tabular-nums">{o.delaiMois} mois</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-ink-500">{a.decideLe ? `Décision rendue le ${formatDate(a.decideLe)}` : 'Décision non rendue'}</p>
                  {a.statut === 'A_ARBITRER' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setCible(a)
                        setOption(a.options[0]?.libelle ?? '')
                      }}
                    >
                      Rendre l'arbitrage
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        open={cible !== null}
        title="Rendre l'arbitrage"
        description={cible?.intitule}
        onClose={() => setCible(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCible(null)}>
              Annuler
            </Button>
            <Button
              disabled={arbitrer.isPending || !option}
              onClick={() => {
                if (!cible) return
                arbitrer.mutate(
                  { id: cible.id, option },
                  {
                    onSuccess: () => {
                      notify('Arbitrage enregistré et tracé dans le journal d’audit.')
                      setCible(null)
                    },
                    onError: (e) => notify(e instanceof Error ? e.message : 'Échec de l’arbitrage', 'error'),
                  },
                )
              }}
            >
              {arbitrer.isPending ? 'Enregistrement…' : 'Confirmer la décision'}
            </Button>
          </>
        }
      >
        <Select
          aria-label="Option retenue"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          options={(cible?.options ?? []).map((o) => ({ value: o.libelle, label: `${o.libelle} — ${formatFcfaCourt(o.cout)} · ${o.delaiMois} mois` }))}
        />
        <p className="mt-3 text-xs text-ink-500">
          L'arbitrage est idempotent : une décision déjà rendue n'est pas remplacée. {humaniser('DECISION')} tracée pour l'audit.
        </p>
      </Modal>
    </>
  )
}
