import { useCallback, useMemo, useState } from 'react'
import type { PageQuery } from '../types/domain'

/**
 * Gère recherche / filtres / tri / pagination d'une liste. La requête produite
 * est transmise telle quelle au service : aucun filtrage n'est fait dans l'UI.
 */
export function useTableQuery(initial: PageQuery = {}) {
  const [q, setQ] = useState(String(initial.q ?? ''))
  const [page, setPage] = useState(Number(initial.page ?? 1))
  const [size, setSize] = useState(Number(initial.size ?? 10))
  const [sort, setSort] = useState<string | undefined>(initial.sort as string | undefined)
  const [filtres, setFiltres] = useState<Record<string, string>>({})

  const setFiltre = useCallback((key: string, value: string) => {
    setPage(1)
    setFiltres((prev) => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setQ('')
    setFiltres({})
    setPage(1)
    setSort(initial.sort as string | undefined)
  }, [initial.sort])

  const query = useMemo<PageQuery>(() => {
    const actifs = Object.fromEntries(Object.entries(filtres).filter(([, v]) => v !== ''))
    return { ...initial, ...actifs, q: q || undefined, page, size, sort }
  }, [filtres, initial, page, q, size, sort])

  return {
    query,
    q,
    setQ: (v: string) => {
      setPage(1)
      setQ(v)
    },
    page,
    setPage,
    size,
    setSize: (v: number) => {
      setPage(1)
      setSize(v)
    },
    sort,
    setSort,
    filtres,
    setFiltre,
    reset,
  }
}
