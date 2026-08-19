import { useMemo, useState } from 'react'
import { Building2, CalendarDays, Camera, FileText, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BarreChart } from '../components/charts/Charts'
import { SigMap } from '../components/map/SigMap'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  FilterBar,
  LoadingState,
  PageHeader,
  ProgressBar,
  Select,
  StatCard,
  Tabs,
} from '../components/ui'
import {
  descriptionPublique,
  LEGENDE_CARTE,
  publicationEntrepriseAutorisee,
  STATUTS_PUBLICS,
  type GroupePublic,
} from '../constants/portailPublic'
import { SECTEURS } from '../constants/referentiels'
import { useDashboard, usePrestataires, useProjets, useProjetsGeo, useRapports, useTerritoires } from '../hooks/useApi'
import type { Projet } from '../types/domain'
import { formatDate, formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

const DEGRADES: Record<string, string> = {
  EAU: 'from-sky-500 to-cyan-700',
  EDUCATION: 'from-indigo-500 to-blue-700',
  SANTE: 'from-rose-500 to-red-700',
  ROUTES: 'from-slate-500 to-ink-700',
  AGRICULTURE: 'from-lime-500 to-emerald-700',
  ENERGIE: 'from-amber-500 to-orange-700',
  JEUNESSE: 'from-fuchsia-500 to-purple-700',
  ASSAINISSEMENT: 'from-teal-500 to-emerald-800',
}

const ONGLETS: { id: GroupePublic | 'TOUS'; label: string }[] = [
  { id: 'TOUS', label: 'Tous les projets' },
  { id: 'REALISES', label: 'Projets réalisés' },
  { id: 'EN_COURS', label: 'Projets en cours' },
  { id: 'PROGRAMMES', label: 'Projets programmés' },
]

function FicheProjetPublique({
  projet,
  territoire,
  entreprise,
}: {
  projet: Projet
  territoire?: string
  entreprise?: string
}) {
  const statut = STATUTS_PUBLICS[projet.statut]
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`relative grid h-32 place-items-center bg-gradient-to-br ${DEGRADES[projet.secteur] ?? 'from-brand-500 to-brand-800'}`}>
        <Camera className="size-8 text-white/70" aria-hidden />
        <span className="absolute bottom-2 left-3 rounded bg-black/35 px-1.5 py-0.5 text-[10px] text-white">
          Photo du chantier — démonstration
        </span>
        <span
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: statut.couleur }}
        >
          {statut.libelle}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-ink-900">{projet.intitule}</h3>
        <p className="line-clamp-2 text-xs text-ink-600">{descriptionPublique(projet)}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-600">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 text-ink-400" aria-hidden />
            {territoire ?? 'Région de la Bagoué'}
          </span>
          <Badge tone="info">{humaniser(projet.secteur)}</Badge>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5 text-ink-400" aria-hidden />
            {formatNombre(projet.beneficiaires)} bénéficiaires
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-ink-600">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5 text-ink-400" aria-hidden />
            {formatDate(projet.dateDebut)} → {formatDate(projet.dateFinReelle ?? projet.dateFinPrevue)}
          </span>
          <span className="font-semibold tabular-nums text-ink-900">{formatFcfaCourt(projet.budgetPrevu)}</span>
        </div>
        <ProgressBar value={projet.avancementPhysique} label="Avancement" />
        {publicationEntrepriseAutorisee(projet.statut) && entreprise && (
          <p className="inline-flex items-center gap-1 text-xs text-ink-600">
            <Building2 className="size-3.5 text-ink-400" aria-hidden />
            Entreprise responsable : <span className="font-medium text-ink-800">{entreprise}</span>
          </p>
        )}
      </div>
    </article>
  )
}

