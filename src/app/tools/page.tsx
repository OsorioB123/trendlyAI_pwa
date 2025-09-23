'use client'

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  SlidersHorizontal,
  Plus,
  ArchiveX
} from 'lucide-react'
import Header from '../../components/layout/Header'
import ToolCard from '../../components/cards/ToolCard'
import ToolsFiltersDrawer from '../../components/tools/ToolsFiltersDrawer'
import ToolModal from '../../components/modals/ToolModal'
import SearchBar from '@/components/search/SearchBar'
import { HeaderVariant } from '../../types/header'
import { Tool, ToolsFilters, ToolCategory } from '../../types/tool'
import { useBackground } from '../../contexts/BackgroundContext'
import { supabase } from '../../lib/supabase'
import type { Database } from '@/types/database'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'

// Categorias serão derivadas dos dados do Supabase

const TOOLS_PER_PAGE = 6

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
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  
  const [filters, setFilters] = useState<ToolsFilters>({
    search: '',
    category: 'all',
    sort: 'relevance',
    type: [],
    compatibility: [],
    activity: []
  })

  // Initialize filters from URL (simple: search + category)
  useEffect(() => {
    const q = searchParams?.get('q') || ''
    const cat = (searchParams?.get('cat') as any) || 'all'
    if (q) setSearchTerm(q)
    setFilters((prev) => ({ ...prev, search: q, category: cat }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Carregar ferramentas do Supabase
  useEffect(() => {
    const load = async () => {
      try {
        setIsInitialLoading(true)
        // Fetch tools
        const { data: toolsData, error } = await supabase
          .from('tools')
          .select('*')
          .eq('is_active', true)
        if (error) throw error

        const mapped: Tool[] = (toolsData as Database['public']['Tables']['tools']['Row'][]).map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          category: (t.category as ToolCategory) || 'Marketing',
          // Campos não presentes no schema atual: default simples
          type: 'text-generation',
          compatibility: [],
          tags: t.tags || [],
          content: t.content || '',
          how_to_use: undefined,
          isFavorite: false,
          isEdited: false,
          createdAt: t.created_at ? new Date(t.created_at) : undefined,
          updatedAt: t.updated_at ? new Date(t.updated_at) : undefined,
        }))
        setTools(mapped)

        // Build unique categories from data
        const uniqueCats = Array.from(new Set(mapped.map(m => m.category).filter(Boolean))) as ToolCategory[]
        setCategories(uniqueCats)

        // Fetch favorites for current user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: favs, error: favErr } = await supabase
            .from('user_tools')
            .select('tool_id, is_favorite')
            .eq('user_id', user.id)
            .eq('is_favorite', true)
          if (favErr) throw favErr
          setFavorites((favs || []).map((f: any) => f.tool_id))
        } else {
          setFavorites([])
        }
      } catch (e) {
        console.error('Erro carregando ferramentas:', e)
        setError('Não foi possível carregar as ferramentas agora.')
      } finally {
        setIsInitialLoading(false)
      }
    }
    load()
  }, [])

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
      setDisplayedCount(TOOLS_PER_PAGE) // Reset pagination
      // Persist minimal state in URL
      const params = new URLSearchParams(window.location.search)
      if (searchTerm) params.set('q', searchTerm); else params.delete('q')
      if (filters.category && filters.category !== 'all') params.set('cat', String(filters.category)); else params.delete('cat')
      const qs = params.toString()
      router.replace(qs ? `?${qs}` : '?')
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

  // Mock favorites functionality with loading state
  const handleToggleFavorite = useCallback(async (tool: Tool) => {
    const toolId = tool.id
    let willFavorite = false
    let previous: string[] = []

    // Optimistic update
    setFavorites(prev => {
      previous = prev
      const isFavorited = prev.includes(toolId)
      willFavorite = !isFavorited
      return isFavorited ? prev.filter(id => id !== toolId) : [...prev, toolId]
    })

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')
      const { error } = await (supabase
        .from('user_tools') as any)
        .upsert({
          user_id: user.id,
          tool_id: toolId,
          is_favorite: willFavorite,
          last_used: new Date().toISOString()
        })
      if (error) throw error
    } catch {
      // Revert optimistic update on error
      setFavorites(previous)
      setError('Falha ao atualizar favorito')
      setTimeout(() => setError(null), 3000)
    }
  }, [])

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let result = [...tools]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(tool => 
        tool.title.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        tool.category.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(tool => tool.category === filters.category)
    }

    // Type filter
    if (filters.type.length > 0) {
      result = result.filter(tool => filters.type.includes(tool.type))
    }

    // Compatibility filter
    if (filters.compatibility.length > 0) {
      result = result.filter(tool => 
        tool.compatibility.some(comp => filters.compatibility.includes(comp))
      )
    }

    // Activity filter
    if (filters.activity.includes('isFavorite')) {
      result = result.filter(tool => favorites.includes(tool.id))
    }
    if (filters.activity.includes('isEdited')) {
      result = result.filter(tool => tool.isEdited)
    }

    // Sort
    if (filters.sort === 'recent') {
      result.sort((a, b) => b.id.localeCompare(a.id))
    } else {
      // 'relevance' - sort by favorites and usage
      result.sort((a, b) => {
        const aFavorited = favorites.includes(a.id) ? 1 : 0
        const bFavorited = favorites.includes(b.id) ? 1 : 0
        
        if (aFavorited !== bFavorited) return bFavorited - aFavorited
        return a.title.localeCompare(b.title)
      })
    }

    return result
  }, [filters, favorites, tools])

  const displayedTools = useMemo(() => 
    filteredTools.slice(0, displayedCount), 
    [filteredTools, displayedCount]
  )
  
  const hasMore = useMemo(() => 
    displayedCount < filteredTools.length, 
    [displayedCount, filteredTools.length]
  )

  const updateToolQuery = useCallback((toolId?: string) => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (toolId) {
      params.set('tool', toolId)
    } else {
      params.delete('tool')
    }
    const query = params.toString()
    router.replace(query ? `?${query}` : '?', { scroll: false })
  }, [router])

  const handleToolClick = useCallback((tool: Tool) => {
    setSelectedTool(tool)
    updateToolQuery(String(tool.id))
  }, [updateToolQuery])

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)
    
    // Mock loading delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setDisplayedCount(prev => Math.min(prev + TOOLS_PER_PAGE, filteredTools.length))
    setIsLoading(false)
    
    // Smooth scroll to new content
    setTimeout(() => {
      const newCardIndex = displayedCount
      const newCard = document.querySelector(`[data-tool-index="${newCardIndex}"]`)
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }, [displayedCount, filteredTools.length])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setFilters({
      search: '',
      category: 'all',
      sort: 'relevance',
      type: [],
      compatibility: [],
      activity: []
    })
    setDisplayedCount(TOOLS_PER_PAGE)
  }, [])

  const updateFilter = useCallback(<K extends keyof ToolsFilters>(
    key: K,
    value: ToolsFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setDisplayedCount(TOOLS_PER_PAGE) // Reset pagination when filtering
    // Persist category quickly when changed
    if (key === 'category') {
      const params = new URLSearchParams(window.location.search)
      if (value && value !== 'all') params.set('cat', String(value)); else params.delete('cat')
      const qs = params.toString()
      router.replace(qs ? `?${qs}` : '?')
    }
  }, [router])

  const updateFilters = useCallback((newFilters: Partial<ToolsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setDisplayedCount(TOOLS_PER_PAGE)
  }, [])

  const handleModalClose = useCallback(() => {
    setSelectedTool(null)
    updateToolQuery(undefined)
  }, [updateToolQuery])

  // Quick category filters (based on most popular from HTML reference)
  // Quick category buttons removidos (duplicado visual)

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'all') count++
    count += filters.type.length + filters.compatibility.length + filters.activity.length
    return count
  }, [filters])

  return (
    <div 
      className="min-h-screen bg-black text-white pt-24 px-4"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=1600&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Header variant={HeaderVariant.SECONDARY} />

      {error && (
        <div className="mx-auto mt-6 max-w-5xl">
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore todas as Ferramentas
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Descubra prompts e ferramentas de IA para potencializar sua criatividade
          </p>
        </div>

        {/* Controles de Busca e Filtros - Layout Simplificado */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Barra de Busca Principal - Mais Proeminente */}
          <div className="flex-1">
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

          {/* Botão de Filtros Avançados */}
          <div className="lg:w-auto">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="relative w-full lg:w-auto h-12 flex items-center justify-center gap-2 px-6 text-white rounded-xl bg-black/50 hover:bg-black/70 border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-medium">Filtros Avançados</span>
              {activeFiltersCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center text-black bg-white">
                  {activeFiltersCount}
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Ordenação mobile removida: usar Drawer */}
        <div className="hidden" />

        {/* Removido: botões de categorias duplicados */}

        {/* Results Counter (with aria-live for accessibility) */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-white/80 drop-shadow-sm" aria-live="polite">
            Exibindo {displayedTools.length} de {filteredTools.length} ferramentas
          </p>
          
          {(filters.search || filters.category !== 'all' || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              className="
                text-white/80 hover:text-white text-sm underline transition-colors duration-200
                backdrop-blur-[8px] bg-white/[0.05] px-2 py-1 rounded-lg
                hover:bg-white/[0.08]
              "
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Error Toast */}
        {error && (
          <div className="fixed top-24 right-4 z-50 p-4 rounded-lg text-white bg-black shadow-lg">
            <p className="font-medium drop-shadow-sm">{error}</p>
          </div>
        )}

        {/* Tools Grid - Enhanced Responsive Layout with Initial Loading */}
        {isInitialLoading ? (
          /* Initial Loading State */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {Array.from({ length: TOOLS_PER_PAGE }).map((_, index) => (
              <div
                key={`initial-skeleton-${index}`}
                className="glass-card h-72 relative overflow-hidden stagger-animation"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {/* Enhanced Skeleton Structure */}
                <div className="p-6 h-full flex flex-col">
                  {/* Category and Type Tags */}
                  <div className="flex justify-between items-start mb-4">
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
                      className="loading-shimmer w-12 h-12"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                  </div>
                  
                  {/* Title */}
                  <div className="mb-3">
                    <div className="loading-shimmer h-6 w-full mb-2" />
                    <div className="loading-shimmer h-6 w-3/4" />
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <div className="loading-shimmer h-4 w-full mb-2" />
                    <div className="loading-shimmer h-4 w-5/6" />
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
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
                  
                  {/* AI Compatibility */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="loading-shimmer h-4 w-24" />
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div 
                          key={i}
                          className="loading-shimmer w-8 h-8"
                          style={{ borderRadius: 'var(--radius-full)' }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div 
                    className="mt-auto pt-3 flex justify-between items-center"
                    style={{ borderTop: '1px solid var(--glass-border-subtle)' }}
                  >
                    <div className="loading-shimmer h-3 w-20" />
                    <div className="loading-shimmer h-3 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedTools.length > 0 ? (
          <div id="tools-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {displayedTools.map((tool, index) => (
              <div
                key={tool.id}
                data-tool-index={index}
                className="stagger-animation"
                style={{ 
                  animationDelay: `${(index % TOOLS_PER_PAGE) * 100}ms`,
                }}
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
          /* Empty State Aprimorado */
          <div className="text-center py-16">
            <div className="
              w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
              backdrop-blur-[20px] bg-gradient-to-br from-white/[0.15] to-white/[0.08]
              border border-white/[0.2] shadow-[0_8px_24px_rgba(0,0,0,0.15)]
            ">
              {filters.search ? (
                <Search className="w-10 h-10 text-white/60" />
              ) : (
                <ArchiveX className="w-10 h-10 text-white/60" />
              )}
            </div>

            {filters.search ? (
              <>
                <h3 className="text-2xl font-semibold text-white mb-2 drop-shadow-sm">
                  Nenhuma ferramenta encontrada para &quot;{filters.search}&quot;
                </h3>
                <p className="text-white/70 mb-6 drop-shadow-sm max-w-md mx-auto">
                  Experimente termos mais gerais ou explore nossas categorias populares
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-white mb-2 drop-shadow-sm">
                  Nenhuma ferramenta encontrada
                </h3>
                <p className="text-white/70 mb-6 drop-shadow-sm">
                  Tente ajustar seus filtros ou fazer uma nova busca
                </p>
              </>
            )}

            {/* Categorias Populares */}
            <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-lg mx-auto">
              {['Copywriting', 'SEO', 'Imagem', 'Análise', 'Marketing'].map(cat => (
                <button
                  key={cat}
                  onClick={() => updateFilter('category', cat as any)}
                  className="
                    px-4 py-2 rounded-full text-sm font-medium text-white
                    backdrop-blur-[16px] bg-white/[0.1] border border-white/[0.2]
                    hover:bg-white/[0.15] hover:border-white/[0.3] transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)]
                  "
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={clearFilters}
              className="
                px-6 py-3 rounded-xl text-white transition-all duration-300
                backdrop-blur-[20px] bg-gradient-to-br from-white/[0.2] to-white/[0.1]
                border border-white/[0.25] shadow-[0_4px_16px_rgba(0,0,0,0.15)]
                hover:from-white/[0.25] hover:to-white/[0.15] hover:-translate-y-0.5
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]
              "
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Enhanced Load More Button */}
        {hasMore && (
          <div className="text-center mb-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="
                px-8 py-4 text-white transition-all flex items-center gap-2 mx-auto 
                disabled:opacity-50 disabled:cursor-not-allowed focus-visible:focus-visible
              "
              style={{
                borderRadius: 'var(--radius-xl)',
                backdropFilter: 'blur(var(--glass-blur-intense))',
                background: 'linear-gradient(135deg, var(--glass-bg-strong) 0%, var(--glass-bg-medium) 100%)',
                border: '1px solid var(--glass-border-strong)',
                boxShadow: 'var(--shadow-lg)',
                transition: 'all var(--duration-fast) var(--ease-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--glass-bg-intense) 0%, var(--glass-bg-strong) 100%)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--glass-bg-strong) 0%, var(--glass-bg-medium) 100%)'
              }}
            >
              {isLoading ? (
                <>
                  <div 
                    className="w-5 h-5 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: 'var(--text-muted)',
                      borderTopColor: 'var(--text-primary)',
                    }}
                  />
                  <span style={{ color: 'var(--text-primary)' }}>Carregando...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Carregar mais ferramentas</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Enhanced Loading Skeleton for new content - Responsive */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {Array.from({ length: Math.min(TOOLS_PER_PAGE, filteredTools.length - displayedTools.length) }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="glass-card h-72 relative overflow-hidden"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {/* Enhanced Skeleton Structure */}
                <div className="p-6 h-full flex flex-col">
                  {/* Category and Type Tags */}
                  <div className="flex justify-between items-start mb-4">
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
                      className="loading-shimmer w-12 h-12"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    />
                  </div>
                  
                  {/* Title */}
                  <div className="mb-3">
                    <div className="loading-shimmer h-6 w-full mb-2" />
                    <div className="loading-shimmer h-6 w-3/4" />
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <div className="loading-shimmer h-4 w-full mb-2" />
                    <div className="loading-shimmer h-4 w-5/6" />
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
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
                  
                  {/* AI Compatibility */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="loading-shimmer h-4 w-24" />
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div 
                          key={i}
                          className="loading-shimmer w-8 h-8"
                          style={{ borderRadius: 'var(--radius-full)' }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div 
                    className="mt-auto pt-3 flex justify-between items-center"
                    style={{ borderTop: '1px solid var(--glass-border-subtle)' }}
                  >
                    <div className="loading-shimmer h-3 w-20" />
                    <div className="loading-shimmer h-3 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Drawer Component */}
      <ToolsFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        filters={filters}
        onFiltersChange={updateFilters}
        categories={categories}
      />

      {/* Overlay para garantir cobertura do background */}
      <BackgroundOverlay />

      {/* Tool Modal (mesmo da Dashboard) */}
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-sm text-white/60">Carregando ferramentas...</p>
    </div>
  )
}
