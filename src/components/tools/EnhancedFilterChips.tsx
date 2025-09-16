
'use client'

import { motion } from 'framer-motion'
import { ToolCategory } from '../../types/tool'
import { respectReducedMotion } from '@/lib/motion'

interface EnhancedFilterChipsProps {
  categories: ToolCategory[]
  selectedCategory: string
  onCategoryChange: (category: 'all' | ToolCategory) => void
}

// Standardized easing and timing
const EASING = {
  primary: [0.16, 1, 0.3, 1] as const,
  quick: [0.25, 0.46, 0.45, 0.94] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const
}

// Category color system with enhanced gradients
const getCategoryStyles = (category: ToolCategory) => {
  const styles = {
    'Copywriting': {
      idle: {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.2)",
        color: "rgba(147, 197, 253, 0.8)"
      },
      active: {
        backgroundColor: "rgba(59, 130, 246, 0.25)",
        borderColor: "rgba(59, 130, 246, 0.5)",
        color: "#93c5fd",
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)"
      },
      hover: {
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderColor: "rgba(59, 130, 246, 0.3)"
      }
    },
    'SEO': {
      idle: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.2)",
        color: "rgba(134, 239, 172, 0.8)"
      },
      active: {
        backgroundColor: "rgba(34, 197, 94, 0.25)",
        borderColor: "rgba(34, 197, 94, 0.5)",
        color: "#86efac",
        boxShadow: "0 0 20px rgba(34, 197, 94, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)"
      },
      hover: {
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        borderColor: "rgba(34, 197, 94, 0.3)"
      }
    },
    'Marketing': {
      idle: {
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        borderColor: "rgba(236, 72, 153, 0.2)",
        color: "rgba(249, 168, 212, 0.8)"
      },
      active: {
        backgroundColor: "rgba(236, 72, 153, 0.25)",
        borderColor: "rgba(236, 72, 153, 0.5)",
        color: "#f9a8d4",
        boxShadow: "0 0 20px rgba(236, 72, 153, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)"
      },
      hover: {
        backgroundColor: "rgba(236, 72, 153, 0.15)",
        borderColor: "rgba(236, 72, 153, 0.3)"
      }
    },
    'Design': {
      idle: {
        backgroundColor: "rgba(20, 184, 166, 0.1)",
        borderColor: "rgba(20, 184, 166, 0.2)",
        color: "rgba(94, 234, 212, 0.8)"
      },
      active: {
        backgroundColor: "rgba(20, 184, 166, 0.25)",
        borderColor: "rgba(20, 184, 166, 0.5)",
        color: "#5eead4",
        boxShadow: "0 0 20px rgba(20, 184, 166, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)"
      },
      hover: {
        backgroundColor: "rgba(20, 184, 166, 0.15)",
        borderColor: "rgba(20, 184, 166, 0.3)"
      }
    },
    'Análise': {
      idle: {
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderColor: "rgba(249, 115, 22, 0.2)",
        color: "rgba(253, 186, 116, 0.8)"
      },
      active: {
        backgroundColor: "rgba(249, 115, 22, 0.25)",
        borderColor: "rgba(249, 115, 22, 0.5)",
        color: "#fdba74",
        boxShadow: "0 0 20px rgba(249, 115, 22, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)"
      },
      hover: {
        backgroundColor: "rgba(249, 115, 22, 0.15)",
        borderColor: "rgba(249, 115, 22, 0.3)"
      }
    },
    'Imagem': {
      idle: {
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderColor: "rgba(168, 85, 247, 0.2)",
        color: "rgba(216, 180, 254, 0.8)"
      },
      active: {
        backgroundColor: "rgba(168, 85, 247, 0.25)",
        borderColor: "rgba(168, 85, 247, 0.5)",
        color: "#d8b4fe",
        boxShadow: "0 0 20px rgba(168, 85, 247, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)"
      },
      hover: {
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        borderColor: "rgba(168, 85, 247, 0.3)"
      }
    }
  }

  // Provide fallback for categories not explicitly styled (e.g., 'Negócios')
  return (styles as any)[category] || {
    idle: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.8)"
    },
    active: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderColor: "rgba(255, 255, 255, 0.4)",
      color: "#ffffff",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.2)"
    },
    hover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.2)"
    }
  }
}

