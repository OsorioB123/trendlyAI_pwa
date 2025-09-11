PÁGINA TODAS AS TRILHAS
<html lang="pt-BR"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore as Trilhas - TrendlyAI</title>
    <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        /* ATUALIZADO: Variável de cor amarela removida */
        :root {}

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

        .liquid-glass-pill:hover {
            background-color: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
        }

        .liquid-glass-pill:active {
            transform: scale(0.97);
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
        
        /* ATUALIZADO: Cor da barra de progresso alterada para branco */
        .progress-bar-fill {
            width: 0%;
            height: 100%;
            background: white;
            border-radius: 9999px;
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            transition-delay: 0.4s;
        }

        #filters-drawer-container {
            transition: opacity 0.3s ease;
        }

        #drawer-backdrop {
            transition: opacity 0.3s ease-in-out;
        }

        #filters-drawer {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #filters-drawer.open {
            transform: translateY(0) scale(1);
        }

        @media (max-width: 767px) {
            #filters-drawer {
                transform: translateY(100%) scale(1);
            }
        }

        @media (min-width: 768px) {
            #filters-drawer {
                transform: translateY(0) scale(0.95);
                opacity: 0;
            }
            #filters-drawer.open {
                opacity: 1;
            }
        }

        .filter-chip {
            position: relative;
            transition: all 0.2s ease-in-out;
            border: 1px solid transparent;
            margin-right: 8px;
        }
        
        /* ATUALIZADO: Cor da borda do filtro alterada para branco */
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

        .filter-chip:hover {
            transform: scale(1.05);
        }

        .filter-chip:hover::before {
            opacity: 0.7;
        }

        /* ATUALIZADO: Cor do filtro ativo alterada para branco translúcido */
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

        .custom-select-panel {
            backdrop-filter: blur(20px);
            background-color: rgba(30, 30, 35, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
            opacity: 0;
            transform: scale(0.95);
            transform-origin: top;
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .custom-select-panel.open {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
        }

        .custom-select-option:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        /* ATUALIZADO: Cor do texto selecionado alterada para branco */
        .custom-select-option.selected {
            color: white;
        }
    </style>
</head>

<!-- ATUALIZADO: Cor de seleção de texto alterada para branco translúcido -->
<body class="min-h-screen font-['Inter'] text-gray-100 antialiased bg-gray-950 selection:bg-white/20">

    <div style="height: 80px;"></div>

    <main class="mx-auto max-w-7xl px-4 pt-12 pb-12">
        <h1 class="text-3xl text-center md:text-left md:text-4xl font-semibold text-white tracking-tight mb-8 animate-entry" style="font-family: 'Geist', sans-serif;">Explore todas as Trilhas</h1>

        <section class="relative z-30 liquid-glass rounded-2xl mb-8 p-4 animate-entry delay-1">
            <div class="flex flex-col md:flex-row gap-4 mb-4">
                <div class="relative flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none z-10"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                    <!-- ATUALIZADO: Cor do anel de foco alterada para branco -->
                    <input id="search-input" type="text" placeholder="Busque por trilhas, tópicos..." class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50">
                </div>
                <div id="custom-select-container" class="relative md:w-52">
                    <!-- ATUALIZADO: Cor do anel de foco alterada para branco -->
                    <button id="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" class="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg py-2.5 pl-4 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50">
                        <span id="custom-select-label" class="truncate">Mais relevantes</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-white/50 transition-transform"><path d="m6 9 6 6 6-6"></path></svg>
                    </button>
                    <div id="custom-select-panel" role="listbox" class="absolute top-full right-0 mt-2 w-full rounded-lg z-20 p-1 custom-select-panel">
                        <button role="option" aria-selected="true" data-value="top" class="w-full text-left p-2 rounded-md flex items-center justify-between text-sm custom-select-option selected">
                            <span>Mais relevantes</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M20 6 9 17l-5-5"></path></svg>
                        </button>
                        <button role="option" aria-selected="false" data-value="recent" class="w-full text-left p-2 rounded-md flex items-center justify-between text-sm custom-select-option">
                            <span>Mais recentes</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 hidden"><path d="M20 6 9 17l-5-5"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex-1 overflow-x-auto hide-scrollbar whitespace-nowrap pb-2 -mb-2">
                    <button data-filter-group="categories" data-filter-value="Marketing" class="filter-chip inline-block px-4 py-1.5 rounded-full bg-white/5 text-sm text-white/80 hover:text-white">Marketing</button>
                    <button data-filter-group="categories" data-filter-value="Copywriting" class="filter-chip inline-block px-4 py-1.5 rounded-full bg-white/5 text-sm text-white/80 hover:text-white">Copywriting</button>
                    <button data-filter-group="categories" data-filter-value="Vídeo" class="filter-chip inline-block px-4 py-1.5 rounded-full bg-white/5 text-sm text-white/80 hover:text-white">Vídeo</button>
                    <button data-filter-group="categories" data-filter-value="Social Media" class="filter-chip inline-block px-4 py-1.5 rounded-full bg-white/5 text-sm text-white/80 hover:text-white">Social Media</button>
                </div>
                <button id="open-filters-drawer" class="flex-shrink-0 px-4 py-1.5 rounded-full liquid-glass-pill text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="21" x2="14" y1="4" y2="4"></line><line x1="10" x2="3" y1="4" y2="4"></line><line x1="21" x2="12" y1="12" y2="12"></line><line x1="8" x2="3" y1="12" y2="12"></line><line x1="21" x2="16" y1="20" y2="20"></line><line x1="12" x2="3" y1="20" y2="20"></line><line x1="14" x2="14" y1="2" y2="6"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="16" x2="16" y1="18" y2="22"></line></svg>
                    <span>Filtros</span>
                </button>
            </div>
        </section>

        <div id="tracks-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 animate-entry delay-2">
        </div>

        <div id="loader-container" class="mt-10 flex flex-col items-center">
            <p id="display-counter" class="text-sm text-white/70 mb-4"></p>
            <button id="load-more" class="liquid-glass-pill px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" style="display: none;">Carregar mais</button>
        </div>
    </main>

    <footer class="mt-12 mb-8 text-center text-white/60 text-xs">
        <p>© <span id="year">2025</span> TrendlyAI. Aprenda, crie e compartilhe.</p>
    </footer>

    <div id="filters-drawer-container" class="fixed inset-0 z-[60] opacity-0 pointer-events-none">
        <div id="drawer-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0"></div>
        <div id="filters-drawer" class="absolute bottom-0 left-0 right-0 md:left-auto md:right-4 md:top-24 md:w-[380px] md:h-auto liquid-glass flex flex-col max-h-[85vh] rounded-t-2xl md:rounded-2xl">
            <div class="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                <h2 class="text-lg font-semibold tracking-tight text-white" style="font-family:'Geist',sans-serif;">Filtros Avançados</h2>
                <button id="close-filters-drawer" class="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center liquid-glass-pill active:scale-95" style="border-radius:50%">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto p-5 space-y-6">
                <div>
                    <h3 class="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">NÍVEL</h3>
                    <div class="flex flex-col space-y-2">
                        <!-- ATUALIZADO: Cor do checkbox alterada para branco -->
                        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" data-filter-group="levels" value="Iniciante" class="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0">
                            <span>Iniciante</span>
                        </label>
                        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" data-filter-group="levels" value="Intermediário" class="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0">
                            <span>Intermediário</span>
                        </label>
                        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" data-filter-group="levels" value="Avançado" class="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0">
                            <span>Avançado</span>
                        </label>
                    </div>
                </div>
                <div>
                    <h3 class="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">STATUS</h3>
                    <div class="flex flex-col space-y-2">
                         <!-- ATUALIZADO: Cor do checkbox alterada para branco -->
                        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" data-filter-group="status" value="nao_iniciado" class="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0">
                            <span>Não iniciado</span>
                        </label>
                        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" data-filter-group="status" value="em_andamento" class="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0">
                            <span>Em andamento</span>
                        </label>
                        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" data-filter-group="status" value="concluido" class="h-4 w-4 rounded bg-white/10 border-white/20 text-white focus:ring-white focus:ring-offset-0">
                            <span>Concluído</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="p-4 border-t border-white/10 flex items-center gap-3 justify-end flex-shrink-0">
                <button id="clear-filters" class="liquid-glass-pill px-5 py-2.5 text-sm font-medium">Limpar</button>
                <!-- ATUALIZADO: Cor de fundo do botão alterada para branco -->
                <button id="apply-filters" class="liquid-glass-pill px-5 py-2.5 text-sm font-medium text-black" style="background: white;">Aplicar</button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons({
                strokeWidth: 1.5
            });

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

            const state = {
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
            };

            const unsplashUrl = (id, w = 800, q = 80) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
            const gridEl = document.getElementById('tracks-grid');

            function cardTemplate(track) {
                const categoryTags = track.categories.map(c => `<span class="liquid-glass-tag">${c}</span>`).join('');
                const levelTag = `<span class="liquid-glass-tag">${track.level}</span>`;

                return `
                    <div class="animate-entry">
                        <a href="#" class="interactive-card rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.28)] relative h-64 card-glow">
                            <img src="${unsplashUrl(track.image)}" alt="${track.title}" class="absolute w-full h-full object-cover">
                            <div class="absolute top-0 left-0 p-5 flex items-start gap-2 flex-wrap">
                                ${categoryTags}
                                ${levelTag}
                            </div>
                            <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                                <div class="p-5">
                                    <h3 class="font-semibold text-white text-lg clamp-2">${track.title}</h3>
                                </div>
                            </div>
                        </a>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" data-progress="${track.progress}"></div>
                        </div>
                    </div>
                `;
            }

            function filterAndSortTracks() {
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
            }

            async function fetchAndRender(isLoadMore = false) {
                if (state.loading) return;
                state.loading = true;

                if (!isLoadMore) {
                    state.page = 1;
                    gridEl.innerHTML = '';
                }

                await new Promise(res => setTimeout(res, 300));

                const filtered = filterAndSortTracks();
                state.total = filtered.length;
                const PAGE_SIZE = 9;
                const start = (state.page - 1) * PAGE_SIZE;
                const end = start + PAGE_SIZE;
                const items = filtered.slice(start, end);

                if (!isLoadMore && items.length === 0) {
                    gridEl.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <div class="liquid-glass rounded-xl p-8 max-w-md mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 mx-auto mb-4 text-white/50"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                                <h3 class="text-lg font-medium text-white mb-2">Nenhuma trilha encontrada</h3>
                                <p class="text-white/70 text-sm">Tente ajustar seus filtros ou buscar por outros termos.</p>
                            </div>
                        </div>
                    `;
                } else {
                    const newCardsHTML = items.map(cardTemplate).join('');
                    gridEl.insertAdjacentHTML('beforeend', newCardsHTML);

                    const renderedCards = gridEl.querySelectorAll('.animate-entry:not(.animated)');
                    renderedCards.forEach((card, i) => {
                        const delay = (isLoadMore ? i : (start + i)) % PAGE_SIZE;
                        card.style.animationDelay = `${delay * 80}ms`;
                        card.classList.add('animated');

                        const progressBar = card.querySelector('.progress-bar-fill');
                        const progress = progressBar.dataset.progress;
                        setTimeout(() => {
                            progressBar.style.width = `${progress}%`;
                        }, 500 + (delay * 80));
                    });
                }

                const loadMoreBtn = document.getElementById('load-more');
                const counterEl = document.getElementById('display-counter');
                const displayedCount = Math.min(state.page * PAGE_SIZE, state.total);

                counterEl.textContent = `Exibindo ${displayedCount} de ${state.total} trilhas`;
                loadMoreBtn.style.display = displayedCount >= state.total ? 'none' : 'block';

                state.loading = false;
            }

            const searchInput = document.getElementById('search-input');
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    state.filters.search = e.target.value;
                    fetchAndRender();
                }, 300);
            });

            const selectContainer = document.getElementById('custom-select-container');
            const selectTrigger = document.getElementById('custom-select-trigger');
            const selectPanel = document.getElementById('custom-select-panel');
            const selectLabel = document.getElementById('custom-select-label');

            selectTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                selectPanel.classList.toggle('open');
                const chevron = selectTrigger.querySelector('svg');
                chevron.style.transform = selectPanel.classList.contains('open') ? 'rotate(180deg)' : '';
            });

            selectPanel.addEventListener('click', (e) => {
                const option = e.target.closest('.custom-select-option');
                if (!option) return;

                selectPanel.querySelectorAll('.custom-select-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('svg').classList.add('hidden');
                });

                option.classList.add('selected');
                option.querySelector('svg').classList.remove('hidden');
                selectLabel.textContent = option.querySelector('span').textContent;

                state.filters.sort = option.dataset.value;
                selectPanel.classList.remove('open');
                selectTrigger.querySelector('svg').style.transform = '';

                fetchAndRender();
            });

            document.addEventListener('click', (e) => {
                if (!selectContainer.contains(e.target) && selectPanel.classList.contains('open')) {
                    selectPanel.classList.remove('open');
                    selectTrigger.querySelector('svg').style.transform = '';
                }
            });

            document.querySelectorAll('[data-filter-group="categories"]').forEach(chip => {
                chip.addEventListener('click', () => {
                    const filterValue = chip.dataset.filterValue;
                    const isActive = chip.classList.contains('active');

                    if (isActive) {
                        chip.classList.remove('active');
                        state.filters.categories = state.filters.categories.filter(cat => cat !== filterValue);
                    } else {
                        chip.classList.add('active');
                        state.filters.categories.push(filterValue);
                    }

                    fetchAndRender();
                });
            });

            document.getElementById('load-more').addEventListener('click', () => {
                state.page++;
                fetchAndRender(true);
            });

            const openDrawerBtn = document.getElementById('open-filters-drawer');
            const closeDrawerBtn = document.getElementById('close-filters-drawer');
            const drawerContainer = document.getElementById('filters-drawer-container');
            const drawer = document.getElementById('filters-drawer');
            const backdrop = document.getElementById('drawer-backdrop');

            openDrawerBtn.addEventListener('click', () => {
                drawerContainer.classList.remove('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    backdrop.classList.add('opacity-100');
                    drawer.classList.add('open');
                }, 10);
            });

            const closeDrawer = () => {
                backdrop.classList.remove('opacity-100');
                drawer.classList.remove('open');
                setTimeout(() => {
                    drawerContainer.classList.add('opacity-0', 'pointer-events-none');
                }, 400);
            };

            closeDrawerBtn.addEventListener('click', closeDrawer);
            backdrop.addEventListener('click', closeDrawer);

            document.getElementById('apply-filters').addEventListener('click', () => {
                const checkedLevels = Array.from(document.querySelectorAll('input[data-filter-group="levels"]:checked')).map(cb => cb.value);
                const checkedStatus = Array.from(document.querySelectorAll('input[data-filter-group="status"]:checked')).map(cb => cb.value);

                state.filters.levels = checkedLevels;
                state.filters.status = checkedStatus;
                fetchAndRender();
                closeDrawer();
            });

            document.getElementById('clear-filters').addEventListener('click', () => {
                state.filters.levels = [];
                state.filters.status = [];

                document.querySelectorAll('#filters-drawer input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                });
            });
            
            document.getElementById('year').textContent = new Date().getFullYear();

            fetchAndRender();
        });
    </script>

</body></html>