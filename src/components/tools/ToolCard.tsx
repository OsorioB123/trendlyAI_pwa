'use client'

import { useState, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
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
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 500, damping: 100 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 100 })
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateX = (event.clientY - centerY) / 10
    const rotateY = (centerX - event.clientX) / 10
    
    mouseX.set(rotateY)
    mouseY.set(rotateX)
  }
  
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

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

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  const handleFavoriteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      if (!favoriteLoading) {
        handleFavoriteClick(e as any)
      }
    }
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
    <motion.div 
      ref={cardRef}
      className="tool-card-grid-item"
      data-id={tool.id}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springY,
        rotateY: springX,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Main clickable area - Keyboard accessible */}
      <button
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-2xl group"
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        aria-label={`Abrir ferramenta: ${tool.title}. Categoria: ${tool.category}. ${tool.description}`}
        tabIndex={0}
      >
        <motion.div 
          className="glass-card relative card-glow overflow-hidden h-72"
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            transform: "translateZ(20px)",
            borderRadius: 'var(--radius-lg)',
          }}
        >
          
          {/* Enhanced Background with design tokens */}
          <motion.div 
            className="absolute inset-0 glass-interactive"
            style={{
              background: 'var(--glass-bg-medium)',
              backdropFilter: 'blur(var(--glass-blur-strong))',
              border: '1px solid var(--glass-border-medium)',
            }}
            whileHover={{
              background: "var(--glass-bg-strong)",
              borderColor: "var(--glass-border-strong)",
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          
          {/* Category Tag - Top Left - Enhanced with Design Tokens */}
          <div className="absolute top-5 left-5 z-10">
            <span 
              className={`px-3 py-1.5 text-xs font-medium transition-all duration-300 ${getCategoryColor(tool.category)}`}
              style={{
                borderRadius: 'var(--radius-full)',
                backdropFilter: 'blur(var(--glass-blur-medium))',
                background: 'var(--glass-bg-light)',
                border: '1px solid var(--glass-border-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {tool.category}
            </span>
          </div>

          {/* Type Badge - Top Left, below category - Enhanced Accessibility */}
          <div className="absolute top-14 left-5 z-10">
            <span 
              className="px-2 py-1 text-xs font-medium text-secondary"
              style={{
                background: 'var(--glass-bg-medium)',
                backdropFilter: 'blur(var(--glass-blur-light))',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--glass-border-light)',
                color: 'var(--text-secondary)', // WCAG AA compliant
              }}
            >
              {getTypeIcon(tool.type)} {tool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Main Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            
            {/* Content Area */}
            <div className="relative z-10">
              
              {/* Title - Enhanced Typography */}
              <h3 
                className="font-semibold text-lg mb-3 line-clamp-2"
                style={{
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-lg)',
                  lineHeight: 'var(--leading-tight)',
                }}
              >
                {tool.title}
              </h3>
              
              {/* Description - WCAG AA Compliant */}
              <p 
                className="text-sm line-clamp-2 mb-4"
                style={{
                  color: 'var(--text-tertiary)', // WCAG AA compliant 9:1 ratio
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                {tool.description}
              </p>

              {/* Tags - Enhanced with Design Tokens */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs font-medium"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--glass-bg-light)',
                      color: 'var(--text-secondary)',
                      backdropFilter: 'blur(var(--glass-blur-subtle))',
                      border: '1px solid var(--glass-border-subtle)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 3 && (
                  <span 
                    className="px-2 py-1 text-xs"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--glass-bg-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    +{tool.tags.length - 3}
                  </span>
                )}
              </div>

              {/* AI Compatibility Indicators - Enhanced Accessibility */}
              <div className="flex items-center gap-2 mb-4">
                <span 
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Compatível com:
                </span>
                <div className="flex gap-1">
                  {tool.compatibility.slice(0, 3).map((ai, index) => (
                    <span 
                      key={ai}
                      className="touch-target flex items-center justify-center text-xs font-medium"
                      style={{
                        width: '32px', // Increased for better touch targets
                        height: '32px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--glass-bg-medium)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--glass-border-light)',
                        backdropFilter: 'blur(var(--glass-blur-subtle))',
                      }}
                      title={ai}
                    >
                      {ai.charAt(0)}
                    </span>
                  ))}
                  {tool.compatibility.length > 3 && (
                    <span 
                      className="touch-target flex items-center justify-center text-xs"
                      style={{
                        width: '32px',
                        height: '32px', 
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--glass-bg-subtle)',
                        color: 'var(--text-muted)',
                      }}
                      title={`+${tool.compatibility.length - 3} more`}
                    >
                      +{tool.compatibility.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Action - Enhanced Accessibility */}
              <div 
                className="flex items-center justify-between text-xs pt-3 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  borderTop: '1px solid var(--glass-border-subtle)',
                  color: 'var(--text-placeholder)', // WCAG AA compliant
                }}
              >
                <span>Clique para abrir</span>
                <motion.div 
                  className="flex items-center gap-1 transition-colors"
                  style={{
                    color: 'var(--text-muted)',
                  }}
                  whileHover={{ 
                    x: 4,
                    color: 'var(--text-primary)',
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Hover Effects with Design Tokens */}
          <style jsx>{`
            .glass-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glass-bg-medium) 0%, transparent 40%);
              opacity: 0;
              transition: opacity var(--duration-fast) var(--ease-primary);
              pointer-events: none;
              border-radius: inherit;
            }

            .glass-card:hover::before {
              opacity: 1;
            }

            .card-glow {
              box-shadow: var(--shadow-card-default);
              transition: box-shadow var(--duration-fast) var(--ease-primary);
            }

            .card-glow:hover {
              box-shadow: var(--shadow-card-hover), 0 0 0 1px var(--glass-border-light);
            }

            .card-glow:active {
              box-shadow: var(--shadow-card-active);
            }

            @keyframes pop {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }

            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
              .glass-card::before,
              .card-glow {
                transition: none !important;
              }
            }
          `}</style>
        </motion.div>
      </button>

      {/* Favorite Button - Enhanced with Design Tokens */}
      <button 
        className={`absolute top-4 right-4 z-30 touch-target-large flex items-center justify-center transition-all focus-visible:focus-visible ${favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        style={{
          borderRadius: 'var(--radius-full)',
          backdropFilter: 'blur(var(--glass-blur-strong))',
          background: 'var(--glass-bg-medium)',
          border: '1px solid var(--glass-border-medium)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--duration-fast) var(--ease-primary)',
        }}
        onMouseEnter={(e) => {
          if (!favoriteLoading) {
            e.currentTarget.style.background = 'var(--glass-bg-strong)'
            e.currentTarget.style.borderColor = 'var(--glass-border-strong)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--glass-bg-medium)'
          e.currentTarget.style.borderColor = 'var(--glass-border-medium)'
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        }}
        onClick={handleFavoriteClick}
        onKeyDown={handleFavoriteKeyDown}
        disabled={favoriteLoading}
        aria-label={isFavorited ? `Remover ${tool.title} dos favoritos` : `Adicionar ${tool.title} aos favoritos`}
        tabIndex={0}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isFavorited ? { scale: [1, 1.2, 1] } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Heart className={`w-5 h-5 transition-all duration-200 ${ 
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-white/80 hover:text-white'
          }`} />
        </motion.div>
      </button>
    </motion.div>
  )
}
