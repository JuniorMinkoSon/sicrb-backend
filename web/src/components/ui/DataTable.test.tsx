import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataTable, type Column } from './DataTable'
import type { Page } from '../../types/domain'

interface Row {
  id: string
  nom: string
}

const columns: Column<Row>[] = [{ key: 'nom', header: 'Intitulé', render: (r) => r.nom }]

const page = (items: Row[]): Page<Row> => ({ items, total: items.length, page: 1, size: 10 })

describe('DataTable', () => {
  it('affiche les lignes de la page renvoyée par le service', () => {
    render(<DataTable columns={columns} page={page([{ id: '1', nom: 'Adduction Boundiali' }])} isLoading={false} rowKey={(r) => r.id} />)
    expect(screen.getByText('Adduction Boundiali')).toBeInTheDocument()
    expect(screen.getByText('Intitulé')).toBeInTheDocument()
  })

  it('affiche un état vide explicite quand la page est vide', () => {
    render(<DataTable columns={columns} page={page([])} isLoading={false} rowKey={(r) => r.id} emptyTitle="Aucun projet" />)
    expect(screen.getByText('Aucun projet')).toBeInTheDocument()
  })

  it('affiche un état d’erreur avec possibilité de réessayer', () => {
    render(<DataTable columns={columns} isLoading={false} error={new Error('service indisponible')} onRetry={() => {}} rowKey={(r) => r.id} />)
    expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument()
  })
})
