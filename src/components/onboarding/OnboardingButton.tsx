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
  const baseStyles = `
    relative overflow-hidden rounded-full inline-flex items-center justify-center 
    font-medium transition-all duration-300 backdrop-blur-xl
    disabled:opacity-50 disabled:cursor-not-allowed
  `
  
  const variants = {
    primary: `
      px-8 py-3.5 bg-white/10 border border-white/14 text-white 
      hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl 
      active:scale-[0.98] disabled:hover:scale-100 disabled:hover:bg-white/10
    `,
    secondary: `
      px-6 py-3.5 text-white/70 hover:text-white
      disabled:hover:text-white/70
    `
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {variant === 'primary' && (
        <>
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none">
            <div 
              className="absolute inset-[-150%] animate-spin" 
              style={{ 
                background: 'conic-gradient(from 180deg at 50% 50%, white, rgba(255,255,255,0.5), white)',
                animationDuration: '4s'
              }} 
            />
          </div>
          
          <span className="relative z-10 flex items-center">
            {children}
          </span>
        </>
      )}
      
      {variant === 'secondary' && children}
    </button>
  )
}