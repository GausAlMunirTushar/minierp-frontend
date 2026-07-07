import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { MobileNav } from '@/components/layout/MobileNav'
import { ModuleBar } from '@/components/layout/ModuleBar'
import { ModuleSidebar } from '@/components/layout/ModuleSidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getActiveModule, getModuleConfig } from '@/lib/config-utils'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { pathname } = useLocation()

  const activeModule = useMemo(() => getActiveModule(pathname), [pathname])
  const moduleConfig = useMemo(
    () => (activeModule?.has_sidebar ? getModuleConfig(activeModule.id) : null),
    [activeModule],
  )

  const toggleSidebarCollapsed = () => setSidebarCollapsed((current) => !current)

  return (
    <div className="min-h-screen bg-background">
      <ModuleBar
        hasSidebar={Boolean(moduleConfig)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebarCollapsed}
      />
      {moduleConfig && (
        <ModuleSidebar
          config={moduleConfig}
          isOpen={false}
          onNavigate={() => { }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapsed}
        />
      )}
      <MobileNav />

      <div
        className={cn(
          'flex min-h-screen flex-col',
          moduleConfig && !sidebarCollapsed ? 'lg:pl-[336px]' : 'lg:pl-20',
        )}
      >
        <Topbar />
        <main className="flex-1 px-4 py-4 pb-24 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
