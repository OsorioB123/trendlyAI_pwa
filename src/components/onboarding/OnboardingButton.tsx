'use client'

import { ReactNode } from 'react'

interface OnboardingButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  className?: string
}

export default function OnboardingButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}: OnboardingButtonProps) {
  if (variant === 'primary') {
    return (
      <button
        className={`primary-button-glow ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="border-glow"></div>
        <span className="relative z-10 flex items-center">
          {children}
        </span>
      </button>
    )
  }

  return (
    <button
      className={`text-white/70 hover:text-white px-6 py-3.5 rounded-full font-medium transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}