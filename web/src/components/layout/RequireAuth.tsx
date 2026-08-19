import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Garde d'accès de la solution interne : redirige vers la connexion,
 * et maintient les profils citoyens/grand public sur les portails ouverts
 * (un citoyen n'a pas les droits d'un utilisateur administratif).
 */
export function RequireAuth() {
  const { estConnecte, session } = useAuth()
  const location = useLocation()

  if (!estConnecte) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />
  }
  if (session && (session.role === 'CITIZEN' || session.role === 'PUBLIC')) {
    return <Navigate to="/portail/citoyen" replace />
  }
  return <Outlet />
}
