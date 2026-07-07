import type { Permission, Role, User } from '@/types/api'

export type { Permission, Role, User }

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  expiresIn: string
  user: User
}
