'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Track } from '../../types/track'

interface TrackCardProps {
  track: Track
  variant?: 'compact' | 'full'
  onClick?: (track: Track) => void
  onFavorite?: (track: Track) => void
  isFavorited?: boolean
}

export default function TrackCard({ 
  track, 
  variant = 'full', 
  onClick,
  onFavorite,
  isFavorited = false
}: TrackCardProps) {
  const router = useRouter()
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (favoriteLoading) return
    
    setFavoriteLoading(true)
    try {
      await onFavorite?.(track)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(track)
    } else {
      router.push(`/tracks/${track.id}`)
    }
  }

  if (variant === 'compact') {
    return (
      <div className="min-w-[280px] p-2">
        <div 
          className="arsenal-card group rounded-2xl overflow-hidden relative h-80 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-4px] hover:scale-[1.01]"
          style={{ 
            backgroundImage: `url('${track.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={handleCardClick}
        >
        {/* Favorite Button */}
        <button 
          className={`absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-[20px] bg-white/10 border border-white/15 transition-all duration-300 hover:bg-white/15 active:scale-90 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]' : ''}`}
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`w-5 h-5 transition-all duration-200 ${
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-white/80 hover:text-white'
          }`} />
        </button>
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-gradient-to-t group-hover:from-black/95 group-hover:via-black/60 group-hover:to-transparent">
          <h3 className="font-medium text-white text-xl mb-4">{track.title}</h3>
          
          {track.progress !== undefined && (
            <>
              <div className="progress-bar-label flex items-center justify-between text-sm mb-2 text-white/80 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                <span>Progresso</span>
                <span>{track.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${track.progress}%` }}
                />
              </div>
            </>
          )}
          
          <div className="card-hover-actions opacity-0 translate-y-[15px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 group-hover:opacity-100 group-hover:translate-y-0">
            <button 
              className="w-full py-3 font-medium rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              {track.progress === 100 ? 'Finalizar Trilha' : 
               track.progress && track.progress >= 90 ? 'Finalizar Trilha' : 
               'Continuar Trilha'}
            </button>
          </div>
        </div>
      </div>
      </div>
    )
  }

  // Full variant (for recommendations)
  return (
    <div className="min-w-[280px] p-2">
      <div 
        className="rounded-2xl overflow-hidden relative h-64 cursor-pointer group hover:-translate-y-1 transition-all duration-200"
        onClick={handleCardClick}
      >
        <img 
          src={track.backgroundImage} 
          alt={track.title}
          className="absolute w-full h-full object-cover"
        />
        
        {/* Favorite Button */}
        <button 
          className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-[20px] bg-white/10 border border-white/15 transition-all duration-300 hover:bg-white/15 active:scale-90 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]' : ''}`}
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`w-5 h-5 transition-all duration-200 ${
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-white/80 hover:text-white'
          }`} />
        </button>
        
        <div className="absolute top-0 left-0 p-5 flex items-start gap-2 flex-wrap">
          {track.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-lg border border-white/15 text-white/90">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
          <div className="p-5">
            <h3 className="font-semibold text-white text-lg line-clamp-2">{track.title}</h3>
          </div>
        </div>
      </div>
      
      {track.progress !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className="bg-white/60 h-1 rounded-full transition-all duration-500" 
              style={{ width: `${track.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}