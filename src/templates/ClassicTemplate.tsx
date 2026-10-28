import type { ResumeContent, ResumeSettings } from '../types/resume'
import { dateRange } from './shared'

export interface TemplateProps {
  content: ResumeContent
  settings: ResumeSettings
}

/**
 * A · 经典单栏
 * 居中标题 + 分隔线，单栏结构，适合传统行业与校招。
 */
export function ClassicTemplate({ content, settings }: TemplateProps) {
  const { basics, sections } = content
  const contact = [basics.phone, basics.email, basics.city].filter(Boolean).join(' · ')
  const visible = sections.filter((s) => !s.hidden)

  return (
    <div className="resume-page" style={{ ['--accent' as string]: settings.accentColor }}>
      <header className="rt-text-center rt-border-b-2 rt-border-neutral-800 rt-pb-4 rt-mb-5">
        <div className="rt-flex rt-items-center rt-justify-center rt-gap-5">
          {basics.avatar && (
            <img
              src={basics.avatar}
              alt="头像"
              className="rt-w-20 rt-h-20 rt-rounded-full rt-object-cover"
            />
          )}
          <div>
            <h1 className="rt-text-3xl rt-font-bold rt-tracking-[0.2em]">
              {basics.name || '你的姓名'}
            </h1>
            {(basics.intention.position || contact) && (
              <p className="rt-text-sm rt-text-neutral-600 rt-mt-2">
                {basics.intention.position && <span>{basics.intention.position}</span>}
                {basics.intention.position && contact && <span> · </span>}
                <span>{contact}</span>
              </p>
            )}
          </div>
        </div>
        {(basics.intention.salary || basics.intention.type) && (
          <p className="rt-text-sm rt-text-neutral-600 rt-mt-2">
            求职意向：
            {[basics.intention.type, basics.intention.position, basics.intention.salary]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </header>

      {visible.map((section) => (
        <section key={section.id} className="rt-mb-5 rt-break-inside-avoid">
          <h2 className="rt-text-base rt-font-bold rt-border-b rt-border-neutral-300 rt-pb-1 rt-mb-3">
            {section.type === 'custom' ? section.title || '自定义区块' : SECTION_TITLES[section.type]}
          </h2>
          <div className="rt-space-y-3">
            {section.items.map((item: any) => {
              switch (section.type) {
                case 'work':
                  return (
                    <div key={item.id}>
                      <div className="rt-flex rt-justify-between rt-text-sm">
                        <span className="rt-font-semibold">{item.company}</span>
                        <span className="rt-text-neutral-500">{dateRange(item.start, item.end)}</span>
                      </div>
                      {item.position && <div className="rt-text-sm">{item.position}</div>}
                      {item.desc && (
                        <p className="rt-text-sm rt-text-neutral-600 rt-whitespace-pre-line rt-mt-1">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  )
                case 'project':
                  return (
                    <div key={item.id}>
                      <div className="rt-flex rt-justify-between rt-text-sm">
                        <span className="rt-font-semibold">
                          {item.name}
                          {item.role && ` · ${item.role}`}
                        </span>
                        <span className="rt-text-neutral-500">{dateRange(item.start, item.end)}</span>
                      </div>
                      {item.desc && (
                        <p className="rt-text-sm rt-text-neutral-600 rt-whitespace-pre-line rt-mt-1">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  )
                case 'education':
                  return (
                    <div key={item.id} className="rt-text-sm">
                      <div className="rt-flex rt-justify-between">
                        <span className="rt-font-semibold">
                          {item.school}
                          {item.major && ` · ${item.major}`}
                        </span>
                        <span className="rt-text-neutral-500">{dateRange(item.start, item.end)}</span>
                      </div>
                      {item.degree && <div className="rt-text-neutral-600">{item.degree}</div>}
                    </div>
                  )
                case 'skill':
                  return (
                    <div key={item.id} className="rt-text-sm rt-flex rt-gap-3">
                      <span className="rt-font-semibold">{item.name}</span>
                      {item.level && <span className="rt-text-neutral-500">{item.level}</span>}
                    </div>
                  )
                case 'custom':
                  return (
                    <div key={item.id}>
                      <div className="rt-text-sm rt-font-semibold">{item.title}</div>
                      {item.desc && (
                        <p className="rt-text-sm rt-text-neutral-600 rt-whitespace-pre-line rt-mt-1">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  )
              }
            })}
            {section.items.length === 0 && (
              <p className="rt-text-sm rt-text-neutral-400">暂无内容</p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

const SECTION_TITLES: Record<string, string> = {
  work: '工作经历',
  project: '项目经历',
  education: '教育背景',
  skill: '技能特长',
}
