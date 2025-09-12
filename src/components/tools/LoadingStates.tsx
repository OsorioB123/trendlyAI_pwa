'use client'

import { motion } from 'framer-motion'
import { Search, Loader2, RefreshCw } from 'lucide-react'
import ToolCardSkeleton from './ToolCardSkeleton'

interface LoadingStatesProps {
  className?: string
}

// Initial Page Load with Skeleton Grid
export function InitialLoadingSkeleton({ 
  count = 6, 
  className = "" 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ToolCardSkeleton
          key={`initial-skeleton-${index}`}
          animationDelay={index * 0.1}
        />
      ))}
    </div>
  )
}

// Load More Skeleton (appears below existing content)
export function LoadMoreSkeleton({ 
  count = 3, 
  className = "" 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={`load-more-skeleton-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <ToolCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Search Loading State
export function SearchLoadingState({ searchTerm, className = "" }: { 
  searchTerm: string
  className?: string 
}) {
  return (
    <motion.div 
      className={`flex items-center justify-center py-12 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 text-white/70 backdrop-blur-[10px] bg-white/5 border border-white/10 rounded-xl px-6 py-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Search className="w-5 h-5" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            Buscando ferramentas...
          </span>
          <span className="text-xs text-white/60">
            "{searchTerm}"
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Filter Loading State
export function FilterLoadingState({ className = "" }: LoadingStatesProps) {
  return (
    <motion.div 
      className={`flex items-center justify-center py-8 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center gap-3 text-white/70">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <RefreshCw className="w-5 h-5" />
        </motion.div>
        <span className="text-sm">Aplicando filtros...</span>
      </div>
    </motion.div>
  )
}

// Load More Button Loading State
export function LoadMoreButtonLoading({ className = "" }: LoadingStatesProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <motion.button
        disabled
        className="px-8 py-4 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white/70 cursor-not-allowed flex items-center gap-2 mx-auto"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
        Carregando mais ferramentas...
      </motion.button>
    </div>
  )
}

// Favorite Action Loading (inline with card)
export function FavoriteActionLoading({ className = "" }: LoadingStatesProps) {
  return (
    <motion.div
      className={`absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-[20px] bg-white/10 border border-white/15 ${className}`}
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Loader2 className="w-4 h-4 text-white/80" />
      </motion.div>
    </motion.div>
  )
}

// Page Transition Loading (between routes)
export function PageTransitionLoading({ className = "" }: LoadingStatesProps) {
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[20px] bg-black/50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4 text-white">
        <motion.div
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.p
          className="text-lg font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Carregando...
        </motion.p>
      </div>
    </motion.div>
  )
}

// Batch Operations Loading (for bulk actions)
export function BatchOperationLoading({ 
  operation = "Processando", 
  count, 
  className = "" 
}: {
  operation?: string
  count?: number
  className?: string
}) {
  return (
    <motion.div 
      className={`fixed bottom-6 right-6 z-40 backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-xl p-4 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {operation}...
          </span>
          {count && (
            <span className="text-xs text-white/70">
              {count} {count === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Progressive Loading Indicator (shows progress)
export function ProgressiveLoadingIndicator({ 
  progress = 0, 
  message = "Carregando", 
  className = "" 
}: {
  progress?: number
  message?: string
  className?: string
}) {
  return (
    <motion.div 
      className={`flex flex-col items-center gap-4 py-8 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <motion.p
        className="text-sm text-white/70"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {message}... {Math.round(progress)}%
      </motion.p>
    </motion.div>
  )
}

// Compact Loading Spinner (for small spaces)
export function CompactLoading({ 
  size = "sm", 
  color = "white",
  className = "" 
}: {
  size?: "xs" | "sm" | "md" | "lg"
  color?: "white" | "blue" | "purple" | "green"
  className?: string
}) {
  const sizeClasses = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]"
  }

  const colorClasses = {
    white: "border-white/20 border-t-white",
    blue: "border-blue-500/20 border-t-blue-500",
    purple: "border-purple-500/20 border-t-purple-500",
    green: "border-green-500/20 border-t-green-500"
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}