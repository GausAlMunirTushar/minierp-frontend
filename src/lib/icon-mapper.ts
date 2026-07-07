import { Boxes, LayoutDashboard, Package, Receipt, type LucideIcon } from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Boxes,
  Package,
  Receipt,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconMap

export const getIcon = (iconName: string): LucideIcon | undefined =>
  iconMap[iconName as IconName]
