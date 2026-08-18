import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'

type ToastLevel = 'success' | 'info' | 'error'

interface ToastItem {
  id: number
  level: ToastLevel
  message: string
}

interface ToastApi {
  notify: (message: string, level?: ToastLevel) => void
}

const ToastContext = createContext<ToastApi>({ notify: () => {} })

export const useToast = () => useContext(ToastContext)

const icons = { success: CircleCheck, info: Info, error: TriangleAlert }
const tones = {
  success: 'border-emerald-200 bg-white text-emerald-800',
  info: 'border-brand-200 bg-white text-brand-800',
  error: 'border-red-200 bg-white text-red-800',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const notify = useCallback((message: string, level: ToastLevel = 'success') => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, level, message }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4500)
  }, [])

  const api = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {items.map((t) => {
          const Icon = icons[t.level]
          return (
            <div key={t.id} className={`pointer-events-auto flex items-start gap-2 rounded-md border px-3 py-2 text-sm shadow-md ${tones[t.level]}`}>
              <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p className="flex-1">{t.message}</p>
              <button aria-label="Fermer la notification" onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}>
                <X className="size-4 text-ink-400" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
