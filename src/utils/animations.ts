/**
 * TrendlyAI Animation System
 * Centralized animation configurations for consistent micro-interactions
 */

// Standardized easing functions
export const EASING = {
  // Primary easing for most interactions - smooth and premium feel
  primary: [0.16, 1, 0.3, 1] as const,
  
  // Quick interactions (buttons, toggles) - snappy and responsive
  quick: [0.25, 0.46, 0.45, 0.94] as const,
  
  // Smooth entrances - elegant and welcoming
  entrance: [0.25, 1, 0.5, 1] as const,
  
  // Bouncy interactions - playful and engaging
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Sharp interactions - precise and mechanical
  sharp: [0.4, 0, 0.2, 1] as const,
  
  // Gentle interactions - subtle and refined
  gentle: [0.25, 0.8, 0.25, 1] as const
} as const

// Standardized spring physics configurations
export const SPRING = {
  // Gentle spring - smooth organic movement
  gentle: { damping: 25, stiffness: 300, mass: 0.8 },
  
  // Bouncy spring - playful with slight overshoot
  bouncy: { damping: 15, stiffness: 400, mass: 0.5 },
  
  // Tight spring - precise control with quick settling
  tight: { damping: 30, stiffness: 500, mass: 0.6 },
  
  // Snappy spring - fast response for buttons
  snappy: { damping: 20, stiffness: 600, mass: 0.4 },
  
  // Wobbly spring - dramatic effect for emphasis
  wobbly: { damping: 10, stiffness: 300, mass: 0.8 }
} as const

// Duration standards (in seconds)
export const DURATION = {
  // Micro-interactions - immediate feedback
  instant: 0.1,
  micro: 0.15,
  quick: 0.2,
  
  // Standard interactions - balanced feel
  fast: 0.3,
  normal: 0.4,
  medium: 0.5,
  
  // Longer animations - dramatic effects
  slow: 0.6,
  slower: 0.8,
  slowest: 1.0,
  
  // Special timing for specific effects
  heartbeat: 0.6,
  breathe: 2.0,
  shimmer: 2.5
} as const

// Stagger timing for sequential animations
export const STAGGER = {
  // Very quick succession
  tight: 0.05,
  
  // Standard stagger timing
  normal: 0.1,
  
  // More dramatic reveals
  loose: 0.15,
  
  // Slow reveals for emphasis
  dramatic: 0.2
} as const

// Common animation variants
export const VARIANTS = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: DURATION.normal, ease: EASING.primary }
    }
  },
  
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATION.medium, ease: EASING.entrance }
    }
  },
  
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATION.medium, ease: EASING.entrance }
    }
  },
  
  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: DURATION.medium, 
        ease: EASING.bounce 
      }
    }
  },
  
  // Slide animations
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: DURATION.medium, ease: EASING.primary }
    }
  },
  
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: DURATION.medium, ease: EASING.primary }
    }
  },
  
  // Hover states
  hoverLift: {
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: DURATION.fast, ease: EASING.primary }
    }
  },
  
  hoverGrow: {
    hover: {
      scale: 1.05,
      transition: { duration: DURATION.quick, ease: EASING.quick }
    }
  },
  
  // Loading states
  pulse: {
    loading: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: DURATION.breathe,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  spin: {
    loading: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  
  // Success states
  success: {
    success: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, 0],
      transition: {
        duration: DURATION.heartbeat,
        ease: EASING.bounce
      }
    }
  }
} as const

// Page transition variants
export const PAGE_TRANSITIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: DURATION.medium,
        ease: EASING.primary,
        staggerChildren: STAGGER.normal,
        delayChildren: DURATION.quick
      }
    }
  },
  
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.medium,
        ease: EASING.entrance
      }
    }
  }
} as const

// Tool card specific animations
export const TOOL_CARD = {
  container: {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: DURATION.medium,
        ease: EASING.entrance,
        staggerChildren: STAGGER.normal
      }
    },
    hover: {
      y: -12,
      scale: 1.03,
      transition: {
        duration: DURATION.fast,
        ease: EASING.primary
      }
    },
    tap: {
      scale: 0.98,
      transition: { 
        duration: DURATION.instant,
        ease: EASING.quick 
      }
    }
  },
  
  favorite: {
    idle: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: DURATION.fast }
    },
    success: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, 0],
      transition: {
        duration: DURATION.heartbeat,
        ease: EASING.bounce
      }
    }
  }
} as const

// Search bar animations
export const SEARCH_BAR = {
  container: {
    idle: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(255, 255, 255, 0)"
    },
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.1)",
      transition: {
        duration: DURATION.quick,
        ease: EASING.primary
      }
    },
    typing: {
      boxShadow: [
        "0 0 0 3px rgba(255, 255, 255, 0.1)",
        "0 0 0 3px rgba(255, 255, 255, 0.2)",
        "0 0 0 3px rgba(255, 255, 255, 0.1)"
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  icon: {
    idle: { scale: 1, rotate: 0 },
    focus: { scale: 1.1 },
    typing: {
      scale: [1.1, 1.2, 1.1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
} as const

// Filter chip animations
export const FILTER_CHIP = {
  inactive: {
    scale: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)"
  },
  active: {
    scale: 1.05,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    transition: {
      type: "spring",
      ...SPRING.bouncy
    }
  },
  hover: {
    y: -2,
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
    transition: { duration: DURATION.quick }
  }
} as const

// Drawer animations
export const DRAWER = {
  backdrop: {
    closed: { opacity: 0 },
    open: { 
      opacity: 1,
      transition: { duration: DURATION.fast, ease: EASING.primary }
    }
  },
  
  panel: {
    closed: {
      x: "100%", // Desktop: slide from right
      y: "100%", // Mobile: slide from bottom
      opacity: 0,
      scale: 0.95
    },
    open: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        ...SPRING.gentle
      }
    }
  }
} as const

// Utility functions for animation helpers
export const withStagger = (stagger: number = STAGGER.normal) => ({
  staggerChildren: stagger,
  delayChildren: DURATION.quick
})

export const withDelay = (delay: number) => ({
  delay,
  duration: DURATION.normal,
  ease: EASING.primary
})

export const withSpring = (springType: keyof typeof SPRING = 'gentle') => ({
  type: "spring" as const,
  ...SPRING[springType]
})

export const withBounce = {
  type: "spring" as const,
  ...SPRING.bouncy
}

// Media query animations for reduced motion
export const REDUCED_MOTION = {
  // Simplified animations for accessibility
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } }
  },
  
  scaleIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.1 } }
  }
} as const

// Export convenience function to check reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Animation preset combinations
export const PRESETS = {
  // Card entrance with stagger
  cardGrid: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: withStagger(STAGGER.normal)
      }
    },
    item: VARIANTS.fadeInUp
  },
  
  // Button with premium feel
  premiumButton: {
    idle: {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
    },
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
      transition: {
        duration: DURATION.quick,
        ease: EASING.primary
      }
    },
    tap: {
      scale: 0.95,
      transition: { duration: DURATION.instant }
    }
  },
  
  // Loading sequence
  loading: {
    container: {
      loading: {
        transition: withStagger(STAGGER.tight)
      }
    },
    item: VARIANTS.pulse
  }
} as const