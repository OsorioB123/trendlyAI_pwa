'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { respectReducedMotion } from '@/lib/motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'

type Variant = 'tools' | 'tracks' | 'default'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  variant?: Variant
  totalTools?: number
  onQuickFilter?: (filter: string) => void
  resultsCount?: number
}

const QUICK_SUGGESTIONS = [
  { label: 'Copywriting', icon: '✍️', category: 'Copywriting' },
  { label: 'SEO', icon: '📈', category: 'SEO' },
  { label: 'Geração de imagem', icon: '🎨', category: 'Imagem' },
  { label: 'Análise de dados', icon: '📊', category: 'Análise' },
  { label: 'Marketing', icon: '📢', category: 'Marketing' },
  { label: 'Design', icon: '🎯', category: 'Design' }
]

const RECENT_SEARCHES = [
  'prompts para linkedin',
  'análise de concorrentes',
  'geração de logo',
  'copy para vendas'
]

export default function SearchBar({
  value,
  onChange,
  placeholder,
  className = '',
  variant = 'default',
  totalTools = 0,
  onQuickFilter,
  resultsCount,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [ariaAnnouncement, setAriaAnnouncement] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchIconControls = useAnimation()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder
    if (variant === 'tools') {
      return totalTools > 0
        ? `Busque entre ${totalTools} ferramentas...`
        : 'Busque por objetivo, técnica ou ferramenta...'
    }
    return 'Buscar...'
  }, [placeholder, variant, totalTools])

  useEffect(() => {
    // Fechar sugestões ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Anunciar mudanças de busca/resultado para tecnologias assistivas
    if (typeof resultsCount === 'number') {
      const term = value?.trim()
      if (term) {
        setAriaAnnouncement(`${resultsCount} resultados para "${term}"`)
      } else {
        setAriaAnnouncement('Digite para buscar')
      }
    }
  }, [value, resultsCount])

  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(true)
    searchIconControls.start('focus')
  }

  const handleBlur = () => {
    setIsFocused(false)
    setIsTyping(false)
    // pequeno atraso para permitir clique nas sugestões
    setTimeout(() => setShowSuggestions(false), 150)
    searchIconControls.start('idle')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    if (newValue && !isTyping) {
      setIsTyping(true)
      searchIconControls.start('typing')
    } else if (!newValue && isTyping) {
      setIsTyping(false)
      searchIconControls.start(isFocused ? 'focus' : 'idle')
    }
    setShowSuggestions(newValue.length === 0)
  }

  const handleClear = () => {
    onChange('')
    setIsTyping(false)
    inputRef.current?.focus()
    searchIconControls.start('focus')
    if ('vibrate' in navigator) navigator.vibrate(30)
    setShowSuggestions(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (value) handleClear(); else inputRef.current?.blur()
    }
    if (e.key === 'Enter' && !reducedMotion) {
      searchIconControls.start('searching')
      setTimeout(() => {
        searchIconControls.start(isTyping ? 'typing' : isFocused ? 'focus' : 'idle')
      }, 800)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleQuickFilter = (category: string) => {
    onQuickFilter?.(category)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  // Variants
  const containerVariants = {
    idle: {
      scale: 1,
      boxShadow: '0 0 0 0px rgba(255, 255, 255, 0)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    focus: {
      scale: 1.01,
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      transition: respectReducedMotion({ transition: { duration: 0.2, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' } }).transition
    },
    typing: {
      scale: 1.01,
      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      backgroundColor: 'rgba(0, 0, 0, 0.65)'
    }
  }

  const searchIconVariants = {
    idle: { scale: 1, rotate: 0, color: 'rgba(255, 255, 255, 0.6)' },
    focus: { scale: 1.06, rotate: 0, color: 'rgba(255, 255, 255, 0.85)', transition: respectReducedMotion({ transition: { duration: 0.2 } }).transition },
    typing: { scale: reducedMotion ? 1.05 : [1.08, 1.15, 1.08], rotate: reducedMotion ? 0 : [0, 5, -5, 0], color: 'rgba(255, 255, 255, 0.95)', transition: reducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
    searching: { rotate: reducedMotion ? 0 : 360, scale: 1.05, color: 'rgba(255, 255, 255, 0.95)', transition: reducedMotion ? { duration: 0 } : { rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' } } }
  }

  const currentState = isTyping && isFocused ? 'typing' : isFocused ? 'focus' : 'idle'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* aria-live announcement for SR users */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">{ariaAnnouncement}</div>

      <motion.div
        className="relative rounded-xl border transition-all duration-200"
        variants={containerVariants as any}
        animate={currentState}
        whileTap={{ scale: 0.99 }}
      >
        <motion.div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none" variants={searchIconVariants as any} animate={searchIconControls}>
          <Search className="w-5 h-5" />
        </motion.div>

        <motion.input
          ref={inputRef}
          type="text"
          placeholder={dynamicPlaceholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-12 pl-12 pr-12 bg-transparent text-white placeholder-white/50 focus:outline-none"
          aria-label="Buscar"
          autoComplete="off"
          spellCheck={false}
        />

        <AnimatePresence>
          {value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-white/10"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4 text-white/70" />
            </Button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestions Panel */}
      {showSuggestions && (isFocused || value === '') && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl z-50 shadow-2xl">
          {value === '' ? (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-white/60" />
                  <span className="text-sm font-medium text-white/80">Categorias Populares</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map(suggestion => (
                    <Badge
                      key={suggestion.category}
                      variant="secondary"
                      className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20 transition-colors"
                      onClick={() => handleQuickFilter(suggestion.category)}
                      aria-label={`Filtrar por ${suggestion.label}`}
                    >
                      <span className="mr-1">{suggestion.icon}</span>
                      {suggestion.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="text-sm font-medium text-white/80">Buscas Recentes</span>
                </div>
                <div className="space-y-1">
                  {RECENT_SEARCHES.map(search => (
                    <button
                      key={search}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <span className="text-sm text-white/60">Pressione Enter para buscar por &quot;{value}&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

