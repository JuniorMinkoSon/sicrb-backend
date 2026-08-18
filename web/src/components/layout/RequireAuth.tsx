import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/** Garde d'accès de la solution interne : redirige vers la connexion. */
export function RequireAuth() {
  const { estConnecte } = useAuth()
  const location = useLocation()

  if (!estConnecte) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />
  }
  return <Outlet />
}
