'use client'

import { Lightbulb, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { MOTION_CONSTANTS, respectReducedMotion } from '@/lib/motion'
import type { NextActionProps } from '../../types/profile'

export default function NextActionCard({
  recommendation,
  onActionClick,
  className = ''
}: NextActionProps) {
  if (!recommendation) {
    return null
  }

  const transitionSafe = respectReducedMotion({ transition: { duration: 0.3 } }).transition as any

  return (
    <motion.section
      className={`animate-entry delay-1 ${className}`.trim()}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <div className="relative">
        <div className="liquid-glass flex flex-col gap-6 rounded-[20px] p-8 md:flex-row md:items-center">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8">
            <Lightbulb className="h-7 w-7 text-white" />
          </div>

          <div className="flex-1 space-y-2 text-left">
            <h2 className="text-xl font-medium text-white md:text-2xl">
              {recommendation.title}
            </h2>
            <p className="text-base leading-relaxed text-white/70">
              {recommendation.description}
            </p>
          </div>

          <button
            onClick={onActionClick}
            className="liquid-glass-pill flex w-full items-center justify-center gap-3 px-6 py-3 font-medium text-white md:w-auto"
          >
            <Play className="h-4 w-4" />
            <span>{recommendation.action_text}</span>
          </button>
        </div>
      </div>
    </motion.section>
  )
}
