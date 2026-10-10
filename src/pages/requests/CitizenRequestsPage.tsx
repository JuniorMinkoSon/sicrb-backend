import { useState } from 'react'
import Button from '../../components/common/Button'
import './CitizenRequestsPage.css'

interface Request {
  id: string
  reference: string
  type: string
  citizenName: string
  citizenEmail: string
  status: string
  submittedDate: Date
  processedDate?: Date
  description: string
}

export default function CitizenRequestsPage() {
  const [requests] = useState<Request[]>([
    {
      id: '1',
      reference: 'DEM-2024-001',
      type: 'Certificat',
      citizenName: 'Kofi Mensah',
      citizenEmail: 'kofi.mensah@email.com',
      status: 'APPROVED',
      submittedDate: new Date('2024-08-01'),
      processedDate: new Date('2024-08-05'),
      description: 'Certificate de résidence'
    },
    {
      id: '2',
      reference: 'DEM-2024-002',
      type: 'Permis',
      citizenName: 'Ama Boateng',
      citizenEmail: 'ama.boateng@email.com',
      status: 'PENDING',
      submittedDate: new Date('2024-08-10'),
      description: 'Permis de construire'
    },
    {
      id: '3',
      reference: 'DEM-2024-003',
      type: 'Certificat',
      citizenName: 'Kwesi Osei',
      citizenEmail: 'kwesi.osei@email.com',
      status: 'REJECTED',
      submittedDate: new Date('2024-08-08'),
      processedDate: new Date('2024-08-12'),
      description: 'Certificate de non-antécédents'
    },
    {
      id: '4',
      reference: 'DEM-2024-004',
      type: 'Permis',
      citizenName: 'Abena Asante',
      citizenEmail: 'abena.asante@email.com',
      status: 'PROCESSING',
      submittedDate: new Date('2024-08-11'),
      description: 'Permis d\'exploitation'
    }
  ])

  const [filter, setFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filter === 'ALL' || req.status === filter
    const matchesSearch = req.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.citizenName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'status-approved'
      case 'PENDING': return 'status-pending'
      case 'PROCESSING': return 'status-processing'
      case 'REJECTED': return 'status-rejected'
      default: return ''
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'APPROVED': return '✓ Approuvée'
      case 'PENDING': return '⏱ En attente'
      case 'PROCESSING': return '⚙ En traitement'
      case 'REJECTED': return '✗ Rejetée'
      default: return status
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Demandes Citoyennes</h1>
          <p>Gestion et suivi des demandes de documents et permis</p>
        </div>
        <Button variant="primary" icon="➕">Nouvelle Demande</Button>
      </div>

      <div className="requests-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par référence ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Tous ({requests.length})
          </button>
          <button
            className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
            onClick={() => setFilter('PENDING')}
          >
            En attente ({requests.filter(r => r.status === 'PENDING').length})
          </button>
          <button
            className={`filter-btn ${filter === 'PROCESSING' ? 'active' : ''}`}
            onClick={() => setFilter('PROCESSING')}
          >
            En traitement ({requests.filter(r => r.status === 'PROCESSING').length})
          </button>
          <button
            className={`filter-btn ${filter === 'APPROVED' ? 'active' : ''}`}
            onClick={() => setFilter('APPROVED')}
          >
            Approuvées ({requests.filter(r => r.status === 'APPROVED').length})
          </button>
        </div>
      </div>

      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th className="col-ref">Référence</th>
              <th className="col-type">Type</th>
              <th className="col-citizen">Citoyen</th>
              <th className="col-status">Statut</th>
              <th className="col-dates">Dates</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr key={req.id} className={`row-${req.status.toLowerCase()}`}>
                <td className="cell-ref">
                  <div className="reference-badge">{req.reference}</div>
                </td>
                <td className="cell-type">
                  <span className="type-label">{req.type}</span>
                </td>
                <td className="cell-citizen">
                  <div className="citizen-info">
                    <div className="citizen-name">{req.citizenName}</div>
                    <div className="citizen-email">{req.citizenEmail}</div>
                  </div>
                </td>
                <td className="cell-status">
                  <span className={`status-badge ${getStatusClass(req.status)}`}>
                    {getStatusLabel(req.status)}
                  </span>
                </td>
                <td className="cell-dates">
                  <div className="dates-info">
                    <div className="date-submitted">Soumis: {req.submittedDate.toLocaleDateString('fr-FR')}</div>
                    {req.processedDate && (
                      <div className="date-processed">Traité: {req.processedDate.toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                </td>
                <td className="cell-actions">
                  <div className="action-buttons">
                    <button className="action-btn action-view" title="Voir détails">👁</button>
                    <button className="action-btn action-approve" title="Approuver" disabled={req.status !== 'PENDING'}>✓</button>
                    <button className="action-btn action-message" title="Message">💬</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRequests.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Aucune demande trouvée</div>
          <div className="empty-text">Affinez votre recherche ou vérifiez les filtres</div>
        </div>
      )}
    </div>
  )
}
