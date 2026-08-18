import type { Page, PageQuery } from '../types/domain'

/** Recherche plein texte simple sur les champs textuels d'un enregistrement. */
export function matchesText(row: unknown, q?: string): boolean {
  if (!q || !q.trim()) return true
  const needle = q.trim().toLowerCase()
  return JSON.stringify(row ?? {}).toLowerCase().includes(needle)
}

export function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), 'fr')
}

/**
 * Applique tri + pagination côté "serveur" (ici l'adapter mock) afin que les
 * composants ne manipulent jamais que des pages, comme avec l'API Quarkus.
 */
export function paginate<T extends Record<string, unknown>>(rows: T[], query: PageQuery = {}): Page<T> {
  const { page = 1, size = 10, sort } = query
  let out = rows
  if (sort) {
    const [field, dir = 'asc'] = sort.split(':')
    out = [...rows].sort((a, b) => (dir === 'desc' ? -1 : 1) * compare(a[field], b[field]))
  }
  const total = out.length
  const safeSize = Math.min(Math.max(size, 1), 200)
  const start = (Math.max(page, 1) - 1) * safeSize
  return { items: out.slice(start, start + safeSize), total, page: Math.max(page, 1), size: safeSize }
}

export const eq = (value: unknown, filter?: string | number) =>
  filter === undefined || filter === '' || filter === null ? true : String(value) === String(filter)

/** Latence simulée : permet de voir réellement les états de chargement. */
export const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))
