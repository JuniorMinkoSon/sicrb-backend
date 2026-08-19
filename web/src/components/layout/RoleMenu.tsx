import { ChevronDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routeParDefaut } from '../../constants/nav'
import { useAuth } from '../../hooks/useAuth'
import { useRole } from '../../hooks/useRole'
import { roles } from '../../types/roles'
import { cn } from '../ui/cn'

const initiales = (nom: string) =>
  nom
    .split(/\s+/)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase() ?? '')
    .join('')

/**
 * Sélecteur de rôle de démonstration : il change le menu et les actions
 * visibles. Il ne remplace pas une authentification (absente du backend).
 */
export function RoleMenu() {
  const { role, libelle, setRole, utilisateur } = useRole()
  const { session, seDeconnecter } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const nomAffiche = session?.nom ?? utilisateur.nom

  return (
    <div className="relative" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-left hover:border-brand-300 hover:bg-brand-50"
      >
        <span className="grid size-7 place-items-center rounded-full bg-brand-700 text-[11px] font-semibold text-white" aria-hidden>
          {initiales(nomAffiche)}
        </span>
        <span className="hidden min-w-0 leading-tight sm:block">
          <span className="block truncate text-xs font-semibold text-ink-900">{nomAffiche}</span>
          <span className="block truncate text-[10px] uppercase tracking-wide text-ink-500">{libelle}</span>
        </span>
        <ChevronDown className="size-4 text-ink-400" aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-1.5 w-64 rounded-xl border border-ink-200 bg-white py-1 shadow-lg">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
            Profil de démonstration (sans authentification)
          </p>
          {roles.map((r) => (
            <button
              key={r.code}
              role="menuitem"
              onClick={() => {
                setRole(r.code)
                setOpen(false)
                navigate(routeParDefaut(r.code))
              }}
              className={cn(
                'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-ink-50',
                r.code === role ? 'font-semibold text-brand-800' : 'text-ink-700',
              )}
            >
              <span className="truncate">{r.libelle}</span>
              {r.code === role && <span className="size-1.5 rounded-full bg-brand-600" aria-hidden />}
            </button>
          ))}
          <div className="mt-1 border-t border-ink-100 pt-1">
            <button
              role="menuitem"
              onClick={() => {
                seDeconnecter()
                setOpen(false)
                navigate('/')
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
