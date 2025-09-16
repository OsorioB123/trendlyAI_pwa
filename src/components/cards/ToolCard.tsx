'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ChevronDown, ArrowRight } from 'lucide-react'
import { Tool } from '../../types/tool'
import { MOTION_CONSTANTS } from '@/lib/motion'

interface ToolCardProps {
  tool: Tool
  variant?: 'compact' | 'full'
  onClick?: (tool: Tool) => void
  onFavorite?: (tool: Tool) => void
  isFavorited?: boolean
}

export default function ToolCard({ 
  tool, 
  variant = 'full', 
  onClick,
  onFavorite,
  isFavorited = false
}: ToolCardProps) {
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
      await onFavorite?.(tool)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }
  if (variant === 'compact') {
    return (
      <div className="min-w-[320px] p-2">
        <motion.div 
          className="prompt-card relative cursor-pointer group p-6 rounded-2xl liquid-glass hover:bg-white/8 focus-ring"
          role="button"
          tabIndex={0}
          aria-label={`Abrir ferramenta: ${tool.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick?.(tool)
            }
          }}
          onClick={() => onClick?.(tool)}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', ...MOTION_CONSTANTS.SPRING.stiff }}
        >
        {/* Favorite Button */}
        <button 
          className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200 ease-in-out active:scale-90 opacity-60 hover:opacity-100 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] opacity-100' : ''}`}
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={isFavorited}
          title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`w-4 h-4 transition-all duration-200 ${
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-white/70 hover:text-white'
          }`} />
        </button>
        <div className="relative z-10">
          <div className="flex-grow">
            <div className="pr-12">
              <h3 className="text-lg font-semibold mb-2 text-white leading-snug tracking-tight">{tool.title}</h3>
              <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3 mt-3">
            {tool.tags?.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-white/80">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end">
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </div>
        
      <div className="mt-4 p-4 rounded-lg bg-black/30">
          <p className="text-sm text-white/90 font-mono leading-relaxed">
            {tool.content?.substring(0, 100)}...
          </p>
        </div>
      </motion.div>
      </div>
    )
  }

  // Full variant (for recommendations and main sections)
  return (
    <div className="min-w-[280px] p-2">
      <motion.div 
        className="prompt-card relative cursor-pointer group h-full p-6 rounded-2xl liquid-glass hover:bg-white/8 focus-ring"
        role="button"
        tabIndex={0}
        aria-label={`Abrir ferramenta: ${tool.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.(tool)
          }
        }}
        onClick={() => onClick?.(tool)}
        whileHover={reducedMotion ? undefined : { scale: 1.02 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', ...MOTION_CONSTANTS.SPRING.stiff }}
      >
      {/* Favorite Button */}
      <button 
        className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-200 ease-in-out active:scale-90 opacity-60 hover:opacity-100 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] opacity-100' : ''}`}
        onClick={handleFavoriteClick}
        disabled={favoriteLoading}
        aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={isFavorited}
        title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart className={`w-4 h-4 transition-all duration-200 ${
          isFavorited 
            ? 'text-red-500 fill-red-500' 
            : 'text-white/70 hover:text-white'
        }`} />
      </button>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          <div className="pr-12">
            <h3 className="text-lg font-semibold text-white mb-2 leading-snug tracking-tight">
              {tool.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-white/80">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-white/50 mt-auto">
          <span>Clique para abrir</span>
          <div className="flex items-center gap-1">
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  )
}
