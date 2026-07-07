import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { getAccessibleModules, getActiveModule } from '@/lib/config-utils'
import { getIcon } from '@/lib/icon-mapper'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()

  const modules = useMemo(
    () => getAccessibleModules(user?.permissions ?? [], user?.role),
    [user?.permissions, user?.role],
  )
  const activeModuleId = useMemo(
    () => getActiveModule(location.pathname)?.id ?? 'main',
    [location.pathname],
  )

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-sidebar-border bg-sidebar pb-[env(safe-area-inset-bottom)] lg:hidden">
      {modules.map((module) => {
        const Icon = getIcon(module.icon)
        const isActive = activeModuleId === module.id

        return (
          <NavLink
            key={module.id}
            to={module.path}
            className="flex flex-1 flex-col items-center justify-center gap-1"
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200',
                isActive ? 'bg-primary/15 text-primary' : 'text-sidebar-foreground/60',
              )}
            >
              {Icon && <Icon size={20} />}
            </span>
            <span
              className={cn(
                'text-[11px] font-medium transition-colors duration-200',
                isActive ? 'font-semibold text-primary' : 'text-sidebar-foreground/60',
              )}
            >
              {t(module.label)}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
