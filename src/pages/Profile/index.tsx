import Layout from '@/components/Layout'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import IconUser from '~icons/tabler/user'
import IconMail from '~icons/tabler/mail'
import IconLogout from '~icons/tabler/logout'
import IconLoader from '~icons/tabler/loader-2'
import IconCloud from '~icons/tabler/cloud'
import IconCloudOff from '~icons/tabler/cloud-off'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isConfigured, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // 未配置 Supabase
  if (!isConfigured) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <IconCloudOff className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">云同步未启用</h1>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              云同步功能需要配置 Supabase。您的学习数据目前仅保存在本地。
            </p>
            <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <p className="mb-2 font-medium">如需启用云同步，请配置：</p>
              <pre className="text-xs">
{`VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key`}
              </pre>
            </div>
            <Link
              to="/"
              className="mt-6 block text-center text-indigo-500 hover:text-indigo-600"
            >
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // 未登录
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <IconUser className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
            <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">登录以同步数据</h1>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              登录后，您的学习进度将自动同步到云端，可在多设备间无缝切换。
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full rounded-lg bg-indigo-500 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-600"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="block w-full rounded-lg border border-gray-300 bg-white py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                注册新账号
              </Link>
            </div>
            <Link
              to="/"
              className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              返回首页
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  // 已登录
  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          {/* 用户头像和信息 */}
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="头像"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <IconUser className="h-10 w-10 text-indigo-500" />
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || '用户'}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <IconMail className="h-4 w-4" />
              {user?.email}
            </p>
          </div>

          {/* 同步状态 */}
          <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <IconCloud className="h-5 w-5" />
              <span className="font-medium">云同步已启用</span>
            </div>
            <p className="mt-1 text-sm text-green-600 dark:text-green-500">
              您的学习数据将自动同步到云端
            </p>
          </div>

          {/* 功能列表 */}
          <div className="space-y-2">
            <Link
              to="/"
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span>继续练习</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link
              to="/analysis"
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span>学习统计</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link
              to="/error-book"
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <span>错题本</span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>

          {/* 退出登录 */}
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-3 font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            {loading ? (
              <IconLoader className="h-5 w-5 animate-spin" />
            ) : (
              <IconLogout className="h-5 w-5" />
            )}
            退出登录
          </button>
        </div>
      </div>
    </Layout>
  )
}
