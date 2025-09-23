'use client'

import {
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArchiveX,
  Loader2,
  X
} from 'lucide-react'
import Header from '../../components/layout/Header'
import ToolCard from '../../components/cards/ToolCard'
import ToolsFiltersDrawer from '../../components/tools/ToolsFiltersDrawer'
import ToolModal from '../../components/modals/ToolModal'
import SearchBar from '@/components/search/SearchBar'
import {
  Tool,
  ToolsFilters,
  ToolCategory,
  ToolType,
  AICompatibility
} from '../../types/tool'
import { useBackground } from '../../contexts/BackgroundContext'
import { supabase } from '../../lib/supabase'
import type { Database } from '@/types/database'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'

const TOOL_TYPE_VALUES: ToolType[] = [
  'text-generation',
  'image-generation',
  'code-generation',
  'data-analysis',
  'automation',
  'optimization',
  'research'
]

const AI_COMPATIBILITY_VALUES: AICompatibility[] = [
  'chatgpt',
  'claude',
  'gemini',
  'midjourney',
  'dalle',
  'stable-diffusion'
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

const AI_COMPATIBILITY_LABELS: Record<AICompatibility, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  midjourney: 'Midjourney',
  dalle: 'DALL·E',
  'stable-diffusion': 'Stable Diffusion'
}

const ACTIVITY_LABELS: Record<ToolsFilters['activity'][number], string> = {
  isFavorite: 'Favoritos',
  isEdited: 'Editados'
}

const TYPE_TAG_PREFIX = 'type:'
const COMPATIBILITY_TAG_PREFIX = 'compat:'

const normalizeTags = (tags: string[] | null | undefined) =>
  Array.isArray(tags) ? tags : []

const escapeIlikePattern = (value: string) =>
  value.replace(/[%_]/g, (match) => '\\' + match)

const isToolType = (value: string | undefined): value is ToolType => {
  if (!value) return false
  return (TOOL_TYPE_VALUES as readonly string[]).includes(value)
}

const isAICompatibility = (
  value: string | undefined
): value is AICompatibility => {
  if (!value) return false
  return (AI_COMPATIBILITY_VALUES as readonly string[]).includes(value)
}

const mapToolRowToTool = (
  row: Database['public']['Tables']['tools']['Row']
): Tool => {
  const rawTags = normalizeTags(row.tags)
  const typeTag = rawTags.find((tag) => tag.startsWith(TYPE_TAG_PREFIX))
  const compatibilityTags = rawTags.filter((tag) =>
    tag.startsWith(COMPATIBILITY_TAG_PREFIX)
  )
  const sanitizedTags = rawTags.filter(
    (tag) =>
      !tag.startsWith(TYPE_TAG_PREFIX) &&
      !tag.startsWith(COMPATIBILITY_TAG_PREFIX)
  )

  const derivedType = typeTag?.slice(TYPE_TAG_PREFIX.length)
  const parsedType = isToolType(derivedType) ? derivedType : 'text-generation'
  const parsedCompatibilities = compatibilityTags
    .map((tag) => tag.slice(COMPATIBILITY_TAG_PREFIX.length))
    .filter(isAICompatibility)

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    category: (row.category as ToolCategory) ?? 'Marketing',
    type: parsedType,
    compatibility: parsedCompatibilities,
    tags: sanitizedTags,
    content: row.content ?? '',
    how_to_use: undefined,
    isFavorite: false,
    isEdited: false,
    usageCount: undefined,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
  }
}

const TOOLS_PER_PAGE = 6

