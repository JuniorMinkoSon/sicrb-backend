import { NavLink } from 'react-router-dom'
import { navigationPourRole } from '../../constants/nav'
import { useRole } from '../../hooks/useRole'
import { cn } from '../ui/cn'

export function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { role } = useRole()
  const groupes = navigationPourRole(role)

  return (
    <nav
      aria-label="Navigation principale"
      className="flex h-full flex-col gap-5 overflow-y-auto px-2 py-4 [scrollbar-color:#2b4a7d_transparent] [scrollbar-width:thin]"
    >
      {groupes.map((groupe) => (
        <div key={groupe.chaine}>
          {collapsed ? (
            <div className="mx-3 mb-2 h-px bg-white/10" aria-hidden />
          ) : (
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200/70">{groupe.chaine}</p>
          )}
          <ul className="space-y-0.5">
            {groupe.items.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-brand-600 font-semibold text-white shadow-xs'
                        : 'text-brand-100/80 hover:bg-white/10 hover:text-white',
                      collapsed && 'justify-center px-2',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !collapsed && (
                        <span className="absolute -left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-white/90" aria-hidden />
                      )}
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!collapsed && (
        <p className="mt-auto px-3 text-[10px] leading-relaxed text-brand-200/60">
          Chaîne de valeur : gouvernance → planification → territoire → programmes → projets → exécution → contrôle → finances →
          documents → indicateurs → impact → décision → audit.
        </p>
      )}
    </nav>
  )
}
