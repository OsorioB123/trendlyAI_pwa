'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TracksFilters } from '../../types/track'

interface FiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: TracksFilters
  onFiltersChange: (filters: Partial<TracksFilters>) => void
  availableCategories?: string[]
}

const LEVELS = ['Iniciante', 'Intermediário', 'Avançado']
const STATUS_OPTIONS = [
  { value: 'nao_iniciado', label: 'Não iniciado' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido', label: 'Concluído' }
]

const ALL_CATEGORIES = [
  'Narrativa', 'Storytelling', 'Análise', 'Tendências', 'Design', 'Visual', 
  'Marketing', 'Influência', 'SEO', 'Otimização', 'Vídeo', 'Redes Sociais', 
  'Estratégia', 'Engajamento', 'Métricas', 'Copywriting', 'Persuasão'
]

export default function FiltersDrawer({ isOpen, onClose, filters, onFiltersChange, availableCategories = ALL_CATEGORIES }: FiltersDrawerProps) {
  const [tempFilters, setTempFilters] = useState<TracksFilters>(filters)

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

  const handleToggleArrayFilter = useCallback(<K extends keyof Pick<TracksFilters, 'categories' | 'levels' | 'status'>>(
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
    const clearedFilters: TracksFilters = {
      search: filters.search, // Keep search
      categories: [],
      levels: [],
      status: [],
      sort: filters.sort // Keep sort
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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
        style={{ opacity: isOpen ? 1 : 0 }}
      />
      
      {/* Drawer - Mobile: Bottom sheet, Desktop: Right sidebar */}
      <div className={`
        fixed z-50 
        lg:top-0 lg:right-0 lg:h-full lg:w-full lg:max-w-md 
        bottom-0 left-0 right-0 max-h-[85vh]
        bg-gray-900/95 backdrop-blur-[20px] overflow-y-auto
        transform transition-transform duration-300 ease-out
        ${isOpen 
          ? 'translate-y-0 lg:translate-x-0' 
          : 'translate-y-full lg:translate-x-full'
        }
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Filtros</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Fechar filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Levels Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">NÍVEL</h3>
            <div className="space-y-3">
              {LEVELS.map(level => (
                <label key={level} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={tempFilters.levels.includes(level)}
                      onChange={() => handleToggleArrayFilter('levels', level)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded transition-all duration-200
                      ${tempFilters.levels.includes(level)
                        ? 'bg-white'
                        : 'bg-white/10 group-hover:bg-white/20'
                      }
                    `}>
                      {tempFilters.levels.includes(level) && (
                        <svg className="w-3 h-3 text-gray-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">STATUS</h3>
            <div className="space-y-3">
              {STATUS_OPTIONS.map(status => (
                <label key={status.value} className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={tempFilters.status.includes(status.value)}
                      onChange={() => handleToggleArrayFilter('status', status.value)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded transition-all duration-200
                      ${tempFilters.status.includes(status.value)
                        ? 'bg-white'
                        : 'bg-white/10 group-hover:bg-white/20'
                      }
                    `}>
                      {tempFilters.status.includes(status.value) && (
                        <svg className="w-3 h-3 text-gray-900 absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-white group-hover:text-white/80 transition-colors duration-200">
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">CATEGORIAS</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleToggleArrayFilter('categories', category)}
                  className={`
                    filter-chip p-3 rounded-lg text-sm text-left transition-all duration-200
                    ${tempFilters.categories.includes(category)
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-3 sticky bottom-0 bg-gray-900/95 pt-4 -mx-6 px-6 pb-6">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-all duration-200 font-medium"
            >
              Limpar
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white hover:bg-white/25 transition-all duration-200 font-medium"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
