import type { Resume } from '../types/resume'

export const PAGE_WIDTH_MM = 210
export const PAGE_HEIGHT_MM = 297
/** 96dpi 下 A4 的像素尺寸，预览缩放基准 */
export const PAGE_WIDTH_PX = 794
export const PAGE_HEIGHT_PX = 1123

export function dateRange(start: string, end: string): string {
  if (start && end) return `${start} - ${end}`
  return start || end || ''
}

export function isEmptyResume(resume: Resume): boolean {
  const { basics, sections } = resume.content
  const hasBasics =
    basics.name || basics.phone || basics.email || basics.city || basics.intention.position
  const hasItems = sections.some((s) => !s.hidden && s.items.length > 0)
  return !hasBasics && !hasItems
}

/** 预设求职友好主题色 */
export const ACCENT_PRESETS = [
  '#1a73e8',
  '#2c3e50',
  '#0f766e',
  '#7c3aed',
  '#d97706',
  '#dc2626',
  '#334155',
  '#be185d',
]
