import type { Permission } from '@/apis/types/auth_type'
import appConfigJson from '@/configs/nav-config/app-config.json'
import mainConfigJson from '@/configs/nav-config/modules/main-config.json'
import productsConfigJson from '@/configs/nav-config/modules/products-config.json'
import salesConfigJson from '@/configs/nav-config/modules/sales-config.json'
import type { AppConfig, Module, ModuleConfig } from '@/types/config.types'

const moduleConfigsByFile: Record<string, ModuleConfig> = {
  'main-config.json': mainConfigJson as unknown as ModuleConfig,
  'products-config.json': productsConfigJson as unknown as ModuleConfig,
  'sales-config.json': salesConfigJson as unknown as ModuleConfig,
}

export const getAppConfig = (): AppConfig => appConfigJson as unknown as AppConfig

export const getEnabledModules = (): Module[] =>
  getAppConfig()
    .modules.filter((module) => module.enabled)
    .sort((a, b) => a.order - b.order)

export const hasPermissions = (
  userPermissions: Permission[],
  requiredPermissions: Permission[],
): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true
  return requiredPermissions.some((permission) => userPermissions.includes(permission))
}

export const getAccessibleModules = (userPermissions: Permission[]): Module[] =>
  getEnabledModules().filter((module) => hasPermissions(userPermissions, module.required_permissions))

export const getModuleById = (moduleId: string): Module | undefined =>
  getAppConfig().modules.find((module) => module.id === moduleId)

export const getModuleConfig = (moduleId: string): ModuleConfig | null => {
  const module = getModuleById(moduleId)
  if (!module) return null
  return moduleConfigsByFile[module.config_file] ?? null
}

export const getLayoutConfig = () => getAppConfig().layout

/**
 * Matches the first path segment whose module lists it in `contain_menus`,
 * falling back to treating the segment itself as a module id.
 */
export const getActiveModule = (pathname: string): Module | undefined => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return undefined

  const modules = getEnabledModules()
  for (const segment of segments) {
    const match = modules.find((module) => module.contain_menus.includes(segment))
    if (match) return match
  }

  return getModuleById(segments[0])
}
