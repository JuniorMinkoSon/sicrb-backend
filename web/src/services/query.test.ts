import { describe, expect, it } from 'vitest'
import { eq, matchesText, paginate } from './query'

interface Row {
  id: string
  nom: string
  montant: number
}

const rows: Row[] = [
  { id: '1', nom: 'Boundiali', montant: 300 },
  { id: '2', nom: 'Kouto', montant: 100 },
  { id: '3', nom: 'Tengrela', montant: 200 },
]

describe('couche de requête (tri/pagination/filtres)', () => {
  it('pagine sans dépasser les bornes', () => {
    const p = paginate(rows, { page: 2, size: 2 })
    expect(p.total).toBe(3)
    expect(p.items).toHaveLength(1)
    expect(p.items[0].id).toBe('3')
  })

  it('trie sur un champ numérique dans les deux sens', () => {
    expect(paginate(rows, { sort: 'montant:asc' }).items.map((r) => r.id)).toEqual(['2', '3', '1'])
    expect(paginate(rows, { sort: 'montant:desc' }).items.map((r) => r.id)).toEqual(['1', '3', '2'])
  })

  it('trie les libellés selon la locale française', () => {
    expect(paginate(rows, { sort: 'nom:asc' }).items[0].nom).toBe('Boundiali')
  })

  it('filtre en texte libre et par égalité', () => {
    expect(matchesText(rows[0], 'boundiali')).toBe(true)
    expect(matchesText(rows[0], 'ferké')).toBe(false)
    expect(eq('EAU', '')).toBe(true)
    expect(eq('EAU', 'SANTE')).toBe(false)
  })
})
