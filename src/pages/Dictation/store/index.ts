import type { DictationState } from './type'
import type { WordWithIndex } from '@/typings'
import shuffle from '@/utils/shuffle'
import { createContext } from 'react'

export const initialState: DictationState = {
  chapterData: {
    words: [],
    index: 0,
    wordCount: 0,
    correctCount: 0,
    wrongCount: 0,
  },
  timerData: {
    time: 0,
    accuracy: 0,
  },
  currentInput: '',
  hintLevel: 0,
  maxHintLevel: 0,
  attempts: 0,
  isPlaying: false,
  isActive: false,
  isFinished: false,
  showAnswer: false,
}

export enum DictationActionType {
  SETUP_CHAPTER = 'SETUP_CHAPTER',
  SET_INPUT = 'SET_INPUT',
  PLAY_SOUND = 'PLAY_SOUND',
  STOP_SOUND = 'STOP_SOUND',
  SUBMIT_ANSWER = 'SUBMIT_ANSWER',
  SHOW_HINT = 'SHOW_HINT',
  SHOW_ANSWER = 'SHOW_ANSWER',
  NEXT_WORD = 'NEXT_WORD',
  SKIP_WORD = 'SKIP_WORD',
  START_PRACTICE = 'START_PRACTICE',
  PAUSE_PRACTICE = 'PAUSE_PRACTICE',
  FINISH_CHAPTER = 'FINISH_CHAPTER',
  REPEAT_CHAPTER = 'REPEAT_CHAPTER',
  TICK_TIMER = 'TICK_TIMER',
}

export type DictationAction =
  | { type: DictationActionType.SETUP_CHAPTER; payload: { words: WordWithIndex[]; shouldShuffle: boolean } }
  | { type: DictationActionType.SET_INPUT; payload: string }
  | { type: DictationActionType.PLAY_SOUND }
  | { type: DictationActionType.STOP_SOUND }
  | { type: DictationActionType.SUBMIT_ANSWER }
  | { type: DictationActionType.SHOW_HINT }
  | { type: DictationActionType.SHOW_ANSWER }
  | { type: DictationActionType.NEXT_WORD }
  | { type: DictationActionType.SKIP_WORD }
  | { type: DictationActionType.START_PRACTICE }
  | { type: DictationActionType.PAUSE_PRACTICE }
  | { type: DictationActionType.FINISH_CHAPTER }
  | { type: DictationActionType.REPEAT_CHAPTER; shouldShuffle: boolean }
  | { type: DictationActionType.TICK_TIMER }

type Dispatch = (action: DictationAction) => void

// 获取提示文本
function getHintText(word: string, level: number): string {
  if (level <= 0) return ''
  const revealCount = Math.min(level, word.length)
  return word.slice(0, revealCount) + '_'.repeat(word.length - revealCount)
}

export const dictationReducer = (state: DictationState, action: DictationAction) => {
  switch (action.type) {
    case DictationActionType.SETUP_CHAPTER: {
      const newState = structuredClone(initialState)
      const words = action.payload.shouldShuffle ? shuffle(action.payload.words) : action.payload.words
      newState.chapterData.words = words
      if (words.length > 0) {
        newState.maxHintLevel = Math.ceil(words[0].name.length / 2)
      }
      return newState
    }

    case DictationActionType.SET_INPUT:
      state.currentInput = action.payload
      break

    case DictationActionType.PLAY_SOUND:
      state.isPlaying = true
      break

    case DictationActionType.STOP_SOUND:
      state.isPlaying = false
      break

    case DictationActionType.SUBMIT_ANSWER: {
      const currentWord = state.chapterData.words[state.chapterData.index]
      if (!currentWord) break

      const isCorrect = state.currentInput.toLowerCase().trim() === currentWord.name.toLowerCase()
      state.attempts += 1

      if (isCorrect) {
        state.chapterData.correctCount += 1
        state.showAnswer = true
      } else {
        state.chapterData.wrongCount += 1
        // 错误后自动显示一级提示
        if (state.hintLevel === 0) {
          state.hintLevel = 1
        }
      }
      break
    }

    case DictationActionType.SHOW_HINT: {
      const currentWord = state.chapterData.words[state.chapterData.index]
      if (!currentWord) break

      const maxLevel = Math.ceil(currentWord.name.length / 2)
      if (state.hintLevel < maxLevel) {
        state.hintLevel += 1
      }
      break
    }

    case DictationActionType.SHOW_ANSWER:
      state.showAnswer = true
      break

    case DictationActionType.NEXT_WORD: {
      const nextIndex = state.chapterData.index + 1
      if (nextIndex >= state.chapterData.words.length) {
        state.isActive = false
        state.isFinished = true
      } else {
        state.chapterData.index = nextIndex
        state.chapterData.wordCount += 1
        state.currentInput = ''
        state.hintLevel = 0
        state.attempts = 0
        state.showAnswer = false
        const nextWord = state.chapterData.words[nextIndex]
        if (nextWord) {
          state.maxHintLevel = Math.ceil(nextWord.name.length / 2)
        }
      }
      break
    }

    case DictationActionType.SKIP_WORD: {
      const nextIndex = state.chapterData.index + 1
      if (nextIndex >= state.chapterData.words.length) {
        state.isActive = false
        state.isFinished = true
      } else {
        state.chapterData.index = nextIndex
        state.currentInput = ''
        state.hintLevel = 0
        state.attempts = 0
        state.showAnswer = false
        const nextWord = state.chapterData.words[nextIndex]
        if (nextWord) {
          state.maxHintLevel = Math.ceil(nextWord.name.length / 2)
        }
      }
      break
    }

    case DictationActionType.START_PRACTICE:
      state.isActive = true
      break

    case DictationActionType.PAUSE_PRACTICE:
      state.isActive = false
      break

    case DictationActionType.FINISH_CHAPTER:
      state.isActive = false
      state.isFinished = true
      break

    case DictationActionType.REPEAT_CHAPTER: {
      const newState = structuredClone(initialState)
      newState.chapterData.words = action.shouldShuffle
        ? shuffle(state.chapterData.words)
        : state.chapterData.words
      newState.isActive = true
      if (newState.chapterData.words.length > 0) {
        newState.maxHintLevel = Math.ceil(newState.chapterData.words[0].name.length / 2)
      }
      return newState
    }

    case DictationActionType.TICK_TIMER: {
      state.timerData.time += 1
      const total = state.chapterData.correctCount + state.chapterData.wrongCount
      state.timerData.accuracy = total > 0 ? Math.round((state.chapterData.correctCount / total) * 100) : 0
      break
    }

    default:
      return state
  }
}

export const DictationContext = createContext<{ state: DictationState; dispatch: Dispatch } | null>(null)

export { getHintText }
