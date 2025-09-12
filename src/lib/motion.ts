// Unified Motion Constants for TrendlyAI Platform
// Centralizes all animation configurations and easing functions

export const MOTION_CONSTANTS = {
  // Spring Physics Configuration
  SPRING: {
    stiff: { stiffness: 400, damping: 25 },
    smooth: { stiffness: 300, damping: 30 },
    bouncy: { stiffness: 500, damping: 20 },
    gentle: { stiffness: 200, damping: 40 }
  },

  // Duration Standards
  DURATION: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    glacial: 1.0
  },

  // Easing Functions
  EASING: {
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    linear: 'linear'
  },

  // Common Animation Variants
  VARIANTS: {
    // Fade animations
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },

    // Scale animations  
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    },

    // Slide animations
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 }
    },

    slideDown: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 20, opacity: 0 }
    },

    // Stagger children
    staggerContainer: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },

    staggerItem: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 }
    },

    // Interactive states
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    },

    tap: {
      scale: 0.95,
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
  }
}

// Utility Functions
export const createStaggerAnimation = (delay: number = 0.1) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: delay,
      delayChildren: delay
    }
  }
})

export const createSlideAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const directions = {
    up: { initial: { y: 20 }, animate: { y: 0 }, exit: { y: -20 } },
    down: { initial: { y: -20 }, animate: { y: 0 }, exit: { y: 20 } },
    left: { initial: { x: 20 }, animate: { x: 0 }, exit: { x: -20 } },
    right: { initial: { x: -20 }, animate: { x: 0 }, exit: { x: 20 } }
  }
  
  return {
    ...directions[direction],
    initial: { ...directions[direction].initial, opacity: 0 },
    animate: { ...directions[direction].animate, opacity: 1 },
    exit: { ...directions[direction].exit, opacity: 0 }
  }
}

// Reduced Motion Support
export const respectReducedMotion = (animation: any) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      ...animation,
      transition: { duration: 0 }
    }
  }
  return animation
}