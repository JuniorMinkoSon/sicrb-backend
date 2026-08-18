import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'

export default function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Erreur 404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink-900">Page introuvable</h1>
      <p className="mt-2 text-sm text-ink-600">
        L'adresse demandée ne correspond à aucun module du système d'information régional.
      </p>
      <div className="mt-4 flex justify-center">
        <Link to="/dashboard">
          <Button>Retour au tableau de bord</Button>
        </Link>
      </div>
    </Card>
  )
}
