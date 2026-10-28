import { beforeEach, describe, expect, it } from 'vitest'
import { useResumeStore } from './resumeStore'
import { createSampleResume } from '../sample/resume'

const genId = (() => {
  let n = 0
  return () => `id_${++n}`
})()

beforeEach(() => {
  localStorage.clear()
  // 重置 store；each resume gets deterministic content via sample
  useResumeStore.setState({ resumes: {}, activeId: null })
})

describe('简历 CRUD', () => {
  it('创建示例简历并设为活跃', () => {
    const id = useResumeStore.getState().createResume('sample')
    const state = useResumeStore.getState()
    expect(state.activeId).toBe(id)
    expect(state.resumes[id].content.sections).toHaveLength(4)
    expect(state.resumes[id].name).toBe('示例简历')
  })

  it('创建空白简历可命名', () => {
    const id = useResumeStore.getState().createResume('empty', '技术版')
    expect(useResumeStore.getState().resumes[id].name).toBe('技术版')
  })

  it('复制简历内容一致但 id/name 不同', () => {
    const id = useResumeStore.getState().createResume('sample')
    const copyId = useResumeStore.getState().duplicateResume(id)
    expect(copyId).not.toBeNull()
    const state = useResumeStore.getState()
    const source = state.resumes[id]
    const copy = state.resumes[copyId!]
    expect(copy.name).toBe('示例简历 副本')
    expect(copy.content).toEqual(source.content)
    expect(state.activeId).toBe(copyId)
  })

  it('删除活跃简历后回退到剩余第一份', () => {
    const s = useResumeStore.getState()
    const a = s.createResume('empty', 'A')
    const b = s.createResume('empty', 'B')
    useResumeStore.getState().deleteResume(b)
    expect(useResumeStore.getState().activeId).toBe(a)
    useResumeStore.getState().deleteResume(a)
    expect(useResumeStore.getState().activeId).toBeNull()
  })
})

describe('区块操作', () => {
  it('拖拽排序：moveSection 交换区块顺序', () => {
    const id = useResumeStore.getState().createResume('sample')
    const before = useResumeStore.getState().resumes[id].content.sections.map((s) => s.type)
    // before: [work, project, education, skill] — 把 skill 移到最前
    useResumeStore.getState().moveSection(id, 3, 0)
    const after = useResumeStore.getState().resumes[id].content.sections.map((s) => s.type)
    expect(before).toEqual(['work', 'project', 'education', 'skill'])
    expect(after).toEqual(['skill', 'work', 'project', 'education'])
  })

  it('moveSection 越界索引不生效', () => {
    const id = useResumeStore.getState().createResume('sample')
    const types = () =>
      useResumeStore.getState().resumes[id].content.sections.map((s) => s.type)
    const snapshot = types()
    useResumeStore.getState().moveSection(id, 0, 99)
    useResumeStore.getState().moveSection(id, -1, 1)
    expect(types()).toEqual(snapshot)
  })

  it('显隐切换与删除区块', () => {
    const id = useResumeStore.getState().createResume('sample')
    const sections = useResumeStore.getState().resumes[id].content.sections
    const target = sections[0]
    useResumeStore.getState().toggleSection(id, target.id)
    expect(
      useResumeStore.getState().resumes[id].content.sections[0].hidden,
    ).toBe(true)
    useResumeStore.getState().removeSection(id, target.id)
    expect(useResumeStore.getState().resumes[id].content.sections).toHaveLength(3)
  })

  it('新增自定义区块并改名', () => {
    const id = useResumeStore.getState().createResume('sample')
    useResumeStore.getState().addSection(id, 'custom')
    const sections = useResumeStore.getState().resumes[id].content.sections
    const last = sections[sections.length - 1]
    expect(last.type).toBe('custom')
    useResumeStore.getState().renameSection(id, last.id, '获奖经历')
    expect(
      (useResumeStore.getState().resumes[id].content.sections.at(-1) as { title: string }).title,
    ).toBe('获奖经历')
  })

  it('条目增删改', () => {
    const id = useResumeStore.getState().createResume('empty')
    const sections = useResumeStore.getState().resumes[id].content.sections
    const workId = sections[0].id
    useResumeStore.getState().addSectionItem(id, workId)
    const item = (
      useResumeStore.getState().resumes[id].content.sections[0] as { items: any[] }
    ).items[0]
    expect(item).toBeDefined()
    useResumeStore.getState().updateSectionItem(id, workId, item.id, { company: '某公司' })
    expect(
      (useResumeStore.getState().resumes[id].content.sections[0] as { items: any[] }).items[0]
        .company,
    ).toBe('某公司')
    useResumeStore.getState().removeSectionItem(id, workId, item.id)
    expect(useResumeStore.getState().resumes[id].content.sections[0].items).toHaveLength(0)
  })
})

describe('持久化', () => {
  it('状态变更写入 localStorage', async () => {
    const id = useResumeStore.getState().createResume('sample')
    await Promise.resolve()
    const raw = localStorage.getItem('tagline-resumes')
    expect(raw).toBeTruthy()
    expect(raw!).toContain(id)
  })
})

describe('示例数据', () => {
  it('createSampleResume 生成完整内容', () => {
    const resume = createSampleResume()
    expect(resume.content.basics.name).toBe('张明')
    expect(resume.content.sections.length).toBeGreaterThanOrEqual(4)
    // id 唯一性
    const ids = resume.content.sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('genId 冒烟', () => {
    expect(genId()).not.toBe(genId())
  })
})
