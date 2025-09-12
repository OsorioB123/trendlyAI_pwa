'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { X } from 'lucide-react'
import { ToolsFilters, ToolType, AICompatibility } from '../../types/tool'

interface ToolsFiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ToolsFilters
  onFiltersChange: (filters: Partial<ToolsFilters>) => void
}

// Filter options based on HTML reference and UX research
const TOOL_TYPES: { value: ToolType; label: string }[] = [
  { value: 'text-generation', label: 'Geração de Texto' },
  { value: 'image-generation', label: 'Geração de Imagem' },
  { value: 'data-analysis', label: 'Análise de Dados' },
  { value: 'research', label: 'Pesquisa' }
]

const AI_COMPATIBILITY: { value: AICompatibility; label: string }[] = [
  { value: 'ChatGPT', label: 'Otimizado para ChatGPT' },
  { value: 'Claude', label: 'Otimizado para Claude' },
  { value: 'Gemini', label: 'Otimizado para Gemini' },
  { value: 'Midjourney', label: 'Otimizado para Midjourney' },
  { value: 'DALL-E', label: 'Otimizado para DALL-E' },
  { value: 'Stable Diffusion', label: 'Otimizado para Stable Diffusion' }
]

const ACTIVITY_OPTIONS = [
  { value: 'isFavorite' as const, label: 'Meus Favoritos' },
  { value: 'isEdited' as const, label: 'Editados por mim' }
]

export default function ToolsFiltersDrawer({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: ToolsFiltersDrawerProps) {
  const [tempFilters, setTempFilters] = useState<ToolsFilters>(filters)
  const drawerRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const lastFocusableRef = useRef<HTMLButtonElement>(null)

  // Update temp filters when props change
  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus management and keyboard trap
  useEffect(() => {
    if (isOpen) {
      // Focus the first focusable element when drawer opens
      setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 100)

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
          return
        }

        if (e.key === 'Tab') {
          // Trap focus within drawer
          const focusableElements = drawerRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>
          
          if (!focusableElements || focusableElements.length === 0) return

          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement.focus()
            }
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleToggleArrayFilter = useCallback(<K extends keyof Pick<ToolsFilters, 'type' | 'compatibility' | 'activity'>>(
    key: K,
    value: string
  ) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }))
  }, [])

  const handleClearFilters = useCallback(() => {
    const clearedFilters: ToolsFilters = {
      search: filters.search, // Keep search
      category: 'all', // Reset category
      sort: filters.sort, // Keep sort
      type: [],
      compatibility: [],
      activity: []
    }
    setTempFilters(clearedFilters)
  }, [filters.search, filters.sort])

  const handleApplyFilters = useCallback(() => {
    onFiltersChange(tempFilters)
    onClose()
  }, [tempFilters, onFiltersChange, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Count active filters
  const activeFiltersCount = tempFilters.type.length + tempFilters.compatibility.length + tempFilters.activity.length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
        style={{ opacity: isOpen ? 1 : 0 }}
        aria-hidden="true"
      />
      
      {/* Drawer - Mobile: Bottom sheet, Desktop: Right sidebar */}
      <div 
        ref={drawerRef}
        className={`
          fixed z-50 
          lg:top-0 lg:right-0 lg:h-full lg:w-full lg:max-w-md 
          bottom-0 left-0 right-0 max-h-[85vh]
          bg-gray-900/95 backdrop-blur-[20px] border-white/15 overflow-y-auto
          lg:border-l border-t lg:border-t-0
          transform transition-transform duration-300 ease-out
          ${isOpen 
            ? 'translate-y-0 lg:translate-x-0' 
            : 'translate-y-full lg:translate-x-full'
          }
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-description"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 id="drawer-title" className="text-2xl font-semibold text-white">
                Filtros Avançados
              </h2>
              <p id="drawer-description" className="text-white/70 text-sm mt-1">
                Refine sua busca por ferramentas de IA
              </p>
            </div>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Fechar painel de filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tool Type Section */}
          <fieldset className="mb-8">
            <legend className="text-lg font-medium text-white mb-4">TIPO DE FERRAMENTA</legend>
            <div className="space-y-3" role="group" aria-labelledby="tool-type-legend">
              {TOOL_TYPES.map(type => (
                <label key={type.value} className="flex items-center cursor-pointer group min-h-[44px]">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={tempFilters.type.includes(type.value)}
                      onChange={() => handleToggleArrayFilter('type', type.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center
                      ${tempFilters.type.includes(type.value)
                        ? 'bg-white border-white'
                        : 'border-white/40 hover:border-white/60 group-focus-within:border-white'
                      }
                    `}>
                      {tempFilters.type.includes(type.value) && (
                        <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200 flex-1 py-2">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* AI Compatibility Section */}
          <fieldset className="mb-8">
            <legend className="text-lg font-medium text-white mb-4">COMPATIBILIDADE</legend>
            <div className="space-y-3" role="group" aria-labelledby="compatibility-legend">
              {AI_COMPATIBILITY.map(ai => (
                <label key={ai.value} className="flex items-center cursor-pointer group min-h-[44px]">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={tempFilters.compatibility.includes(ai.value)}
                      onChange={() => handleToggleArrayFilter('compatibility', ai.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center
                      ${tempFilters.compatibility.includes(ai.value)
                        ? 'bg-white border-white'
                        : 'border-white/40 hover:border-white/60 group-focus-within:border-white'
                      }
                    `}>
                      {tempFilters.compatibility.includes(ai.value) && (
                        <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200 flex-1 py-2">
                    {ai.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Activity Section */}
          <fieldset className="mb-8">
            <legend className="text-lg font-medium text-white mb-4">MINHA ATIVIDADE</legend>
            <div className="space-y-3" role="group" aria-labelledby="activity-legend">
              {ACTIVITY_OPTIONS.map(activity => (
                <label key={activity.value} className="flex items-center cursor-pointer group min-h-[44px]">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={tempFilters.activity.includes(activity.value)}
                      onChange={() => handleToggleArrayFilter('activity', activity.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center
                      ${tempFilters.activity.includes(activity.value)
                        ? 'bg-white border-white'
                        : 'border-white/40 hover:border-white/60 group-focus-within:border-white'
                      }
                    `}>
                      {tempFilters.activity.includes(activity.value) && (
                        <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200 flex-1 py-2">
                    {activity.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Actions Footer */}
          <div className="flex gap-3 sticky bottom-0 bg-gray-900/95 pt-4 -mx-6 px-6 pb-6 border-t border-white/10">
            <button
              onClick={handleClearFilters}
              className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Limpar
            </button>
            <button
              ref={lastFocusableRef}
              onClick={handleApplyFilters}
              className={`
                flex-1 min-h-[48px] px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
                ${activeFiltersCount > 0 
                  ? 'bg-white/20 text-white hover:bg-white/25'
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
                }
              `}
              aria-describedby="apply-button-description"
            >
              Aplicar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            <div id="apply-button-description" className="sr-only">
              {activeFiltersCount > 0 
                ? `Aplicar ${activeFiltersCount} filtros selecionados`
                : 'Nenhum filtro selecionado'
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}