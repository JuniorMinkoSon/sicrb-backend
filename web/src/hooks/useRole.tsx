import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { ROLES_META, type RoleApplicatif } from '../types/roles'

interface RoleContextValue {
  role: RoleApplicatif
  setRole: (role: RoleApplicatif) => void
  libelle: string
  utilisateur: { nom: string; fonction: string }
}

const RoleContext = createContext<RoleContextValue | null>(null)

const STORAGE_KEY = 'sicrb.role'

/**
 * Rôle de la session de démonstration. ATTENTION : ce filtrage est purement
 * ergonomique (affichage du menu et des actions). La sécurité réelle devra être
 * portée par le backend Quarkus, qui n'expose aujourd'hui aucune authentification.
 */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleApplicatif>(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return (stored as RoleApplicatif) ?? 'PRESIDENT'
  })

  const value = useMemo<RoleContextValue>(() => {
    const meta = ROLES_META[role]
    return {
      role,
      setRole: (r) => {
        setRoleState(r)
        try {
          localStorage.setItem(STORAGE_KEY, r)
        } catch {
          /* stockage indisponible : le rôle reste en mémoire */
        }
      },
      libelle: meta.libelle,
      utilisateur: { nom: meta.utilisateurDemo, fonction: meta.libelle },
    }
  }, [role])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole doit être utilisé dans RoleProvider')
  return ctx
}
