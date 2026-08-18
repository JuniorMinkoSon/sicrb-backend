import { NavLink } from 'react-router-dom'
import { navigationPourRole } from '../../constants/nav'
import { useRole } from '../../hooks/useRole'
import { cn } from '../ui/cn'

export function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { role } = useRole()
  const groupes = navigationPourRole(role)

  return (
    <nav aria-label="Navigation principale" className="flex h-full flex-col gap-4 overflow-y-auto px-2 py-4">
      {groupes.map((groupe) => (
        <div key={groupe.chaine}>
          {!collapsed && (
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">{groupe.chaine}</p>
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
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive ? 'bg-brand-50 font-semibold text-brand-800' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                      collapsed && 'justify-center px-2',
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {!collapsed && <span className="truncate">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
