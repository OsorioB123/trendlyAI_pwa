'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal,
  X,
  Plus,
  ArchiveX
} from 'lucide-react'
import Header from '../../components/layout/Header'
import ToolCard from '../../components/tools/ToolCard'
import ToolsFiltersDrawer from '../../components/tools/ToolsFiltersDrawer'
import ToolModal from '../../components/tools/ToolModal'
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
    content: `Você é um roteirista viral especializado em conteúdo de redes sociais...

[INSTRUÇÕES]
Crie um roteiro viral de 30 segundos seguindo a estrutura:

1. GANCHO (0-3s): Uma frase ou pergunta que prende a atenção imediatamente
2. DESENVOLVIMENTO (3-25s): Conte a história ou apresente o conteúdo principal
3. CALL TO ACTION (25-30s): Termine com um convite claro para engajamento

[TÓPICO]
{seu_topico_aqui}

[OUTPUT]
Formate como roteiro com timing e direções visuais.`,
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
    content: `Crie 5 títulos SEO-otimizados para o seguinte conteúdo...

[DIRETRIZES]
- Máximo 60 caracteres
- Inclua a palavra-chave principal no início
- Use power words (como 'definitivo', 'completo', 'secreto')
- Crie urgência ou curiosidade
- Seja específico com números quando possível

[CONTEÚDO]
{seu_conteudo_aqui}

[PALAVRA-CHAVE]
{palavra_chave_principal}

[OUTPUT]
Retorne 5 opções numeradas com explicação do por que cada uma funciona.`,
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
    content: "/imagine prompt: mystical forest at golden hour, ancient towering trees with twisted branches, soft volumetric light rays piercing through morning mist, moss-covered fallen logs, delicate wildflowers scattered on forest floor, ethereal atmosphere, photorealistic 3D render, octane render, ultra detailed, 8k resolution, cinematic lighting, depth of field, fantasy environment --ar 16:9 --v 6 --style raw",
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
    content: `Analise os seguintes comentários e classifique o sentimento de cada um...

[INSTRUÇÕES]
- Classifique cada comentário como: POSITIVO, NEGATIVO ou NEUTRO
- Forneça um score de 1-10 para intensidade do sentimento
- Identifique as palavras-chave que determinaram a classificação
- Resuma o sentimento geral no final

[COMENTÁRIOS]
{cole_os_comentarios_aqui}

[OUTPUT]
Formato:
Comentário 1: [SENTIMENTO] - Score: X/10
Palavras-chave: [palavras]

Resumo geral: [análise_completa]`,
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
    content: `Conduza uma análise completa do mercado para o seguinte nicho...

[ESTRUTURA DA ANÁLISE]
1. Visão geral do mercado (tamanho, crescimento, tendências)
2. Análise de concorrentes (top 5 players principais)
3. Público-alvo (demographics, comportamento, dores)
4. Oportunidades de mercado (gaps não atendidos)
5. Ameaças e desafios
6. Recomendações estratégicas

[NICHO]
{seu_nicho_aqui}

[OUTPUT]
Formate como relatório executivo com dados específicos e insights acionáveis.`,
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
    content: `Crie uma persona detalhada para o seguinte produto/serviço...

[ESTRUTURA DA PERSONA]
📊 DEMOGRAFIA
- Nome e idade
- Localização e renda
- Profissão e educação
- Estado civil e família

🎯 PSICOGRAFIA
- Personalidade e valores
- Interesses e hobbies
- Estilo de vida

😰 DORES E DESAFIOS
- Principais problemas
- Frustrações diárias
- Medos e objeções

💫 OBJETIVOS E DESEJOS
- Aspirações de vida
- Metas profissionais
- Desejos secretos

📱 COMPORTAMENTO DIGITAL
- Redes sociais preferidas
- Hábitos de consumo de conteúdo
- Jornada de compra

[PRODUTO/SERVIÇO]
{seu_produto_servico_aqui}`,
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
    content: `Escreva uma copy de vendas persuasiva usando o framework AIDA...

[ESTRUTURA AIDA]
🎯 ATENÇÃO
- Headline impactante
- Estatística ou pergunta provocativa
- Promessa específica

🔥 INTERESSE
- Desenvolva o problema
- Conte uma história relacionável
- Apresente credibilidade

💎 DESEJO
- Benefícios transformadores
- Prova social (depoimentos)
- Urgência/escassez

⚡ AÇÃO
- Call-to-action claro
- Garantia/redução de risco
- Instruções específicas

[PRODUTO/SERVIÇO]
{seu_produto_aqui}

[PÚBLICO-ALVO]
{sua_persona_aqui}

[OUTPUT]
Copy completa otimizada para conversão.`,
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
    content: "/imagine prompt: app icon design, liquid glass effect, translucent material with soft gradients from blue to purple, subtle reflections and refractions, minimal geometric shape, glossy surface, depth and dimension, modern clean aesthetic, rounded square format, high quality 3D render, professional app store style, octane render, 1024x1024 resolution --ar 1:1 --v 6 --style raw",
    isFavorite: false,
    isEdited: false
  }
]

