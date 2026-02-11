import SidebarItem from './SidebarItem'
import logo from '@/assets/logo.svg'
import { useLayoutContext } from '@/components/Layout/context'
import { NavLink } from 'react-router-dom'
// import IconArticle from '~icons/tabler/article'
// import IconBook from '~icons/tabler/book'
// import IconBooks from '~icons/tabler/books'
// import IconCalendar from '~icons/tabler/calendar'
// import IconChartBar from '~icons/tabler/chart-bar'
// import IconChartLine from '~icons/tabler/chart-line'
// import IconHome from '~icons/tabler/home'
// import IconMicrophone from '~icons/tabler/microphone'
// import IconUser from '~icons/tabler/user'
// 听写
import IconArticle from '~icons/lucide/audio-lines'
// 学习统计
import IconChartLine from '~icons/lucide/bar-chart-3'
// 错题本
import IconBook from '~icons/lucide/book-x'
// 个人词库
import IconBooks from '~icons/lucide/bookmark'
// 练习计划
import IconCalendar from '~icons/lucide/calendar-check-2'
// 主页
import IconHome from '~icons/lucide/home'
// 词库
import IconChartBar from '~icons/lucide/library'
// 口语跟练
import IconMicrophone from '~icons/lucide/mic'
// 个人资料
import IconUser from '~icons/lucide/user'

export default function Sidebar() {
  const layoutContext = useLayoutContext()
  const collapsed = layoutContext?.isSidebarCollapsed ?? false

  return (
    <aside
      className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
        collapsed ? 'w-[82px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`py-6 ${collapsed ? 'px-3' : 'px-5'}`}>
        <NavLink
          to="/"
          className={`group flex transition-colors ${
            collapsed ? 'justify-center p-1' : 'items-start gap-3.5'
          }`}
          title={collapsed ? 'ECHOLearner 精听实验室' : undefined}
        >
          <div
            className={`grid place-items-center ${
              collapsed ? 'h-14 w-14 p-1.5' : 'h-16 w-16 p-1.5'
            }`}
            aria-hidden
          >
            <img
              src={logo}
              style={{ width: '100%', height: '100%', display: 'block' }}
              alt="Echo Learner Logo"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[18px] font-extrabold leading-[1.1] text-[#111827] dark:text-gray-100">
                ECHOLearner
              </div>
              <div className="mt-1.5 text-[13px] font-semibold leading-[1.2] text-[#6B7280] dark:text-gray-400">
                精听实验室
              </div>
              <div className="mt-2 text-[13px] font-bold leading-[1.2] text-[#C15F3C] dark:text-[#C15F3C]">
                听见·模仿·成为
              </div>
            </div>
          )}
        </NavLink>
      </div>

      {/* 菜单列表 */}
      <nav className={`flex-1 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        <SidebarItem to="/" icon={<IconHome />} label="主页" collapsed={collapsed} />
        <SidebarItem to="/gallery" icon={<IconChartBar />} label="词库" collapsed={collapsed} />
        <SidebarItem
          to="/analysis"
          icon={<IconChartLine />}
          label="学习统计"
          collapsed={collapsed}
        />
        <SidebarItem to="/error-book" icon={<IconBook />} label="错题本" collapsed={collapsed} />
        <SidebarItem to="/dictation" icon={<IconArticle />} label="听写" collapsed={collapsed} />
        <SidebarItem
          to="/speaking"
          icon={<IconMicrophone />}
          label="口语跟读"
          collapsed={collapsed}
        />
        <SidebarItem
          to="/my-dictionary"
          icon={<IconBooks />}
          label="个人词库"
          collapsed={collapsed}
        />
        <SidebarItem to="/review" icon={<IconCalendar />} label="练习计划" collapsed={collapsed} />
        <SidebarItem to="/profile" icon={<IconUser />} label="个人资料" collapsed={collapsed} />
      </nav>
    </aside>
  )
}
