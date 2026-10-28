import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Field({ label, ...props }: FieldProps) {
  return (
    <label className="rt-block">
      <span className="rt-mb-1 rt-block rt-text-xs rt-font-medium rt-text-neutral-600">
        {label}
      </span>
      <input
        {...props}
        className="rt-w-full rt-rounded-md rt-border rt-border-neutral-300 rt-px-2.5 rt-py-1.5 rt-text-sm focus:rt-border-neutral-900 focus:rt-outline-none"
      />
    </label>
  )
}

interface AreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextArea({ label, ...props }: AreaProps) {
  return (
    <label className="rt-block">
      <span className="rt-mb-1 rt-block rt-text-xs rt-font-medium rt-text-neutral-600">
        {label}
      </span>
      <textarea
        {...props}
        className="rt-w-full rt-rounded-md rt-border rt-border-neutral-300 rt-px-2.5 rt-py-1.5 rt-text-sm focus:rt-border-neutral-900 focus:rt-outline-none"
      />
    </label>
  )
}
