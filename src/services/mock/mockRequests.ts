import { CitizenRequest, RequestStatus, RequestType, Citizen, WorkflowInstance } from '../../types'

export const mockRequests: CitizenRequest[] = [
  {
    id: 'req-001',
    reference: 'REQ-2026-000001',
    type: 'CERTIFICATE',
    title: 'Certificat de domicile',
    description: 'Demande de certificat de domicile pour location',
    citizen: {
      id: 'ctz-001',
      firstName: 'Abdoulaye',
      lastName: 'Diallo',
      email: 'abdoulaye@email.com',
      phone: '+225 07 12 34 56',
      idNumber: '0123456789'
    },
    status: 'SUBMITTED',
    workflow: {
      id: 'wf-inst-001',
      workflowId: 'wf-001',
      entityType: 'CitizenRequest',
      entityId: 'req-001',
      status: 'IN_PROGRESS',
      currentStep: 1,
      startedAt: '2026-08-18T10:00:00Z',
      approvals: []
    },
    documents: [
      {
        id: 'doc-001',
        name: 'Pièce d\'identité',
        type: 'PDF',
        size: 1024000,
        uploadedAt: '2026-08-18T10:15:00Z',
        url: '/uploads/id.pdf',
        isRequired: true,
        isVerified: true
      },
      {
        id: 'doc-002',
        name: 'Justificatif de domicile',
        type: 'PDF',
        size: 512000,
        uploadedAt: '2026-08-18T10:16:00Z',
        url: '/uploads/domicile.pdf',
        isRequired: true,
        isVerified: true
      }
    ],
    submittedAt: '2026-08-18T10:00:00Z',
    notes: 'Dossier complet, en vérification',
    contactPreference: 'EMAIL'
  },
  {
    id: 'req-002',
    reference: 'REQ-2026-000002',
    type: 'PERMIT',
    title: 'Autorisation d\'exploitation commerciale',
    description: 'Demande pour exploitation d\'une pharmacie',
    citizen: {
      id: 'ctz-002',
      firstName: 'Sophie',
      lastName: 'Kouamé',
      email: 'sophie@email.com',
      phone: '+225 07 87 65 43',
      idNumber: '9876543210'
    },
    status: 'IN_INSTRUCTION',
    workflow: {
      id: 'wf-inst-002',
      workflowId: 'wf-002',
      entityType: 'CitizenRequest',
      entityId: 'req-002',
      status: 'IN_PROGRESS',
      currentStep: 2,
      startedAt: '2026-08-15T08:00:00Z',
      approvals: []
    },
    documents: [
      {
        id: 'doc-003',
        name: 'Pièce d\'identité',
        type: 'PDF',
        size: 1024000,
        uploadedAt: '2026-08-15T08:30:00Z',
        url: '/uploads/id2.pdf',
        isRequired: true,
        isVerified: true
      },
      {
        id: 'doc-004',
        name: 'Diplôme professionnel',
        type: 'PDF',
        size: 2048000,
        uploadedAt: '2026-08-15T09:00:00Z',
        url: '/uploads/diploma.pdf',
        isRequired: true,
        isVerified: true
      }
    ],
    submittedAt: '2026-08-15T08:00:00Z',
    notes: 'En instruction par le chef de service',
    contactPreference: 'SMS'
  },
  {
    id: 'req-003',
    reference: 'REQ-2026-000003',
    type: 'CERTIFICATE',
    title: 'Certificat de résidence',
    description: 'Pour demande bourse d\'études',
    citizen: {
      id: 'ctz-003',
      firstName: 'Youssouf',
      lastName: 'Sow',
      email: 'youssouf@email.com',
      phone: '+225 07 55 44 33',
      idNumber: '1122334455'
    },
    status: 'APPROVED',
    workflow: {
      id: 'wf-inst-003',
      workflowId: 'wf-001',
      entityType: 'CitizenRequest',
      entityId: 'req-003',
      status: 'COMPLETED',
      currentStep: 3,
      startedAt: '2026-08-10T14:00:00Z',
      completedAt: '2026-08-17T16:30:00Z',
      approvals: []
    },
    documents: [
      {
        id: 'doc-005',
        name: 'Pièce d\'identité',
        type: 'PDF',
        size: 1024000,
        uploadedAt: '2026-08-10T14:15:00Z',
        url: '/uploads/id3.pdf',
        isRequired: true,
        isVerified: true
      }
    ],
    submittedAt: '2026-08-10T14:00:00Z',
    completedAt: '2026-08-17T16:30:00Z',
    resultDocument: {
      id: 'doc-result-001',
      name: 'Certificat de résidence',
      type: 'PDF',
      size: 512000,
      uploadedAt: '2026-08-17T16:30:00Z',
      url: '/downloads/certificat-001.pdf',
      isRequired: false
    },
    contactPreference: 'EMAIL'
  }
]

export const getRequestsByStatus = (status: RequestStatus): CitizenRequest[] => {
  return mockRequests.filter(req => req.status === status)
}

export const getRequestById = (id: string): CitizenRequest | undefined => {
  return mockRequests.find(req => req.id === id)
}

export const getRequestByCitizen = (citizenId: string): CitizenRequest[] => {
  return mockRequests.filter(req => req.citizen.id === citizenId)
}
