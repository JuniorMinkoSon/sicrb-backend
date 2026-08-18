/**
 * Couche SERVICE : point d'entrée unique de l'UI vers les données.
 * PAGE → FEATURE → HOOK → SERVICE → ADAPTER → (MOCK | QUARKUS REST API)
 */
import { adapter, apiMode } from './adapters'
import type { SicrbApi } from './contracts'

export const sicrbService: SicrbApi = adapter
export { apiMode }
export type { SicrbApi }
export * from './contracts'
