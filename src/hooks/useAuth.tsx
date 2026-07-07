import React, { createContext, useContext, useMemo, useState } from 'react'

import { authStore } from '@/lib/auth'
import type { Permission, User } from '@/apis/types/auth_type'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  can: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authStore.getUser())

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(authStore.getToken() && user),
      login: (token, nextUser) => {
        authStore.setToken(token)
        authStore.setUser(nextUser)
        setUser(nextUser)
      },
      logout: () => {
        authStore.logout()
        setUser(null)
      },
      can: (permission) => Boolean(user?.permissions.includes(permission)),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
