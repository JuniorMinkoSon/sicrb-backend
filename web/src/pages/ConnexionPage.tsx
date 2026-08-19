import { useState, type FormEvent } from 'react'
import { LogIn } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Input, Label, Select } from '../components/ui'
import { routeParDefaut } from '../constants/nav'
import { useAuth } from '../hooks/useAuth'
import { useRole } from '../hooks/useRole'
import { ROLES_META, roles, type RoleApplicatif } from '../types/roles'

const profils = roles.filter((r) => r.code !== 'PUBLIC')

/** Connexion de démonstration : ouvre la session et mène à l'espace du profil. */
export default function ConnexionPage() {
  const { seConnecter } = useAuth()
  const { setRole } = useRole()
  const navigate = useNavigate()
  const location = useLocation()
  const redirection = (location.state as { from?: string } | null)?.from

  const [profil, setProfil] = useState<RoleApplicatif>('PRESIDENT')
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)

  const soumettre = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setErreur('Veuillez saisir une adresse e-mail valide.')
      return
    }
    if (motDePasse.length < 4) {
      setErreur('Le mot de passe doit contenir au moins 4 caractères.')
      return
    }
    setErreur(null)
    seConnecter({ nom: ROLES_META[profil].utilisateurDemo, email: email.trim(), role: profil })
    setRole(profil)
    navigate(redirection ?? (profil === 'CITIZEN' ? '/portail/citoyen' : routeParDefaut(profil)), { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 lg:py-16">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">Connexion</h1>
        <p className="mt-1 text-sm text-ink-500">Accédez à la solution interne du SICRB.</p>
      </div>

      <Card bodyClassName="p-6">
        <Alert level="info" title="Environnement de démonstration">
          Aucun compte réel n'existe : choisissez un profil, saisissez une adresse e-mail et un mot de passe quelconque.
        </Alert>

        <form className="mt-4 space-y-4" onSubmit={soumettre} noValidate>
          <div>
            <Label htmlFor="profil">Profil</Label>
            <Select
              id="profil"
              options={profils.map((r) => ({ value: r.code, label: r.libelle }))}
              value={profil}
              onChange={(e) => setProfil(e.target.value as RoleApplicatif)}
            />
            <p className="mt-1 text-xs text-ink-500">{profils.find((r) => r.code === profil)?.description}</p>
          </div>
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="prenom.nom@bagoue.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mot-de-passe">Mot de passe</Label>
            <Input
              id="mot-de-passe"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
          </div>

          {erreur && (
            <Alert level="warning" title="Vérifiez votre saisie">
              {erreur}
            </Alert>
          )}

          <Button type="submit" className="w-full" icon={<LogIn className="size-4" />}>
            Se connecter
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-ink-500">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="font-medium text-brand-700 hover:text-brand-800">
          Créer un compte
        </Link>
      </p>
      <p className="mt-1 text-center text-sm text-ink-500">
        Simple consultation ?{' '}
        <Link to="/portail/public" className="font-medium text-brand-700 hover:text-brand-800">
          Portail public
        </Link>{' '}
        ·{' '}
        <Link to="/portail/citoyen" className="font-medium text-brand-700 hover:text-brand-800">
          Portail citoyen
        </Link>
      </p>
    </div>
  )
}
