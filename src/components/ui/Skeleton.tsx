'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  animation?: 'pulse' | 'wave' | 'shimmer'
  delay?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animation = 'shimmer', delay = 0, style, ...props }, ref) => {
    const getAnimationClasses = () => {
      switch (animation) {
        case 'pulse':
          return 'animate-pulse bg-white/10'
        case 'wave':
          return 'bg-white/5 overflow-hidden relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent'
        case 'shimmer':
        default:
          return 'bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-[shimmer_1.8s_ease-in-out_infinite]'
      }
    }

    const combinedStyle = {
      ...style,
      ...(delay ? { animationDelay: `${delay}s` } : {})
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          getAnimationClasses(),
          className
        )}
        style={combinedStyle}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Specialized skeleton components
const SkeletonCard = ({ className, ...props }: SkeletonProps) => (
  <Skeleton
    className={cn(
      'h-72 rounded-2xl backdrop-blur-sm',
      className
    )}
    {...props}
  />
)

const SkeletonText = ({ 
  lines = 1, 
  className,
  ...props 
}: SkeletonProps & { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4 rounded',
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
          className
        )}
        delay={i * 0.1}
        {...props}
      />
    ))}
  </div>
)

const SkeletonAvatar = ({ className, ...props }: SkeletonProps) => (
  <Skeleton
    className={cn('w-10 h-10 rounded-full', className)}
    {...props}
  />
)

const SkeletonButton = ({ className, ...props }: SkeletonProps) => (
  <Skeleton
    className={cn('h-12 w-32 rounded-xl', className)}
    {...props}
  />
)

// Tool-specific skeleton
const SkeletonToolCard = ({ className, ...props }: SkeletonProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn('tool-card-grid-item', className)}
  >
    <SkeletonCard className="relative overflow-hidden" {...props}>
      {/* Category tag skeleton */}
      <div className="absolute top-5 left-5">
        <Skeleton className="h-6 w-20 rounded-full" delay={0.1} />
      </div>
      
      {/* Type badge skeleton */}
      <div className="absolute top-14 left-5">
        <Skeleton className="h-5 w-24 rounded-full" delay={0.2} />
      </div>
      
      {/* Favorite button skeleton */}
      <div className="absolute top-4 right-4">
        <Skeleton className="w-12 h-12 rounded-full" delay={0.15} />
      </div>
      
      {/* Content area */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="space-y-3">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" delay={0.3} />
            <Skeleton className="h-5 w-3/4" delay={0.35} />
          </div>
          
          {/* Description */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" delay={0.4} />
            <Skeleton className="h-3 w-5/6" delay={0.45} />
          </div>
          
          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" delay={0.5} />
            <Skeleton className="h-6 w-20 rounded-full" delay={0.55} />
            <Skeleton className="h-6 w-14 rounded-full" delay={0.6} />
          </div>
          
          {/* AI compatibility */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-20" delay={0.65} />
            <div className="flex gap-1">
              <Skeleton className="w-6 h-6 rounded-full" delay={0.7} />
              <Skeleton className="w-6 h-6 rounded-full" delay={0.75} />
              <Skeleton className="w-6 h-6 rounded-full" delay={0.8} />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3">
            <Skeleton className="h-3 w-24" delay={0.85} />
            <Skeleton className="h-3 w-4" delay={0.9} />
          </div>
        </div>
      </div>
    </SkeletonCard>
  </motion.div>
)

// Grid of tool card skeletons
const SkeletonToolGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonToolCard key={i} />
    ))}
  </div>
)

export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonToolCard,
  SkeletonToolGrid,
}
