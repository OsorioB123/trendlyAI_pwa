
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { respectReducedMotion } from '@/lib/motion'

interface EnhancedSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Standardized easing functions
const EASING = {
  primary: [0.16, 1, 0.3, 1] as const,
  quick: [0.25, 0.46, 0.45, 0.94] as const,
  entrance: [0.25, 1, 0.5, 1] as const
}

export default function EnhancedSearchBar({
  value,
  onChange,
  placeholder = "Busque por objetivo, técnica ou ferramenta...",
  className = ""
}: EnhancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchIconControls = useAnimation()
  const clearButtonControls = useAnimation()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  
  // Container variants for focus states
  const containerVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(255, 255, 255, 0)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)"
    },
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.2, ease: EASING.primary } }).transition as any)
      }
    },
    typing: {
      scale: 1.02,
      boxShadow: reducedMotion ? "0 0 0 3px rgba(255, 255, 255, 0.1)" : [
        "0 0 0 3px rgba(255, 255, 255, 0.1)",
        "0 0 0 3px rgba(255, 255, 255, 0.2)",
        "0 0 0 3px rgba(255, 255, 255, 0.1)"
      ],
      borderColor: "rgba(255, 255, 255, 0.4)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: {
        boxShadow: reducedMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        scale: respectReducedMotion({ transition: { duration: 0.2, ease: EASING.primary } }).transition
      }
    }
  }

  // Search icon variants
  const searchIconVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      color: "rgba(255, 255, 255, 0.6)"
    },
    focus: {
      scale: 1.1,
      rotate: 0,
      color: "rgba(255, 255, 255, 0.8)",
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.2, ease: EASING.quick } }).transition as any)
      }
    },
    typing: {
      scale: reducedMotion ? 1.05 : [1.1, 1.2, 1.1],
      rotate: reducedMotion ? 0 : [0, 5, -5, 0],
      color: "rgba(255, 255, 255, 0.9)",
      transition: reducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: "easeInOut" }
    },
    searching: {
      rotate: reducedMotion ? 0 : 360,
      scale: 1.05,
      color: "rgba(255, 255, 255, 0.9)",
      transition: reducedMotion ? { duration: 0 } : { rotate: { duration: 1, repeat: Infinity, ease: "linear" }, scale: { duration: 0.2 } }
    }
  }

  // Clear button variants
  const clearButtonVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -90
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.2 } }).transition as any)
      }
    },
    hover: {
      scale: reducedMotion ? 1 : 1.1,
      rotate: reducedMotion ? 0 : 90,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.2, ease: EASING.quick } }).transition as any)
      }
    },
    tap: {
      scale: reducedMotion ? 1 : 0.9,
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.1 } }).transition as any)
      }
    }
  }

  // Input text animation variants
  const inputVariants = {
    idle: {
      color: "rgba(255, 255, 255, 0.8)"
    },
    focus: {
      color: "rgba(255, 255, 255, 0.95)",
      transition: {
        ...(respectReducedMotion({ transition: { duration: 0.2 } }).transition as any)
      }
    }
  }

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true)
    searchIconControls.start("focus")
  }

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false)
    setIsTyping(false)
    searchIconControls.start("idle")
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    if (newValue && !isTyping) {
      setIsTyping(true)
      searchIconControls.start("typing")
    } else if (!newValue && isTyping) {
      setIsTyping(false)
      searchIconControls.start(isFocused ? "focus" : "idle")
    }
  }

  // Handle clear
  const handleClear = () => {
    onChange("")
    setIsTyping(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
    searchIconControls.start("focus")
    
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (value) {
        handleClear()
      } else {
        inputRef.current?.blur()
      }
    }
    
    if (e.key === 'Enter') {
      // Add visual feedback for search action
      if (!reducedMotion) {
        searchIconControls.start("searching")
        setTimeout(() => {
          searchIconControls.start(isTyping ? "typing" : isFocused ? "focus" : "idle")
        }, 1000)
      }
    }
  }

  // Determine current container state
  const getCurrentContainerState = () => {
    if (isTyping && isFocused) return "typing"
    if (isFocused) return "focus"
    return "idle"
  }

  // Auto-clear animation when value changes externally
  useEffect(() => {
    if (!value && isTyping) {
      setIsTyping(false)
      searchIconControls.start(isFocused ? "focus" : "idle")
    }
  }, [value, isTyping, isFocused, searchIconControls])

  return (
    <motion.div 
      className={`relative group ${className}`}
      variants={containerVariants as any}
      animate={getCurrentContainerState()}
      whileTap={{
        scale: 0.99,
        transition: { duration: 0.1 }
      }}
    >
      {/* Search icon */}
      <motion.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none"
        variants={searchIconVariants as any}
        animate={searchIconControls}
      >
        <Search className="w-5 h-5" />
      </motion.div>

      {/* Input field */}
      <motion.input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        variants={inputVariants as any}
        animate={isFocused ? "focus" : "idle"}
        className={`
          w-full h-12 border rounded-xl py-2.5 pl-12 pr-12
          placeholder-white/50 focus:outline-none
          backdrop-blur-[10px] transition-colors duration-200
          ${isFocused ? 'placeholder-white/30' : 'placeholder-white/50'}
        `}
        style={{
          backgroundColor: "transparent",
          color: "white"
        }}
        aria-label="Buscar ferramentas"
        autoComplete="off"
        spellCheck={false}
      />

      {/* Clear button */}
      <motion.button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center"
        variants={clearButtonVariants as any}
        animate={value ? "visible" : "hidden"}
        whileHover="hover"
        whileTap="tap"
        onClick={handleClear}
        aria-label="Limpar busca"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)"
        }}
      >
        <X className="w-3 h-3 text-white/70" />
      </motion.button>

      {/* Focus ring effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isFocused 
            ? "0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.05)"
            : "0 0 0 0px rgba(255, 255, 255, 0)",
        }}
        transition={respectReducedMotion({ transition: { duration: 0.2, ease: EASING.primary } }).transition as any}
      />

      {/* Typing indicator glow */}
      {isTyping && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={reducedMotion ? { opacity: 0.3 } : {
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              "0 0 0 0px rgba(255, 255, 255, 0.1)",
              "0 0 0 2px rgba(255, 255, 255, 0.2)",
              "0 0 0 0px rgba(255, 255, 255, 0.1)"
            ]
          }}
          transition={reducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  )
}
