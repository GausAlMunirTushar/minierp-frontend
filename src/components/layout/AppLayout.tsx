import { Boxes, LayoutDashboard, LogOut, Package, Receipt } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
  { to: '/products', label: 'products', icon: Package, permission: 'products.view' },
  { to: '/sales', label: 'sales', icon: Receipt, permission: 'sales.create' },
] as const

export function AppLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, can } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600 text-white">
            <Boxes size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{t('appName')}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems
            .filter((item) => can(item.permission))
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
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
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
          <div>
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
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
