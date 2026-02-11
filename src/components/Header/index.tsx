import { useLayoutContext } from '@/components/Layout/context'
import UserMenu from '@/components/UserMenu'
import type { PropsWithChildren } from 'react'
import type React from 'react'
import { Link, useLocation } from 'react-router-dom'
import IconChevronRight from '~icons/lucide/chevron-right'
import IconHouse from '~icons/lucide/house'
import IconPanelLeftClose from '~icons/lucide/panel-left-close'
import IconPanelLeftOpen from '~icons/lucide/panel-left-open'

const routeLabelMap: Record<string, string> = {
  '/': '主页',
  '/gallery': '词库',
  '/analysis': '学习统计',
  '/error-book': '错题本',
  '/dictation': '听写',
  '/speaking': '口语跟读',
  '/my-dictionary': '个人词库',
  '/review': '练习计划',
  '/profile': '个人资料',
}

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation()
  const layoutContext = useLayoutContext()
  const isSidebarCollapsed = layoutContext?.isSidebarCollapsed ?? false
  const toggleSidebar = layoutContext?.toggleSidebar
  const currentLabel = routeLabelMap[location.pathname] ?? '当前页面'
  const fixedTopLeft = toggleSidebar ? (isSidebarCollapsed ? '82px' : '16rem') : '0px'

  return (
    <header className="z-20 mx-auto w-full px-10">
      <div
        className="fixed right-0 top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        style={{ left: fixedTopLeft }}
      >
        <div className="flex w-full items-center">
          {toggleSidebar && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex h-12 w-12 items-center justify-center border-r border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={isSidebarCollapsed ? '展开导航栏' : '折叠导航栏'}
              title={isSidebarCollapsed ? '展开导航栏' : '折叠导航栏'}
            >
              {isSidebarCollapsed ? (
                <IconPanelLeftOpen className="h-5 w-5" />
              ) : (
                <IconPanelLeftClose className="h-5 w-5" />
              )}
            </button>
          )}

          <nav className="flex h-12 flex-1 items-center justify-between px-4">
            <div className="flex min-w-0 items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/" className="inline-flex items-center gap-1.5 hover:text-indigo-600">
                <IconHouse className="h-4 w-4" />
                <span>首页</span>
              </Link>
              <IconChevronRight className="h-4 w-4 text-gray-400" />
              <span className="truncate font-medium text-indigo-600 dark:text-indigo-300">
                {currentLabel}
              </span>
            </div>
            <div className="ml-3 shrink-0">
              <UserMenu />
            </div>
          </nav>
        </div>
      </div>

      <div className="container mx-auto mt-2 flex w-full items-center justify-end pb-2">
        <div className="flex w-auto content-center items-center justify-end space-x-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
          {children}
        </div>
      </div>
    </header>
  )
}

export default Header
