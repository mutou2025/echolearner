import { atomWithStorage } from 'jotai/utils'

// 边栏展开/折叠状态 - 持久化存储 (暂时保留，后续可能需要)
export const sidebarExpandedAtom = atomWithStorage('sidebarExpanded', true)
