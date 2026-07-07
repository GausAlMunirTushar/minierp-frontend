import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { Logo } from '@/components/common/Logo'
import { Tooltip } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { getAccessibleModules, getActiveModule } from '@/lib/config-utils'
import { getIcon } from '@/lib/icon-mapper'
import { cn } from '@/lib/utils'

export function ModuleBar({
  hasSidebar,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  hasSidebar: boolean
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}) {
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
    <aside className="group/rail fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 w-full shrink-0 items-center justify-center border-b border-sidebar-border">
        <Logo className="h-9 w-9" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1.5 py-3">
        {modules.map((module) => {
          const Icon = getIcon(module.icon)
          const isActive = activeModuleId === module.id

          return (
            <Tooltip key={module.id} label={t(module.label)} side="right">
              <NavLink
                to={module.path}
                className="group/item relative flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5"
              >
                {isActive && (
                  <span className="absolute left-1 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-primary" />
                )}
                <span
                  className={cn(
                    'relative flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'scale-110 text-primary'
                      : 'text-sidebar-foreground/60 group-hover/item:scale-105 group-hover/item:text-primary',
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-0 -z-10 rounded-full bg-primary/20 blur-md transition-opacity duration-200',
                      isActive ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100',
                    )}
                  />
                  {Icon && <Icon size={18} />}
                </span>
                <span
                  className={cn(
                    'w-full truncate text-center text-[9px] font-medium transition-colors duration-200',
                    isActive
                      ? 'font-semibold text-primary'
                      : 'text-sidebar-foreground/60 group-hover/item:text-primary',
                  )}
                >
                  {t(module.label)}
                </span>
              </NavLink>
            </Tooltip>
          )
        })}
      </nav>

      {hasSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
          title={sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
          className="absolute -right-3 top-8 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/70 opacity-0 shadow-sm transition-opacity duration-150 hover:text-primary group-hover/rail:opacity-100 lg:flex"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}
    </aside>
  )
}
