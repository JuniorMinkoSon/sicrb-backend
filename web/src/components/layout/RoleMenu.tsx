import { UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { routeParDefaut } from '../../constants/nav'
import { useRole } from '../../hooks/useRole'
import { roles } from '../../types/roles'
import { Dropdown } from '../ui/Dropdown'

/**
 * Sélecteur de rôle de démonstration : il change le menu et les actions
 * visibles. Il ne remplace pas une authentification (absente du backend).
 */
export function RoleMenu() {
  const { role, setRole, libelle } = useRole()
  const navigate = useNavigate()

  return (
    <Dropdown
      icon={<UserRound className="size-4" aria-hidden />}
      label={libelle}
      actions={roles.map((r) => ({
        label: `${r.libelle}${r.code === role ? ' •' : ''}`,
        onSelect: () => {
          setRole(r.code)
          navigate(routeParDefaut(r.code))
        },
      }))}
    />
  )
}
