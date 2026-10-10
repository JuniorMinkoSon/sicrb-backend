// ===== USER & ORGANIZATION =====
export type UserRole = 'DG' | 'DIRECTOR' | 'CHIEF_SERVICE' | 'AGENT' | 'HR' | 'FINANCE' | 'COUNCIL' | 'ELECTED' | 'CITIZEN' | 'ADMIN'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  department?: string
  position?: string
  delegatedPower?: number // Montant max signable (FCFA)
  delegationEndDate?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  website?: string
  logo?: string
  headquarters: string
}

export interface Department {
  id: string
  name: string
  code: string
  director: User
  services: Service[]
  budget?: number
}

export interface Service {
  id: string
  name: string
  chief: User
  agents: User[]
}

// ===== WORKFLOW & APPROVAL =====
export type WorkflowType = 'SIMPLE' | 'NORMAL' | 'INSTITUTIONAL'
export type WorkflowStatus = 'DRAFT' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED'

export interface WorkflowStep {
  id: string
  order: number
  name: string
  description?: string
  requiredRole: UserRole[]
  duration: number // jours
  autoEscalate: boolean
  escalateAfter: number // jours
}

export interface WorkflowDefinition {
  id: string
  code: string
  name: string
  description?: string
  type: WorkflowType
  steps: WorkflowStep[]
  version: number
  isActive: boolean
}

export interface WorkflowInstance {
  id: string
  workflowId: string
  entityType: string
  entityId: string
  status: WorkflowStatus
  currentStep: number
  startedAt: string
  completedAt?: string
  approvals: Approval[]
}

export interface Approval {
  id: string
  workflowInstanceId: string
  stepOrder: number
  assignedTo: User
  status: ApprovalStatus
  comment?: string
  attachments?: string[]
  submittedAt?: string
  dueDate: string
}

// ===== CITIZEN REQUESTS =====
export type RequestStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'IN_INSTRUCTION' | 'VALIDATED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'ARCHIVED'
export type RequestType = 'CERTIFICATE' | 'PERMIT' | 'AUTHORIZATION' | 'INFORMATION' | 'OTHER'

export interface CitizenRequest {
  id: string
  reference: string
  type: RequestType
  title: string
  description: string
  citizen: Citizen
  status: RequestStatus
  workflow: WorkflowInstance
  documents: Document[]
  submittedAt: string
  completedAt?: string
  notes?: string
  contactPreference: 'EMAIL' | 'SMS' | 'PHONE'
  resultDocument?: Document
}

export interface Citizen {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  idNumber: string
  avatar?: string
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  uploadedBy?: User
  url: string
  isRequired: boolean
  isVerified?: boolean
}

// ===== FINANCE =====
export type BudgetChapter = 'PERSONNEL' | 'MATERIALS' | 'SERVICES' | 'INVESTMENTS' | 'TRANSFERS' | 'OTHER'
export type ExpenseStatus = 'DRAFT' | 'COMMITTED' | 'ORDERED' | 'RECEIVED' | 'INVOICED' | 'PAID' | 'ARCHIVED'
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PROCESSED' | 'COMPLETED' | 'FAILED'

export interface BudgetLine {
  id: string
  chapter: BudgetChapter
  code: string
  label: string
  initialCredit: number
  transfersIn: number
  transfersOut: number
  credited: number
  engaged: number
  paid: number
  available: number
  year: number
}

export interface Expense {
  id: string
  reference: string
  type: string
  description: string
  amount: number
  chapter: BudgetChapter
  supplier?: string
  status: ExpenseStatus
  createdBy: User
  createdAt: string
  approvals: Approval[]
  documents: Document[]
  paymentStatus?: PaymentStatus
}

export interface Invoice {
  id: string
  reference: string
  supplier: string
  amount: number
  date: string
  dueDate: string
  status: ExpenseStatus
  expense?: Expense
  documents: Document[]
}

export interface Treasury {
  id: string
  bankName: string
  accountNumber: string
  balance: number
  lastUpdate: string
}

// ===== PAYROLL =====
export type PayrollStatus = 'DRAFT' | 'CALCULATED' | 'HR_VALIDATED' | 'FINANCE_VALIDATED' | 'DG_APPROVED' | 'PAYMENT_PENDING' | 'PAID' | 'ARCHIVED'

