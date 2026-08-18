import { useEffect, useState } from 'react'
import { Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { apiMode } from '../../services'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ExerciceSelector } from './ExerciceSelector'
import { GlobalSearch } from './GlobalSearch'
import { NotificationsMenu } from './NotificationsMenu'
import { RoleMenu } from './RoleMenu'
import { Sidebar } from './Sidebar'

const STORAGE_KEY = 'sicrb.sidebar.collapsed'

function Marque({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-xs font-bold tracking-tight text-white ring-1 ring-inset ring-white/20">
        CRB
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-white">Conseil Régional de la Bagoué</span>
          <span className="block truncate text-[11px] text-brand-200/80">Système d'information des investissements</span>
        </span>
      )}
    </Link>
  )
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside
        className={`hidden shrink-0 bg-brand-900 lg:block ${collapsed ? 'w-[68px]' : 'w-[264px]'} transition-[width] duration-200`}
      >
        <div className="sticky top-0 flex h-screen flex-col">
          <div className={`flex h-16 items-center border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
            <Marque compact={collapsed} />
          </div>
          <div className="min-h-0 flex-1">
            <Sidebar collapsed={collapsed} />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex w-[280px] flex-col bg-brand-900 shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <Marque />
              <button aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} className="text-brand-100 hover:text-white">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
          <button className="flex-1 bg-ink-900/50 backdrop-blur-[1px]" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/95 px-3 backdrop-blur lg:px-6">
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
          <div className="hidden min-w-0 flex-1 md:block">
            <GlobalSearch />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ExerciceSelector />
            <Badge tone={apiMode === 'mock' ? 'warning' : 'info'} dot className="hidden xl:inline-flex">
              {apiMode === 'mock' ? 'Données de démonstration' : 'API Quarkus'}
            </Badge>
            <NotificationsMenu />
            <RoleMenu />
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          <div className="mx-auto max-w-[1560px]">
            <div className="mb-4 md:hidden">
              <GlobalSearch />
            </div>
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-ink-200 bg-white px-4 py-3 text-[11px] text-ink-500 lg:px-6">
          SICRB — maquette fonctionnelle. Les données affichées sont des données de démonstration, sans valeur officielle.
        </footer>
      </div>
    </div>
  )
}
