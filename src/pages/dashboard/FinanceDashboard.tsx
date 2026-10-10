import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import './Dashboard.css'

export default function FinanceDashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord - Finance</h1>
          <p>Gestion budgétaire, trésorerie et exécution financière</p>
        </div>
        <Button variant="primary" icon="📊">Export Rapport</Button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card kpi-card-success">
          <div className="kpi-header">
            <span className="kpi-icon">💰</span>
            <span className="kpi-status-badge">Sain</span>
          </div>
          <div className="kpi-value">156.8M</div>
          <div className="kpi-label">Position Trésor</div>
          <div className="kpi-detail">Disponible immédiat</div>
        </div>

        <div className="kpi-card kpi-card-primary">
          <div className="kpi-header">
            <span className="kpi-icon">📊</span>
            <span className="kpi-trend-badge trend-up">↑ +5%</span>
          </div>
          <div className="kpi-value">67%</div>
          <div className="kpi-label">Budget Exécuté</div>
          <div className="kpi-detail">30M sur 45M FCFA</div>
        </div>

        <div className="kpi-card kpi-card-warning">
          <div className="kpi-header">
            <span className="kpi-icon">📋</span>
            <span className="kpi-trend-badge trend-up">↑ 5 new</span>
          </div>
          <div className="kpi-value">45</div>
          <div className="kpi-label">Factures Validées</div>
          <div className="kpi-detail">Prêtes à paiement</div>
        </div>

        <div className="kpi-card kpi-card-info">
          <div className="kpi-header">
            <span className="kpi-icon">💳</span>
            <span className="kpi-status-badge">Normal</span>
          </div>
          <div className="kpi-value">12</div>
          <div className="kpi-label">Paiements En Attente</div>
          <div className="kpi-detail">Validés, non payés</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Flux Trésorerie (30j)</h2>
            <Link to="/finance/treasury" className="card-link">Détails →</Link>
          </div>
          <div className="task-list">
            <div className="task-item">
              <div className="task-checkbox">
                <span style={{fontSize: '16px'}}>📥</span>
              </div>
              <div className="task-content">
                <div className="task-title">Encaissements prévus</div>
                <div className="task-meta">45.2M FCFA attendus</div>
              </div>
              <span className="task-badge badge-success">Positif</span>
            </div>

            <div className="task-item">
              <div className="task-checkbox">
                <span style={{fontSize: '16px'}}>📤</span>
              </div>
              <div className="task-content">
                <div className="task-title">Décaissements programmés</div>
                <div className="task-meta">32.8M FCFA à payer</div>
              </div>
              <span className="task-badge badge-warning">Prévu</span>
            </div>

            <div className="task-item">
              <div className="task-checkbox">
                <span style={{fontSize: '16px'}}>⚖️</span>
              </div>
              <div className="task-content">
                <div className="task-title">Solde net estimé</div>
                <div className="task-meta">+12.4M FCFA surplus</div>
              </div>
              <span className="task-badge badge-success">Couvert</span>
            </div>
          </div>
          <div className="card-footer">
            <Button variant="secondary" size="sm" fullWidth>Voir Flux Détaillé</Button>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Audits & Validations</h2>
            <Link to="/finance/audit" className="card-link">Logs →</Link>
          </div>
          <div className="activity-list">
            <div className="activity-item activity-approved">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">Budget 2025 approuvé</div>
                <div className="activity-detail">Par DG - Complet</div>
                <div className="activity-time">Il y a 2h</div>
              </div>
            </div>

            <div className="activity-item activity-processed">
              <div className="activity-icon">💳</div>
              <div className="activity-content">
                <div className="activity-title">Paiement masse 245 agents</div>
                <div className="activity-detail">Paie août validée</div>
                <div className="activity-time">Il y a 6h</div>
              </div>
            </div>

            <div className="activity-item activity-new">
              <div className="activity-icon">📄</div>
              <div className="activity-content">
                <div className="activity-title">Audit externe démarré</div>
                <div className="activity-detail">Exercice comptable 2024</div>
                <div className="activity-time">Il y a 1 jour</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-card full-width">
        <h2>Actions Rapides</h2>
        <div className="actions-grid">
          <Link to="/finance/budget" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-title">Budget</div>
            <div className="action-desc">Exécution</div>
          </Link>

          <Link to="/finance/payroll" className="action-card">
            <div className="action-icon">💰</div>
            <div className="action-title">Paie</div>
            <div className="action-desc">Salaires</div>
          </Link>

          <Link to="/finance/treasury" className="action-card">
            <div className="action-icon">🏦</div>
            <div className="action-title">Trésorerie</div>
            <div className="action-desc">Cash Flow</div>
          </Link>

          <Link to="/finance/audit" className="action-card">
            <div className="action-icon">🔍</div>
            <div className="action-title">Audit</div>
            <div className="action-desc">Conformité</div>
          </Link>

          <Link to="/finance/vendors" className="action-card">
            <div className="action-icon">🤝</div>
            <div className="action-title">Fournisseurs</div>
            <div className="action-desc">Paiements</div>
          </Link>

          <Link to="/finance/reports" className="action-card">
            <div className="action-icon">📈</div>
            <div className="action-title">Rapports</div>
            <div className="action-desc">Analyses</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
