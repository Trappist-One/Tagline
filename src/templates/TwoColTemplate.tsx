import type { ResumeContent, ResumeSettings, Section } from '../types/resume'
import { dateRange } from './shared'

export interface TemplateProps {
  content: ResumeContent
  settings: ResumeSettings
}

/** 侧栏区块类型顺序：技能放侧栏，其余进主栏 */
function isSidebarSection(s: Section): boolean {
  return s.type === 'skill'
}

/**
 * B · 双栏现代
 * 深色侧栏放头像、联系方式与技能，主栏放经历内容，信息密度高。
 */
export function TwoColTemplate({ content, settings }: TemplateProps) {
  const { basics, sections } = content
  const sidebar = sections.filter((s) => !s.hidden && isSidebarSection(s))
  const main = sections.filter((s) => !s.hidden && !isSidebarSection(s))
  const contact = [basics.phone, basics.email, basics.city].filter(Boolean)

  return (
    <div
      className="resume-page rt-flex"
      style={{ ['--accent' as string]: settings.accentColor, padding: 0 }}
    >
      {/* 侧栏 */}
      <aside
        className="rt-w-[68mm] rt-shrink-0 rt-text-white rt-flex rt-flex-col rt-p-8"
        style={{ backgroundColor: settings.accentColor }}
      >
        {basics.avatar && (
          <img
            src={basics.avatar}
            alt="头像"
            className="rt-w-24 rt-h-24 rt-rounded-full rt-object-cover rt-mx-auto rt-mb-4"
          />
        )}
        <h1 className="rt-text-2xl rt-font-bold rt-text-center">{basics.name || '你的姓名'}</h1>
        {basics.intention.position && (
          <p className="rt-text-sm rt-opacity-80 rt-text-center rt-mt-1">
            {basics.intention.position}
          </p>
        )}

        {contact.length > 0 && (
          <div className="rt-mt-8">
            <h3 className="rt-text-xs rt-font-semibold rt-tracking-widest rt-opacity-70 rt-mb-2">
              联系方式
            </h3>
            <ul className="rt-space-y-1 rt-text-sm">
              {contact.map((c) => (
                <li key={c} className="rt-break-all">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(basics.intention.salary || basics.intention.type) && (
          <div className="rt-mt-8">
            <h3 className="rt-text-xs rt-font-semibold rt-tracking-widest rt-opacity-70 rt-mb-2">
              求职意向
            </h3>
            <ul className="rt-text-sm rt-space-y-1">
              {basics.intention.type && <li>类型：{basics.intention.type}</li>}
              {basics.intention.salary && <li>期望薪资：{basics.intention.salary}</li>}
            </ul>
          </div>
        )}

        {sidebar.map((section) => (
          <div key={section.id} className="rt-mt-8 rt-break-inside-avoid">
            <h3 className="rt-text-xs rt-font-semibold rt-tracking-widest rt-opacity-70 rt-mb-2">
              {section.type === 'custom' ? section.title || '自定义区块' : SIDEBAR_TITLES[section.type]}
            </h3>
            <ul className="rt-space-y-1.5 rt-text-sm">
              {section.items.map((item: any) => (
                <li key={item.id}>
                  {item.name}
                  {item.level && <span className="rt-opacity-70"> · {item.level}</span>}
                </li>
              ))}
              {section.items.length === 0 && <li className="rt-opacity-60">暂无内容</li>}
            </ul>
          </div>
        ))}
      </aside>

      {/* 主栏 */}
      <main className="rt-flex-1 rt-p-8">
        {main.map((section) => (
          <section key={section.id} className="rt-mb-6 rt-break-inside-avoid">
            <h2
              className="rt-text-base rt-font-bold rt-pb-1 rt-mb-3 rt-border-b-2"
              style={{ borderColor: settings.accentColor, color: settings.accentColor }}
            >
              {section.type === 'custom' ? section.title || '自定义区块' : MAIN_TITLES[section.type]}
            </h2>
            <div className="rt-space-y-3">
              {section.items.map((item: any) => {
                switch (section.type) {
                  case 'work':
                    return (
                      <div key={item.id}>
                        <div className="rt-flex rt-justify-between rt-text-sm">
                          <span className="rt-font-semibold">
                            {item.company}
                            {item.position && ` · ${item.position}`}
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
      </main>
    </div>
  )
}

const SIDEBAR_TITLES: Record<string, string> = { skill: '技能特长' }
const MAIN_TITLES: Record<string, string> = {
  work: '工作经历',
  project: '项目经历',
  education: '教育背景',
}
