'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Standardized easing and timing
const EASING = {
  primary: [0.16, 1, 0.3, 1] as const,
  quick: [0.25, 0.46, 0.45, 0.94] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const
}

// Enhanced skeleton card component
export function EnhancedSkeletonCard({ index = 0 }: { index?: number }) {
  const skeletonVariants = {
    loading: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.1
      }
    }
  }

  const shimmerVariants = {
    loading: {
      x: ["-100%", "100%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2
      }
    }
  }

  return (
    <motion.div
      className="h-72 rounded-2xl overflow-hidden relative"
      variants={skeletonVariants as any}
      animate="loading"
      initial={{ opacity: 0, y: 20 }}
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -skew-x-12"
        variants={shimmerVariants as any}
        animate="loading"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          width: "200%"
        }}
      />

      {/* Mock content structure */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top badges */}
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="w-20 h-6 bg-white/10 rounded-full" />
            <div className="w-24 h-5 bg-white/8 rounded-full" />
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-full" />
        </div>

        {/* Bottom content */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="w-full h-5 bg-white/10 rounded" />
            <div className="w-3/4 h-5 bg-white/8 rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-white/8 rounded" />
            <div className="w-2/3 h-4 bg-white/6 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-6 bg-white/8 rounded-full" />
            <div className="w-20 h-6 bg-white/6 rounded-full" />
            <div className="w-12 h-6 bg-white/6 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced loading button component
interface EnhancedLoadingButtonProps {
  isLoading: boolean
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function EnhancedLoadingButton({
  isLoading,
  onClick,
  children,
  disabled = false,
  className = ""
}: EnhancedLoadingButtonProps) {
  const buttonVariants = {
    idle: {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
    },
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      y: -2,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
      transition: {
        duration: 0.2,
        ease: EASING.primary
      }
    },
    loading: {
      scale: 0.98,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transition: {
        duration: 0.1
      }
    },
    disabled: {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      opacity: 0.5,
      cursor: "not-allowed"
    }
  }

  const iconVariants = {
    loading: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const textVariants = {
    idle: { opacity: 1, x: 0 },
    loading: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.2 }
    }
  }

  const loadingTextVariants = {
    idle: { opacity: 0, x: 10 },
    loading: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    }
  }

  return (
    <motion.button
      className={`px-8 py-4 rounded-xl backdrop-blur-[20px] text-white font-medium flex items-center gap-3 relative overflow-hidden ${className}`}
      variants={buttonVariants as any}
      animate={disabled ? "disabled" : isLoading ? "loading" : "idle"}
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.95, transition: { duration: 0.1 } } : undefined}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {/* Loading spinner */}
      <motion.div
        className="flex items-center gap-2 absolute inset-0 justify-center"
        variants={loadingTextVariants as any}
        animate={isLoading ? "loading" : "idle"}
      >
        <motion.div variants={iconVariants as any} animate={isLoading ? "loading" : undefined}>
          <Loader2 className="w-5 h-5" />
        </motion.div>
        <span>Carregando...</span>
      </motion.div>

      {/* Normal content */}
      <motion.div
        className="flex items-center gap-2"
        variants={textVariants as any}
        animate={isLoading ? "loading" : "idle"}
      >
        {children}
      </motion.div>

      {/* Progress bar effect */}
      {isLoading && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white/30"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  )
}

// Pulse loading indicator for individual actions
export function PulseLoader({ size = "sm", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const pulseVariants = {
    loading: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-white/20 ${className}`}
      variants={pulseVariants as any}
      animate="loading"
    />
  )
}

// Skeleton grid for loading multiple cards
interface SkeletonGridProps {
  count?: number
  columns?: 1 | 2 | 3
}

export function SkeletonGrid({ count = 6, columns = 3 }: SkeletonGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  return (
    <motion.div
      className={`grid ${gridClasses[columns]} gap-6 mb-8`}
      variants={containerVariants as any}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              delay: index * 0.1,
              duration: 0.5,
              ease: EASING.primary
            }
          }}
        >
          <EnhancedSkeletonCard index={index} />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Breathing dots loader for subtle loading states
export function BreathingDots({ className = "" }: { className?: string }) {
  const dotVariants = {
    loading: (custom: number) => ({
      y: [0, -10, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: custom * 0.2,
        ease: "easeInOut"
      }
    })
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 rounded-full bg-white/60"
          variants={dotVariants as any}
          animate="loading"
          custom={index}
        />
      ))}
    </div>
  )
}

// Success checkmark animation
export function SuccessCheckmark({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  const checkVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.6, ease: EASING.primary },
        opacity: { duration: 0.2 }
      }
    }
  }

  const circleVariants = {
    hidden: {
      scale: 0,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      initial="hidden"
      animate="visible"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="rgba(34, 197, 94, 0.1)"
          variants={circleVariants as any}
          className="text-green-500"
        />
        <motion.path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={checkVariants as any}
          className="text-green-500"
        />
      </svg>
    </motion.div>
  )
}
