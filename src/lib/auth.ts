import type { Permission, User } from '@/apis/types/auth_type'
import { STORAGE_KEYS } from '@/configs/constants'

const AUTH_CHANGE_EVENT = 'mini-erp-auth-change'

const safeParseUser = (value: string | null): User | null => {
  if (!value) return null

  try {
    return JSON.parse(value) as User
  } catch {
    localStorage.removeItem(STORAGE_KEYS.USER)
    return null
  }
}

const emitAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const authStore = {
  eventName: AUTH_CHANGE_EVENT,
  getToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setToken: (token: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
    emitAuthChange()
  },
  clearToken: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    emitAuthChange()
  },
  getUser: (): User | null => safeParseUser(localStorage.getItem(STORAGE_KEYS.USER)),
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    emitAuthChange()
  },
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER)
    emitAuthChange()
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    emitAuthChange()
  },
}

export const hasPermission = (user: User | null, permission: Permission) =>
  Boolean(user?.permissions.includes(permission))
