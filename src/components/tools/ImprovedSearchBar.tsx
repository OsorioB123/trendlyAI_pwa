'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"

interface ImprovedSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  totalTools?: number
  onQuickFilter?: (filter: string) => void
}

// Sugestões populares baseadas em categorias
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

export default function ImprovedSearchBar({
  value,
  onChange,
  placeholder,
  className = "",
  totalTools = 0,
  onQuickFilter
}: ImprovedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Placeholder dinâmico baseado no contexto
  const dynamicPlaceholder = placeholder ||
    (totalTools > 0
      ? `Busque entre ${totalTools} ferramentas...`
      : "Busque por objetivo, técnica ou ferramenta..."
    )

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay para permitir cliques nas sugestões
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(newValue.length === 0) // Mostra sugestões quando vazio
  }

  const handleClear = () => {
    onChange("")
    inputRef.current?.focus()
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleQuickFilter = (category: string) => {
    if (onQuickFilter) {
      onQuickFilter(category)
    }
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (value) {
        handleClear()
      } else {
        inputRef.current?.blur()
      }
    }
  }

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {/* Input principal */}
      <div className={`
        relative rounded-xl border transition-all duration-200
        ${isFocused
          ? 'border-white/30 bg-black/70 shadow-lg'
          : 'border-white/10 bg-black/50 hover:bg-black/60'
        }
      `}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          placeholder={dynamicPlaceholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-12 pl-12 pr-12 bg-transparent text-white placeholder-white/50 focus:outline-none"
          aria-label="Buscar ferramentas"
          autoComplete="off"
          spellCheck={false}
        />

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
      </div>

      {/* Sugestões de busca */}
      {showSuggestions && (isFocused || value === '') && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl z-50 shadow-2xl">
          {value === '' ? (
            <>
              {/* Filtros rápidos */}
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
                    >
                      <span className="mr-1">{suggestion.icon}</span>
                      {suggestion.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Buscas recentes */}
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
            /* Sugestões baseadas no que está sendo digitado */
            <div>
              <span className="text-sm text-white/60">
                Pressione Enter para buscar por "{value}"
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}