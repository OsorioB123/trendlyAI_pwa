'use client'

import { useState } from 'react'
import { Heart, ArrowRight } from 'lucide-react'
import { Tool } from '../../types/tool'

interface ToolCardProps {
  tool: Tool
  onClick: (tool: Tool) => void
  onFavorite: (tool: Tool) => void
  isFavorited: boolean
}

export default function ToolCard({ 
  tool, 
  onClick,
  onFavorite,
  isFavorited
}: ToolCardProps) {
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (favoriteLoading) return
    
    setFavoriteLoading(true)
    try {
      await onFavorite(tool)
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleCardClick = () => {
    onClick(tool)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Copywriting': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'SEO': 'bg-green-500/20 text-green-300 border-green-500/30', 
      'Imagem': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Análise': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Negócios': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Marketing': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Design': 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    }
    return colors[category as keyof typeof colors] || 'bg-white/10 text-white/80 border-white/15'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text-generation':
        return '✍️'
      case 'image-generation':
        return '🎨'
      case 'data-analysis':
        return '📊'
      case 'research':
        return '🔍'
      default:
        return '🛠️'
    }
  }

  return (
    <div 
      className="tool-card-grid-item cursor-pointer"
      data-id={tool.id}
      onClick={handleCardClick}
    >
      <div className="prompt-card relative card-glow group rounded-2xl overflow-hidden h-72 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-4px] hover:scale-[1.02] active:scale-[0.98]">
        
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-[10px] border border-white/10" />
        
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

        {/* Category Tag - Top Left */}
        <div className="absolute top-5 left-5 z-10">
          <span 
            className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-lg border transition-all duration-300 ${getCategoryColor(tool.category)}`}
          >
            {tool.category}
          </span>
        </div>

        {/* Type Badge - Top Left, below category */}
        <div className="absolute top-14 left-5 z-10">
          <span className="px-2 py-1 text-xs bg-black/20 backdrop-blur-md rounded-full text-white/80 border border-white/10">
            {getTypeIcon(tool.type)} {tool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          
          {/* Content Area */}
          <div className="relative z-10">
            
            {/* Title */}
            <h3 className="font-semibold text-white text-lg mb-3 line-clamp-2 leading-tight">
              {tool.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-white/70 line-clamp-2 leading-relaxed mb-4">
              {tool.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tool.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60">
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>

            {/* AI Compatibility Indicators */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-white/60">Compatível com:</span>
              <div className="flex gap-1">
                {tool.compatibility.slice(0, 3).map((ai, index) => (
                  <span 
                    key={ai}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-xs text-white/70 border border-white/10"
                    title={ai}
                  >
                    {ai.charAt(0)}
                  </span>
                ))}
                {tool.compatibility.length > 3 && (
                  <span 
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-xs text-white/50"
                    title={`+${tool.compatibility.length - 3} more`}
                  >
                    +{tool.compatibility.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between text-xs text-white/50 pt-3 border-t border-white/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
              <span>Clique para abrir</span>
              <div className="flex items-center gap-1 hover:text-white transition-colors">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        <style jsx>{`
          .prompt-card::before {
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
            border-radius: inherit;
          }

          .prompt-card:hover::before {
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
      </div>
    </div>
  )
}