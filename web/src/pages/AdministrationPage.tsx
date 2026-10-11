import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  FilterBar,
  PageHeader,
  Select,
  StatCard,
  useToast,
  type Column,
} from '../components/ui'
import { useBasculerUtilisateur, useUtilisateurs } from '../hooks/useApi'
import { useTableQuery } from '../hooks/useTableQuery'
import type { Utilisateur } from '../types/domain'
import { formatDateHeure, formatNombre, humaniser } from '../utils/format'

const ROLES: Utilisateur['role'][] = ['ADMIN', 'PRESIDENT', 'DIRECTEUR', 'CHEF_SERVICE', 'CONTROLEUR', 'AGENT', 'PRESTATAIRE', 'CITOYEN']

export default function AdministrationPage() {
  const t = useTableQuery({ size: 10, sort: 'nom:asc' })
  const { data, isLoading, error, refetch } = useUtilisateurs(t.query)
  const tous = useUtilisateurs({ size: 200 })
  const basculer = useBasculerUtilisateur()
  const { notify } = useToast()

  const columns: Column<Utilisateur>[] = [
    { key: 'nom', header: 'Utilisateur', sortable: true, render: (u) => <span className="font-medium text-ink-900">{u.nom}</span> },
    { key: 'email', header: 'Courriel', sortable: true, render: (u) => u.email },
    { key: 'role', header: 'Rôle', sortable: true, render: (u) => <Badge>{humaniser(u.role)}</Badge> },
    { key: 'direction', header: 'Direction', sortable: true, render: (u) => u.direction },
    { key: 'actif', header: 'État', sortable: true, render: (u) => <Badge tone={u.actif ? 'success' : 'danger'}>{u.actif ? 'Actif' : 'Désactivé'}</Badge> },
    { key: 'dernierAcces', header: 'Dernier accès', sortable: true, render: (u) => (u.dernierAcces ? formatDateHeure(u.dernierAcces) : 'Jamais') },
    {
      key: 'actions',
      header: '',
      render: (u) => (
        <Button
          size="sm"
          variant={u.actif ? 'outline' : 'primary'}
          disabled={basculer.isPending}
          onClick={() =>
            basculer.mutate(u.id, {
              onSuccess: (maj) => notify(`Compte ${maj.nom} ${maj.actif ? 'réactivé' : 'désactivé'}.`),
              onError: (e) => notify(e instanceof Error ? e.message : 'Échec de la mise à jour', 'error'),
            })
          }
        >
          {u.actif ? 'Désactiver' : 'Réactiver'}
        </Button>
      ),
    },
  ]

  const items = tous.data?.items ?? []

  return (
    <>
      <PageHeader
        title="Administration"
        subtitle="Comptes, rôles et rattachements aux directions du Conseil Régional."
        crumbs={[{ label: 'Administration' }, { label: 'Utilisateurs' }]}
      />

      <Alert level="warning" title="Sécurité applicative non encore implémentée côté backend">
        Les rôles pilotent l'affichage du menu et des actions dans cette maquette. L'authentification et les autorisations devront être portées par le
        backend Quarkus, qui n'expose aujourd'hui aucune extension de sécurité.
      </Alert>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Comptes" value={formatNombre(tous.data?.total ?? 0)} />
        <StatCard label="Comptes actifs" value={formatNombre(items.filter((u) => u.actif).length)} tone="positive" />
        <StatCard label="Comptes désactivés" value={formatNombre(items.filter((u) => !u.actif).length)} tone="warning" />
        <StatCard label="Directions représentées" value={formatNombre(new Set(items.map((u) => u.direction)).size)} />
      </div>

      <Card className="mt-4" title="Comptes utilisateurs">
        <FilterBar q={t.q} onQ={t.setQ} onReset={t.reset} placeholder="Nom, courriel, direction…">
          <Select
            aria-label="Rôle"
            className="w-44"
            placeholder="Tous rôles"
            value={t.filtres.role ?? ''}
            onChange={(e) => t.setFiltre('role', e.target.value)}
            options={ROLES.map((r) => ({ value: r, label: humaniser(r) }))}
          />
        </FilterBar>
        <DataTable
          columns={columns}
          page={data}
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
          sort={t.sort}
          onSort={t.setSort}
          onPage={t.setPage}
          onSize={t.setSize}
          rowKey={(u) => u.id}
        />
      </Card>
    </>
  )
}
