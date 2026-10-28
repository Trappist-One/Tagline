import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createSampleResume } from '../sample/resume'
import { getTemplate, TEMPLATES } from './registry'
import { isEmptyResume } from './shared'

describe('模板注册表', () => {
  it('包含三套模板且 id 唯一', () => {
    expect(TEMPLATES.map((t) => t.id)).toEqual(['classic', 'twocol', 'accent'])
  })

  it('getTemplate 对未知 id 回退到第一套', () => {
    expect(getTemplate('unknown' as never).id).toBe('classic')
  })
})

describe.each(TEMPLATES)('$name 渲染', ({ component: Template }) => {
  it('渲染示例简历的关键内容', () => {
    const resume = createSampleResume()
    render(<Template content={resume.content} settings={resume.settings} />)
    expect(screen.getByText('张明')).toBeInTheDocument()
    expect(screen.getAllByText(/某某科技有限公司/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/某某大学/).length).toBeGreaterThan(0)
  })

  it('隐藏区块不渲染', () => {
    const resume = createSampleResume()
    resume.content.sections.forEach((s) => {
      if (s.type === 'project') s.hidden = true
    })
    render(<Template content={resume.content} settings={resume.settings} />)
    expect(screen.queryByText('数据可视化中台')).not.toBeInTheDocument()
  })

  it('空区块显示占位提示', () => {
    const resume = createSampleResume()
    resume.content.sections.forEach((s) => (s.items = []))
    render(<Template content={resume.content} settings={resume.settings} />)
    expect(screen.getAllByText('暂无内容').length).toBeGreaterThan(0)
  })
})

describe('isEmptyResume', () => {
  it('空简历判定为空', () => {
    const resume = createSampleResume()
    resume.content = {
      basics: {
        name: '',
        phone: '',
        email: '',
        city: '',
        intention: { position: '', salary: '', type: '' },
      },
      sections: [],
    }
    expect(isEmptyResume(resume)).toBe(true)
  })
})
