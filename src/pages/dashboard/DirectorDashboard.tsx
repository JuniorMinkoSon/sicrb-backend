import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import './Dashboard.css'

export default function DirectorDashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord - Directeur</h1>
          <p>Gestion des services et supervision des agents</p>
        </div>
        <Button variant="primary" icon="📊">Rapport Service</Button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-primary">
          <div className="kpi-header">
            <span className="kpi-icon">👥</span>
            <span className="kpi-status-badge">Normal</span>
          </div>
          <div className="kpi-value">52</div>
          <div className="kpi-label">Agents sous Direction</div>
          <div className="kpi-detail">5 en mission externe</div>
        </div>

        <div className="kpi-card kpi-card-warning">
          <div className="kpi-header">
            <span className="kpi-icon">📋</span>
            <span className="kpi-trend-badge trend-up">↑ 5 today</span>
          </div>
          <div className="kpi-value">23</div>
          <div className="kpi-label">Demandes à Valider</div>
          <div className="kpi-detail">Urgent: 3 dossiers</div>
        </div>

        <div className="kpi-card kpi-card-info">
          <div className="kpi-header">
            <span className="kpi-icon">💼</span>
            <span className="kpi-status-badge">En cours</span>
          </div>
          <div className="kpi-value">8</div>
          <div className="kpi-label">Validations Attendues</div>
          <div className="kpi-detail">Délai moyen: 2j</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Demandes à Valider</h2>
            <Link to="/requests" className="card-link">Voir tout →</Link>
          </div>
          <div className="task-list">
            <div className="task-item task-urgent">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Permis de construire - Zone nord</div>
                <div className="task-meta">Soumis par Agent Kofi</div>
              </div>
              <span className="task-badge badge-danger">Urgent</span>
            </div>

            <div className="task-item task-today">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Demande allocation spéciale</div>
                <div className="task-meta">Dossier complet</div>
              </div>
              <span className="task-badge badge-warning">Aujourd'hui</span>
            </div>

            <div className="task-item task-today">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Rapports mensuels équipe</div>
                <div className="task-meta">12 agents rapportent</div>
              </div>
              <span className="task-badge badge-warning">Aujourd'hui</span>
            </div>
          </div>
          <div className="card-footer">
            <Button variant="secondary" size="sm" fullWidth>Voir Tous les Dossiers</Button>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Activités Équipe</h2>
            <Link to="/admin/activity" className="card-link">Log →</Link>
          </div>
          <div className="activity-list">
            <div className="activity-item activity-new">
              <div className="activity-icon">📄</div>
              <div className="activity-content">
                <div className="activity-title">Nouveau dossier soumis</div>
                <div className="activity-detail">Agent Ama - Certificat</div>
                <div className="activity-time">Il y a 1h</div>
              </div>
            </div>

            <div className="activity-item activity-approved">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">Dossier validé</div>
                <div className="activity-detail">Demande allocation</div>
                <div className="activity-time">Il y a 3h</div>
              </div>
            </div>

            <div className="activity-item activity-processed">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <div className="activity-title">Agent ajouté</div>
                <div className="activity-detail">Kwesi Osei - Service Tech</div>
                <div className="activity-time">Il y a 1 jour</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-card full-width">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <Link to="/requests" className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-title">Demandes</div>
            <div className="action-desc">À traiter</div>
          </Link>

          <Link to="/admin/organization" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-title">Agents</div>
            <div className="action-desc">Équipe</div>
          </Link>

          <Link to="/admin/reports" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-title">Rapports</div>
            <div className="action-desc">Mensuels</div>
          </Link>

          <Link to="/admin/performance" className="action-card">
            <div className="action-icon">📈</div>
            <div className="action-title">Performance</div>
            <div className="action-desc">Équipe</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
