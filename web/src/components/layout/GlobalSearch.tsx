import { useEffect, useMemo, useRef, useState } from 'react'
import { CornerDownLeft, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRecherche } from '../../hooks/useApi'
import { cn } from '../ui/cn'

const estMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** Recherche transversale (projets, programmes, prestataires, GED, territoires). */
export function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const { data, isFetching } = useRecherche(q)
  const resultats = useMemo(() => data ?? [], [data])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        input.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => setIndex(0), [q])

  const ouvrir = (href: string) => {
    setOpen(false)
    setQ('')
    input.current?.blur()
    navigate(href)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      input.current?.blur()
      return
    }
    if (resultats.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (i + 1) % resultats.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (i - 1 + resultats.length) % resultats.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      ouvrir(resultats[index].href)
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-ink-400" aria-hidden />
      <input
        ref={input}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Rechercher un projet, un programme, un prestataire, un document…"
        aria-label="Recherche transversale"
        role="combobox"
        aria-expanded={open}
        aria-controls="resultats-recherche"
        className="h-9.5 w-full rounded-lg border border-ink-300 bg-ink-50/60 pl-9 pr-24 text-sm transition-colors placeholder:text-ink-400 focus:border-brand-400 focus:bg-white"
      />
      <div className="absolute right-2 top-1.5 flex items-center gap-1">
        {q && (
          <button aria-label="Effacer la recherche" onClick={() => setQ('')} className="rounded p-1 text-ink-400 hover:text-ink-700">
            <X className="size-3.5" aria-hidden />
          </button>
        )}
        <kbd className="hidden rounded border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-400 lg:block">
          {estMac() ? '⌘' : 'Ctrl'} K
        </kbd>
      </div>

      {open && q.trim().length >= 2 && (
        <div
          id="resultats-recherche"
          role="listbox"
          className="absolute z-40 mt-1.5 max-h-96 w-full overflow-auto rounded-xl border border-ink-200 bg-white py-1 shadow-lg"
        >
          {isFetching && <p className="px-3 py-2 text-xs text-ink-500">Recherche…</p>}
          {!isFetching && resultats.length === 0 && <p className="px-3 py-2 text-xs text-ink-500">Aucun résultat.</p>}
          {resultats.map((r, i) => (
            <button
              key={`${r.module}-${r.href}-${r.libelle}`}
              role="option"
              aria-selected={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={() => ouvrir(r.href)}
              className={cn('flex w-full items-center gap-3 px-3 py-2 text-left', i === index ? 'bg-brand-50' : 'hover:bg-ink-50')}
            >
              <span className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">{r.module}</span>
                <span className="block truncate text-sm text-ink-900">{r.libelle}</span>
                <span className="block truncate text-xs text-ink-500">{r.sousTitre}</span>
              </span>
              {i === index && <CornerDownLeft className="size-3.5 shrink-0 text-brand-500" aria-hidden />}
            </button>
          ))}
          {resultats.length > 0 && (
            <p className="border-t border-ink-100 px-3 py-1.5 text-[10px] text-ink-400">
              ↑ ↓ pour naviguer · Entrée pour ouvrir · Échap pour fermer
            </p>
          )}
        </div>
      )}
    </div>
  )
}
