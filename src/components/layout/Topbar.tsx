import { useMemo } from 'react'
import { Bell, ChevronDown, LogOut, Menu, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { getActiveModule, getModuleConfig } from '@/lib/config-utils'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const breadcrumbs = useMemo(() => {
    const module = getActiveModule(pathname)
    if (!module) return []

    const crumbs = [t(module.label)]
    const menu = getModuleConfig(module.id)?.module.menus.find((item) => item.path === pathname)
    if (menu && menu.label !== module.label) {
      crumbs.push(t(menu.label))
    }
    return crumbs
  }, [pathname, t])

  const initials =
    (user?.name ?? '')
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || undefined

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          className="lg:hidden"
          aria-label={t('openMenu')}
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </Button>

        <nav className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb} className="flex items-center gap-2">
              {index > 0 && <span className="text-border">/</span>}
              <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-foreground' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />

        <button
          type="button"
          className="relative rounded-lg p-2 text-foreground transition-colors hover:bg-accent"
          aria-label={t('notifications')}
          title={t('notifications')}
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-semibold text-primary-foreground shadow-inner">
                {initials ?? <User size={14} />}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium text-foreground">{user?.name}</span>
                <span className="block text-xs capitalize text-muted-foreground">{user?.role}</span>
              </span>
              <ChevronDown size={14} className="hidden text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
              <LogOut size={14} className="mr-2" />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
