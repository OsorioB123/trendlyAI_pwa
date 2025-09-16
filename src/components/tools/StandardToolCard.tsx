'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Tool } from '../../types/tool'
import { cn } from '../../lib/utils'

interface StandardToolCardProps {
  tool: Tool
  onClick: (tool: Tool) => void
  onFavorite: (tool: Tool) => void
  isFavorited: boolean
}

export default function StandardToolCard({ 
  tool, 
  onClick,
  onFavorite,
  isFavorited
}: StandardToolCardProps) {
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

  const getCategoryClassName = (category: string) => {
    const categoryMap = {
      'Copywriting': 'category-copywriting',
      'SEO': 'category-seo', 
      'Imagem': 'category-image',
      'Análise': 'category-analysis',
      'Negócios': 'category-business',
      'Marketing': 'category-marketing',
      'Design': 'category-design'
    }
    return categoryMap[category as keyof typeof categoryMap] || 'glass-medium'
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
      className="tool-card-grid-item cursor-pointer interactive"
      data-id={tool.id}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        rotateX: springY,
        rotateY: springX,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div 
        className={cn(
          "relative overflow-hidden group",
          "glass-strong shadow-card",
          "h-72",
          // Using design tokens for border radius
          "rounded-[--radius-lg]"
        )}
        style={{
          transform: "translateZ(20px)",
          borderRadius: "var(--radius-lg)"
        }}
      >
        
        {/* Favorite Button - Using design token sizing */}
        <motion.button 
          className={cn(
            "absolute top-[--space-4] right-[--space-4] z-20",
            "touch-target-large",
            "glass-strong shadow-sm",
            "rounded-[--radius-full]",
            "transition-all duration-[--duration-normal]",
            favoriteLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:glass-intense'
          )}
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isFavorited ? { scale: [1, 1.2, 1] } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            top: "var(--space-4)",
            right: "var(--space-4)",
            borderRadius: "var(--radius-full)"
          }}
        >
          <Heart className={cn(
            "w-5 h-5 transition-all duration-[--duration-normal]",
            isFavorited 
              ? 'text-red-500 fill-red-500' 
              : 'text-white/80 hover:text-white'
          )} />
        </motion.button>

        {/* Category Tag - Using design tokens */}
        <div 
          className="absolute z-10"
          style={{
            top: "var(--space-5)",
            left: "var(--space-5)"
          }}
        >
          <span 
            className={cn(
              "text-[--text-xs] font-[--font-weight-medium]",
              "rounded-[--radius-full]",
              "glass-medium border-[--glass-border-medium]",
              "transition-all duration-[--duration-normal]",
              getCategoryClassName(tool.category)
            )}
            style={{
              padding: "var(--space-1) var(--space-3)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              borderRadius: "var(--radius-full)"
            }}
          >
            {tool.category}
          </span>
        </div>

        {/* Type Badge - Using design tokens */}
        <div 
          className="absolute z-10"
          style={{
            top: "calc(var(--space-5) + var(--space-8))",
            left: "var(--space-5)"
          }}
        >
          <span 
            className={cn(
              "text-[--text-xs] text-white/80",
              "rounded-[--radius-xs]",
              "glass-subtle border-[--glass-border-subtle]"
            )}
            style={{
              padding: "var(--space-1) var(--space-2)",
              fontSize: "var(--text-xs)",
              borderRadius: "var(--radius-xs)"
            }}
          >
            {getTypeIcon(tool.type)} {tool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Main Content */}
        <div 
          className="absolute inset-0 flex flex-col justify-end"
          style={{ padding: "var(--space-6)" }}
        >
          
          {/* Content Area */}
          <div className="relative z-10">
            
            {/* Title */}
            <h3 
              className="font-[--font-weight-semibold] text-white line-clamp-2 leading-[--leading-tight] drop-shadow-sm"
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--font-weight-semibold)",
                lineHeight: "var(--leading-tight)",
                marginBottom: "var(--space-3)"
              }}
            >
              {tool.title}
            </h3>
            
            {/* Description */}
            <p 
              className="text-white/70 line-clamp-2 leading-[--leading-relaxed] drop-shadow-sm"
              style={{
                fontSize: "var(--text-sm)",
                lineHeight: "var(--leading-relaxed)",
                marginBottom: "var(--space-4)"
              }}
            >
              {tool.description}
            </p>

            {/* Tags */}
            <div 
              className="flex flex-wrap"
              style={{
                gap: "calc(var(--space-1) + var(--space-1)/2)", // 6px
                marginBottom: "var(--space-4)"
              }}
            >
              {tool.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-white/80 glass-subtle border-[--glass-border-subtle]"
                  style={{
                    padding: "var(--space-1) var(--space-2)",
                    fontSize: "var(--text-xs)",
                    borderRadius: "var(--radius-full)"
                  }}
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span 
                  className="text-white/60 glass-subtle border-[--glass-border-subtle]"
                  style={{
                    padding: "var(--space-1) var(--space-2)",
                    fontSize: "var(--text-xs)",
                    borderRadius: "var(--radius-full)"
                  }}
                >
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>

            {/* AI Compatibility Indicators */}
            <div 
              className="flex items-center"
              style={{
                gap: "var(--space-2)",
                marginBottom: "var(--space-4)"
              }}
            >
              <span 
                className="text-white/60 drop-shadow-sm"
                style={{ fontSize: "var(--text-xs)" }}
              >
                Compatível com:
              </span>
              <div className="flex" style={{ gap: "var(--space-1)" }}>
                {tool.compatibility.slice(0, 3).map((ai) => (
                  <span 
                    key={ai}
                    className="flex items-center justify-center text-white/70 glass-medium border-[--glass-border-medium] touch-target"
                    style={{
                      width: "var(--space-6)",
                      height: "var(--space-6)",
                      fontSize: "var(--text-xs)",
                      borderRadius: "var(--radius-full)"
                    }}
                    title={ai}
                  >
                    {ai.charAt(0)}
                  </span>
                ))}
                {tool.compatibility.length > 3 && (
                  <span 
                    className="flex items-center justify-center text-white/50 glass-subtle border-[--glass-border-subtle]"
                    style={{
                      width: "var(--space-6)",
                      height: "var(--space-6)",
                      fontSize: "var(--text-xs)",
                      borderRadius: "var(--radius-full)"
                    }}
                    title={`+${tool.compatibility.length - 3} more`}
                  >
                    +{tool.compatibility.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div 
              className={cn(
                "flex items-center justify-between text-white/50 opacity-70 transition-opacity",
                "group-hover:opacity-100 glass-subtle border-t border-[--glass-border-subtle]"
              )}
              style={{
                fontSize: "var(--text-xs)",
                paddingTop: "var(--space-3)",
                marginTop: "var(--space-4)",
                marginLeft: "calc(-1 * var(--space-6))",
                marginRight: "calc(-1 * var(--space-6))",
                marginBottom: "calc(-1 * var(--space-6))",
                paddingLeft: "var(--space-6)",
                paddingRight: "var(--space-6)",
                paddingBottom: "var(--space-6)",
                transitionDuration: "var(--duration-normal)"
              }}
            >
              <span className="drop-shadow-sm">Clique para abrir</span>
              <motion.div 
                className="flex items-center hover:text-white transition-colors drop-shadow-sm"
                style={{
                  gap: "var(--space-1)",
                  transitionDuration: "var(--duration-normal)"
                }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Hover Light Effect */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(255,255,255,0.08) 0%, 
              rgba(255,255,255,0.02) 40%, 
              transparent 70%
            )`,
            transitionDuration: "var(--duration-slower)"
          }}
        />

        {/* Enhanced Card Styles */}
        <style jsx>{`
          .tool-card-grid-item {
            transition: all var(--duration-normal) var(--ease-spring);
          }

          .tool-card-grid-item:hover {
            box-shadow: var(--shadow-lg);
          }

          .tool-card-grid-item:active {
            box-shadow: var(--shadow-sm);
            transition-duration: var(--duration-fast);
          }

          @media (prefers-reduced-motion: reduce) {
            .tool-card-grid-item {
              transition: none;
            }
          }

          @media (prefers-contrast: high) {
            .tool-card-grid-item {
              border: 2px solid rgba(255, 255, 255, 0.5);
            }
          }
        `}</style>
      </motion.div>
    </motion.div>
  )
}