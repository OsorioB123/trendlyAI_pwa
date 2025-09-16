'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, Heart, ArrowLeft } from 'lucide-react'
import BackgroundOverlay from '../../../components/common/BackgroundOverlay'
import { TrackService } from '../../../lib/services/trackService'
import { TrackWithModules, TrackModule } from '../../../types/track'
import { supabase } from '../../../lib/supabase'
import TrackProgress from '../../../components/tracks/TrackProgress'
import ModuleModal from '../../../components/tracks/ModuleModal'
import TrackRating from '../../../components/tracks/TrackRating'

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

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    } catch (error) {
      console.error('Error loading track:', error)
      setError('Erro ao carregar trilha')
    } finally {
      setLoading(false)
    }
  }, [trackId, user?.id])

  const loadTrackPublic = useCallback(async () => {
    if (!trackId) return
    try {
      setLoading(true)
      const trackData = await TrackService.getTrackPublic(trackId)

      if (!trackData) {
        setError('Trilha não encontrada')
        return
      }

      setTrack(trackData)
    } catch (error) {
      console.error('Error loading track:', error)
      setError('Erro ao carregar trilha')
    } finally {
      setLoading(false)
    }
  }, [trackId])

  useEffect(() => {
    if (trackId && user) {
      loadTrack()
    } else if (trackId) {
      loadTrackPublic()
    }
  }, [trackId, user, loadTrack, loadTrackPublic])

  const handleStartTrack = async () => {
    if (!user) {
      router.push('/login')
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
    }
  }

  const handleModuleClick = async (module: TrackModule) => {
    if (!user) {
      router.push('/login')
      return
    }

    const moduleAccess = await TrackService.checkModuleAccess(user.id, trackId, module.id)
    
    if (!moduleAccess.hasAccess) {
      if (moduleAccess.reason === 'premium_required') {
        router.push('/pricing')
        return
      }
      return
    }

    if (!track?.userProgress) {
      await TrackService.startTrack(user.id, trackId)
      await loadTrack()
    }

    setSelectedModule(module)
    setIsModalOpen(true)
  }

  const handleModuleComplete = async (moduleId: string) => {
    if (!user) return

    await TrackService.completeModule(user.id, trackId, moduleId)
    await loadTrack()
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setFavoriteLoading(true)
    try {
      await TrackService.toggleFavoriteTrack(user.id, trackId)
      await loadTrack()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleSubmitRating = async (rating: number, comment?: string) => {
    if (!user) return

    await TrackService.submitTrackReview(user.id, trackId, rating as 1 | 2 | 3 | 4 | 5, comment)
    await loadTrack()
  }

  const handleChatWithSalina = (module: TrackModule) => {
    router.push(`/chat?prompt=${encodeURIComponent(module.content.briefing)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
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
      {/* Header */}
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
                  track.userProgress?.isFavorite 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-white'
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
              <span className="px-2 py-1 bg-white/10 rounded-full text-sm">
                {track.level}
              </span>
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
                    <span className="text-sm text-white/80">{track.userProgress.progressPercentage}%</span>
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

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Description */}
        {track.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Sobre esta trilha</h2>
            <p className="text-white/80 leading-relaxed">{track.description}</p>
          </div>
        )}

        {/* Track Progress */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Progresso da Trilha</h2>
          <TrackProgress 
            track={track}
            onModuleClick={handleModuleClick}
          />
        </div>

        {/* Rating Section */}
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">Avalie esta trilha</h2>
            <TrackRating 
              trackId={trackId}
              currentRating={track.userReview}
              onSubmitRating={handleSubmitRating}
            />
          </div>
        )}
      </div>

      {/* Module Modal */}
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
