import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router-dom'

import type { Permission } from '@/apis/types/auth_type'
import { ErrorState } from '@/components/ui/state'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({
  children,
  permissions = [],
}: {
  children: ReactNode
  permissions?: Permission[]
}) {
  const location = useLocation()
  const { t } = useTranslation()
  const { isAuthenticated, can } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (permissions.length > 0 && !permissions.every((permission) => can(permission))) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <ErrorState title={t('accessDenied')} description={t('accessDeniedDescription')} />
      </div>
    )
  }

  return children
}
