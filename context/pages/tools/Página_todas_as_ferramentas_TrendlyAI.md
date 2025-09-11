TODAS AS FERRAMENTAS

<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Explore as Ferramentas - TrendlyAI</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<style>
:root {
--brand-yellow: #efd135;
--brand-white-focus: rgba(255, 255, 255, 0.8);
--brand-white-active: rgba(255, 255, 255, 0.9);
}
body { -webkit-tap-highlight-color: transparent; }
/* Design System Styles */
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
padding: 4px 12px;
font-size: 11px;
font-weight: 500;
color: white;
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
/* Dropdown System */
.control-panel-dropdown {
position: absolute;
top: calc(100% + 8px);
left: 0;
z-index: 50;
opacity: 0;
transform: translateY(-10px) scale(0.95);
pointer-events: none;
transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
transform-origin: top;
backdrop-filter: blur(24px);
background-color: rgba(30, 31, 35, 0.97);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
border-radius: 12px;
padding: 0.5rem;
min-width: 100%;
}
.control-panel-dropdown.show {
opacity: 1;
transform: translateY(0) scale(1);
pointer-events: auto;
}
.menu-item {
transition: all 0.2s ease;
border-radius: 8px;
font-family: 'Inter', sans-serif;
}
.menu-item:hover {
background-color: rgba(255, 255, 255, 0.1);
}
/* Animation Styles */
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
/* Card Glow Effect */
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
/* Prompt Card Styles */
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
/* Modal Styles */
.prompt-modal-backdrop {
position: fixed;
inset: 0;
z-index: 100;
background: rgba(0,0,0,0.5);
backdrop-filter: blur(8px);
transition: opacity 0.4s ease;
}
.prompt-modal-container {
position: fixed;
z-index: 101;
background: rgba(26, 27, 30, 0.8);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.1);
}
.prompt-modal-inner-content {
opacity: 0;
transition: opacity 0.2s ease 0.2s;
}
.prompt-modal-container.open .prompt-modal-inner-content {
opacity: 1;
}
/* Filter Controls */
.control-panel-item {
height: 48px;
}
.filter-control-button {
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
background-color: rgba(255,255,255,0.05);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 12px;
padding: 0 1rem;
transition: all 0.2s ease;
}
.filter-control-button:hover {
background-color: rgba(255,255,255,0.1);
border-color: rgba(255,255,255,0.2);
}
.filter-control-button.active {
border-color: var(--brand-white-focus);
box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
}
.filter-count-badge {
position: absolute;
top: -6px;
right: -6px;
background-color: var(--brand-white-active);
color: #1a1a1a;
width: 20px;
height: 20px;
border-radius: 50%;
font-size: 11px;
font-weight: 600;
display: flex;
align-items: center;
justify-content: center;
transform: scale(0);
transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.filter-control-button.has-filters .filter-count-badge {
transform: scale(1);
}
/* Filters Modal */
#filters-modal-backdrop {
position: fixed;
inset: 0;
z-index: 60;
background: rgba(0,0,0,0.6);
backdrop-filter: blur(8px);
opacity: 0;
pointer-events: none;
transition: opacity 0.3s ease;
}
#filters-modal-container {
position: fixed;
z-index: 61;
top: 50%;
left: 50%;
width: 90vw;
max-width: 500px;
opacity: 0;
pointer-events: none;
transform: translate(-50%, -45%) scale(0.95);
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
#filters-modal-backdrop.active {
opacity: 1;
pointer-events: auto;
}
#filters-modal-container.active {
opacity: 1;
transform: translate(-50%, -50%) scale(1);
pointer-events: auto;
}
/* Custom Checkbox */
.custom-checkbox:checked {
background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
background-color: var(--brand-white-active);
border-color: var(--brand-white-active);
}
/* Toast Notification */
#toast-notification {
position: fixed;
bottom: 1.5rem;
left: 50%;
transform: translate(-50%, 20px);
opacity: 0;
transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
z-index: 200;
pointer-events: none;
backdrop-filter: blur(16px);
background-color: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
border-radius: 9999px;
padding: 0.75rem 1.5rem;
color: white;
font-size: 0.875rem;
font-weight: 500;
}
#toast-notification.show {
transform: translate(-50%, 0);
opacity: 1;
}
@media (max-width: 768px) {
.prompt-modal-container {
bottom: 0;
left: 0;
right: 0;
width: 100%;
height: 90vh;
border-radius: 20px 20px 0 0;
border-bottom: none;
transform: translateY(100%);
transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.prompt-modal-container.open {
transform: translateY(0);
}
.prompt-card {
padding: 16px;
}
.control-panel-dropdown {
right: 0;
width: max-content;
min-width: 200px;
}
}
</style></head>
<body class="min-h-screen bg-[#0A0A0C] font-['Inter'] text-white antialiased selection:bg-white/10">
    
    <div style="height: 80px;" class=""></div>

    <main class="w-full mx-auto max-w-7xl px-4 pb-12">
        <!-- Título -->
        <h1 class="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-8 text-center md:text-left animate-entry" style="font-family: 'Geist', sans-serif; animation-delay: 0ms;">
            Explore todas as Ferramentas
        </h1>

        <!-- Painel de Controle -->
        <section class="mb-10 animate-entry" style="animation-delay: 150ms;">
            <div class="grid grid-cols-1 md:grid-cols-10 gap-3 liquid-glass p-3">
                <!-- Barra de Busca -->
                <div class="md:col-span-5 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="search" class="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none z-10"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                    <input id="search-input" type="text" placeholder="Busque por objetivo, técnica ou ferramenta..." class="w-full h-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 control-panel-item">
                </div>
                
                <!-- Dropdown de Categorias -->
                <div class="md:col-span-2 relative">
                    <button id="categories-btn" class="filter-control-button control-panel-item">
                        <span class="truncate pr-2">Todas as Categorias</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-down" class="lucide lucide-chevron-down transition-transform w-[16px] h-[16px]" data-icon-replaced="true" style="width: 16px; height: 16px; color: rgb(255, 255, 255);"><path d="m6 9 6 6 6-6"></path></svg>
                    </button>
                    <div id="categories-panel" class="control-panel-dropdown show blur-none backdrop-blur-none grayscale">
                    <button data-value="all" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-[var(--brand-white-active)] transition-colors">
                        <span>Todas as Categorias</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check" class="lucide lucide-check w-4 h-4 text-white"><path d="M20 6 9 17l-5-5"></path></svg>
                    </button>
                
                    <button data-value="Copywriting" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Copywriting</span>
                        
                    </button>
                
                    <button data-value="SEO" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>SEO</span>
                        
                    </button>
                
                    <button data-value="Imagem" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Imagem</span>
                        
                    </button>
                
                    <button data-value="Análise" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Análise</span>
                        
                    </button>
                
                    <button data-value="Negócios" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Negócios</span>
                        
                    </button>
                
                    <button data-value="Marketing" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Marketing</span>
                        
                    </button>
                
                    <button data-value="Design" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Design</span>
                        
                    </button>
                </div>
                </div>
                
                <!-- Botão de Filtros -->
                <div class="md:col-span-2 relative">
                    <button id="filters-btn" class="filter-control-button control-panel-item">
                        <span class="truncate pr-2">Filtros</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="sliders-horizontal" class="lucide lucide-sliders-horizontal w-4 h-4 text-white/60"><line x1="21" x2="14" y1="4" y2="4"></line><line x1="10" x2="3" y1="4" y2="4"></line><line x1="21" x2="12" y1="12" y2="12"></line><line x1="8" x2="3" y1="12" y2="12"></line><line x1="21" x2="16" y1="20" y2="20"></line><line x1="12" x2="3" y1="20" y2="20"></line><line x1="14" x2="14" y1="2" y2="6"></line><line x1="8" x2="8" y1="10" y2="14"></line><line x1="16" x2="16" y1="18" y2="22"></line></svg>
                        <div class="filter-count-badge">0</div>
                    </button>
                </div>
                
                <!-- Dropdown de Ordenação -->
                <div class="md:col-span-1 relative">
                    <button id="sort-btn" class="filter-control-button control-panel-item">
                        <span class="truncate pr-2">Relevantes</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="arrow-up-down" class="lucide lucide-arrow-up-down w-4 h-4 text-white/60 transition-transform"><path d="m21 16-4 4-4-4"></path><path d="M17 20V4"></path><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path></svg>
                    </button>
                    <div id="sort-panel" class="control-panel-dropdown">
                    <button data-value="relevance" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-[var(--brand-white-active)] transition-colors">
                        <span>Relevantes</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check" class="lucide lucide-check w-4 h-4 text-white"><path d="M20 6 9 17l-5-5"></path></svg>
                    </button>
                
                    <button data-value="recent" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm text-white/80 hover:text-white transition-colors">
                        <span>Recentes</span>
                        
                    </button>
                </div>
                </div>
            </div>
        </section>

        <!-- Grade de Ferramentas -->
        

        <!-- Estado Vazio -->
        <div id="empty-state" class="hidden text-center py-20 animate-entry">
            <div class="liquid-glass rounded-2xl p-8 max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="archive-x" class="lucide lucide-archive-x w-16 h-16 mx-auto mb-6 text-white/40"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="m9.5 17 5-5"></path><path d="m9.5 12 5 5"></path></svg>
                <h3 class="text-xl font-semibold text-white mb-2" style="font-family: 'Geist', sans-serif;">
                    Nenhuma ferramenta encontrada
                </h3>
                <p class="text-white/70 text-sm mb-6">
                    Tente ajustar seus filtros ou sua busca para descobrir o prompt perfeito.
                </p>
                <button id="clear-all-filters-btn" class="liquid-glass-pill px-6 py-2.5 text-sm font-medium">
                    Limpar todos os filtros
                </button>
            </div>
        </div>
    </main>

    <!-- Modal de Filtros -->
    <div id="filters-modal-backdrop"></div>
    <div id="filters-modal-container" class="liquid-glass flex flex-col max-h-[85vh] rounded-2xl">
        <div class="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <h2 class="text-lg font-semibold tracking-tight text-white" style="font-family: 'Geist', sans-serif;">
                Filtros Avançados
            </h2>
            <button id="close-filters-modal-btn" class="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center liquid-glass-pill active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
        </div>
        <div id="filters-form" class="flex-1 overflow-y-auto p-5 space-y-6 hide-scrollbar"><div><h3 class="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">Tipo de Ferramenta</h3><div id="filter-type" class="flex flex-col space-y-2"><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="type" value="text-generation" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Text Generation</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="type" value="image-generation" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Image Generation</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="type" value="data-analysis" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Data Analysis</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="type" value="research" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Research</span></label></div></div><div><h3 class="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">Compatibilidade</h3><div id="filter-compatibility" class="flex flex-col space-y-2"><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="compatibility" value="ChatGPT" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Otimizado para ChatGPT</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="compatibility" value="Claude" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Otimizado para Claude</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="compatibility" value="Gemini" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Otimizado para Gemini</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="compatibility" value="Midjourney" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Otimizado para Midjourney</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="compatibility" value="DALL-E" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Otimizado para DALL-E</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="compatibility" value="Stable Diffusion" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Otimizado para Stable Diffusion</span></label></div></div><div><h3 class="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">Minha Atividade</h3><div id="filter-activity" class="flex flex-col space-y-2"><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="activity" value="isFavorite" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Meus Favoritos</span></label><label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="activity" value="isEdited" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">Editados por mim</span></label></div></div></div>
        <div class="p-4 border-t border-white/10 flex items-center gap-3 justify-end flex-shrink-0">
            <button id="clear-filters-btn" class="liquid-glass-pill px-5 py-2.5 text-sm font-medium">
                Limpar
            </button>
            <button id="apply-filters-btn" class="liquid-glass-pill px-5 py-2.5 text-sm font-medium text-white bg-white/15 hover:bg-white/20">
                Aplicar
            </button>
        </div>
    </div>
    
    <!-- Modal de Prompt -->
    <div id="prompt-modal-backdrop" class="prompt-modal-backdrop hidden opacity-0"></div>
    <div id="prompt-modal-container" class="prompt-modal-container"></div>
    
    <!-- Toast Notification -->
    <div id="toast-notification">Prompt copiado!</div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });
            
            // Mock Data
            const ALL_PROMPTS = [
                { id: "p01", title: "Roteiro Viral em 30 Segundos", description: "Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.", category: "Copywriting", type: "text-generation", compatibility: ["ChatGPT", "Claude", "Gemini"], tags: ["roteiro", "storytelling", "reels"], isFavorite: false, isEdited: true, content: "Você é um roteirista viral especializado em conteúdo de redes sociais...\n\n[INSTRUÇÕES]\nCrie um roteiro viral de 30 segundos seguindo a estrutura:\n\n1. GANCHO (0-3s): Uma frase ou pergunta que prende a atenção imediatamente\n2. DESENVOLVIMENTO (3-25s): Conte a história ou apresente o conteúdo principal\n3. CALL TO ACTION (25-30s): Termine com um convite claro para engajamento\n\n[TÓPICO]\n{seu_topico_aqui}\n\n[OUTPUT]\nFormate como roteiro com timing e direções visuais." },
                { id: "p02", title: "Títulos Otimizados para SEO", description: "Gere títulos magnéticos e otimizados para os mecanismos de busca que aumentam o CTR.", category: "SEO", type: "text-generation", compatibility: ["ChatGPT", "Claude"], tags: ["seo", "títulos", "blog"], isFavorite: false, isEdited: false, content: "Crie 5 títulos SEO-otimizados para o seguinte conteúdo...\n\n[DIRETRIZES]\n- Máximo 60 caracteres\n- Inclua a palavra-chave principal no início\n- Use power words (como 'definitivo', 'completo', 'secreto')\n- Crie urgência ou curiosidade\n- Seja específico com números quando possível\n\n[CONTEÚDO]\n{seu_conteudo_aqui}\n\n[PALAVRA-CHAVE]\n{palavra_chave_principal}\n\n[OUTPUT]\nRetorne 5 opções numeradas com explicação do por que cada uma funciona." },
                { id: "p03", title: "Cenário 3D Fotorrealista", description: "Crie um prompt detalhado para gerar uma cena de floresta mística ao amanhecer.", category: "Imagem", type: "image-generation", compatibility: ["Midjourney", "DALL-E", "Stable Diffusion"], tags: ["3d", "cenário", "iluminação"], isFavorite: false, isEdited: false, content: "/imagine prompt: mystical forest at golden hour, ancient towering trees with twisted branches, soft volumetric light rays piercing through morning mist, moss-covered fallen logs, delicate wildflowers scattered on forest floor, ethereal atmosphere, photorealistic 3D render, octane render, ultra detailed, 8k resolution, cinematic lighting, depth of field, fantasy environment --ar 16:9 --v 6 --style raw" },
                { id: "p04", title: "Análise de Sentimento de Comentários", description: "Analise um bloco de texto e classifique o sentimento predominante (positivo, negativo, neutro).", category: "Análise", type: "data-analysis", compatibility: ["ChatGPT", "Claude", "Gemini"], tags: ["dados", "sentimento", "feedback"], isFavorite: true, isEdited: false, content: "Analise os seguintes comentários e classifique o sentimento de cada um...\n\n[INSTRUÇÕES]\n- Classifique cada comentário como: POSITIVO, NEGATIVO ou NEUTRO\n- Forneça um score de 1-10 para intensidade do sentimento\n- Identifique as palavras-chave que determinaram a classificação\n- Resuma o sentimento geral no final\n\n[COMENTÁRIOS]\n{cole_os_comentarios_aqui}\n\n[OUTPUT]\nFormato:\nComentário 1: [SENTIMENTO] - Score: X/10\nPalavras-chave: [palavras]\n\nResumo geral: [análise_completa]" },
                { id: "p05", title: "Pesquisa de Mercado Profunda", description: "Execute uma pesquisa aprofundada sobre um nicho de mercado, identificando concorrentes e oportunidades.", category: "Negócios", type: "research", compatibility: ["ChatGPT", "Claude"], tags: ["pesquisa", "mercado", "estratégia"], isFavorite: false, isEdited: true, content: "Conduza uma análise completa do mercado para o seguinte nicho...\n\n[ESTRUTURA DA ANÁLISE]\n1. Visão geral do mercado (tamanho, crescimento, tendências)\n2. Análise de concorrentes (top 5 players principais)\n3. Público-alvo (demographics, comportamento, dores)\n4. Oportunidades de mercado (gaps não atendidos)\n5. Ameaças e desafios\n6. Recomendações estratégicas\n\n[NICHO]\n{seu_nicho_aqui}\n\n[OUTPUT]\nFormate como relatório executivo com dados específicos e insights acionáveis." },
                { id: "p06", title: "Gerador de Persona Detalhada", description: "Construa uma persona de cliente completa com dores, desejos, demografia e comportamento.", category: "Marketing", type: "text-generation", compatibility: ["ChatGPT", "Claude", "Gemini"], tags: ["persona", "público-alvo"], isFavorite: false, isEdited: false, content: "Crie uma persona detalhada para o seguinte produto/serviço...\n\n[ESTRUTURA DA PERSONA]\n📊 DEMOGRAFIA\n- Nome e idade\n- Localização e renda\n- Profissão e educação\n- Estado civil e família\n\n🎯 PSICOGRAFIA\n- Personalidade e valores\n- Interesses e hobbies\n- Estilo de vida\n\n😰 DORES E DESAFIOS\n- Principais problemas\n- Frustrações diárias\n- Medos e objeções\n\n💫 OBJETIVOS E DESEJOS\n- Aspirações de vida\n- Metas profissionais\n- Desejos secretos\n\n📱 COMPORTAMENTO DIGITAL\n- Redes sociais preferidas\n- Hábitos de consumo de conteúdo\n- Jornada de compra\n\n[PRODUTO/SERVIÇO]\n{seu_produto_servico_aqui}" },
                { id: "p07", title: "Copy de Vendas (AIDA)", description: "Crie textos persuasivos que convertem usando o framework AIDA (Atenção, Interesse, Desejo, Ação).", category: "Copywriting", type: "text-generation", compatibility: ["ChatGPT", "Claude"], tags: ["copywriting", "vendas", "aida"], isFavorite: true, isEdited: false, content: "Escreva uma copy de vendas persuasiva usando o framework AIDA...\n\n[ESTRUTURA AIDA]\n🎯 ATENÇÃO\n- Headline impactante\n- Estatística ou pergunta provocativa\n- Promessa específica\n\n🔥 INTERESSE\n- Desenvolva o problema\n- Conte uma história relacionável\n- Apresente credibilidade\n\n💎 DESEJO\n- Benefícios transformadores\n- Prova social (depoimentos)\n- Urgência/escassez\n\n⚡ AÇÃO\n- Call-to-action claro\n- Garantia/redução de risco\n- Instruções específicas\n\n[PRODUTO/SERVIÇO]\n{seu_produto_aqui}\n\n[PÚBLICO-ALVO]\n{sua_persona_aqui}\n\n[OUTPUT]\nCopy completa otimizada para conversão." },
                { id: "p08", title: "Ícone de App Estilo 'Liquid Glass'", description: "Gere um ícone de aplicativo moderno com efeito de vidro líquido e gradientes suaves.", category: "Design", type: "image-generation", compatibility: ["Midjourney", "DALL-E"], tags: ["ícone", "ui", "design"], isFavorite: false, isEdited: false, content: "/imagine prompt: app icon design, liquid glass effect, translucent material with soft gradients from blue to purple, subtle reflections and refractions, minimal geometric shape, glossy surface, depth and dimension, modern clean aesthetic, rounded square format, high quality 3D render, professional app store style, octane render, 1024x1024 resolution --ar 1:1 --v 6 --style raw" }
            ];
            
            // Application State
            const state = { search: '', category: 'all', sort: 'relevance', filters: { type: [], compatibility: [], activity: [] } };

            // DOM Elements
            const grid = document.getElementById('tools-grid');
            const emptyStateEl = document.getElementById('empty-state');
            const searchInput = document.getElementById('search-input');
            const filtersBtn = document.getElementById('filters-btn');
            const filterCountBadge = filtersBtn.querySelector('.filter-count-badge');

            // Template Functions
            function cardTemplate(prompt) {
                const firstTag = prompt.tags[0];
                const heartFill = prompt.isFavorite ? 'fill="white"' : 'fill="none"';
                const heartClass = prompt.isFavorite ? 'text-white' : 'text-white/40 hover:text-white';
                return `
                    <div class="tool-card-grid-item" data-id="${prompt.id}">
                        <div class="prompt-card relative card-glow">
                            <div class="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <div class="flex justify-between items-start mb-3">
                                        <span class="liquid-glass-tag">${firstTag}</span>
                                        <button class="favorite-btn p-1.5 -mr-1.5 -mt-1.5 transition-colors ${heartClass}" data-id="${prompt.id}" aria-label="Favoritar">
                                            <i data-lucide="heart" class="w-4 h-4" ${heartFill} stroke="currentColor"></i>
                                        </button>
                                    </div>
                                    <h3 class="text-base md:text-lg font-semibold text-white mb-2 leading-tight" style="font-family: 'Geist', sans-serif;">
                                        ${prompt.title}
                                    </h3>
                                    <p class="text-xs md:text-sm text-white/70 line-clamp-2 leading-relaxed mb-3">
                                        ${prompt.description}
                                    </p>
                                </div>
                                <div class="mt-auto">
                                    <div class="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                                        <span>Clique para abrir</span>
                                        <div class="flex items-center gap-1">
                                            <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Filter and Render Logic
            function filterAndRender() {
                const filteredPrompts = ALL_PROMPTS.filter(prompt => {
                    const searchMatch = state.search === '' || prompt.title.toLowerCase().includes(state.search) || prompt.description.toLowerCase().includes(state.search) || prompt.tags.some(tag => tag.toLowerCase().includes(state.search));
                    const categoryMatch = state.category === 'all' || prompt.category === state.category;
                    const typeMatch = state.filters.type.length === 0 || state.filters.type.includes(prompt.type);
                    const compatibilityMatch = state.filters.compatibility.length === 0 || prompt.compatibility.some(comp => state.filters.compatibility.includes(comp));
                    const favoriteMatch = !state.filters.activity.includes('isFavorite') || prompt.isFavorite;
                    const editedMatch = !state.filters.activity.includes('isEdited') || prompt.isEdited;
                    return searchMatch && categoryMatch && typeMatch && compatibilityMatch && favoriteMatch && editedMatch;
                });
                if (state.sort === 'recent') { filteredPrompts.reverse(); }
                grid.innerHTML = filteredPrompts.map(cardTemplate).join('');
                emptyStateEl.classList.toggle('hidden', filteredPrompts.length > 0);
                grid.classList.toggle('hidden', filteredPrompts.length === 0);
                lucide.createIcons({ strokeWidth: 1.5 });
            }

            const debounce = (func, delay) => { let timeout; return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), delay); }; };
            const handleRealtimeSearch = debounce((searchTerm) => { state.search = searchTerm.toLowerCase(); filterAndRender(); }, 300);

            // Enhanced Dropdown System
            function setupDropdown(triggerId, panelId, options) {
                const triggerBtn = document.getElementById(triggerId);
                const panel = document.getElementById(panelId);
                const label = triggerBtn.querySelector('span');
                const chevron = triggerBtn.querySelector('[data-lucide="chevron-down"], [data-lucide="arrow-up-down"]');
                
                panel.innerHTML = options.map(opt => `
                    <button data-value="${opt.value}" class="menu-item w-full text-left p-2.5 flex items-center justify-between text-sm ${opt.selected ? 'text-[var(--brand-white-active)]' : 'text-white/80 hover:text-white'} transition-colors">
                        <span>${opt.label}</span>
                        ${opt.selected ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : ''}
                    </button>
                `).join('');
                
                lucide.createIcons({ strokeWidth: 1.5 });
                
                triggerBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpening = !panel.classList.contains('show');
                    closeAllDropdowns();
                    if (isOpening) {
                        panel.classList.add('show');
                        if (chevron) chevron.style.transform = 'rotate(180deg)';
                    }
                });
                
                panel.addEventListener('click', (e) => {
                    const optionBtn = e.target.closest('button');
                    if (!optionBtn) return;
                    
                    if (triggerId === 'categories-btn') state.category = optionBtn.dataset.value;
                    if (triggerId === 'sort-btn') state.sort = optionBtn.dataset.value;
                    
                    label.textContent = optionBtn.querySelector('span').textContent;
                    closeAllDropdowns();
                    filterAndRender();
                    
                    // Update selected state visual
                    panel.querySelectorAll('button').forEach(btn => {
                        btn.classList.remove('text-[var(--brand-white-active)]');
                        btn.classList.add('text-white/80', 'hover:text-white');
                        const checkIcon = btn.querySelector('[data-lucide="check"]');
                        if (checkIcon) checkIcon.remove();
                    });
                    
                    optionBtn.classList.add('text-[var(--brand-white-active)]');
                    optionBtn.classList.remove('text-white/80', 'hover:text-white');
                    optionBtn.insertAdjacentHTML('beforeend', '<i data-lucide="check" class="w-4 h-4 text-white"></i>');
                    lucide.createIcons({ strokeWidth: 1.5 });
                });
            }

            function closeAllDropdowns() {
                document.querySelectorAll('.control-panel-dropdown').forEach(panel => {
                    if (panel.classList.contains('show')) {
                        panel.classList.remove('show');
                        const triggerId = panel.id.replace('-panel', '-btn');
                        const trigger = document.getElementById(triggerId);
                        const chevron = trigger?.querySelector('[data-lucide="chevron-down"], [data-lucide="arrow-up-down"]');
                        if (chevron) chevron.style.transform = '';
                    }
                });
            }

            // Filters Modal Setup
            function setupFiltersModal() {
                const modalBackdrop = document.getElementById('filters-modal-backdrop');
                const modalContainer = document.getElementById('filters-modal-container');
                const closeBtn = document.getElementById('close-filters-modal-btn');
                const applyBtn = document.getElementById('apply-filters-btn');
                const clearBtn = document.getElementById('clear-filters-btn');
                const form = document.getElementById('filters-form');
                const filterOptions = { type: [...new Set(ALL_PROMPTS.map(p => p.type))].map(type => ({ value: type, label: type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) })), compatibility: [...new Set(ALL_PROMPTS.flatMap(p => p.compatibility))].map(comp => ({ value: comp, label: `Otimizado para ${comp}` })), activity: [{ value: 'isFavorite', label: 'Meus Favoritos' }, { value: 'isEdited', label: 'Editados por mim' }] };
                form.innerHTML = Object.keys(filterOptions).map(key => `<div><h3 class="text-sm font-medium uppercase tracking-wider text-white/60 mb-3">${key === 'type' ? 'Tipo de Ferramenta' : (key === 'compatibility' ? 'Compatibilidade' : 'Minha Atividade')}</h3><div id="filter-${key}" class="flex flex-col space-y-2">${filterOptions[key].map(opt => `<label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"><input type="checkbox" name="${key}" value="${opt.value}" class="custom-checkbox h-4 w-4 rounded bg-white/10 border-white/20 text-black focus:ring-white/50 focus:ring-offset-0"><span class="text-sm">${opt.label}</span></label>`).join('')}</div></div>`).join('');
                const openModal = () => { modalBackdrop.classList.add('active'); modalContainer.classList.add('active'); };
                const closeModal = () => { modalBackdrop.classList.remove('active'); modalContainer.classList.remove('active'); };
                filtersBtn.addEventListener('click', openModal);
                closeBtn.addEventListener('click', closeModal);
                modalBackdrop.addEventListener('click', closeModal);
                applyBtn.addEventListener('click', () => { state.filters.type = Array.from(form.querySelectorAll('input[name="type"]:checked')).map(cb => cb.value); state.filters.compatibility = Array.from(form.querySelectorAll('input[name="compatibility"]:checked')).map(cb => cb.value); state.filters.activity = Array.from(form.querySelectorAll('input[name="activity"]:checked')).map(cb => cb.value); const totalFilters = Object.values(state.filters).reduce((acc, arr) => acc + arr.length, 0); filterCountBadge.textContent = totalFilters; filtersBtn.classList.toggle('has-filters', totalFilters > 0); filterAndRender(); closeModal(); });
                clearBtn.addEventListener('click', () => { form.querySelectorAll('input:checked').forEach(cb => cb.checked = false); });
                document.getElementById('clear-all-filters-btn').addEventListener('click', () => { state.search = ''; state.category = 'all'; state.sort = 'relevance'; state.filters = { type: [], compatibility: [], activity: [] }; searchInput.value = ''; document.getElementById('categories-btn').querySelector('span').textContent = 'Todas as Categorias'; document.getElementById('sort-btn').querySelector('span').textContent = 'Relevantes'; filterCountBadge.textContent = '0'; filtersBtn.classList.remove('has-filters'); filterAndRender(); });
            }

            // Prompt Modal Logic
            const promptModalBackdrop = document.getElementById('prompt-modal-backdrop'); const promptModalContainer = document.getElementById('prompt-modal-container'); let currentPromptId = null; let isMobile = window.innerWidth <= 768; function populatePromptModal(promptId) { const prompt = ALL_PROMPTS.find(p => p.id === promptId); if (!prompt) return; promptModalContainer.innerHTML = `<button id="close-prompt-modal-btn" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full z-10"><i data-lucide="x" class="w-5 h-5"></i></button><div class="prompt-modal-inner-content h-full"><div class="p-6 pt-12 md:pt-6 h-full flex flex-col"><div class="flex-shrink-0 mb-6"><h2 class="text-2xl font-semibold tracking-tight text-white" style="font-family: 'Geist', sans-serif;">${prompt.title}</h2><p class="text-white/70 mt-2">${prompt.description}</p><div class="flex flex-wrap gap-2 mt-4">${prompt.tags.map(tag => `<span class="liquid-glass-tag">${tag}</span>`).join('')}</div></div><div class="flex-grow overflow-hidden"><div class="liquid-glass p-4 h-full flex flex-col"><div class="flex items-center justify-between mb-4"><h4 class="font-semibold text-white">Prompt</h4><button id="copy-prompt-btn" class="liquid-glass-pill px-4 py-2 text-sm font-medium hover:scale-105 transition-transform flex items-center"><i data-lucide="copy" class="w-4 h-4 mr-2"></i>Copiar</button></div><textarea readonly class="flex-grow bg-black/30 p-4 rounded-lg text-sm leading-relaxed border border-white/10 resize-none focus:outline-none text-white/90 hide-scrollbar" style="font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;">${prompt.content}</textarea></div></div></div></div>`; lucide.createIcons({ strokeWidth: 1.5 }); } function openPromptModal(cardElement) { currentPromptId = cardElement.closest('.tool-card-grid-item').dataset.id; populatePromptModal(currentPromptId); document.body.style.overflow = 'hidden'; promptModalBackdrop.classList.remove('hidden'); const cardRect = cardElement.getBoundingClientRect(); if (!isMobile) { Object.assign(promptModalContainer.style, { width: `${cardRect.width}px`, height: `${cardRect.height}px`, top: `${cardRect.top}px`, left: `${cardRect.left}px`, transform: '', borderRadius: '16px', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }); } requestAnimationFrame(() => { promptModalBackdrop.style.opacity = '1'; if (!isMobile) { Object.assign(promptModalContainer.style, { width: 'min(90vw, 800px)', height: 'min(85vh, 750px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '20px' }); } setTimeout(() => promptModalContainer.classList.add('open'), 100); }); } function closePromptModal() { if (!currentPromptId) return; document.body.style.overflow = ''; promptModalBackdrop.style.opacity = '0'; promptModalContainer.classList.remove('open'); if (!isMobile) { const gridItem = grid.querySelector(`.tool-card-grid-item[data-id="${currentPromptId}"]`); if (gridItem) { const cardRect = gridItem.getBoundingClientRect(); Object.assign(promptModalContainer.style, { width: `${cardRect.width}px`, height: `${cardRect.height}px`, top: `${cardRect.top}px`, left: `${cardRect.left}px`, transform: '', borderRadius: '16px' }); } } setTimeout(() => { promptModalBackdrop.classList.add('hidden'); if (!isMobile) { promptModalContainer.style.transition = ''; } currentPromptId = null; }, 400); } function showToast(message) { const toast = document.getElementById('toast-notification'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => { toast.classList.remove('show'); }, 3000); }

            // Initialize Dropdowns
            const categories = ['all', ...new Set(ALL_PROMPTS.map(p => p.category))];
            setupDropdown('categories-btn', 'categories-panel', 
                categories.map((category, index) => ({
                    value: category,
                    label: category === 'all' ? 'Todas as Categorias' : category,
                    selected: index === 0
                }))
            );

            setupDropdown('sort-btn', 'sort-panel', [
                { value: 'relevance', label: 'Relevantes', selected: true },
                { value: 'recent', label: 'Recentes', selected: false }
            ]);

            // Initialize Filters Modal
            setupFiltersModal();

            // Event Listeners
            searchInput.addEventListener('input', (e) => handleRealtimeSearch(e.target.value));
            grid.addEventListener('click', (e) => { const favoriteBtn = e.target.closest('.favorite-btn'); if (favoriteBtn) { e.stopPropagation(); const promptId = favoriteBtn.dataset.id; const prompt = ALL_PROMPTS.find(p => p.id === promptId); if (prompt) { prompt.isFavorite = !prompt.isFavorite; const icon = favoriteBtn.querySelector('i'); if (prompt.isFavorite) { icon.setAttribute('fill', 'white'); favoriteBtn.classList.remove('text-white/40', 'hover:text-white'); favoriteBtn.classList.add('text-white'); } else { icon.setAttribute('fill', 'none'); favoriteBtn.classList.remove('text-white'); favoriteBtn.classList.add('text-white/40', 'hover:text-white'); } showToast(prompt.isFavorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos'); } } else if (e.target.closest('.prompt-card')) { openPromptModal(e.target.closest('.prompt-card')); } });
            promptModalContainer.addEventListener('click', (e) => { if (e.target.closest('#close-prompt-modal-btn')) { closePromptModal(); } else if (e.target.closest('#copy-prompt-btn')) { const prompt = ALL_PROMPTS.find(p => p.id === currentPromptId); if (prompt) { navigator.clipboard.writeText(prompt.content).then(() => { showToast('Prompt copiado para a área de transferência!'); }); } } });
            promptModalBackdrop.addEventListener('click', closePromptModal);
            
            // Enhanced click outside listener
            document.addEventListener('click', () => closeAllDropdowns());
            
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && currentPromptId) { closePromptModal(); } if (e.key === 'Escape') { closeAllDropdowns(); } });
            window.addEventListener('resize', () => { isMobile = window.innerWidth <= 768; });

            // Initial render
            filterAndRender();
        });
    </script>

</body></html>