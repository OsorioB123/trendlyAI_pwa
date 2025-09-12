'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal,
  Plus,
  ArchiveX
} from 'lucide-react'
import Header from '../../components/layout/Header'
import ToolCard from '../../components/tools/ToolCard'
import ToolsFiltersDrawer from '../../components/tools/ToolsFiltersDrawer'
import ToolModal from '../../components/tools/ToolModal'

// Enhanced Loading States
import { 
  InitialLoadingSkeleton,
  LoadMoreSkeleton,
  SearchLoadingState,
  LoadMoreButtonLoading 
} from '../../components/tools/LoadingStates'

// Error States
import { 
  NetworkErrorState,
  ServerErrorState,
  EmptySearchState,
  GenericErrorState 
} from '../../components/tools/ErrorStates'

import { HeaderVariant } from '../../types/header'
import { Tool, ToolsFilters, ToolCategory, ToolType, AICompatibility } from '../../types/tool'
import { useBackground } from '../../contexts/BackgroundContext'

// Mock data baseado no HTML de referência e UX research
const MOCK_TOOLS: Tool[] = [
  {
    id: "p01",
    title: "Roteiro Viral em 30 Segundos",
    description: "Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.",
    category: "Copywriting",
    type: "text-generation",
    compatibility: ["ChatGPT", "Claude", "Gemini"],
    tags: ["roteiro", "storytelling", "reels"],
    content: `Você é um roteirista viral especializado em conteúdo de redes sociais...`,
    isFavorite: false,
    isEdited: true
  },
  {
    id: "p02",
    title: "Títulos Otimizados para SEO",
    description: "Gere títulos magnéticos e otimizados para os mecanismos de busca que aumentam o CTR.",
    category: "SEO",
    type: "text-generation",
    compatibility: ["ChatGPT", "Claude"],
    tags: ["seo", "títulos", "blog"],
    content: `Crie 5 títulos SEO-otimizados para o seguinte conteúdo...`,
    isFavorite: false,
    isEdited: false
  },
  {
    id: "p03",
    title: "Cenário 3D Fotorrealista",
    description: "Crie um prompt detalhado para gerar uma cena de floresta mística ao amanhecer.",
    category: "Imagem",
    type: "image-generation",
    compatibility: ["Midjourney", "DALL-E", "Stable Diffusion"],
    tags: ["3d", "cenário", "iluminação"],
    content: "/imagine prompt: mystical forest at golden hour...",
    isFavorite: false,
    isEdited: false
  },
  {
    id: "p04",
    title: "Análise de Sentimento de Comentários",
    description: "Analise um bloco de texto e classifique o sentimento predominante (positivo, negativo, neutro).",
    category: "Análise",
    type: "data-analysis",
    compatibility: ["ChatGPT", "Claude", "Gemini"],
    tags: ["dados", "sentimento", "feedback"],
    content: `Analise os seguintes comentários e classifique o sentimento...`,
    isFavorite: true,
    isEdited: false
  },
  {
    id: "p05",
    title: "Pesquisa de Mercado Profunda",
    description: "Execute uma pesquisa aprofundada sobre um nicho de mercado, identificando concorrentes e oportunidades.",
    category: "Negócios",
    type: "research",
    compatibility: ["ChatGPT", "Claude"],
    tags: ["pesquisa", "mercado", "estratégia"],
    content: `Conduza uma análise completa do mercado para o seguinte nicho...`,
    isFavorite: false,
    isEdited: true
  },
  {
    id: "p06",
    title: "Gerador de Persona Detalhada",
    description: "Construa uma persona de cliente completa com dores, desejos, demografia e comportamento.",
    category: "Marketing",
    type: "text-generation",
    compatibility: ["ChatGPT", "Claude", "Gemini"],
    tags: ["persona", "público-alvo"],
    content: `Crie uma persona detalhada para o seguinte produto/serviço...`,
    isFavorite: false,
    isEdited: false
  },
  {
    id: "p07",
    title: "Copy de Vendas (AIDA)",
    description: "Crie textos persuasivos que convertem usando o framework AIDA (Atenção, Interesse, Desejo, Ação).",
    category: "Copywriting",
    type: "text-generation",
    compatibility: ["ChatGPT", "Claude"],
    tags: ["copywriting", "vendas", "aida"],
    content: `Escreva uma copy de vendas persuasiva usando o framework AIDA...`,
    isFavorite: true,
    isEdited: false
  },
  {
    id: "p08",
    title: "Ícone de App Estilo 'Liquid Glass'",
    description: "Gere um ícone de aplicativo moderno com efeito de vidro líquido e gradientes suaves.",
    category: "Design",
    type: "image-generation",
    compatibility: ["Midjourney", "DALL-E"],
    tags: ["ícone", "ui", "design"],
    content: "/imagine prompt: app icon design, liquid glass effect...",
    isFavorite: false,
    isEdited: false
  }
]

