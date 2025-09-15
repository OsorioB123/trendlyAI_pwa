
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
      className={`mb-16 ${className}`}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"></div>
        <div className="relative bg-white/8 backdrop-blur-lg border border-white/12 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-white/8 border border-white/12">
            <Lightbulb className="w-7 h-7 text-white" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-medium text-white mb-2">{recommendation.title}</h2>
            <p className="text-white/70 leading-relaxed">
              {recommendation.description}
            </p>
          </div>
          <button 
            onClick={onActionClick}
            className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 flex-shrink-0 flex items-center gap-3 font-medium w-full md:w-auto justify-center hover:bg-white/15 hover:scale-105 transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            <span>{recommendation.action_text}</span>
          </button>
        </div>
      </div>

    </motion.section>
  )
}
