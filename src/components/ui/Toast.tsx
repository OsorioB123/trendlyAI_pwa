'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  removeAllToasts: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [removeToast])

  const removeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />
    case 'error':
      return <AlertCircle className="w-5 h-5" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />
    case 'info':
    default:
      return <Info className="w-5 h-5" />
  }
}

const getToastStyles = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'border-green-500/30 bg-green-500/10 text-green-300'
    case 'error':
      return 'border-red-500/30 bg-red-500/10 text-red-300'
    case 'warning':
      return 'border-white/30 bg-white/10 text-white'
    case 'info':
    default:
      return 'border-white/20 bg-white/5 text-white/90'
  }
}

const ToastItem = ({ toast }: { toast: Toast }) => {
  const { removeToast } = useToast()
  
  const handleClose = () => {
    removeToast(toast.id)
  }

  const handleAction = () => {
    toast.action?.onClick()
    removeToast(toast.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl border shadow-lg max-w-sm w-full',
        'min-h-[48px]', // Minimum touch target
        getToastStyles(toast.type)
      )}
      role="status"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getToastIcon(toast.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs opacity-80 mt-1 leading-relaxed">
            {toast.description}
          </p>
        )}
        
        {/* Action button */}
        {toast.action && (
          <motion.button
            onClick={handleAction}
            className="mt-2 text-xs font-medium underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity min-h-[32px] px-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {toast.action.label}
          </motion.button>
        )}
      </div>

      {/* Close button */}
      <motion.button
        onClick={handleClose}
        className="flex-shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg opacity-50 hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </motion.button>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-xl"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <div 
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
      role="region"
      aria-label="Notificações"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Convenience hook for common toast types
export const useToastActions = () => {
  const { addToast } = useToast()

  return {
    success: (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
  }
}
