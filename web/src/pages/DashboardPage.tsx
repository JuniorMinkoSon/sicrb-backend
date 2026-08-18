import { AlertTriangle, Banknote, Building2, HardHat, Sprout, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { BarreChart, AireChart, RepartitionChart } from '../components/charts/Charts'
import { SigMap, type MapPoint } from '../components/map/SigMap'
import { Alert, Badge, Card, ErrorState, LoadingState, PageHeader, ProgressBar, StatCard } from '../components/ui'
import { useAlertes, useDashboard, useProjetsGeo } from '../hooks/useApi'
import { formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

const niveauTone = { CRITIQUE: 'danger', VIGILANCE: 'warning', INFO: 'info' } as const

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard()
  const { data: alertes = [] } = useAlertes()
  const { data: projets = [] } = useProjetsGeo()
  const navigate = useNavigate()

  if (error) return <ErrorState error={error} onRetry={() => refetch()} />
  if (isLoading || !data) return <LoadingState label="Consolidation des données de pilotage…" rows={6} />

  const termines = data.parStatut.find((s) => s.statut === 'EXPLOITATION')?.projets ?? 0
  const points: MapPoint[] = projets.slice(0, 120).map((p) => ({
    id: p.id,
    latitude: p.latitude,
    longitude: p.longitude,
    libelle: `${p.code} — ${p.intitule}`,
    sousTitre: `${humaniser(p.secteur)} · ${humaniser(p.statut)}`,
    montant: p.budgetPrevu,
    couche: 'PROJETS',
    tone: p.risque === 'ELEVE' ? 'critique' : p.risque === 'MOYEN' ? 'alerte' : 'ok',
    href: `/projets/${p.id}`,
  }))

  return (
    <>
      <PageHeader
        title="Tableau de bord régional"
        subtitle="Où en sommes-nous, où investissons-nous, quels projets sont en difficulté et quel est l'impact territorial."
        crumbs={[{ label: 'Gouvernance' }, { label: 'Tableau de bord' }]}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Projets actifs" value={formatNombre(data.nbProjetsEnTravaux)} hint={`${data.nbProjets} projets au portefeuille`} icon={<Sprout className="size-4" />} />
        <StatCard label="Projets terminés" value={formatNombre(termines)} hint="Ouvrages en exploitation" tone="positive" icon={<HardHat className="size-4" />} />
        <StatCard label="Projets en difficulté" value={formatNombre(data.nbProjetsEnRetard)} hint="Risque élevé ou retard constaté" tone="critical" icon={<AlertTriangle className="size-4" />} />
        <StatCard label="Infrastructures" value={formatNombre(data.nbInfrastructures)} hint="Patrimoine suivi" icon={<Building2 className="size-4" />} />
        <StatCard label="Bénéficiaires" value={formatNombre(data.beneficiaires)} hint="Population couverte par les projets" icon={<Users className="size-4" />} />
        <StatCard label="Budget total" value={formatFcfaCourt(data.budgetPrevu)} hint={`${data.nbProgrammes} programmes`} icon={<Banknote className="size-4" />} />
        <StatCard label="Budget engagé" value={formatFcfaCourt(data.budgetEngage)} hint={formatPourcent((data.budgetEngage / data.budgetPrevu) * 100)} />
        <StatCard label="Budget exécuté" value={formatFcfaCourt(data.budgetPaye)} hint={formatPourcent(data.tauxExecutionFinanciere)} />
        <StatCard label="Exécution physique" value={formatPourcent(data.tauxExecutionPhysique)} hint="Avancement moyen des chantiers" />
        <StatCard label="Alertes critiques" value={formatNombre(alertes.filter((a) => a.niveau === 'CRITIQUE').length)} tone="critical" hint={`${alertes.length} alertes au total`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Budget par secteur" description="Dotations prévues par secteur d'intervention" className="xl:col-span-2">
          <BarreChart
            money
            data={data.parSecteur.map((s) => ({ secteur: humaniser(s.secteur), budget: s.budget }))}
            xKey="secteur"
            series={[{ key: 'budget', label: 'Budget prévu' }]}
          />
        </Card>
        <Card title="Projets par statut" description="Répartition du portefeuille">
          <RepartitionChart data={data.parStatut.map((s) => ({ statut: humaniser(s.statut), projets: s.projets }))} nameKey="statut" valueKey="projets" />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Projets par secteur" description="Nombre d'opérations par secteur">
          <BarreChart
            data={data.parSecteur.map((s) => ({ secteur: humaniser(s.secteur), projets: s.projets }))}
            xKey="secteur"
            series={[{ key: 'projets', label: 'Projets' }]}
          />
        </Card>
        <Card title="Projets par département / sous-préfecture" description="Ancrage territorial des opérations">
          <BarreChart
            data={data.parTerritoire.map((t) => ({ nom: t.nom, projets: t.projets }))}
            xKey="nom"
            series={[{ key: 'projets', label: 'Projets' }]}
          />
        </Card>
      </div>

      <Card
        className="mt-4"
        title="Évolution de l'exécution budgétaire"
        description="Engagements et paiements consolidés sur les douze derniers mois"
        actions={<ProgressBar value={data.tauxExecutionFinanciere} label="Taux d'exécution" />}
      >
        <AireChart
          money
          data={data.executionMensuelle}
          xKey="periode"
          series={[
            { key: 'engage', label: 'Engagé' },
            { key: 'paye', label: 'Payé' },
          ]}
        />
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          title="Carte stratégique"
          description="Projets, investissements et zones sous vigilance"
          className="xl:col-span-2"
          bodyClassName="p-0"
          actions={
            <Link to="/map" className="text-xs font-medium text-brand-700 underline">
              Ouvrir le SIG
            </Link>
          }
        >
          <SigMap points={points} height={420} />
        </Card>
        <Card title="Alertes de pilotage" description="Retards, dépassements, pièces manquantes, paiements bloqués">
          <ul className="space-y-2">
            {alertes.map((a) => (
              <li key={a.id}>
                <button onClick={() => navigate(a.moduleCible)} className="w-full rounded-md border border-ink-200 p-3 text-left hover:bg-ink-50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink-900">{a.titre}</p>
                    <Badge tone={niveauTone[a.niveau]}>{a.niveau}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-600">{a.detail}</p>
                </button>
              </li>
            ))}
          </ul>
          {alertes.length === 0 && <Alert level="success" title="Aucune alerte active" />}
        </Card>
      </div>
    </>
  )
}
