import { CalendarRange } from 'lucide-react'
import { useExercice } from '../../hooks/useExercice'
import { useLignes } from '../../hooks/useApi'

/**
 * Exercice budgétaire de travail. Les exercices proposés proviennent du service
 * financier (jamais du jeu de données directement).
 */
export function ExerciceSelector() {
  const { exercice, setExercice } = useExercice()
  const { data } = useLignes({ size: 200 })
  const exercices = Array.from(new Set((data?.items ?? []).map((l) => l.exercice)))
    .sort((a, b) => b - a)
    .map(String)

  if (exercices.length === 0) return null

  return (
    <label className="hidden items-center gap-2 rounded-lg border border-ink-300 bg-white px-2.5 py-1.5 text-xs text-ink-600 sm:inline-flex">
      <CalendarRange className="size-4 text-ink-400" aria-hidden />
      <span className="sr-only">Exercice budgétaire</span>
      <select
        value={exercice}
        onChange={(e) => setExercice(e.target.value)}
        aria-label="Exercice budgétaire"
        className="bg-transparent text-xs font-medium text-ink-800 focus:outline-none"
      >
        <option value="">Tous exercices</option>
        {exercices.map((e) => (
          <option key={e} value={e}>
            Exercice {e}
          </option>
        ))}
      </select>
    </label>
  )
}
