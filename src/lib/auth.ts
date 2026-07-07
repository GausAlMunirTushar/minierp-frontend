import type { Permission, User } from '@/apis/types/auth_type'
import { STORAGE_KEYS } from '@/configs/constants'

export const authStore = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  clearToken: () => localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
  getUser: (): User | null => {
    const value = localStorage.getItem(STORAGE_KEYS.USER)
    return value ? (JSON.parse(value) as User) : null
  },
  setUser: (user: User) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(STORAGE_KEYS.USER),
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },
}

export const hasPermission = (user: User | null, permission: Permission) =>
  Boolean(user?.permissions.includes(permission))
