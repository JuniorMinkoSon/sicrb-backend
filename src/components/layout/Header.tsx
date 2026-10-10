import { User } from '../../types'
import './Header.css'

interface HeaderProps {
  user: User
  onLogout: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="main-header">
      <div className="header-left">
        <h1>SICRB - Système d'Information du Conseil Régional</h1>
      </div>

      <div className="header-right">
        <div className="notifications">
          <button className="notification-btn">🔔</button>
          <span className="notification-badge">3</span>
        </div>

        <div className="user-menu">
          <button className="user-btn">
            {user.firstName} {user.lastName} ▼
          </button>
          <div className="user-dropdown">
            <a href="#profile">👤 Profil</a>
            <a href="#settings">⚙️ Paramètres</a>
            <hr />
            <button onClick={onLogout} className="logout-btn">🚪 Déconnexion</button>
          </div>
        </div>
      </div>
    </header>
  )
}
