'use client'

import { type ChangeEvent, type FocusEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  { label: 'Geração de imagem', icon: '🖼️', category: 'Imagem' },
  { label: 'Análise de dados', icon: '📊', category: 'Análise' },
  { label: 'Marketing', icon: '📣', category: 'Marketing' },
  { label: 'Design', icon: '🎨', category: 'Design' }
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
  const [announcement, setAnnouncement] = useState('Digite para buscar')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const suggestionsEnabled = variant === 'tools'

  useEffect(() => {
    if (typeof resultsCount !== 'number') return
    const term = value.trim()
    if (term.length === 0) {
      setAnnouncement('Digite para buscar')
    } else {
      setAnnouncement(`${resultsCount} resultados para "${term}"`)
    }
  }, [value, resultsCount])

  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder
    if (variant === 'tools') {
      return totalTools > 0
        ? `Busque entre ${totalTools} ferramentas...`
        : 'Busque por objetivo, técnica ou ferramenta...'
    }
    return 'Buscar...'
  }, [placeholder, variant, totalTools])

  const handleFocus = () => {
    setIsFocused(true)
    if (suggestionsEnabled) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    setIsFocused(false)
    if (!suggestionsEnabled) return
    const next = event.relatedTarget as HTMLElement | null
    if (!next || !wrapperRef.current?.contains(next)) {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    onChange(nextValue)
    if (suggestionsEnabled) {
      setShowSuggestions(nextValue.length === 0 && isFocused)
    }
  }

  const handleClear = () => {
    onChange('')
    if (suggestionsEnabled) {
      setShowSuggestions(true)
    }
    inputRef.current?.focus()
  }

  const handleSuggestionSelect = (text: string) => {
    onChange(text)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleQuickFilter = (category: string) => {
    onQuickFilter?.(category)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative', className)}
      onBlur={handleBlur}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <label htmlFor="tools-search" className="sr-only">
        Buscar ferramentas
      </label>

      <div className="group relative flex items-center rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white transition-colors focus-within:border-white/30 focus-within:bg-black/60">
        <Search className="mr-3 h-4 w-4 text-white/60 group-focus-within:text-white" />
        <input
          id="tools-search"
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          type="text"
          autoComplete="off"
          role={suggestionsEnabled ? 'combobox' : undefined}
          aria-autocomplete={suggestionsEnabled ? 'list' : undefined}
          aria-controls={suggestionsEnabled ? 'tools-search-suggestions' : undefined}
          placeholder={dynamicPlaceholder}
          aria-expanded={suggestionsEnabled ? showSuggestions : undefined}
          className="h-8 w-full bg-transparent text-base outline-none placeholder:text-white/50"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {suggestionsEnabled && showSuggestions && (
        <div
          id="tools-search-suggestions"
          role="listbox"
          aria-label="Sugestões de busca"
          className="absolute left-0 right-0 top-full z-40 mt-2 origin-top rounded-2xl border border-white/10 bg-black/85 p-4 text-white shadow-lg backdrop-blur"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
            <span>Sugestões rápidas</span>
            <Badge variant="outline" className="border-white/20 text-white/70">
              Ferramentas
            </Badge>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion.category}
                type="button"
                variant="secondary"
                onClick={() => handleQuickFilter(suggestion.category)}
                className="h-9 rounded-full border border-white/15 bg-white/10 px-3 text-sm text-white transition hover:border-white/25 hover:bg-white/15"
              >
                <span className="mr-1" aria-hidden>
                  {suggestion.icon}
                </span>
                {suggestion.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
              <TrendingUp className="h-4 w-4" />
              <span>Buscas recentes</span>
            </div>
            <ul className="space-y-1" role="presentation">
              {RECENT_SEARCHES.map((recent) => (
                <li key={recent}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionSelect(recent)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Clock className="h-3.5 w-3.5 text-white/40" aria-hidden />
                    <span>{recent}</span>
                  </button>
                </li>
              ))}
              {RECENT_SEARCHES.length === 0 && (
                <li className="px-3 py-2 text-sm text-white/60">
                  Nenhuma busca recente.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
