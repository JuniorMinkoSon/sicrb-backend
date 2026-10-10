import { User } from '../types'
import { mockUsers } from './mock/mockUsers'

interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

// Générateur de tokens mock
const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24h
  }
  return btoa(JSON.stringify(payload))
}

// Auth Service
export const authService = {
  // Login
  login: (credentials: LoginRequest): AuthResponse => {
    const { email, password } = credentials

    // Mock: Tous les utilisateurs avec n'importe quel mot de passe
    const user = mockUsers.find(u => u.email === email)

    if (!user) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect'
      }
    }

    // Générer token
    const token = generateToken(user)

    // Sauvegarder dans localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(user))

    return {
      success: true,
      token,
      user
    }
  },

  // Register (mock)
  register: (data: RegisterRequest): AuthResponse => {
    const { email, password, confirmPassword, firstName, lastName, role } = data

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return { success: false, message: 'Tous les champs sont requis' }
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Les mots de passe ne correspondent pas' }
    }

    if (password.length < 6) {
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' }
    }

    // Vérifier si email existe déjà
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, message: 'Cet email est déjà utilisé' }
    }

    // Créer nouvel utilisateur (mock)
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone: '',
      role: role as any,
      isActive: true,
      createdAt: new Date().toISOString()
    }

    // Login automatique après inscription
    const token = generateToken(newUser)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(newUser))

    return {
      success: true,
      token,
      user: newUser,
      message: 'Inscription réussie!'
    }
  },

  // Forgot Password (mock)
  forgotPassword: (email: string): AuthResponse => {
    const user = mockUsers.find(u => u.email === email)

    if (!user) {
      return { success: false, message: 'Cet email n\'existe pas' }
    }

    // Mock: Afficher le lien de réinitialisation
    return {
      success: true,
      message: `Email de réinitialisation envoyé à ${email}. (Mock: tous les utilisateurs + n'importe quel mot de passe)`
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('current_user')
    return user ? JSON.parse(user) : null
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token')
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token')
  },

  // Validate token
  validateToken: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token))
      return payload.exp > Date.now()
    } catch {
      return false
    }
  }
}
