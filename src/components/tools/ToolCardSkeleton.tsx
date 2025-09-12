'use client'

import { motion } from 'framer-motion'

interface ToolCardSkeletonProps {
  animationDelay?: number
  className?: string
}

export default function ToolCardSkeleton({ 
  animationDelay = 0,
  className = "" 
}: ToolCardSkeletonProps) {
  return (
    <motion.div
      className={`tool-card-skeleton relative rounded-2xl overflow-hidden h-72 backdrop-blur-[10px] bg-white/5 border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        delay: animationDelay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Category tag skeleton */}
      <div 
        className="absolute top-5 left-5 w-20 h-6 rounded-full loading-shimmer"
        style={{ animationDelay: `${animationDelay + 0.1}s` }}
      />
      
      {/* Type badge skeleton */}
      <div 
        className="absolute top-14 left-5 w-24 h-5 rounded-full loading-shimmer"
        style={{ animationDelay: `${animationDelay + 0.2}s` }}
      />
      
      {/* Favorite button skeleton */}
      <div 
        className="absolute top-4 right-4 w-12 h-12 rounded-full loading-shimmer"
        style={{ animationDelay: `${animationDelay + 0.1}s` }}
      />
      
      {/* Content area skeleton */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Title skeleton - 2 lines */}
        <div 
          className="w-4/5 h-5 rounded loading-shimmer mb-2"
          style={{ animationDelay: `${animationDelay + 0.3}s` }}
        />
        <div 
          className="w-3/5 h-5 rounded loading-shimmer mb-3"
          style={{ animationDelay: `${animationDelay + 0.35}s` }}
        />
        
        {/* Description skeleton - 2 lines */}
        <div 
          className="w-full h-4 rounded loading-shimmer mb-2"
          style={{ animationDelay: `${animationDelay + 0.4}s` }}
        />
        <div 
          className="w-3/4 h-4 rounded loading-shimmer mb-4"
          style={{ animationDelay: `${animationDelay + 0.45}s` }}
        />
        
        {/* Tags skeleton */}
        <div className="flex gap-2 mb-4">
          <div 
            className="w-16 h-6 rounded-full loading-shimmer"
            style={{ animationDelay: `${animationDelay + 0.5}s` }}
          />
          <div 
            className="w-20 h-6 rounded-full loading-shimmer"
            style={{ animationDelay: `${animationDelay + 0.55}s` }}
          />
          <div 
            className="w-12 h-6 rounded-full loading-shimmer"
            style={{ animationDelay: `${animationDelay + 0.6}s` }}
          />
        </div>
        
        {/* AI compatibility skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div 
            className="w-20 h-3 rounded loading-shimmer"
            style={{ animationDelay: `${animationDelay + 0.65}s` }}
          />
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <div 
                key={`ai-${index}`}
                className="w-6 h-6 rounded-full loading-shimmer"
                style={{ animationDelay: `${animationDelay + 0.7 + (index * 0.05)}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10 opacity-70">
          <div 
            className="w-24 h-3 rounded loading-shimmer"
            style={{ animationDelay: `${animationDelay + 0.8}s` }}
          />
          <div 
            className="w-4 h-3 rounded loading-shimmer"
            style={{ animationDelay: `${animationDelay + 0.85}s` }}
          />
        </div>
      </div>

      {/* Subtle glow effect during loading */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      
      {/* Enhanced shimmer overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 60%
          )`,
          backgroundSize: '200% 100%',
          animation: `shimmer 2.5s infinite linear`,
          animationDelay: `${animationDelay}s`
        }}
      />
    </motion.div>
  )
}

// Enhanced shimmer animation specifically for skeleton
export const skeletonAnimationStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .loading-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite linear;
  }

  .tool-card-skeleton {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  /* Skeleton breathing effect */
  .tool-card-skeleton::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 35% 35%, 
      rgba(255, 255, 255, 0.08) 0%, 
      transparent 70%
    );
    opacity: 0;
    animation: breathe 3s ease-in-out infinite;
    pointer-events: none;
    border-radius: inherit;
  }

  @keyframes breathe {
    0%, 100% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
    }
  }
`