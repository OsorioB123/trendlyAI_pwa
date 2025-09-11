'use client'

import { Heart, Copy, ChevronDown, ArrowRight } from 'lucide-react'
import { Tool } from '../../types/tool'

interface ToolCardProps {
  tool: Tool
  variant?: 'compact' | 'full'
  onClick?: (tool: Tool) => void
  onFavorite?: (tool: Tool) => void
  onCopy?: (tool: Tool) => void
}

export default function ToolCard({ 
  tool, 
  variant = 'full', 
  onClick,
  onFavorite,
  onCopy 
}: ToolCardProps) {
  if (variant === 'compact') {
    return (
      <div 
        className="relative cursor-pointer group min-w-[320px] p-6 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/15 shadow-2xl hover:bg-white/15 transition-all duration-300"
        onClick={() => onClick?.(tool)}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold mb-1 text-white font-sans">{tool.title}</h3>
              <p className="text-sm text-white/70">{tool.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/15 hover:bg-white/20 transition-all duration-300" 
                aria-label="Favoritar"
                onClick={(e) => {
                  e.stopPropagation()
                  onFavorite?.(tool)
                }}
              >
                <Heart className="w-4 h-4 text-white/70 hover:text-red-400 transition-colors" />
              </button>
              <button 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/15 hover:bg-white/20 transition-all duration-300" 
                aria-label="Copiar prompt"
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy?.(tool)
                }}
              >
                <Copy className="w-4 h-4 text-white/70 hover:text-green-400 transition-colors" />
              </button>
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
      className="relative cursor-pointer group min-w-[280px] h-full p-6 rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/15 shadow-2xl hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
      onClick={() => onClick?.(tool)}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4 flex-grow">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-2 leading-snug font-sans">
              {tool.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
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