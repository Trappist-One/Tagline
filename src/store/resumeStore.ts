import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Resume,
  ResumeContent,
  ResumeSettings,
  Section,
  SectionType,
} from '../types/resume'
import { uid } from '../utils'
import { createEmptyResume, createSampleResume } from '../sample/resume'

interface ResumeState {
  resumes: Record<string, Resume>
  activeId: string | null
  createResume: (kind: 'empty' | 'sample', name?: string) => string
  deleteResume: (id: string) => void
  duplicateResume: (id: string) => string | null
  setActive: (id: string) => void
  renameResume: (id: string, name: string) => void
  updateBasics: (id: string, patch: Partial<ResumeContent['basics']>) => void
  updateSettings: (id: string, patch: Partial<ResumeSettings>) => void
  addSection: (id: string, type: SectionType) => void
  removeSection: (id: string, sectionId: string) => void
  toggleSection: (id: string, sectionId: string) => void
  moveSection: (id: string, from: number, to: number) => void
  renameSection: (id: string, sectionId: string, title: string) => void
  addSectionItem: (id: string, sectionId: string) => void
  updateSectionItem: (
    id: string,
    sectionId: string,
    itemId: string,
    patch: Record<string, unknown>,
  ) => void
  removeSectionItem: (id: string, sectionId: string, itemId: string) => void
}

function emptySection(type: SectionType): Section {
  const id = uid('s_')
  switch (type) {
    case 'work':
      return { id, type, hidden: false, items: [] }
    case 'project':
      return { id, type, hidden: false, items: [] }
    case 'education':
      return { id, type, hidden: false, items: [] }
    case 'skill':
      return { id, type, hidden: false, items: [] }
    case 'custom':
      return { id, type, hidden: false, title: '自定义区块', items: [] }
  }
}

function touch(resume: Resume): Resume {
  return { ...resume, updatedAt: Date.now() }
}

function mapResume(state: ResumeState, id: string, fn: (r: Resume) => Resume): ResumeState {
  const resume = state.resumes[id]
  if (!resume) return state
  return { ...state, resumes: { ...state.resumes, [id]: touch(fn(resume)) } }
}

/** 区块类型对应的空白条目 */
function newSectionItem(type: Section['type']): Record<string, string> {
  const id = uid('i_')
  switch (type) {
    case 'work':
      return { id, company: '', position: '', start: '', end: '', desc: '' }
    case 'project':
      return { id, name: '', role: '', start: '', end: '', desc: '' }
    case 'education':
      return { id, school: '', major: '', degree: '', start: '', end: '' }
    case 'skill':
      return { id, name: '', level: '' }
    case 'custom':
      return { id, title: '', desc: '' }
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumes: {},
      activeId: null,

      createResume: (kind, name) => {
        const resume = kind === 'sample' ? createSampleResume() : createEmptyResume(name)
        resume.name = name ?? resume.name
        set((s) => ({
          resumes: { ...s.resumes, [resume.id]: resume },
          activeId: resume.id,
        }))
        return resume.id
      },

      deleteResume: (id) =>
        set((s) => {
          const resumes = { ...s.resumes }
          delete resumes[id]
          const activeId = s.activeId === id ? Object.keys(resumes)[0] ?? null : s.activeId
          return { resumes, activeId }
        }),

      duplicateResume: (id) => {
        const source = useResumeStore.getState().resumes[id]
        if (!source) return null
        const copy: Resume = {
          ...structuredClone(source),
          id: uid('r_'),
          name: `${source.name} 副本`,
          updatedAt: Date.now(),
        }
        set((s) => ({ resumes: { ...s.resumes, [copy.id]: copy }, activeId: copy.id }))
        return copy.id
      },

      setActive: (id) => set({ activeId: id }),
      renameResume: (id, name) => set((s) => mapResume(s, id, (r) => ({ ...r, name }))),
      updateBasics: (id, patch) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: { ...r.content, basics: { ...r.content.basics, ...patch } },
          })),
        ),
      updateSettings: (id, patch) =>
        set((s) =>
          mapResume(s, id, (r) => ({ ...r, settings: { ...r.settings, ...patch } })),
        ),

      addSection: (id, type) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: { ...r.content, sections: [...r.content.sections, emptySection(type)] },
          })),
        ),

      removeSection: (id, sectionId) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: {
              ...r.content,
              sections: r.content.sections.filter((sec) => sec.id !== sectionId),
            },
          })),
        ),

      toggleSection: (id, sectionId) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: {
              ...r.content,
              sections: r.content.sections.map((sec) =>
                sec.id === sectionId ? { ...sec, hidden: !sec.hidden } : sec,
              ),
            },
          })),
        ),

      moveSection: (id, from, to) =>
        set((s) =>
          mapResume(s, id, (r) => {
            const sections = [...r.content.sections]
            if (from < 0 || from >= sections.length || to < 0 || to >= sections.length) return r
            const [moved] = sections.splice(from, 1)
            sections.splice(to, 0, moved)
            return { ...r, content: { ...r.content, sections } }
          }),
        ),

      renameSection: (id, sectionId, title) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: {
              ...r.content,
              sections: r.content.sections.map((sec) =>
                sec.id === sectionId && sec.type === 'custom' ? { ...sec, title } : sec,
              ),
            },
          })),
        ),

      addSectionItem: (id, sectionId) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: {
              ...r.content,
              // 区块条目按 type 收窄需要逐字段守卫，这里统一用宽松类型处理
              sections: r.content.sections.map((sec) =>
                sec.id === sectionId
                  ? ({
                      ...sec,
                      items: [...sec.items, newSectionItem(sec.type)],
                    } as Section)
                  : sec,
              ),
            },
          })),
        ),

      updateSectionItem: (id, sectionId, itemId, patch) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: {
              ...r.content,
              sections: r.content.sections.map((sec) =>
                sec.id === sectionId
                  ? ({
                      ...sec,
                      items: sec.items.map((item) =>
                        item.id === itemId ? { ...item, ...patch } : item,
                      ),
                    } as Section)
                  : sec,
              ),
            },
          })),
        ),

      removeSectionItem: (id, sectionId, itemId) =>
        set((s) =>
          mapResume(s, id, (r) => ({
            ...r,
            content: {
              ...r.content,
              sections: r.content.sections.map((sec) =>
                sec.id === sectionId
                  ? ({ ...sec, items: sec.items.filter((item) => item.id !== itemId) } as Section)
                  : sec,
              ),
            },
          })),
        ),
    }),
    {
      name: 'tagline-resumes',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // 数据损坏时：备份原值后从空状态恢复，避免白屏
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          const raw = localStorage.getItem('tagline-resumes')
          if (raw) {
            try {
              localStorage.setItem(
                `tagline-resumes-backup-${Date.now()}`,
                raw,
              )
            } catch {
              /* 备份失败则放弃备份 */
            }
          }
          useResumeStore.setState({ resumes: {}, activeId: null })
        }
        // activeId 指向的简历不存在时修正
        if (state && state.activeId && !state.resumes[state.activeId]) {
          useResumeStore.setState({ activeId: Object.keys(state.resumes)[0] ?? null })
        }
      },
    },
  ),
)
