import {
  Banknote,
  Building2,
  ClipboardCheck,
  FileText,
  Gauge,
  Handshake,
  LayoutDashboard,
  Landmark,
  ListChecks,
  Map,
  MapPinned,
  Scale,
  Settings,
  ShieldCheck,
  Sprout,
  Target,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { RoleApplicatif } from '../types/roles'

export interface NavItem {
  label: string
  to: string
  roles: RoleApplicatif[]
  icon: LucideIcon
}

export interface NavGroup {
  /** Chaîne de valeur du cahier des charges PIGCR. */
  chaine: string
  items: NavItem[]
}

const TOUS: RoleApplicatif[] = ['PRESIDENT', 'DDP', 'DT', 'DAF', 'CONTROLLER', 'CONTRACTOR', 'ADMIN', 'PUBLIC', 'CITIZEN']

export const navigation: NavGroup[] = [
  {
    chaine: 'Gouvernance',
    items: [
      { label: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard, roles: ['PRESIDENT', 'DDP', 'DT', 'DAF', 'CONTROLLER', 'ADMIN'] },
      { label: 'Sessions & délibérations', to: '/gouvernance', icon: Landmark, roles: ['PRESIDENT', 'DDP', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Planification',
    items: [
      { label: 'PAI', to: '/pai', icon: Target, roles: ['PRESIDENT', 'DDP', 'DAF', 'ADMIN'] },
      { label: 'Programmes', to: '/programmes', icon: ListChecks, roles: ['PRESIDENT', 'DDP', 'DT', 'DAF', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Territoire',
    items: [
      { label: 'Territoire', to: '/territory', icon: MapPinned, roles: ['PRESIDENT', 'DDP', 'DT', 'ADMIN'] },
      { label: 'SIG cartographique', to: '/map', icon: Map, roles: ['PRESIDENT', 'DDP', 'DT', 'CONTROLLER', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Exécution',
    items: [
      { label: 'Projets', to: '/projets', icon: Sprout, roles: ['PRESIDENT', 'DDP', 'DT', 'DAF', 'CONTROLLER', 'CONTRACTOR', 'ADMIN'] },
      { label: 'Infrastructures', to: '/infrastructures', icon: Building2, roles: ['PRESIDENT', 'DT', 'CONTROLLER', 'ADMIN'] },
      { label: 'Maintenance', to: '/maintenance', icon: Wrench, roles: ['DT', 'CONTROLLER', 'ADMIN'] },
      { label: 'Équipements', to: '/equipements', icon: Truck, roles: ['DT', 'DAF', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Contrôle',
    items: [
      { label: 'Contrôleurs & missions', to: '/controleurs', icon: ClipboardCheck, roles: ['PRESIDENT', 'DT', 'CONTROLLER', 'ADMIN'] },
      { label: 'Workflows', to: '/workflows', icon: ShieldCheck, roles: ['PRESIDENT', 'DDP', 'DT', 'DAF', 'CONTROLLER', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Finances',
    items: [
      { label: 'Finances', to: '/finances', icon: Banknote, roles: ['PRESIDENT', 'DAF', 'ADMIN'] },
      { label: 'Prestataires', to: '/prestataires', icon: Handshake, roles: ['DT', 'DAF', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Documents',
    items: [
      { label: 'GED', to: '/documents', icon: FileText, roles: ['PRESIDENT', 'DDP', 'DT', 'DAF', 'CONTROLLER', 'CONTRACTOR', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Pilotage',
    items: [
      { label: 'Indicateurs', to: '/indicateurs', icon: Gauge, roles: ['PRESIDENT', 'DDP', 'DAF', 'ADMIN'] },
      { label: 'Impact territorial', to: '/impact', icon: Users, roles: ['PRESIDENT', 'DDP', 'ADMIN'] },
      { label: 'Aide à la décision', to: '/decision', icon: Scale, roles: ['PRESIDENT', 'DDP', 'DAF', 'ADMIN'] },
      { label: 'Rapports', to: '/rapports', icon: FileText, roles: ['PRESIDENT', 'DDP', 'DT', 'DAF', 'ADMIN'] },
      { label: 'Audit', to: '/audit', icon: ShieldCheck, roles: ['PRESIDENT', 'ADMIN'] },
    ],
  },
  {
    chaine: 'Administration',
    items: [{ label: 'Administration', to: '/administration', icon: Settings, roles: ['ADMIN'] }],
  },
  {
    chaine: 'Portails',
    items: [
      { label: 'Portail entrepreneur', to: '/portail/entrepreneur', icon: Handshake, roles: ['CONTRACTOR', 'DAF', 'ADMIN'] },
      { label: 'Portail public', to: '/portail/public', icon: Landmark, roles: TOUS },
      { label: 'Portail citoyen', to: '/portail/citoyen', icon: Users, roles: TOUS },
    ],
  },
]

/** Menu effectivement visible pour un rôle (filtrage ergonomique, pas de sécurité). */
export function navigationPourRole(role: RoleApplicatif): NavGroup[] {
  return navigation
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0)
}

/** Première route accessible au rôle : sert de redirection par défaut. */
export function routeParDefaut(role: RoleApplicatif): string {
  return navigationPourRole(role)[0]?.items[0]?.to ?? '/portail/public'
}
