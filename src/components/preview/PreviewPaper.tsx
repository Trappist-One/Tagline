import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PAGE_HEIGHT_PX, PAGE_WIDTH_PX } from '../../templates/shared'

interface Props {
  children: ReactNode
}

/**
 * A4 页面预览容器：内容按 210mm 宽排版，用 transform 缩放适配外层宽度。
 * 保证「预览即所得」——打印时按 1:1 尺寸输出。
 */
export function PreviewPaper({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setScale(width / PAGE_WIDTH_PX)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="rt-w-full">
      <div style={{ height: PAGE_HEIGHT_PX * scale }}>
        <div
          style={{
            width: PAGE_WIDTH_PX,
            height: PAGE_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="rt-bg-white rt-shadow-lg rt-overflow-hidden"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
