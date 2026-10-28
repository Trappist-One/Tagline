import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { EditorSidebar } from '../components/editor/EditorSidebar'
import { EditorForm } from '../components/editor/EditorForm'
import { PreviewPaper } from '../components/preview/PreviewPaper'
import { PrintPortal } from '../components/preview/PrintPortal'
import { getTemplate } from '../templates/registry'
import { isEmptyResume } from '../templates/shared'

/** 编辑器页：左栏管理 / 中栏表单 / 右栏实时预览；移动端用 Tab 切换 */
export function EditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>()
  const resume = useResumeStore((s) => (resumeId ? s.resumes[resumeId] : undefined))
  const [printing, setPrinting] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  // 打印流程：body 挂 printing class → 调起打印 → afterprint 后恢复
  useEffect(() => {
    if (!printing) return
    document.body.classList.add('printing')
    const timer = window.setTimeout(() => window.print(), 50)
    const done = () => {
      document.body.classList.remove('printing')
      setPrinting(false)
    }
    window.addEventListener('afterprint', done)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('afterprint', done)
      document.body.classList.remove('printing')
    }
  }, [printing])

  if (!resume) {
    // 简历被删或 id 非法：回默认简历
    const first = Object.keys(useResumeStore.getState().resumes)[0]
    return first ? <Navigate to={`/editor/${first}`} replace /> : <Navigate to="/" replace />
  }

  const { component: Template } = getTemplate(resume.settings.template)

  return (
    <div className="rt-flex rt-h-screen rt-flex-col rt-bg-neutral-100">
      <header className="rt-flex rt-items-center rt-justify-between rt-border-b rt-border-neutral-200 rt-bg-white rt-px-4 rt-py-2.5">
        <Link to="/" className="rt-text-base rt-font-bold">
          Tagline
        </Link>
        <div className="rt-flex rt-gap-2 md:rt-hidden">
          <button
            className={`rt-rounded-md rt-px-3 rt-py-1.5 rt-text-xs ${
              mobileTab === 'edit' ? 'rt-bg-neutral-900 rt-text-white' : 'rt-bg-neutral-200'
            }`}
            onClick={() => setMobileTab('edit')}
          >
            编辑
          </button>
          <button
            className={`rt-rounded-md rt-px-3 rt-py-1.5 rt-text-xs ${
              mobileTab === 'preview' ? 'rt-bg-neutral-900 rt-text-white' : 'rt-bg-neutral-200'
            }`}
            onClick={() => setMobileTab('preview')}
          >
            预览
          </button>
        </div>
      </header>

      <main className="rt-flex rt-min-h-0 rt-flex-1">
        {/* 左栏 */}
        <aside className="rt-hidden rt-w-56 rt-shrink-0 rt-border-r rt-border-neutral-200 rt-bg-white rt-p-4 md:rt-block">
          <EditorSidebar resume={resume} onExport={() => setPrinting(true)} />
        </aside>

        {/* 中栏表单 */}
        <div
          className={`rt-min-h-0 rt-flex-1 rt-overflow-y-auto rt-p-4 md:rt-block ${
            mobileTab === 'edit' ? 'rt-block' : 'rt-hidden'
          }`}
        >
          <div className="rt-mx-auto rt-max-w-xl">
            <EditorForm resume={resume} />
          </div>
        </div>

        {/* 右栏预览 */}
        <div
          className={`rt-min-h-0 rt-w-full rt-flex-col rt-items-center rt-overflow-y-auto rt-border-l rt-border-neutral-200 rt-bg-neutral-200/60 rt-p-6 md:rt-flex md:rt-w-[440px] lg:rt-w-[520px] ${
            mobileTab === 'preview' ? 'rt-flex' : 'rt-hidden'
          }`}
        >
          {isEmptyResume(resume) && (
            <p className="rt-mb-4 rt-rounded-md rt-bg-white/80 rt-px-3 rt-py-2 rt-text-xs rt-text-neutral-500">
              在左侧填写内容，这里会实时生成简历 ✍️
            </p>
          )}
          <PreviewPaper>
            <Template content={resume.content} settings={resume.settings} />
          </PreviewPaper>
        </div>
      </main>

      {/* 移动端导出按钮 */}
      <button
        className="rt-fixed rt-bottom-6 rt-right-4 rt-rounded-full rt-bg-neutral-900 rt-px-5 rt-py-3 rt-text-sm rt-text-white rt-shadow-lg md:rt-hidden"
        onClick={() => setPrinting(true)}
      >
        导出 PDF
      </button>

      {printing && (
        <div className="rt-fixed rt-inset-0 rt-z-50 rt-flex rt-flex-col rt-items-center rt-justify-center rt-gap-4 rt-bg-black/60">
          <div className="rt-rounded-xl rt-bg-white rt-px-8 rt-py-6 rt-text-center">
            <p className="rt-text-sm rt-font-medium">在打印对话框中选择「另存为 PDF」</p>
            <p className="rt-mt-1 rt-text-xs rt-text-neutral-500">
              纸张请保持 A4、边距「无」、勾选「背景图形」以保留主题色
            </p>
            <div className="rt-mt-4 rt-flex rt-gap-2">
              <button
                className="rt-rounded-md rt-bg-neutral-900 rt-px-4 rt-py-2 rt-text-xs rt-text-white"
                onClick={() => window.print()}
              >
                重新打开对话框
              </button>
              <button
                className="rt-rounded-md rt-border rt-border-neutral-300 rt-px-4 rt-py-2 rt-text-xs"
                onClick={() => {
                  document.body.classList.remove('printing')
                  setPrinting(false)
                }}
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {printing && <PrintPortal resume={resume} onPrint={() => window.print()} />}
    </div>
  )
}
