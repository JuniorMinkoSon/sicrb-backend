import {
  ArrowRight,
  Banknote,
  Briefcase,
  ClipboardCheck,
  Database,
  FileText,
  Gauge,
  Landmark,
  Map,
  MapPin,
  MessageSquarePlus,
  Search,
  ShieldCheck,
  Sprout,
  Users,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, IconeSecteur, StatCard } from '../components/ui'
import { useDashboard, useProjets, useTerritoires } from '../hooks/useApi'
import { STATUTS_PUBLICS } from '../constants/portailPublic'
import { formatFcfaCourt, formatNombre, formatPourcent, humaniser } from '../utils/format'

/**
 * Portail régional — la porte d'entrée publique de BAGOUÉ 360.
 *
 * Le dossier institutionnel en décrit le contenu : l'identité du Conseil, la
 * vision régionale, les chiffres clés du territoire, les services accessibles
 * sans compte, les projets récents et les accès aux quatre espaces.
 *
 * Tous les nombres affichés viennent de l'API. Des compteurs figés donneraient
 * l'illusion d'une activité, et c'est précisément ce qu'un visiteur vient
 * vérifier.
 */

/** Ce que la plateforme couvre, dans l'ordre de la chaîne de valeur du dossier. */
const modules = [
  {
    icon: Landmark,
    titre: 'Gouvernance & planification',
    texte: 'Sessions, délibérations, PAI et programmes régionaux suivis dans un référentiel unique.',
  },
  {
    icon: Sprout,
    titre: 'Exécution des projets',
    texte: 'Projets, infrastructures, maintenance et équipements pilotés du lancement à la livraison.',
  },
  {
    icon: Banknote,
    titre: 'Finances & prestataires',
    texte: 'Budgets, engagements, paiements et marchés reliés à chaque projet du territoire.',
  },
  {
    icon: ClipboardCheck,
    titre: 'Contrôle & workflows',
    texte: 'Missions de contrôle, visites de chantier et circuits de validation tracés de bout en bout.',
  },
  {
    icon: Gauge,
    titre: 'Pilotage & décision',
    texte: 'Indicateurs, impact territorial, rapports et aide à la décision pour la Présidence.',
  },
  {
    icon: Map,
    titre: 'Territoire & SIG',
    texte: 'Cartographie des ouvrages et des besoins par département, sous-préfecture et localité.',
  },
]

/**
 * Les services ouverts, sans compte.
 *
 * Le dossier insiste sur ce point : consulter ne doit rien demander. Seuls
 * déposer un besoin ou soutenir une initiative supposent de s'identifier.
 */
const services = [
  {
    icon: MessageSquarePlus,
    titre: 'Déclarer un besoin',
    texte: 'Signalez un manque dans votre localité : eau, école, piste, santé.',
    to: '/portail/citoyen',
  },
  {
    icon: MapPin,
    titre: 'Consulter la carte',
    texte: 'Situez les projets et les ouvrages, département par département.',
    to: '/portail/public',
  },
  {
    icon: Search,
    titre: 'Suivre un projet',
    texte: 'Avancement, calendrier, montant annoncé et entreprise responsable.',
    to: '/portail/public',
  },
  {
    icon: FileText,
    titre: 'Accéder aux délibérations',
    texte: 'Les décisions du Conseil régional et les pièces qui les accompagnent.',
    to: '/portail/public',
  },
  {
    icon: Database,
    titre: 'Explorer les données',
    texte: 'Rapports publics et chiffres de l’investissement régional.',
    to: '/portail/public',
  },
]

/** Les quatre espaces du dossier : chacun voit ce qui concerne sa mission. */
const espaces = [
  {
    icon: Users,
    titre: 'Citoyen',
    texte: 'Déclarez un besoin dans votre localité et suivez son instruction.',
    lien: { label: 'Portail citoyen', to: '/portail/citoyen' },
  },
  {
    icon: Briefcase,
    titre: 'Entreprise',
    texte: 'Consultez vos marchés, déposez vos pièces, suivez vos demandes.',
    lien: { label: 'Portail entrepreneur', to: '/portail/entrepreneur' },
  },
  {
    icon: Landmark,
    titre: 'Grand public',
    texte: 'Accédez librement aux données ouvertes sur les projets financés.',
    lien: { label: 'Portail public', to: '/portail/public' },
  },
  {
    icon: ShieldCheck,
    titre: 'Administration',
    texte: 'Directions, contrôleurs et élus accèdent à la solution interne.',
    lien: { label: 'Se connecter', to: '/connexion' },
  },
]

