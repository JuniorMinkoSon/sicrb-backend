import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { navigation } from '../../constants/nav'
import type { RoleApplicatif } from '../../types/roles'

/**
 * Garde d'habilitation des routes internes.
 *
 * Les rôles étaient déclarés dans la navigation, et n'agissaient que sur elle :
 * une entrée de menu disparaissait pour qui n'y avait pas droit, mais l'adresse
 * restait ouverte. Saisir `/finances` dans la barre du navigateur suffisait donc
 * à ouvrir un écran que le menu refusait — le cachait sans l'interdire.
 *
 * Le dossier institutionnel est explicite : « nul n'accède à plus
 * d'informations que nécessaire ». La règle est donc appliquée à la route, et
 * elle est lue dans la même déclaration que le menu : deux listes finiraient
 * par diverger, et c'est la plus permissive qui ferait foi sans qu'on le
 * remarque.
 *
 * Cette garde protège l'affichage. Elle ne remplace pas le contrôle serveur —
 * qui reste le seul à faire autorité, un navigateur pouvant toujours appeler
 * l'API directement.
 */

/** Rôles autorisés sur une adresse, d'après la déclaration de navigation. */
export function rolesAutorises(chemin: string): RoleApplicatif[] | null {
  let trouve: RoleApplicatif[] | null = null
  let longueur = -1

  for (const groupe of navigation) {
    for (const item of groupe.items) {
      // La correspondance la plus longue gagne : /projets/:id relève de
      // /projets, mais /portail/entrepreneur ne relève pas de /portail.
      const correspond = chemin === item.to || chemin.startsWith(item.to + '/')
      if (correspond && item.to.length > longueur) {
        trouve = item.roles
        longueur = item.to.length
      }
    }
  }
  return trouve
}

export function RequireRole() {
  const { session } = useAuth()
  const location = useLocation()

  const autorises = rolesAutorises(location.pathname)

  // Une adresse qu'aucune entrée ne couvre n'est pas pour autant ouverte à
  // tous : mieux vaut la laisser passer ici et la voir tomber sur la page
  // d'erreur que d'inventer une règle. Les routes internes sont toutes
  // déclarées ; celle qui ne le serait pas est un oubli à corriger, pas une
  // permission à accorder.
  if (!autorises || !session) {
    return <Outlet />
  }

  if (!autorises.includes(session.role)) {
    // Renvoi vers le tableau de bord plutôt qu'une page d'erreur : l'utilisateur
    // n'a rien fait de mal, il a suivi un lien qui ne le concernait pas.
    return <Navigate to="/dashboard" replace state={{ refuse: location.pathname }} />
  }

  return <Outlet />
}
