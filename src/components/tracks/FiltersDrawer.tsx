'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { X, Filter, ChevronDown } from 'lucide-react'
import { TracksFilters } from '../../types/track'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FiltersDrawerProps = {
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
  'Narrativa',
  'Storytelling',
  'Análise',
  'Tendências',
  'Design',
  'Visual',
  'Marketing',
  'Influência',
  'SEO',
  'Otimização',
  'Vídeo',
  'Redes Sociais',
  'Estratégia',
  'Engajamento',
  'Métricas',
  'Copywriting',
  'Persuasão'
]

export default function FiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableCategories = ALL_CATEGORIES
}: FiltersDrawerProps) {
  const [tempFilters, setTempFilters] = useState<TracksFilters>(filters)

  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose()
    },
    [onClose]
  )

  const handleToggleArrayFilter = useCallback(
    <K extends keyof Pick<TracksFilters, 'categories' | 'levels' | 'status'>>(
      key: K,
      value: string
    ) => {
      setTempFilters((prev) => ({
        ...prev,
        [key]: (prev[key] as string[]).includes(value)
          ? (prev[key] as string[]).filter((item) => item !== value)
          : [...(prev[key] as string[]), value]
      }))
    },
    []
  )

  const handleClearFilters = useCallback(() => {
    setTempFilters({
      search: filters.search,
      categories: [],
      levels: [],
      status: [],
      sort: filters.sort
    })
  }, [filters.search, filters.sort])

  const handleApplyFilters = useCallback(() => {
    onFiltersChange(tempFilters)
    onClose()
  }, [tempFilters, onClose, onFiltersChange])

  const hasFilters = useMemo(
    () =>
      tempFilters.categories.length > 0 ||
      tempFilters.levels.length > 0 ||
      tempFilters.status.length > 0,
    [tempFilters]
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'flex h-[min(90vh,720px)] w-[min(92vw,720px)] flex-col overflow-hidden border border-white/12 bg-black/95 p-0 text-white shadow-[0_40px_120px_rgba(10,10,35,0.6)] backdrop-blur-2xl sm:rounded-3xl',
          '[&>button]:hidden'
        )}
      >
        <DialogHeader className="space-y-4 border-b border-white/10 px-6 py-6 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl border border-white/15 bg-white/10 p-2">
                <Filter className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-semibold text-white">
                  Filtros avançados
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-white/70">
                  Combine categorias, níveis e status para encontrar trilhas ideais.
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
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 font-medium text-white/75">
              {hasFilters ? 'Filtrando resultados' : 'Nenhum filtro ativo'}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 [&_[data-radix-scroll-area-scrollbar]]:hidden">
          <div className="space-y-8 pb-2">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-white/85">Nível</h3>
              <div className="space-y-2">
                {LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition hover:border-white/15 hover:bg-white/8"
                  >
                    <input
                      type="checkbox"
                      checked={tempFilters.levels.includes(level)}
                      onChange={() => handleToggleArrayFilter('levels', level)}
                      className="form-checkbox h-4 w-4 rounded border-white/40 bg-black/40 text-white focus:ring-white/30"
                    />
                    <span className="text-sm text-white/85">{level}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-white/85">Status</h3>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((status) => (
                  <label
                    key={status.value}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition hover:border-white/15 hover:bg-white/8"
                  >
                    <input
                      type="checkbox"
                      checked={tempFilters.status.includes(status.value)}
                      onChange={() => handleToggleArrayFilter('status', status.value)}
                      className="form-checkbox h-4 w-4 rounded border-white/40 bg-black/40 text-white focus:ring-white/30"
                    />
                    <span className="text-sm text-white/85">{status.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/85">Categorias</h3>
                <button
                  type="button"
                  onClick={() => setTempFilters((prev) => ({ ...prev, categories: availableCategories }))}
                  className="text-xs font-medium text-white/60 underline-offset-2 transition hover:text-white"
                >
                  Selecionar todas
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleToggleArrayFilter('categories', category)}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition-all',
                      tempFilters.categories.includes(category)
                        ? 'border-white/25 bg-white/15 text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)]'
                        : 'border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/8'
                    )}
                  >
                    <span className="flex-1 text-center">{category}</span>
                    {tempFilters.categories.includes(category) && (
                      <ChevronDown className="h-4 w-4 -rotate-90 text-white/80" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-3 border-t border-white/10 bg-black/88 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
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
