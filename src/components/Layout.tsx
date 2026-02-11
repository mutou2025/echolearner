import Footer from './Footer'
import { LayoutContext } from './Layout/context'
import Sidebar from './Sidebar'
import type React from 'react'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export default function Layout({ children, hideSidebar = false }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev)
  const scrollTopOffset = hideSidebar ? 0 : 48

  return (
    <LayoutContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      <div className="flex h-screen w-full">
        {/* 左侧边栏 */}
        {!hideSidebar && <Sidebar />}

        {/* 主内容区域 */}
        <main className="relative flex flex-1 flex-col overflow-hidden pb-4">
          <div className="absolute inset-0 overflow-auto" style={{ top: scrollTopOffset }}>
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </LayoutContext.Provider>
  )
}
