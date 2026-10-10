import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { User } from '../../types'
import './AuthPages.css'

interface RegisterPageProps {
  onRegister: (user: User) => void
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CITIZEN'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Tous les champs sont requis')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    // Appeler le service d'inscription
    const result = authService.register(formData)

    if (result.success && result.user) {
      onRegister(result.user)
      navigate('/')
    } else {
      setError(result.message || 'Erreur lors de l\'inscription')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🏛️ SICRB</h1>
          <p>Créer un compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
              />
            </div>

            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@sicrb.ci"
            />
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CITIZEN">Citoyen</option>
              <option value="AGENT">Agent</option>
              <option value="CHIEF_SERVICE">Chef de Service</option>
              <option value="DIRECTOR">Directeur</option>
              <option value="DG">Direction Générale</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <small>Minimum 6 caractères</small>
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Création en cours...' : 'S\'inscrire'}
          </button>

          <div className="auth-divider">OU</div>

          <div className="demo-box">
            <p><strong>Mode démo:</strong></p>
            <p>Email: client@sicrb.ci</p>
            <p>Mot de passe: n'importe quoi</p>
          </div>
        </form>

        <div className="auth-footer">
          <p>Vous avez déjà un compte? <Link to="/login">Se connecter</Link></p>
          <p><Link to="/">Retour à l'accueil</Link></p>
        </div>
      </div>
    </div>
  )
}
