import { useRef, useState } from 'react'
import type { Resume, SectionType } from '../../types/resume'
import { SECTION_META } from '../../types/resume'
import { useResumeStore } from '../../store/resumeStore'
import { BasicsForm } from './BasicsForm'
import { SectionEditor } from './SectionEditor'

/** 可添加的区块类型（custom 为自定义） */
const ADDABLE: SectionType[] = ['work', 'project', 'education', 'skill', 'custom']

/** 中栏内容编辑区：基本信息 + 区块列表（拖拽排序/显隐） */
export function EditorForm({ resume }: { resume: Resume }) {
  const updateBasics = useResumeStore((s) => s.updateBasics)
  const addSection = useResumeStore((s) => s.addSection)
  const removeSection = useResumeStore((s) => s.removeSection)
  const toggleSection = useResumeStore((s) => s.toggleSection)
  const moveSection = useResumeStore((s) => s.moveSection)
  const renameSection = useResumeStore((s) => s.renameSection)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const updateSectionItem = useResumeStore((s) => s.updateSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  const dragIndex = useRef<number | null>(null)
  const overIndex = useRef<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const handleDrop = () => {
    const from = dragIndex.current
    const to = overIndex.current
    dragIndex.current = null
    overIndex.current = null
    if (from !== null && to !== null && from !== to) {
      moveSection(resume.id, from, to)
    } else {
      // 未发生移动也要强制重渲染，清除拖拽样式
      moveSection(resume.id, -1, -1)
    }
  }

  return (
    <div className="rt-space-y-4">
      <section className="rt-rounded-lg rt-border rt-border-neutral-200 rt-bg-white rt-p-4">
        <h2 className="rt-mb-3 rt-text-sm rt-font-semibold">基本信息</h2>
        <BasicsForm resumeId={resume.id} basics={resume.content.basics} updateBasics={updateBasics} />
      </section>

      {resume.content.sections.map((section, index) => (
        <SectionEditor
          key={section.id}
          section={section}
          index={index}
          isDragging={false}
          onDragStart={(i) => (dragIndex.current = i)}
          onDragOver={(i) => (overIndex.current = i)}
          onDragEnd={handleDrop}
          onToggle={() => toggleSection(resume.id, section.id)}
          onRemove={() => {
            if (confirm(`确定删除「${section.type === 'custom' ? section.title : SECTION_META[section.type].title}」区块？`)) {
              removeSection(resume.id, section.id)
            }
          }}
          onRename={(title) => renameSection(resume.id, section.id, title)}
          onAddItem={() => addSectionItem(resume.id, section.id)}
          onUpdateItem={(itemId, patch) => updateSectionItem(resume.id, section.id, itemId, patch)}
          onRemoveItem={(itemId) => removeSectionItem(resume.id, section.id, itemId)}
        />
      ))}

      <div className="rt-relative">
        <button
          className="rt-w-full rt-rounded-lg rt-border rt-border-dashed rt-border-neutral-400 rt-py-2 rt-text-sm rt-text-neutral-600 hover:rt-border-neutral-900 hover:rt-text-neutral-900"
          onClick={() => setShowAdd((v) => !v)}
        >
          + 添加区块
        </button>
        {showAdd && (
          <div className="rt-absolute rt-inset-x-0 rt-bottom-full rt-z-10 rt-mb-1 rt-rounded-lg rt-border rt-border-neutral-200 rt-bg-white rt-p-1 rt-shadow-lg">
            {ADDABLE.map((type) => (
              <button
                key={type}
                className="rt-block rt-w-full rt-rounded rt-px-3 rt-py-2 rt-text-left rt-text-sm hover:rt-bg-neutral-100"
                onClick={() => {
                  addSection(resume.id, type)
                  setShowAdd(false)
                }}
              >
                {SECTION_META[type].title}
                {type === 'custom' && '（可改名）'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
