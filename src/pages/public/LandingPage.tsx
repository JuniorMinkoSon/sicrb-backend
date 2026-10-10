import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">🏛️ SICRB</div>
          <nav className="nav-links">
            <a href="#features">Fonctionnalités</a>
            <a href="#about">À propos</a>
            <a href="#contact">Contact</a>
            <Link to="/login" className="btn-login">Connexion</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Système d'Information du Conseil Régional</h1>
          <p>Gestion institutionnelle, administrative et financière centralisée</p>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-primary">Accéder à la plateforme</Link>
            <Link to="/register" className="btn btn-secondary">S'inscrire</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <h2>Fonctionnalités principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Demandes Citoyennes</h3>
              <p>Plateforme de suivi transparent des demandes administrative des citoyens</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Gestion Financière</h3>
              <p>Budget, comptabilité, paie et trésorerie centralisées et auditables</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Gestion RH</h3>
              <p>Agents, paie, congés et évaluations de performance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Dashboards Intelligents</h3>
              <p>KPIs, rapports et visualisations en temps réel pour la prise de décision</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Workflows Automatisés</h3>
              <p>Approbations, délégations et escalades pour optimiser les processus</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Sécurité & Audit</h3>
              <p>Authentification sécurisée, traçabilité complète et conformité légale</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about">
        <div className="container">
          <h2>À propos du SICRB</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Une solution complète pour la gouvernance régionale</h3>
              <p>
                Le Système d'Information du Conseil Régional (SICRB) est une plateforme
                moderne conçue pour centraliser et optimiser la gestion administrative,
                financière et institutionnelle des conseils régionaux de Côte d'Ivoire.
              </p>
              <p>
                Développée avec les meilleures pratiques en matière de transparence,
                traçabilité et efficacité, SICRB permet une meilleure gouvernance et
                une plus grande proximité avec les citoyens.
              </p>
              <ul className="benefits">
                <li>✓ Transparence totale des processus administratifs</li>
                <li>✓ Réduction des délais de traitement</li>
                <li>✓ Meilleure gestion des ressources</li>
                <li>✓ Décisions basées sur des données fiables</li>
                <li>✓ Conformité légale et réglementaire</li>
                <li>✓ Engagement citoyen renforcé</li>
              </ul>
            </div>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">245</div>
                <div className="stat-label">Agents</div>
              </div>
              <div className="stat">
                <div className="stat-number">87</div>
                <div className="stat-label">Demandes/mois</div>
              </div>
              <div className="stat">
                <div className="stat-number">15.2B</div>
                <div className="stat-label">Budget FCFA</div>
              </div>
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Disponibilité</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Prêt à commencer?</h2>
          <p>Rejoignez la plateforme SICRB pour une gouvernance plus efficace et transparente</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Accéder à SICRB</Link>
            <a href="#contact" className="btn btn-secondary">Nous contacter</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SICRB</h4>
              <p>Système d'Information du Conseil Régional</p>
            </div>
            <div className="footer-section">
              <h4>Liens utiles</h4>
              <ul>
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#about">À propos</a></li>
                <li><Link to="/login">Connexion</Link></li>
                <li><Link to="/register">Inscription</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@sicrb.ci</p>
              <p>Téléphone: +225 XX XX XX XX</p>
              <p>Adresse: Abidjan, Côte d'Ivoire</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 SICRB. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
