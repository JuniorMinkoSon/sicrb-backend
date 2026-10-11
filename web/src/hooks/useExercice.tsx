import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface ExerciceContextValue {
  exercice: string
  setExercice: (exercice: string) => void
}

const ExerciceContext = createContext<ExerciceContextValue | null>(null)

const STORAGE_KEY = 'sicrb.exercice'

/**
 * Exercice budgétaire courant, partagé par l'en-tête et les modules financiers.
 * Valeur vide = tous les exercices.
 */
export function ExerciceProvider({ children }: { children: ReactNode }) {
  const [exercice, setExercice] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? '')

  const value = useMemo<ExerciceContextValue>(
    () => ({
      exercice,
      setExercice: (e) => {
        setExercice(e)
        if (e) localStorage.setItem(STORAGE_KEY, e)
        else localStorage.removeItem(STORAGE_KEY)
      },
    }),
    [exercice],
  )

  return <ExerciceContext.Provider value={value}>{children}</ExerciceContext.Provider>
}

export function useExercice(): ExerciceContextValue {
  const ctx = useContext(ExerciceContext)
  if (!ctx) throw new Error('useExercice doit être utilisé dans ExerciceProvider')
  return ctx
}
