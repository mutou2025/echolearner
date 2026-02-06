import type { WordWithIndex } from '@/typings'

// 听写状态
export interface DictationState {
  chapterData: {
    words: WordWithIndex[]
    index: number
    wordCount: number
    correctCount: number
    wrongCount: number
  }
  timerData: {
    time: number
    accuracy: number
  }
  // 当前单词状态
  currentInput: string
  hintLevel: number          // 提示级别 (0: 无提示, 1: 首字母, 2: 更多字母...)
  maxHintLevel: number       // 最大提示级别
  attempts: number           // 当前单词尝试次数
  // 练习状态
  isPlaying: boolean         // 是否正在播放发音
  isActive: boolean          // 是否正在练习
  isFinished: boolean        // 是否完成
  showAnswer: boolean        // 是否显示答案
}

// 用户输入日志
export interface DictationInputLog {
  index: number
  word: string
  correctOnFirstTry: boolean
  attempts: number
  hintsUsed: number
  timeSpent: number
}
