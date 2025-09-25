'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Play, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import ModuleTools from './ModuleTools'
import type { ModuleState, TrackModule, TrackWithModules } from '@/types/track'

interface TriggerRect {
  top: number
  left: number
  width: number
  height: number
}

interface DossierOverlayProps {
  open: boolean
  module: TrackModule | null
  track: TrackWithModules
  onClose: () => void
  onComplete: (moduleId: string) => Promise<void> | void
  onChat: (module: TrackModule) => void
  userId?: string
  isUserPremium?: boolean
  triggerRect?: TriggerRect | null
  focusSection?: 'tools' | 'prompts' | null
  moduleState: ModuleState
  isCompleting?: boolean
}

const extractYouTubeId = (value?: string | null) => {
  if (!value) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value
  }

  try {
    const url = new URL(value)
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v')
    }
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '')
    }
  } catch {
    // ignore parsing errors
  }

  return null
}

export function DossierOverlay({
  open,
  module,
  track,
  onClose,
  onComplete,
  onChat,
  userId,
  isUserPremium,
  triggerRect,
  focusSection = null,
  moduleState,
}: DossierOverlayProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const overviewRef = useRef<HTMLDivElement | null>(null)
  const toolsRef = useRef<HTMLDivElement | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
      setIsCompleting(false)
      setVideoReady(false)
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [open])

  useEffect(() => {
    if (!open || !focusSection) return

    const target = focusSection === 'tools' ? toolsRef.current : overviewRef.current
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [open, focusSection])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const moduleIndex = useMemo(() => {
    if (!module) return 0
    return track.modules.findIndex((item) => item.id === module.id) + 1
  }, [module, track.modules])

  const briefing = module?.content?.briefing || ''
  const videoId = module ? module.content?.videoId || extractYouTubeId(module.videoUrl) : null
  const objectives = module?.content?.objectives ?? []

  if (!module) {
    return null
  }

  const disableComplete = moduleState === 'locked' || isCompleting
  const isCompleted = moduleState === 'completed'

  const circleStyle = triggerRect
    ? {
        top: `${triggerRect.top}px`,
        left: `${triggerRect.left}px`,
        width: `${triggerRect.width}px`,
        height: `${triggerRect.height}px`,
      }
    : undefined

  const handleCompleteClick = async () => {
    if (disableComplete) return

    try {
      setIsCompleting(true)
      await onComplete(module.id)
      setTimeout(() => {
        setIsCompleting(false)
        onClose()
      }, 800)
    } catch (error) {
      setIsCompleting(false)
      console.error('Failed to complete module', error)
    }
  }

  return (
    <div className={cn('dossier-overlay', open && 'active')} aria-hidden={!open}>
      <div
        className={cn('expanding-circle', open && 'animate')}
        style={circleStyle}
        aria-hidden="true"
      />

      <header className="dossier-header">
        <button
          type="button"
          className="flex items-center text-white/80 hover:text-white transition-colors"
          onClick={onClose}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2 font-medium hidden sm:inline">Voltar</span>
        </button>
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white truncate px-2">
          {module.title}
        </h1>
        <div className="w-14" />
      </header>

      <div ref={contentRef} className={cn('dossier-content', open && 'visible')}>
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-48 space-y-16">
          <section ref={overviewRef} className="space-y-8">
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-wide text-white/50">
                Etapa {moduleIndex} de {track.modules.length}
              </span>
              <h2 className="text-4xl font-bold tracking-tighter text-white">
                Sua missao
              </h2>
              {briefing && (
                <p className="text-white/80 text-lg leading-relaxed">{briefing}</p>
              )}
            </div>

            {videoId && (
              <div className="video-container" aria-label="Video do modulo">
                <div
                  className={cn(
                    'content-card rounded-xl overflow-hidden aspect-video relative video-placeholder',
                    videoReady && 'video-playing'
                  )}
                  onClick={() => setVideoReady(true)}
                >
                  {videoReady ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                      title="Video do modulo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play className="text-white/70 w-16 h-16 play-icon" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!!objectives.length && (
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  Objetivos do modulo
                </h3>
                <ul className="space-y-2 text-white/75">
                  {objectives.map((objective, index) => (
                    <li key={index} className="leading-relaxed">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section ref={toolsRef} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-white tracking-tight">
                Arsenal da missao
              </h2>
              <p className="text-white/70">
                Explore os prompts e ferramentas recomendadas para esta etapa da jornada.
              </p>
            </div>
            <ModuleTools module={module} userId={userId} isUserPremium={isUserPremium} />
          </section>

          <section className="border-t border-white/10 pt-10 space-y-6">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold text-white tracking-tight">
                Execucao com a Salina
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Leve seus prompts e ideias para a Salina e aprofunde a exploracao criativa.
              </p>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold"
                onClick={() => onChat(module)}
              >
                <Sparkles className="w-5 h-5" />
                Conversar com a Salina
              </button>
            </div>
          </section>

          <section className="text-center">
            <button
              type="button"
              className={cn(
                'btn-secondary px-8 py-3 text-base font-semibold w-full max-w-sm mx-auto h-[50px]',
                isCompleted && 'is-completed',
                isCompleting && 'is-completing'
              )}
              onClick={handleCompleteClick}
              disabled={disableComplete || isCompleted}
            >
              <span className="btn-text">{isCompleted ? 'Etapa concluida' : 'Marcar etapa como concluida'}</span>
              <Check className="btn-icon w-5 h-5" />
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DossierOverlay
