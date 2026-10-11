import type { ReactNode } from 'react'
import { cn } from './cn'

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className={cn('w-full border-collapse text-sm', className)}>{children}</table>
    </div>
  )
}

export const Thead = ({ children }: { children: ReactNode }) => (
  <thead className="sticky top-0 z-10 bg-ink-50 text-left text-[11px] uppercase tracking-[0.06em] text-ink-500">{children}</thead>
)

export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <th scope="col" className={cn('whitespace-nowrap border-b border-ink-200 px-3 py-2.5 font-semibold', className)}>
    {children}
  </th>
)

export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <td className={cn('px-3 py-2.5 align-middle text-ink-800', className)}>{children}</td>
)

export const Tr = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <tr
    onClick={onClick}
    onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick()) : undefined}
    tabIndex={onClick ? 0 : undefined}
    role={onClick ? 'button' : undefined}
    className={cn(
      'border-b border-ink-100 transition-colors last:border-0',
      onClick && 'cursor-pointer hover:bg-brand-50/70 focus-visible:bg-brand-50',
      className,
    )}
  >
    {children}
  </tr>
)
