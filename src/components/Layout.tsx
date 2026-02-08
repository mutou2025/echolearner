import Footer from './Footer'
import Sidebar from './Sidebar'
import type React from 'react'

interface LayoutProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export default function Layout({ children, hideSidebar = false }: LayoutProps) {
  return (
    <div className="flex h-screen w-full">
      {/* 左侧边栏 */}
      {!hideSidebar && <Sidebar />}

      {/* 主内容区域 */}
      <main className="flex flex-1 flex-col overflow-auto pb-4">
        {children}
        <Footer />
      </main>
    </div>
  )
}
