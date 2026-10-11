import { describe, expect, it } from 'vitest'
import { navigation, navigationPourRole, routeParDefaut } from './nav'
import { ROLES_META, type RoleApplicatif } from '../types/roles'

const roles = Object.keys(ROLES_META) as RoleApplicatif[]

describe('navigation par rôle', () => {
  it('ne renvoie que des entrées autorisées et jamais de groupe vide', () => {
    for (const role of roles) {
      const groupes = navigationPourRole(role)
      expect(groupes.length).toBeGreaterThan(0)
      for (const g of groupes) {
        expect(g.items.length).toBeGreaterThan(0)
        expect(g.items.every((i) => i.roles.includes(role))).toBe(true)
      }
    }
  })

  it('donne une route par défaut atteignable pour chaque rôle', () => {
    for (const role of roles) {
      const route = routeParDefaut(role)
      expect(route.startsWith('/')).toBe(true)
    }
  })

  it('restreint les portails public et citoyen aux rôles concernés', () => {
    const items = navigation.flatMap((g) => g.items)
    const publicItem = items.find((i) => i.to === '/portail/public')!
    expect(publicItem.roles).toContain('PUBLIC')
  })
})
