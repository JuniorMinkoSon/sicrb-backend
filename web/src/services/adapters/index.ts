import { mockAdapter } from './mockAdapter'
import { quarkusAdapter } from './quarkusAdapter'
import type { SicrbApi } from '../contracts'

export type ApiMode = 'mock' | 'http'

export const apiMode: ApiMode = (import.meta.env.VITE_API_MODE as ApiMode) ?? 'mock'

/**
 * Sélection de l'adapter : les mocks aujourd'hui, le backend Quarkus dès que ses
 * ressources REST existent (`VITE_API_MODE=http`). Les pages, features et hooks
 * ne connaissent que le contrat `SicrbApi`.
 */
export const adapter: SicrbApi = apiMode === 'http' ? quarkusAdapter : mockAdapter

export { mockAdapter, quarkusAdapter }