/** Portail public : consultation citoyenne des projets, carte interactive, transparence et rapports. */
export default function PortailPublicPage() {
  const [onglet, setOnglet] = useState<GroupePublic | 'TOUS'>('TOUS')
  const [q, setQ] = useState('')
  const [secteur, setSecteur] = useState('')
  const projets = useProjets({ size: 300 })
  const geo = useProjetsGeo({ size: 400 })
  const territoires = useTerritoires({ size: 100 })
  const prestataires = usePrestataires({ size: 100 })
  const rapports = useRapports()
  const { data: synthese, isLoading } = useDashboard()

  const nomTerritoire = (id: string) => territoires.data?.items.find((x) => x.id === id)?.nom
  const nomEntreprise = (id: string | null) => (id ? prestataires.data?.items.find((x) => x.id === id)?.raisonSociale : undefined)

  const tous = useMemo(() => projets.data?.items ?? [], [projets.data])
  const compte = (g: GroupePublic) => tous.filter((p) => STATUTS_PUBLICS[p.statut].groupe === g).length
  const visibles = tous.filter(
    (p) =>
      (onglet === 'TOUS' || STATUTS_PUBLICS[p.statut].groupe === onglet) &&
      (!secteur || p.secteur === secteur) &&
      (!q.trim() || p.intitule.toLowerCase().includes(q.trim().toLowerCase())),
  )

  if (isLoading || !synthese) return <LoadingState label="Chargement des données publiques…" />

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
      <PageHeader
        title="Portail public — investissement régional"
        subtitle="Information ouverte aux citoyens sur les projets financés par le Conseil Régional de la Bagoué : localisation, coûts annoncés, avancement et calendrier."
        crumbs={[{ label: 'Portails' }, { label: 'Public' }]}
        actions={
          <Button variant="secondary" onClick={() => document.getElementById('rapports-publics')?.scrollIntoView({ behavior: 'smooth' })}>
            Rapports publics
          </Button>
        }
      />

      <Alert level="info" title="Données de démonstration">
        Les montants, photos et localisations présentés ici proviennent d'un jeu de données de démonstration ; ils n'ont aucune valeur officielle.
      </Alert>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Projets financés" value={formatNombre(synthese.nbProjets)} />
        <StatCard label="Investissement programmé" value={formatFcfaCourt(synthese.budgetPrevu)} />
        <StatCard label="Investissement exécuté" value={formatFcfaCourt(synthese.budgetPaye)} hint={formatPourcent(synthese.tauxExecutionFinanciere)} />
        <StatCard label="Ouvrages livrés" value={formatNombre(synthese.nbInfrastructures)} />
        <StatCard label="Population bénéficiaire" value={formatNombre(synthese.beneficiaires)} />
      </div>

      <Card className="mt-4" title="Carte interactive des projets" description="Projet → localisation → statut → montant → avancement">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
          {LEGENDE_CARTE.map((l) => (
            <span key={l.statut} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: l.couleur }} aria-hidden />
              {l.libelle}
            </span>
          ))}
        </div>
        <SigMap
          height={380}
          points={(geo.data ?? []).map((p) => ({
            id: p.id,
            latitude: p.latitude,
            longitude: p.longitude,
            libelle: p.intitule,
            sousTitre: `${STATUTS_PUBLICS[p.statut].libelle} · ${humaniser(p.secteur)} · Avancement ${Math.round(p.avancementPhysique)} %`,
            montant: p.budgetPrevu,
            couche: 'PROJETS' as const,
            couleur: STATUTS_PUBLICS[p.statut].couleur,
          }))}
        />
      </Card>

      <Card
        className="mt-4"
        title="Transparence — consultation des projets"
        description="Chaque fiche présente la localisation, le secteur, le coût annoncé, l'état d'avancement et le calendrier."
      >
        <Tabs
          items={ONGLETS.map((o) => ({ id: o.id, label: o.label, count: o.id === 'TOUS' ? tous.length : compte(o.id) }))}
          active={onglet}
          onChange={(id) => setOnglet(id as GroupePublic | 'TOUS')}
        />
        <div className="mt-3">
          <FilterBar q={q} onQ={setQ} onReset={() => {
              setQ('')
              setSecteur('')
            }} placeholder="Rechercher un projet, une localité…">
            <Select
              aria-label="Secteur"
              className="w-44"
              placeholder="Tous secteurs"
              value={secteur}
              onChange={(e) => setSecteur(e.target.value)}
              options={SECTEURS.map((s) => ({ value: s, label: humaniser(s) }))}
            />
          </FilterBar>
        </div>
        {visibles.length === 0 ? (
          <EmptyState title="Aucun projet ne correspond à ces critères." />
        ) : (
          <div className="mt-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibles.slice(0, 12).map((p) => (
              <FicheProjetPublique key={p.id} projet={p} territoire={nomTerritoire(p.territoireId)} entreprise={nomEntreprise(p.prestataireId)} />
            ))}
          </div>
        )}
        {visibles.length > 12 && (
          <p className="mt-3 text-xs text-ink-500">{visibles.length - 12} autres projets correspondent à votre recherche : affinez les filtres.</p>
        )}
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Statistiques — investissement par secteur">
          <BarreChart money data={synthese.parSecteur} xKey="secteur" series={[{ key: 'budget', label: 'Investissement' }]} />
        </Card>
        <div id="rapports-publics">
        <Card title="Rapports publics" description="Documents de redevabilité mis à disposition des citoyens.">
          <ul className="divide-y divide-ink-100">
            {(rapports.data ?? []).slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5">
                <FileText className="size-4 shrink-0 text-brand-700" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{r.intitule}</p>
                  <p className="text-xs text-ink-500">
                    {r.perimetre} · {humaniser(r.periodicite)} · Dernière publication : {formatDate(r.dernierGenereLe)}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-ink-500">{r.formats.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </Card>
        </div>
      </div>

      <Card className="mt-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold text-ink-900">Un besoin dans votre localité ? Un problème sur un chantier ?</h3>
            <p className="text-xs text-ink-600">Proposez un projet, suivez votre demande ou déposez une réclamation depuis le portail citoyen.</p>
          </div>
          <Link
            to="/portail/citoyen"
            className="inline-flex h-9.5 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-700"
          >
            Accéder au portail citoyen
          </Link>
        </div>
      </Card>
    </div>
  )
}
