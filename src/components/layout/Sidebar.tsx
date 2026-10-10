import { Link } from 'react-router-dom'
import { User } from '../../types'
import './Sidebar.css'

interface SidebarProps {
  user: User
}

export default function Sidebar({ user }: SidebarProps) {
  const getMenuItems = () => {
    const baseItems = [
      { path: '/', label: 'Accueil', icon: '🏠' }
    ]

    const roleItems: { [key: string]: Array<{ path: string; label: string; icon: string }> } = {
      DG: [
        { path: '/admin/organization', label: 'Organisation', icon: '🏢' },
        { path: '/admin/employees', label: 'Agents', icon: '👥' },
        { path: '/admin/elected-officials', label: 'Élus', icon: '🎖️' },
        { path: '/finance/budget', label: 'Budget', icon: '💰' },
        { path: '/finance/treasury', label: 'Trésorerie', icon: '🏦' },
        { path: '/finance/payroll', label: 'Paie', icon: '📊' },
        { path: '/requests', label: 'Demandes', icon: '📋' }
      ],
      DIRECTOR: [
        { path: '/admin/employees', label: 'Agents', icon: '👥' },
        { path: '/requests', label: 'Demandes', icon: '📋' },
        { path: '/finance/budget', label: 'Budget', icon: '💰' }
      ],
      FINANCE: [
        { path: '/finance/budget', label: 'Budget', icon: '💰' },
        { path: '/finance/accounting', label: 'Comptabilité', icon: '📖' },
        { path: '/finance/payroll', label: 'Paie', icon: '📊' },
        { path: '/finance/treasury', label: 'Trésorerie', icon: '🏦' },
        { path: '/finance/procurement', label: 'Marchés', icon: '🛒' }
      ],
      HR: [
        { path: '/finance/payroll', label: 'Paie', icon: '📊' },
        { path: '/admin/employees', label: 'Agents', icon: '👥' }
      ],
      CHIEF_SERVICE: [
        { path: '/requests', label: 'Demandes', icon: '📋' },
        { path: '/admin/employees', label: 'Agents', icon: '👥' }
      ],
      AGENT: [
        { path: '/requests', label: 'Demandes', icon: '📋' }
      ]
    }

    return [...baseItems, ...(roleItems[user.role] || [])]
  }

  const menuItems = getMenuItems()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🏛️ SICRB</div>
        <div className="role-badge">{user.role}</div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user.firstName.charAt(0)}</div>
        <div className="user-info">
          <div className="user-name">{user.firstName} {user.lastName}</div>
          <div className="user-position">{user.position}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className="nav-item">
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="version">v1.0.0</div>
      </div>
    </aside>
  )
}
