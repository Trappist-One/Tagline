export type TemplateId = 'classic' | 'twocol' | 'accent'

export interface Intention {
  position: string
  salary: string
  type: string
}

export interface Basics {
  name: string
  phone: string
  email: string
  city: string
  /** base64，压缩后存储 */
  avatar?: string
  intention: Intention
}

export interface WorkItem {
  id: string
  company: string
  position: string
  start: string
  end: string
  desc: string
}

export interface ProjectItem {
  id: string
  name: string
  role: string
  start: string
  end: string
  desc: string
}

export interface EduItem {
  id: string
  school: string
  major: string
  degree: string
  start: string
  end: string
}

export interface SkillItem {
  id: string
  name: string
  level: string
}

export interface CustomItem {
  id: string
  title: string
  desc: string
}

export type SectionType = 'work' | 'project' | 'education' | 'skill' | 'custom'

export type Section =
  | { id: string; type: 'work'; hidden: boolean; items: WorkItem[] }
  | { id: string; type: 'project'; hidden: boolean; items: ProjectItem[] }
  | { id: string; type: 'education'; hidden: boolean; items: EduItem[] }
  | { id: string; type: 'skill'; hidden: boolean; items: SkillItem[] }
  | { id: string; type: 'custom'; hidden: boolean; title: string; items: CustomItem[] }

export interface ResumeContent {
  basics: Basics
  sections: Section[]
}

export interface ResumeSettings {
  template: TemplateId
  accentColor: string
}

export interface Resume {
  id: string
  name: string
  updatedAt: number
  content: ResumeContent
  settings: ResumeSettings
}

/** 区块类型的展示名 */
export const SECTION_META: Record<SectionType, { title: string }> = {
  work: { title: '工作经历' },
  project: { title: '项目经历' },
  education: { title: '教育背景' },
  skill: { title: '技能特长' },
  custom: { title: '自定义区块' },
}

export function sectionTitle(s: Section): string {
  return s.type === 'custom' ? s.title || '自定义区块' : SECTION_META[s.type].title
}
