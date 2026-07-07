import type { Permission } from '@/apis/types/role_type'
import { PermissionCheckbox } from '@/components/roles/PermissionCheckbox'

export function PermissionGrid({
  groups,
  selected,
  onToggle,
}: {
  groups: [string, Permission[]][]
  selected: Set<Permission>
  onToggle: (permission: Permission) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map(([resource, permissions]) => (
        <div key={resource} className="space-y-2 rounded-md border border-border p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {resource}
          </h3>
          <div className="space-y-1.5">
            {permissions.map((permission) => (
              <PermissionCheckbox
                key={permission}
                permission={permission}
                checked={selected.has(permission)}
                onChange={() => onToggle(permission)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
