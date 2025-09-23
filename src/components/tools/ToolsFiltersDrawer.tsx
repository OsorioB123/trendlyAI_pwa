'use client'

import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { X, Filter, Tag } from 'lucide-react'
import { ToolsFilters, ToolCategory, ToolType, AICompatibility } from '../../types/tool'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface ToolsFiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ToolsFilters
  onFiltersChange: (filters: Partial<ToolsFilters>) => void
  categories?: ToolCategory[]
}

const SORT_OPTIONS: Array<{ value: ToolsFilters['sort']; label: string; description: string }> = [
  {
    value: 'relevance',
    label: 'Mais relevantes',
    description: 'OrdenaÃƒÂ§ÃƒÂ£o considerando favoritos e ordem alfabÃƒÂ©tica.'
  },
  {
    value: 'recent',
    label: 'Atualizadas recentemente',
    description: 'Mostra primeiro ferramentas atualizadas nos ÃƒÂºltimos dias.'
  }
]

const TOOL_TYPE_LABELS: Record<ToolType, string> = {
  'text-generation': 'GeraÃƒÂ§ÃƒÂ£o de texto',
  'image-generation': 'GeraÃƒÂ§ÃƒÂ£o de imagem',
  'code-generation': 'GeraÃƒÂ§ÃƒÂ£o de cÃƒÂ³digo',
  'data-analysis': 'AnÃƒÂ¡lise de dados',
  'automation': 'AutomaÃƒÂ§ÃƒÂ£o',
  'optimization': 'OtimizaÃƒÂ§ÃƒÂ£o',
  research: 'Pesquisa'
}

const COMPATIBILITY_LABELS: Record<AICompatibility, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  midjourney: 'Midjourney',
  dalle: 'DALLÃ‚Â·E',
  'stable-diffusion': 'Stable Diffusion'
}

const ACTIVITY_OPTIONS: Array<{ value: ToolsFilters['activity'][number]; label: string; helper: string }> = [
  {
    value: 'isFavorite',
    label: 'Meus favoritos',
    helper: 'Mostra somente ferramentas marcadas com estrela.'
  },
  {
    value: 'isEdited',
    label: 'Editados por mim',
    helper: 'Exibe ferramentas personalizadas ou alteradas manualmente.'
  }
]

const TOOL_TYPES: Array<{ value: ToolType; helper: string }> = [
  { value: 'text-generation', helper: 'Copy, roteiros, narrativas e estruturaÃƒÂ§ÃƒÂ£o de prompts.' },
  { value: 'image-generation', helper: 'GeraÃƒÂ§ÃƒÂ£o e ediÃƒÂ§ÃƒÂ£o de imagens com IA generativa.' },
  { value: 'code-generation', helper: 'Suporte para cÃƒÂ³digo, snippets e automaÃƒÂ§ÃƒÂµes.' },
  { value: 'data-analysis', helper: 'AnÃƒÂ¡lises, dashboards e relatÃƒÂ³rios com IA.' },
  { value: 'automation', helper: 'IntegraÃƒÂ§ÃƒÂµes, fluxos e agentes automatizados.' },
  { value: 'optimization', helper: 'Melhorias contÃƒÂ­nuas, testes A/B e ajustes finos.' },
  { value: 'research', helper: 'Pesquisa, curadoria de conteÃƒÂºdo e descoberta.' }
]

