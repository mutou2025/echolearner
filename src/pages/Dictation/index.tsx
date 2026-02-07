import Layout from '@/components/Layout'
import Header from '@/components/Header'
import { DictChapterButton } from '@/pages/Typing/components/DictChapterButton'
import { useWordList } from '@/pages/Typing/hooks/useWordList'
import { randomConfigAtom } from '@/store'
import DictationPanel from './components/DictationPanel'
import ResultScreen from './components/ResultScreen'
import { DictationActionType, DictationContext, dictationReducer, initialState } from './store'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { Link } from 'react-router-dom'
import IconVolume from '~icons/tabler/volume'
import IconKeyboard from '~icons/tabler/keyboard'

export default function Dictation() {
  const [state, dispatch] = useImmerReducer(dictationReducer, structuredClone(initialState))
  const { words, isLoading } = useWordList()
  const randomConfig = useAtomValue(randomConfigAtom)
  const [showIntro, setShowIntro] = useState(true)

  // 加载单词
  useEffect(() => {
    if (words && words.length > 0) {
      dispatch({
        type: DictationActionType.SETUP_CHAPTER,
        payload: { words, shouldShuffle: randomConfig.isOpen },
      })
    }
  }, [words, randomConfig.isOpen, dispatch])

  // 计时器
  useEffect(() => {
    let intervalId: number
    if (state.isActive && !state.isFinished) {
      intervalId = window.setInterval(() => {
        dispatch({ type: DictationActionType.TICK_TIMER })
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [state.isActive, state.isFinished, dispatch])

  // 开始练习
  const handleStart = () => {
    setShowIntro(false)
    dispatch({ type: DictationActionType.START_PRACTICE })
  }

  return (
    <DictationContext.Provider value={{ state, dispatch }}>
      {state.isFinished && <ResultScreen />}
      <Layout>
        <Header>
          <DictChapterButton />
          <Link
            to="/"
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <IconKeyboard className="h-4 w-4" />
            打字模式
          </Link>
        </Header>

        <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-400 border-r-transparent"
                role="status"
              />
            </div>
          ) : showIntro ? (
            // 介绍页面
            <div className="flex max-w-lg flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <IconVolume className="h-10 w-10 text-indigo-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">听写模式</h1>
              <p className="text-center text-gray-600 dark:text-gray-400">
                听发音写单词，锻炼英语听力和拼写能力。
                <br />
                如果不确定，可以使用提示功能。
              </p>
              <div className="w-full rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <p className="mb-2 font-medium">快捷键：</p>
                <ul className="space-y-1">
                  <li><kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">Tab</kbd> 重播发音</li>
                  <li><kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">Ctrl+H</kbd> 显示提示</li>
                  <li><kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">Ctrl+Enter</kbd> 显示答案</li>
                  <li><kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">Enter</kbd> 提交/下一个</li>
                </ul>
              </div>
              <button
                onClick={handleStart}
                className="w-full rounded-lg bg-indigo-500 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
              >
                开始听写
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                共 {state.chapterData.words.length} 个单词
              </p>
            </div>
          ) : (
            <DictationPanel />
          )}
        </div>
      </Layout>
    </DictationContext.Provider>
  )
}
