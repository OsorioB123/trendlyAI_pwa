'use client'

import React, { useCallback, useEffect, useState } from 'react'
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

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    } else {
      document.removeEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, handleEscapeKey])

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
      />
      
      {/* Drawer - Mobile: Bottom sheet, Desktop: Right sidebar */}
      <div className={`
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
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Filtros Avançados</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tool Type Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">TIPO DE FERRAMENTA</h3>
            <div className="space-y-3">
              {TOOL_TYPES.map(type => (
                <label key={type.value} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={tempFilters.type.includes(type.value)}
                      onChange={() => handleToggleArrayFilter('type', type.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 transition-all duration-200
                      ${tempFilters.type.includes(type.value)
                        ? 'bg-white border-white'
                        : 'border-white/40 hover:border-white/60'
                      }
                    `}>
                      {tempFilters.type.includes(type.value) && (
                        <svg className="w-3 h-3 text-gray-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* AI Compatibility Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">COMPATIBILIDADE</h3>
            <div className="space-y-3">
              {AI_COMPATIBILITY.map(ai => (
                <label key={ai.value} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={tempFilters.compatibility.includes(ai.value)}
                      onChange={() => handleToggleArrayFilter('compatibility', ai.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 transition-all duration-200
                      ${tempFilters.compatibility.includes(ai.value)
                        ? 'bg-white border-white'
                        : 'border-white/40 hover:border-white/60'
                      }
                    `}>
                      {tempFilters.compatibility.includes(ai.value) && (
                        <svg className="w-3 h-3 text-gray-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200">
                    {ai.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">MINHA ATIVIDADE</h3>
            <div className="space-y-3">
              {ACTIVITY_OPTIONS.map(activity => (
                <label key={activity.value} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={tempFilters.activity.includes(activity.value)}
                      onChange={() => handleToggleArrayFilter('activity', activity.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 transition-all duration-200
                      ${tempFilters.activity.includes(activity.value)
                        ? 'bg-white border-white'
                        : 'border-white/40 hover:border-white/60'
                      }
                    `}>
                      {tempFilters.activity.includes(activity.value) && (
                        <svg className="w-3 h-3 text-gray-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200">
                    {activity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-3 sticky bottom-0 bg-gray-900/95 pt-4 -mx-6 px-6 pb-6 border-t border-white/10">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 transition-all duration-200 font-medium"
            >
              Limpar
            </button>
            <button
              onClick={handleApplyFilters}
              className={`
                flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${activeFiltersCount > 0 
                  ? 'bg-white/20 text-white hover:bg-white/25'
                  : 'bg-white/10 text-white/80 hover:bg-white/15'
                }
              `}
            >
              Aplicar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}