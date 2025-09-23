
'use client'

import { motion } from 'framer-motion'
import { Wrench, Compass } from 'lucide-react'
import TrackCard from '../cards/TrackCard'
import type { ArsenalSectionProps } from '../../types/profile'
import { ARSENAL_TABS } from '../../types/profile'
import { MOTION_CONSTANTS, respectReducedMotion } from '@/lib/motion'

export default function ArsenalSection({
  arsenalData,
  activeTab,
  onTabChange,
  onTrackClick,
  onNavigateToTools,
  isLoading = false,
  className = ''
}: ArsenalSectionProps) {
  const transitionSafe = respectReducedMotion({ transition: { duration: 0.3 } }).transition as any

  const indicatorStyle = activeTab === 'trails'
    ? { left: '0%', width: '50%' }
    : { left: '50%', width: '50%' }

  if (isLoading) {
    return (
      <motion.section 
        className={`bg-white/8 backdrop-blur-lg rounded-2xl p-8 ${className}`}
        variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
        initial="initial"
        animate="animate"
        transition={transitionSafe}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section 
      className={`bg-white/8 backdrop-blur-lg rounded-2xl p-8 ${className}`}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8">
        <h2 className="text-3xl font-medium text-white tracking-tight">Seu Arsenal</h2>
        
        {/* Tabs */}
        <div className="relative flex">
          <button 
            onClick={() => onTabChange('trails')}
            className={`text-white px-6 py-3 font-medium transition-colors ${
              activeTab === 'trails' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {ARSENAL_TABS.trails.label}
          </button>
          <button 
            onClick={() => onTabChange('tools')}
            className={`text-white px-6 py-3 font-medium transition-colors ${
              activeTab === 'tools' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {ARSENAL_TABS.tools.label}
          </button>
          
          {/* Animated tab indicator */}
          <div 
            className="absolute bottom-0 h-0.5 bg-white rounded-full transition-all duration-300"
            style={indicatorStyle}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative mt-8 min-h-[400px]">
        {/* Trilhas Salvas */}
        {activeTab === 'trails' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arsenalData?.tracks && arsenalData.tracks.length > 0 ? (
              arsenalData.tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track as any}
                  variant="compact"
                  onClick={() => onTrackClick?.(track)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
                  <Compass className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">Nenhuma trilha salva ainda.</h3>
                <p className="text-white/60 max-w-md leading-relaxed mb-8">
                  Explore nossas trilhas e salve as que mais despertam seu interesse para encontrá-las aqui.
                </p>
                <button 
                  onClick={() => window.location.href = '/tracks'}
                  className="bg-white/10 backdrop-blur-md rounded-full px-8 py-4 flex items-center gap-3 font-medium hover:bg-white/15 hover:scale-105 transition-all duration-300"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explorar Trilhas</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ferramentas */}
        {activeTab === 'tools' && (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
              <Wrench className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-3">Seu arsenal aguarda.</h3>
            <p className="text-white/60 max-w-md leading-relaxed mb-8">
              Favorite as ferramentas e prompts que definem seu gênio criativo para encontrá-los aqui.
            </p>
            <button 
              onClick={onNavigateToTools}
              className="bg-white/10 backdrop-blur-md rounded-full px-8 py-4 flex items-center gap-3 font-medium hover:bg-white/15 hover:scale-105 transition-all duration-300"
            >
              <Compass className="w-5 h-5" />
              <span>Explorar Ferramentas</span>
            </button>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        .animate-entry {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-2 { 
          animation-delay: 0.3s; 
        }
        
        @keyframes slideInFade {
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </motion.section>
  )
}
