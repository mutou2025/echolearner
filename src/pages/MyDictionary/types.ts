import type { Word } from '@/typings'

export interface UserDictionary {
  id: string
  name: string
  description?: string
  words: Word[]
  createdAt: number
  updatedAt: number
}

export interface CSVRow {
  [key: string]: string
}

export interface FieldMapping {
  word: string // 单词字段
  trans: string // 翻译字段
  usphone?: string // 美式音标字段
  ukphone?: string // 英式音标字段
}

export const DEFAULT_FIELD_MAPPING: FieldMapping = {
  word: 'word',
  trans: 'trans',
  usphone: 'usphone',
  ukphone: 'ukphone',
}
