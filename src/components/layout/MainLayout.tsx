import { User } from '../../types'
import Sidebar from './Sidebar'
import Header from './Header'
import './MainLayout.css'

interface MainLayoutProps {
  user: User
  onLogout: () => void
  children: React.ReactNode
}

export default function MainLayout({ user, onLogout, children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Sidebar user={user} />
      <div className="layout-content">
        <Header user={user} onLogout={onLogout} />
        <main className="main-area">
          {children}
        </main>
      </div>
    </div>
  )
}
