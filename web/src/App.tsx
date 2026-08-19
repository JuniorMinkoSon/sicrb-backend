import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PublicLayout } from './components/layout/PublicLayout'
import { RequireAuth } from './components/layout/RequireAuth'
import { LoadingState } from './components/ui'

const AccueilPage = lazy(() => import('./pages/AccueilPage'))
const ConnexionPage = lazy(() => import('./pages/ConnexionPage'))
const InscriptionPage = lazy(() => import('./pages/InscriptionPage'))
const PortailPublicPage = lazy(() => import('./pages/PortailPublicPage'))
const PortailCitoyenPage = lazy(() => import('./pages/PortailCitoyenPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const GouvernancePage = lazy(() => import('./pages/GouvernancePage'))
const PaiPage = lazy(() => import('./pages/PaiPage'))
const TerritoirePage = lazy(() => import('./pages/TerritoirePage'))
const TerritoireDetailPage = lazy(() => import('./pages/TerritoireDetailPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const ProgrammesPage = lazy(() => import('./pages/ProgrammesPage'))
const ProgrammeDetailPage = lazy(() => import('./pages/ProgrammeDetailPage'))
const ProjetsPage = lazy(() => import('./pages/ProjetsPage'))
const ProjetDetailPage = lazy(() => import('./pages/ProjetDetailPage'))
const InfrastructuresPage = lazy(() => import('./pages/InfrastructuresPage'))
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'))
const ControleursPage = lazy(() => import('./pages/ControleursPage'))
const FinancesPage = lazy(() => import('./pages/FinancesPage'))
const PrestatairesPage = lazy(() => import('./pages/PrestatairesPage'))
const PrestataireDetailPage = lazy(() => import('./pages/PrestataireDetailPage'))
const EquipementsPage = lazy(() => import('./pages/EquipementsPage'))
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'))
const WorkflowsPage = lazy(() => import('./pages/WorkflowsPage'))
const WorkflowDetailPage = lazy(() => import('./pages/WorkflowDetailPage'))
const IndicateursPage = lazy(() => import('./pages/IndicateursPage'))
const ImpactPage = lazy(() => import('./pages/ImpactPage'))
const DecisionPage = lazy(() => import('./pages/DecisionPage'))
const RapportsPage = lazy(() => import('./pages/RapportsPage'))
const AuditPage = lazy(() => import('./pages/AuditPage'))
const AdministrationPage = lazy(() => import('./pages/AdministrationPage'))
const PortailEntrepreneurPage = lazy(() => import('./pages/PortailEntrepreneurPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<LoadingState label="Chargement du module…" />}>
      <Routes>
        {/* Parcours public : vitrine, connexion, inscription et portails ouverts */}
        <Route element={<PublicLayout />}>
          <Route index element={<AccueilPage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/portail/public" element={<PortailPublicPage />} />
          <Route path="/portail/citoyen" element={<PortailCitoyenPage />} />
        </Route>

        {/* Solution interne : accessible après connexion */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/gouvernance" element={<GouvernancePage />} />
            <Route path="/pai" element={<PaiPage />} />
            <Route path="/territory" element={<TerritoirePage />} />
            <Route path="/territoire" element={<Navigate to="/territory" replace />} />
            <Route path="/territoire/:id" element={<TerritoireDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/programmes" element={<ProgrammesPage />} />
            <Route path="/programmes/:id" element={<ProgrammeDetailPage />} />
            <Route path="/projets" element={<ProjetsPage />} />
            <Route path="/projets/:id" element={<ProjetDetailPage />} />
            <Route path="/infrastructures" element={<InfrastructuresPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/controleurs" element={<ControleursPage />} />
            <Route path="/finances" element={<FinancesPage />} />
            <Route path="/prestataires" element={<PrestatairesPage />} />
            <Route path="/prestataires/:id" element={<PrestataireDetailPage />} />
            <Route path="/equipements" element={<EquipementsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/workflows/:id" element={<WorkflowDetailPage />} />
            <Route path="/indicateurs" element={<IndicateursPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/decision" element={<DecisionPage />} />
            <Route path="/rapports" element={<RapportsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/administration" element={<AdministrationPage />} />
            <Route path="/portail/entrepreneur" element={<PortailEntrepreneurPage />} />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
