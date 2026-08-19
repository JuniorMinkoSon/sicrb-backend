import { useMemo, useState } from 'react'
import { AlertTriangle, Bell, CheckCircle2, Lightbulb, MapPin, Paperclip, SearchCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Label,
  Modal,
  PageHeader,
  Select,
  StatCard,
  Textarea,
  useToast,
} from '../components/ui'
import { CATEGORIES_REQUETE } from '../constants/referentiels'
import { useProjets, useTerritoires } from '../hooks/useApi'
import { formatDate, formatNombre, humaniser } from '../utils/format'

/* ------------------------------------------------------------------ Démo locale
 * L'espace citoyen fonctionne ici en démonstration : propositions, réclamations
 * et notifications sont conservées dans le navigateur (localStorage), en
 * attendant les points d'API citoyens du backend.
 */

const ETAPES_PROPOSITION = ['Soumise', 'En analyse', 'Acceptée', 'Programmée', 'En réalisation', 'Terminée'] as const

interface PropositionCitoyenne {
  numero: string
  titre: string
  probleme: string
  localisation: string
  description: string
  categorie: string
  beneficiaires: string
  photos: string[]
  etape: number
  deposeeLe: string
}

const TYPES_RECLAMATION = [
  'Retard sur un projet',
  'Problème sur un chantier',
  'Mauvaise qualité des travaux',
  'Interruption des travaux',
  'Problème de sécurité',
  'Infrastructure dégradée',
] as const

interface ReclamationCitoyenne {
  numero: string
  type: string
  projet: string
  localisation: string
  commentaire: string
  pieces: string[]
  deposeeLe: string
}

interface NotificationCitoyenne {
  id: string
  message: string
  date: string
}

interface EtatCitoyen {
  propositions: PropositionCitoyenne[]
  reclamations: ReclamationCitoyenne[]
  notifications: NotificationCitoyenne[]
}

const CLE_STOCKAGE = 'sicrb.citoyen.demo'

const ETAT_INITIAL: EtatCitoyen = {
  propositions: [
    {
      numero: 'PROJ-2026-00452',
      titre: 'Forage équipé au quartier Nord de Boundiali',
      probleme: "Accès insuffisant à l'eau potable en saison sèche",
      localisation: 'Boundiali — quartier Nord',
      description: 'Réalisation d’un forage équipé d’une pompe et d’un château d’eau de proximité.',
      categorie: 'EAU',
      beneficiaires: '2 400 habitants',
      photos: ['photo-forage.jpg'],
      etape: 4,
      deposeeLe: '2026-01-12',
    },
  ],
  reclamations: [],
  notifications: [
    { id: 'n1', message: 'Votre demande PROJ-2026-00452 a été reçue.', date: '2026-01-12' },
    { id: 'n2', message: 'Votre demande PROJ-2026-00452 est en cours d’analyse.', date: '2026-01-20' },
    { id: 'n3', message: 'Votre demande PROJ-2026-00452 a été acceptée puis programmée.', date: '2026-02-18' },
    { id: 'n4', message: 'Le projet PROJ-2026-00452 a démarré : les travaux sont en cours.', date: '2026-05-04' },
  ],
}

function lireEtat(): EtatCitoyen {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    if (brut) return JSON.parse(brut) as EtatCitoyen
  } catch {
    /* état corrompu : repartir de la démo */
  }
  return ETAT_INITIAL
}

const persister = (etat: EtatCitoyen) => localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat))

const aujourdHui = () => new Date().toISOString().slice(0, 10)

