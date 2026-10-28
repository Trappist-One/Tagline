import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '../../store/resumeStore'
import type { Resume, TemplateId } from '../../types/resume'
import { TEMPLATES } from '../../templates/registry'
import { ColorPicker } from '../common/ColorPicker'

interface Props {
  resume: Resume
  onExport: () => void
}

/** 左栏：简历管理、模板切换、主题色、导出 */
export function EditorSidebar({ resume, onExport }: Props) {
  const navigate = useNavigate()
  const resumes = useResumeStore((s) => s.resumes)
  const createResume = useResumeStore((s) => s.createResume)
  const deleteResume = useResumeStore((s) => s.deleteResume)
  const duplicateResume = useResumeStore((s) => s.duplicateResume)
  const renameResume = useResumeStore((s) => s.renameResume)
  const updateSettings = useResumeStore((s) => s.updateSettings)

  return (
    <div className="rt-flex rt-h-full rt-flex-col rt-gap-5 rt-overflow-y-auto">
      <section>
        <h2 className="rt-mb-2 rt-text-xs rt-font-semibold rt-uppercase rt-tracking-wider rt-text-neutral-500">
          我的简历
        </h2>
        <ul className="rt-space-y-1">
          {Object.values(resumes)
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((r) => (
              <li
                key={r.id}
                onClick={() => r.id !== resume.id && navigate(`/editor/${r.id}`)}
                className={`rt-group rt-flex rt-cursor-pointer rt-items-center rt-gap-1 rt-rounded-md rt-px-2 rt-py-1.5 rt-text-sm ${
                  r.id === resume.id ? 'rt-bg-neutral-900 rt-text-white' : 'hover:rt-bg-neutral-200'
                }`}
              >
                <input
                  value={r.name}
                  onChange={(e) => renameResume(r.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="rt-flex-1 rt-bg-transparent focus:rt-outline-none"
                  title="点击改名"
                />
                <span className="rt-hidden rt-gap-1 group-hover:rt-flex">
                  <button
                    title="复制一份"
                    className="rt-text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      duplicateResume(r.id)
                    }}
                  >
                    📄
                  </button>
                  {Object.keys(resumes).length > 1 && (
                    <button
                      title="删除"
                      className="rt-text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`确定删除简历「${r.name}」？此操作不可恢复。`)) {
                          deleteResume(r.id)
                        }
                      }}
                    >
                      🗑
                    </button>
                  )}
                </span>
              </li>
            ))}
        </ul>
        <div className="rt-mt-2 rt-flex rt-gap-2">
          <button
            className="rt-flex-1 rt-rounded-md rt-border rt-border-neutral-300 rt-px-2 rt-py-1.5 rt-text-xs hover:rt-border-neutral-900"
            onClick={() => createResume('empty', '未命名简历')}
          >
            新建空白
          </button>
          <button
            className="rt-flex-1 rt-rounded-md rt-border rt-border-neutral-300 rt-px-2 rt-py-1.5 rt-text-xs hover:rt-border-neutral-900"
            onClick={() => createResume('sample', '示例简历')}
          >
            用示例新建
          </button>
        </div>
      </section>

      <section>
        <h2 className="rt-mb-2 rt-text-xs rt-font-semibold rt-uppercase rt-tracking-wider rt-text-neutral-500">
          模板
        </h2>
        <div className="rt-space-y-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateSettings(resume.id, { template: t.id as TemplateId })}
              className={`rt-block rt-w-full rt-rounded-md rt-border rt-px-3 rt-py-2 rt-text-left ${
                resume.settings.template === t.id
                  ? 'rt-border-neutral-900 rt-bg-neutral-100'
                  : 'rt-border-neutral-200 hover:rt-border-neutral-400'
              }`}
            >
              <div className="rt-text-sm rt-font-medium">{t.name}</div>
              <div className="rt-text-xs rt-text-neutral-500">{t.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="rt-mb-2 rt-text-xs rt-font-semibold rt-uppercase rt-tracking-wider rt-text-neutral-500">
          主题色
        </h2>
        <ColorPicker
          value={resume.settings.accentColor}
          onChange={(color) => updateSettings(resume.id, { accentColor: color })}
        />
      </section>

      <section className="rt-mt-auto rt-pb-4">
        <button
          className="rt-w-full rt-rounded-lg rt-bg-neutral-900 rt-py-2.5 rt-text-sm rt-font-medium rt-text-white hover:rt-bg-neutral-700"
          onClick={onExport}
        >
          导出 PDF
        </button>
        <p className="rt-mt-2 rt-text-center rt-text-[11px] rt-leading-relaxed rt-text-neutral-400">
          数据仅保存在本浏览器
          <br />
          清缓存前请导出 PDF 备份
        </p>
      </section>
    </div>
  )
}
