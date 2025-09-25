'use client'

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Heart, ArrowLeft } from 'lucide-react'
import BackgroundOverlay from '../../../components/common/BackgroundOverlay'
import { TrackService } from '../../../lib/services/trackService'
import type { TrackWithModules, TrackModule, ModuleState } from '../../../types/track'
import { supabase } from '../../../lib/supabase'
import ModuleModal from '../../../components/tracks/ModuleModal'
import TrilhaStepper from '@/components/tracks/TrilhaStepper'
import ModuleActionCard from '@/components/tracks/ModuleActionCard'
import ModuleTools from '@/components/tracks/ModuleTools'
import TrackRating from '../../../components/tracks/TrackRating'
import { useAuth } from '@/contexts/AuthContext'
import { usePaywall } from '@/components/paywall/PaywallProvider'

const CARD_HORIZONTAL_OFFSET = 24

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()
  const trackId = params?.id as string

  const [track, setTrack] = useState<TrackWithModules | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<TrackModule | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const { profile: authProfile } = useAuth()
  const { open: openPaywall } = usePaywall()

  const stepperContainerRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const activeStepRef = useRef<HTMLLIElement | null>(null)
  const [cardModule, setCardModule] = useState<TrackModule | null>(null)
  const [cardState, setCardState] = useState<ModuleState>('available')
  const [cardOrientation, setCardOrientation] = useState<'left' | 'right' | 'center'>('center')
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number } | null>(null)
  const [showModuleTools, setShowModuleTools] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(false)

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
        setError('Trilha não encontrada')
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

    const top = triggerRect.top - containerRect.top + triggerRect.height / 2 - cardHeight / 2
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
  }, [cardModule, cardOrientation, showModuleTools, updateCardPosition])

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

  useEffect(() => {
    if (!track || !cardModule) {
      return
    }

    const moduleIndex = track.modules.findIndex((module) => module.id === cardModule.id)
    if (moduleIndex === -1) {
      setCardModule(null)
      return
    }

    const completed = track.moduleProgress.some(
      (progress) => progress.moduleId === cardModule.id && progress.isCompleted,
    )
    const currentId = track.userProgress?.currentModuleId

    let nextState: ModuleState
    if (completed) {
      nextState = 'completed'
    } else if (currentId === cardModule.id) {
      nextState = 'current'
    } else if (moduleIndex === 0) {
      nextState = 'available'
    } else {
      const previousModule = track.modules[moduleIndex - 1]
      const previousCompleted = track.moduleProgress.some(
        (progress) => progress.moduleId === previousModule.id && progress.isCompleted,
      )
      nextState = previousCompleted ? 'available' : 'locked'
    }

    if (nextState !== cardState) {
      setCardState(nextState)
    }
  }, [track, cardModule, cardState])

  const isCardModuleCompleted = useMemo(() => {
    if (!track || !cardModule) return false
    return track.moduleProgress.some(
      (progress) => progress.moduleId === cardModule.id && progress.isCompleted,
    )
  }, [track, cardModule])

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
      setCardModule(module)
      setShowModuleTools(false)
      setCardOrientation(isMobileLayout ? 'center' : orientation)
      setCardState(state)
      activeStepRef.current = element

      if (isMobileLayout) {
        setCardPosition(null)
      } else {
        requestAnimationFrame(() => updateCardPosition())
      }
    },
    [isMobileLayout, updateCardPosition],
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
      setSelectedModule(firstModule)
      setIsModalOpen(true)
      setCardModule(firstModule)
      setCardOrientation(isMobileLayout ? 'center' : 'left')
      setCardState('current')
    }
  }, [user, isE2E, router, track?.isPremium, authProfile?.is_premium, track?.userProgress, track?.modules, trackId, openPaywall, loadTrack, isMobileLayout])

  const handleOpenModule = useCallback(
    async (module: TrackModule | null) => {
      if (!module) return

      if (!user) {
        if (!isE2E) {
          router.push('/login')
        }
        return
      }

      const moduleAccess = await TrackService.checkModuleAccess(user.id, trackId, module.id)
      if (!moduleAccess.hasAccess) {
        if (moduleAccess.reason === 'premium_required') {
          openPaywall('track')
        }
        return
      }

      if (!track?.userProgress) {
        await TrackService.startTrack(user.id, trackId)
        await loadTrack()
      }

      setSelectedModule(module)
      setIsModalOpen(true)
    },
    [user, isE2E, router, trackId, openPaywall, track?.userProgress, loadTrack],
  )

  const handleModuleComplete = useCallback(
    async (moduleId: string) => {
      if (!user) return

      await TrackService.completeModule(user.id, trackId, moduleId)
      await loadTrack()
    },
    [user, trackId, loadTrack],
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
  }, [user, isE2E, router, trackId, loadTrack])

  const handleSubmitRating = useCallback(
    async (rating: number, comment?: string) => {
      if (!user) return

      await TrackService.submitTrackReview(
        user.id,
        trackId,
        rating as 1 | 2 | 3 | 4 | 5,
        comment,
      )
      await loadTrack()
    },
    [user, trackId, loadTrack],
  )

  const handleChatWithSalina = useCallback(
    (module: TrackModule) => {
      router.push(`/chat?prompt=${encodeURIComponent(module.content.briefing)}`)
    },
    [router],
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
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Trilha não encontrada'}</h1>
          <button
            onClick={() => router.back()}
            className="text-white/80 hover:text-white transition-colors"
          >
            ← Voltar
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
                  {track.averageRating?.toFixed(1) || '0.0'} ({track.totalReviews} avaliações)
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
                Iniciar Trilha
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
          <h2 className="text-xl font-bold mb-6">Jornada da Trilha</h2>
          <div
            ref={stepperContainerRef}
            className="relative flex justify-center lg:justify-start"
          >
            <TrilhaStepper track={track} onSelectModule={handleStepperSelect} />

            <ModuleActionCard
              ref={cardRef}
              module={cardModule}
              track={track}
              state={cardState}
              visible={Boolean(cardModule)}
              orientation={cardOrientation}
              style={cardStyle}
              onStartOrResume={() => handleOpenModule(cardModule)}
              onComplete={() => {
                if (cardModule) {
                  handleModuleComplete(cardModule.id)
                }
              }}
              onOpenTools={() => setShowModuleTools((prev) => !prev)}
              onChat={() => {
                if (cardModule) {
                  handleChatWithSalina(cardModule)
                }
              }}
              onClose={() => {
                setCardModule(null)
                setShowModuleTools(false)
              }}
              isModuleCompleted={isCardModuleCompleted}
              toolsOpen={showModuleTools}
            >
              {showModuleTools && cardModule && (
                <ModuleTools
                  module={cardModule}
                  userId={user?.id}
                  isUserPremium={authProfile?.is_premium}
                  onClose={() => setShowModuleTools(false)}
                />
              )}
            </ModuleActionCard>
          </div>
        </div>

        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">Avalie esta trilha</h2>
            <TrackRating currentRating={track.userReview} onSubmitRating={handleSubmitRating} />
          </div>
        )}
      </div>

      <ModuleModal
        module={selectedModule}
        track={track}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedModule(null)
        }}
        onComplete={handleModuleComplete}
        onChatWithSalina={handleChatWithSalina}
      />
    </div>
  )
}
