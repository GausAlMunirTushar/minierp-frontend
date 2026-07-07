import type { Permission } from '@/apis/types/auth_type'

export type LayoutConfig = {
  module_bar: { width: string }
  module_sidebar: { width: string }
  topbar: { height: string }
}

export type Module = {
  id: string
  label: string
  icon: string
  path: string
  order: number
  enabled: boolean
  required_permissions: Permission[]
  config_file: string
  has_sidebar: boolean
  contain_menus: string[]
  admin_only?: boolean
}

export type AppConfig = {
  app: { name: string; short_name: string; version: string }
  layout: LayoutConfig
  modules: Module[]
}

export type Menu = {
  id: string
  label: string
  icon: string
  path: string
  required_permissions?: Permission[]
}

export type ModuleConfig = {
  module: {
    id: string
    label: string
    icon: string
    base_path: string
    menus: Menu[]
  }
}