export default function EnhancedFilterChips({
  categories,
  selectedCategory,
  onCategoryChange
}: EnhancedFilterChipsProps) {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Container animation for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: reducedMotion ? 0 : 0.2
      }
    }
  }

  // Individual chip animation variants
  const chipVariants = {
    hidden: {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.8,
      y: reducedMotion ? 0 : 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.2 } }).transition as any)
      }
    }
  }

  // Enhanced chip interaction variants
  const getChipAnimationVariants = (category: ToolCategory, isActive: boolean) => {
    const styles = getCategoryStyles(category)
    
    return {
      idle: {
        ...styles.idle,
        scale: 1,
        y: 0,
        transition: {
          ...(respectReducedMotion({ transition: { duration: 0.2, ease: EASING.primary } }).transition as any)
        }
      },
      hover: {
        ...styles.hover,
        scale: reducedMotion ? 1 : 1.05,
        y: reducedMotion ? 0 : -2,
        transition: {
          ...(respectReducedMotion({ transition: { duration: 0.2, ease: EASING.quick } }).transition as any)
        }
      },
      active: {
        ...styles.active,
        scale: isActive ? (reducedMotion ? 1 : 1.1) : (reducedMotion ? 1 : 1.05),
        y: isActive ? 0 : (reducedMotion ? 0 : -2),
        transition: {
          ...(respectReducedMotion({ transition: { duration: 0.2 } }).transition as any)
        }
      },
      tap: {
        scale: reducedMotion ? 1 : 0.95,
        y: 0,
        transition: {
          ...(respectReducedMotion({ transition: { duration: 0.1, ease: EASING.quick } }).transition as any)
        }
      }
    }
  }

  // Handle chip selection with enhanced feedback
  const handleChipClick = (category: ToolCategory) => {
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(40)
    }

    // Toggle category selection
    const newCategory = selectedCategory === category ? 'all' : category
    onCategoryChange(newCategory)
  }

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-6"
      variants={containerVariants as any}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category
        const chipAnimationVariants = getChipAnimationVariants(category, isActive)

        return (
          <motion.button
            key={category}
            className="px-4 py-2 text-sm rounded-full backdrop-blur-[10px] border font-medium relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            variants={chipVariants as any}
            animate={isActive ? "active" : "idle"}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleChipClick(category)}
            custom={chipAnimationVariants}
            style={{
              ...(isActive ? chipAnimationVariants.active : chipAnimationVariants.idle)
            }}
            aria-pressed={isActive}
            aria-label={`${isActive ? 'Desativar' : 'Ativar'} filtro ${category}`}
          >
            {/* Animated background overlay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={reducedMotion ? { scale: 0, opacity: 0 } : { scale: isActive ? 1 : 0, opacity: isActive ? 0.3 : 0 }}
              transition={{
                ...(respectReducedMotion({ transition: { duration: 0.2 } }).transition as any)
              }}
              style={{
                background: `radial-gradient(circle at center, ${
                  getCategoryStyles(category).active.color
                }20 0%, transparent 70%)`
              }}
            />

            {/* Ripple effect on click */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={false}
              animate={reducedMotion ? {} : (isActive ? { scale: [0, 2, 2], opacity: [0.5, 0.2, 0] } : {})}
              transition={respectReducedMotion({ transition: { duration: 0.6, ease: EASING.primary } }).transition as any}
              style={{
                background: `radial-gradient(circle at center, ${
                  getCategoryStyles(category).active.color
                }40 0%, transparent 50%)`
              }}
            />

            {/* Text with enhanced typography */}
            <motion.span
              className="relative z-10"
              animate={{
                fontWeight: isActive ? 600 : 500,
                letterSpacing: isActive ? "0.025em" : "0"
              }}
              transition={{
                duration: 0.2,
                ease: EASING.quick
              }}
            >
              {category}
            </motion.span>

            {/* Active indicator dot */}
            {isActive && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getCategoryStyles(category).active.color
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={reducedMotion ? { opacity: 1, scale: 1 } : { scale: [0, 1.2, 1], opacity: 1 }}
                transition={respectReducedMotion({ transition: { duration: 0.2 } }).transition as any}
              >
                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: getCategoryStyles(category).active.color
                  }}
                  animate={reducedMotion ? {} : { scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            )}

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={reducedMotion ? {} : { opacity: 0.6, scale: 1.1 }}
              transition={respectReducedMotion({ transition: { duration: 0.3, ease: EASING.primary } }).transition as any}
              style={{
                background: `radial-gradient(circle at center, ${
                  getCategoryStyles(category).hover.borderColor
                }30 0%, transparent 70%)`,
                filter: "blur(8px)"
              }}
            />
          </motion.button>
        )
      })}

      {/* Clear all filters option */}
      {selectedCategory !== 'all' && (
        <motion.button
          className="px-4 py-2 text-sm rounded-full backdrop-blur-[10px] font-medium text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-all duration-200 bg-white/5 hover:bg-white/10"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0, transition: { ...(respectReducedMotion({ transition: { duration: 0.2 } }).transition as any), delay: reducedMotion ? 0 : categories.length * 0.1 + 0.3 } }}
          whileHover={reducedMotion ? {} : { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)", transition: { duration: 0.2 } }}
          whileTap={reducedMotion ? {} : { scale: 0.95, transition: { duration: 0.1 } }}
          onClick={() => onCategoryChange('all')}
          aria-label="Limpar todos os filtros"
        >
          <motion.span
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            ✕ Limpar
          </motion.span>
        </motion.button>
      )}
    </motion.div>
  )
}
