
'use client'

import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { Compass, Wrench } from 'lucide-react'
import type { ArsenalSectionProps, Track, ArsenalTab } from '../../types/profile'
import { ARSENAL_TABS } from '../../types/profile'
import { MOTION_CONSTANTS, respectReducedMotion } from '@/lib/motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

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
      className={cn('rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_120px_-60px_rgba(0,0,0,0.8)] backdrop-blur-2xl', className)}
      variants={MOTION_CONSTANTS.VARIANTS.slideUp as any}
      initial="initial"
      animate="animate"
      transition={transitionSafe}
    >
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ArsenalTab)} className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/50">Seu Arsenal</p>
            <h2 className="mt-2 text-3xl font-semibold text-white tracking-tight md:text-[2.2rem]">
              Continue evoluindo sua jornada
            </h2>
          </div>
          <TabsList className="bg-white/10 p-1 text-white/70">
            <TabsTrigger value="trails" className="px-5 py-2 text-sm data-[state=active]:bg-white/25 data-[state=active]:text-white">
              {ARSENAL_TABS.trails.label}
            </TabsTrigger>
            <TabsTrigger value="tools" className="px-5 py-2 text-sm data-[state=active]:bg-white/25 data-[state=active]:text-white">
              {ARSENAL_TABS.tools.label}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trails" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {arsenalData?.tracks && arsenalData.tracks.length > 0 ? (
              arsenalData.tracks.map((track) => (
                <ArsenalTrackCard key={track.id} track={track as Track} onTrackClick={onTrackClick} />
              ))
            ) : (
              <EmptyState
                icon={Compass}
                title="Nenhuma trilha salva ainda"
                description="Explore nossas trilhas e salve as que mais despertam seu interesse para encontrá-las aqui."
                actionLabel="Explorar Trilhas"
                onAction={() => window.location.assign('/tracks')}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-4">
          {arsenalData?.tools && arsenalData.tools.length > 0 ? (
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
          ) : (
            <EmptyState
              icon={Wrench}
              title="Seu arsenal aguarda"
              description="Favorite as ferramentas e prompts que definem seu gênio criativo para encontrá-los aqui."
              actionLabel="Explorar Ferramentas"
              onAction={onNavigateToTools}
            />
          )}
        </TabsContent>
      </Tabs>
    </motion.section>
  )
}

function ArsenalTrackCard({ track, onTrackClick }: { track: Track; onTrackClick?: (track: Track) => void }) {
  return (
    <button
      type="button"
      onClick={() => onTrackClick?.(track)}
      className="group relative flex h-80 w-full overflow-hidden rounded-2xl border border-white/10 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_-45px_rgba(0,0,0,0.8)]"
      style={{
        backgroundImage: `url(${track.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity group-hover:from-black/90" />
      <div className="relative flex h-full w-full flex-col justify-end gap-4 p-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">Trilha</span>
          <h3 className="text-xl font-semibold text-white">{track.title}</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Progresso</span>
            <span>{Math.round(track.progress ?? 0)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.round(track.progress ?? 0)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-white/80">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
            {track.category || 'Conteúdo' }
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            Continuar
            <Compass className="h-3.5 w-3.5" />
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
