import { BarChart3, Boxes, LayoutDashboard, Package, Receipt, ShieldCheck, Tags, type LucideIcon } from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Boxes,
  Package,
  Receipt,
  ShieldCheck,
  Tags,
  BarChart3,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof iconMap

export const getIcon = (iconName: string): LucideIcon | undefined =>
  iconMap[iconName as IconName]
