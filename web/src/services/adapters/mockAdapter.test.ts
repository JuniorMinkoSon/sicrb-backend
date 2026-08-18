import { describe, expect, it } from 'vitest'
import { mockAdapter } from './mockAdapter'
import { adapter, apiMode } from './index'

describe('adapter de démonstration', () => {
  it('est sélectionné par défaut (aucun endpoint Quarkus métier disponible)', () => {
    expect(apiMode).toBe('mock')
    expect(adapter).toBe(mockAdapter)
  })

  it('filtre et pagine les projets côté adapter, pas côté composant', async () => {
    const page1 = await mockAdapter.projets({ page: 1, size: 5 })
    expect(page1.items).toHaveLength(5)
    expect(page1.total).toBeGreaterThan(5)

    const eau = await mockAdapter.projets({ secteur: 'EAU', size: 100 })
    expect(eau.items.length).toBeGreaterThan(0)
    expect(eau.items.every((p) => p.secteur === 'EAU')).toBe(true)
  })

  it('expose un détail de projet relié à son programme et à ses jalons', async () => {
    const { items } = await mockAdapter.projets({ size: 1 })
    const detail = await mockAdapter.projet(items[0].id)
    expect(detail.projet.id).toBe(items[0].id)
    expect(Array.isArray(detail.jalons)).toBe(true)
  })

  it('traite une étape de workflow de façon idempotente', async () => {
    const { items } = await mockAdapter.workflows({ statut: 'EN_COURS', size: 1 })
    const wf = items[0]
    const courante = wf.etapes.find((e) => e.statut === 'EN_COURS')!

    const apres = await mockAdapter.traiterEtape({
      workflowId: wf.id,
      etapeId: courante.id,
      decision: 'VALIDE',
      commentaire: 'Contrôle effectué',
    })
    const etape = apres.etapes.find((e) => e.id === courante.id)!
    expect(etape.statut).toBe('VALIDE')

    const rejeu = await mockAdapter.traiterEtape({
      workflowId: wf.id,
      etapeId: courante.id,
      decision: 'REJETE',
    })
    expect(rejeu.etapes.find((e) => e.id === courante.id)!.statut).toBe('VALIDE')
  })

  it('persiste une requête citoyenne déposée', async () => {
    const avant = await mockAdapter.requetes({ size: 1 })
    const territoires = await mockAdapter.territoires({ size: 1 })
    const creee = await mockAdapter.deposerRequete({
      objet: 'Réhabilitation du forage du quartier',
      territoireId: territoires.items[0].id,
      categorie: 'EAU',
    })
    const apres = await mockAdapter.requetes({ size: 1 })
    expect(apres.total).toBe(avant.total + 1)
    expect(creee.statut).toBeDefined()
  })

  it('renvoie une recherche transversale avec des liens de navigation', async () => {
    const resultats = await mockAdapter.recherche('projet')
    expect(resultats.length).toBeGreaterThan(0)
    expect(resultats.every((r) => r.href.startsWith('/'))).toBe(true)
  })
})
