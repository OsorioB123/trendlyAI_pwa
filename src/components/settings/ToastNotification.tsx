'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { ToastNotification as ToastType } from '../../types/settings'

interface ToastNotificationProps {
  toast: ToastType
  onClose: (id: string) => void
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}

const TOAST_COLORS = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    text: 'text-green-100'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-100'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    text: 'text-blue-100'
  },
  warning: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: 'text-orange-400',
    text: 'text-orange-100'
  }
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = TOAST_ICONS[toast.type]
  const colors = TOAST_COLORS[toast.type]

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }, [onClose, toast.id])

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, handleClose])

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[100] max-w-sm w-full mx-4
        transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-2 opacity-0 scale-95'
        }
      `}
    >
      <div
        className={`
          relative backdrop-filter backdrop-blur-lg rounded-xl p-4 border
          ${colors.bg} ${colors.border}
          shadow-lg shadow-black/20
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${colors.icon}`}>
            <Icon size={20} strokeWidth={1.5} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-5 ${colors.text}`}>
              {toast.message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-white/60 hover:text-white/80 transition-colors duration-200 p-1 -m-1"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Progress bar for timed toasts */}
        {toast.duration && toast.duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
            <div
              className={`h-full ${colors.icon} opacity-60`}
              style={{
                animation: `toast-progress ${toast.duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastType[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <div className="flex flex-col gap-3 items-end justify-end min-h-full p-6">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastNotification toast={toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  )
}


