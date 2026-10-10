import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import './Dashboard.css'

export default function DGDashboard() {
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord - Direction Générale</h1>
          <p>Synthèse complète et indicateurs clés de performance</p>
        </div>
        <Button variant="primary" icon="📊">Générer Rapport</Button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-card-primary">
          <div className="kpi-header">
            <span className="kpi-icon">💰</span>
            <span className="kpi-trend-badge trend-up">↑ +12%</span>
          </div>
          <div className="kpi-value">24.5M</div>
          <div className="kpi-label">Budget Exécuté</div>
          <div className="kpi-detail">Objectif: 30M FCFA</div>
        </div>

        <div className="kpi-card kpi-card-success">
          <div className="kpi-header">
            <span className="kpi-icon">👥</span>
            <span className="kpi-status-badge">Nominal</span>
          </div>
          <div className="kpi-value">245</div>
          <div className="kpi-label">Agents Actifs</div>
          <div className="kpi-detail">0 absent, 23 en congé</div>
        </div>

        <div className="kpi-card kpi-card-info">
          <div className="kpi-header">
            <span className="kpi-icon">📋</span>
            <span className="kpi-trend-badge trend-neutral">43 actifs</span>
          </div>
          <div className="kpi-value">87</div>
          <div className="kpi-label">Demandes Citoyennes</div>
          <div className="kpi-detail">Taux traitement: 76%</div>
        </div>

        <div className="kpi-card kpi-card-warning">
          <div className="kpi-header">
            <span className="kpi-icon">🏦</span>
            <span className="kpi-status-badge">Normal</span>
          </div>
          <div className="kpi-value">156.8M</div>
          <div className="kpi-label">Position Trésor</div>
          <div className="kpi-detail">Variance: +2.3% vs prévu</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-grid">
        {/* Tâches */}
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Tâches Prioritaires</h2>
            <Link to="/admin/tasks" className="card-link">Voir tout →</Link>
          </div>
          <div className="task-list">
            <div className="task-item task-urgent">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Approuver budget 2027</div>
                <div className="task-meta">Demandé par Trésorier</div>
              </div>
              <span className="task-badge badge-danger">Urgent</span>
            </div>

            <div className="task-item task-today">
              <div className="task-checkbox">
                <input type="checkbox" />
              </div>
              <div className="task-content">
                <div className="task-title">Signer délibérations #42-45</div>
                <div className="task-meta">5 documents en attente</div>
              </div>
              <span className="task-badge badge-warning">Aujourd'hui</span>
            </div>

            <div className="task-item task-completed">
              <div className="task-checkbox">
                <input type="checkbox" checked disabled />
              </div>
              <div className="task-content">
                <div className="task-title">Valider paie août</div>
                <div className="task-meta">Complétée il y a 2h</div>
              </div>
              <span className="task-badge badge-success">✓ Fait</span>
            </div>
          </div>
          <div className="card-footer">
            <Button variant="secondary" size="sm" fullWidth>Ajouter Tâche</Button>
          </div>
        </section>

        {/* Activités */}
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Activités Récentes</h2>
            <Link to="/admin/activity" className="card-link">Log complet →</Link>
          </div>
          <div className="activity-list">
            <div className="activity-item activity-new">
              <div className="activity-icon">📄</div>
              <div className="activity-content">
                <div className="activity-title">Nouvelle demande soumise</div>
                <div className="activity-detail">Certificate de résidence</div>
                <div className="activity-time">Il y a 2h</div>
              </div>
            </div>

            <div className="activity-item activity-approved">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">Budget approuvé</div>
                <div className="activity-detail">Budget 2027 finalisé</div>
                <div className="activity-time">Il y a 5h</div>
              </div>
            </div>

            <div className="activity-item activity-processed">
              <div className="activity-icon">💳</div>
              <div className="activity-content">
                <div className="activity-title">Paie traitée</div>
                <div className="activity-detail">245 agents payés</div>
                <div className="activity-time">Il y a 1 jour</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Actions */}
      <section className="dashboard-card full-width">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <Link to="/finance/budget" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-title">Consulter Budget</div>
            <div className="action-desc">Exécution & engagements</div>
          </Link>

          <Link to="/finance/payroll" className="action-card">
            <div className="action-icon">💰</div>
            <div className="action-title">Paie & Salaires</div>
            <div className="action-desc">Traitement & déclarations</div>
          </Link>

          <Link to="/admin/organization" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-title">Organisation</div>
            <div className="action-desc">Structure & agents</div>
          </Link>

          <Link to="/requests" className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-title">Demandes</div>
            <div className="action-desc">Suivi en temps réel</div>
          </Link>

          <Link to="/admin/deliberations" className="action-card">
            <div className="action-icon">⚖️</div>
            <div className="action-title">Délibérations</div>
            <div className="action-desc">Conseil & votes</div>
          </Link>

          <Link to="/finance/treasury" className="action-card">
            <div className="action-icon">🏦</div>
            <div className="action-title">Trésorerie</div>
            <div className="action-desc">Position cash</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
