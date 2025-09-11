'use client'

import { useState } from 'react'
import { Heart, Copy, ChevronDown, ArrowRight } from 'lucide-react'
import { Tool } from '../../types/tool'

interface ToolCardProps {
  tool: Tool
  variant?: 'compact' | 'full'
  onClick?: (tool: Tool) => void
  onFavorite?: (tool: Tool) => void
  onCopy?: (tool: Tool) => void
  isFavorited?: boolean
}

export default function ToolCard({ 
  tool, 
  variant = 'full', 
  onClick,
  onFavorite,
  onCopy,
  isFavorited = false
}: ToolCardProps) {
  const [favoriteLoading, setFavoriteLoading] = useState(false)

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
      <div 
        className="prompt-card relative cursor-pointer group min-w-[320px] p-6 rounded-2xl backdrop-blur-[10px] bg-white/5 border border-white/10 hover:bg-white/8 hover:translate-y-[-4px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        onClick={() => onClick?.(tool)}
      >
        {/* Favorite Button */}
        <button 
          className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-all duration-200 ease-in-out active:scale-90 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]' : ''}`}
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
        <div className="relative z-10">
          <div className="flex-grow">
            <div className="pr-12">
              <h3 className="text-lg font-semibold mb-2 text-white leading-snug tracking-tight">{tool.title}</h3>
              <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3 mt-3">
            {tool.tags?.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 border border-white/15 text-white/80">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end">
            <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </div>
        
        <div className="mt-4 p-4 rounded-lg bg-black/30 border border-white/10">
          <p className="text-sm text-white/90 font-mono leading-relaxed">
            {tool.content?.substring(0, 100)}...
          </p>
        </div>
      </div>
    )
  }

  // Full variant (for recommendations and main sections)
  return (
    <div 
      className="prompt-card relative cursor-pointer group min-w-[280px] h-full p-6 rounded-2xl backdrop-blur-[10px] bg-white/5 border border-white/10 hover:bg-white/8 hover:translate-y-[-4px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      onClick={() => onClick?.(tool)}
    >
      {/* Favorite Button */}
      <button 
        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-all duration-200 ease-in-out active:scale-90 ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${isFavorited ? 'animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]' : ''}`}
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
            <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 border border-white/15 text-white/80">
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
    </div>
  )
}