import { useMemo } from 'react'

import type { Permission } from '@/apis/types/role_type'
import { PermissionGrid } from '@/components/roles/PermissionGrid'
import { PermissionList } from '@/components/roles/PermissionList'
import type { PermissionView } from '@/components/roles/ViewToggle'
import { groupPermissionsByResource } from '@/lib/permissions'

export function PermissionSelector({
  permissions,
  selected,
  onToggle,
  view,
}: {
  permissions: Permission[]
  selected: Set<Permission>
  onToggle: (permission: Permission) => void
  view: PermissionView
}) {
  const groups = useMemo(() => groupPermissionsByResource(permissions), [permissions])

  return view === 'grid' ? (
    <PermissionGrid groups={groups} selected={selected} onToggle={onToggle} />
  ) : (
    <PermissionList groups={groups} selected={selected} onToggle={onToggle} />
  )
}
