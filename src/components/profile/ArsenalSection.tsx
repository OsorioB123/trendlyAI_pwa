'use client'

import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { Compass, Wrench, Lock } from 'lucide-react'
import type { ArsenalSectionProps, Track, ArsenalTab } from '../../types/profile'
import { ARSENAL_TABS } from '../../types/profile'
import { MOTION_CONSTANTS, respectReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { usePaywall } from '@/components/paywall/PaywallProvider'

const TAB_ITEMS: { id: ArsenalTab; label: string }[] = [
  { id: 'trails', label: ARSENAL_TABS.trails.label },
  { id: 'tools', label: ARSENAL_TABS.tools.label }
]

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

  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<ArsenalTab, HTMLButtonElement | null>>({ trails: null, tools: null })

  const updateIndicator = useCallback(() => {
    if (!indicatorRef.current || !tabContainerRef.current) return

    const activeButton = tabRefs.current[activeTab]
    if (!activeButton) return

    const containerRect = tabContainerRef.current.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()

    const left = buttonRect.left - containerRect.left
    indicatorRef.current.style.width = `${buttonRect.width}px`
    indicatorRef.current.style.transform = `translateX(${left}px)`
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
  }, [activeTab, updateIndicator])

  useEffect(() => {
    const handleResize = () => updateIndicator()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateIndicator])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>
      )
    }

    if (activeTab === 'trails') {
      if (arsenalData?.tracks && arsenalData.tracks.length > 0) {
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {arsenalData.tracks.map((track) => (
              <ArsenalTrackCard key={track.id} track={track as Track} onTrackClick={onTrackClick} />
            ))}
          </div>
        )
      }

      return (
        <EmptyState
          icon={Compass}
          title="Nenhuma trilha salva ainda"
          description="Explore nossas trilhas e salve as que mais despertam seu interesse para encontrá-las aqui."
          actionLabel="Explorar Trilhas"
          onAction={() => window.location.assign('/tracks')}
        />
      )
    }

    if (arsenalData?.tools && arsenalData.tools.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {arsenalData.tools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white/80 shadow-[0_10px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{tool.description}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                  {tool.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <EmptyState
        icon={Wrench}
        title="Seu arsenal aguarda"
        description="Favorite as ferramentas e prompts que definem seu gênio criativo para encontrá-los aqui."
        actionLabel="Explorar Ferramentas"
        onAction={onNavigateToTools}
      />
    )
  }

  return (
    <motion.section
      className={cn('liquid-glass rounded-[20px] p-8 animate-entry delay-2', className)}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-medium text-white tracking-tight">Seu Arsenal</h2>

        <div ref={tabContainerRef} className="relative flex">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el
              }}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none',
                activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}

          <div
            ref={indicatorRef}
            className="absolute bottom-0 h-[2px] w-0 bg-white transition-all duration-300 ease-out"
          />
        </div>
      </div>

      <div className="relative mt-8 min-h-[320px]">
        {renderContent()}
      </div>
    </motion.section>
  )
}

function ArsenalTrackCard({ track, onTrackClick }: { track: Track; onTrackClick?: (track: Track) => void }) {
  const { profile } = useAuth()
  const { open: openPaywall } = usePaywall()
  const isLocked = track.isPremium && !profile?.is_premium

  return (
    <button
      type="button"
      onClick={() => {
        if (isLocked) {
          openPaywall('track')
          return
        }
        onTrackClick?.(track)
      }}
      className="group relative h-80 w-full overflow-hidden rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1"
      style={{
        backgroundImage: `url(${track.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {isLocked && (
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation()
            openPaywall('track')
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              event.stopPropagation()
              openPaywall('track')
            }
          }}
          className="absolute left-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Trilha disponível no Maestro"
        >
          <Lock className="h-4 w-4" strokeWidth={1.5} />
        </div>
      )}
      <div className="card-overlay absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-xl font-medium text-white mb-4">{track.title}</h3>
        <div className="mb-2 flex items-center justify-between text-sm text-white/80">
          <span>Progresso</span>
          <span>{Math.round(track.progress ?? 0)}%</span>
        </div>
        <div className="mb-4 h-2 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${Math.round(track.progress ?? 0)}%` }}
          />
        </div>
        <div className="card-hover-actions">
          <span className="liquid-glass-pill flex w-full items-center justify-center py-3 text-sm font-medium">
            Continuar Trilha
          </span>
        </div>
      </div>
    </button>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-white shadow-[0_25px_120px_-60px_rgba(0,0,0,0.8)]">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80">
        <Icon className="h-12 w-12" />
      </div>
      <h3 className="mt-8 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 max-w-md text-sm text-white/60">{description}</p>
      <button
        onClick={() => onAction?.()}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/20"
      >
        {actionLabel}
      </button>
    </div>
  )
}
