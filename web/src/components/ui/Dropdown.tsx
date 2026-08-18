import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface DropdownAction {
  label: string
  onSelect: () => void
  danger?: boolean
}

export function Dropdown({ label, actions, icon }: { label: string; actions: DropdownAction[]; icon?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-ink-300 bg-white px-3 text-sm text-ink-800 hover:bg-ink-50"
      >
        {icon}
        {label}
        <ChevronDown className="size-4" aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-md border border-ink-200 bg-white py-1 shadow-lg">
          {actions.map((a) => (
            <button
              key={a.label}
              role="menuitem"
              onClick={() => {
                a.onSelect()
                setOpen(false)
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-ink-50 ${a.danger ? 'text-red-700' : 'text-ink-800'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
