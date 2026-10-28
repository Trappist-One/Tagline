import { useRef } from 'react'
import type { Basics } from '../../types/resume'
import { Field } from '../common/Field'
import { compressImage } from '../../utils'

interface Props {
  resumeId: string
  basics: Basics
  updateBasics: (id: string, patch: Partial<Basics>) => void
}

/** 基本信息 + 求职意向表单 */
export function BasicsForm({ resumeId, basics, updateBasics }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return
    try {
      const base64 = await compressImage(file)
      updateBasics(resumeId, { avatar: base64 })
    } catch (e) {
      alert(e instanceof Error ? e.message : '头像处理失败')
    }
  }

  return (
    <div className="rt-space-y-3">
      <div className="rt-flex rt-items-center rt-gap-4">
        {basics.avatar ? (
          <img
            src={basics.avatar}
            alt="头像"
            className="rt-h-16 rt-w-16 rt-rounded-full rt-object-cover rt-border"
          />
        ) : (
          <div className="rt-flex rt-h-16 rt-w-16 rt-items-center rt-justify-center rt-rounded-full rt-bg-neutral-200 rt-text-xs rt-text-neutral-500">
            无头像
          </div>
        )}
        <div className="rt-flex rt-flex-col rt-gap-1.5">
          <button
            className="rt-rounded-md rt-bg-neutral-900 rt-px-3 rt-py-1.5 rt-text-xs rt-text-white"
            onClick={() => fileRef.current?.click()}
          >
            {basics.avatar ? '更换头像' : '上传头像'}
          </button>
          {basics.avatar && (
            <button
              className="rt-text-xs rt-text-neutral-500 hover:rt-text-red-600"
              onClick={() => updateBasics(resumeId, { avatar: undefined })}
            >
              移除头像
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="rt-hidden"
            onChange={(e) => {
              void handleAvatar(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <div className="rt-grid rt-grid-cols-2 rt-gap-3">
        <Field
          label="姓名"
          value={basics.name}
          onChange={(e) => updateBasics(resumeId, { name: e.target.value })}
          placeholder="张三"
        />
        <Field
          label="所在城市"
          value={basics.city}
          onChange={(e) => updateBasics(resumeId, { city: e.target.value })}
          placeholder="上海"
        />
        <Field
          label="电话"
          value={basics.phone}
          onChange={(e) => updateBasics(resumeId, { phone: e.target.value })}
          placeholder="138-0000-0000"
        />
        <Field
          label="邮箱"
          value={basics.email}
          onChange={(e) => updateBasics(resumeId, { email: e.target.value })}
          placeholder="me@example.com"
        />
      </div>

      <div className="rt-grid rt-grid-cols-3 rt-gap-3">
        <Field
          label="求职岗位"
          value={basics.intention.position}
          onChange={(e) =>
            updateBasics(resumeId, {
              intention: { ...basics.intention, position: e.target.value },
            })
          }
          placeholder="前端开发工程师"
        />
        <Field
          label="期望薪资"
          value={basics.intention.salary}
          onChange={(e) =>
            updateBasics(resumeId, {
              intention: { ...basics.intention, salary: e.target.value },
            })
          }
          placeholder="15-20K"
        />
        <Field
          label="工作类型"
          value={basics.intention.type}
          onChange={(e) =>
            updateBasics(resumeId, {
              intention: { ...basics.intention, type: e.target.value },
            })
          }
          placeholder="全职"
        />
      </div>
    </div>
  )
}
