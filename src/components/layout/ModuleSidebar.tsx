import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { getIcon } from '@/lib/icon-mapper'
import { cn } from '@/lib/utils'
import type { ModuleConfig } from '@/types/config.types'

export function ModuleSidebar({
  config,
  isOpen,
  onNavigate,
}: {
  config: ModuleConfig
  isOpen: boolean
  onNavigate: () => void
}) {
  const { t } = useTranslation()
  const { can } = useAuth()
  const [search, setSearch] = useState('')

  const menus = config.module.menus.filter((menu) =>
    t(menu.label).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-16 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0',
        // -translate-x-full only shifts by this element's own width (256px), which isn't enough
        // to clear its left-16 (64px) static offset too — use an explicit distance instead.
        isOpen ? 'translate-x-0' : '-translate-x-[320px]',
      )}
    >
      <div className="border-b border-sidebar-border p-4">
        <h2 className="text-sm font-semibold text-sidebar-foreground">{t(config.module.label)}</h2>
      </div>

      <div className="border-b border-sidebar-border p-3">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('search')}
            className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-2 text-xs text-foreground outline-none focus:border-ring"
          />
        </label>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {menus.map((menu) => {
          if (menu.required_permissions && !menu.required_permissions.every((permission) => can(permission))) {
            return null
          }

          const Icon = getIcon(menu.icon)

          return (
            <NavLink
              key={menu.id}
              to={menu.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  {Icon && <Icon size={16} />}
                  {t(menu.label)}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
