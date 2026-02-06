import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * OAuth 回调页面
 * Supabase 会将用户重定向到这个页面
 * 然后我们再重定向到首页
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase 会自动处理 URL 中的 token
    // 我们只需要重定向到首页
    const timer = setTimeout(() => {
      navigate('/')
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400">正在登录...</p>
      </div>
    </div>
  )
}
