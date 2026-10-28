import type { ResumeContent, ResumeSettings } from '../types/resume'
import { dateRange } from './shared'

export interface TemplateProps {
  content: ResumeContent
  settings: ResumeSettings
}

/**
 * C · 主题色横幅
 * 顶部主题色横幅 + 小节左侧色条，颜色随用户设置，视觉活泼。
 */
export function AccentTemplate({ content, settings }: TemplateProps) {
  const { basics, sections } = content
  const contact = [basics.phone, basics.email, basics.city].filter(Boolean).join(' · ')
  const visible = sections.filter((s) => !s.hidden)

  return (
    <div className="resume-page" style={{ ['--accent' as string]: settings.accentColor, padding: 0 }}>
      <header
        className="rt-text-white rt-px-10 rt-py-8"
        style={{ backgroundColor: settings.accentColor }}
      >
        <div className="rt-flex rt-items-center rt-gap-6">
          {basics.avatar && (
            <img
              src={basics.avatar}
              alt="头像"
              className="rt-w-24 rt-h-24 rt-rounded-full rt-object-cover rt-border-4 rt-border-white/40"
            />
          )}
          <div>
            <h1 className="rt-text-3xl rt-font-bold">{basics.name || '你的姓名'}</h1>
            {basics.intention.position && (
              <p className="rt-text-base rt-opacity-90 rt-mt-1">{basics.intention.position}</p>
            )}
            {(contact || basics.intention.salary || basics.intention.type) && (
              <p className="rt-text-sm rt-opacity-80 rt-mt-3">
                {[
                  contact,
                  basics.intention.type && `求职类型：${basics.intention.type}`,
                  basics.intention.salary && `期望薪资：${basics.intention.salary}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="rt-px-10 rt-py-6">
        {visible.map((section) => (
          <section key={section.id} className="rt-mb-6 rt-break-inside-avoid">
            <h2
              className="rt-text-base rt-font-bold rt-border-l-4 rt-pl-3 rt-mb-3"
              style={{ borderColor: settings.accentColor, color: settings.accentColor }}
            >
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
                          <span className="rt-text-neutral-500">
                            {dateRange(item.start, item.end)}
                          </span>
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
                          <span className="rt-text-neutral-500">
                            {dateRange(item.start, item.end)}
                          </span>
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
                          <span className="rt-text-neutral-500">
                            {dateRange(item.start, item.end)}
                          </span>
                        </div>
                        {item.degree && <div className="rt-text-neutral-600">{item.degree}</div>}
                      </div>
                    )
                  case 'skill':
                    return (
                      <div key={item.id} className="rt-text-sm rt-flex rt-flex-wrap rt-gap-2">
                        <span
                          className="rt-px-2 rt-py-0.5 rt-rounded rt-text-white"
                          style={{ backgroundColor: settings.accentColor }}
                        >
                          {item.name}
                        </span>
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
    </div>
  )
}

const SECTION_TITLES: Record<string, string> = {
  work: '工作经历',
  project: '项目经历',
  education: '教育背景',
  skill: '技能特长',
}
