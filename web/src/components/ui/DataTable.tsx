import { useMemo, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import type { Page } from '../../types/domain'
import { EmptyState, ErrorState, LoadingState } from './States'
import { Pagination } from './Pagination'
import { Table, Td, Th, Thead, Tr } from './Table'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortable?: boolean
  className?: string
}

interface Props<T> {
  columns: Column<T>[]
  page?: Page<T>
  isLoading: boolean
  error?: unknown
  onRetry?: () => void
  sort?: string
  onSort?: (sort: string) => void
  onPage?: (page: number) => void
  onSize?: (size: number) => void
  onRowClick?: (row: T) => void
  rowKey: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
}

/**
 * Table pilotée par une page renvoyée par le service (tri + pagination côté
 * service/adapter, jamais recalculés dans le composant).
 */
export function DataTable<T>({
  columns,
  page,
  isLoading,
  error,
  onRetry,
  sort,
  onSort,
  onPage,
  onSize,
  onRowClick,
  rowKey,
  emptyTitle = 'Aucun résultat',
  emptyDescription = 'Ajustez la recherche ou les filtres pour élargir la sélection.',
}: Props<T>) {
  const [sortField, sortDir] = useMemo(() => (sort ? sort.split(':') : [undefined, undefined]), [sort])

  if (error) return <ErrorState error={error} onRetry={onRetry} />
  if (isLoading && !page) return <LoadingState rows={6} />
  if (page && page.total === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div className={isLoading ? 'opacity-60 transition-opacity' : undefined}>
      <Table>
        <Thead>
          <tr>
            {columns.map((c) => (
              <Th key={c.key} className={c.className}>
                {c.sortable && onSort ? (
                  <button
                    className="inline-flex items-center gap-1 hover:text-ink-800"
                    onClick={() => onSort(`${c.key}:${sortField === c.key && sortDir === 'asc' ? 'desc' : 'asc'}`)}
                  >
                    {c.header}
                    {sortField !== c.key ? (
                      <ChevronsUpDown className="size-3" aria-hidden />
                    ) : sortDir === 'asc' ? (
                      <ArrowUp className="size-3" aria-hidden />
                    ) : (
                      <ArrowDown className="size-3" aria-hidden />
                    )}
                  </button>
                ) : (
                  c.header
                )}
              </Th>
            ))}
          </tr>
        </Thead>
        <tbody>
          {page?.items.map((row) => (
            <Tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}>
              {columns.map((c) => (
                <Td key={c.key} className={c.className}>
                  {c.render(row)}
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
      {page && onPage && <Pagination page={page.page} size={page.size} total={page.total} onPage={onPage} onSize={onSize} />}
    </div>
  )
}
