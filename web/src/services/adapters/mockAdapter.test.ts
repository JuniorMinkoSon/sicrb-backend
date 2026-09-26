import { describe, expect, it } from 'vitest'
import { mockAdapter } from './mockAdapter'
import { quarkusAdapter } from './quarkusAdapter'
import { adapter, apiMode } from './index'

describe('adapter de démonstration', () => {
  /**
   * Ce test affirmait que le mode « mock » était retenu par défaut, « aucun
   * endpoint Quarkus métier » n'existant. Le backend les expose désormais tous,
   * et la prémisse est donc fausse : c'est la configuration qui tranche.
   *
   * On vérifie ce qui doit rester vrai dans les deux cas — que le mode déclaré
   * et l'adaptateur retenu ne se contredisent jamais. Une divergence ferait
   * appeler les mocks en croyant parler au serveur, ou l'inverse.
   */
  it('retient l’adaptateur correspondant au mode déclaré', () => {
    expect(['mock', 'http']).toContain(apiMode)
    expect(adapter).toBe(apiMode === 'http' ? quarkusAdapter : mockAdapter)
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

  it('ouvre au plus un point a la fois dans une seance', async () => {
    // Le point en cours n'est pas un champ : c'est celui que son statut
    // designe. Deux points ouverts simultanement afficheraient deux votes
    // concurrents, et rien dans le type n'empeche ce cas.
    const { items } = await mockAdapter.sessions({ size: 200 })
    for (const s of items) {
      const { points, paroles } = await mockAdapter.session(s.id)
      const ouverts = points.filter((p) => p.statut === 'EN_DISCUSSION' || p.statut === 'VOTE_EN_COURS')
      expect(ouverts.length).toBeLessThanOrEqual(1)

      // Une seance qui ne s'est pas tenue n'a rien vote.
      if (s.statut === 'PLANIFIEE') {
        expect(points.every((p) => p.statut === 'A_EXAMINER')).toBe(true)
        expect(paroles).toHaveLength(0)
      }

      // Les suffrages ne peuvent pas depasser les presents : un decompte
      // invraisemblable decredibiliserait tout l'ecran.
      points
        .filter((p) => p.pour !== null)
        .forEach((p) => {
          expect(p.pour! + p.contre! + p.abstention!).toBeLessThanOrEqual(s.presents)
        })

      // Le compteur de la seance doit correspondre aux actes adoptes.
      expect(s.deliberations).toBe(points.filter((p) => p.statut === 'ADOPTE').length)
    }
  })

  it('renvoie une recherche transversale avec des liens de navigation', async () => {
    const resultats = await mockAdapter.recherche('projet')
    expect(resultats.length).toBeGreaterThan(0)
    expect(resultats.every((r) => r.href.startsWith('/'))).toBe(true)
  })
})
