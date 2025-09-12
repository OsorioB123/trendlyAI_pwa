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
import { useTracks } from '../../hooks/useTracks'
import { useAuth } from '../../contexts/AuthContext'

const TRACKS_PER_PAGE = 6

// Extract all unique categories from tracks
const extractCategories = (tracks: Track[]): string[] => {
  const categoriesSet = new Set<string>()
  tracks.forEach(track => {
    track.categories.forEach(category => categoriesSet.add(category))
    if (track.category) categoriesSet.add(track.category)
  })
  return Array.from(categoriesSet).sort()
}

const LEVELS = ['Iniciante', 'Intermediário', 'Avançado']
const STATUS = ['nao_iniciado', 'em_andamento', 'concluido']

export default function TracksPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { isAuthenticated } = useAuth()
  
  // Use the custom tracks hook
  const {
    tracks,
    loading: tracksLoading,
    error: tracksError,
    toggleFavorite,
    filterTracks,
    isTrackFavorited,
    refreshTracks
  } = useTracks()
  
  // Component state
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(TRACKS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<TracksFilters>({
    search: '',
    categories: [],
    levels: [],
    status: [],
    sort: 'top'
  })
  
  // Extract categories from loaded tracks
  const allCategories = useMemo(() => extractCategories(tracks), [tracks])

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
      setDisplayedCount(TRACKS_PER_PAGE) // Reset pagination
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Handle favorite toggle with real API integration
  const handleToggleFavorite = useCallback(async (track: Track) => {
    if (!isAuthenticated) {
      setError('Você precisa estar logado para favoritar trilhas')
      setTimeout(() => setError(null), 3000)
      return
    }

    const trackId = track.id.toString()
    
    try {
      await toggleFavorite(trackId)
    } catch (error) {
      setError('Falha ao atualizar favorito')
      setTimeout(() => setError(null), 3000)
    }
  }, [isAuthenticated, toggleFavorite])

  // Show tracks loading error if it exists
  useEffect(() => {
    if (tracksError) {
      setError(tracksError)
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [tracksError])

  // Filter and sort tracks using the hook
  const filteredTracks = useMemo(() => {
    return filterTracks(filters)
  }, [filters, filterTracks])

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
    setIsLoadingMore(true)
    
    // Add a small delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setDisplayedCount(prev => Math.min(prev + TRACKS_PER_PAGE, filteredTracks.length))
    setIsLoadingMore(false)
    
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

  // Quick category filters - get first 5 most common categories
  const quickCategories = useMemo(() => {
    return allCategories.slice(0, 5)
  }, [allCategories])

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

        {/* Loading State */}
        {tracksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: TRACKS_PER_PAGE }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="h-80 rounded-2xl loading-shimmer"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
        ) : displayedTracks.length > 0 ? (
          /* Tracks Grid */
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
                  isFavorited={isTrackFavorited(track.id.toString())}
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
        {hasMore && !tracksLoading && (
          <div className="text-center mb-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-4 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed liquid-glass-pill"
            >
              {isLoadingMore ? (
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
        {isLoadingMore && (
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
        availableCategories={allCategories}
      />
    </div>
  )
}