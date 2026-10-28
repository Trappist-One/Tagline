import { ACCENT_PRESETS } from '../../templates/shared'

interface Props {
  value: string
  onChange: (color: string) => void
}

/** 主题色选择：预设色板 + 自定义取色器 */
export function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="rt-space-y-2">
      <div className="rt-flex rt-flex-wrap rt-gap-1.5">
        {ACCENT_PRESETS.map((color) => (
          <button
            key={color}
            title={color}
            onClick={() => onChange(color)}
            className={`rt-h-6 rt-w-6 rt-rounded-full rt-border-2 ${
              value === color ? 'rt-border-neutral-900 rt-scale-110' : 'rt-border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <label className="rt-flex rt-items-center rt-gap-2 rt-text-xs rt-text-neutral-600">
        自定义
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rt-h-6 rt-w-10 rt-cursor-pointer rt-rounded rt-border"
        />
        <span className="rt-font-mono">{value}</span>
      </label>
    </div>
  )
}
