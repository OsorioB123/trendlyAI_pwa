import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';
import TrackCard from '../components/cards/TrackCard';

// Mock data for all tracks
const ALL_TRACKS = [
  {
    id: 1,
    title: 'Marketing Digital para Iniciantes',
    description: 'Aprenda os fundamentos do marketing digital, desde conceitos básicos até estratégias avançadas.',
    tags: ['Marketing', 'Iniciante', 'Digital'],
    progress: 70,
    backgroundImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    estimatedTime: '8 semanas',
    lessonsCount: 24
  },
  {
    id: 2,
    title: 'Análise de Dados com Google Analytics',
    description: 'Domine o Google Analytics para tomar decisões baseadas em dados.',
    tags: ['Analytics', 'Dados', 'Intermediário'],
    progress: 35,
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    estimatedTime: '6 semanas',
    lessonsCount: 18
  },
  {
    id: 3,
    title: 'Gestão de Redes Sociais',
    description: 'Estratégias para crescer e engajar sua audiência nas redes sociais.',
    tags: ['Social Media', 'Gestão', 'Intermediário'],
    progress: 55,
    backgroundImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02711?w=800&q=80',
    estimatedTime: '10 semanas',
    lessonsCount: 30
  },
  {
    id: 4,
    title: 'Planejamento Estratégico Digital',
    description: 'Crie estratégias digitais eficazes para seu negócio.',
    tags: ['Estratégia', 'Avançado', 'Planejamento'],
    progress: 90,
    backgroundImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    estimatedTime: '12 semanas',
    lessonsCount: 36
  },
  {
    id: 5,
    title: 'Funil de Vendas para E-commerce',
    description: 'Construa funis de vendas que convertem visitantes em clientes.',
    tags: ['Vendas', 'E-commerce', 'Intermediário'],
    progress: 0,
    backgroundImage: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80',
    estimatedTime: '8 semanas',
    lessonsCount: 22
  },
  {
    id: 6,
    title: 'Email Marketing Efetivo',
    description: 'Domine as técnicas de email marketing para engajamento máximo.',
    tags: ['Email', 'Marketing', 'Iniciante'],
    progress: 0,
    backgroundImage: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80',
    estimatedTime: '6 semanas',
    lessonsCount: 16
  },
  {
    id: 7,
    title: 'SEO para Negócios Locais',
    description: 'Otimize seu negócio local para aparecer nas buscas do Google.',
    tags: ['SEO', 'Local', 'Intermediário'],
    progress: 0,
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    estimatedTime: '10 semanas',
    lessonsCount: 28
  },
  {
    id: 8,
    title: 'Copywriting para Conversão',
    description: 'Escreva textos que vendem e convertem visitantes em clientes.',
    tags: ['Copywriting', 'Vendas', 'Avançado'],
    progress: 0,
    backgroundImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    estimatedTime: '8 semanas',
    lessonsCount: 20
  }
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'Todas as Trilhas', count: ALL_TRACKS.length },
  { id: 'in-progress', label: 'Em Andamento', count: ALL_TRACKS.filter(t => t.progress > 0 && t.progress < 100).length },
  { id: 'completed', label: 'Concluídas', count: ALL_TRACKS.filter(t => t.progress === 100).length },
  { id: 'not-started', label: 'Não Iniciadas', count: ALL_TRACKS.filter(t => t.progress === 0).length }
];

const AllTracksPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTracks = ALL_TRACKS.filter(track => {
    // Filter by search term
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by status
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'in-progress':
        matchesFilter = track.progress > 0 && track.progress < 100;
        break;
      case 'completed':
        matchesFilter = track.progress === 100;
        break;
      case 'not-started':
        matchesFilter = track.progress === 0;
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  const handleTrackClick = (track) => {
    console.log('Track clicked:', track);
    // TODO: Navigate to track detail page
    navigate(`/track/${track.id}`);
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
              Todas as Trilhas
            </h1>
            <p className="text-white/70 text-lg">
              Explore todas as trilhas disponíveis e continue sua jornada de aprendizado
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
                placeholder="Buscar trilhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-md"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors backdrop-blur-md"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
              
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFilter(option.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-md ${
                    selectedFilter === option.id
                      ? 'bg-white text-black'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-white/70">
              {filteredTracks.length} trilha{filteredTracks.length !== 1 ? 's' : ''} encontrada{filteredTracks.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                variant="full"
                onClick={handleTrackClick}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTracks.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Search className="w-10 h-10 text-white/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma trilha encontrada
              </h3>
              <p className="text-white/70 mb-6">
                Tente ajustar seus filtros ou termo de busca
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
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

export default AllTracksPage;