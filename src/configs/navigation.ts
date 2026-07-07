import { Boxes, LayoutDashboard, Package, Receipt, type LucideIcon } from 'lucide-react'

import type { Permission } from '@/apis/types/auth_type'

export type NavigationItem = {
  id: string
  label: string
  path: string
  icon: LucideIcon
  requiredPermissions: Permission[]
}

export type NavigationModule = {
  id: string
  label: string
  icon: LucideIcon
  path: string
  requiredPermissions: Permission[]
  items: NavigationItem[]
}

export const navigationModules: NavigationModule[] = [
  {
    id: 'main',
    label: 'dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    requiredPermissions: ['dashboard.view'],
    items: [
      {
        id: 'dashboard',
        label: 'dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        requiredPermissions: ['dashboard.view'],
      },
    ],
  },
  {
    id: 'inventory',
    label: 'inventory',
    icon: Boxes,
    path: '/products',
    requiredPermissions: ['products.view'],
    items: [
      {
        id: 'products',
        label: 'products',
        path: '/products',
        icon: Package,
        requiredPermissions: ['products.view'],
      },
      {
        id: 'sales',
        label: 'sales',
        path: '/sales',
        icon: Receipt,
        requiredPermissions: ['sales.create'],
      },
    ],
  },
]
