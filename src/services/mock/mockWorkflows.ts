import { WorkflowDefinition, WorkflowStep, WorkflowType } from '../../types'

export const mockWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf-001',
    code: 'SIMPLE_REQUEST',
    name: 'Demande Simple',
    description: 'Pour certificats simples (domicile, résidence)',
    type: 'SIMPLE',
    version: 1,
    isActive: true,
    steps: [
      {
        id: 'step-1',
        order: 1,
        name: 'Vérification des pièces',
        description: 'Agent vérifie la complétude du dossier',
        requiredRole: ['AGENT', 'CHIEF_SERVICE'],
        duration: 2,
        autoEscalate: false,
        escalateAfter: 3
      },
      {
        id: 'step-2',
        order: 2,
        name: 'Instruction',
        description: 'Chef de service instruit le dossier',
        requiredRole: ['CHIEF_SERVICE'],
        duration: 3,
        autoEscalate: false,
        escalateAfter: 5
      },
      {
        id: 'step-3',
        order: 3,
        name: 'Délivrance',
        description: 'Émission du document',
        requiredRole: ['CHIEF_SERVICE', 'AGENT'],
        duration: 1,
        autoEscalate: false,
        escalateAfter: 2
      }
    ]
  },
  {
    id: 'wf-002',
    code: 'NORMAL_REQUEST',
    name: 'Demande Normale',
    description: 'Pour autorisations professionnelles',
    type: 'NORMAL',
    version: 1,
    isActive: true,
    steps: [
      {
        id: 'step-4',
        order: 1,
        name: 'Vérification des pièces',
        requiredRole: ['AGENT', 'CHIEF_SERVICE'],
        duration: 2,
        autoEscalate: false,
        escalateAfter: 3
      },
      {
        id: 'step-5',
        order: 2,
        name: 'Instruction administrative',
        requiredRole: ['CHIEF_SERVICE'],
        duration: 5,
        autoEscalate: false,
        escalateAfter: 7
      },
      {
        id: 'step-6',
        order: 3,
        name: 'Validation du Directeur',
        requiredRole: ['DIRECTOR'],
        duration: 3,
        autoEscalate: true,
        escalateAfter: 5
      },
      {
        id: 'step-7',
        order: 4,
        name: 'Approbation du DG',
        requiredRole: ['DG'],
        duration: 2,
        autoEscalate: true,
        escalateAfter: 3
      }
    ]
  },
  {
    id: 'wf-003',
    code: 'INSTITUTIONAL_DECISION',
    name: 'Décision Institutionnelle',
    description: 'Pour décisions nécessitant vote en conseil',
    type: 'INSTITUTIONAL',
    version: 1,
    isActive: true,
    steps: [
      {
        id: 'step-8',
        order: 1,
        name: 'Préparation du dossier',
        requiredRole: ['AGENT', 'CHIEF_SERVICE'],
        duration: 3,
        autoEscalate: false,
        escalateAfter: 5
      },
      {
        id: 'step-9',
        order: 2,
        name: 'Examen par le Directeur',
        requiredRole: ['DIRECTOR'],
        duration: 3,
        autoEscalate: false,
        escalateAfter: 5
      },
      {
        id: 'step-10',
        order: 3,
        name: 'Approbation du DG',
        requiredRole: ['DG'],
        duration: 2,
        autoEscalate: false,
        escalateAfter: 3
      },
      {
        id: 'step-11',
        order: 4,
        name: 'Inscription à l\'ordre du jour',
        requiredRole: ['COUNCIL'],
        duration: 5,
        autoEscalate: false,
        escalateAfter: 7
      },
      {
        id: 'step-12',
        order: 5,
        name: 'Vote en conseil',
        requiredRole: ['ELECTED'],
        duration: 7,
        autoEscalate: false,
        escalateAfter: 14
      }
    ]
  }
]

export const getWorkflowByCode = (code: string): WorkflowDefinition | undefined => {
  return mockWorkflows.find(wf => wf.code === code)
}

export const getWorkflowById = (id: string): WorkflowDefinition | undefined => {
  return mockWorkflows.find(wf => wf.id === id)
}

export const getWorkflowsByType = (type: WorkflowType): WorkflowDefinition[] => {
  return mockWorkflows.filter(wf => wf.type === type)
}
