import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/apis/configs'
import type { Permission, RoleRecord } from '@/apis/types/role_type'
import { PermissionSelector } from '@/components/roles/PermissionSelector'
import type { PermissionView } from '@/components/roles/ViewToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useUpdateRole } from '@/hooks/useRoleApi'

export function RoleCard({
  role,
  allPermissions,
  view,
}: {
  role: RoleRecord
  allPermissions: Permission[]
  view: PermissionView
}) {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="font-semibold capitalize text-card-foreground">{role.name}</h2>
        <Button type="button" onClick={handleSave} disabled={!isDirty || updateRole.isPending}>
          {updateRole.isPending ? t('saving') : t('savePermissions')}
        </Button>
      </CardHeader>
      <CardContent>
        <PermissionSelector
          permissions={allPermissions}
          selected={selected}
          onToggle={togglePermission}
          view={view}
        />
      </CardContent>
    </Card>
  )
}
