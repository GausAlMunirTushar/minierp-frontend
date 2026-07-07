import type { Permission, RoleRecord } from '@/types/api'

export type { Permission, RoleRecord }

export type RolesResponseData = {
  roles: RoleRecord[]
  allPermissions: Permission[]
}
