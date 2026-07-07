import type { Permission, User } from '@/apis/types/auth_type'

export const hasPermission = (user: User | null, permission: Permission) =>
  Boolean(user?.permissions.includes(permission))

export const hasAnyPermission = (user: User | null, permissions: Permission[]) =>
  permissions.some((permission) => hasPermission(user, permission))
