import { User, Department, Service } from '../../types'

export const mockUsers: User[] = [
  {
    id: 'user-dg-001',
    firstName: 'Konan',
    lastName: 'Yao',
    email: 'dg@sicrb.ci',
    phone: '+225 07 00 00 00',
    role: 'DG',
    position: 'Directeur Général',
    delegatedPower: 50000000,
    delegationEndDate: '2026-12-31',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-director-001',
    firstName: 'Marie',
    lastName: 'Touré',
    email: 'marie.toure@sicrb.ci',
    phone: '+225 07 00 00 01',
    role: 'DIRECTOR',
    department: 'Administration',
    position: 'Directeur Administration',
    delegatedPower: 20000000,
    delegationEndDate: '2026-12-31',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-finance-001',
    firstName: 'Jean',
    lastName: 'Kouamé',
    email: 'finance@sicrb.ci',
    phone: '+225 07 00 00 02',
    role: 'FINANCE',
    department: 'Finance',
    position: 'Trésorier',
    delegatedPower: 15000000,
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-hr-001',
    firstName: 'Awa',
    lastName: 'Diallo',
    email: 'hr@sicrb.ci',
    phone: '+225 07 00 00 03',
    role: 'HR',
    department: 'Ressources Humaines',
    position: 'Responsable RH',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-chief-service-001',
    firstName: 'Ibrahim',
    lastName: 'Sanogo',
    email: 'chef.service@sicrb.ci',
    phone: '+225 07 00 00 04',
    role: 'CHIEF_SERVICE',
    department: 'Administration',
    position: 'Chef de Service - Demandes Citoyens',
    delegatedPower: 5000000,
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-agent-001',
    firstName: 'Pierre',
    lastName: 'Koffi',
    email: 'agent1@sicrb.ci',
    phone: '+225 07 00 00 05',
    role: 'AGENT',
    department: 'Administration',
    position: 'Agent - Demandes Citoyens',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-agent-002',
    firstName: 'Fatima',
    lastName: 'Traoré',
    email: 'agent2@sicrb.ci',
    phone: '+225 07 00 00 06',
    role: 'AGENT',
    department: 'Finance',
    position: 'Agent Comptable',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'user-elected-001',
    firstName: 'Laurent',
    lastName: 'Gbagbo',
    email: 'laurent.gbagbo@sicrb.ci',
    phone: '+225 07 00 00 07',
    role: 'ELECTED',
    position: 'Président du Conseil',
    isActive: true,
    createdAt: '2026-01-01'
  }
]

export const mockDepartments: Department[] = [
  {
    id: 'dept-001',
    name: 'Administration Générale',
    code: 'ADM',
    director: mockUsers[1],
    services: [],
    budget: 500000000
  },
  {
    id: 'dept-002',
    name: 'Finance et Budget',
    code: 'FIN',
    director: mockUsers[2],
    services: [],
    budget: 1000000000
  },
  {
    id: 'dept-003',
    name: 'Ressources Humaines',
    code: 'RH',
    director: mockUsers[3],
    services: [],
    budget: 300000000
  }
]

export const mockServices: Service[] = [
  {
    id: 'svc-001',
    name: 'Service des Demandes Citoyens',
    chief: mockUsers[4],
    agents: [mockUsers[5]]
  },
  {
    id: 'svc-002',
    name: 'Service Comptable',
    chief: mockUsers[4],
    agents: [mockUsers[6]]
  }
]

export const getCurrentUser = (): User => {
  // Simule un utilisateur connecté
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    return JSON.parse(storedUser)
  }
  return mockUsers[0] // DG par défaut
}

export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user))
}
