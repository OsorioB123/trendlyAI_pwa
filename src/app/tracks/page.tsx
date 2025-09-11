'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react'
import Header from '../../components/layout/Header'
import TrackCardFull from '../../components/cards/TrackCardFull'
import FiltersDrawer from '../../components/tracks/FiltersDrawer'
import { HeaderVariant } from '../../types/header'
import { Track, TracksFilters } from '../../types/track'
import { useBackground } from '../../contexts/BackgroundContext'

// Mock data baseado no HTML de referência
const MOCK_TRACKS: Track[] = [
  {
    id: 1,
    title: 'Narrativa para Storytelling Digital',
    progress: 45,
    backgroundImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
    categories: ['Narrativa', 'Storytelling'],
    level: 'Iniciante',
    status: 'em_andamento',
    tags: ['Narrativa', 'Storytelling']
  },
  {
    id: 2,
    title: 'Análise de Tendências Digitais',
    progress: 0,
    backgroundImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    categories: ['Análise', 'Tendências'],
    level: 'Intermediário',
    status: 'nao_iniciado',
    tags: ['Análise', 'Tendências']
  },
  {
    id: 3,
    title: 'Criação de Conteúdo Visual',
    progress: 100,
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    categories: ['Design', 'Visual'],
    level: 'Avançado',
    status: 'concluido',
    tags: ['Design', 'Visual']
  },
  {
    id: 4,
    title: 'Marketing de Influência',
    progress: 78,
    backgroundImage: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400&q=80',
    categories: ['Marketing', 'Influência'],
    level: 'Intermediário',
    status: 'em_andamento',
    tags: ['Marketing', 'Influência']
  },
  {
    id: 5,
    title: 'SEO e Otimização de Conteúdo',
    progress: 23,
    backgroundImage: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&q=80',
    categories: ['SEO', 'Otimização'],
    level: 'Iniciante',
    status: 'em_andamento',
    tags: ['SEO', 'Otimização']
  },
  {
    id: 6,
    title: 'Produção de Vídeo para Redes Sociais',
    progress: 0,
    backgroundImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80',
    categories: ['Vídeo', 'Redes Sociais'],
    level: 'Avançado',
    status: 'nao_iniciado',
    tags: ['Vídeo', 'Redes Sociais']
  },
  {
    id: 7,
    title: 'Estratégias de Engajamento',
    progress: 89,
    backgroundImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80',
    categories: ['Estratégia', 'Engajamento'],
    level: 'Intermediário',
    status: 'em_andamento',
    tags: ['Estratégia', 'Engajamento']
  },
  {
    id: 8,
    title: 'Análise de Métricas Digitais',
    progress: 34,
    backgroundImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
    categories: ['Análise', 'Métricas'],
    level: 'Avançado',
    status: 'em_andamento',
    tags: ['Análise', 'Métricas']
  },
  {
    id: 9,
    title: 'Copywriting Persuasivo',
    progress: 67,
    backgroundImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=80',
    categories: ['Copywriting', 'Persuasão'],
    level: 'Iniciante',
    status: 'em_andamento',
    tags: ['Copywriting', 'Persuasão']
  }
]

const ALL_CATEGORIES = ['Narrativa', 'Storytelling', 'Análise', 'Tendências', 'Design', 'Visual', 'Marketing', 'Influência', 'SEO', 'Otimização', 'Vídeo', 'Redes Sociais', 'Estratégia', 'Engajamento', 'Métricas', 'Copywriting', 'Persuasão']
const LEVELS = ['Iniciante', 'Intermediário', 'Avançado']
const STATUS = ['nao_iniciado', 'em_andamento', 'concluido']

const TRACKS_PER_PAGE = 6

