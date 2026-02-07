import { DictationActionType, DictationContext, getHintText } from '../store'
import usePronunciationSound from '@/hooks/usePronunciation'
import { useCallback, useContext, useEffect, useRef } from 'react'
import IconArrowRight from '~icons/tabler/arrow-right'
import IconBulb from '~icons/tabler/bulb'
import IconEye from '~icons/tabler/eye'
import IconRefresh from '~icons/tabler/refresh'
import IconVolume from '~icons/tabler/volume'

export default function DictationPanel() {
  const context = useContext(DictationContext)
  if (!context) throw new Error('DictationPanel must be used within DictationContext')

  const { state, dispatch } = context
  const currentWord = state.chapterData.words[state.chapterData.index]
  const inputRef = useRef<HTMLInputElement>(null)

  // 发音
  const { play, isPlaying } = usePronunciationSound(currentWord?.name || '')

  // 自动播放发音
  useEffect(() => {
    if (currentWord && state.isActive && !state.showAnswer) {
      const timer = setTimeout(() => {
        play()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentWord, state.isActive, state.showAnswer, play])

  // 自动聚焦输入框
  useEffect(() => {
    if (state.isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [state.isActive, state.chapterData.index])

  // 提交答案
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!state.currentInput.trim()) return

    dispatch({ type: DictationActionType.SUBMIT_ANSWER })
  }, [state.currentInput, dispatch])

  // 下一个单词
  const handleNext = useCallback(() => {
    dispatch({ type: DictationActionType.NEXT_WORD })
  }, [dispatch])

  // 显示提示
  const handleHint = useCallback(() => {
    dispatch({ type: DictationActionType.SHOW_HINT })
  }, [dispatch])

  // 显示答案
  const handleShowAnswer = useCallback(() => {
    dispatch({ type: DictationActionType.SHOW_ANSWER })
  }, [dispatch])

  // 重播发音
  const handleReplay = useCallback(() => {
    play()
  }, [play])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isActive) return

      // Tab: 重播发音
      if (e.key === 'Tab') {
        e.preventDefault()
        handleReplay()
      }
      // Ctrl+H: 显示提示
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault()
        handleHint()
      }
      // Ctrl+Enter: 显示答案
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        handleShowAnswer()
      }
      // Enter 在答案显示后: 下一个
      if (e.key === 'Enter' && state.showAnswer) {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isActive, state.showAnswer, handleReplay, handleHint, handleShowAnswer, handleNext])

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500 dark:text-gray-400">暂无单词</div>
      </div>
    )
  }

  const hintText = getHintText(currentWord.name, state.hintLevel)
  const isCorrect = state.showAnswer && state.currentInput.toLowerCase().trim() === currentWord.name.toLowerCase()

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6 px-4">
      {/* 进度显示 */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {state.chapterData.index + 1} / {state.chapterData.words.length}
      </div>

      {/* 释义显示 */}
      <div className="min-h-[60px] text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {currentWord.trans.join('; ')}
        </p>
      </div>

      {/* 发音按钮 */}
      <button
        onClick={handleReplay}
        className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${
          isPlaying
            ? 'animate-pulse bg-indigo-500 text-white'
            : 'bg-indigo-100 text-indigo-500 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50'
        }`}
        title="播放发音 (Tab)"
      >
        <IconVolume className="h-10 w-10" />
      </button>

      {/* 提示显示 */}
      {state.hintLevel > 0 && !state.showAnswer && (
        <div className="font-mono text-2xl tracking-widest text-gray-600 dark:text-gray-400">
          {hintText}
        </div>
      )}

      {/* 答案显示 */}
      {state.showAnswer && (
        <div className={`text-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          <div className="text-3xl font-bold">{currentWord.name}</div>
          {currentWord.usphone && (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              /{currentWord.usphone}/
            </div>
          )}
        </div>
      )}

      {/* 输入区域 */}
      {!state.showAnswer ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <input
            ref={inputRef}
            type="text"
            value={state.currentInput}
            onChange={(e) => dispatch({ type: DictationActionType.SET_INPUT, payload: e.target.value })}
            placeholder="输入听到的单词..."
            className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-center text-xl focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </form>
      ) : (
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
        >
          下一个
          <IconArrowRight className="h-5 w-5" />
        </button>
      )}

      {/* 操作按钮 */}
      {!state.showAnswer && (
        <div className="flex gap-4">
          <button
            onClick={handleHint}
            disabled={state.hintLevel >= state.maxHintLevel}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            title="显示提示 (Ctrl+H)"
          >
            <IconBulb className="h-4 w-4" />
            提示
          </button>
          <button
            onClick={handleReplay}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            title="重播 (Tab)"
          >
            <IconRefresh className="h-4 w-4" />
            重播
          </button>
          <button
            onClick={handleShowAnswer}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            title="显示答案 (Ctrl+Enter)"
          >
            <IconEye className="h-4 w-4" />
            答案
          </button>
        </div>
      )}

      {/* 快捷键提示 */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        Tab: 重播 | Ctrl+H: 提示 | Ctrl+Enter: 答案 | Enter: 提交/下一个
      </div>
    </div>
  )
}
