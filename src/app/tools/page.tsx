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

  // Initial loading simulation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1200) // Simulate initial data fetch

    return () => clearTimeout(loadingTimer)
  }, [])

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

        {/* Enhanced Control Panel with Advanced Liquid Glass - Tablet-Optimized */}
        <div className="
          grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 p-3 mb-6 rounded-xl overflow-hidden
          relative backdrop-blur-[36px] 
          shadow-[0_8px_32px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.05)]
        ">
          {/* Advanced Glass Background */}
          <div className="absolute inset-0">
            {/* Base frosted layer */}
            <div 
              className="absolute inset-0 backdrop-blur-[32px]"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255,255,255,0.12) 0%,
                    rgba(255,255,255,0.08) 35%,
                    rgba(255,255,255,0.04) 100%
                  ),
                  radial-gradient(circle at 20% 20%, 
                    rgba(255,255,255,0.08) 0%,
                    transparent 50%
                  ),
                  radial-gradient(circle at 80% 80%, 
                    rgba(255,255,255,0.06) 0%,
                    transparent 50%
                  )
                `,
              }}
            />
            
            {/* Texture noise overlay */}
            <div 
              className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='1'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.6'/%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Border highlight */}
            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1px',
              }}
            />
          </div>
          
          {/* Search Bar - Enhanced Glass - Responsive Span */}
          <div className="md:col-span-4 lg:col-span-5 xl:col-span-6 relative z-10">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Busque por objetivo, técnica ou ferramenta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full h-12 py-2.5 pl-12 pr-4 text-white placeholder-white/50 rounded-xl
                backdrop-blur-[20px] bg-gradient-to-br from-white/[0.08] to-white/[0.04]
                border border-white/[0.12] transition-all duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]
                focus:outline-none focus:from-white/[0.12] focus:to-white/[0.06] 
                focus:border-white/[0.2] focus:shadow-[0_4px_16px_rgba(0,0,0,0.15),0_0_0_2px_rgba(255,255,255,0.1)]
              "
            />
          </div>
          
          {/* Category Dropdown - Enhanced Glass - Responsive Span */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 relative z-10">
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value as 'all' | ToolCategory)}
              className="
                w-full h-12 px-4 text-white appearance-none cursor-pointer rounded-xl
                backdrop-blur-[20px] bg-gradient-to-br from-white/[0.08] to-white/[0.04]
                border border-white/[0.12] transition-all duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]
                focus:outline-none focus:from-white/[0.12] focus:to-white/[0.06] 
                focus:border-white/[0.2] focus:shadow-[0_4px_16px_rgba(0,0,0,0.15),0_0_0_2px_rgba(255,255,255,0.1)]
              "
            >
              <option value="all" className="bg-gray-800">Todas as Categorias</option>
              {ALL_CATEGORIES.map(category => (
                <option key={category} value={category} className="bg-gray-800">{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
          </div>
          
          {/* Filters Button - Enhanced Glass - Responsive Span */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 relative z-10">
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="
                w-full h-12 flex items-center justify-between px-4 text-white rounded-xl transition-all duration-300
                backdrop-blur-[20px] bg-gradient-to-br from-white/[0.08] to-white/[0.04]
                border border-white/[0.12] 
                shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]
                hover:from-white/[0.12] hover:to-white/[0.06] hover:border-white/[0.15]
                hover:shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]
                focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)]
              "
            >
              <span className="truncate pr-2">Filtros</span>
              <SlidersHorizontal className="w-4 h-4 text-white/60" />
              {activeFiltersCount > 0 && (
                <div className="
                  absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-semibold 
                  flex items-center justify-center text-gray-900
                  backdrop-blur-[16px] bg-gradient-to-br from-white/[0.9] to-white/[0.8]
                  border border-white/[0.3] shadow-[0_2px_6px_rgba(0,0,0,0.15)]
                ">
                  {activeFiltersCount}
                </div>
              )}
            </button>
          </div>
          
          {/* Sort Dropdown - Enhanced Glass - Responsive Span */}
          <div className="md:col-span-0 md:hidden lg:block lg:col-span-1 xl:col-span-1 relative z-10">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value as 'relevance' | 'recent')}
              className="
                w-full h-12 px-4 text-white appearance-none cursor-pointer rounded-xl
                backdrop-blur-[20px] bg-gradient-to-br from-white/[0.08] to-white/[0.04]
                border border-white/[0.12] transition-all duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]
                focus:outline-none focus:from-white/[0.12] focus:to-white/[0.06] 
                focus:border-white/[0.2] focus:shadow-[0_4px_16px_rgba(0,0,0,0.15),0_0_0_2px_rgba(255,255,255,0.1)]
              "
            >
              <option value="relevance" className="bg-gray-800">Relevantes</option>
              <option value="recent" className="bg-gray-800">Recentes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
          </div>
        </div>
        
        {/* Mobile/Tablet Sort Dropdown - Shows when main sort is hidden */}
        <div className="md:block lg:hidden mb-4">
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value as 'relevance' | 'recent')}
              className="
                w-full h-12 px-4 text-white appearance-none cursor-pointer rounded-xl
                backdrop-blur-[20px] bg-gradient-to-br from-white/[0.08] to-white/[0.04]
                border border-white/[0.12] transition-all duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]
                focus:outline-none focus:from-white/[0.12] focus:to-white/[0.06] 
                focus:border-white/[0.2] focus:shadow-[0_4px_16px_rgba(0,0,0,0.15),0_0_0_2px_rgba(255,255,255,0.1)]
              "
            >
              <option value="relevance" className="bg-gray-800">🔥 Mais Relevantes</option>
              <option value="recent" className="bg-gray-800">⏰ Mais Recentes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
          </div>
        </div>

        {/* Enhanced Quick Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quickCategories.map((category, index) => (
            <button
              key={category}
              onClick={() => updateFilter('category', filters.category === category ? 'all' : category)}
              className={`
                px-3 py-2 text-sm rounded-full transition-all duration-300 backdrop-blur-[16px]
                shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]
                hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]
                hover:-translate-y-0.5
                ${filters.category === category
                  ? 'bg-gradient-to-br from-white/[0.25] to-white/[0.15] text-white border border-white/[0.3]'
                  : 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] text-white/80 border border-white/[0.12] hover:from-white/[0.12] hover:to-white/[0.06]'
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
          <p className="text-white/80 drop-shadow-sm">
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
          <div className="
            fixed top-24 right-4 z-50 p-4 rounded-lg text-white border shadow-lg animate-fade-in-up
            backdrop-blur-[24px] bg-gradient-to-br from-red-500/[0.9] to-red-600/[0.8]
            border-red-400/[0.5] shadow-[0_8px_24px_rgba(220,38,38,0.25)]
          ">
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
          /* Enhanced Empty State */
          <div className="text-center py-16">
            <div className="
              w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
              backdrop-blur-[20px] bg-gradient-to-br from-white/[0.15] to-white/[0.08]
              border border-white/[0.2] shadow-[0_8px_24px_rgba(0,0,0,0.15)]
            ">
              <ArchiveX className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2 drop-shadow-sm">
              Nenhuma ferramenta encontrada
            </h3>
            <p className="text-white/70 mb-6 drop-shadow-sm">
              Tente ajustar seus filtros ou fazer uma nova busca
            </p>
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