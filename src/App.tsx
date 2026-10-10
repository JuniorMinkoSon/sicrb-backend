import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import { User } from './types'
import { authService } from './services/authService'

// Pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DGDashboard from './pages/dashboard/DGDashboard'
import DirectorDashboard from './pages/dashboard/DirectorDashboard'
import FinanceDashboard from './pages/dashboard/FinanceDashboard'
import RHDashboard from './pages/dashboard/RHDashboard'
import MainLayout from './components/layout/MainLayout'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser())
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication on mount
    const user = authService.getCurrentUser()
    const token = authService.getToken()

    if (user && token && authService.validateToken(token)) {
      setCurrentUser(user)
      setIsAuthenticated(true)
    } else {
      authService.logout()
      setIsAuthenticated(false)
    }

    setLoading(false)
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    authService.logout()
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const handleRegister = (user: User) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</div>

    return isAuthenticated && currentUser ? (
      <MainLayout user={currentUser} onLogout={handleLogout}>
        {children}
      </MainLayout>
    ) : (
      <Navigate to="/login" replace />
    )
  }

  const renderDashboard = () => {
    if (!currentUser) return <Navigate to="/login" replace />

    switch (currentUser.role) {
      case 'DG':
        return <DGDashboard />
      case 'DIRECTOR':
        return <DirectorDashboard />
      case 'FINANCE':
        return <FinanceDashboard />
      case 'HR':
        return <RHDashboard />
      default:
        return <div className="page"><h1>Accueil</h1></div>
    }
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</div>
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={handleRegister} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute>{renderDashboard()}</ProtectedRoute>}
        />

        {/* Administration */}
        <Route
          path="/admin/*"
          element={<ProtectedRoute><div className="page"><h1>Administration</h1></div></ProtectedRoute>}
        />

        {/* Finance */}
        <Route
          path="/finance/*"
          element={<ProtectedRoute><div className="page"><h1>Finance & Budget</h1></div></ProtectedRoute>}
        />

        {/* Requests */}
        <Route
          path="/requests/*"
          element={<ProtectedRoute><div className="page"><h1>Demandes Citoyennes</h1></div></ProtectedRoute>}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
