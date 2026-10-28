import { useState } from 'react'
import type { Section } from '../../types/resume'
import { sectionTitle } from '../../types/resume'
import { Field, TextArea } from '../common/Field'

interface Props {
  section: Section
  index: number
  isDragging: boolean
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDragEnd: () => void
  onToggle: () => void
  onRemove: () => void
  onRename: (title: string) => void
  onAddItem: () => void
  onUpdateItem: (itemId: string, patch: Record<string, unknown>) => void
  onRemoveItem: (itemId: string) => void
}

/** 单个区块编辑器：拖拽排序 + 显隐 + 条目增删改 */
export function SectionEditor(props: Props) {
  const { section } = props
  const [draggingOver, setDraggingOver] = useState(false)

  return (
    <div
      className={`rt-rounded-lg rt-border rt-bg-white ${
        draggingOver ? 'rt-border-blue-500 rt-border-dashed' : 'rt-border-neutral-200'
      } ${props.isDragging ? 'rt-opacity-40' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDraggingOver(true)
        props.onDragOver(props.index)
      }}
      onDragLeave={() => setDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDraggingOver(false)
        props.onDragEnd()
      }}
    >
      <div
        className="rt-flex rt-cursor-grab rt-items-center rt-gap-2 rt-border-b rt-border-neutral-100 rt-px-3 rt-py-2 active:rt-cursor-grabbing"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move'
          props.onDragStart(props.index)
        }}
        onDragEnd={props.onDragEnd}
      >
        <span className="rt-text-neutral-400" title="拖拽排序">
          ⠿
        </span>
        {section.type === 'custom' ? (
          <input
            value={section.title}
            onChange={(e) => props.onRename(e.target.value)}
            placeholder="区块名称"
            className="rt-flex-1 rt-rounded rt-border rt-border-transparent rt-px-1.5 rt-py-0.5 rt-text-sm rt-font-medium hover:rt-border-neutral-200 focus:rt-border-neutral-900 focus:rt-outline-none"
          />
        ) : (
          <span className="rt-flex-1 rt-text-sm rt-font-medium">{sectionTitle(section)}</span>
        )}
        <button
          title={section.hidden ? '显示' : '隐藏'}
          onClick={props.onToggle}
          className="rt-rounded rt-px-1.5 rt-py-0.5 rt-text-xs rt-text-neutral-500 hover:rt-bg-neutral-100"
        >
          {section.hidden ? '🚫 已隐藏' : '👁 显示中'}
        </button>
        <button
          title="删除区块"
          onClick={props.onRemove}
          className="rt-rounded rt-px-1.5 rt-py-0.5 rt-text-xs rt-text-neutral-500 hover:rt-bg-red-50 hover:rt-text-red-600"
        >
          删除
        </button>
      </div>

      {!section.hidden && (
        <div className="rt-space-y-4 rt-p-3">
          {section.items.map((item) => (
            <div key={item.id} className="rt-space-y-2 rt-rounded-md rt-bg-neutral-50 rt-p-3">
              <ItemFields section={section} item={item} onUpdate={props.onUpdateItem} />
              <div className="rt-text-right">
                <button
                  className="rt-text-xs rt-text-neutral-500 hover:rt-text-red-600"
                  onClick={() => props.onRemoveItem(item.id)}
                >
                  删除此条
                </button>
              </div>
            </div>
          ))}
          <button
            className="rt-w-full rt-rounded-md rt-border rt-border-dashed rt-border-neutral-300 rt-py-1.5 rt-text-xs rt-text-neutral-500 hover:rt-border-neutral-900 hover:rt-text-neutral-900"
            onClick={props.onAddItem}
          >
            + 添加一条
          </button>
        </div>
      )}
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ItemFields({
  section,
  item,
  onUpdate,
}: {
  section: Section
  item: any
  onUpdate: (itemId: string, patch: Record<string, unknown>) => void
}) {
  const set = (key: string) => (e: { target: { value: string } }) =>
    onUpdate(item.id, { [key]: e.target.value })

  switch (section.type) {
    case 'work':
      return (
        <>
          <div className="rt-grid rt-grid-cols-2 rt-gap-2">
            <Field label="公司" value={item.company} onChange={set('company')} />
            <Field label="职位" value={item.position} onChange={set('position')} />
            <Field label="开始时间" value={item.start} onChange={set('start')} placeholder="2021.06" />
            <Field label="结束时间" value={item.end} onChange={set('end')} placeholder="至今" />
          </div>
          <TextArea
            label="工作内容（换行分条）"
            value={item.desc}
            onChange={set('desc')}
            rows={3}
          />
        </>
      )
    case 'project':
      return (
        <>
          <div className="rt-grid rt-grid-cols-2 rt-gap-2">
            <Field label="项目名称" value={item.name} onChange={set('name')} />
            <Field label="担任角色" value={item.role} onChange={set('role')} />
            <Field label="开始时间" value={item.start} onChange={set('start')} placeholder="2022.03" />
            <Field label="结束时间" value={item.end} onChange={set('end')} placeholder="2023.01" />
          </div>
          <TextArea label="项目描述（换行分条）" value={item.desc} onChange={set('desc')} rows={3} />
        </>
      )
    case 'education':
      return (
        <div className="rt-grid rt-grid-cols-2 rt-gap-2">
          <Field label="学校" value={item.school} onChange={set('school')} />
          <Field label="专业" value={item.major} onChange={set('major')} />
          <Field label="学历" value={item.degree} onChange={set('degree')} placeholder="本科" />
          <div className="rt-grid rt-grid-cols-2 rt-gap-2">
            <Field label="开始" value={item.start} onChange={set('start')} placeholder="2014.09" />
            <Field label="结束" value={item.end} onChange={set('end')} placeholder="2018.06" />
          </div>
        </div>
      )
    case 'skill':
      return (
        <div className="rt-grid rt-grid-cols-2 rt-gap-2">
          <Field label="技能" value={item.name} onChange={set('name')} placeholder="JavaScript" />
          <Field label="程度" value={item.level} onChange={set('level')} placeholder="精通" />
        </div>
      )
    case 'custom':
      return (
        <>
          <Field label="条目标题" value={item.title} onChange={set('title')} />
          <TextArea label="描述" value={item.desc} onChange={set('desc')} rows={3} />
        </>
      )
  }
}
