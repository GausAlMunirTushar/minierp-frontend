import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router-dom'

import type { Permission } from '@/apis/types/auth_type'
import { ErrorState } from '@/components/ui/state'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({
  children,
  permissions = [],
  adminOnly = false,
}: {
  children: ReactNode
  permissions?: Permission[]
  adminOnly?: boolean
}) {
  const location = useLocation()
  const { t } = useTranslation()
  const { user, isAuthenticated, can } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const hasAccess =
    (permissions.length === 0 || permissions.every((permission) => can(permission))) &&
    (!adminOnly || user?.role === 'admin')

  if (!hasAccess) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <ErrorState title={t('accessDenied')} description={t('accessDeniedDescription')} />
      </div>
    )
  }

  return children
}
