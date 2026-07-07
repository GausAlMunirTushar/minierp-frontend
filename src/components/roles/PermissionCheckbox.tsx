import type { ReactNode } from 'react'

import type { Permission } from '@/apis/types/role_type'

export function PermissionCheckbox({
  permission,
  checked,
  onChange,
  trailing,
}: {
  permission: Permission
  checked: boolean
  onChange: () => void
  trailing?: ReactNode
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm text-foreground">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        {permission}
      </span>
      {trailing}
    </label>
  )
}