export default function AccueilPage() {
  const navigate = useNavigate()
  const { data: synthese } = useDashboard()
  const territoires = useTerritoires({ size: 100 })
  // Les plus récemment engagés : c'est ce qui intéresse un visiteur, pas le
  // premier par ordre alphabétique.
  const recents = useProjets({ size: 6, sort: 'dateDebut:desc' })

  const tous = territoires.data?.items ?? []
  const region = tous.find((t) => t.type === 'REGION')
  const departements = tous.filter((t) => t.type === 'DEPARTEMENT').length
  const localites = tous.reduce((s, t) => (t.type === 'DEPARTEMENT' ? s + t.nbLocalites : s), 0)

  return (
    <>
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">
            Conseil Régional de la Bagoué
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
            Une région connectée, des projets qui transforment
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-100 lg:text-base">
            BAGOUÉ 360 centralise, visualise et rend compte de l'action régionale — du besoin
            exprimé par un habitant jusqu'au rapport présenté au Conseil.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/portail/public')} icon={<ArrowRight className="size-4" />}>
              Découvrir la plateforme
            </Button>
            <Link
              to="/portail/public"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Nos projets
            </Link>
          </div>
          <p className="mt-8 text-xs text-brand-200/80">
            Planifier · Décider · Suivre · Contrôler · Valoriser · Rendre compte
          </p>
        </div>
      </section>

      {/* Chiffres clés : le territoire d'abord, l'investissement ensuite. */}
      {synthese && (
        <section className="mx-auto max-w-[1200px] px-4 lg:px-6">
          <div className="-mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Population régionale"
              value={region ? formatNombre(region.population) : '—'}
              hint={departements > 0 ? `${departements} départements` : undefined}
            />
            <StatCard
              label="Localités couvertes"
              value={localites > 0 ? formatNombre(localites) : '—'}
              hint={region ? `${formatNombre(region.superficieKm2)} km²` : undefined}
            />
            <StatCard label="Projets suivis" value={formatNombre(synthese.nbProjets)} />
            <StatCard
              label="Investissement programmé"
              value={formatFcfaCourt(synthese.budgetPrevu)}
              hint={`${formatPourcent(synthese.tauxExecutionFinanciere)} exécuté`}
            />
          </div>
        </section>
      )}

      {/* Services ouverts : aucun compte demandé pour consulter. */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">Nos services en ligne</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Accessibles à tous, sans création de compte. Seul le dépôt d'un besoin demande de
          s'identifier.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s) => (
            <Link key={s.titre} to={s.to} className="group">
              <Card bodyClassName="flex h-full flex-col p-5 transition group-hover:border-brand-300 group-hover:shadow-sm">
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-ink-900">{s.titre}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-500">{s.texte}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Projets récents : la preuve par l'exemple, tirée de la base. */}
      {(recents.data?.items.length ?? 0) > 0 && (
        <section className="border-t border-ink-200 bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-12 lg:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink-900">Projets récents</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Les dernières opérations engagées sur le territoire régional.
                </p>
              </div>
              <Link
                to="/portail/public"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                Voir tous les projets
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recents.data?.items.map((p) => {
                const statut = STATUTS_PUBLICS[p.statut]
                return (
                  <Card key={p.id} bodyClassName="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600">
                        <IconeSecteur secteur={p.secteur} className="size-4 text-brand-600" />
                        {humaniser(p.secteur)}
                      </span>
                      <span
                        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium"
                        style={{ color: statut.couleur }}
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: statut.couleur }}
                          aria-hidden
                        />
                        {statut.libelle}
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-ink-900">
                      {p.intitule}
                    </h3>
                    <p className="mt-2 flex-1 text-xs text-ink-500">
                      {formatNombre(p.beneficiaires)} bénéficiaires · {p.maitreOuvrage}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                      <span className="text-sm font-semibold tabular-nums text-ink-900">
                        {formatFcfaCourt(p.budgetPrevu)}
                      </span>
                      <span className="text-xs text-ink-500">
                        {Math.round(p.avancementPhysique)} % réalisé
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:px-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">Un outil, toute la chaîne de valeur</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-500">
          Les mêmes référentiels et le même design servent chaque module de la solution interne.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Card key={m.titre} bodyClassName="p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <m.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink-900">{m.titre}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{m.texte}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-ink-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-12 lg:px-6">
          <h2 className="text-lg font-semibold tracking-tight text-ink-900">Un accès adapté à chaque profil</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            Chacun voit principalement ce qui concerne sa mission : consultez librement, ou
            connectez-vous pour agir.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {espaces.map((p) => (
              <Card key={p.titre} bodyClassName="flex h-full flex-col p-5">
                <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-ink-900">{p.titre}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-500">{p.texte}</p>
                <Link
                  to={p.lien.to}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800"
                >
                  {p.lien.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:px-6">
        <div className="rounded-2xl bg-brand-900 px-6 py-10 text-center text-white lg:px-12">
          <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
            Ensemble pour une Bagoué plus forte
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-100">
            Créez votre compte ou connectez-vous pour retrouver l'espace correspondant à votre
            profil.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/inscription')}>Créer un compte</Button>
            <Link
              to="/connexion"
              className="inline-flex items-center rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
