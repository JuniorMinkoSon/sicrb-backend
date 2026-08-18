import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRecherche } from '../../hooks/useApi'

/** Recherche transversale (projets, programmes, prestataires, GED, territoires). */
export function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const { data, isFetching } = useRecherche(q)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-ink-400" aria-hidden />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Rechercher un projet, un programme, un prestataire, un document…"
        aria-label="Recherche transversale"
        className="h-9 w-full rounded-md border border-ink-300 bg-white pl-9 pr-3 text-sm placeholder:text-ink-400"
      />
      {open && q.trim().length >= 2 && (
        <div className="absolute z-40 mt-1 max-h-80 w-full overflow-auto rounded-md border border-ink-200 bg-white py-1 shadow-lg">
          {isFetching && <p className="px-3 py-2 text-xs text-ink-500">Recherche…</p>}
          {!isFetching && (data?.length ?? 0) === 0 && <p className="px-3 py-2 text-xs text-ink-500">Aucun résultat.</p>}
          {data?.map((r) => (
            <button
              key={`${r.module}-${r.href}-${r.libelle}`}
              onClick={() => {
                setOpen(false)
                setQ('')
                navigate(r.href)
              }}
              className="block w-full px-3 py-2 text-left hover:bg-ink-50"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">{r.module}</span>
              <p className="text-sm text-ink-900">{r.libelle}</p>
              <p className="text-xs text-ink-500">{r.sousTitre}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
