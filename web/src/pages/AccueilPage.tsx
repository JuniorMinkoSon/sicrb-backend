import { ArrowRight, Banknote, ClipboardCheck, Gauge, Landmark, Map, ShieldCheck, Sprout, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, StatCard } from '../components/ui'
import { useDashboard } from '../hooks/useApi'
import { formatFcfaCourt, formatNombre, formatPourcent } from '../utils/format'

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

const parcours = [
  {
    icon: Users,
    titre: 'Citoyens',
    texte: 'Consultez les investissements publics et signalez les besoins de votre localité.',
    lien: { label: 'Portail citoyen', to: '/portail/citoyen' },
  },
  {
    icon: Landmark,
    titre: 'Grand public',
    texte: 'Accédez librement aux données ouvertes sur les projets financés par la région.',
    lien: { label: 'Portail public', to: '/portail/public' },
  },
  {
    icon: ShieldCheck,
    titre: 'Agents & partenaires',
    texte: 'Directions, contrôleurs et prestataires accèdent à la solution interne après connexion.',
    lien: { label: 'Se connecter', to: '/connexion' },
  },
]

/** Site vitrine : porte d'entrée cohérente vers les portails et la solution interne. */
export default function AccueilPage() {
  const navigate = useNavigate()
  const { data: synthese } = useDashboard()

  return (
    <>
      <section className="bg-brand-900 text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">
            Conseil Régional de la Bagoué
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
            Le système d'information des investissements de la région de la Bagoué
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-100 lg:text-base">
            Une plateforme unique pour planifier, exécuter, contrôler et rendre compte des investissements publics
            régionaux — de la délibération au service rendu aux populations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/connexion')} icon={<ArrowRight className="size-4" />}>
              Accéder à la solution interne
            </Button>
            <Link
              to="/portail/public"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Explorer le portail public
            </Link>
          </div>
        </div>
      </section>

      {synthese && (
        <section className="mx-auto max-w-[1200px] px-4 lg:px-6">
          <div className="-mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Projets suivis" value={formatNombre(synthese.nbProjets)} />
            <StatCard label="Investissement programmé" value={formatFcfaCourt(synthese.budgetPrevu)} />
            <StatCard
              label="Exécution financière"
              value={formatPourcent(synthese.tauxExecutionFinanciere)}
              hint={`${formatFcfaCourt(synthese.budgetPaye)} payés`}
            />
            <StatCard label="Population bénéficiaire" value={formatNombre(synthese.beneficiaires)} />
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
            Le même parcours cohérent, du site vitrine à l'espace de travail : consultez librement, ou connectez-vous
            pour agir.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {parcours.map((p) => (
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
          <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">Prêt à rejoindre la plateforme ?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-100">
            Créez votre compte de démonstration ou connectez-vous pour retrouver l'espace correspondant à votre profil.
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