const ALL_CATEGORIES: ToolCategory[] = ['Copywriting', 'SEO', 'Imagem', 'Análise', 'Negócios', 'Marketing', 'Design']
const TOOL_TYPES: ToolType[] = ['text-generation', 'image-generation', 'data-analysis', 'research']
const AI_COMPATIBILITY: AICompatibility[] = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E', 'Stable Diffusion']

const TOOLS_PER_PAGE = 6

// Error types for better error handling
enum ErrorType {
  NETWORK = 'network',
  SERVER = 'server',
  TIMEOUT = 'timeout',
  GENERIC = 'generic'
}

// Memoized ToolCard for performance
const MemoizedToolCard = memo(ToolCard, (prevProps, nextProps) => {
  return (
    prevProps.tool.id === nextProps.tool.id &&
    prevProps.isFavorited === nextProps.isFavorited
  )
})

export default function EnhancedToolsPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  
  // Loading States
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  // Error States
  const [error, setError] = useState<{ type: ErrorType; message: string } | null>(null)
  
  // Data States
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(TOOLS_PER_PAGE)
  const [favorites, setFavorites] = useState<string[]>([])
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

  // Simulate initial loading with realistic timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1200) // Realistic API response time
    
    return () => clearTimeout(timer)
  }, [])

  // Enhanced debounce search with loading states
  useEffect(() => {
    if (!searchTerm && !filters.search) return

    setIsSearching(true)
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
      setDisplayedCount(TOOLS_PER_PAGE)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Enhanced error recovery
  const retryOperation = useCallback(async () => {
    setError(null)
    setIsInitialLoading(true)
    
    try {
      // Simulate API retry
      await new Promise(resolve => setTimeout(resolve, 800))
      setIsInitialLoading(false)
    } catch (err) {
      setError({ 
        type: ErrorType.NETWORK, 
        message: 'Falha na reconexão' 
      })
      setIsInitialLoading(false)
    }
  }, [])

  // Mock favorites functionality with enhanced error handling
  const handleToggleFavorite = useCallback(async (tool: Tool) => {
    const toolId = tool.id
    
    // Optimistic update
    setFavorites(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )

    try {
      // Mock API call delay with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) { // 10% failure rate for testing
            reject(new Error('Network error'))
          } else {
            resolve(true)
          }
        }, 200)
      })
    } catch (error) {
      // Revert optimistic update on error
      setFavorites(prev => 
        prev.includes(toolId) 
          ? [...prev, toolId]
          : prev.filter(id => id !== toolId)
      )
      setError({ 
        type: ErrorType.NETWORK, 
        message: 'Falha ao atualizar favorito' 
      })
      setTimeout(() => setError(null), 3000)
    }
  }, [])

  // Optimized filter and sort with early returns
  const filteredTools = useMemo(() => {
    // Early return for no filters
    if (!filters.search && 
        filters.category === 'all' && 
        filters.type.length === 0 && 
        filters.compatibility.length === 0 && 
        filters.activity.length === 0) {
      return [...MOCK_TOOLS]
    }

    let result = [...MOCK_TOOLS]

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
  }, [filters, favorites])

  const displayedTools = useMemo(() => 
    filteredTools.slice(0, displayedCount), 
    [filteredTools, displayedCount]
  )
  
  const hasMore = useMemo(() => 
    displayedCount < filteredTools.length, 
    [displayedCount, filteredTools.length]
  )

  const handleToolClick = useCallback((tool: Tool) => {
    setSelectedTool(tool)
  }, [])

  // Enhanced load more with error handling
  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)
    
    try {
      // Mock loading delay with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.95) { // 5% failure rate
            reject(new Error('Load more failed'))
          } else {
            resolve(true)
          }
        }, 500)
      })
      
      setDisplayedCount(prev => Math.min(prev + TOOLS_PER_PAGE, filteredTools.length))
      
      // Smooth scroll to new content
      setTimeout(() => {
        const newCardIndex = displayedCount
        const newCard = document.querySelector(`[data-tool-index="${newCardIndex}"]`)
        if (newCard) {
          newCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      
    } catch (err) {
      setError({ 
        type: ErrorType.NETWORK, 
        message: 'Falha ao carregar mais ferramentas' 
      })
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsLoading(false)
    }
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
    setDisplayedCount(TOOLS_PER_PAGE)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<ToolsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setDisplayedCount(TOOLS_PER_PAGE)
  }, [])

  // Quick category filters
  const quickCategories: ToolCategory[] = ['Copywriting', 'SEO', 'Marketing', 'Design', 'Análise']

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'all') count++
    count += filters.type.length + filters.compatibility.length + filters.activity.length
    return count
  }, [filters])

  // Show error state if there's a critical error
  if (error?.type === ErrorType.NETWORK && isInitialLoading) {
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
        <div className="max-w-7xl mx-auto">
          <NetworkErrorState onRetry={retryOperation} />
        </div>
      </div>
    )
  }

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
            Explore todas as Ferramentas
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Descubra prompts e ferramentas de IA para potencializar sua criatividade
          </p>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-3 backdrop-blur-[20px] bg-white/10 border border-white/15 rounded-xl p-3 mb-6">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Busque por objetivo, técnica ou ferramenta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          
          {/* Category Dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value as 'all' | ToolCategory)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all" className="bg-gray-800">Todas as Categorias</option>
              {ALL_CATEGORIES.map(category => (
                <option key={category} value={category} className="bg-gray-800">{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
          </div>
          
          {/* Filters Button */}
          <div className="md:col-span-2 relative">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="w-full h-12 flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 text-white hover:bg-white/10 transition-all"
            >
              <span className="truncate pr-2">Filtros</span>
              <SlidersHorizontal className="w-4 h-4 text-white/60" />
              {activeFiltersCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-white/90 text-gray-900 w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {activeFiltersCount}
                </div>
              )}
            </button>
          </div>
          
          {/* Sort Dropdown */}
          <div className="md:col-span-1 relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value as 'relevance' | 'recent')}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="relevance" className="bg-gray-800">Relevantes</option>
              <option value="recent" className="bg-gray-800">Recentes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quickCategories.map((category, index) => (
            <button
              key={category}
              onClick={() => updateFilter('category', filters.category === category ? 'all' : category)}
              className={`
                px-3 py-2 text-sm rounded-full backdrop-blur-[10px] border transition-all duration-200
                ${filters.category === category
                  ? 'bg-white/20 text-white border-white/40'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
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
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Pesquisando...
              </span>
            ) : (
              `Exibindo ${displayedTools.length} de ${filteredTools.length} ferramentas`
            )}
          </p>
          
          {(filters.search || filters.category !== 'all' || activeFiltersCount > 0) && (
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
            <p className="font-medium">{error.message}</p>
          </div>
        )}

        {/* Search Loading State */}
        {isSearching && (
          <SearchLoadingState searchTerm={searchTerm} />
        )}

        {/* Initial Loading Skeleton */}
        {isInitialLoading ? (
          <InitialLoadingSkeleton count={TOOLS_PER_PAGE} />
        ) : (
          <>
            {/* Tools Grid or Empty State */}
            {displayedTools.length > 0 ? (
              <div id="tools-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    data-tool-index={index}
                    className="stagger-animation"
                    style={{ 
                      animationDelay: `${(index % TOOLS_PER_PAGE) * 100}ms`,
                    }}
                  >
                    <MemoizedToolCard
                      tool={tool}
                      onClick={handleToolClick}
                      onFavorite={handleToggleFavorite}
                      isFavorited={favorites.includes(tool.id)}
                    />
                  </div>
                ))}
              </div>
            ) : !isSearching ? (
              /* Empty State */
              filteredTools.length === 0 && filters.search ? (
                <EmptySearchState 
                  searchTerm={filters.search} 
                  onClearSearch={clearFilters} 
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                    <ArchiveX className="w-10 h-10 text-white/60" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Nenhuma ferramenta encontrada
                  </h3>
                  <p className="text-white/70 mb-6">
                    Tente ajustar seus filtros ou fazer uma nova busca
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/25 transition-all"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              )
            ) : null}
          </>
        )}

        {/* Load More Skeleton */}
        {isLoading && (
          <LoadMoreSkeleton 
            count={Math.min(TOOLS_PER_PAGE, filteredTools.length - displayedTools.length)} 
          />
        )}

        {/* Load More Button */}
        {hasMore && !isInitialLoading && (
          isLoading ? (
            <LoadMoreButtonLoading />
          ) : (
            <div className="text-center mb-12">
              <button
                onClick={handleLoadMore}
                className="px-8 py-4 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Carregar mais ferramentas
              </button>
            </div>
          )
        )}
      </div>

      {/* Filters Drawer Component */}
      <ToolsFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* Tool Modal */}
      <ToolModal
        tool={selectedTool}
        isOpen={selectedTool !== null}
        onClose={() => setSelectedTool(null)}
        onCopy={(content) => {
          navigator.clipboard.writeText(content)
          console.log('Prompt copiado!')
        }}
        onSave={(toolId, content) => {
          console.log('Tool saved:', toolId, content)
          return Promise.resolve()
        }}
      />
    </div>
  )
}