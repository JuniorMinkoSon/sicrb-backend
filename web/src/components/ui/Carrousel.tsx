import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './cn'

/**
 * Un défilement horizontal à flèches.
 *
 * Les pages alignaient leurs vignettes en grille : au-delà de quatre, la liste
 * poussait le reste de la page vers le bas et l'on ne voyait plus rien d'autre.
 * Un rang qui défile tient dans une hauteur fixe quel que soit le nombre
 * d'éléments.
 *
 * Le défilement natif fait le travail — `scroll-snap` pour l'accrochage, la
 * molette et le geste tactile pour tout le reste. Aucune dépendance, et le
 * clavier fonctionne sans rien écrire : le conteneur est focusable et les
 * flèches du navigateur y défilent déjà.
 *
 * Les boutons ne sont affichés que s'il y a de quoi défiler, et désactivés aux
 * extrémités : une flèche qui ne fait rien est une promesse non tenue.
 */
export function Carrousel({
  children,
  ariaLabel,
  className,
  itemClassName = 'w-[19rem]',
}: {
  children: React.ReactNode
  /** Ce que le rang contient, pour qui navigue au lecteur d'écran. */
  ariaLabel: string
  className?: string
  /** Largeur d'une vignette. Fixe, sans quoi l'accrochage n'a pas de repère. */
  itemClassName?: string
}) {
  const piste = useRef<HTMLDivElement>(null)
  const [peutReculer, setPeutReculer] = useState(false)
  const [peutAvancer, setPeutAvancer] = useState(false)

  const jauger = useCallback(() => {
    const el = piste.current
    if (!el) return
    // Une marge d'un pixel : les navigateurs arrondissent, et sans elle la
    // flèche de fin reste active alors qu'il n'y a plus rien à voir.
    setPeutReculer(el.scrollLeft > 1)
    setPeutAvancer(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = piste.current
    if (!el) return
    jauger()
    // Le contenu arrive souvent après le premier rendu (requête en cours) et
    // la mise en page change à la rotation : sans observateur, les flèches
    // resteraient figées sur l'état d'un conteneur vide.
    const obs = new ResizeObserver(jauger)
    obs.observe(el)
    return () => obs.disconnect()
  }, [jauger, children])

  const defiler = (sens: -1 | 1) => {
    const el = piste.current
    if (!el) return
    el.scrollBy({ left: sens * Math.max(el.clientWidth * 0.8, 240), behavior: 'smooth' })
  }

  const flecheVisible = peutReculer || peutAvancer

  return (
    <div className={cn('relative', className)}>
      <div
        ref={piste}
        onScroll={jauger}
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2',
          // La barre de défilement reste atteignable à la souris et au doigt ;
          // on la discrétise seulement.
          '[scrollbar-width:thin]',
        )}
      >
        {Array.isArray(children)
          ? children.map((enfant, i) => (
              <div key={i} className={cn('shrink-0 snap-start', itemClassName)}>
                {enfant}
              </div>
            ))
          : children}
      </div>

      {flecheVisible && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between lg:flex">
          <Fleche sens={-1} actif={peutReculer} onClick={() => defiler(-1)} />
          <Fleche sens={1} actif={peutAvancer} onClick={() => defiler(1)} />
        </div>
      )}
    </div>
  )
}

function Fleche({ sens, actif, onClick }: { sens: -1 | 1; actif: boolean; onClick: () => void }) {
  const Icone = sens === -1 ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!actif}
      aria-label={sens === -1 ? 'Voir les éléments précédents' : 'Voir les éléments suivants'}
      className={cn(
        'pointer-events-auto grid size-9 place-items-center rounded-full border border-ink-200 bg-white/95 shadow-sm transition',
        sens === -1 ? '-translate-x-1/2' : 'translate-x-1/2',
        actif ? 'text-ink-700 hover:border-brand-300 hover:text-brand-700' : 'cursor-default opacity-0',
      )}
    >
      <Icone className="size-4" aria-hidden />
    </button>
  )
}