const COMPATIBILITY_OPTIONS: Array<{ value: AICompatibility; helper: string }> = [
  { value: 'chatgpt', helper: 'CompatÃƒÂ­vel com GPT-4, GPT-4o e variaÃƒÂ§ÃƒÂµes.' },
  { value: 'claude', helper: 'Funciona com Claude 3 e Claude 3.5.' },
  { value: 'gemini', helper: 'Para produtos da famÃƒÂ­lia Google Gemini.' },
  { value: 'midjourney', helper: 'Fluxos usando Midjourney para imagens.' },
  { value: 'dalle', helper: 'Suporte a DALLÃ‚Â·E e Image API da OpenAI.' },
  { value: 'stable-diffusion', helper: 'CompatÃƒÂ­vel com SDXL ou variantes open source.' }
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

  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  const setFilterValue = useCallback(<K extends keyof ToolsFilters>(key: K, value: ToolsFilters[K]) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleFilterValue = useCallback(<K extends keyof Pick<ToolsFilters, 'activity' | 'type' | 'compatibility'>>(key: K, value: string) => {
    setTempFilters((prev) => {
      const current = prev[key] as string[]
      const exists = current.includes(value)
      return {
        ...prev,
        [key]: exists ? current.filter((item) => item !== value) : [...current, value]
      }
    })
  }, [])

  const handleClearFilters = useCallback(() => {
    setTempFilters({
      search: filters.search,
      category: 'all',
      sort: 'relevance',
      type: [],
      compatibility: [],
      activity: []
    })
  }, [filters.search])

  const handleApplyFilters = useCallback(() => {
    onFiltersChange(tempFilters)
    onClose()
  }, [tempFilters, onFiltersChange, onClose])

  const activeChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; onRemove: () => void }> = []

    if (tempFilters.category !== 'all') {
      chips.push({
        id: 'category',
        label: `Categoria: ${tempFilters.category}`,
        onRemove: () => setFilterValue('category', 'all')
      })
    }

    tempFilters.type.forEach((type) => {
      chips.push({
        id: 'type-' + type,
        label: TOOL_TYPE_LABELS[type as ToolType],
        onRemove: () => toggleFilterValue('type', type)
      })
    })

    tempFilters.compatibility.forEach((compat) => {
      chips.push({
        id: 'compat-' + compat,
        label: COMPATIBILITY_LABELS[compat as AICompatibility],
        onRemove: () => toggleFilterValue('compatibility', compat)
      })
    })

    tempFilters.activity.forEach((activity) => {
      const chipLabel = activity === 'isFavorite' ? 'Somente favoritos' : 'Editados por mim'
      chips.push({
        id: 'activity-' + activity,
        label: chipLabel,
        onRemove: () => toggleFilterValue('activity', activity)
      })
    })

    return chips
  }, [tempFilters, setFilterValue, toggleFilterValue])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (tempFilters.category !== 'all') count += 1
    count += tempFilters.type.length
    count += tempFilters.compatibility.length
    count += tempFilters.activity.length
    return count
  }, [tempFilters])

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleBackdropClick}
      />

      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-3xl border border-white/10 bg-black/90 text-white shadow-2xl backdrop-blur lg:inset-y-0 lg:left-auto lg:h-full lg:w-full lg:max-w-md lg:rounded-none',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tools-filters-title"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-3 border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-2">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <h2 id="tools-filters-title" className="text-lg font-semibold">Filtros avanÃƒÂ§ados</h2>
                <p className="text-sm text-white/70">
                  Refine sua busca por categoria, tipo, compatibilidade e atividades recentes.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-white/70 hover:text-white"
              onClick={onClose}
              aria-label="Fechar filtros"
            >
              <X className="h-5 w-5" />
            </Button>
          </header>

          <div className="space-y-2 border-b border-white/10 px-6 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/50">
              <Tag className="h-3.5 w-3.5" />
              <span>Filtros ativos</span>
              <Badge variant="outline" className="border-white/15 text-white/70">
                {activeFiltersCount}
              </Badge>
            </div>
            {activeChips.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/85"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      aria-label={'Remover filtro ' + chip.label}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/60">
                Nenhum filtro adicional aplicado.
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Categoria</h3>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  {tempFilters.category === 'all' ? 'Todas' : tempFilters.category}
                </Badge>
              </div>
              <Select
                value={tempFilters.category}
                onValueChange={(value) => setFilterValue('category', value as ToolsFilters['category'])}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-white/15 bg-black/60 text-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-black/90 text-white">
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">OrdenaÃƒÂ§ÃƒÂ£o</h3>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  {tempFilters.sort === 'relevance' ? 'RelevÃƒÂ¢ncia' : 'Recentes'}
                </Badge>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilterValue('sort', option.value)}
                    className={cn(
                      'w-full rounded-xl border border-transparent px-4 py-3 text-left transition',
                      tempFilters.sort === option.value
                        ? 'border-white/25 bg-white/10 text-white'
                        : 'text-white/75 hover:border-white/15 hover:bg-white/10'
                    )}
                    aria-pressed={tempFilters.sort === option.value}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <p className="text-xs text-white/60">{option.description}</p>
                  </button>
                ))}
              </div>
            </section>

            <Separator className="border-white/10" />

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Tipos de ferramenta</h3>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  {tempFilters.type.length}
                </Badge>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                {TOOL_TYPES.map((item) => (
                  <label
                    key={item.value}
                    className="flex items-start gap-3 rounded-xl px-3 py-2 transition hover:bg-white/10"
                  >
                    <Checkbox
                      checked={tempFilters.type.includes(item.value)}
                      onCheckedChange={() => toggleFilterValue('type', item.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-white/90">{TOOL_TYPE_LABELS[item.value]}</p>
                      <p className="text-xs text-white/60">{item.helper}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Compatibilidade com IA</h3>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  {tempFilters.compatibility.length}
                </Badge>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                {COMPATIBILITY_OPTIONS.map((item) => (
                  <label
                    key={item.value}
                    className="flex items-start gap-3 rounded-xl px-3 py-2 transition hover:bg-white/10"
                  >
                    <Checkbox
                      checked={tempFilters.compatibility.includes(item.value)}
                      onCheckedChange={() => toggleFilterValue('compatibility', item.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-white/90">{COMPATIBILITY_LABELS[item.value]}</p>
                      <p className="text-xs text-white/60">{item.helper}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Atividade</h3>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  {tempFilters.activity.length}
                </Badge>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                {ACTIVITY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start gap-3 rounded-xl px-3 py-2 transition hover:bg-white/10"
                  >
                    <Checkbox
                      checked={tempFilters.activity.includes(option.value)}
                      onCheckedChange={() => toggleFilterValue('activity', option.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-medium text-white/90">{option.label}</p>
                      <p className="text-xs text-white/60">{option.helper}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/85 px-6 py-4 backdrop-blur">
            <Button
              type="button"
              variant="ghost"
              className="text-white/70 hover:text-white"
              onClick={handleClearFilters}
            >
              Limpar tudo
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="border border-white/20 bg-white/10 text-white hover:bg-white/15"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="button" className="bg-white text-black hover:bg-white/90" onClick={handleApplyFilters}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
