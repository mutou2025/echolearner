import SidebarItem from './SidebarItem'
import logo from '@/assets/logo.svg'
import { NavLink } from 'react-router-dom'
import IconHome from '~icons/tabler/home'
import IconChartBar from '~icons/tabler/chart-bar'
import IconBook from '~icons/tabler/book'
import IconAlertCircle from '~icons/tabler/alert-circle'
import IconArticle from '~icons/tabler/article'
import IconBooks from '~icons/tabler/books'
import IconCalendar from '~icons/tabler/calendar'
import IconUser from '~icons/tabler/user'
import IconSettings from '~icons/tabler/settings'
import IconMicrophone from '~icons/tabler/microphone'

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Logo */}
      <div className="px-5 py-6">
        <NavLink to="/" className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            ECHO
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Learner</span>
        </NavLink>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 space-y-1 px-3">
        <SidebarItem to="/" icon={<IconHome />} label="主页" />
        <SidebarItem to="/gallery" icon={<IconChartBar />} label="词库" />
        <SidebarItem to="/error-book" icon={<IconBook />} label="错题本" />
        <SidebarItem to="/dictation" icon={<IconArticle />} label="听写" />
        <SidebarItem to="/speaking" icon={<IconMicrophone />} label="口语跟读" />
        <SidebarItem to="/my-dictionary" icon={<IconBooks />} label="个人词库" />
        <SidebarItem to="/review" icon={<IconCalendar />} label="练习计划" />
        <SidebarItem to="/profile" icon={<IconUser />} label="个人资料" />
        <SidebarItem to="/analysis" icon={<IconChartBar />} label="数据分析" />
        <SidebarItem to="/settings" icon={<IconSettings />} label="设置" />
      </nav>
    </aside>
  )
}
