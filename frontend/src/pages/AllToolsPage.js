import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  ArchiveX,
  Heart,
  Copy,
  ArrowRight,
  MessageSquareCode,
  BrainCircuit,
  Cpu
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

// Mock data for all prompts - matches HTML exactly
const ALL_PROMPTS = [
  { 
    id: "p01", 
    title: "Roteiro Viral em 30 Segundos", 
    description: "Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.", 
    category: "Copywriting", 
    type: "text-generation", 
    compatibility: ["ChatGPT", "Claude", "Gemini"], 
    tags: ["roteiro", "storytelling", "reels"], 
    isFavorite: false, 
    isEdited: true, 
    content: "Você é um roteirista viral especializado em conteúdo de redes sociais...\n\n[INSTRUÇÕES]\nCrie um roteiro viral de 30 segundos seguindo a estrutura:\n\n1. GANCHO (0-3s): Uma frase ou pergunta que prende a atenção imediatamente\n2. DESENVOLVIMENTO (3-25s): Conte a história ou apresente o conteúdo principal\n3. CALL TO ACTION (25-30s): Termine com um convite claro para engajamento\n\n[TÓPICO]\n{seu_topico_aqui}\n\n[OUTPUT]\nFormate como roteiro com timing e direções visuais." 
  },
  { 
    id: "p02", 
    title: "Títulos Otimizados para SEO", 
    description: "Gere títulos magnéticos e otimizados para os mecanismos de busca que aumentam o CTR.", 
    category: "SEO", 
    type: "text-generation", 
    compatibility: ["ChatGPT", "Claude"], 
    tags: ["seo", "títulos", "blog"], 
    isFavorite: false, 
    isEdited: false, 
    content: "Crie 5 títulos SEO-otimizados para o seguinte conteúdo...\n\n[DIRETRIZES]\n- Máximo 60 caracteres\n- Inclua a palavra-chave principal no início\n- Use power words (como 'definitivo', 'completo', 'secreto')\n- Crie urgência ou curiosidade\n- Seja específico com números quando possível\n\n[CONTEÚDO]\n{seu_conteudo_aqui}\n\n[PALAVRA-CHAVE]\n{palavra_chave_principal}\n\n[OUTPUT]\nRetorne 5 opções numeradas com explicação do por que cada uma funciona." 
  },
  { 
    id: "p03", 
    title: "Cenário 3D Fotorrealista", 
    description: "Crie um prompt detalhado para gerar uma cena de floresta mística ao amanhecer.", 
    category: "Imagem", 
    type: "image-generation", 
    compatibility: ["Midjourney", "DALL-E", "Stable Diffusion"], 
    tags: ["3d", "cenário", "iluminação"], 
    isFavorite: false, 
    isEdited: false, 
    content: "/imagine prompt: mystical forest at golden hour, ancient towering trees with twisted branches, soft volumetric light rays piercing through morning mist, moss-covered fallen logs, delicate wildflowers scattered on forest floor, ethereal atmosphere, photorealistic 3D render, octane render, ultra detailed, 8k resolution, cinematic lighting, depth of field, fantasy environment --ar 16:9 --v 6 --style raw" 
  },
  { 
    id: "p04", 
    title: "Análise de Sentimento de Comentários", 
    description: "Analise um bloco de texto e classifique o sentimento predominante (positivo, negativo, neutro).", 
    category: "Análise", 
    type: "data-analysis", 
    compatibility: ["ChatGPT", "Claude", "Gemini"], 
    tags: ["dados", "sentimento", "feedback"], 
    isFavorite: true, 
    isEdited: false, 
    content: "Analise os seguintes comentários e classifique o sentimento de cada um...\n\n[INSTRUÇÕES]\n- Classifique cada comentário como: POSITIVO, NEGATIVO ou NEUTRO\n- Forneça um score de 1-10 para intensidade do sentimento\n- Identifique as palavras-chave que determinaram a classificação\n- Resuma o sentimento geral no final\n\n[COMENTÁRIOS]\n{cole_os_comentarios_aqui}\n\n[OUTPUT]\nFormato:\nComentário 1: [SENTIMENTO] - Score: X/10\nPalavras-chave: [palavras]\n\nResumo geral: [análise_completa]" 
  },
  { 
    id: "p05", 
    title: "Pesquisa de Mercado Profunda", 
    description: "Execute uma pesquisa aprofundada sobre um nicho de mercado, identificando concorrentes e oportunidades.", 
    category: "Negócios", 
    type: "research", 
    compatibility: ["ChatGPT", "Claude"], 
    tags: ["pesquisa", "mercado", "estratégia"], 
    isFavorite: false, 
    isEdited: true, 
    content: "Conduza uma análise completa do mercado para o seguinte nicho...\n\n[ESTRUTURA DA ANÁLISE]\n1. Visão geral do mercado (tamanho, crescimento, tendências)\n2. Análise de concorrentes (top 5 players principais)\n3. Público-alvo (demographics, comportamento, dores)\n4. Oportunidades de mercado (gaps não atendidos)\n5. Ameaças e desafios\n6. Recomendações estratégicas\n\n[NICHO]\n{seu_nicho_aqui}\n\n[OUTPUT]\nFormate como relatório executivo com dados específicos e insights acionáveis." 
  },
  { 
    id: "p06", 
    title: "Gerador de Persona Detalhada", 
    description: "Construa uma persona de cliente completa com dores, desejos, demografia e comportamento.", 
    category: "Marketing", 
    type: "text-generation", 
    compatibility: ["ChatGPT", "Claude", "Gemini"], 
    tags: ["persona", "público-alvo"], 
    isFavorite: false, 
    isEdited: false, 
    content: "Crie uma persona detalhada para o seguinte produto/serviço...\n\n[ESTRUTURA DA PERSONA]\n📊 DEMOGRAFIA\n- Nome e idade\n- Localização e renda\n- Profissão e educação\n- Estado civil e família\n\n🎯 PSICOGRAFIA\n- Personalidade e valores\n- Interesses e hobbies\n- Estilo de vida\n\n😰 DORES E DESAFIOS\n- Principais problemas\n- Frustrações diárias\n- Medos e objeções\n\n💫 OBJETIVOS E DESEJOS\n- Aspirações de vida\n- Metas profissionais\n- Desejos secretos\n\n📱 COMPORTAMENTO DIGITAL\n- Redes sociais preferidas\n- Hábitos de consumo de conteúdo\n- Jornada de compra\n\n[PRODUTO/SERVIÇO]\n{seu_produto_servico_aqui}" 
  },
  { 
    id: "p07", 
    title: "Copy de Vendas (AIDA)", 
    description: "Crie textos persuasivos que convertem usando o framework AIDA (Atenção, Interesse, Desejo, Ação).", 
    category: "Copywriting", 
    type: "text-generation", 
    compatibility: ["ChatGPT", "Claude"], 
    tags: ["copywriting", "vendas", "aida"], 
    isFavorite: true, 
    isEdited: false, 
    content: "Escreva uma copy de vendas persuasiva usando o framework AIDA...\n\n[ESTRUTURA AIDA]\n🎯 ATENÇÃO\n- Headline impactante\n- Estatística ou pergunta provocativa\n- Promessa específica\n\n🔥 INTERESSE\n- Desenvolva o problema\n- Conte uma história relacionável\n- Apresente credibilidade\n\n💎 DESEJO\n- Benefícios transformadores\n- Prova social (depoimentos)\n- Urgência/escassez\n\n⚡ AÇÃO\n- Call-to-action claro\n- Garantia/redução de risco\n- Instruções específicas\n\n[PRODUTO/SERVIÇO]\n{seu_produto_aqui}\n\n[PÚBLICO-ALVO]\n{sua_persona_aqui}\n\n[OUTPUT]\nCopy completa otimizada para conversão." 
  },
  { 
    id: "p08", 
    title: "Ícone de App Estilo 'Liquid Glass'", 
    description: "Gere um ícone de aplicativo moderno com efeito de vidro líquido e gradientes suaves.", 
    category: "Design", 
    type: "image-generation", 
    compatibility: ["Midjourney", "DALL-E"], 
    tags: ["ícone", "ui", "design"], 
    isFavorite: false, 
    isEdited: false, 
    content: "/imagine prompt: app icon design, liquid glass effect, translucent material with soft gradients from blue to purple, subtle reflections and refractions, minimal geometric shape, glossy surface, depth and dimension, modern clean aesthetic, rounded square format, high quality 3D render, professional app store style, octane render, 1024x1024 resolution --ar 1:1 --v 6 --style raw" 
  }
];

const AllToolsPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [state, setState] = useState({ 
    search: '', 
    category: 'all', 
    sort: 'relevance', 
    filters: { type: [], compatibility: [], activity: [] } 
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const toolLogos = {
    "Claude": <BrainCircuit className="w-4 h-4" />,
    "ChatGPT": <MessageSquareCode className="w-4 h-4" />,
    "Gemini": <Cpu className="w-4 h-4" />,
    "Midjourney": <Cpu className="w-4 h-4" />,
    "DALL-E": <Cpu className="w-4 h-4" />,
    "Stable Diffusion": <Cpu className="w-4 h-4" />
  };

  const categories = ['all', ...new Set(ALL_PROMPTS.map(p => p.category))];

  const filterAndRender = () => {
    const filteredPrompts = ALL_PROMPTS.filter(prompt => {
      const searchMatch = state.search === '' || 
        prompt.title.toLowerCase().includes(state.search) || 
        prompt.description.toLowerCase().includes(state.search) || 
        prompt.tags.some(tag => tag.toLowerCase().includes(state.search));
      
      const categoryMatch = state.category === 'all' || prompt.category === state.category;
      const typeMatch = state.filters.type.length === 0 || state.filters.type.includes(prompt.type);
      const compatibilityMatch = state.filters.compatibility.length === 0 || 
        prompt.compatibility.some(comp => state.filters.compatibility.includes(comp));
      const favoriteMatch = !state.filters.activity.includes('isFavorite') || prompt.isFavorite;
      const editedMatch = !state.filters.activity.includes('isEdited') || prompt.isEdited;
      
      return searchMatch && categoryMatch && typeMatch && compatibilityMatch && favoriteMatch && editedMatch;
    });

    if (state.sort === 'recent') {
      filteredPrompts.reverse();
    }

    return filteredPrompts;
  };

  const filteredPrompts = filterAndRender();

  const handleRealtimeSearch = (searchTerm) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, search: searchTerm.toLowerCase() }));
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const handleCategoryChange = (category) => {
    setState(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  const handleSortChange = (sort) => {
    setState(prev => ({ ...prev, sort }));
    setShowSortDropdown(false);
  };

  const handleToolClick = (prompt) => {
    setCurrentPrompt(prompt);
    setShowPromptModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closePromptModal = () => {
    setShowPromptModal(false);
    setCurrentPrompt(null);
    document.body.style.overflow = '';
  };

  const handleFavoriteToggle = (promptId) => {
    const promptIndex = ALL_PROMPTS.findIndex(p => p.id === promptId);
    if (promptIndex !== -1) {
      ALL_PROMPTS[promptIndex].isFavorite = !ALL_PROMPTS[promptIndex].isFavorite;
      // Force re-render
      setState(prev => ({ ...prev }));
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      // Show toast notification
      const toast = document.getElementById('toast-notification');
      if (toast) {
        toast.textContent = 'Prompt copiado para a área de transferência!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }
    });
  };

  const applyFilters = () => {
    const type = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value);
    const compatibility = Array.from(document.querySelectorAll('input[name="compatibility"]:checked')).map(cb => cb.value);
    const activity = Array.from(document.querySelectorAll('input[name="activity"]:checked')).map(cb => cb.value);
    
    setState(prev => ({
      ...prev,
      filters: { type, compatibility, activity }
    }));
    setShowFiltersModal(false);
  };

  const clearAllFilters = () => {
    setState({
      search: '',
      category: 'all',
      sort: 'relevance',
      filters: { type: [], compatibility: [], activity: [] }
    });
    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
  };

  const ToolCard = ({ prompt }) => {
    const firstTag = prompt.tags[0];
    const heartFill = prompt.isFavorite ? "white" : "none";
    const heartClass = prompt.isFavorite ? 'text-white' : 'text-white/40 hover:text-white';

    return (
      <div className="tool-card-grid-item" data-id={prompt.id}>
        <div className="prompt-card relative card-glow" onClick={() => handleToolClick(prompt)}>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="liquid-glass-tag">{firstTag}</span>
                <button 
                  className={`favorite-btn p-1.5 -mr-1.5 -mt-1.5 transition-colors ${heartClass}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(prompt.id);
                  }}
                  aria-label="Favoritar"
                >
                  <Heart className="w-4 h-4" fill={heartFill} />
                </button>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 leading-tight font-['Geist']">
                {prompt.title}
              </h3>
              <p className="text-xs md:text-sm text-white/70 line-clamp-2 leading-relaxed mb-3">
                {prompt.description}
              </p>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                <span>Clique para abrir</span>
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PromptModal = () => {
    if (!currentPrompt) return null;

    const compatibilityTools = currentPrompt.compatibility.map(tool => (
      <div key={tool} className="tool-logo-card p-2 rounded-lg flex flex-col items-center gap-1 transition-all hover:scale-110 hover:bg-white/10 hover:border-white/15 bg-white/5 border border-transparent" title={tool}>
        <div className="w-8 h-8 text-white/70 flex items-center justify-center">
          {toolLogos[tool] || <Cpu className="w-4 h-4" />}
        </div>
        <span className="text-xs text-white/60">{tool}</span>
      </div>
    ));

    return (
      <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm">
        <div className="fixed z-101 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(90vw,800px)] h-[min(85vh,750px)] bg-[rgba(20,20,22,0.9)] backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="prompt-modal-inner-content h-full w-full opacity-100">
            <div className="p-6 pt-12 md:pt-6 h-full flex flex-col">
              <button 
                onClick={closePromptModal}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex-shrink-0 mb-6">
                <h2 className="text-2xl font-semibold tracking-tight pr-10 font-['Geist']">{currentPrompt.title}</h2>
                <p className="text-white/70 mt-2">{currentPrompt.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentPrompt.tags.map(tag => (
                    <span key={tag} className="liquid-glass-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="modal-scroll-container flex-grow overflow-y-auto space-y-6 hide-scrollbar -mr-2 pr-2">
                {compatibilityTools.length > 0 && (
                  <div className="contained-card p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="w-4 h-4 text-white">✓</span>
                      Também funciona com
                    </h4>
                    <div className="flex items-center flex-wrap gap-3">{compatibilityTools}</div>
                  </div>
                )}
                <div className="contained-card p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="w-4 h-4 text-white">&lt;/&gt;</span>
                      Prompt Principal
                    </h4>
                    <button 
                      onClick={() => copyToClipboard(currentPrompt.content)}
                      className="copy-prompt-btn p-2 rounded-lg hover:bg-white/10 transition-colors" 
                      title="Copiar prompt"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="prompt-preview bg-black/20 rounded-lg p-4 relative max-h-[300px] overflow-y-auto hide-scrollbar">
                    <pre className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap font-mono">
                      {currentPrompt.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-[#0A0A0C] font-['Inter'] text-white antialiased selection:bg-white/10"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }}></div>

      <main className="w-full mx-auto max-w-7xl px-4 pb-12">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-8 text-center md:text-left animate-entry font-['Geist']">
          Explore todas as Ferramentas
        </h1>

        {/* Painel de Controle */}
        <section className="mb-10 animate-entry" style={{ animationDelay: '150ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-3 liquid-glass p-3">
            {/* Barra de Busca */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none z-10" />
              <input 
                id="search-input" 
                type="text" 
                placeholder="Busque por objetivo, técnica ou ferramenta..." 
                className="w-full h-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 control-panel-item"
                onChange={(e) => handleRealtimeSearch(e.target.value)}
              />
            </div>

            {/* Dropdown de Categorias */}
            <div className="md:col-span-2 relative">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="filter-control-button control-panel-item w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <span className="truncate pr-2">
                  {state.category === 'all' ? 'Todas as Categorias' : state.category}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCategoryDropdown && (
                <div className="control-panel-dropdown absolute top-full left-0 mt-2 w-full z-50 bg-[rgba(30,31,35,0.97)] backdrop-blur-3xl border border-white/18 shadow-[0_16px_48px_rgba(0,0,0,0.5)] rounded-xl p-2">
                  {categories.map(category => (
                    <button 
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`menu-item w-full text-left p-2.5 flex items-center justify-between text-sm transition-colors rounded-lg hover:bg-white/10 ${
                        state.category === category ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      <span>{category === 'all' ? 'Todas as Categorias' : category}</span>
                      {state.category === category && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botão de Filtros */}
            <div className="md:col-span-2 relative">
              <button 
                onClick={() => setShowFiltersModal(true)}
                className="filter-control-button control-panel-item w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <span className="truncate pr-2">Filtros</span>
                <SlidersHorizontal className="w-4 h-4 text-white/60" />
                <div className="filter-count-badge absolute -top-1.5 -right-1.5 bg-white text-black w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center scale-0 transition-transform">
                  0
                </div>
              </button>
            </div>

            {/* Dropdown de Ordenação */}
            <div className="md:col-span-1 relative">
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="filter-control-button control-panel-item w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <span className="truncate pr-2">
                  {state.sort === 'recent' ? 'Recentes' : 'Relevantes'}
                </span>
                <ArrowUpDown className="w-4 h-4 text-white/60 transition-transform" />
              </button>
              {showSortDropdown && (
                <div className="control-panel-dropdown absolute top-full right-0 mt-2 w-max min-w-[200px] z-50 bg-[rgba(30,31,35,0.97)] backdrop-blur-3xl border border-white/18 shadow-[0_16px_48px_rgba(0,0,0,0.5)] rounded-xl p-2">
                  <button 
                    onClick={() => handleSortChange('relevance')}
                    className={`menu-item w-full text-left p-2.5 flex items-center justify-between text-sm transition-colors rounded-lg hover:bg-white/10 ${
                      state.sort === 'relevance' ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    <span>Relevantes</span>
                    {state.sort === 'relevance' && <span>✓</span>}
                  </button>
                  <button 
                    onClick={() => handleSortChange('recent')}
                    className={`menu-item w-full text-left p-2.5 flex items-center justify-between text-sm transition-colors rounded-lg hover:bg-white/10 ${
                      state.sort === 'recent' ? 'text-white' : 'text-white/80'
                    }`}
                  >
                    <span>Recentes</span>
                    {state.sort === 'recent' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Grade de Ferramentas */}
        <div id="tools-grid" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-entry ${filteredPrompts.length === 0 ? 'hidden' : ''}`} style={{ animationDelay: '300ms' }}>
          {filteredPrompts.map(prompt => <ToolCard key={prompt.id} prompt={prompt} />)}
        </div>

        {/* Estado Vazio */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-20 animate-entry">
            <div className="liquid-glass rounded-2xl p-8 max-w-md mx-auto">
              <ArchiveX className="w-16 h-16 mx-auto mb-6 text-white/40" />
              <h3 className="text-xl font-semibold text-white mb-2 font-['Geist']">
                Nenhuma ferramenta encontrada
              </h3>
              <p className="text-white/70 text-sm mb-6">
                Tente ajustar seus filtros ou sua busca para descobrir o prompt perfeito.
              </p>
              <button 
                onClick={clearAllFilters}
                className="liquid-glass-pill px-6 py-2.5 text-sm font-medium hover:bg-white/15 hover:scale-105 transition-all"
              >
                Limpar todos os filtros
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Filtros */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="liquid-glass flex flex-col max-h-[85vh] rounded-2xl w-[90vw] max-w-[500px]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-semibold tracking-tight text-white font-['Geist']">
                Filtros Avançados
              </h2>
              <button 
                onClick={() => setShowFiltersModal(false)}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center liquid-glass-pill active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6 hide-scrollbar">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">Tipo de Ferramenta</h3>
                <div className="flex flex-col space-y-2">
                  {[
                    { value: 'text-generation', label: 'Text Generation' },
                    { value: 'image-generation', label: 'Image Generation' },
                    { value: 'data-analysis', label: 'Data Analysis' },
                    { value: 'research', label: 'Research' }
                  ].map(type => (
                    <label key={type.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="type" 
                        value={type.value} 
                        className="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0" 
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">Compatibilidade</h3>
                <div className="flex flex-col space-y-2">
                  {['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E', 'Stable Diffusion'].map(comp => (
                    <label key={comp} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="compatibility" 
                        value={comp} 
                        className="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0" 
                      />
                      <span className="text-sm">Otimizado para {comp}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">Minha Atividade</h3>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="activity" 
                      value="isFavorite" 
                      className="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0" 
                    />
                    <span className="text-sm">Meus Favoritos</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="activity" 
                      value="isEdited" 
                      className="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0" 
                    />
                    <span className="text-sm">Editados por mim</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex items-center gap-3 justify-end flex-shrink-0">
              <button 
                onClick={() => {
                  document.querySelectorAll('#filters-form input:checked').forEach(cb => cb.checked = false);
                }}
                className="liquid-glass-pill px-5 py-2.5 text-sm font-medium hover:bg-white/15 transition-all"
              >
                Limpar
              </button>
              <button 
                onClick={applyFilters}
                className="liquid-glass-pill px-5 py-2.5 text-sm font-medium text-white bg-white/15 hover:bg-white/20 transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Prompt */}
      {showPromptModal && <PromptModal />}

      {/* Toast Notification */}
      <div id="toast-notification" className="fixed bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 transition-all duration-400 z-200 pointer-events-none backdrop-blur-2xl bg-white/10 border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] rounded-full py-3 px-6 text-white text-sm font-medium">
        Prompt copiado!
      </div>

      <style jsx>{`
        .liquid-glass {
          backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
          border-radius: 16px;
        }

        .liquid-glass-pill {
          backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .liquid-glass-tag {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          color: white;
        }

        .hide-scrollbar::-webkit-scrollbar { 
          display: none; 
        }
        .hide-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }

        .animate-entry {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          animation: slideInFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideInFade {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .card-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          opacity: 0.1;
          filter: blur(20px);
          mix-blend-mode: screen;
          border-radius: inherit;
          animation: pulse 4s ease-in-out infinite;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.08; transform: scale(0.95); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }

        .prompt-card {
          position: relative;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .prompt-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .contained-card {
          background-color: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
        }

        .tool-logo-card {
          transition: all 0.2s ease;
          background-color: rgba(255,255,255,0.05);
          border: 1px solid transparent;
        }

        .custom-checkbox:checked {
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
          background-color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.9);
        }

        #toast-notification.show {
          transform: translate(-50%, 0);
          opacity: 1;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AllToolsPage;