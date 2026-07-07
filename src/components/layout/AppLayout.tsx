import { Boxes, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { navigationModules } from '@/configs/navigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, can } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const accessibleModules = navigationModules.filter((module) =>
    module.requiredPermissions.some((permission) => can(permission)),
  )

  const sidebar = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600 text-white">
            <Boxes size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{t('appName')}</p>
            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="lg:hidden"
          aria-label={t('close')}
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} />
        </Button>
      </div>

      <nav className="space-y-5 p-3">
        {accessibleModules.map((module) => {
          const ModuleIcon = module.icon
          const items = module.items.filter((item) =>
            item.requiredPermissions.every((permission) => can(permission)),
          )

          return (
            <section key={module.id} className="space-y-2">
              <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <ModuleIcon size={14} />
                {t(module.label)}
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100',
                          isActive && 'bg-cyan-50 text-cyan-700',
                        )
                      }
                    >
                      <Icon size={18} />
                      {t(item.label)}
                    </NavLink>
                  )
                })}
              </div>
            </section>
          )
        })}
      </nav>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        {sidebar}
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={t('close')}
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="lg:hidden"
              aria-label={t('openMenu')}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
            <div>
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={16} />
              {t('logout')}
            </Button>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
