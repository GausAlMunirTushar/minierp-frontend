import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ModuleBar } from '@/components/layout/ModuleBar'
import { ModuleSidebar } from '@/components/layout/ModuleSidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getActiveModule, getModuleConfig } from '@/lib/config-utils'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { pathname } = useLocation()

  const activeModule = useMemo(() => getActiveModule(pathname), [pathname])
  const moduleConfig = useMemo(
    () => (activeModule?.has_sidebar ? getModuleConfig(activeModule.id) : null),
    [activeModule],
  )

  const closeMobileNav = () => setMobileNavOpen(false)
  const toggleSidebarCollapsed = () => setSidebarCollapsed((current) => !current)

  return (
    <div className="min-h-screen bg-background">
      <ModuleBar
        isOpen={mobileNavOpen}
        onClose={closeMobileNav}
        hasSidebar={Boolean(moduleConfig)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebarCollapsed}
      />
      {moduleConfig && (
        <ModuleSidebar
          config={moduleConfig}
          isOpen={mobileNavOpen}
          onNavigate={closeMobileNav}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapsed}
        />
      )}

      <div
        className={cn(
          'flex min-h-screen flex-col',
          moduleConfig && !sidebarCollapsed ? 'lg:pl-[336px]' : 'lg:pl-20',
        )}
      >
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
