import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { User } from '../../types'
import { mockUsers } from '../../services/mock/mockUsers'
import './AuthPages.css'

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('dg@sicrb.ci')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = authService.login({ email, password })

    if (result.success && result.user) {
      onLogin(result.user)
      navigate('/')
    } else {
      setError(result.message || 'Email ou mot de passe incorrect')
    }

    setLoading(false)
  }

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail)
    const result = authService.login({ email: userEmail, password: 'password' })
    if (result.success && result.user) {
      onLogin(result.user)
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🏛️ SICRB</h1>
          <p>Se connecter</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@sicrb.ci"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          <div className="auth-divider">OU</div>

          <div className="demo-box">
            <p><strong>Accès rapide (mode démo):</strong></p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              {mockUsers.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user.email)}
                  style={{
                    padding: '8px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {user.role}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte? <Link to="/register">S'inscrire</Link></p>
          <p><Link to="/">← Retour à l'accueil</Link></p>
        </div>
      </div>
    </div>
  )
}
