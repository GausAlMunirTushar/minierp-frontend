import type { ReactNode } from 'react'

import { AuthProvider } from '@/contexts/AuthContext'

export function ApplicationProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export default ApplicationProvider
