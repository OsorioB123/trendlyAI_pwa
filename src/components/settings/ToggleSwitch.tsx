'use client'

import type { ReactNode } from 'react'
import { ToggleSwitchProps } from '../../types/settings'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

function BaseToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  leading,
  ariaLabel,
  ariaDescribedById,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  leading?: ReactNode
  ariaLabel: string
  ariaDescribedById?: string
}) {
  const handleToggle = () => {
    if (disabled) return
    onChange(!checked)
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (disabled) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onChange(!checked)
        }
      }}
      className={cn(
        'flex items-center justify-between rounded-lg p-4 transition-colors',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-white/5'
      )}
    >
      <div className="flex-1 mr-4">
        <div className="flex items-center gap-3">
          {leading}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{label}</p>
              {disabled && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
                  Obrigatório
                </span>
              )}
            </div>
            {description && (
              <p id={ariaDescribedById} className="mt-1 text-sm text-white/70">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={(value) => {
          if (disabled) return
          onChange(value)
        }}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedById}
        className="data-[state=unchecked]:border-white/10 data-[state=unchecked]:bg-white/10 data-[state=checked]:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
      />
    </div>
  )
}

export default function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled = false
}: ToggleSwitchProps) {
  const descId = description ? `${label?.toString().replace(/\s+/g, '-').toLowerCase()}-desc` : undefined

  return (
    <BaseToggle
      label={label}
      description={description}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      ariaLabel={`${checked ? 'Desativar' : 'Ativar'} ${label}`}
      ariaDescribedById={descId}
    />
  )
}

interface IconToggleSwitchProps extends ToggleSwitchProps {
  icon?: ReactNode
}

export function IconToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  icon
}: IconToggleSwitchProps) {
  const descId = description ? `${label?.toString().replace(/\s+/g, '-').toLowerCase()}-desc` : undefined

  const iconBadge = icon ? (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors',
        checked ? 'bg-white/15 text-white' : 'bg-white/5 text-white/60'
      )}
    >
      {icon}
    </div>
  ) : null

  return (
    <BaseToggle
      label={label}
      description={description}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      leading={iconBadge}
      ariaLabel={`${checked ? 'Desativar' : 'Ativar'} ${label}`}
      ariaDescribedById={descId}
    />
  )
}
