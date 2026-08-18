import type { ReactNode } from 'react'
import { cn } from './cn'

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-sm', className)}>{children}</table>
    </div>
  )
}

export const Thead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">{children}</thead>
)

export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <th scope="col" className={cn('whitespace-nowrap px-3 py-2 font-semibold', className)}>
    {children}
  </th>
)

export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <td className={cn('px-3 py-2 align-middle text-ink-800', className)}>{children}</td>
)

export const Tr = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <tr onClick={onClick} className={cn('border-b border-ink-100 last:border-0', onClick && 'cursor-pointer hover:bg-brand-50/60', className)}>
    {children}
  </tr>
)
