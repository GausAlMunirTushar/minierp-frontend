import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { ModuleBar } from '@/components/layout/ModuleBar'
import { ModuleSidebar } from '@/components/layout/ModuleSidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getActiveModule, getModuleConfig } from '@/lib/config-utils'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { pathname } = useLocation()

  const activeModule = useMemo(() => getActiveModule(pathname), [pathname])
  const moduleConfig = useMemo(
    () => (activeModule?.has_sidebar ? getModuleConfig(activeModule.id) : null),
    [activeModule],
  )

  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="min-h-screen bg-background">
      <ModuleBar isOpen={mobileNavOpen} onClose={closeMobileNav} />
      {moduleConfig && (
        <ModuleSidebar config={moduleConfig} isOpen={mobileNavOpen} onNavigate={closeMobileNav} />
      )}

      <div className={cn('flex min-h-screen flex-col', moduleConfig ? 'lg:pl-[336px]' : 'lg:pl-20')}>
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
