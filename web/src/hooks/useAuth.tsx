import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { RoleApplicatif } from '../types/roles'

export interface SessionUtilisateur {
  nom: string
  email: string
  role: RoleApplicatif
}

interface AuthContextValue {
  session: SessionUtilisateur | null
  estConnecte: boolean
  seConnecter: (session: SessionUtilisateur) => void
  seDeconnecter: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'sicrb.session'

function lireSession(): SessionUtilisateur | null {
  try {
    const brut = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (!brut) return null
    const session = JSON.parse(brut) as SessionUtilisateur
    if (!session.nom || !session.email || !session.role) return null
    return session
  } catch {
    return null
  }
}

/**
 * Session de démonstration côté frontend : elle relie le parcours public
 * (vitrine, connexion, inscription) à la solution interne. Comme le filtrage
 * par rôle, ce n'est PAS une sécurité : l'authentification réelle devra être
 * portée par le backend Quarkus.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUtilisateur | null>(lireSession)

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      estConnecte: session !== null,
      seConnecter: (s) => {
        setSession(s)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
        } catch {
          /* stockage indisponible : la session reste en mémoire */
        }
      },
      seDeconnecter: () => {
        setSession(null)
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* stockage indisponible */
        }
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
