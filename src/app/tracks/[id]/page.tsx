'use client'

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Star } from 'lucide-react'

import BackgroundOverlay from '../../../components/common/BackgroundOverlay'
import { TrackService } from '../../../lib/services/trackService'
import type { ModuleState, TrackModule, TrackWithModules } from '../../../types/track'
import { supabase } from '../../../lib/supabase'
import TrilhaStepper from '@/components/tracks/TrilhaStepper'
import ModuleActionCard from '@/components/tracks/ModuleActionCard'
import TrackRating from '../../../components/tracks/TrackRating'
import DossierOverlay from '@/components/tracks/DossierOverlay'
import LockedModal from '@/components/tracks/LockedModal'
import { useAuth } from '@/contexts/AuthContext'
import { usePaywall } from '@/components/paywall/PaywallProvider'

const CARD_HORIZONTAL_OFFSET = 24

interface TriggerRect {
  top: number
  left: number
  width: number
  height: number
}

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()
  const trackId = params?.id as string

  const [track, setTrack] = useState<TrackWithModules | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [cardModule, setCardModule] = useState<TrackModule | null>(null)
  const [cardState, setCardState] = useState<ModuleState>('available')
  const [cardOrientation, setCardOrientation] = useState<'left' | 'right' | 'center'>('center')
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number } | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const [activeModule, setActiveModule] = useState<TrackModule | null>(null)
  const [overlayFocus, setOverlayFocus] = useState<'tools' | 'prompts' | null>(null)
  const [overlayTriggerRect, setOverlayTriggerRect] = useState<TriggerRect | null>(null)
  const [lockedModal, setLockedModal] = useState<{ open: boolean; title: string; description: string }>({
    open: false,
    title: '',
    description: '',
  })

  const { profile: authProfile } = useAuth()
  const { open: openPaywall } = usePaywall()

  const stepperContainerRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const activeStepRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateLayout = () => {
      setIsMobileLayout(window.innerWidth < 768)
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadTrack = useCallback(async () => {
    if (!trackId) return

    try {
      setLoading(true)
      const trackData = await TrackService.getTrackWithModules(trackId, user?.id)

      if (!trackData) {
        setError('Trilha nao encontrada')
        return
      }

      setTrack(trackData)
    } catch (err) {
      console.error('Error loading track:', err)
      setError('Erro ao carregar trilha')
    } finally {
      setLoading(false)
    }
  }, [trackId, user?.id])

  useEffect(() => {
    if (trackId) {
      loadTrack()
    }
  }, [trackId, loadTrack])

  const updateCardPosition = useCallback(() => {
    if (isMobileLayout || !cardModule) {
      setCardPosition(null)
      return
    }

    const container = stepperContainerRef.current
    const trigger = activeStepRef.current
    const cardElement = cardRef.current

    if (!container || !trigger || !cardElement) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    const cardHeight = cardElement.offsetHeight
    const cardWidth = cardElement.offsetWidth

    const top =
      triggerRect.top - containerRect.top + triggerRect.height / 2 - cardHeight / 2

    const offset = CARD_HORIZONTAL_OFFSET
    let left = 0

    if (cardOrientation === 'left') {
      left = triggerRect.right - containerRect.left + offset
    } else {
      left = triggerRect.left - containerRect.left - cardWidth - offset
    }

    setCardPosition({ top, left })
  }, [cardModule, cardOrientation, isMobileLayout])

  useEffect(() => {
    if (!cardModule) return

    requestAnimationFrame(() => {
      updateCardPosition()
    })
  }, [cardModule, cardOrientation, updateCardPosition])

  useEffect(() => {
    if (isMobileLayout) return

    const handleScroll = () => {
      updateCardPosition()
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isMobileLayout, updateCardPosition])

  const completedModuleIds = useMemo(() => {
    if (!track) return new Set<string>()
    return new Set(
      track.moduleProgress
        .filter((progress) => progress.isCompleted)
        .map((progress) => progress.moduleId)
    )
  }, [track])

  const resolveModuleState = useCallback((module: TrackModule): ModuleState => {
    if (!track) return 'locked'

    if (completedModuleIds.has(module.id)) {
      return 'completed'
    }

    if (track.userProgress?.currentModuleId === module.id) {
      return 'current'
    }

    const index = track.modules.findIndex((item) => item.id === module.id)
    if (index === 0) {
      return 'available'
    }

    const previousModule = track.modules[index - 1]
    return completedModuleIds.has(previousModule.id) ? 'available' : 'locked'
  }, [completedModuleIds, track])

  const computeTriggerRect = useCallback((element: HTMLLIElement | null): TriggerRect | null => {
    if (!element) return null
    const target = element.querySelector('.trilha-btn') as HTMLElement | null
    const rect = (target || element).getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  }, [])

  const closeOverlay = useCallback(() => {
    setActiveModule(null)
    setOverlayFocus(null)
    setOverlayTriggerRect(null)
  }, [])

  const handleOpenModule = useCallback(
    async (module: TrackModule | null, options?: { focus?: 'tools' | 'prompts' | null; triggerRect?: TriggerRect | null }) => {
      if (!module) return

      if (!user) {
        router.push('/login')
        return
      }

      const access = await TrackService.checkModuleAccess(user.id, trackId, module.id)
      if (!access.hasAccess) {
        if (access.reason === 'premium_required') {
          openPaywall('track')
        } else {
          setLockedModal({
            open: true,
            title: module.title,
            description: 'Conclua as etapas anteriores para desbloquear esta etapa.',
          })
        }
        return
      }

      await TrackService.setCurrentModule(user.id, trackId, module.id)

      setActiveModule(module)
      setOverlayFocus(options?.focus ?? null)
      setOverlayTriggerRect(options?.triggerRect ?? null)
    },
    [openPaywall, router, trackId, user]
  )

  const handleStepperSelect = useCallback(
    ({
      module,
      state,
      orientation,
      element,
    }: {
      module: TrackModule
      state: ModuleState
      orientation: 'left' | 'right'
      element: HTMLLIElement | null
    }) => {
      if (!track) return

      if (state === 'locked') {
        setLockedModal({
          open: true,
          title: module.title,
          description: 'Conclua as etapas anteriores para desbloquear esta etapa.',
        })
        return
      }

      setCardModule(module)
      setCardState(state)
      setCardOrientation(isMobileLayout ? 'center' : orientation)
      activeStepRef.current = element

      if (isMobileLayout) {
        const rect = computeTriggerRect(element)
        handleOpenModule(module, { focus: null, triggerRect: rect })
      } else {
        requestAnimationFrame(() => updateCardPosition())
      }
    },
    [computeTriggerRect, handleOpenModule, isMobileLayout, track, updateCardPosition]
  )

  const isE2E = typeof window !== 'undefined' && (window as any).__E2E_TEST__ === true

  const handleStartTrack = useCallback(async () => {
    if (!user) {
      if (!isE2E) {
        router.push('/login')
      }
      return
    }

    if (track?.isPremium && !authProfile?.is_premium) {
      openPaywall('track')
      return
    }

    if (!track?.userProgress) {
      await TrackService.startTrack(user.id, trackId)
      await loadTrack()
    }

    const firstModule = track?.modules[0]
    if (firstModule) {
      const rect = computeTriggerRect(activeStepRef.current)
      handleOpenModule(firstModule, { focus: null, triggerRect: rect })
    }
  }, [authProfile?.is_premium, computeTriggerRect, handleOpenModule, isE2E, loadTrack, openPaywall, router, track, trackId, user])

  const handleModuleComplete = useCallback(
    async (moduleId: string) => {
      if (!user) return

      await TrackService.completeModule(user.id, trackId, moduleId)
      await loadTrack()
    },
    [loadTrack, trackId, user]
  )

  const handleToggleFavorite = useCallback(async () => {
    if (!user) {
      if (!isE2E) {
        router.push('/login')
      }
      return
    }

    setFavoriteLoading(true)
    try {
      await TrackService.toggleFavoriteTrack(user.id, trackId)
      await loadTrack()
    } catch (err) {
      console.error('Error toggling favorite:', err)
    } finally {
      setFavoriteLoading(false)
    }
  }, [isE2E, loadTrack, router, trackId, user])

  const handleSubmitRating = useCallback(
    async (rating: number, comment?: string) => {
      if (!user) return

      await TrackService.submitTrackReview(
        user.id,
        trackId,
        rating as 1 | 2 | 3 | 4 | 5,
        comment
      )
      await loadTrack()
    },
    [loadTrack, trackId, user]
  )

  const handleChatWithSalina = useCallback(
    (module: TrackModule) => {
      router.push(`/chat?prompt=${encodeURIComponent(module.content.briefing)}`)
    },
    [router]
  )

  const cardStyle = !isMobileLayout && cardPosition
    ? { top: Math.max(cardPosition.top, 0), left: cardPosition.left }
    : undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
      </div>
    )
  }

  if (error || !track) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Trilha nao encontrada'}</h1>
          <button
            onClick={() => router.back()}
            className="text-white/80 hover:text-white transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="relative">
        <div
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url('${track.thumbnailUrl}')` }}
        >
          <BackgroundOverlay position="absolute" behind={false} />

          <div className="absolute top-6 left-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute top-6 right-6">
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className={`p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors ${
                favoriteLoading ? 'opacity-50' : ''
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  track.userProgress?.isFavorite ? 'text-red-500 fill-red-500' : 'text-white'
                }`}
              />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
            {track.subtitle && (
              <p className="text-xl text-white/80 mb-4">{track.subtitle}</p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (track.averageRating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
                <span className="ml-2 text-white/80">
                  {track.averageRating?.toFixed(1) || '0.0'} ({track.totalReviews} avaliacoes)
                </span>
              </div>
              <span className="px-2 py-1 bg-white/10 rounded-full text-sm">{track.level}</span>
              {track.isPremium && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  Premium
                </span>
              )}
            </div>

            {track.userProgress ? (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/80">Progresso</span>
                    <span className="text-sm text-white/80">
                      {track.userProgress.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${track.userProgress.progressPercentage}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleStartTrack}
                  className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
                >
                  {track.userProgress.progressPercentage === 100 ? 'Revisar' : 'Continuar'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartTrack}
                className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors"
              >
                Iniciar trilha
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {track.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Sobre esta trilha</h2>
            <p className="text-white/80 leading-relaxed">{track.description}</p>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Jornada da trilha</h2>
          <div ref={stepperContainerRef} className="relative flex justify-center lg:justify-start">
            <TrilhaStepper track={track} onSelectModule={handleStepperSelect} />

            <ModuleActionCard
              ref={cardRef}
              module={cardModule}
              track={track}
              state={cardState}
              visible={Boolean(cardModule)}
              orientation={cardOrientation}
              style={cardStyle}
              onStartOrResume={() =>
                handleOpenModule(cardModule, {
                  focus: null,
                  triggerRect: computeTriggerRect(activeStepRef.current),
                })
              }
              onComplete={() => {
                if (cardModule) {
                  handleModuleComplete(cardModule.id)
                }
              }}
              onOpenTools={() =>
                handleOpenModule(cardModule, {
                  focus: 'tools',
                  triggerRect: computeTriggerRect(activeStepRef.current),
                })
              }
              onChat={() => {
                if (cardModule) {
                  handleChatWithSalina(cardModule)
                }
              }}
              onClose={() => {
                setCardModule(null)
              }}
              isModuleCompleted={cardState === 'completed'}
            />
          </div>
        </div>

        <div className="mb-8">
          <TrackRating currentRating={track.userReview} onSubmitRating={handleSubmitRating} />
        </div>
      </div>

      <DossierOverlay
        open={Boolean(activeModule)}
        module={activeModule}
        track={track}
        onClose={closeOverlay}
        onComplete={handleModuleComplete}
        onChat={handleChatWithSalina}
        userId={user?.id}
        isUserPremium={authProfile?.is_premium}
        triggerRect={overlayTriggerRect}
        focusSection={overlayFocus}
        moduleState={activeModule ? resolveModuleState(activeModule) : 'locked'}
      />

      <LockedModal
        open={lockedModal.open}
        title={lockedModal.title}
        description={lockedModal.description}
        onClose={() => setLockedModal({ open: false, title: '', description: '' })}
      />
    </div>
  )
}