function SuiviEtapes({ etape }: { etape: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-2">
      {ETAPES_PROPOSITION.map((libelle, i) => (
        <li key={libelle} className="flex items-center">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              i < etape ? 'bg-emerald-50 text-emerald-700' : i === etape ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
            }`}
          >
            {i < etape && <CheckCircle2 className="size-3" aria-hidden />}
            {libelle}
          </span>
          {i < ETAPES_PROPOSITION.length - 1 && <span className="mx-1 text-ink-300">→</span>}
        </li>
      ))}
    </ol>
  )
}

/** Portail citoyen : proposer un projet, suivre une demande, signaler une réclamation. */
export default function PortailCitoyenPage() {
  const [etat, setEtat] = useState<EtatCitoyen>(lireEtat)
  const [modal, setModal] = useState<'proposition' | 'reclamation' | null>(null)
  const [recherche, setRecherche] = useState('')
  const [resultat, setResultat] = useState<PropositionCitoyenne | null | 'introuvable'>(null)
  const { notify } = useToast()

  const territoires = useTerritoires({ size: 100 })
  const projets = useProjets({ size: 50, sort: 'budgetPrevu:desc' })
  const communes = (territoires.data?.items ?? []).filter((x) => x.type !== 'REGION')

  const [prop, setProp] = useState({ titre: '', probleme: '', localisation: '', description: '', categorie: CATEGORIES_REQUETE[0], beneficiaires: '', photos: [] as string[] })
  const [rec, setRec] = useState({ type: TYPES_RECLAMATION[0] as string, projet: '', localisation: '', commentaire: '', pieces: [] as string[] })

  const majEtat = (suivant: EtatCitoyen) => {
    setEtat(suivant)
    persister(suivant)
  }

  const notifier = (etatCourant: EtatCitoyen, message: string): EtatCitoyen => ({
    ...etatCourant,
    notifications: [{ id: `n-${Date.now()}`, message, date: aujourdHui() }, ...etatCourant.notifications],
  })

  const soumettreProposition = () => {
    const numero = `PROJ-2026-${String(452 + etat.propositions.length + 1).padStart(5, '0')}`
    const nouvelle: PropositionCitoyenne = { numero, ...prop, etape: 0, deposeeLe: aujourdHui() }
    majEtat(notifier({ ...etat, propositions: [nouvelle, ...etat.propositions] }, `Votre demande ${numero} a été reçue.`))
    notify(`Proposition enregistrée — numéro de suivi ${numero}`)
    setModal(null)
    setProp({ titre: '', probleme: '', localisation: '', description: '', categorie: CATEGORIES_REQUETE[0], beneficiaires: '', photos: [] })
  }

  const soumettreReclamation = () => {
    const numero = `REC-2026-${String(etat.reclamations.length + 1).padStart(4, '0')}`
    const nouvelle: ReclamationCitoyenne = { numero, ...rec, deposeeLe: aujourdHui() }
    majEtat(notifier({ ...etat, reclamations: [nouvelle, ...etat.reclamations] }, `Votre réclamation ${numero} a été reçue.`))
    notify(`Réclamation ${numero} transmise aux services régionaux`)
    setModal(null)
    setRec({ type: TYPES_RECLAMATION[0], projet: '', localisation: '', commentaire: '', pieces: [] })
  }

  const chercher = () => {
    const n = recherche.trim().toUpperCase()
    if (!n) return
    setResultat(etat.propositions.find((p) => p.numero.toUpperCase() === n) ?? 'introuvable')
  }

  const nomsFichiers = (files: FileList | null) => Array.from(files ?? []).map((f) => f.name)

  const statsEtapes = useMemo(
    () => ({
      enAnalyse: etat.propositions.filter((p) => p.etape <= 1).length,
      enRealisation: etat.propositions.filter((p) => p.etape >= 2 && p.etape < 5).length,
      terminees: etat.propositions.filter((p) => p.etape === 5).length,
    }),
    [etat.propositions],
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
      <PageHeader
        title="Portail citoyen"
        subtitle="Proposez un projet pour votre localité, suivez votre demande étape par étape et signalez tout problème sur un chantier."
        crumbs={[{ label: 'Portails' }, { label: 'Citoyen' }]}
      />

      <Alert level="info" title="Espace de démonstration">
        Vos propositions et réclamations sont conservées dans ce navigateur à des fins de démonstration ; aucun dossier officiel n'est créé.
      </Alert>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setModal('proposition')}
          className="group rounded-xl border border-ink-200 bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-left text-white shadow-sm transition hover:shadow-md"
        >
          <Lightbulb className="size-7" aria-hidden />
          <h3 className="mt-3 text-base font-semibold">Proposer un projet</h3>
          <p className="mt-1 text-sm text-brand-100">
            Un besoin dans votre localité ? Décrivez-le : proposition → analyse → validation → programmation.
          </p>
        </button>
        <button
          onClick={() => document.getElementById('suivi-demande')?.scrollIntoView({ behavior: 'smooth' })}
          className="group rounded-xl border border-ink-200 bg-white p-5 text-left shadow-sm transition hover:border-brand-300 hover:shadow-md"
        >
          <SearchCheck className="size-7 text-brand-700" aria-hidden />
          <h3 className="mt-3 text-base font-semibold text-ink-900">Suivre une demande</h3>
          <p className="mt-1 text-sm text-ink-600">Saisissez votre numéro de suivi (ex. PROJ-2026-00452) pour connaître l'étape en cours.</p>
        </button>
        <button
          onClick={() => setModal('reclamation')}
          className="group rounded-xl border border-ink-200 bg-white p-5 text-left shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <AlertTriangle className="size-7 text-amber-600" aria-hidden />
          <h3 className="mt-3 text-base font-semibold text-ink-900">Signaler une réclamation</h3>
          <p className="mt-1 text-sm text-ink-600">Retard, qualité, sécurité, interruption ou infrastructure dégradée : alertez les services régionaux.</p>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Mes propositions" value={formatNombre(etat.propositions.length)} />
        <StatCard label="En analyse" value={formatNombre(statsEtapes.enAnalyse)} tone="warning" />
        <StatCard label="Acceptées / en réalisation" value={formatNombre(statsEtapes.enRealisation)} />
        <StatCard label="Terminées" value={formatNombre(statsEtapes.terminees)} tone="positive" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div id="suivi-demande">
            <Card title="Suivre une demande" description="Chaque proposition reçoit un numéro de suivi et progresse étape par étape.">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  aria-label="Numéro de suivi"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && chercher()}
                  placeholder="Ex. PROJ-2026-00452"
                  className="sm:max-w-xs"
                />
                <Button onClick={chercher}>Rechercher</Button>
              </div>
              {resultat === 'introuvable' && (
                <p className="mt-3 text-sm text-red-700">Aucune demande ne correspond à ce numéro dans ce navigateur.</p>
              )}
              {resultat && resultat !== 'introuvable' && (
                <div className="mt-4 rounded-lg border border-ink-200 bg-ink-50/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-900">
                      {resultat.numero} — {resultat.titre}
                    </p>
                    <Badge tone="info">{humaniser(resultat.categorie)}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-600">
                    Déposée le {formatDate(resultat.deposeeLe)} · {resultat.localisation}
                  </p>
                  <div className="mt-3">
                    <SuiviEtapes etape={resultat.etape} />
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card title="Mes propositions de projet">
            {etat.propositions.length === 0 ? (
              <EmptyState title="Aucune proposition pour l'instant." />
            ) : (
              <ul className="space-y-3">
                {etat.propositions.map((p) => (
                  <li key={p.numero} className="rounded-lg border border-ink-200 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">
                        <span className="text-brand-800">{p.numero}</span> — {p.titre}
                      </p>
                      <span className="text-xs text-ink-500">Déposée le {formatDate(p.deposeeLe)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-600">{p.probleme}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-500">
                      <MapPin className="size-3.5" aria-hidden />
                      {p.localisation || 'Localisation non précisée'}
                      {p.photos.length > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Paperclip className="size-3.5" aria-hidden />
                          {p.photos.length} photo(s)
                        </span>
                      )}
                    </p>
                    <div className="mt-2.5">
                      <SuiviEtapes etape={p.etape} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Mes réclamations">
            {etat.reclamations.length === 0 ? (
              <EmptyState title="Aucune réclamation déposée." />
            ) : (
              <ul className="space-y-3">
                {etat.reclamations.map((r) => (
                  <li key={r.numero} className="rounded-lg border border-ink-200 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">
                        <span className="text-amber-700">{r.numero}</span> — {r.type}
                      </p>
                      <span className="text-xs text-ink-500">Déposée le {formatDate(r.deposeeLe)}</span>
                    </div>
                    {r.projet && <p className="mt-1 text-xs text-ink-600">Projet concerné : {r.projet}</p>}
                    <p className="mt-1 line-clamp-2 text-xs text-ink-600">{r.commentaire}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-500">
                      <MapPin className="size-3.5" aria-hidden />
                      {r.localisation || 'Localisation non précisée'}
                      {r.pieces.length > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Paperclip className="size-3.5" aria-hidden />
                          {r.pieces.length} pièce(s) jointe(s)
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Notifications" description="Vous êtes informé à chaque étape : réception, analyse, décision, démarrage, avancement, fin.">
            {etat.notifications.length === 0 ? (
              <EmptyState title="Aucune notification." />
            ) : (
              <ul className="space-y-2.5">
                {etat.notifications.slice(0, 8).map((n) => (
                  <li key={n.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                      <Bell className="size-3.5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs text-ink-800">{n.message}</p>
                      <p className="text-[11px] text-ink-400">{formatDate(n.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Consulter les projets de la région">
            <p className="text-xs text-ink-600">
              Retrouvez sur le portail public la carte interactive, les coûts annoncés, l'avancement des chantiers et les rapports publics.
            </p>
            <Link
              to="/portail/public"
              className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-ink-300 bg-white px-4 text-sm font-medium text-ink-800 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
            >
              Ouvrir le portail public
            </Link>
          </Card>
        </div>
      </div>

      <Modal
        open={modal === 'proposition'}
        title="Proposer un projet"
        description="Votre proposition suit le circuit : proposition → analyse → validation → programmation. Un numéro de suivi vous est remis."
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Annuler
            </Button>
            <Button disabled={prop.titre.trim().length < 5 || prop.probleme.trim().length < 5 || !prop.localisation} onClick={soumettreProposition}>
              Soumettre la proposition
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label htmlFor="p-titre">Titre</Label>
            <Input id="p-titre" value={prop.titre} onChange={(e) => setProp({ ...prop, titre: e.target.value })} placeholder="Ex. : construction d'un centre de santé" />
          </div>
          <div>
            <Label htmlFor="p-probleme">Problème constaté</Label>
            <Textarea id="p-probleme" rows={2} value={prop.probleme} onChange={(e) => setProp({ ...prop, probleme: e.target.value })} placeholder="Quel besoin ou difficulté ce projet doit-il résoudre ?" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-localisation">Localisation</Label>
              <Select
                id="p-localisation"
                value={prop.localisation}
                placeholder="Sélectionner une localité"
                onChange={(e) => setProp({ ...prop, localisation: e.target.value })}
                options={communes.map((c) => ({ value: c.nom, label: c.nom }))}
              />
            </div>
            <div>
              <Label htmlFor="p-categorie">Catégorie</Label>
              <Select
                id="p-categorie"
                value={prop.categorie}
                onChange={(e) => setProp({ ...prop, categorie: e.target.value })}
                options={CATEGORIES_REQUETE.map((c) => ({ value: c, label: humaniser(c) }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="p-description">Description</Label>
            <Textarea id="p-description" rows={3} value={prop.description} onChange={(e) => setProp({ ...prop, description: e.target.value })} placeholder="Décrivez le projet souhaité." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-beneficiaires">Bénéficiaires</Label>
              <Input id="p-beneficiaires" value={prop.beneficiaires} onChange={(e) => setProp({ ...prop, beneficiaires: e.target.value })} placeholder="Ex. : 1 500 habitants" />
            </div>
            <div>
              <Label htmlFor="p-photos">Photos (démonstration)</Label>
              <input
                id="p-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setProp({ ...prop, photos: nomsFichiers(e.target.files) })}
                className="block w-full text-xs text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={modal === 'reclamation'}
        title="Signaler une réclamation"
        description="Votre signalement est transmis aux services régionaux compétents, avec vos pièces jointes."
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Annuler
            </Button>
            <Button disabled={rec.commentaire.trim().length < 5} onClick={soumettreReclamation}>
              Transmettre la réclamation
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label htmlFor="r-type">Type de signalement</Label>
            <Select id="r-type" value={rec.type} onChange={(e) => setRec({ ...rec, type: e.target.value })} options={TYPES_RECLAMATION.map((t) => ({ value: t, label: t }))} />
          </div>
          <div>
            <Label htmlFor="r-projet">Projet ou chantier concerné (optionnel)</Label>
            <Select
              id="r-projet"
              value={rec.projet}
              placeholder="Sélectionner un projet"
              onChange={(e) => setRec({ ...rec, projet: e.target.value })}
              options={(projets.data?.items ?? []).map((p) => ({ value: p.intitule, label: p.intitule }))}
            />
          </div>
          <div>
            <Label htmlFor="r-localisation">Localisation</Label>
            <Select
              id="r-localisation"
              value={rec.localisation}
              placeholder="Sélectionner une localité"
              onChange={(e) => setRec({ ...rec, localisation: e.target.value })}
              options={communes.map((c) => ({ value: c.nom, label: c.nom }))}
            />
          </div>
          <div>
            <Label htmlFor="r-commentaire">Commentaire</Label>
            <Textarea id="r-commentaire" rows={3} value={rec.commentaire} onChange={(e) => setRec({ ...rec, commentaire: e.target.value })} placeholder="Décrivez le problème constaté." />
          </div>
          <div>
            <Label htmlFor="r-pieces">Photo ou vidéo (démonstration)</Label>
            <input
              id="r-pieces"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setRec({ ...rec, pieces: nomsFichiers(e.target.files) })}
              className="block w-full text-xs text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
