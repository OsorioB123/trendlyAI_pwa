'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { X, Filter, Search, Tag, Zap } from 'lucide-react'
import { ToolsFilters, ToolCategory } from '../../types/tool'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface ToolsFiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ToolsFilters
  onFiltersChange: (filters: Partial<ToolsFilters>) => void
  categories?: ToolCategory[]
}

// Opções de filtros expandidas
const ACTIVITY_OPTIONS = [
  { value: 'isFavorite' as const, label: 'Meus Favoritos', icon: '❤️' },
  { value: 'isEdited' as const, label: 'Editados por mim', icon: '✏️' }
]

const TOOL_TYPES = [
  { value: 'text-generation' as const, label: 'Geração de Texto', icon: '📝' },
  { value: 'image-generation' as const, label: 'Geração de Imagem', icon: '🎨' },
  { value: 'code-generation' as const, label: 'Geração de Código', icon: '💻' },
  { value: 'data-analysis' as const, label: 'Análise de Dados', icon: '📊' },
  { value: 'automation' as const, label: 'Automação', icon: '🤖' },
  { value: 'optimization' as const, label: 'Otimização', icon: '⚡' }
]

const AI_COMPATIBILITY = [
  { value: 'chatgpt' as const, label: 'ChatGPT', icon: '🤖' },
  { value: 'claude' as const, label: 'Claude', icon: '🧠' },
  { value: 'gemini' as const, label: 'Gemini', icon: '💎' },
  { value: 'midjourney' as const, label: 'Midjourney', icon: '🎨' },
  { value: 'dalle' as const, label: 'DALL-E', icon: '🖼️' },
  { value: 'stable-diffusion' as const, label: 'Stable Diffusion', icon: '🎭' }
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

  const handleToggleArrayFilter = useCallback(<K extends keyof Pick<ToolsFilters, 'activity' | 'type' | 'compatibility'>>(
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
      category: 'all', // reseta categoria
      sort: 'relevance', // reseta para relevância
      type: [], // limpa tipos
      compatibility: [], // limpa compatibilidade
      activity: [] // limpa atividade
    }
    setTempFilters(clearedFilters)
  }, [filters.search])

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
  const activeFiltersCount = (tempFilters.category !== 'all' ? 1 : 0) +
    tempFilters.activity.length +
    tempFilters.type.length +
    tempFilters.compatibility.length

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
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 id="drawer-title" className="text-2xl font-semibold text-white">
                  Filtros Avançados
                </h2>
                <p id="drawer-description" className="text-white/70 text-sm mt-1">
                  Refine sua busca por ferramentas de IA
                </p>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
                    {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} ativo{activeFiltersCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              ref={firstFocusableRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-full bg-black hover:bg-black/80 text-white"
              aria-label="Fechar painel de filtros"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Categoria */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Categoria
              </Label>
              <Select
                value={tempFilters.category}
                onValueChange={(value) => setTempFilters(prev => ({ ...prev, category: value as any }))}
              >
                <SelectTrigger className="w-full bg-black/50 border-white/20 text-white focus:ring-white/30">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">
                    Todas as Categorias
                  </SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-white/10" />

            {/* Ordenação */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white flex items-center gap-2">
                <Search className="w-4 h-4" />
                Ordenar por
              </Label>
              <Select
                value={tempFilters.sort}
                onValueChange={(value) => setTempFilters(prev => ({ ...prev, sort: value as any }))}
              >
                <SelectTrigger className="w-full bg-black/50 border-white/20 text-white focus:ring-white/30">
                  <SelectValue placeholder="Selecione a ordenação" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="relevance" className="text-white hover:bg-white/10">
                    Mais Relevantes
                  </SelectItem>
                  <SelectItem value="recent" className="text-white hover:bg-white/10">
                    Mais Recentes
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-white/10" />

            {/* Tipo de Ferramenta */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Tipo de Ferramenta
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {TOOL_TYPES.map(type => (
                  <div key={type.value} className="flex items-center space-x-2 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors">
                    <Checkbox
                      id={type.value}
                      checked={tempFilters.type.includes(type.value)}
                      onCheckedChange={() => handleToggleArrayFilter('type', type.value)}
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label htmlFor={type.value} className="text-sm text-white/90 cursor-pointer flex items-center gap-2 flex-1">
                      <span>{type.icon}</span>
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Compatibilidade IA */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white flex items-center gap-2">
                🤖 Compatibilidade IA
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {AI_COMPATIBILITY.map(ai => (
                  <div key={ai.value} className="flex items-center space-x-2 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors">
                    <Checkbox
                      id={ai.value}
                      checked={tempFilters.compatibility.includes(ai.value)}
                      onCheckedChange={() => handleToggleArrayFilter('compatibility', ai.value)}
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label htmlFor={ai.value} className="text-sm text-white/90 cursor-pointer flex items-center gap-2 flex-1">
                      <span>{ai.icon}</span>
                      {ai.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Minha Atividade */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white flex items-center gap-2">
                ❤️ Minha Atividade
              </Label>
              <div className="space-y-2">
                {ACTIVITY_OPTIONS.map(activity => (
                  <div key={activity.value} className="flex items-center space-x-2 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors">
                    <Checkbox
                      id={activity.value}
                      checked={tempFilters.activity.includes(activity.value)}
                      onCheckedChange={() => handleToggleArrayFilter('activity', activity.value)}
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label htmlFor={activity.value} className="text-sm text-white/90 cursor-pointer flex items-center gap-2 flex-1">
                      <span>{activity.icon}</span>
                      {activity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex gap-3 sticky bottom-0 bg-black pt-6 -mx-6 px-6 pb-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1 min-h-[48px] bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/30"
            >
              Limpar Filtros
            </Button>
            <Button
              ref={lastFocusableRef}
              onClick={handleApplyFilters}
              className={`
                flex-1 min-h-[48px] font-medium transition-all duration-200
                ${activeFiltersCount > 0
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
              aria-describedby="apply-button-description"
            >
              Aplicar Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
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
