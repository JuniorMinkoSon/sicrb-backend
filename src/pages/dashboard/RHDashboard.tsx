import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import './Dashboard.css'

export default function RHDashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord - Ressources Humaines</h1>
          <p>Gestion des agents, paie et développement du personnel</p>
        </div>
        <Button variant="primary" icon="📊">Rapport RH</Button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-success">
          <div className="kpi-header">
            <span className="kpi-icon">👥</span>
            <span className="kpi-status-badge">Nominal</span>
          </div>
          <div className="kpi-value">245</div>
          <div className="kpi-label">Agents Actifs</div>
          <div className="kpi-detail">100% conformes</div>
        </div>

        <div className="kpi-card kpi-card-info">
          <div className="kpi-header">
            <span className="kpi-icon">📅</span>
            <span className="kpi-trend-badge trend-neutral">23 this week</span>
          </div>
          <div className="kpi-value">23</div>
          <div className="kpi-label">Agents en Congé</div>
          <div className="kpi-detail">Cette semaine</div>
        </div>

        <div className="kpi-card kpi-card-warning">
          <div className="kpi-header">
            <span className="kpi-icon">💼</span>
            <span className="kpi-status-badge">En cours</span>
          </div>
          <div className="kpi-value">8</div>
          <div className="kpi-label">Évaluations</div>
          <div className="kpi-detail">Semestre 2024</div>
        </div>

        <div className="kpi-card kpi-card-primary">
          <div className="kpi-header">
            <span className="kpi-icon">💰</span>
            <span className="kpi-trend-badge trend-up">↑ +2%</span>
          </div>
          <div className="kpi-value">45.2M</div>
          <div className="kpi-label">Masse Salariale</div>
          <div className="kpi-detail">92% payés</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Paie en Attente</h2>
            <Link to="/finance/payroll" className="card-link">Gérer →</Link>
          </div>
          <div className="task-list">
            <div className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Validation paie août</div>
                <div className="task-meta">245 agents - 45.2M FCFA</div>
              </div>
              <span className="task-badge badge-success">✓ Approuvée</span>
            </div>

            <div className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Primes performance Q3</div>
                <div className="task-meta">En attente de DG</div>
              </div>
              <span className="task-badge badge-warning">En attente</span>
            </div>

            <div className="task-item">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Cotisations patronales</div>
                <div className="task-meta">À déclarer avant 10/09</div>
              </div>
              <span className="task-badge badge-danger">Urgent</span>
            </div>
          </div>
          <div className="card-footer">
            <Button variant="secondary" size="sm" fullWidth>Voir Tous les Payements</Button>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Activités RH</h2>
            <Link to="/admin/activity" className="card-link">Tous →</Link>
          </div>
          <div className="activity-list">
            <div className="activity-item activity-approved">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">Agent recruté</div>
                <div className="activity-detail">Kwesi Osei - Service Tech</div>
                <div className="activity-time">Il y a 3h</div>
              </div>
            </div>

            <div className="activity-item activity-processed">
              <div className="activity-icon">📋</div>
              <div className="activity-content">
                <div className="activity-title">Évaluation complétée</div>
                <div className="activity-detail">Agent Ama Boateng</div>
                <div className="activity-time">Il y a 5h</div>
              </div>
            </div>

            <div className="activity-item activity-new">
              <div className="activity-icon">📅</div>
              <div className="activity-content">
                <div className="activity-title">Congé approuvé</div>
                <div className="activity-detail">5 agents - Août 2024</div>
                <div className="activity-time">Il y a 1 jour</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-card full-width">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <Link to="/admin/agents" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-title">Agents</div>
            <div className="action-desc">Annuaire</div>
          </Link>

          <Link to="/finance/payroll" className="action-card">
            <div className="action-icon">💰</div>
            <div className="action-title">Paie</div>
            <div className="action-desc">Salaires</div>
          </Link>

          <Link to="/admin/leave" className="action-card">
            <div className="action-icon">📅</div>
            <div className="action-title">Congés</div>
            <div className="action-desc">Gestion</div>
          </Link>

          <Link to="/admin/evaluations" className="action-card">
            <div className="action-icon">⭐</div>
            <div className="action-title">Évaluations</div>
            <div className="action-desc">Performance</div>
          </Link>

          <Link to="/admin/training" className="action-card">
            <div className="action-icon">🎓</div>
            <div className="action-title">Formations</div>
            <div className="action-desc">Développement</div>
          </Link>

          <Link to="/admin/documents" className="action-card">
            <div className="action-icon">📄</div>
            <div className="action-title">Dossiers</div>
            <div className="action-desc">Administratifs</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