export default function TracksPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(TRACKS_PER_PAGE)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [filters, setFilters] = useState<TracksFilters>({
    search: '',
    categories: [],
    levels: [],
    status: [],
    sort: 'top'
  })

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
      setDisplayedCount(TRACKS_PER_PAGE) // Reset pagination
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Mock favorites functionality with loading state
  const handleToggleFavorite = useCallback(async (track: Track) => {
    const trackId = track.id.toString()
    
    // Optimistic update
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 200))
      // Here you would make the actual API call
    } catch (error) {
      // Revert optimistic update on error
      setFavorites(prev => 
        prev.includes(trackId) 
          ? [...prev, trackId]
          : prev.filter(id => id !== trackId)
      )
      setError('Falha ao atualizar favorito')
      setTimeout(() => setError(null), 3000)
    }
  }, [])

  // Filter and sort tracks
  const filteredTracks = useMemo(() => {
    let result = [...MOCK_TRACKS]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.categories.some(cat => cat.toLowerCase().includes(searchTerm))
      )
    }

    // Categories filter
    if (filters.categories.length > 0) {
      result = result.filter(track => 
        track.categories.some(cat => filters.categories.includes(cat))
      )
    }

    // Levels filter
    if (filters.levels.length > 0) {
      result = result.filter(track => filters.levels.includes(track.level))
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(track => filters.status.includes(track.status))
    }

    // Sort
    if (filters.sort === 'recent') {
      result.sort((a, b) => b.id.toString().localeCompare(a.id.toString()))
    } else {
      // 'top' - sort by progress and favorites
      result.sort((a, b) => {
        const aFavorited = favorites.includes(a.id.toString()) ? 1 : 0
        const bFavorited = favorites.includes(b.id.toString()) ? 1 : 0
        
        if (aFavorited !== bFavorited) return bFavorited - aFavorited
        return b.progress - a.progress
      })
    }

    return result
  }, [filters, favorites])

  const displayedTracks = useMemo(() => 
    filteredTracks.slice(0, displayedCount), 
    [filteredTracks, displayedCount]
  )
  
  const hasMore = useMemo(() => 
    displayedCount < filteredTracks.length, 
    [displayedCount, filteredTracks.length]
  )

  const handleTrackClick = useCallback((track: Track) => {
    router.push(`/tracks/${track.id}`)
  }, [router])

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)
    
    // Mock loading delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setDisplayedCount(prev => Math.min(prev + TRACKS_PER_PAGE, filteredTracks.length))
    setIsLoading(false)
    
    // Smooth scroll to new content
    setTimeout(() => {
      const newCardIndex = displayedCount
      const newCard = document.querySelector(`[data-track-index="${newCardIndex}"]`)
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }, [displayedCount, filteredTracks.length])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setFilters({
      search: '',
      categories: [],
      levels: [],
      status: [],
      sort: 'top'
    })
    setDisplayedCount(TRACKS_PER_PAGE)
  }, [])

  const updateFilter = useCallback(<K extends keyof TracksFilters>(
    key: K,
    value: TracksFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setDisplayedCount(TRACKS_PER_PAGE) // Reset pagination when filtering
  }, [])

  const updateFilters = useCallback((newFilters: Partial<TracksFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setDisplayedCount(TRACKS_PER_PAGE)
  }, [])

  const toggleArrayFilter = useCallback(<K extends keyof Pick<TracksFilters, 'categories' | 'levels' | 'status'>>(
    key: K,
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }))
    setDisplayedCount(TRACKS_PER_PAGE)
  }, [])

  // Quick category filters
  const quickCategories = ['Narrativa', 'Marketing', 'Design', 'SEO', 'Vídeo']

  return (
    <div 
      className="min-h-screen pt-24 px-4"
      style={{
        backgroundImage: `url('${currentBackground.value}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore todas as Trilhas
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Desenvolva suas habilidades através de trilhas estruturadas e práticas
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar trilhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all enhanced-search-bar"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[200px] custom-select-panel">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value as 'top' | 'recent')}
              className="w-full px-4 py-3 pr-10 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
            >
              <option value="top" className="bg-gray-800">Mais relevantes</option>
              <option value="recent" className="bg-gray-800">Mais recentes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFiltersDrawer(true)}
            className="px-6 py-3 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filtros
          </button>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quickCategories.map((category, index) => (
            <button
              key={category}
              onClick={() => toggleArrayFilter('categories', category)}
              className={`
                liquid-glass-tag filter-chip transition-all duration-200
                ${filters.categories.includes(category)
                  ? 'active bg-white/20 text-white border-2 border-white/40'
                  : 'bg-white/10 text-white/80 border border-white/15 hover:bg-white/15'
                }
              `}
              style={{ 
                animationDelay: `${index * 50}ms`,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-white/80">
            Exibindo {displayedTracks.length} de {filteredTracks.length} trilhas
          </p>
          
          {(filters.search || filters.categories.length > 0 || filters.levels.length > 0 || filters.status.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-white/80 hover:text-white text-sm underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Error Toast */}
        {error && (
          <div className="fixed top-24 right-4 z-50 p-4 rounded-lg bg-red-500/90 backdrop-blur-md text-white border border-red-400/50 shadow-lg animate-fade-in-up">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Tracks Grid */}
        {displayedTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedTracks.map((track, index) => (
              <div
                key={track.id}
                data-track-index={index}
                className="stagger-animation interactive-card card-glow"
                style={{ 
                  animationDelay: `${(index % TRACKS_PER_PAGE) * 100}ms`,
                }}
              >
                <TrackCardFull
                  track={track}
                  onClick={handleTrackClick}
                  onFavorite={handleToggleFavorite}
                  isFavorited={favorites.includes(track.id.toString())}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Nenhuma trilha encontrada
            </h3>
            <p className="text-white/70 mb-6">
              Tente ajustar seus filtros ou fazer uma nova busca
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/25 transition-all"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mb-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-4 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed liquid-glass-pill"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Carregar mais trilhas
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading Skeleton for new content */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: Math.min(TRACKS_PER_PAGE, filteredTracks.length - displayedTracks.length) }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-80 rounded-2xl loading-shimmer"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filters Drawer Component */}
      <FiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        filters={filters}
        onFiltersChange={updateFilters}
      />
    </div>
  )
}