const DEFAULT_FILTERS: ToolsFilters = {
  search: '',
  category: 'all',
  sort: 'relevance',
  type: [],
  compatibility: [],
  activity: []
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsFallback />}>
      <ToolsPageContent />
    </Suspense>
  )
}
function ToolsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentBackground } = useBackground()

  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<ToolCategory[]>([] as any)
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(TOOLS_PER_PAGE)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const hasLoadedOnceRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  const [filters, setFilters] = useState<ToolsFilters>(() => ({
    ...DEFAULT_FILTERS
  }))

  useEffect(() => {
    const q = searchParams?.get('q') || ''
    const cat = (searchParams?.get('cat') as ToolCategory | 'all') || 'all'
    if (q) setSearchTerm(q)
    setFilters((prev) => ({ ...prev, search: q, category: cat }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(pointer: coarse)')

    const updateTouchState = (event?: MediaQueryListEvent) => {
      if (event && typeof event.matches === 'boolean') {
        setIsTouchDevice(event.matches)
        return
      }
      setIsTouchDevice(mediaQuery.matches)
    }

    updateTouchState()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateTouchState)
      return () => mediaQuery.removeEventListener('change', updateTouchState)
    }

    mediaQuery.addListener(updateTouchState)
    return () => mediaQuery.removeListener(updateTouchState)
  }, [])

  useEffect(() => {
    let isActive = true

    const fetchTools = async () => {
      const isFirstLoad = !hasLoadedOnceRef.current
      if (isFirstLoad) {
        setIsInitialLoading(true)
      } else {
        setIsRefreshing(true)
      }
      setError(null)

      try {
        const trimmedSearch = filters.search.trim()
        let query = supabase
          .from('tools')
          .select('*')
          .eq('is_active', true)

        if (trimmedSearch) {
          const likePattern = '%' + escapeIlikePattern(trimmedSearch) + '%'
          const orStatement =
            'title.ilike.' +
            likePattern +
            ',description.ilike.' +
            likePattern +
            ',content.ilike.' +
            likePattern
          query = query.or(orStatement)
        }

        if (filters.category !== 'all') {
          query = query.eq('category', filters.category)
        }

        if (filters.type.length > 0) {
          const typeTags = filters.type.map((value) => TYPE_TAG_PREFIX + value)
          query = query.overlaps('tags', typeTags)
        }

        if (filters.compatibility.length > 0) {
          const compatibilityTags = filters.compatibility.map(
            (value) => COMPATIBILITY_TAG_PREFIX + value
          )
          query = query.overlaps('tags', compatibilityTags)
        }

        const orderColumn = filters.sort === 'recent' ? 'updated_at' : 'title'
        const ascending = filters.sort !== 'recent'
        query = query.order(orderColumn, { ascending })

        if (filters.sort === 'recent') {
          query = query.order('title', { ascending: true })
        }

        const { data, error: queryError } = await query
        if (queryError) throw queryError

        const mapped = (data ?? []).map(mapToolRowToTool)

        if (!isActive) return

        setTools(mapped)
        const uniqueCats = Array.from(
          new Set(mapped.map((tool) => tool.category).filter(Boolean))
        ) as ToolCategory[]
        setCategories(uniqueCats)
      } catch (fetchError) {
        if (!isActive) return
        console.error('Erro carregando ferramentas:', fetchError)
        setError('Não foi possível carregar as ferramentas agora.')
      } finally {
        if (!isActive) return
        hasLoadedOnceRef.current = true
        setIsInitialLoading(false)
        setIsRefreshing(false)
      }
    }

    fetchTools()

    return () => {
      isActive = false
    }
  }, [filters.category, filters.compatibility, filters.search, filters.sort, filters.type])

  const loadUserFavorites = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) {
        setFavorites([])
        return
      }

      const { data: favs, error: favError } = await supabase
        .from('user_tools')
        .select('tool_id, is_favorite')
        .eq('user_id', user.id)
        .eq('is_favorite', true)

      if (favError) throw favError

      setFavorites((favs ?? []).map((fav: { tool_id: string }) => fav.tool_id))
    } catch (favErr) {
      console.error('Erro carregando favoritos:', favErr)
    }
  }, [])

  useEffect(() => {
    loadUserFavorites()
  }, [loadUserFavorites])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }))
      setDisplayedCount(TOOLS_PER_PAGE)
      const params = new URLSearchParams(window.location.search)
      if (searchTerm) {
        params.set('q', searchTerm)
      } else {
        params.delete('q')
      }
      if (filters.category && filters.category !== 'all') {
        params.set('cat', String(filters.category))
      } else {
        params.delete('cat')
      }
      const qs = params.toString()
      router.replace(qs ? '?' + qs : '?')
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, filters.category, router])

  useEffect(() => {
    const toolId = searchParams?.get('tool')
    if (!toolId) {
      setSelectedTool(null)
      return
    }

    const match = tools.find((tool) => String(tool.id) === toolId)
    if (match) {
      setSelectedTool(match)
    }
  }, [searchParams, tools])

  const handleToggleFavorite = useCallback(
    async (tool: Tool): Promise<void> => {
      const toolId = tool.id
      let willFavorite = false
      let previous: string[] = []

      setFavorites((prev) => {
        previous = prev
        const isFavorited = prev.includes(toolId)
        willFavorite = !isFavorited
        return isFavorited
          ? prev.filter((id) => id !== toolId)
          : prev.concat(toolId)
      })

      try {
        const userResponse = await supabase.auth.getUser()
        const user = userResponse.data?.user
        if (!user) throw new Error('Usuário não autenticado')
        const upsertResponse = await (supabase.from('user_tools') as any).upsert({
          user_id: user.id,
          tool_id: toolId,
          is_favorite: willFavorite,
          last_used: new Date().toISOString()
        })
        if (upsertResponse.error) throw upsertResponse.error
        await loadUserFavorites()
      } catch {
        setFavorites(previous)
        setError('Falha ao atualizar favorito')
        setTimeout(() => setError(null), 3000)
      }
    },
    [loadUserFavorites]
  )
  const filteredTools = useMemo(() => {
    let result = tools.slice()

    if (filters.search) {
      const searchTermLower = filters.search.toLowerCase()
      result = result.filter((tool) =>
        tool.title.toLowerCase().includes(searchTermLower) ||
        tool.description.toLowerCase().includes(searchTermLower) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchTermLower)) ||
        tool.category.toLowerCase().includes(searchTermLower)
      )
    }

    if (filters.category !== 'all') {
      result = result.filter((tool) => tool.category === filters.category)
    }

    if (filters.type.length > 0) {
      result = result.filter((tool) => filters.type.includes(tool.type))
    }

    if (filters.compatibility.length > 0) {
      result = result.filter((tool) =>
        tool.compatibility.some((compat) => filters.compatibility.includes(compat))
      )
    }

    if (filters.activity.includes('isFavorite')) {
      result = result.filter((tool) => favorites.includes(tool.id))
    }

    if (filters.activity.includes('isEdited')) {
      result = result.filter((tool) => tool.isEdited)
    }

    if (filters.sort === 'recent') {
      result.sort((a, b) => {
        const aTimestamp = (a.updatedAt ?? a.createdAt ?? new Date(0)).getTime()
        const bTimestamp = (b.updatedAt ?? b.createdAt ?? new Date(0)).getTime()
        return bTimestamp - aTimestamp
      })
    } else {
      result.sort((a, b) => {
        const aFavorited = favorites.includes(a.id) ? 1 : 0
        const bFavorited = favorites.includes(b.id) ? 1 : 0
        if (aFavorited !== bFavorited) return bFavorited - aFavorited
        return a.title.localeCompare(b.title)
      })
    }

    return result
  }, [filters, favorites, tools])

  const displayedTools = useMemo(
    () => filteredTools.slice(0, displayedCount),
    [filteredTools, displayedCount]
  )

  const hasMore = useMemo(
    () => displayedCount < filteredTools.length,
    [displayedCount, filteredTools.length]
  )

  const updateToolQuery = useCallback(
    (toolId?: string) => {
      if (typeof window === 'undefined') return
      const params = new URLSearchParams(window.location.search)
      if (toolId) {
        params.set('tool', toolId)
      } else {
        params.delete('tool')
      }
      const query = params.toString()
      router.replace(query ? '?' + query : '?', { scroll: false })
    },
    [router]
  )

  const handleToolClick = useCallback(
    (tool: Tool) => {
      setSelectedTool(tool)
      updateToolQuery(String(tool.id))
    },
    [updateToolQuery]
  )

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setDisplayedCount((prev) => Math.min(prev + TOOLS_PER_PAGE, filteredTools.length))
    setIsLoading(false)
    setTimeout(() => {
      const newCardIndex = displayedCount
      const newCard = document.querySelector('[data-tool-index="' + newCardIndex + '"]')
      if (newCard) {
        ;(newCard as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }, [displayedCount, filteredTools.length])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setFilters(() => ({ ...DEFAULT_FILTERS }))
    setDisplayedCount(TOOLS_PER_PAGE)
    const params = new URLSearchParams(window.location.search)
    params.delete('q')
    params.delete('cat')
    const qs = params.toString()
    router.replace(qs ? '?' + qs : '?')
  }, [router])

  const updateFilter = useCallback(
    <K extends keyof ToolsFilters>(key: K, value: ToolsFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
      setDisplayedCount(TOOLS_PER_PAGE)
      if (key === 'category') {
        const params = new URLSearchParams(window.location.search)
        if (value && value !== 'all') {
          params.set('cat', String(value))
        } else {
          params.delete('cat')
        }
        const qs = params.toString()
        router.replace(qs ? '?' + qs : '?')
      }
    },
    [router]
  )

  const updateFilters = useCallback((newFilters: Partial<ToolsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setDisplayedCount(TOOLS_PER_PAGE)
  }, [])

  const handleModalClose = useCallback(() => {
    setSelectedTool(null)
    updateToolQuery(undefined)
  }, [updateToolQuery])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'all') count += 1
    count += filters.type.length
    count += filters.compatibility.length
    count += filters.activity.length
    return count
  }, [filters])

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; onRemove: () => void }> = []

    if (filters.category !== 'all') {
      chips.push({
        id: 'category-' + filters.category,
        label: filters.category,
        onRemove: () => updateFilter('category', 'all')
      })
    }

    filters.type.forEach((type) => {
      chips.push({
        id: 'type-' + type,
        label: TOOL_TYPE_LABELS[type],
        onRemove: () =>
          updateFilters({ type: filters.type.filter((item) => item !== type) })
      })
    })

    filters.compatibility.forEach((compat) => {
      chips.push({
        id: 'compat-' + compat,
        label: AI_COMPATIBILITY_LABELS[compat],
        onRemove: () =>
          updateFilters({
            compatibility: filters.compatibility.filter((item) => item !== compat)
          })
      })
    })

    filters.activity.forEach((activity) => {
      chips.push({
        id: 'activity-' + activity,
        label: ACTIVITY_LABELS[activity],
        onRemove: () =>
          updateFilters({
            activity: filters.activity.filter((item) => item !== activity)
          })
      })
    })

    return chips
  }, [filters, updateFilter, updateFilters])

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
      filters.category !== 'all' ||
      filters.type.length ||
      filters.compatibility.length ||
      filters.activity.length
  )

  const isFetchingFilters = !isInitialLoading && isRefreshing

  const backgroundStyle = useMemo(() => {
    const backgroundValue = currentBackground?.value
    if (!backgroundValue) {
      return { backgroundColor: '#000000' }
    }

    return {
      backgroundImage: 'url("' + backgroundValue + '?w=1600&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: isTouchDevice ? 'scroll' : 'fixed'
    } as const
  }, [currentBackground?.value, isTouchDevice])
  return (
    <div
      className="min-h-screen bg-black text-white pt-24 pb-20 px-4"
      style={backgroundStyle}
    >
      <a
        href="#tools-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 rounded-lg bg-white px-4 py-2 font-medium text-black shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main
        id="tools-content"
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-2 sm:px-4 lg:px-8"
      >
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explore todas as ferramentas
          </h1>
          <p className="text-base text-white/75 sm:text-lg">
            Descubra prompts e ferramentas de IA para potencializar sua criatividade
          </p>
        </section>

        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-2xl">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              totalTools={tools.length}
              onQuickFilter={(category) => updateFilter('category', category as any)}
              resultsCount={filteredTools.length}
              variant="tools"
              className="w-full"
            />
          </div>

          <div className="flex justify-end lg:justify-start">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="relative inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-6 text-white transition-all duration-200 hover:border-white/20 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-haspopup="dialog"
              aria-expanded={showFiltersDrawer}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-medium">Filtros avançados</span>
              {activeFiltersCount > 0 && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
                  {activeFiltersCount}
                </div>
              )}
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-white/85 drop-shadow-sm" aria-live="polite">
              Exibindo {displayedTools.length} de {filteredTools.length} ferramentas
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {!isInitialLoading && isFetchingFilters && (
                <span className="inline-flex items-center gap-2 text-sm text-white/70">
                  <Loader2 className="h-4 w-4 animate-spin" /> Atualizando
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-white/80 underline-offset-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label="Filtros ativos">
              {activeFilterChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex h-5 w-5.items-center justify-center rounded-full text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label={'Remover filtro ' + chip.label}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {error && (
          <section className="mx-auto w-full max-w-3xl">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">
              {error}
            </div>
          </section>
        )}
        {isInitialLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {Array.from({ length: TOOLS_PER_PAGE }).map((_, index) => (
              <div
                key={'initial-skeleton-' + index}
                className="glass-card h-72 relative overflow-hidden"
                style={{
                  animationDelay: String(index * 100) + 'ms',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <div
                        className="loading-shimmer h-6 w-20"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      />
                      <div
                        className="loading-shimmer h-5 w-16"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      />
                    </div>
                    <div
                      className="loading-shimmer h-12 w-12"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="loading-shimmer mb-2 h-6 w-full" />
                    <div className="loading-shimmer h-6 w-3/4" />
                  </div>

                  <div className="mb-4">
                    <div className="loading-shimmer mb-2 h-4 w-full" />
                    <div className="loading-shimmer h-4 w-5/6" />
                  </div>

                  <div className="mb-4 flex gap-2">
                    <div
                      className="loading-shimmer h-6 w-16"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                    <div
                      className="loading-shimmer h-6 w-20"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                    <div
                      className="loading-shimmer h-6 w-12"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="loading-shimmer h-4 w-24" />
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, iconIndex) => (
                        <div
                          key={'compat-placeholder-' + iconIndex}
                          className="loading-shimmer h-8 w-8"
                          style={{ borderRadius: 'var(--radius-full)' }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="loading-shimmer h-3 w-20" />
                    <div className="loading-shimmer h-3 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedTools.length > 0 ? (
          <div
            id="tools-grid"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6"
          >
            {displayedTools.map((tool, index) => (
              <div
                key={tool.id}
                data-tool-index={index}
                className="h-full"
              >
                <ToolCard
                  tool={tool}
                  onClick={handleToolClick}
                  onFavorite={handleToggleFavorite}
                  isFavorited={favorites.includes(tool.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <section className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
              {filters.search ? (
                <Search className="h-10 w-10 text-white/60" />
              ) : (
                <ArchiveX className="h-10 w-10 text-white/60" />
              )}
            </div>

            {filters.search ? (
              <>
                <h3 className="text-2xl font-semibold text-white drop-shadow-sm">
                  Nenhuma ferramenta encontrada para &ldquo;{filters.search}&rdquo;
                </h3>
                <p className="mx-auto mb-6 max-w-md text-white/70 drop-shadow-sm">
                  Experimente termos mais gerais ou explore nossas categorias populares.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold.text-white drop-shadow-sm">
                  Nenhuma ferramenta encontrada
                </h3>
                <p className="mb-6 text-white/70 drop-shadow-sm">
                  Tente ajustar seus filtros ou fazer uma nova busca.
                </p>
              </>
            )}

            <div className="mx-auto mb-6 flex max-w-lg flex-wrap justify-center gap-2">
              {['Copywriting', 'SEO', 'Imagem', 'Análise', 'Marketing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilter('category', cat as ToolCategory)}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-white/30 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-white transition-all.duration-300 backdrop-blur hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Limpar todos os filtros
            </button>
          </section>
        )}

        {hasMore && (
          <div className="mb-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="mx-auto flex items-center gap-2 rounded-xl px-8 py-4 text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                borderRadius: 'var(--radius-xl)',
                backdropFilter: 'blur(var(--glass-blur-intense))',
                background: 'linear-gradient(135deg, var(--glass-bg-strong) 0%, var(--glass-bg-medium) 100%)',
                border: '1px solid var(--glass-border-strong)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(event) => {
                if (!isLoading) {
                  event.currentTarget.style.transform = 'translateY(-2px)'
                  event.currentTarget.style.boxShadow = 'var(--shadow-xl)'
                  event.currentTarget.style.background =
                    'linear-gradient(135deg, var(--glass-bg-intense) 0%, var(--glass-bg-strong) 100%)'
                }
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'translateY(0)'
                event.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                event.currentTarget.style.background =
                  'linear-gradient(135deg, var(--glass-bg-strong) 0%, var(--glass-bg-medium) 100%)'
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className="h-5 w-5 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: 'var(--text-muted)',
                      borderTopColor: 'var(--text-primary)'
                    }}
                  />
                  <span style={{ color: 'var(--text-primary)' }}>Carregando...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Carregar mais ferramentas</span>
                </>
              )}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
            {Array.from({
              length: Math.min(
                TOOLS_PER_PAGE,
                Math.max(filteredTools.length - displayedTools.length, 0)
              )
            }).map((_, index) => (
              <div
                key={'loading-skeleton-' + index}
                className="glass-card h-72 relative overflow-hidden"
                style={{
                  animationDelay: String(index * 100) + 'ms',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <div
                        className="loading-shimmer h-6 w-20"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      />
                      <div
                        className="loading-shimmer h-5 w-16"
                        style={{ borderRadius: 'var(--radius-full)' }}
                      />
                    </div>
                    <div
                      className="loading-shimmer h-12 w-12"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="loading-shimmer.mb-2 h-6 w-full" />
                    <div className="loading-shimmer h-6 w-3/4" />
                  </div>

                  <div className="mb-4">
                    <div className="loading-shimmer.mb-2 h-4 w-full" />
                    <div className="loading-shimmer h-4 w-5/6" />
                  </div>

                  <div className="mb-4 flex gap-2">
                    <div
                      className="loading-shimmer h-6 w-16"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                    <div
                      className="loading-shimmer h-6 w-20"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                    <div
                      className="loading-shimmer h-6 w-12"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="loading-shimmer h-4 w-24" />
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, iconIndex) => (
                        <div
                          key={'loading-compat-' + iconIndex}
                          className="loading-shimmer h-8 w-8"
                          style={{ borderRadius: 'var(--radius-full)' }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="loading-shimmer h-3 w-20" />
                    <div className="loading-shimmer h-3 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ToolsFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        filters={filters}
        onFiltersChange={updateFilters}
        categories={categories}
      />

      <BackgroundOverlay />

      <ToolModal
        tool={selectedTool}
        isOpen={selectedTool !== null}
        onClose={handleModalClose}
      />
    </div>
  )
}
function ToolsFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p className="text-sm text-white/60">Carregando ferramentas...</p>
    </div>
  )
}
