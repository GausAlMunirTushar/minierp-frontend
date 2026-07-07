import { useMemo } from 'react'
import { Boxes } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

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
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-16 flex-col items-center gap-1 border-r border-slate-200 bg-white py-3 transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white">
          <Boxes size={20} />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto">
          {modules.map((module) => {
            const Icon = getIcon(module.icon)
            const isActive = activeModuleId === module.id

            return (
              <NavLink
                key={module.id}
                to={module.path}
                title={t(module.label)}
                onClick={onClose}
                className={cn(
                  'flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition-colors',
                  isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-500 hover:bg-slate-100 hover:text-cyan-700',
                )}
              >
                {Icon && <Icon size={18} />}
                <span className="w-full truncate text-center text-[9px] font-medium">{t(module.label)}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
