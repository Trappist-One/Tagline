import type { ComponentType } from 'react'
import type { ResumeContent, ResumeSettings, TemplateId } from '../types/resume'
import { ClassicTemplate } from './ClassicTemplate'
import { TwoColTemplate } from './TwoColTemplate'
import { AccentTemplate } from './AccentTemplate'

export interface TemplateProps {
  content: ResumeContent
  settings: ResumeSettings
}

export interface TemplateInfo {
  id: TemplateId
  name: string
  description: string
  /** 是否支持头像展示 */
  supportsAvatar: boolean
  component: ComponentType<TemplateProps>
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'classic',
    name: '经典单栏',
    description: '居中标题 + 分隔线，传统行业与校招通用',
    supportsAvatar: true,
    component: ClassicTemplate,
  },
  {
    id: 'twocol',
    name: '双栏现代',
    description: '深色侧栏放联系与技能，信息密度高，互联网求职偏爱',
    supportsAvatar: true,
    component: TwoColTemplate,
  },
  {
    id: 'accent',
    name: '主题色横幅',
    description: '顶部色块 + 主题色小节标题，主色可自定义',
    supportsAvatar: true,
    component: AccentTemplate,
  },
]

export function getTemplate(id: TemplateId): TemplateInfo {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
