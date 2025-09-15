'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { X } from 'lucide-react'
import { ToolsFilters, ToolCategory } from '../../types/tool'

interface ToolsFiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ToolsFilters
  onFiltersChange: (filters: Partial<ToolsFilters>) => void
  categories?: ToolCategory[]
}

// Somente filtros compatíveis: favoritos e ordenação
const ACTIVITY_OPTIONS = [
  { value: 'isFavorite' as const, label: 'Meus Favoritos' }
]

export default function ToolsFiltersDrawer({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  categories = []
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

  const handleToggleArrayFilter = useCallback(<K extends keyof Pick<ToolsFilters, 'activity'>>(
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
      search: filters.search, // mantém busca
      category: filters.category, // não altera categoria aqui
      sort: filters.sort, // mantém ordenação
      type: [], // removido do UI
      compatibility: [], // removido do UI
      activity: [] // limpa atividade
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
  const activeFiltersCount = (tempFilters.category !== 'all' ? 1 : 0) + tempFilters.activity.length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300"
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
          bg-black overflow-y-auto
          border border-white/20 lg:border-l lg:border-t-0
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
              className="min-w-[44px] min-h-[44px] rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:border-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Fechar painel de filtros"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categoria */}
          <fieldset className="mb-8">
            <legend className="text-lg font-medium text-white mb-4">CATEGORIA</legend>
            <div className="space-y-3">
              <select
                value={tempFilters.category}
                onChange={(e) => setTempFilters(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full h-12 px-4 text-white bg-black border border-white/20 rounded-xl appearance-none focus:outline-none focus:border-white/40"
              >
                <option value="all" className="bg-black">Todas as Categorias</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-black">{cat}</option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Ordenação */}
          <fieldset className="mb-8">
            <legend className="text-lg font-medium text-white mb-4">ORDENAR POR</legend>
            <div className="space-y-3" role="group" aria-labelledby="sort-legend">
              <select
                value={tempFilters.sort}
                onChange={(e) => setTempFilters(prev => ({ ...prev, sort: e.target.value as any }))}
                className="w-full h-12 px-4 text-white bg-black border border-white/20 rounded-xl appearance-none focus:outline-none focus:border-white/40"
              >
                <option value="relevance" className="bg-black">Mais Relevantes</option>
                <option value="recent" className="bg-black">Mais Recentes</option>
              </select>
            </div>
          </fieldset>

          {/* Minha Atividade */}
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
          <div className="flex gap-3 sticky bottom-0 bg-black pt-4 -mx-6 px-6 pb-6 border-t border-white/20">
            <button
              onClick={handleClearFilters}
              className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-black text-white/80 border border-white/20 hover:border-white/40 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Limpar
            </button>
            <button
              ref={lastFocusableRef}
              onClick={handleApplyFilters}
              className={`
                flex-1 min-h-[48px] px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20
                ${activeFiltersCount > 0 
                  ? 'bg-black text-white border border-white/40 hover:border-white/60'
                  : 'bg-black text-white/80 border border-white/20 hover:border-white/30'
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
