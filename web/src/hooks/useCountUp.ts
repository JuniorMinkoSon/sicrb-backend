import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Compteur animé pour les indicateurs clés : interpolation en `requestAnimationFrame`,
 * désactivée si l'utilisateur a demandé une réduction des animations.
 */
export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const depart = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion() || !Number.isFinite(target)) {
      setValue(target)
      return
    }
    const from = depart.current
    const debut = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - debut) / duration)
      const eased = 1 - (1 - t) ** 3
      const courant = from + (target - from) * eased
      setValue(courant)
      if (t < 1) frame = requestAnimationFrame(tick)
      else depart.current = target
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}
