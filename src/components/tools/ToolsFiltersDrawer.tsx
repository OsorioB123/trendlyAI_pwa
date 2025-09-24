'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { X, Filter, Tag } from 'lucide-react'
import { ToolsFilters, ToolCategory, ToolType, AICompatibility } from '../../types/tool'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

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
    description: 'Ordenação considerando favoritos e ordem alfabética.'
  },
  {
    value: 'recent',
    label: 'Atualizadas recentemente',
    description: 'Mostra primeiro ferramentas atualizadas nos últimos dias.'
  }
]

const TOOL_TYPE_LABELS: Record<ToolType, string> = {
  'text-generation': 'Geração de texto',
  'image-generation': 'Geração de imagem',
  'code-generation': 'Geração de código',
  'data-analysis': 'Análise de dados',
  'automation': 'Automação',
  'optimization': 'Otimização',
  research: 'Pesquisa'
}

const COMPATIBILITY_LABELS: Record<AICompatibility, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  midjourney: 'Midjourney',
  dalle: 'DALL·E',
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
  { value: 'text-generation', helper: 'Copy, roteiros, narrativas e estruturação de prompts.' },
  { value: 'image-generation', helper: 'Geração e edição de imagens com IA generativa.' },
  { value: 'code-generation', helper: 'Suporte para código, snippets e automações.' },
  { value: 'data-analysis', helper: 'Análises, dashboards e relatórios com IA.' },
  { value: 'automation', helper: 'Integrações, fluxos e agentes automatizados.' },
  { value: 'optimization', helper: 'Melhorias contínuas, testes A/B e ajustes finos.' },
  { value: 'research', helper: 'Pesquisa, curadoria de conteúdo e descoberta.' }
]

const COMPATIBILITY_OPTIONS: Array<{ value: AICompatibility; helper: string }> = [
  { value: 'chatgpt', helper: 'Compatível com GPT-4, GPT-4o e variações.' },
  { value: 'claude', helper: 'Funciona com Claude 3 e Claude 3.5.' },
  { value: 'gemini', helper: 'Para produtos da família Google Gemini.' },
  { value: 'midjourney', helper: 'Fluxos usando Midjourney para imagens.' },
  { value: 'dalle', helper: 'Suporte a DALL·E e Image API da OpenAI.' },
  { value: 'stable-diffusion', helper: 'Compatível com SDXL ou variantes open source.' }
]

export default function ToolsFiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  categories = []
}: ToolsFiltersDrawerProps) {
  const [tempFilters, setTempFilters] = useState<ToolsFilters>(filters)

  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose()
    },
    [onClose]
  )

  const setFilterValue = useCallback(<K extends keyof ToolsFilters>(key: K, value: ToolsFilters[K]) => {
    setTempFilters((previous) => ({ ...previous, [key]: value }))
  }, [])

  const toggleFilterValue = useCallback(
    <K extends keyof Pick<ToolsFilters, 'activity' | 'type' | 'compatibility'>>(key: K, value: string) => {
      setTempFilters((previous) => {
        const current = previous[key] as string[]
        const exists = current.includes(value)

        return {
          ...previous,
          [key]: exists ? current.filter((item) => item !== value) : [...current, value]
        }
      })
    },
    []
  )

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
        id: `type-${type}`,
        label: TOOL_TYPE_LABELS[type],
        onRemove: () => toggleFilterValue('type', type)
      })
    })

    tempFilters.compatibility.forEach((compatibility) => {
      chips.push({
        id: `compat-${compatibility}`,
        label: COMPATIBILITY_LABELS[compatibility as AICompatibility],
        onRemove: () => toggleFilterValue('compatibility', compatibility)
      })
    })

    tempFilters.activity.forEach((activity) => {
      chips.push({
        id: `activity-${activity}`,
        label: activity === 'isFavorite' ? 'Somente favoritos' : 'Editados por mim',
        onRemove: () => toggleFilterValue('activity', activity)
      })
    })

    return chips
  }, [tempFilters, setFilterValue, toggleFilterValue])

  const activeFiltersCount = useMemo(() => {
    return (
      (tempFilters.category !== 'all' ? 1 : 0) +
      tempFilters.type.length +
      tempFilters.compatibility.length +
      tempFilters.activity.length
    )
  }, [tempFilters])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'flex h-[min(90vh,700px)] w-[min(92vw,720px)] flex-col overflow-hidden border border-white/12 bg-black/95 p-0 text-white shadow-[0_40px_120px_rgba(15,15,45,0.6)] backdrop-blur-xl sm:rounded-3xl',
          '[&>button]:hidden'
        )}
      >
        <DialogHeader className="space-y-4 px-6 pt-6 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl border border-white/15 bg-white/10 p-2">
                <Filter className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-semibold text-white">Filtros avançados</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-white/70">
                  Refine sua busca por categoria, tipo, compatibilidade e atividades recentes.
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full border border-white/10 bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
              onClick={onClose}
              aria-label="Fechar filtros"
            >
              <X className="h-5 w-5" aria-hidden />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-white/55">
            <Tag className="h-3.5 w-3.5" aria-hidden />
            <span>Filtros ativos</span>
            <Badge variant="outline" className="border-white/20 text-white/75">
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
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white/60 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label={`Remover filtro ${chip.label}`}
                  >
                    <X className="h-3 w-3" aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/60">Nenhum filtro adicional aplicado.</p>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 [&_[data-radix-scroll-area-scrollbar]]:hidden">
          <div className="space-y-6 pb-6">
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
                <SelectTrigger className="h-11 w-full rounded-xl border border-white/15 bg-black/70 text-white">
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
                <h3 className="text-sm font-semibold text-white/90">Ordenação</h3>
                <Badge variant="outline" className="border-white/15 text-white/70">
                  {tempFilters.sort === 'relevance' ? 'Relevância' : 'Recentes'}
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
                        ? 'border-white/25 bg-white/12 text-white'
                        : 'text-white/75 hover:border-white/15 hover:bg-white/8'
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
                      className="mt-1 border-white/40"
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
                      className="mt-1 border-white/40"
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
                      className="mt-1 border-white/40"
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
        </ScrollArea>

        <DialogFooter className="gap-3 border-t border-white/10 bg-black/85 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="text-white/75 hover:text-white"
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
            <Button
              type="button"
              className="bg-white text-black hover:bg-white/90"
              onClick={handleApplyFilters}
            >
              Aplicar filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