export interface Payroll {
  id: string
  reference: string
  period: string // "2026-08"
  employee: User
  baseSalary: number
  allowances: PayrollAllowance[]
  deductions: PayrollDeduction[]
  grossSalary: number
  netSalary: number
  status: PayrollStatus
  createdAt: string
  versions: PayrollVersion[]
  approvals: Approval[]
}

export interface PayrollAllowance {
  code: string
  label: string
  amount: number
}

export interface PayrollDeduction {
  code: string
  label: string
  amount: number
}

export interface PayrollVersion {
  version: number
  createdAt: string
  createdBy: User
  changes: string[]
}

// ===== PROCUREMENT =====
export type ProcurementStatus = 'DRAFT' | 'PUBLISHED' | 'EVALUATION' | 'AWARDED' | 'ORDERED' | 'RECEIVED' | 'COMPLETED' | 'ARCHIVED'
export type EvaluationCriteria = 'TECHNICAL' | 'FINANCIAL' | 'EXPERIENCE'

export interface CallForTenders {
  id: string
  reference: string
  title: string
  description: string
  budget: number
  openingDate: string
  closingDate: string
  status: ProcurementStatus
  documents: Document[]
  offers: Offer[]
  awardedTo?: Supplier
  createdBy: User
}

export interface Offer {
  id: string
  callId: string
  supplier: Supplier
  technicalScore: number
  financialScore: number
  totalScore: number
  price: number
  submittedAt: string
  documents: Document[]
}

export interface Supplier {
  id: string
  businessName: string
  registrationNumber: string
  email: string
  phone: string
  address: string
  contact: string
  rating: number
  isApproved: boolean
  documents: Document[]
}

export interface ProcurementContract {
  id: string
  reference: string
  procurement: CallForTenders
  supplier: Supplier
  amount: number
  startDate: string
  endDate: string
  status: ProcurementStatus
  documents: Document[]
}

// ===== DELIBERATIONS =====
export interface CouncilSession {
  id: string
  date: string
  time: string
  location: string
  type: 'ORDINARY' | 'EXTRAORDINARY'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  agenda: Resolution[]
  attendees: Attendee[]
  proceedsMinutes?: string
  recordedAt?: string
}

export interface Resolution {
  id: string
  sessionId: string
  order: number
  title: string
  description?: string
  rapporteur: User
  status: 'PENDING' | 'DISCUSSED' | 'VOTED' | 'ADOPTED' | 'REJECTED'
  yesVotes: number
  noVotes: number
  abstentions: number
  documents: Document[]
}

export interface Attendee {
  id: string
  sessionId: string
  elected: User
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED'
  arrivalTime?: string
}

// ===== DASHBOARD & REPORTING =====
export interface KPI {
  id: string
  label: string
  value: number
  unit: string
  trend: 'UP' | 'DOWN' | 'STABLE'
  trendPercent?: number
  target?: number
}

export interface Report {
  id: string
  name: string
  type: 'PDF' | 'EXCEL' | 'DASHBOARD'
  period: string
  generatedAt: string
  generatedBy: User
  data: any
  hash?: string
  signature?: string
}

export interface AuditLog {
  id: string
  timestamp: string
  user: User
  action: string
  module: string
  entityType: string
  entityId: string
  oldValue?: any
  newValue?: any
  ipAddress?: string
  status: 'SUCCESS' | 'FAILURE'
  details?: string
}

// ===== NOTIFICATION =====
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP'
export type NotificationType = 'REQUEST_SUBMITTED' | 'APPROVAL_REQUIRED' | 'APPROVED' | 'REJECTED' | 'PAYMENT_PROCESSED' | 'DOCUMENT_READY' | 'OTHER'

export interface Notification {
  id: string
  recipient: User | Citizen
  type: NotificationType
  title: string
  body: string
  channels: NotificationChannel[]
  entityType?: string
  entityId?: string
  isRead: boolean
  createdAt: string
  readAt?: string
}

// ===== FINANCIAL RULES =====
export interface FinancialRule {
  id: string
  code: string
  label: string
  value: string
  unit: string // '%', 'FCFA', 'DAYS'
  startDate: string
  endDate?: string
  category: string
  version: number
  isActive: boolean
}
