import type { Word } from '@/typings'

export type SpeakingStatus = 'idle' | 'playing' | 'listening' | 'result'

export interface SpeakingState {
  // 当前状态
  status: SpeakingStatus
  // 当前单词索引
  wordIndex: number
  // 语音识别结果
  transcript: string
  // 匹配度 (0-1)
  similarity: number
  // 置信度 (0-1)
  confidence: number
  // 统计
  correctCount: number
  wrongCount: number
  // 历史记录
  history: SpeakingRecord[]
}

export interface SpeakingRecord {
  word: Word
  transcript: string
  similarity: number
  isCorrect: boolean
  timestamp: number
}

export type SpeakingAction =
  | { type: 'SET_STATUS'; payload: SpeakingStatus }
  | { type: 'SET_TRANSCRIPT'; payload: { transcript: string; confidence: number } }
  | { type: 'SET_SIMILARITY'; payload: number }
  | { type: 'NEXT_WORD' }
  | { type: 'REPLAY' }
  | { type: 'SUBMIT_RESULT'; payload: { word: Word; isCorrect: boolean } }
  | { type: 'RESET' }
  | { type: 'SET_WORD_INDEX'; payload: number }

export const initialSpeakingState: SpeakingState = {
  status: 'idle',
  wordIndex: 0,
  transcript: '',
  similarity: 0,
  confidence: 0,
  correctCount: 0,
  wrongCount: 0,
  history: [],
}
