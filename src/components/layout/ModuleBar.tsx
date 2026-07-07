import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { Logo } from '@/components/common/Logo'
import { Tooltip } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { getAccessibleModules, getActiveModule } from '@/lib/config-utils'
import { getIcon } from '@/lib/icon-mapper'
import { cn } from '@/lib/utils'

export function ModuleBar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()

  const modules = useMemo(() => getAccessibleModules(user?.permissions ?? []), [user?.permissions])
  const activeModuleId = useMemo(
    () => getActiveModule(location.pathname)?.id ?? 'main',
    [location.pathname],
  )

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label={t('close')}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-16 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar py-3 transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Logo className="mb-2 h-9 w-9 shrink-0" />

        <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto">
          {modules.map((module) => {
            const Icon = getIcon(module.icon)
            const isActive = activeModuleId === module.id

            return (
              <Tooltip key={module.id} label={t(module.label)} side="right">
                <NavLink
                  to={module.path}
                  onClick={onClose}
                  className="group relative flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5"
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <span
                    className={cn(
                      'relative flex items-center justify-center transition-all duration-200',
                      isActive
                        ? 'scale-110 text-primary'
                        : 'text-sidebar-foreground/60 group-hover:scale-105 group-hover:text-primary',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute inset-0 -z-10 rounded-full bg-primary/20 blur-md transition-opacity duration-200',
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}
                    />
                    {Icon && <Icon size={18} />}
                  </span>
                  <span
                    className={cn(
                      'w-full truncate text-center text-[9px] font-medium transition-colors duration-200',
                      isActive
                        ? 'font-semibold text-primary'
                        : 'text-sidebar-foreground/60 group-hover:text-primary',
                    )}
                  >
                    {t(module.label)}
                  </span>
                </NavLink>
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
