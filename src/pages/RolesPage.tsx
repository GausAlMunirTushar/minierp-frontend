import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Permission, RoleRecord } from '@/apis/types/role_type'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ErrorState, LoadingState } from '@/components/ui/state'
import { useRoles, useUpdateRole } from '@/hooks/useRoleApi'

const groupPermissions = (permissions: Permission[]) => {
  const groups = new Map<string, Permission[]>()
  permissions.forEach((permission) => {
    const [resource] = permission.split('.')
    const list = groups.get(resource) ?? []
    list.push(permission)
    groups.set(resource, list)
  })
  return Array.from(groups.entries())
}

function RoleCard({ role, allPermissions }: { role: RoleRecord; allPermissions: Permission[] }) {
  const { t } = useTranslation()
  const updateRole = useUpdateRole()
  const [selected, setSelected] = useState<Set<Permission>>(() => new Set(role.permissions))

  const isDirty = useMemo(() => {
    if (selected.size !== role.permissions.length) return true
    return role.permissions.some((permission) => !selected.has(permission))
  }, [selected, role.permissions])

  const togglePermission = (permission: Permission) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(permission)) {
        next.delete(permission)
      } else {
        next.add(permission)
      }
      return next
    })
  }

  const handleSave = () => {
    updateRole.mutate(
      { name: role.name, permissions: Array.from(selected) },
      {
        onSuccess: () => toast.success(t('updatedSuccessfully')),
        onError: (error) => toast.error(getApiErrorMessage(error)),
      },
    )
  }

  const groups = groupPermissions(allPermissions)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="font-semibold capitalize text-card-foreground">{role.name}</h2>
        <Button type="button" onClick={handleSave} disabled={!isDirty || updateRole.isPending}>
          {updateRole.isPending ? t('saving') : t('savePermissions')}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map(([resource, permissions]) => (
          <div key={resource} className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {resource}
            </h3>
            <div className="space-y-1.5">
              {permissions.map((permission) => (
                <label key={permission} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={selected.has(permission)}
                    onChange={() => togglePermission(permission)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  {permission}
                </label>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RolesPage() {
  const { t } = useTranslation()
  const rolesQuery = useRoles()

  if (rolesQuery.isLoading) {
    return <LoadingState label={t('loading')} />
  }

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
      <PageHeader title={t('roles')} description={t('rolesDescription')} />
      <div className="space-y-4">
        {roles.map((role) => (
          <RoleCard key={role._id} role={role} allPermissions={allPermissions} />
        ))}
      </div>
    </div>
  )
}
