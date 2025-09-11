HOME
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI - Dashboard</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<style>
:root {
--brand-yellow: #efd135;
}
body { -webkit-tap-highlight-color: transparent; }
/* --- ESTILOS GERAIS --- */
.liquid-glass-pill { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 9999px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.liquid-glass-pill:hover { background-color: rgba(255, 255, 255, 0.15); }
.liquid-glass-pill:active { transform: scale(0.97); }
.liquid-glass-tag { backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.16); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); border-radius: 9999px; padding: 2px 10px; font-size: 11px; font-weight: 500; color: white; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hs-outline { position: relative; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.14); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0); }
.hs-outline.is-active { transform: scale(1.02); box-shadow: 0px 0px 25px 5px rgba(255, 255, 255, 0.2), 0px 0px 45px 8px rgba(255, 255, 255, 0.1); }
.greeting-char { display: inline-block; opacity: 0; transform: translateY(15px) scale(0.9); animation: revealChar 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes revealChar { to { opacity: 1; transform: translateY(0) scale(1); } }
.hs-chip { opacity: 0; transform: translateY(10px); animation: revealChip 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 9999px; color: white; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
.hs-chip:hover { background-color: rgba(255, 255, 255, 0.15); transform: scale(1.05); }
@keyframes revealChip { to { opacity: 1; transform: translateY(0); } }
.animate-entry { opacity: 0; transform: translateY(30px) scale(0.98); animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-entry.delay-1 { animation-delay: 0.2s; } .animate-entry.delay-2 { animation-delay: 0.4s; } .animate-entry.delay-3 { animation-delay: 0.6s; } .animate-entry.delay-4 { animation-delay: 0.8s; }
@keyframes slideInFade { to { opacity: 1; transform: translateY(0) scale(1); } }
.interactive-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.interactive-card:hover {
transform: translateY(-6px) scale(1.02);
box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.35);
}
.card-glow::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%); opacity: 0.1; filter: blur(20px); mix-blend-mode: screen; border-radius: inherit; animation: pulse 4s ease-in-out infinite; pointer-events: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes pulse { 0%, 100% { opacity: 0.08; transform: scale(0.95); } 50% { opacity: 0.2; transform: scale(1.05); } }
.carousel-container { scroll-behavior: smooth; }
.carousel-track { scroll-snap-type: x mandatory; }
.carousel-item { scroll-snap-align: start; flex-shrink: 0; }
.carousel-nav-btn { z-index: 10; }
.carousel-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: scale(1); }
.carousel-nav-btn:active { transform: scale(0.95); }
.prompt-card { position: relative; overflow: hidden; background-color: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 16px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); cursor: pointer; height: 100%; display: flex; flex-direction: column; }
.prompt-card:hover {
transform: translateY(-6px) scale(1.02);
box-shadow: 0 15px 30px -5px rgba(0,0,0,0.35);
}
.border-glow { position: absolute; inset: 0; border-radius: inherit; opacity: 0; transition: opacity 0.4s ease; pointer-events: none; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
.prompt-card:hover .border-glow { opacity: 1; }
.border-glow::before { content: ''; position: absolute; inset: -150%; background: conic-gradient(from 180deg at 50% 50%, var(--brand-yellow), white, var(--brand-yellow)); animation: spin 4s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
/* --- NOVOS ESTILOS ADICIONADOS DA PÁGINA DE PERFIL --- */
.arsenal-card {
transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
background-size: cover;
background-position: center;
}
.arsenal-card:hover {
transform: translateY(-8px) scale(1.02);
box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
}
.card-overlay {
background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
transition: all 0.4s ease;
}
.arsenal-card:hover .card-overlay {
background: linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%);
}
.card-hover-actions {
opacity: 0;
transform: translateY(15px);
transition: all 0.3s ease 0.1s;
}
.arsenal-card:hover .card-hover-actions {
opacity: 1;
transform: translateY(0);
}
.progress-bar-label {
opacity: 0.7;
transition: opacity 0.3s ease;
}
.arsenal-card:hover .progress-bar-label {
opacity: 1;
}
</style></head>
<body class="min-h-screen bg-gray-950 font-['Inter'] text-white overflow-x-hidden">
    <div style="height: 80px;"></div>

    <main class="w-full mx-auto">
        <div id="home-container" class="max-w-5xl relative mr-auto ml-auto px-4">
            <!-- Hero Section -->
            <div class="min-h-[40vh] flex flex-col items-center justify-center mt-12 mb-6">
                <div class="mb-6 text-center animate-entry">
                    <h2 id="dynamic-greeting" class="text-3xl font-semibold text-white tracking-tight" style="font-family:'Geist',sans-serif;" aria-label="Boa tarde, Sofia">
                        <span class="greeting-char" style="animation-delay: 0ms;">B</span>
                        <span class="greeting-char" style="animation-delay: 50ms;">o</span>
                        <span class="greeting-char" style="animation-delay: 100ms;">m</span>
                        <span class="greeting-char" style="animation-delay: 150ms;">&nbsp;</span>
                        <span class="greeting-char" style="animation-delay: 200ms;">d</span>
                        <span class="greeting-char" style="animation-delay: 250ms;">i</span>
                        <span class="greeting-char" style="animation-delay: 300ms;">a</span>
                        <span class="greeting-char" style="animation-delay: 350ms;">,</span>
                        <span class="greeting-char" style="animation-delay: 400ms;">&nbsp;</span>
                        <span class="greeting-char" style="animation-delay: 450ms;">S</span>
                        <span class="greeting-char" style="animation-delay: 500ms;">o</span>
                        <span class="greeting-char" style="animation-delay: 550ms;">f</span>
                        <span class="greeting-char" style="animation-delay: 600ms;">i</span>
                        <span class="greeting-char" style="animation-delay: 650ms;">a</span>
                    </h2>
                </div>
                <div id="hero-search" class="w-full max-w-2xl mr-auto ml-auto animate-entry delay-1">
                    <div id="icebreakers" class="flex flex-wrap justify-center gap-2 mb-4" style="display: none;">
                        <button class="hs-chip" style="animation-delay: 0s;">Me dê ideias para um vídeo</button>
                        <button class="hs-chip" style="animation-delay: 100ms;">Monte um roteiro para Reels</button>
                        <button class="hs-chip" style="animation-delay: 200ms;">Crie um plano de estudos</button>
                    </div>
                    <div class="hs-outline" id="command-container">
                        <div class="flex gap-3 bg-white/10 border-white/14 border rounded-2xl p-4 backdrop-blur-md items-center">
                            <input type="text" id="command-input" placeholder="O que vamos criar hoje?" class="w-full bg-transparent border-none text-white placeholder-white/60 focus:outline-none text-base">
                            <button type="submit" class="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/14 hover:bg-white/15 liquid-glass-pill">
                                <i data-lucide="send" class="w-4 h-4 text-white"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="main-content" class="mt-10 mb-32">
                <!-- Continue Sua Trilha Section -->
                <section id="popular" class="animate-entry delay-2 mb-20">
                    <div class="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                        <h2 class="text-xl font-medium tracking-tight" style="font-family:'Geist',sans-serif;">Continue sua Trilha</h2>
                        <a href="#" class="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                            <span>Ver todos</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                    <div class="relative">
                        <button id="popular-prev-btn" class="carousel-nav-btn liquid-glass-pill absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center" disabled="">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <button id="popular-next-btn" class="carousel-nav-btn liquid-glass-pill absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center">
                            <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </button>
                        <div id="popular-container" class="carousel-container overflow-x-auto overflow-y-visible hide-scrollbar -mx-2 px-2 pt-4 pb-8">
                            <ol id="popular-track" class="carousel-track flex gap-6">
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&amp;q=80')">
                                        <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                            <h3 class="font-medium text-white text-xl mb-4">Marketing Digital para Iniciantes</h3>
                                            <div class="flex items-center justify-between text-sm mb-2 text-white/80 progress-bar-label">
                                                <span>Progresso</span>
                                                <span>70%</span>
                                            </div>
                                            <div class="w-full bg-white/10 rounded-full h-2 mb-4">
                                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: 70%"></div>
                                            </div>
                                            <div class="card-hover-actions">
                                                <button class="liquid-glass-pill w-full py-3 font-medium">
                                                    Continuar Trilha
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&amp;q=80')">
                                        <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                            <h3 class="font-medium text-white text-xl mb-4">Análise de Dados com Google Analytics</h3>
                                            <div class="flex items-center justify-between text-sm mb-2 text-white/80 progress-bar-label">
                                                <span>Progresso</span>
                                                <span>35%</span>
                                            </div>
                                            <div class="w-full bg-white/10 rounded-full h-2 mb-4">
                                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: 35%"></div>
                                            </div>
                                            <div class="card-hover-actions">
                                                <button class="liquid-glass-pill w-full py-3 font-medium">
                                                    Continuar Trilha
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&amp;q=80')">
                                        <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                            <h3 class="font-medium text-white text-xl mb-4">Gestão de Redes Sociais</h3>
                                            <div class="flex items-center justify-between text-sm mb-2 text-white/80 progress-bar-label">
                                                <span>Progresso</span>
                                                <span>55%</span>
                                            </div>
                                            <div class="w-full bg-white/10 rounded-full h-2 mb-4">
                                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: 55%"></div>
                                            </div>
                                            <div class="card-hover-actions">
                                                <button class="liquid-glass-pill w-full py-3 font-medium">
                                                    Continuar Trilha
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&amp;q=80')">
                                        <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                            <h3 class="font-medium text-white text-xl mb-4">Planejamento Estratégico Digital</h3>
                                            <div class="flex items-center justify-between text-sm mb-2 text-white/80 progress-bar-label">
                                                <span>Progresso</span>
                                                <span>90%</span>
                                            </div>
                                            <div class="w-full bg-white/10 rounded-full h-2 mb-4">
                                                <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: 90%"></div>
                                            </div>
                                            <div class="card-hover-actions">
                                                <button class="liquid-glass-pill w-full py-3 font-medium">
                                                    Finalizar Trilha
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                <!-- Recommended Tracks Section -->
                <section id="recommended" class="animate-entry delay-3 mb-20">
                    <div class="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                        <h2 class="text-xl font-medium tracking-tight" style="font-family:'Geist',sans-serif;">Trilhas recomendadas pra você</h2>
                        <a href="#" class="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                            <span>Ver todos</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                    <div class="relative">
                        <button id="recommended-prev-btn" class="carousel-nav-btn liquid-glass-pill absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center" disabled="">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <button id="recommended-next-btn" class="carousel-nav-btn liquid-glass-pill absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center">
                            <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </button>
                        <div id="recommended-container" class="carousel-container overflow-x-auto overflow-y-visible hide-scrollbar -mx-2 px-2 pt-4 pb-8">
                            <ol id="recommended-track" class="carousel-track flex gap-6">
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="interactive-card rounded-2xl overflow-hidden relative h-64 card-glow">
                                        <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&amp;q=80" alt="Vendas Online" class="absolute w-full h-full object-cover">
                                        <div class="absolute top-0 left-0 p-5 flex items-start gap-2">
                                            <span class="liquid-glass-tag">Vendas</span>
                                            <span class="liquid-glass-tag">Intermediário</span>
                                        </div>
                                        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                                            <div class="p-5">
                                                <h3 class="font-medium text-white text-lg">Funil de Vendas para E-commerce</h3>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="interactive-card rounded-2xl overflow-hidden relative h-64 card-glow">
                                        <img src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&amp;q=80" alt="Email Marketing" class="absolute w-full h-full object-cover">
                                        <div class="absolute top-0 left-0 p-5 flex items-start gap-2">
                                            <span class="liquid-glass-tag">Email</span>
                                            <span class="liquid-glass-tag">Iniciante</span>
                                        </div>
                                        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                                            <div class="p-5">
                                                <h3 class="font-medium text-white text-lg">Email Marketing Efetivo</h3>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="interactive-card rounded-2xl overflow-hidden relative h-64 card-glow">
                                        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&amp;q=80" alt="SEO" class="absolute w-full h-full object-cover">
                                        <div class="absolute top-0 left-0 p-5 flex items-start gap-2">
                                            <span class="liquid-glass-tag">SEO</span>
                                            <span class="liquid-glass-tag">Intermediário</span>
                                        </div>
                                        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                                            <div class="p-5">
                                                <h3 class="font-medium text-white text-lg">SEO para Negócios Locais</h3>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>
                
                <!-- Tools Section -->
                <section id="tools" class="animate-entry delay-4 mb-20">
                    <div class="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                        <h2 class="text-xl font-medium tracking-tight" style="font-family:'Geist',sans-serif;">Ferramentas recomendadas pra você</h2>
                        <a href="#" class="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                            <span>Ver todos</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                    <div class="relative">
                        <button id="tools-prev-btn" class="carousel-nav-btn liquid-glass-pill absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center" disabled="">
                            <i data-lucide="chevron-left" class="w-5 h-5"></i>
                        </button>
                        <button id="tools-next-btn" class="carousel-nav-btn liquid-glass-pill absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 rounded-full hidden lg:flex items-center justify-center">
                            <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </button>
                        <div id="tools-container" class="carousel-container overflow-x-auto overflow-y-visible hide-scrollbar -mx-2 px-2 pt-4 pb-8">
                            <ol id="tools-track" class="carousel-track flex gap-6">
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                     <div class="prompt-card relative">
                                        <div class="border-glow"></div>
                                        <div class="relative z-10 flex flex-col flex-grow">
                                            <div class="flex justify-between items-start mb-4 flex-grow">
                                                <div class="flex-1">
                                                    <h3 class="text-lg font-medium text-white mb-2 leading-snug" style="font-family:'Geist',sans-serif;">Crie um Roteiro Viral em 30 Segundos</h3>
                                                    <p class="text-sm text-white/70 line-clamp-2 leading-relaxed">Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.</p>
                                                </div>
                                            </div>
                                            <div class="flex flex-wrap gap-2 mb-4">
                                                <span class="liquid-glass-tag">roteiro</span>
                                                <span class="liquid-glass-tag">storytelling</span>
                                            </div>
                                            <div class="flex items-center justify-between text-xs text-white/50 mt-auto">
                                                <span>Clique para abrir</span>
                                                <div class="flex items-center gap-1">
                                                    <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="prompt-card relative">
                                        <div class="border-glow"></div>
                                        <div class="relative z-10 flex flex-col flex-grow">
                                            <div class="flex justify-between items-start mb-4 flex-grow">
                                                <div class="flex-1">
                                                    <h3 class="text-lg font-medium text-white mb-2 leading-snug" style="font-family:'Geist',sans-serif;">Crie Títulos Otimizados para SEO</h3>
                                                    <p class="text-sm text-white/70 line-clamp-2 leading-relaxed">Use este prompt para gerar títulos magnéticos e otimizados para mecanismos de busca.</p>
                                                </div>
                                            </div>
                                            <div class="flex flex-wrap gap-2 mb-4">
                                                <span class="liquid-glass-tag">seo</span>
                                                <span class="liquid-glass-tag">títulos</span>
                                            </div>
                                            <div class="flex items-center justify-between text-xs text-white/50 mt-auto">
                                                <span>Clique para abrir</span>
                                                <div class="flex items-center gap-1">
                                                    <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="carousel-item w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                                    <div class="prompt-card relative">
                                        <div class="border-glow"></div>
                                        <div class="relative z-10 flex flex-col flex-grow">
                                            <div class="flex justify-between items-start mb-4 flex-grow">
                                                <div class="flex-1">
                                                    <h3 class="text-lg font-medium text-white mb-2 leading-snug" style="font-family:'Geist',sans-serif;">Copy de Vendas Irresistível</h3>
                                                    <p class="text-sm text-white/70 line-clamp-2 leading-relaxed">Crie textos persuasivos que convertem usando gatilhos mentais comprovados.</p>
                                                </div>
                                            </div>
                                            <div class="flex flex-wrap gap-2 mb-4">
                                                <span class="liquid-glass-tag">copywriting</span>
                                                <span class="liquid-glass-tag">vendas</span>
                                            </div>
                                            <div class="flex items-center justify-between text-xs text-white/50 mt-auto">
                                                <span>Clique para abrir</span>
                                                <div class="flex items-center gap-1">
                                                    <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });
            
            // Dynamic Greeting & Text Effect
            const initGreeting = () => {
                const greetingElement = document.getElementById('dynamic-greeting');
                if (!greetingElement) return;
                const hour = new Date().getHours();
                let greetingText = "Boa noite, Sofia";
                if (hour >= 5 && hour < 12) greetingText = "Bom dia, Sofia";
                else if (hour >= 12 && hour < 18) greetingText = "Boa tarde, Sofia";
                
                greetingElement.innerHTML = '';
                greetingText.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.className = 'greeting-char';
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    span.style.animationDelay = `${index * 50}ms`;
                    greetingElement.appendChild(span);
                });
            };
            initGreeting();
            
            // Command Bar Logic
            const setupCommandBar = () => {
                const commandInput = document.getElementById('command-input');
                const commandContainer = document.getElementById('command-container');
                const icebreakers = document.getElementById('icebreakers');
                if (!commandInput) return;
                commandInput.addEventListener('focus', () => { icebreakers.style.display = 'flex'; commandContainer.classList.add('is-active'); });
                commandInput.addEventListener('blur', () => { setTimeout(() => { if (document.activeElement !== commandInput && !icebreakers.contains(document.activeElement)) { icebreakers.style.display = 'none'; commandContainer.classList.remove('is-active'); } }, 150); });
                icebreakers.querySelectorAll('button').forEach(button => { button.addEventListener('click', () => { commandInput.value = button.textContent; commandInput.focus(); icebreakers.style.display = 'none'; }); });
            };
            setupCommandBar();

            // Carousel Logic
            const setupCarousel = (idPrefix) => {
                const track = document.getElementById(`${idPrefix}-track`);
                const prevBtn = document.getElementById(`${idPrefix}-prev-btn`);
                const nextBtn = document.getElementById(`${idPrefix}-next-btn`);
                const indicators = document.getElementById(`${idPrefix}-indicators`);
                if (!track) return;
                const items = Array.from(track.children);
                const totalItems = items.length;
                
                const updateCarousel = () => {
                    if (track.scrollWidth <= track.clientWidth) {
                        if (prevBtn) prevBtn.disabled = true;
                        if (nextBtn) nextBtn.disabled = true;
                        return;
                    }
                    const scrollLeft = track.scrollLeft;
                    const maxScrollLeft = track.scrollWidth - track.clientWidth;
                    if (prevBtn) prevBtn.disabled = scrollLeft < 10;
                    if (nextBtn) nextBtn.disabled = scrollLeft > maxScrollLeft - 10;
                    if (indicators) {
                        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight || 0);
                        const currentIndex = Math.round((scrollLeft + 10) / itemWidth) + 1;
                        indicators.textContent = `${Math.min(currentIndex, totalItems)} / ${totalItems}`;
                    }
                };
                
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => { 
                        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight || 0); 
                        track.scrollBy({ left: itemWidth * 2, behavior: 'smooth' }); 
                    });
                }
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => { 
                        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight || 0); 
                        track.scrollBy({ left: -(itemWidth * 2), behavior: 'smooth' }); 
                    });
                }
                
                const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { track.addEventListener('scroll', updateCarousel, { passive: true }); window.addEventListener('resize', updateCarousel); updateCarousel(); } else { track.removeEventListener('scroll', updateCarousel); window.removeEventListener('resize', updateCarousel); } }); }, { threshold: 0.1 });
                observer.observe(track);
            };
            setupCarousel('popular');
            setupCarousel('recommended');
            setupCarousel('tools');
        });
    </script>

</body></html>