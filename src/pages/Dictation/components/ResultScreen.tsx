import { DictationActionType, DictationContext } from '../store'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import IconCheck from '~icons/tabler/check'
import IconHome from '~icons/tabler/home'
import IconRefresh from '~icons/tabler/refresh'
import IconX from '~icons/tabler/x'

export default function ResultScreen() {
  const context = useContext(DictationContext)
  if (!context) throw new Error('ResultScreen must be used within DictationContext')

  const { state, dispatch } = context
  const navigate = useNavigate()

  const total = state.chapterData.correctCount + state.chapterData.wrongCount
  const accuracy = total > 0 ? Math.round((state.chapterData.correctCount / total) * 100) : 0
  const minutes = Math.floor(state.timerData.time / 60)
  const seconds = state.timerData.time % 60

  const handleRepeat = () => {
    dispatch({ type: DictationActionType.REPEAT_CHAPTER, shouldShuffle: true })
  }

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
          听写完成！
        </h2>

        {/* 统计数据 */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600 dark:text-green-400">
              <IconCheck className="h-6 w-6" />
              {state.chapterData.correctCount}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">正确</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-600 dark:text-red-400">
              <IconX className="h-6 w-6" />
              {state.chapterData.wrongCount}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">错误</div>
          </div>
        </div>

        {/* 正确率 */}
        <div className="mb-6 text-center">
          <div className="text-5xl font-bold text-indigo-500">{accuracy}%</div>
          <div className="text-gray-500 dark:text-gray-400">正确率</div>
        </div>

        {/* 用时 */}
        <div className="mb-6 text-center text-gray-600 dark:text-gray-400">
          用时: {minutes}分{seconds}秒
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleHome}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            <IconHome className="h-5 w-5" />
            返回首页
          </button>
          <button
            onClick={handleRepeat}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-500 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
          >
            <IconRefresh className="h-5 w-5" />
            再来一次
          </button>
        </div>
      </div>
    </div>
  )
}
