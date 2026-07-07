import type { Permission } from '@/apis/types/role_type'

export const groupPermissionsByResource = (permissions: Permission[]): [string, Permission[]][] => {
  const groups = new Map<string, Permission[]>()

  permissions.forEach((permission) => {
    const [resource] = permission.split('.')
    const list = groups.get(resource) ?? []
    list.push(permission)
    groups.set(resource, list)
  })

  return Array.from(groups.entries())
}
