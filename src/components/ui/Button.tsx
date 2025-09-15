'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Check, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 overflow-hidden active:scale-[0.98] min-h-[48px] px-6',
  {
    variants: {
      variant: {
        default: 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-black/25 hover:shadow-black/35',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25',
        outline: 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm',
        secondary: 'bg-white/10 text-white hover:bg-white/15 backdrop-blur-sm border border-white/15',
        ghost: 'text-white hover:bg-white/10 border border-transparent hover:border-white/15',
        link: 'text-yellow-400 underline-offset-4 hover:underline hover:text-yellow-300',
        glass: 'bg-white/5 text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-xl',
      },
      size: {
        default: 'min-h-[48px] px-6 py-3',
        sm: 'min-h-[44px] px-4 py-2 text-sm',
        lg: 'min-h-[56px] px-8 py-4 text-lg',
        xl: 'min-h-[64px] px-10 py-5 text-xl',
        icon: 'min-h-[48px] min-w-[48px] p-0',
      },
      rounded: {
        default: 'rounded-xl',
        full: 'rounded-full',
        none: 'rounded-none',
        lg: 'rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
    },
  }
)

const rippleVariants = {
  initial: { scale: 0, opacity: 0.6 },
  animate: { scale: 4, opacity: 0 },
  exit: { opacity: 0 }
}

const loadingVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
}

const successVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  loading?: boolean
  success?: boolean
  error?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  ripple?: boolean
  haptic?: boolean
}

interface RippleProps {
  x: number
  y: number
  id: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      children,
      loading = false,
      success = false,
      error = false,
      loadingText,
      successText,
      errorText,
      icon,
      rightIcon,
      ripple = true,
      haptic = true,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<RippleProps[]>([])
    const [isPressed, setIsPressed] = React.useState(false)

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return

        // Haptic feedback
        if (haptic && 'vibrate' in navigator) {
          navigator.vibrate(50)
        }

        // Ripple effect
        if (ripple) {
          const button = event.currentTarget
          const rect = button.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          const id = Date.now().toString()

          setRipples(prev => [...prev, { x, y, id }])

          setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== id))
          }, 600)
        }

        onClick?.(event)
      },
      [disabled, loading, haptic, ripple, onClick]
    )

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)
    const handleMouseLeave = () => setIsPressed(false)

    const getContent = () => {
      if (loading) return loadingText || children
      if (success) return successText || children
      if (error) return errorText || children
      return children
    }

    const getIcon = () => {
      if (loading) return <Loader2 className="w-4 h-4 animate-spin" />
      if (success) return <Check className="w-4 h-4" />
      if (error) return <X className="w-4 h-4" />
      return icon
    }

    const buttonClasses = cn(
      buttonVariants({ variant, size, rounded, className }),
      {
        'cursor-not-allowed opacity-60': disabled && !loading,
        'cursor-wait': loading,
        'scale-[0.96]': isPressed && !disabled && !loading,
      }
    )

    const MButton = motion.button as any
    return (
      <MButton
        ref={ref}
        className={buttonClasses}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || loading}
        whileHover={disabled || loading ? {} : { scale: 1.02 }}
        whileTap={disabled || loading ? {} : { scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...props}
      >
        {/* Ripple Effect */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              className="absolute pointer-events-none rounded-full bg-white/30"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 10,
                height: 10,
                transform: 'translate(-50%, -50%)',
              }}
              variants={rippleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Content */}
        <div className="flex items-center justify-center gap-2 relative z-10">
          <AnimatePresence mode="wait">
            {getIcon() && (
              <motion.div
                key={`${loading}-${success}-${error}`}
                variants={loading ? loadingVariants : successVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                {getIcon()}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.span
              key={`content-${loading}-${success}-${error}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              {getContent()}
            </motion.span>
          </AnimatePresence>

          {rightIcon && (
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {rightIcon}
            </motion.div>
          )}
        </div>

        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] opacity-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </MButton>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
