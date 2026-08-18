import { useState } from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { apiMode } from '../../services'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { GlobalSearch } from './GlobalSearch'
import { NotificationsMenu } from './NotificationsMenu'
import { RoleMenu } from './RoleMenu'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-ink-200 bg-white px-3 lg:px-4">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(true)}
          icon={<Menu className="size-5" />}
        />
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:inline-flex"
          aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
          onClick={() => setCollapsed((v) => !v)}
          icon={collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        />
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded bg-brand-800 text-xs font-bold tracking-tight text-white">CRB</span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-ink-900">Conseil Régional de la Bagoué</span>
            <span className="block text-[11px] text-ink-500">Système d'information de gestion des investissements</span>
          </span>
        </Link>
        <div className="ml-auto hidden flex-1 justify-center px-4 md:flex">
          <GlobalSearch />
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Badge tone={apiMode === 'mock' ? 'warning' : 'info'}>{apiMode === 'mock' ? 'Données de démonstration' : 'API Quarkus'}</Badge>
          <NotificationsMenu />
          <div className="hidden sm:block">
            <RoleMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`hidden shrink-0 border-r border-ink-200 bg-white lg:block ${collapsed ? 'w-16' : 'w-64'}`}
        >
          <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
            <Sidebar collapsed={collapsed} />
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="w-72 bg-white shadow-lg">
              <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>
            <button className="flex-1 bg-ink-900/40" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-4 md:hidden">
              <GlobalSearch />
            </div>
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="border-t border-ink-200 bg-white px-4 py-3 text-[11px] text-ink-500">
        SICRB — maquette fonctionnelle. Les données affichées sont des données de démonstration, sans valeur officielle.
      </footer>
    </div>
  )
}
