'use client'

import { Track } from '../../types/track'

interface TrackCardProps {
  track: Track
  variant?: 'compact' | 'full'
  onClick?: (track: Track) => void
}

export default function TrackCard({ 
  track, 
  variant = 'full', 
  onClick 
}: TrackCardProps) {
  if (variant === 'compact') {
    return (
      <div 
        className="group rounded-2xl overflow-hidden relative h-80 cursor-pointer min-w-[280px] hover:-translate-y-2 transition-all duration-300"
        style={{ 
          backgroundImage: `url('${track.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={() => onClick?.(track)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h3 className="font-medium text-white text-xl mb-4">{track.title}</h3>
          
          {track.progress !== undefined && (
            <>
              <div className="flex items-center justify-between text-sm mb-2 text-white/80">
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
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full py-3 font-medium rounded-xl backdrop-blur-2xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all duration-300">
              {track.progress === 100 ? 'Finalizar Trilha' : 
               track.progress && track.progress >= 90 ? 'Finalizar Trilha' : 
               'Continuar Trilha'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Full variant (for recommendations)
  return (
    <div className="min-w-[280px]">
      <div 
        className="rounded-2xl overflow-hidden shadow-2xl relative h-64 cursor-pointer group hover:-translate-y-2 transition-all duration-300"
        onClick={() => onClick?.(track)}
      >
        <img 
          src={track.backgroundImage} 
          alt={track.title}
          className="absolute w-full h-full object-cover"
        />
        
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