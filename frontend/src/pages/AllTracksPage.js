import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

// Mock data for all tracks - matches HTML exactly
const ALL_TRACKS = [
  { id: 't1', title: 'Design de Gradientes', image: '1618005182384-a83a8bd57fbe', categories: ['Marketing'], level: 'Iniciante', status: 'nao_iniciado', progress: 0 },
  { id: 't2', title: 'Copywriting para Lançamentos', image: '1504198266285-165a13a5456e', categories: ['Copywriting'], level: 'Intermediário', status: 'em_andamento', progress: 65 },
  { id: 't3', title: 'Edição de Vídeo para Reels', image: '1547658719-da2b51166', categories: ['Vídeo'], level: 'Intermediário', status: 'concluido', progress: 100 },
  { id: 't4', title: 'Estratégias para Social Media', image: '1529336953121-ad031f02223d', categories: ['Social Media'], level: 'Avançado', status: 'nao_iniciado', progress: 0 },
  { id: 't5', title: 'Fundamentos de Marketing Digital', image: '1460925895917-afdab827c52f', categories: ['Marketing'], level: 'Iniciante', status: 'em_andamento', progress: 30 },
  { id: 't6', title: 'Storytelling para Marcas', image: '1557839335-50e5ac5a5e78', categories: ['Copywriting'], level: 'Intermediário', status: 'concluido', progress: 100 },
  { id: 't7', title: 'Produção com Smartphone', image: '1533857692237-683675a74a13', categories: ['Vídeo'], level: 'Iniciante', status: 'nao_iniciado', progress: 0 },
  { id: 't8', title: 'Gerenciamento de Crises', image: '1556656642-7561816753', categories: ['Social Media'], level: 'Avançado', status: 'em_andamento', progress: 80 },
  { id: 't9', title: 'SEO para Conteúdo', image: '1555069964-92f76713833b', categories: ['Marketing'], level: 'Intermediário', status: 'nao_iniciado', progress: 0 }
];

const AllTracksPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [state, setState] = useState({
    page: 1,
    loading: false,
    total: 0,
    filters: {
      search: '',
      categories: [],
      levels: [],
      status: [],
      sort: 'top'
    }
  });
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const unsplashUrl = (id, w = 800, q = 80) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

  const filterAndSortTracks = () => {
    let filtered = ALL_TRACKS.filter(track => {
      const matchesSearch = !state.filters.search ||
        track.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        track.categories.some(cat => cat.toLowerCase().includes(state.filters.search.toLowerCase()));

      const matchesCategories = state.filters.categories.length === 0 ||
        track.categories.some(cat => state.filters.categories.includes(cat));

      const matchesLevels = state.filters.levels.length === 0 ||
        state.filters.levels.includes(track.level);

      const matchesStatus = state.filters.status.length === 0 ||
        state.filters.status.includes(track.status);

      return matchesSearch && matchesCategories && matchesLevels && matchesStatus;
    });

    if (state.filters.sort === 'recent') {
      filtered = filtered.reverse();
    }

    return filtered;
  };

  const [displayedTracks, setDisplayedTracks] = useState([]);
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);

  useEffect(() => {
    renderTracks();
  }, [state.filters]);

  const renderTracks = async (isLoadMore = false) => {
    if (!isLoadMore) {
      setState(prev => ({ ...prev, page: 1 }));
      setDisplayedTracks([]);
    }

    const filtered = filterAndSortTracks();
    setState(prev => ({ ...prev, total: filtered.length }));
    
    const PAGE_SIZE = 9;
    const currentPage = isLoadMore ? state.page : 1;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const items = filtered.slice(start, end);

    if (isLoadMore) {
      setDisplayedTracks(prev => [...prev, ...items]);
    } else {
      setDisplayedTracks(items);
    }

    const displayedCount = Math.min(currentPage * PAGE_SIZE, filtered.length);
    setIsLoadMoreVisible(displayedCount < filtered.length);
  };

  const handleSearchChange = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, search: value }
      }));
    }, 300);
    
    setSearchTimeout(timeout);
  };

  const handleSortChange = (sortValue) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, sort: sortValue }
    }));
    setShowSortDropdown(false);
  };

  const handleCategoryFilter = (category) => {
    setState(prev => {
      const categories = prev.filters.categories.includes(category)
        ? prev.filters.categories.filter(c => c !== category)
        : [...prev.filters.categories, category];
      
      return {
        ...prev,
        filters: { ...prev.filters, categories }
      };
    });
  };

  const applyAdvancedFilters = () => {
    const levels = Array.from(document.querySelectorAll('input[data-filter-group="levels"]:checked')).map(cb => cb.value);
    const status = Array.from(document.querySelectorAll('input[data-filter-group="status"]:checked')).map(cb => cb.value);
    
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, levels, status }
    }));
    setShowFiltersDrawer(false);
  };

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {
        search: '',
        categories: [],
        levels: [],
        status: [],
        sort: 'top'
      }
    }));
    document.querySelectorAll('#filters-drawer input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    setShowFiltersDrawer(false);
  };

  const loadMore = () => {
    setState(prev => ({ ...prev, page: prev.page + 1 }));
    renderTracks(true);
  };

  const TrackCard = ({ track }) => {
    const categoryTags = track.categories.map(c => (
      <span key={c} className="liquid-glass-tag">{c}</span>
    ));
    const levelTag = <span className="liquid-glass-tag">{track.level}</span>;

    return (
      <div className="animate-entry">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/track/${track.id}`); }} 
           className="interactive-card rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.28)] relative h-64 card-glow block">
          <img src={unsplashUrl(track.image)} alt={track.title} className="absolute w-full h-full object-cover" />
          <div className="absolute top-0 left-0 p-5 flex items-start gap-2 flex-wrap">
            {categoryTags}
            {levelTag}
          </div>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
            <div className="p-5">
              <h3 className="font-semibold text-white text-lg clamp-2">{track.title}</h3>
            </div>
          </div>
        </a>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${track.progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen font-['Inter'] text-gray-100 antialiased bg-gray-950 selection:bg-white/20"
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

      <main className="mx-auto max-w-7xl px-4 pt-12 pb-12">
        <h1 className="text-3xl text-center md:text-left md:text-4xl font-semibold text-white tracking-tight mb-8 animate-entry font-['Geist']">
          Explore todas as Trilhas
        </h1>

        <section className="relative z-30 liquid-glass rounded-2xl mb-8 p-4 animate-entry delay-1">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none z-10" />
              <input 
                type="text" 
                placeholder="Busque por trilhas, tópicos..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="relative md:w-52">
              <button 
                type="button" 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg py-2.5 pl-4 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <span className="truncate">
                  {state.filters.sort === 'recent' ? 'Mais recentes' : 'Mais relevantes'}
                </span>
                <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-2 w-full rounded-lg z-20 p-1 custom-select-panel bg-[rgba(30,30,35,0.9)] backdrop-blur-lg border border-white/16 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  <button 
                    onClick={() => handleSortChange('top')}
                    className={`w-full text-left p-2 rounded-md flex items-center justify-between text-sm custom-select-option ${state.filters.sort === 'top' ? 'selected text-white' : 'text-white/80 hover:text-white'}`}
                  >
                    <span>Mais relevantes</span>
                    {state.filters.sort === 'top' && <span>✓</span>}
                  </button>
                  <button 
                    onClick={() => handleSortChange('recent')}
                    className={`w-full text-left p-2 rounded-md flex items-center justify-between text-sm custom-select-option ${state.filters.sort === 'recent' ? 'selected text-white' : 'text-white/80 hover:text-white'}`}
                  >
                    <span>Mais recentes</span>
                    {state.filters.sort === 'recent' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-x-auto hide-scrollbar whitespace-nowrap pb-2 -mb-2">
              {['Marketing', 'Copywriting', 'Vídeo', 'Social Media'].map(category => (
                <button 
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`filter-chip inline-block px-4 py-1.5 rounded-full bg-white/5 text-sm text-white/80 hover:text-white mr-2 transition-all hover:scale-105 ${
                    state.filters.categories.includes(category) ? 'active bg-white/15' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowFiltersDrawer(true)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full liquid-glass-pill text-sm flex items-center gap-2 hover:bg-white/15 hover:scale-105 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 animate-entry delay-2">
          {displayedTracks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="liquid-glass rounded-xl p-8 max-w-md mx-auto">
                <Search className="w-12 h-12 mx-auto mb-4 text-white/50" />
                <h3 className="text-lg font-medium text-white mb-2">Nenhuma trilha encontrada</h3>
                <p className="text-white/70 text-sm">Tente ajustar seus filtros ou buscar por outros termos.</p>
              </div>
            </div>
          ) : (
            displayedTracks.map(track => <TrackCard key={track.id} track={track} />)
          )}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <p className="text-sm text-white/70 mb-4">
            Exibindo {Math.min(state.page * 9, state.total)} de {state.total} trilhas
          </p>
          {isLoadMoreVisible && (
            <button 
              onClick={loadMore}
              className="liquid-glass-pill px-6 py-3 text-sm font-medium hover:bg-white/15 hover:scale-105 transition-all"
            >
              Carregar mais
            </button>
          )}
        </div>
      </main>

      <footer className="mt-12 mb-8 text-center text-white/60 text-xs">
        <p>© 2025 TrendlyAI. Aprenda, crie e compartilhe.</p>
      </footer>

      {/* Filters Drawer */}
      {showFiltersDrawer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/8 backdrop-blur-lg border border-white/12 rounded-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-semibold tracking-tight text-white font-['Geist']">Filtros Avançados</h2>
              <button 
                onClick={() => setShowFiltersDrawer(false)}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center liquid-glass-pill active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">NÍVEL</h3>
                <div className="flex flex-col space-y-2">
                  {['Iniciante', 'Intermediário', 'Avançado'].map(level => (
                    <label key={level} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        data-filter-group="levels" 
                        value={level} 
                        className="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0" 
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">STATUS</h3>
                <div className="flex flex-col space-y-2">
                  {[
                    { value: 'nao_iniciado', label: 'Não iniciado' },
                    { value: 'em_andamento', label: 'Em andamento' },
                    { value: 'concluido', label: 'Concluído' }
                  ].map(status => (
                    <label key={status.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        data-filter-group="status" 
                        value={status.value} 
                        className="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0" 
                      />
                      <span>{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex items-center gap-3 justify-end flex-shrink-0">
              <button 
                onClick={clearFilters}
                className="liquid-glass-pill px-5 py-2.5 text-sm font-medium hover:bg-white/15 transition-all"
              >
                Limpar
              </button>
              <button 
                onClick={applyAdvancedFilters}
                className="liquid-glass-pill px-5 py-2.5 text-sm font-medium text-black bg-white hover:bg-gray-100 transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

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
          cursor: pointer;
        }

        .liquid-glass-tag {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border-radius: 9999px;
          padding: 2px 10px;
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

        .interactive-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }

        .interactive-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
          opacity: 0.1;
          filter: blur(20px);
          mix-blend-mode: screen;
          border-radius: inherit;
          animation: pulse 4s ease-in-out infinite;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.08;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }

        .animate-entry {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          animation: slideInFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-entry.delay-1 {
          animation-delay: 0.15s;
        }

        .animate-entry.delay-2 {
          animation-delay: 0.3s;
        }

        @keyframes slideInFade {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .progress-bar-container {
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 12px;
        }

        .progress-bar-fill {
          width: 0%;
          height: 100%;
          background: white;
          border-radius: 9999px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: 0.4s;
        }

        .filter-chip {
          position: relative;
          transition: all 0.2s ease-in-out;
          border: 1px solid transparent;
        }

        .filter-chip::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: white;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .filter-chip:hover::before {
          opacity: 0.7;
        }

        .filter-chip.active {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .filter-chip.active::before {
          opacity: 1;
        }

        .clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AllTracksPage;