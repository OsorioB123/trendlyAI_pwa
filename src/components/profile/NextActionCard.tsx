
'use client'

import { Lightbulb, ArrowRight } from 'lucide-react'
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
      className={`mb-16 ${className}`}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/20 via-white/5 to-transparent p-[1px]">
        <div className="relative overflow-hidden rounded-[32px] bg-black/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_45%)]" />
          <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 space-y-2 text-left">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {recommendation.title}
              </h2>
              <p className="text-sm leading-relaxed text-white/70 md:text-base">
                {recommendation.description}
              </p>
            </div>
            <button
              onClick={onActionClick}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            >
              <span>{recommendation.action_text}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/80 via-white to-white/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>

    </motion.section>
  )
}
