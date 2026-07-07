import type { Permission } from '@/apis/types/role_type'
import { PermissionCheckbox } from '@/components/roles/PermissionCheckbox'

export function PermissionList({
  groups,
  selected,
  onToggle,
}: {
  groups: [string, Permission[]][]
  selected: Set<Permission>
  onToggle: (permission: Permission) => void
}) {
  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {groups.map(([resource, permissions]) =>
        permissions.map((permission) => (
          <div key={permission} className="px-3 py-2">
            <PermissionCheckbox
              permission={permission}
              checked={selected.has(permission)}
              onChange={() => onToggle(permission)}
              trailing={
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                  {resource}
                </span>
              }
            />
          </div>
        )),
      )}
    </div>
  )
}
