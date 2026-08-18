const fcfa = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

export const formatFcfa = (n: number) => `${fcfa.format(Math.round(n))} FCFA`

export function formatFcfaCourt(n: number): string {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Md FCFA`
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} M FCFA`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)} k FCFA`
  return `${n} FCFA`
}

export const formatNombre = (n: number) => fcfa.format(n)

export const formatPourcent = (n: number) => `${Math.round(n)} %`

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateHeure(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const humaniser = (code?: string | null) =>
  !code ? '—' : code.charAt(0) + code.slice(1).toLowerCase().replaceAll('_', ' ')
