'use client'

import { useState, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useAnimation } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Tool } from '../../types/tool'

interface EnhancedToolCardProps {
  tool: Tool
  onClick: (tool: Tool) => void
  onFavorite: (tool: Tool) => void
  isFavorited: boolean
  index?: number
}

// Standardized animation configurations
const EASING = {
  primary: [0.16, 1, 0.3, 1] as const,
  quick: [0.25, 0.46, 0.45, 0.94] as const,
  entrance: [0.25, 1, 0.5, 1] as const
}

const SPRING = {
  gentle: { damping: 25, stiffness: 300, mass: 0.8 },
  bouncy: { damping: 15, stiffness: 400, mass: 0.5 },
  tight: { damping: 30, stiffness: 500, mass: 0.6 }
}

export default function EnhancedToolCard({ 
  tool, 
  onClick,
  onFavorite,
  isFavorited,
  index = 0
}: EnhancedToolCardProps) {
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const favoriteControls = useAnimation()
  
  // Enhanced 3D tilt system
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, SPRING.gentle)
  const springY = useSpring(mouseY, SPRING.gentle)

  // Card animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      rotateX: 0,
      rotateY: 0
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: EASING.entrance,
        staggerChildren: 0.1
      }
    },
    hover: {
      y: -12,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: EASING.primary
      }
    },
    tap: {
      scale: 0.98,
      transition: { 
        duration: 0.1,
        ease: EASING.quick 
      }
    }
  }

  // Enhanced background variants
  const backgroundVariants = {
    idle: {
      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)"
    },
    hover: {
      background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(239,209,53,0.1) 100%)",
      transition: {
        duration: 0.3,
        ease: EASING.primary
      }
    }
  }

  // Favorite button variants with enhanced feedback
  const favoriteVariants = {
    idle: { 
      scale: 1,
      rotate: 0,
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    },
    hover: { 
      scale: 1.1,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      transition: { 
        duration: 0.2,
        ease: EASING.quick
      }
    },
    tap: { 
      scale: 0.9,
      transition: { duration: 0.1 }
    },
    success: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    loading: {
      scale: 0.95,
      rotate: [0, 180, 360],
      transition: {
        rotate: {
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 0.2
        }
      }
    }
  }

  // Heart icon variants
  const heartVariants = {
    idle: { 
      scale: 1,
      fill: isFavorited ? "#ef4444" : "transparent",
      color: isFavorited ? "#ef4444" : "rgba(255, 255, 255, 0.8)"
    },
    hover: {
      scale: 1.1,
      rotate: [-5, 5, 0],
      transition: {
        duration: 0.3,
        ease: EASING.quick
      }
    },
    favorited: {
      scale: [1, 1.4, 1],
      rotate: [0, 20, 0],
      fill: "#ef4444",
      color: "#ef4444",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Enhanced mouse movement handler
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Reduced tilt intensity for subtler effect
    const rotateX = (event.clientY - centerY) / 20
    const rotateY = (centerX - event.clientX) / 20
    
    mouseX.set(rotateY)
    mouseY.set(rotateX)
  }
  
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  // Enhanced favorite click with success animation
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (favoriteLoading) return
    
    setFavoriteLoading(true)
    
    try {
      // Trigger loading animation
      await favoriteControls.start("loading")
      
      // Execute the favorite toggle
      await onFavorite(tool)
      
      // Trigger success animation
      await favoriteControls.start("success")
      
      // Animate heart icon change
      if (!isFavorited) {
        favoriteControls.start("favorited")
      }
      
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      // Reset to idle state on error
      favoriteControls.start("idle")
    } finally {
      setFavoriteLoading(false)
      setTimeout(() => favoriteControls.start("idle"), 600)
    }
  }

  const handleCardClick = () => {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    onClick(tool)
  }

  // Enhanced category color system
  const getCategoryColor = (category: string) => {
    const colors = {
      'Copywriting': {
        bg: 'rgba(59, 130, 246, 0.2)',
        text: '#93c5fd',
        border: 'rgba(59, 130, 246, 0.3)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)'
      },
      'SEO': {
        bg: 'rgba(34, 197, 94, 0.2)',
        text: '#86efac',
        border: 'rgba(34, 197, 94, 0.3)',
        glow: '0 0 20px rgba(34, 197, 94, 0.3)'
      },
      'Imagem': {
        bg: 'rgba(168, 85, 247, 0.2)',
        text: '#c4b5fd',
        border: 'rgba(168, 85, 247, 0.3)',
        glow: '0 0 20px rgba(168, 85, 247, 0.3)'
      },
      'Análise': {
        bg: 'rgba(249, 115, 22, 0.2)',
        text: '#fdba74',
        border: 'rgba(249, 115, 22, 0.3)',
        glow: '0 0 20px rgba(249, 115, 22, 0.3)'
      },
      'Negócios': {
        bg: 'rgba(239, 68, 68, 0.2)',
        text: '#fca5a5',
        border: 'rgba(239, 68, 68, 0.3)',
        glow: '0 0 20px rgba(239, 68, 68, 0.3)'
      },
      'Marketing': {
        bg: 'rgba(236, 72, 153, 0.2)',
        text: '#f9a8d4',
        border: 'rgba(236, 72, 153, 0.3)',
        glow: '0 0 20px rgba(236, 72, 153, 0.3)'
      },
      'Design': {
        bg: 'rgba(20, 184, 166, 0.2)',
        text: '#5eead4',
        border: 'rgba(20, 184, 166, 0.3)',
        glow: '0 0 20px rgba(20, 184, 166, 0.3)'
      }
    }
    return colors[category as keyof typeof colors] || {
      bg: 'rgba(255, 255, 255, 0.1)',
      text: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.15)',
      glow: '0 0 20px rgba(255, 255, 255, 0.1)'
    }
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'text-generation': '✍️',
      'image-generation': '🎨',
      'data-analysis': '📊',
      'research': '🔍'
    }
    return icons[type as keyof typeof icons] || '🛠️'
  }

  const categoryStyle = getCategoryColor(tool.category)

  return (
    <motion.div 
      ref={cardRef}
      className="tool-card-grid-item cursor-pointer"
      data-id={tool.id}
      variants={cardVariants as any}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springY,
        rotateY: springX,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div 
        className="prompt-card relative card-glow group rounded-2xl overflow-hidden h-72"
        style={{
          transform: "translateZ(20px)",
          boxShadow: isHovered 
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 4px 20px rgba(0, 0, 0, 0.3)"
        }}
      >
        
        {/* Enhanced Background with dynamic gradient */}
        <motion.div 
          className="absolute inset-0 backdrop-blur-[10px]"
          variants={backgroundVariants as any}
          animate={isHovered ? "hover" : "idle"}
          style={{
            borderRadius: 16,
          }}
        />
        
        {/* Enhanced Favorite Button */}
        <motion.button 
          className="absolute top-4 right-4 z-20 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full backdrop-blur-[20px]"
          variants={favoriteVariants as any}
          animate={favoriteLoading ? "loading" : isHovered ? "hover" : "idle"}
          whileTap="tap"
          onClick={handleFavoriteClick}
          disabled={favoriteLoading}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          style={{
            backgroundColor: favoriteLoading ? "rgba(255, 255, 255, 0.08)" : undefined
          }}
        >
          <motion.div
            variants={heartVariants as any}
            animate={isFavorited ? "favorited" : "idle"}
            whileHover="hover"
          >
            <Heart className="w-5 h-5 transition-all duration-200" />
          </motion.div>
        </motion.button>

        {/* Enhanced Category Tag */}
        <motion.div 
          className="absolute top-5 left-5 z-10"
          whileHover={{
            scale: 1.05,
            boxShadow: categoryStyle.glow,
            transition: { duration: 0.2 }
          }}
        >
          <span 
            className="px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-lg border transition-all duration-300"
            style={{
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.text,
              borderColor: categoryStyle.border
            }}
          >
            {tool.category}
          </span>
        </motion.div>

        {/* Enhanced Type Badge */}
        <motion.div 
          className="absolute top-14 left-5 z-10"
          whileHover={{
            scale: 1.05,
            y: -1,
            transition: { duration: 0.2 }
          }}
        >
          <span className="px-2 py-1 text-xs bg-black/20 backdrop-blur-md rounded-full text-white/80">
            {getTypeIcon(tool.type)} {tool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </motion.div>

        {/* Main Content with enhanced animations */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          
          <motion.div 
            className="relative z-10"
            variants={{
              initial: { opacity: 0, y: 10 },
              animate: { 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: (index * 0.1) + 0.2,
                  duration: 0.4,
                  ease: EASING.primary
                }
              }
            }}
          >
            
            {/* Title with enhanced typography */}
            <motion.h3 
              className="font-semibold text-white text-lg mb-3 line-clamp-2 leading-tight"
              whileHover={{
                color: "rgba(255, 255, 255, 0.9)",
                transition: { duration: 0.2 }
              }}
            >
              {tool.title}
            </motion.h3>
            
            {/* Description with subtle animation */}
            <motion.p 
              className="text-sm text-white/70 line-clamp-2 leading-relaxed mb-4"
              whileHover={{
                color: "rgba(255, 255, 255, 0.8)",
                transition: { duration: 0.2 }
              }}
            >
              {tool.description}
            </motion.p>

            {/* Enhanced Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                <motion.span 
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80 backdrop-blur-sm"
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      delay: (index * 0.1) + (tagIndex * 0.05) + 0.3,
                      duration: 0.3
                    }
                  }}
                >
                  {tag}
                </motion.span>
              ))}
              {tool.tags.length > 3 && (
                <motion.span 
                  className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { delay: (index * 0.1) + 0.5 }
                  }}
                >
                  +{tool.tags.length - 3}
                </motion.span>
              )}
            </div>

            {/* AI Compatibility with enhanced interaction */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-white/60">Compatível com:</span>
              <div className="flex gap-1">
                {tool.compatibility.slice(0, 3).map((ai, aiIndex) => (
                  <motion.span 
                    key={ai}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-xs text-white/70"
                    title={ai}
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      transition: { duration: 0.2 }
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: {
                        delay: (index * 0.1) + (aiIndex * 0.1) + 0.4,
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }
                    }}
                  >
                    {ai.charAt(0)}
                  </motion.span>
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

            {/* Enhanced Footer Action */}
            <motion.div 
              className="flex items-center justify-between text-xs text-white/50 pt-3 transition-opacity duration-300"
              animate={{
                opacity: isHovered ? 1 : 0.7,
                borderColor: isHovered ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"
              }}
            >
              <span>Clique para abrir</span>
              <motion.div 
                className="flex items-center gap-1 transition-colors"
                whileHover={{ 
                  color: "rgba(255, 255, 255, 0.9)",
                  x: 4,
                  transition: { 
                    duration: 0.2,
                    ease: EASING.quick 
                  }
                }}
              >
                <ArrowRight className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced hover glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.1) 0%, transparent 40%)`,
            opacity: isHovered ? 1 : 0,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: EASING.primary
          }}
        />
      </motion.div>
    </motion.div>
  )
}
