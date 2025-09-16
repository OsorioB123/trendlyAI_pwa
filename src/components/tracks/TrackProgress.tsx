'use client'

import { CheckCircle2, Circle, Lock, Play, Star } from 'lucide-react'
import { TrackProgressProps, ModuleState } from '../../types/track'

export default function TrackProgress({ track, onModuleClick }: TrackProgressProps) {
  const getModuleState = (moduleIndex: number): ModuleState => {
        const moduleItem = track.modules[moduleIndex]
    
    const isCompleted = track.moduleProgress.some(
            p => p.moduleId === moduleItem.id && p.isCompleted
    )
    
    if (isCompleted) return 'completed'
    
    const currentModuleId = track.userProgress?.currentModuleId
        if (currentModuleId === moduleItem.id) return 'current'
    
    if (moduleIndex === 0) return 'available'
    
        const previousModule = track.modules[moduleIndex - 1]
    const isPreviousCompleted = track.moduleProgress.some(
      p =>       p.moduleId === previousModule.id && p.isCompleted
    )
    
        return isPreviousCompleted ? 'available' : 'locked'
  }

  const getModuleIcon = (state: ModuleState) => {
    switch (state) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />
      case 'current':
        return <Play className="w-6 h-6 text-blue-400" />
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-500" />
      default:
        return <Circle className="w-6 h-6 text-white/60" />
    }
  }

  const getModuleStyles = (state: ModuleState, isEven: boolean) => {
    const baseStyles = "relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group"
    
    const positionStyles = isEven 
      ? "ml-auto mr-0 md:mr-8" 
      : "mr-auto ml-0 md:ml-8"
    
    switch (state) {
      case 'completed':
        return `${baseStyles} ${positionStyles} bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 hover:-translate-y-1`
      case 'current':
        return `${baseStyles} ${positionStyles} bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 hover:-translate-y-1 ring-2 ring-blue-500/20`
      case 'locked':
        return `${baseStyles} ${positionStyles} bg-gray-500/10 border-gray-500/30 cursor-not-allowed opacity-60`
      default:
        return `${baseStyles} ${positionStyles} bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1`
    }
  }

  const getConnectionLineStyles = (index: number, state: ModuleState, nextState?: ModuleState) => {
    const isEven = index % 2 === 0
    const baseStyles = "absolute h-16 w-0.5 transition-colors duration-300"
    
    const positionStyles = isEven
      ? "left-1/2 -translate-x-0.5 top-full"
      : "right-1/2 translate-x-0.5 top-full"

    if (state === 'completed' || nextState === 'completed' || nextState === 'current') {
      return `${baseStyles} ${positionStyles} bg-gradient-to-b from-green-400 to-blue-400`
    } else if (state === 'current') {
      return `${baseStyles} ${positionStyles} bg-gradient-to-b from-blue-400 to-white/30`
    } else {
      return `${baseStyles} ${positionStyles} bg-white/20`
    }
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Serpentine Track */}
      <div className="space-y-16">
        {track.modules.map((moduleItem, index) => {
          const isEven = index % 2 === 0
          const state = getModuleState(index)
          const nextState = index < track.modules.length - 1 ? getModuleState(index + 1) : undefined
          const isClickable = state !== 'locked'

          return (
            <div key={moduleItem.id} className="relative">
              {/* Module Card */}
              <div 
                className={`w-full max-w-sm ${getModuleStyles(state, isEven)}`}
                onClick={() => isClickable && onModuleClick(moduleItem)}
              >
                {/* Module Number & Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    state === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : state === 'current'
                      ? 'bg-blue-500 text-white'
                      : state === 'locked'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  {getModuleIcon(state)}
                  
                  {/* Progress indicator for current module */}
                  {state === 'current' && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-400 font-medium">Em andamento</span>
                    </div>
                  )}
                </div>

                {/* Module Content */}
                <div>
                  <h3 className={`font-semibold text-lg mb-2 ${
                    state === 'locked' ? 'text-gray-500' : 'text-white'
                  }`}>
                    {moduleItem.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 line-clamp-3 ${
                    state === 'locked' ? 'text-gray-600' : 'text-white/70'
                  }`}>
                    {moduleItem.content.briefing}
                  </p>

                  {/* Module Meta Info */}
                  <div className="flex items-center gap-4 text-xs">
                    {moduleItem.videoUrl && (
                      <span className={`flex items-center gap-1 ${
                        state === 'locked' ? 'text-gray-600' : 'text-white/60'
                      }`}>
                        <Play className="w-3 h-3" />
                        Vídeo
                      </span>
                    )}
                    
                    {moduleItem.content.prompts.length > 0 && (
                      <span className={`flex items-center gap-1 ${
                        state === 'locked' ? 'text-gray-600' : 'text-white/60'
                      }`}>
                        <Star className="w-3 h-3" />
                        {moduleItem.content.prompts.length} Prompts
                      </span>
                    )}
                    
                    {moduleItem.tools && moduleItem.tools.length > 0 && (
                      <span className={`flex items-center gap-1 ${
                        state === 'locked' ? 'text-gray-600' : 'text-white/60'
                      }`}>
                        🛠️ {moduleItem.tools.length} Ferramentas
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Effect for Available Modules */}
                {isClickable && (
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}

                {/* Action Button */}
                {state === 'current' && (
                  <div className="mt-4">
                    <button 
                      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        onModuleClick(moduleItem)
                      }}
                    >
                      Continuar Módulo
                    </button>
                  </div>
                )}

                {state === 'available' && index > 0 && (
                  <div className="mt-4">
                    <button 
                      className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        onModuleClick(moduleItem)
                      }}
                    >
                      Iniciar Módulo
                    </button>
                  </div>
                )}
              </div>

              {/* Connection Line to Next Module */}
              {index < track.modules.length - 1 && (
                <>
                  {/* Vertical line down */}
                  <div className={getConnectionLineStyles(index, state, nextState)} />
                  
                  {/* Horizontal connecting line */}
                  <div className={`absolute top-full mt-16 h-0.5 transition-colors duration-300 ${
                    isEven ? 'left-1/2 right-0' : 'right-1/2 left-0'
                  } ${
                    state === 'completed' || nextState === 'completed' || nextState === 'current'
                      ? 'bg-gradient-to-r from-green-400 to-blue-400'
                      : state === 'current'
                      ? 'bg-gradient-to-r from-blue-400 to-white/30'
                      : 'bg-white/20'
                  }`} />
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Track Completion Celebration */}
      {track.userProgress?.progressPercentage === 100 && (
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-500/30">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">Parabéns!</h3>
          <p className="text-white/80">
            Você completou toda a trilha &quot;{track.title}&quot;!
          </p>
        </div>
      )}

      {/* Mobile Optimization Notice */}
      <div className="md:hidden mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-400 text-center">
          💡 Dica: Gire seu dispositivo para uma melhor experiência de visualização
        </p>
      </div>
    </div>
  )
}
