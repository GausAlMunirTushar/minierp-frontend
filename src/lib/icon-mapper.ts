import { Boxes, LayoutDashboard, Package, Receipt, ShieldCheck, type LucideIcon } from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Boxes,
  Package,
  Receipt,
  ShieldCheck,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconMap

export const getIcon = (iconName: string): LucideIcon | undefined =>
  iconMap[iconName as IconName]
