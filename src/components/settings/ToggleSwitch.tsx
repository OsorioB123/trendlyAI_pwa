'use client'

import { useState } from 'react'
import { ToggleSwitchProps } from '../../types/settings'

export default function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled = false
}: ToggleSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    if (disabled) return
    
    setIsAnimating(true)
    onChange(!checked)
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors group ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:bg-white/5 cursor-pointer'
    }`}
    onClick={handleToggle}
    >
      <div className="flex-1 mr-4">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium">{label}</p>
          {disabled && (
            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">
              Obrigatório
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-white/70 mt-1">{description}</p>
        )}
      </div>
      
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleToggle()
          }}
          disabled={disabled}
          className={`
            relative w-11 h-6 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/20
            ${checked 
              ? 'bg-white shadow-lg' 
              : 'bg-white/20 hover:bg-white/30'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${isAnimating ? 'scale-105' : 'hover:scale-105'}
          `}
          aria-label={`${checked ? 'Desativar' : 'Ativar'} ${label}`}
        >
          {/* Toggle Slider */}
          <div
            className={`
              w-4 h-4 rounded-full transition-all duration-300 ease-in-out transform shadow-sm
              ${checked 
                ? 'bg-gray-900 translate-x-5 shadow-md' 
                : 'bg-white translate-x-0'
              }
              ${isAnimating ? 'scale-110' : ''}
            `}
          />

          {/* Background gradient when active */}
          {checked && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-green-500/20 opacity-50" />
          )}

          {/* Ripple effect */}
          {isAnimating && (
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          )}
        </button>
      </div>
    </div>
  )
}

// Enhanced version with icons
interface IconToggleSwitchProps extends ToggleSwitchProps {
  icon?: React.ReactNode
  color?: 'default' | 'blue' | 'green' | 'purple' | 'orange'
}

export function IconToggleSwitch({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  icon,
  color = 'default'
}: IconToggleSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    if (disabled) return
    
    setIsAnimating(true)
    onChange(!checked)
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          active: 'bg-blue-500 shadow-blue-500/30',
          inactive: 'bg-blue-500/20 hover:bg-blue-500/30',
          slider: 'bg-white'
        }
      case 'green':
        return {
          active: 'bg-green-500 shadow-green-500/30',
          inactive: 'bg-green-500/20 hover:bg-green-500/30',
          slider: 'bg-white'
        }
      case 'purple':
        return {
          active: 'bg-purple-500 shadow-purple-500/30',
          inactive: 'bg-purple-500/20 hover:bg-purple-500/30',
          slider: 'bg-white'
        }
      case 'orange':
        return {
          active: 'bg-orange-500 shadow-orange-500/30',
          inactive: 'bg-orange-500/20 hover:bg-orange-500/30',
          slider: 'bg-white'
        }
      default:
        return {
          active: 'bg-white shadow-lg',
          inactive: 'bg-white/20 hover:bg-white/30',
          slider: checked ? 'bg-gray-900' : 'bg-white'
        }
    }
  }

  const colorClasses = getColorClasses()

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors group ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:bg-white/5 cursor-pointer'
    }`}
    onClick={handleToggle}
    >
      <div className="flex-1 mr-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`flex-shrink-0 p-1.5 rounded-lg ${
              checked ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'
            } transition-colors`}>
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{label}</p>
              {disabled && (
                <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                  Obrigatório
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-white/70 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleToggle()
          }}
          disabled={disabled}
          className={`
            relative w-11 h-6 rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/20
            ${checked 
              ? colorClasses.active
              : colorClasses.inactive
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${isAnimating ? 'scale-105' : 'hover:scale-105'}
          `}
          aria-label={`${checked ? 'Desativar' : 'Ativar'} ${label}`}
        >
          <div
            className={`
              w-4 h-4 rounded-full transition-all duration-300 ease-in-out transform shadow-sm
              ${checked 
                ? `${colorClasses.slider} translate-x-5 shadow-md` 
                : `${colorClasses.slider} translate-x-0`
              }
              ${isAnimating ? 'scale-110' : ''}
            `}
          />

          {isAnimating && (
            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          )}
          
          {/* Success checkmark animation */}
          {checked && isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-3 h-3 text-green-400 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}