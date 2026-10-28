import { createPortal } from 'react-dom'
import type { Resume } from '../../types/resume'
import { getTemplate } from '../../templates/registry'

interface Props {
  resume: Resume
  /** 触发打印：body 加 printing class 后调用 window.print */
  onPrint: () => void
}

/**
 * 打印容器：屏幕上不可见；点击导出后渲染到 body，
 * 通过 @media print 只显示此容器，实现 1:1 A4 输出。
 */
export function PrintPortal({ resume, onPrint }: Props) {
  const { component: Template } = getTemplate(resume.settings.template)

  return createPortal(
    <div id="print-root">
      <Template content={resume.content} settings={resume.settings} />
      <button
        className="rt-fixed rt-top-4 rt-right-4 rt-z-50 rt-rounded-lg rt-bg-neutral-900 rt-px-4 rt-py-2 rt-text-sm rt-text-white rt-print:hidden"
        onClick={onPrint}
      >
        打印对话框未弹出？点这里
      </button>
    </div>,
    document.body,
  )
}
