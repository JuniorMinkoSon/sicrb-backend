import { useState, type FormEvent } from 'react'
import { UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Input, Label, Select } from '../components/ui'
import { routeParDefaut } from '../constants/nav'
import { useAuth } from '../hooks/useAuth'
import { useRole } from '../hooks/useRole'
import type { RoleApplicatif } from '../types/roles'

const profilsInscription: { code: RoleApplicatif; libelle: string; description: string }[] = [
  { code: 'CITIZEN', libelle: 'Citoyen', description: 'Proposer des projets, suivre vos demandes et signaler des problèmes.' },
  { code: 'CONTRACTOR', libelle: 'Entrepreneur / Prestataire', description: 'Suivre vos marchés, documents et paiements.' },
]

/** Inscription de démonstration : crée la session et mène à l'espace du profil. */
export default function InscriptionPage() {
  const { seConnecter } = useAuth()
  const { setRole } = useRole()
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [profil, setProfil] = useState<RoleApplicatif>('CITIZEN')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)

  const soumettre = (e: FormEvent) => {
    e.preventDefault()
    if (nom.trim().length < 3) {
      setErreur('Veuillez saisir votre nom complet.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErreur('Veuillez saisir une adresse e-mail valide.')
      return
    }
    if (motDePasse.length < 4) {
      setErreur('Le mot de passe doit contenir au moins 4 caractères.')
      return
    }
    if (motDePasse !== confirmation) {
      setErreur('Les deux mots de passe ne correspondent pas.')
      return
    }
    setErreur(null)
    seConnecter({ nom: nom.trim(), email: email.trim(), role: profil })
    setRole(profil)
    navigate(profil === 'CITIZEN' ? '/portail/citoyen' : profil === 'CONTRACTOR' ? '/portail/entrepreneur' : routeParDefaut(profil), { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 lg:py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">Créer un compte</h1>
        <p className="mt-1 text-sm text-ink-500">Rejoignez la plateforme du Conseil Régional de la Bagoué.</p>
      </div>

      <Card bodyClassName="p-6">
        <Alert level="info" title="Environnement de démonstration">
          L'inscription est simulée : aucun compte réel n'est créé, aucune donnée n'est transmise.
        </Alert>

        <form className="mt-4 space-y-4" onSubmit={soumettre} noValidate>
          <div>
            <Label htmlFor="nom">Nom complet</Label>
            <Input id="nom" autoComplete="name" placeholder="Ex. : Awa Coulibaly" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="profil">Vous êtes</Label>
            <Select
              id="profil"
              options={profilsInscription.map((p) => ({ value: p.code, label: p.libelle }))}
              value={profil}
              onChange={(e) => setProfil(e.target.value as RoleApplicatif)}
            />
            <p className="mt-1 text-xs text-ink-500">{profilsInscription.find((p) => p.code === profil)?.description}</p>
          </div>
          <div>
            <Label htmlFor="mot-de-passe">Mot de passe</Label>
            <Input
              id="mot-de-passe"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmation">Confirmer le mot de passe</Label>
            <Input
              id="confirmation"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>

          {erreur && (
            <Alert level="warning" title="Vérifiez votre saisie">
              {erreur}
            </Alert>
          )}

          <Button type="submit" className="w-full" icon={<UserPlus className="size-4" />}>
            Créer mon compte
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-ink-500">
        Déjà inscrit ?{' '}
        <Link to="/connexion" className="font-medium text-brand-700 hover:text-brand-800">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
