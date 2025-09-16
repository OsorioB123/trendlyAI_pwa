'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Track } from '../../types/track'
import { MOTION_CONSTANTS } from '@/lib/motion'

interface TrackCardFullProps {
  track: Track
  onClick: (track: Track) => void
  onFavorite: (track: Track) => void
  isFavorited: boolean
}

export default function TrackCardFull({ 
  track, 
  onClick,
  onFavorite,
  isFavorited
}: TrackCardFullProps) {
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (favoriteLoading) return
    
    setFavoriteLoading(true)
    try {
      await onFavorite(track)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCardClick = () => {
    onClick(track)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Intermediário':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Avançado':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-white/10 text-white/80 border-white/15'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'bg-teal-500/20 text-teal-300 border-teal-500/30'
    ]
    return colors[category.length % colors.length]
  }

  const progress = track.progress ?? 0

  const getProgressBarColor = () => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    return 'bg-white'
  }

  return (
    <motion.div 
      className="interactive-card card-glow group rounded-2xl overflow-hidden relative h-80 cursor-pointer"
      style={{ 
        backgroundImage: `url('${track.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onClick={handleCardClick}
      whileHover={reducedMotion ? undefined : { y: -4, scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', ...MOTION_CONSTANTS.SPRING.smooth }}
    >
      {/* Favorite Button */}
        <button 
          className={`absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-[20px] bg-white/10 transition-all duration-300 hover:bg-white/15 active:scale-90 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]' : ''}`}
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

      {/* Tags - Top Left */}
      <div className="absolute top-5 left-5 z-10 flex flex-wrap gap-2">
        {/* Categories */}
        {track.categories.slice(0, 2).map((category) => (
          <span 
            key={category}
            className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-lg border ${getCategoryColor(category)} transition-all duration-300`}
          >
            {category}
          </span>
        ))}
        
        {/* Level */}
        <span 
          className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-lg border ${getLevelColor(track.level)} transition-all duration-300`}
        >
          {track.level}
        </span>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-gradient-to-t group-hover:from-black/95 group-hover:via-black/60 group-hover:to-transparent">
        
        {/* Title */}
        <h3 className="font-medium text-white text-xl mb-4 line-clamp-2">
          {track.title}
        </h3>
        
        {/* Progress Section */}
        <div className="progress-section">
          <div className="flex items-center justify-between text-sm mb-2 text-white/80 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <style jsx>{`
        .interactive-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 40%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .interactive-card:hover::before {
          opacity: 1;
        }

        .card-glow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .card-glow:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </motion.div>
  )
}
