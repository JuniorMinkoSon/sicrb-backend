import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { routeParDefaut } from '../../constants/nav'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { cn } from '../ui/cn'
import { Marque, MENTION_DEMO } from './Marque'

const liens = [
  { label: 'Accueil', to: '/' },
  { label: 'Portail public', to: '/portail/public' },
  { label: 'Portail citoyen', to: '/portail/citoyen' },
]

/** Layout du parcours public : site vitrine, connexion et inscription. */
export function PublicLayout() {
  const { session, estConnecte } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-brand-900">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 lg:px-6">
          <Marque />
          <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {liens.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-brand-100 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            {estConnecte && session ? (
              <Button onClick={() => navigate(routeParDefaut(session.role))}>Accéder à mon espace</Button>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                >
                  Connexion
                </Link>
                <Button onClick={() => navigate('/inscription')}>Inscription</Button>
              </>
            )}
          </div>
          <button
            className="ml-auto text-white md:hidden"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-white/10 px-4 py-3 md:hidden" aria-label="Navigation mobile">
            {liens.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-100 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
              {estConnecte && session ? (
                <Button className="flex-1" onClick={() => navigate(routeParDefaut(session.role))}>
                  Accéder à mon espace
                </Button>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-lg border border-white/25 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/10"
                  >
                    Connexion
                  </Link>
                  <Button className="flex-1" onClick={() => navigate('/inscription')}>
                    Inscription
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-200 bg-white px-4 py-3 text-[11px] text-ink-500 lg:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2">
          <span>{MENTION_DEMO}</span>
          <span className="flex gap-3">
            <Link to="/portail/public" className="hover:text-brand-700">
              Transparence
            </Link>
            <Link to="/portail/citoyen" className="hover:text-brand-700">
              Signaler un besoin
            </Link>
            <Link to="/connexion" className="hover:text-brand-700">
              Espace interne
            </Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
