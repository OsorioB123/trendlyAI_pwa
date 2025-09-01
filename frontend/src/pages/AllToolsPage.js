import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';
import ToolCard from '../components/cards/ToolCard';

// Mock data for all tools
const ALL_TOOLS = [
  {
    id: 1,
    title: 'Crie um Roteiro Viral em 30 Segundos',
    description: 'Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.',
    tags: ['roteiro', 'storytelling', 'viral'],
    category: 'Criação de Conteúdo',
    difficulty: 'Iniciante',
    usageCount: 1247,
    content: 'Você é um especialista em storytelling viral para redes sociais...'
  },
  {
    id: 2,
    title: 'Crie Títulos Otimizados para SEO',
    description: 'Use este prompt para gerar títulos magnéticos e otimizados para mecanismos de busca.',
    tags: ['seo', 'títulos', 'otimização'],
    category: 'SEO',
    difficulty: 'Intermediário',
    usageCount: 892,
    content: 'Você é um especialista em SEO e copywriting...'
  },
  {
    id: 3,
    title: 'Copy de Vendas Irresistível',
    description: 'Crie textos persuasivos que convertem usando gatilhos mentais comprovados.',
    tags: ['copywriting', 'vendas', 'conversão'],
    category: 'Vendas',
    difficulty: 'Avançado',
    usageCount: 2103,
    content: 'Você é um copywriter experiente especializado em vendas...'
  },
  {
    id: 4,
    title: 'Estratégia de Conteúdo para Instagram',
    description: 'Desenvolva uma estratégia completa de conteúdo para crescer no Instagram.',
    tags: ['instagram', 'estratégia', 'social media'],
    category: 'Social Media',
    difficulty: 'Intermediário',
    usageCount: 756,
    content: 'Você é um especialista em marketing do Instagram...'
  },
  {
    id: 5,
    title: 'Análise de Concorrência Digital',
    description: 'Faça uma análise profunda dos seus concorrentes online.',
    tags: ['análise', 'concorrência', 'pesquisa'],
    category: 'Pesquisa de Mercado',
    difficulty: 'Avançado',
    usageCount: 423,
    content: 'Você é um analista de mercado digital experiente...'
  },
  {
    id: 6,
    title: 'Criador de Headlines Magnéticas',
    description: 'Gere headlines que capturam a atenção e aumentam o CTR.',
    tags: ['headlines', 'ctr', 'engajamento'],
    category: 'Copywriting',
    difficulty: 'Iniciante',
    usageCount: 1856,
    content: 'Você é um especialista em criação de headlines...'
  },
  {
    id: 7,
    title: 'Plano de Email Marketing',
    description: 'Crie sequências de email que nutrem leads e geram vendas.',
    tags: ['email', 'marketing', 'automação'],
    category: 'Email Marketing',
    difficulty: 'Intermediário',
    usageCount: 634,
    content: 'Você é um especialista em email marketing...'
  },
  {
    id: 8,
    title: 'Otimizador de Landing Pages',
    description: 'Otimize suas landing pages para máxima conversão.',
    tags: ['landing page', 'conversão', 'cro'],
    category: 'CRO',
    difficulty: 'Avançado',
    usageCount: 912,
    content: 'Você é um especialista em otimização de conversão...'
  },
  {
    id: 9,
    title: 'Gerador de Ideias de Conteúdo',
    description: 'Nunca mais fique sem ideias para o seu conteúdo digital.',
    tags: ['ideias', 'brainstorm', 'criatividade'],
    category: 'Criação de Conteúdo',
    difficulty: 'Iniciante',
    usageCount: 2847,
    content: 'Você é um criativo especialista em geração de ideias...'
  },
  {
    id: 10,
    title: 'Automatizador de Resposta no WhatsApp',
    description: 'Crie respostas automáticas inteligentes para WhatsApp Business.',
    tags: ['whatsapp', 'automação', 'atendimento'],
    category: 'Atendimento',
    difficulty: 'Intermediário',
    usageCount: 567,
    content: 'Você é um especialista em automação de atendimento...'
  }
];

const CATEGORIES = [
  'Todas',
  'Criação de Conteúdo',
  'SEO',
  'Vendas',
  'Social Media',
  'Pesquisa de Mercado',
  'Copywriting',
  'Email Marketing',
  'CRO',
  'Atendimento'
];

const DIFFICULTY_LEVELS = ['Todas', 'Iniciante', 'Intermediário', 'Avançado'];

const AllToolsPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
  const [sortBy, setSortBy] = useState('popular'); // popular, alphabetical, recent

  const filteredTools = ALL_TOOLS.filter(tool => {
    // Filter by search term
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by category
    const matchesCategory = selectedCategory === 'Todas' || tool.category === selectedCategory;

    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty === 'Todas' || tool.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recent':
        return b.id - a.id; // Assuming higher ID means more recent
      case 'popular':
      default:
        return b.usageCount - a.usageCount;
    }
  });

  const handleToolClick = (tool) => {
    console.log('Tool clicked:', tool);
    // TODO: Navigate to tool detail page or open modal
    navigate(`/tool/${tool.id}`);
  };

  const handleToolFavorite = (tool) => {
    console.log('Tool favorited:', tool);
    // TODO: Implement favorite functionality
  };

  const handleToolCopy = (tool) => {
    if (tool.content) {
      navigator.clipboard.writeText(tool.content);
      console.log('Tool content copied:', tool.title);
      // TODO: Show toast notification
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-geist">
              Todas as Ferramentas
            </h1>
            <p className="text-white/70 text-lg">
              Descubra prompts e ferramentas de IA para impulsionar seu trabalho
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                placeholder="Buscar ferramentas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-md"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/70" />
                <span className="text-white/70 text-sm">Categoria:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">Nível:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
                >
                  {DIFFICULTY_LEVELS.map((level) => (
                    <option key={level} value={level} className="bg-gray-800">
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
                >
                  <option value="popular" className="bg-gray-800">Mais Populares</option>
                  <option value="alphabetical" className="bg-gray-800">Alfabética</option>
                  <option value="recent" className="bg-gray-800">Mais Recentes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-white/70">
              {filteredTools.length} ferramenta{filteredTools.length !== 1 ? 's' : ''} encontrada{filteredTools.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                variant="full"
                onClick={handleToolClick}
                onFavorite={handleToolFavorite}
                onCopy={handleToolCopy}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Search className="w-10 h-10 text-white/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma ferramenta encontrada
              </h3>
              <p className="text-white/70 mb-6">
                Tente ajustar seus filtros ou termo de busca
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todas');
                  setSelectedDifficulty('Todas');
                }}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors backdrop-blur-md"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllToolsPage;