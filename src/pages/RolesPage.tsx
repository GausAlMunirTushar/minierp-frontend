import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getApiErrorMessage } from '@/apis/configs'
import { PageHeader } from '@/components/layout/PageHeader'
import { RoleCard } from '@/components/roles/RoleCard'
import { ViewToggle } from '@/components/roles/ViewToggle'
import type { PermissionView } from '@/components/roles/ViewToggle'
import { ErrorState } from '@/components/ui/state'
import { RoleCardSkeleton } from '@/components/ui/skeletons'
import { useRoles } from '@/hooks/useRoleApi'

export function RolesPage() {
  const { t } = useTranslation()
  const rolesQuery = useRoles()
  const [view, setView] = useState<PermissionView>('grid')

  if (rolesQuery.isError) {
    return (
      <ErrorState
        title={t('roles')}
        description={getApiErrorMessage(rolesQuery.error)}
        onRetry={() => void rolesQuery.refetch()}
        retryLabel={t('retry')}
      />
    )
  }

  const { roles, allPermissions } = rolesQuery.data?.data ?? { roles: [], allPermissions: [] }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('roles')}
        description={t('rolesDescription')}
        actions={
          <ViewToggle value={view} onChange={setView} gridLabel={t('gridView')} listLabel={t('listView')} />
        }
      />
      <div className="space-y-4">
        {rolesQuery.isLoading
          ? Array.from({ length: 3 }).map((_, index) => <RoleCardSkeleton key={index} />)
          : roles.map((role) => (
              <RoleCard key={role._id} role={role} allPermissions={allPermissions} view={view} />
            ))}
      </div>
    </div>
  )
}
