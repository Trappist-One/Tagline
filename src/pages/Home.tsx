import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { TEMPLATES } from '../templates/registry'
import { createSampleResume } from '../sample/resume'
import { PAGE_WIDTH_PX } from '../templates/shared'

/** 落地页：模板展示 + 开始制作 */
export function Home() {
  const navigate = useNavigate()
  const createResume = useResumeStore((s) => s.createResume)
  const resumes = useResumeStore((s) => s.resumes)

  const start = () => {
    // 已有简历直接进最近编辑的，否则用示例数据开一份
    const existing = Object.values(resumes).sort((a, b) => b.updatedAt - a.updatedAt)[0]
    if (existing) {
      navigate(`/editor/${existing.id}`)
    } else {
      navigate(`/editor/${createResume('sample')}`)
    }
  }

  return (
    <div className="rt-min-h-screen rt-bg-neutral-100">
      <section className="rt-mx-auto rt-max-w-4xl rt-px-6 rt-pt-20 rt-pb-10 rt-text-center">
        <h1 className="rt-text-4xl rt-font-bold rt-tracking-tight md:rt-text-5xl">
          几分钟做好一份简历
        </h1>
        <p className="rt-mx-auto rt-mt-4 rt-max-w-xl rt-text-neutral-600">
          填写内容，实时预览，一键导出 PDF。
          <br />
          无需注册，数据只保存在你自己的浏览器里。
        </p>
        <div className="rt-mt-8 rt-flex rt-justify-center rt-gap-3">
          <button
            className="rt-rounded-xl rt-bg-neutral-900 rt-px-8 rt-py-3 rt-text-sm rt-font-medium rt-text-white hover:rt-bg-neutral-700"
            onClick={start}
          >
            开始制作简历
          </button>
        </div>
        <button
          className="rt-mt-4 rt-block rt-w-full rt-text-xs rt-text-neutral-400 hover:rt-text-neutral-600"
          onClick={() => {
            // 已有示例简历时先清理，避免越积越多
            navigate(`/editor/${createResume('sample', '示例简历')}`)
          }}
        >
          或者，先用示例简历体验 →
        </button>
      </section>

      <section className="rt-mx-auto rt-max-w-5xl rt-px-6 rt-pb-24">
        <h2 className="rt-mb-6 rt-text-center rt-text-sm rt-font-semibold rt-uppercase rt-tracking-wider rt-text-neutral-500">
          三套模板 · 一键切换
        </h2>
        <div className="rt-grid rt-gap-6 md:rt-grid-cols-3">
          {TEMPLATES.map((t) => {
            const sample = createSampleResume()
            const { component: Template } = t
            return (
              <div key={t.id} className="rt-overflow-hidden rt-rounded-xl rt-bg-white rt-shadow-md">
                <div
                  className="rt-h-64 rt-overflow-hidden"
                  style={{
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: PAGE_WIDTH_PX,
                      transform: 'scale(0.32)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <Template content={sample.content} settings={sample.settings} />
                  </div>
                </div>
                <div className="rt-border-t rt-border-neutral-100 rt-p-4">
                  <h3 className="rt-text-sm rt-font-semibold">{t.name}</h3>
                  <p className="rt-mt-1 rt-text-xs rt-text-neutral-500">{t.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="rt-pb-10 rt-text-center rt-text-xs rt-text-neutral-400">
        Tagline · 数据本地存储 · 纯前端应用
      </footer>
    </div>
  )
}