const ALL_CATEGORIES: ToolCategory[] = ['Copywriting', 'SEO', 'Imagem', 'Análise', 'Negócios', 'Marketing', 'Design']
const TOOL_TYPES: ToolType[] = ['text-generation', 'image-generation', 'data-analysis', 'research']
const AI_COMPATIBILITY: AICompatibility[] = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E', 'Stable Diffusion']

const TOOLS_PER_PAGE = 6

export default function ToolsPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(TOOLS_PER_PAGE)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
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

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
      setDisplayedCount(TOOLS_PER_PAGE) // Reset pagination
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Mock favorites functionality with loading state
  const handleToggleFavorite = useCallback(async (tool: Tool) => {
    const toolId = tool.id
    
    // Optimistic update
    setFavorites(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 200))
      // Here you would make the actual API call
    } catch (error) {
      // Revert optimistic update on error
      setFavorites(prev => 
        prev.includes(toolId) 
          ? [...prev, toolId]
          : prev.filter(id => id !== toolId)
      )
      setError('Falha ao atualizar favorito')
      setTimeout(() => setError(null), 3000)
    }
  }, [])

  // Filter and sort tools
  const filteredTools = useMemo(() => {
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
  }, [])

  const updateFilters = useCallback((newFilters: Partial<ToolsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setDisplayedCount(TOOLS_PER_PAGE)
  }, [])

  // Quick category filters (based on most popular from HTML reference)
  const quickCategories: ToolCategory[] = ['Copywriting', 'SEO', 'Marketing', 'Design', 'Análise']

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category !== 'all') count++
    count += filters.type.length + filters.compatibility.length + filters.activity.length
    return count
  }, [filters])

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

        {/* Control Panel - Based on HTML Reference */}
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
            Exibindo {displayedTools.length} de {filteredTools.length} ferramentas
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
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Tools Grid */}
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
          /* Empty State */
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
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mb-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-4 rounded-xl backdrop-blur-[20px] bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Carregar mais ferramentas
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading Skeleton for new content */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: Math.min(TOOLS_PER_PAGE, filteredTools.length - displayedTools.length) }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-64 rounded-2xl animate-pulse bg-white/10"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              />
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
      />

      {/* Tool Modal */}
      <ToolModal
        tool={selectedTool}
        isOpen={selectedTool !== null}
        onClose={() => setSelectedTool(null)}
        onCopy={(content) => {
          navigator.clipboard.writeText(content)
          // Show toast notification (can be enhanced later)
          console.log('Prompt copiado!')
        }}
        onSave={(toolId, content) => {
          // Handle save logic here
          console.log('Tool saved:', toolId, content)
          return Promise.resolve()
        }}
      />
    </div>
  )
}