import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAlertes } from '../../hooks/useApi'
import { Badge } from '../ui/Badge'
import { Drawer } from '../ui/Drawer'
import { formatDateHeure } from '../../utils/format'

const tone = { CRITIQUE: 'danger', VIGILANCE: 'warning', INFO: 'info' } as const

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const { data: alertes = [], isLoading } = useAlertes()
  const critiques = alertes.filter((a) => a.niveau === 'CRITIQUE').length

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Notifications (${alertes.length})`}
        className="relative inline-flex size-9 items-center justify-center rounded-md border border-ink-300 bg-white text-ink-600 hover:bg-ink-50"
      >
        <Bell className="size-4" aria-hidden />
        {critiques > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-4 justify-center rounded-full bg-red-700 px-1 text-[10px] font-semibold text-white">
            {critiques}
          </span>
        )}
      </button>
      <Drawer open={open} title="Alertes et notifications" onClose={() => setOpen(false)}>
        {isLoading && <p className="text-xs text-ink-500">Chargement…</p>}
        <ul className="space-y-3">
          {alertes.map((a) => (
            <li key={a.id} className="rounded-md border border-ink-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-ink-900">{a.titre}</p>
                <Badge tone={tone[a.niveau]}>{a.niveau}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-600">{a.detail}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
                <span>{formatDateHeure(a.detecteLe)}</span>
                <Link to={a.moduleCible} onClick={() => setOpen(false)} className="font-medium text-brand-700 underline">
                  Ouvrir le module
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  )
}
