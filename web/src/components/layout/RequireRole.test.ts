import { describe, expect, it } from 'vitest'
import { rolesAutorises } from './RequireRole'

/**
 * L'habilitation des routes est un contrôle de sécurité : elle mérite d'être
 * vérifiée, pas seulement écrite. Le menu masquait déjà les entrées interdites,
 * mais l'adresse restait ouverte — c'est exactement ce que ces cas éprouvent.
 */
describe('habilitation des routes internes', () => {
  it('reprend les rôles déclarés pour la navigation', () => {
    expect(rolesAutorises('/gouvernance')).toEqual(['PRESIDENT', 'DDP', 'ADMIN'])
  })

  it('étend la règle d’une rubrique à ses fiches', () => {
    // /projets/prj-12 n'est pas déclaré : il relève de /projets.
    expect(rolesAutorises('/projets/prj-12')).toEqual(rolesAutorises('/projets'))
  })

  it('retient la correspondance la plus longue, pas la première', () => {
    // /portail/entrepreneur ne doit pas hériter d'une éventuelle règle sur
    // /portail : deux rubriques dont l'une préfixe l'autre sont un piège
    // classique de ce genre de résolution.
    const entrepreneur = rolesAutorises('/portail/entrepreneur')
    expect(entrepreneur).not.toBeNull()
    expect(entrepreneur).toContain('CONTRACTOR')
  })

  it('ne connaît pas les adresses non déclarées', () => {
    expect(rolesAutorises('/rubrique-inexistante')).toBeNull()
  })

  it('n’ouvre les finances qu’aux profils qui en répondent', () => {
    const finances = rolesAutorises('/finances')
    expect(finances).not.toBeNull()
    expect(finances).not.toContain('CITIZEN')
    expect(finances).not.toContain('CONTRACTOR')
    expect(finances).toContain('DAF')
  })
})
