<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI - Assistente</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
<style>
:root {
--brand-pink: #bf4ea1;
--brand-mint: #9df4e9;
--brand-gold: #2fd159;
--brand-blue: #0091FF;
--brand-blue-rgb: 0, 145, 255;
--grad-primary: linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-mint) 100%);
}
/* --- ESTILOS GERAIS E DE LAYOUT --- */
body { -webkit-tap-highlight-color: transparent; }
html, body { height: 100%; overflow: hidden; }
body { display: flex; background-color: #121217; }
.liquid-glass { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28); }
.liquid-glass-pill { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.liquid-glass-pill:hover { background-color: rgba(255, 255, 255, 0.15); transform: scale(1.05); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
.liquid-glass-opaque { backdrop-filter: blur(24px); background-color: rgba(30, 30, 40, 0.95); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); border-radius: 16px; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
#chat-container { display: flex; flex-direction: column; width: 100%; height: 100%; }
#chat-area { flex-grow: 1; overflow-y: auto; scroll-behavior: smooth; }
#chat-area-content { padding-top: 100px; padding-bottom: 160px; }
#composer-container { position: fixed; bottom: 0; right: 0; z-index: 20; }
#main-header, #conversations-sidebar, #chat-container, #composer-container, #open-sidebar-desktop-btn { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@media (min-width: 768px) {
#chat-container, #composer-container, #main-header { margin-left: 21rem; }
body.sidebar-desktop-collapsed #conversations-sidebar { transform: translateX(-100%); }
body.sidebar-desktop-collapsed #chat-container,
body.sidebar-desktop-collapsed #composer-container,
body.sidebar-desktop-collapsed #main-header { margin-left: 0; }
body.sidebar-desktop-collapsed #open-sidebar-desktop-btn { opacity: 1; pointer-events: auto; transform: translateX(0) scale(1); }
}
@media (max-width: 767px) {
.message-bubble { max-width: 95%; }
#conversations-sidebar { border-radius: 0; }
}
/* --- MENSAGENS DO CHAT --- */
.user-bubble { backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); color: white; }
.assistant-bubble { backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; }
.message-bubble { max-width: 85%; border-radius: 18px; padding: 12px 16px; animation: fadeInUpBubble 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.markdown-content { color: rgba(255, 255, 255, 0.95); line-height: 1.6; }
.markdown-content p:not(:last-child) { margin-bottom: 1em; }
.markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1em; }
.markdown-content li:not(:last-child) { margin-bottom: 0.5em; }
/* --- COMPOSER DE CHAT --- */
.chat-composer-container { background-color: #1E1F22; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.25rem; transition: border-color 0.2s ease; display: flex; flex-direction: column; }
.chat-composer-container.focused { border-color: rgba(255, 255, 255, 0.3); }
.chat-composer-textarea { background: transparent; border: none; color: white; resize: none; outline: none; min-height: 52px; max-height: 200px; line-height: 1.5; font-size: 1rem; }
.chat-composer-textarea::placeholder { color: rgba(255, 255, 255, 0.5); }
.chat-composer-actions { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; }
.composer-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background-color: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.6); transition: all 0.2s ease; }
.composer-btn:hover { background-color: rgba(255, 255, 255, 0.12); color: white; }
#send-btn.active { background-color: rgba(255, 255, 255, 0.15); color: white; }
.search-toggle-btn { display: flex; align-items: center; gap: 0.5rem; height: 36px; padding: 0 0.5rem; border-radius: 9999px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid transparent; }
.search-toggle-btn.active { background-color: rgba(var(--brand-blue-rgb), 0.15); border-color: var(--brand-blue); color: var(--brand-blue); }
.search-toggle-btn:not(.active) { background-color: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.6); }
.search-toggle-btn:not(.active):hover { color: white; background-color: rgba(255, 255, 255, 0.12); }
#search-text { transition: all 0.3s ease; white-space: nowrap; overflow: hidden; }
/* --- ANIMAÇÃO DE THINKING DA IA --- */
.ai-thinking-container { opacity: 0; transform: translateY(20px); animation: fadeInUpBubble 0.4s ease-out forwards; }
.ai-thinking-text { font-size: 1.125rem; font-weight: 600; background: linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.9) 25%, rgba(255, 255, 255, 0.9) 75%, rgba(255, 255, 255, 0.4) 100%); background-size: 200% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; animation: shimmer 2.5s linear infinite; white-space: nowrap; min-width: max-content; display: flex; justify-content: center; opacity: 0; transform: translateY(20px); animation: fadeInText 0.3s ease-out forwards, shimmer 2.5s linear infinite; }
@keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
@keyframes fadeInText { to { opacity: 1; transform: translateY(0); } }
.ai-thinking-text.fade-out { animation: fadeOutText 0.3s ease-out forwards; }
@keyframes fadeOutText { to { opacity: 0; transform: translateY(-20px); } }
/* --- DROPDOWNS E MENUS --- */
.dropdown-menu { opacity: 0; transform: translateY(-10px) scale(0.95); pointer-events: none; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: top right; }
.dropdown-menu.show { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
.menu-item:hover, .notification-item:hover, .dropdown-item:hover { background-color: rgba(255, 255, 255, 0.1); }
/* --- HEADER DROPDOWNS & CREDITS --- */
.credits-progress-bar { background-color: rgba(255, 255, 255, 0.1); border-radius: 9999px; overflow: hidden; position: relative; }
.credits-progress-fill { height: 100%; background: #FFFFFF; border-radius: 9999px; position: relative; overflow: hidden; box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.4); transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
.credit-tooltip { opacity: 0; transform: translateY(5px) scale(0.98); pointer-events: none; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: bottom right; }
.credit-tooltip.show { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
/* --- HISTÓRICO DE CONVERSAS (SIDEBAR) --- */
.conversation-item { transition: background-color 0.2s ease, transform 0.2s ease; border-radius: 10px; }
.conversation-item.active { background-color: rgba(255, 255, 255, 0.15); }
.conversation-item:hover:not(.active) { background-color: rgba(255, 255, 255, 0.08); transform: translateX(4px); }
.conversation-options-btn { opacity: 0.6; transition: opacity 0.2s ease; }
.conversation-item:hover .conversation-options-btn, .conversation-options-btn.active { opacity: 1; }
/* --- ANIMAÇÕES E OUTROS ESTILOS --- */
@keyframes fadeInUpBubble { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.header-fade { animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
.notification-dot { animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
</style></head>
<body class="font-['Inter'] text-white">

    <div style="height: 80px;"></div>

    <div id="sidebar-backdrop" class="fixed inset-0 bg-black/50 z-40 opacity-0 pointer-events-none md:hidden transition-opacity duration-300"></div>
    
    <!-- Sidebar -->
    <aside id="conversations-sidebar" class="fixed top-0 left-0 w-[85%] sm:w-80 h-full p-0 md:p-0 md:inset-y-4 md:left-4 md:h-auto z-50 transform -translate-x-full md:translate-x-0">
        <div class="liquid-glass w-full h-full flex flex-col rounded-none md:rounded-3xl">
            <div class="p-4 flex flex-col flex-shrink-0">
                <div class="flex justify-between items-center h-11">
                    <h3 class="text-white font-semibold tracking-tight hidden md:block">Conversas</h3>
                    <button id="minimize-sidebar-btn" aria-label="Minimizar sidebar" class="text-white/60 hover:text-white hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <i data-lucide="panel-left-close" class="w-5 h-5"></i>
                    </button>
                    <h3 class="text-white font-semibold tracking-tight mt-2 md:hidden">Conversas</h3>
                     <button id="close-sidebar-x-btn" aria-label="Fechar Menu" class="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:hidden">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
            </div>
            <div class="px-4 pb-4 flex-shrink-0">
                <div class="h-px bg-white/10 rounded-full"></div>
            </div>
            <div id="conversations-list" class="flex-grow overflow-y-auto hide-scrollbar px-2 space-y-1">
                <!-- As conversas serão renderizadas aqui pelo JavaScript -->
            </div>
            <div class="p-2 flex-shrink-0">
                <button id="new-conversation-btn" class="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98]">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                    <span class="font-medium">Nova Conversa</span>
                </button>
            </div>
        </div>
    </aside>

    <button id="open-sidebar-desktop-btn" aria-label="Abrir sidebar" class="fixed left-4 top-24 w-12 h-12 rounded-full liquid-glass-pill hidden md:flex items-center justify-center shadow-lg z-20 opacity-0 pointer-events-none transform -translate-x-4 scale-95">
        <i data-lucide="panel-left-open" class="w-5 h-5 text-white"></i>
    </button>
    
    <div id="chat-container">
        <!-- Header Completo -->
        <header id="main-header" class="fixed top-0 left-0 right-0 z-30 pt-3 pr-4 pb-3 pl-4 header-fade">
            <div class="max-w-7xl flex sticky top-0 z-40 mr-auto ml-auto items-center justify-between liquid-glass rounded-full px-5 py-3">
                <div class="flex items-center gap-4">
                    <a href="#" aria-label="Voltar" class="w-11 h-11 hidden md:flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95">
                        <i data-lucide="chevron-left" class="w-6 h-6"></i>
                    </a>
                    <button id="open-sidebar-mobile-btn" aria-label="Abrir Menu" class="w-11 h-11 flex md:hidden items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95">
                        <i data-lucide="menu" class="w-5 h-5"></i>
                    </button>
                    <a href="#" aria-label="Voltar para a Home" class="flex items-center hover:opacity-80 transition-opacity">
                        <img src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&amp;q=80" alt="TrendlyAI Logo" class="h-8 w-auto object-cover">
                    </a>
                </div>
                <div class="flex items-center gap-2">
                    <div class="relative">
                        <button id="bell-button" aria-label="Notificações" class="relative w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95">
                            <i data-lucide="bell" class="w-5 h-5"></i>
                            <span class="absolute top-2 right-2 flex h-2 w-2">
                                <span class="notification-dot absolute inline-flex h-full w-full rounded-full bg-[var(--brand-gold)] opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-gold)]"></span>
                            </span>
                        </button>
                        <div id="notifications-dropdown" class="dropdown-menu liquid-glass-opaque absolute top-full right-0 mt-2 p-2 w-80 z-50">
                            <div class="p-2 flex justify-between items-center"> <h4 class="text-white font-semibold text-sm">Notificações</h4> <a href="#" class="text-xs text-white/60 hover:text-white transition-colors">Marcar como lidas</a> </div>
                            <div class="space-y-1"> <a href="#" class="notification-item block p-3 rounded-lg"> <p class="text-sm text-white">Nova trilha de Storytelling disponível!</p> <span class="text-xs text-white/60">há 5 min</span> </a> <a href="#" class="notification-item block p-3 rounded-lg"> <p class="text-sm text-white">Seu projeto "Roteiro para Reels" foi salvo.</p> <span class="text-xs text-white/60">há 2 horas</span> </a> </div>
                            <div class="border-t border-white/10 mt-2 pt-2"> <a href="#" class="block text-center text-xs text-white/70 hover:text-white transition-colors p-2">Ver todas as notificações</a> </div>
                        </div>
                    </div>
                    <div class="relative">
                        <button id="profile-button" aria-label="Menu do Perfil" class="w-11 h-11 rounded-full flex items-center justify-center transition-all ring-2 ring-transparent hover:ring-white/30 liquid-glass-pill">
                            <div class="w-9 h-9 rounded-full overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&amp;q=80" alt="Avatar" class="w-full h-full object-cover">
                            </div>
                        </button>
                        <div id="profile-dropdown" class="dropdown-menu liquid-glass-opaque absolute top-full right-0 mt-2 p-4 w-72 z-50">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&amp;q=80" alt="Avatar" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <h5 class="font-semibold text-white">João da Silva</h5>
                                    <p class="text-sm text-white/70 flex items-center gap-1.5"><i data-lucide="sparkles" class="w-4 h-4 text-yellow-400"></i><span>Explorador</span></p>
                                </div>
                            </div>
                            <a href="#" class="block text-center w-full px-4 py-2.5 mb-5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 liquid-glass-pill">Meu Perfil</a>
                            <div class="mb-2">
                                <div class="flex justify-between items-center mb-1.5">
                                    <h6 class="text-xs font-medium text-white/80">Créditos Mensais</h6>
                                    <div class="relative">
                                        <button id="credits-info-btn" aria-label="Informações sobre créditos" class="text-white/60 hover:text-white transition-colors">
                                            <i data-lucide="info" class="w-3.5 h-3.5"></i>
                                        </button>
                                        <div id="credits-tooltip" class="credit-tooltip liquid-glass absolute bottom-full right-0 mb-2 p-3 w-64 rounded-lg">
                                            <p class="text-xs text-white/90">Seus créditos são usados para conversas e se renovam a cada 24h. Precisa de mais? <a href="#" class="font-semibold text-[var(--brand-gold)] hover:underline">Torne-se um Maestro</a> para ter acesso ilimitado.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="credits-progress-bar w-full h-3">
                                        <div class="credits-progress-fill" style="width: 70%;"></div>
                                    </div>
                                    <p class="text-xs text-right text-white/60 mt-1">35/50</p>
                                </div>
                            </div>
                            <div class="space-y-1 border-t border-white/10 pt-3 mt-4">
                                <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg"> <i data-lucide="gem" class="w-4 h-4 text-white/70"></i> <span>Gerenciar Assinatura</span> </a>
                                <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg"> <i data-lucide="settings" class="w-4 h-4 text-white/70"></i> <span>Configurações</span> </a>
                                <div class="border-t border-white/10 my-2"></div>
                                <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-red-400 hover:text-red-300 text-sm rounded-lg"> <i data-lucide="log-out" class="w-4 h-4"></i> <span>Sair da Conta</span> </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        
        <main id="chat-area" class="hide-scrollbar">
            <div id="chat-area-content" class="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
                <!-- As mensagens do chat serão renderizadas aqui pelo JavaScript -->
            </div>
        </main>

        <!-- Container do Composer de Chat -->
        <div id="composer-container" class="left-0 p-4">
            <div class="w-full max-w-4xl mx-auto">
                <div id="chat-composer-container" class="chat-composer-container">
                    <div class="overflow-y-auto max-h-[200px] hide-scrollbar p-1">
                        <textarea id="message-textarea" rows="1" placeholder="Converse com a IA..." class="chat-composer-textarea w-full hide-scrollbar p-3"></textarea>
                    </div>
                    <div class="chat-composer-actions">
                        <div class="flex items-center gap-2">
                            <label class="composer-btn cursor-pointer" for="file-input">
                                <input type="file" class="hidden" id="file-input">
                                <i data-lucide="paperclip" class="w-5 h-5"></i>
                            </label>
                            <button id="search-toggle" class="search-toggle-btn active">
                                <i data-lucide="globe" class="w-4 h-4"></i>
                                <span id="search-text">Search</span>
                            </button>
                        </div>
                        <button id="send-btn" class="composer-btn">
                            <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
         document.addEventListener('DOMContentLoaded', () => {
        // --- GERENCIAMENTO DE ESTADO ---
        let conversations = [
            { id: Date.now(), title: 'Ideias para Reels de Café', messages: [{ role: 'assistant', content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?' }] },
            { id: Date.now() + 1, title: 'Roteiro de vídeo sobre IA', messages: [{ role: 'assistant', content: 'Pronto para criar um roteiro incrível?' }] }
        ];
        let activeConversationId = conversations[0].id;
        
        // --- SELETORES DE ELEMENTOS ---
        const body = document.body;
        const conversationsList = document.getElementById('conversations-list');
        const chatAreaContent = document.getElementById('chat-area-content');
        const chatArea = document.getElementById('chat-area');
        const messageTextarea = document.getElementById('message-textarea');
        const sendBtn = document.getElementById('send-btn');
        const newConversationBtn = document.getElementById('new-conversation-btn');
        const composerContainer = document.getElementById('chat-composer-container');
        
        // --- FUNÇÕES DE RENDERIZAÇÃO ---
        const renderConversations = () => {
            conversationsList.innerHTML = '';
            if (conversations.length === 0) {
                conversationsList.innerHTML = '<p class="text-center text-sm text-white/50 px-4 py-2">Inicie uma nova conversa para começar.</p>';
            } else {
                conversations.forEach(convo => {
                    const isActive = convo.id === activeConversationId;
                    const itemWrapper = document.createElement('div');
                    itemWrapper.className = 'relative group';
                    itemWrapper.innerHTML = `
                        <button class="conversation-item w-full text-left p-3 flex justify-between items-center ${isActive ? 'active' : ''}" data-id="${convo.id}">
                            <div class="flex-1 min-w-0"> <h4 class="font-medium text-sm text-white truncate">${convo.title}</h4> </div>
                        </button>
                        <div class="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
                            <button class="conversation-options-btn p-1 rounded-md hover:bg-white/10" data-id="${convo.id}"> <i data-lucide="more-horizontal" class="w-5 h-5"></i> </button>
                        </div>
                        <div class="conversation-dropdown-menu dropdown-menu liquid-glass-opaque absolute top-full right-2 mt-1 p-2 w-40 z-10 rounded-lg">
                            <button class="dropdown-item w-full text-left flex items-center gap-2 p-2 text-sm rounded-md" data-action="rename" data-id="${convo.id}"> <i data-lucide="pencil" class="w-4 h-4"></i> Renomear </button>
                            <button class="dropdown-item w-full text-left flex items-center gap-2 p-2 text-sm rounded-md text-red-400 hover:text-red-300" data-action="delete" data-id="${convo.id}"> <i data-lucide="trash-2" class="w-4 h-4"></i> Excluir </button>
                        </div>
                    `;
                    conversationsList.appendChild(itemWrapper);
                });
            }
            lucide.createIcons({ strokeWidth: 1.5 });
        };
        
        const renderChatContent = () => {
            chatAreaContent.innerHTML = '';
            const activeConvo = conversations.find(c => c.id === activeConversationId);
            if (!activeConvo) return;
            activeConvo.messages.forEach(msg => addMessageToDOM(msg.role, msg.content, false));
            chatArea.scrollTop = chatArea.scrollHeight;
        };
        
        const addMessageToDOM = (role, content, animate = true) => {
            const messageEl = document.createElement('div');
            messageEl.className = `flex w-full ${role === 'user' ? 'justify-end' : ''}`;
            if(animate) messageEl.style.animation = 'fadeInUpBubble 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            const sanitizedContent = role === 'assistant' ? DOMPurify.sanitize(marked.parse(content)) : `<p>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
            
            messageEl.innerHTML = `<div class="${role === 'user' ? 'user' : 'assistant'}-bubble message-bubble"> <div class="markdown-content">${sanitizedContent}</div> </div>`;
            
            chatAreaContent.appendChild(messageEl);
            chatArea.scrollTop = chatArea.scrollHeight;
        };
        
        // --- MANIPULADORES DE EVENTOS ---
        const handleNewConversation = () => {
            const newConvo = { id: Date.now(), title: 'Nova Conversa', messages: [{ role: 'assistant', content: 'Pode começar! Sobre o que vamos conversar?' }] };
            conversations.unshift(newConvo);
            activeConversationId = newConvo.id;
            renderConversations();
            renderChatContent();
            messageTextarea.focus();
            if (window.innerWidth < 768) closeMobileSidebar();
        };

        const handleSendMessage = () => {
            const messageText = messageTextarea.value.trim();
            if (!messageText) return;
            const activeConvo = conversations.find(c => c.id === activeConversationId);
            if (!activeConvo) return;
            activeConvo.messages.push({ role: 'user', content: messageText });
            addMessageToDOM('user', messageText);
            messageTextarea.value = '';
            adjustTextareaHeight(true);
            updateInputState();
            simulateAIResponse(activeConvo);
        };

        const simulateAIResponse = (conversation) => {
            const thinkingEl = document.createElement('div');
            thinkingEl.className = 'flex w-full ai-thinking-container';
            thinkingEl.innerHTML = `<div class="assistant-bubble message-bubble"><div class="ai-thinking-text">Pensando...</div></div>`;
            chatAreaContent.appendChild(thinkingEl);
            chatArea.scrollTop = chatArea.scrollHeight;
            setTimeout(() => {
                thinkingEl.remove();
                const aiResponse = "Esta é uma resposta simulada. Integre com sua API de IA para gerar respostas reais.";
                conversation.messages.push({ role: 'assistant', content: aiResponse });
                addMessageToDOM('assistant', aiResponse);
            }, 2000);
        };

        // --- CORREÇÃO DEFINITIVA: LÓGICA DE EVENTOS DA SIDEBAR ---
        // Esta é a seção que foi adicionada/corrigida.
        // Usamos "event delegation": um único listener no container pai (#conversations-list)
        // que inteligentemente descobre qual botão foi clicado (selecionar, abrir menu, renomear ou excluir).
        conversationsList.addEventListener('click', (e) => {
            const conversationItem = e.target.closest('.conversation-item');
            const optionsBtn = e.target.closest('.conversation-options-btn');
            const actionBtn = e.target.closest('.dropdown-item');

            // Caso 1: Clicou para SELECIONAR uma conversa
            if (conversationItem && !optionsBtn && !actionBtn) {
                const id = parseInt(conversationItem.dataset.id, 10);
                if (id !== activeConversationId) {
                    activeConversationId = id;
                    renderConversations();
                    renderChatContent();
                }
                if (window.innerWidth < 768) closeMobileSidebar();
                return;
            }

            // Caso 2: Clicou nos "3 pontinhos" para ABRIR O MENU de opções
            if (optionsBtn) {
                e.stopPropagation(); // Impede que o clique também selecione a conversa
                const dropdown = optionsBtn.closest('.group').querySelector('.conversation-dropdown-menu');
                
                // Fecha outros menus que possam estar abertos para evitar sobreposição
                document.querySelectorAll('.conversation-dropdown-menu.show').forEach(m => {
                    if (m !== dropdown) m.classList.remove('show');
                });
                document.querySelectorAll('.conversation-options-btn.active').forEach(b => {
                    if (b !== optionsBtn) b.classList.remove('active');
                });
                
                // Alterna a visibilidade do menu clicado
                dropdown.classList.toggle('show');
                optionsBtn.classList.toggle('active');
                return;
            }

            // Caso 3: Clicou em uma AÇÃO dentro do menu (Renomear ou Excluir)
            if (actionBtn) {
                e.stopPropagation(); // Impede que o clique se propague para outros elementos
                const action = actionBtn.dataset.action;
                const id = parseInt(actionBtn.dataset.id, 10);

                if (action === 'rename') {
                    const convoToRename = conversations.find(c => c.id === id);
                    if (convoToRename) {
                        const newTitle = prompt('Digite o novo nome para a conversa:', convoToRename.title);
                        if (newTitle && newTitle.trim() !== '') {
                            convoToRename.title = newTitle.trim();
                            renderConversations(); // Re-renderiza a lista com o novo título
                        }
                    }
                } else if (action === 'delete') {
                    if (confirm('Tem certeza que deseja excluir esta conversa?')) {
                        conversations = conversations.filter(c => c.id !== id);
                        
                        // Se a conversa excluída era a ativa, seleciona a primeira da lista ou cria uma nova
                        if (activeConversationId === id) {
                            if (conversations.length > 0) {
                                activeConversationId = conversations[0].id;
                            } else {
                                // Se não houver mais conversas, cria uma nova
                                handleNewConversation();
                                return; // A handleNewConversation já renderiza tudo
                            }
                        }
                        renderConversations();
                        renderChatContent();
                    }
                }
                
                // Fecha o menu após a ação
                actionBtn.closest('.dropdown-menu').classList.remove('show');
                document.querySelectorAll('.conversation-options-btn.active').forEach(b => b.classList.remove('active'));
            }
        });
        
        // Adiciona um listener global para fechar os menus se clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.group')) {
                document.querySelectorAll('.conversation-dropdown-menu.show').forEach(m => m.classList.remove('show'));
                document.querySelectorAll('.conversation-options-btn.active').forEach(b => b.classList.remove('active'));
            }
        });

        // --- FUNCIONALIDADES DO COMPOSER, SIDEBAR E HEADER ---
        const setupSidebar = () => {
            const openSidebarMobileBtn = document.getElementById('open-sidebar-mobile-btn');
            const closeSidebarXBtn = document.getElementById('close-sidebar-x-btn');
            const sidebar = document.getElementById('conversations-sidebar');
            const sidebarBackdrop = document.getElementById('sidebar-backdrop');
            const minimizeSidebarBtn = document.getElementById('minimize-sidebar-btn');
            const openSidebarDesktopBtn = document.getElementById('open-sidebar-desktop-btn');
            window.openMobileSidebar = () => { sidebar.classList.remove('-translate-x-full'); sidebarBackdrop.classList.add('opacity-100','pointer-events-auto'); sidebarBackdrop.classList.remove('pointer-events-none'); };
            window.closeMobileSidebar = () => { sidebar.classList.add('-translate-x-full'); sidebarBackdrop.classList.remove('opacity-100','pointer-events-auto'); sidebarBackdrop.classList.add('pointer-events-none'); };
            openSidebarMobileBtn?.addEventListener('click', openMobileSidebar);
            closeSidebarXBtn?.addEventListener('click', closeMobileSidebar);
            sidebarBackdrop.addEventListener('click', closeMobileSidebar);
            const toggleDesktopSidebar = () => body.classList.toggle('sidebar-desktop-collapsed');
            minimizeSidebarBtn?.addEventListener('click', toggleDesktopSidebar);
            openSidebarDesktopBtn?.addEventListener('click', toggleDesktopSidebar);
        };
        
        const setupHeaderDropdowns = () => {
            const bellButton = document.getElementById('bell-button');
            const notificationsDropdown = document.getElementById('notifications-dropdown');
            const profileButton = document.getElementById('profile-button');
            const profileDropdown = document.getElementById('profile-dropdown');
            const creditsInfoBtn = document.getElementById('credits-info-btn');
            const creditsTooltip = document.getElementById('credits-tooltip');
            const closeAllMenus = () => {
                notificationsDropdown?.classList.remove('show');
                profileDropdown?.classList.remove('show');
                creditsTooltip?.classList.remove('show');
            };
            bellButton?.addEventListener('click', (e) => { e.stopPropagation(); const isOpen = notificationsDropdown.classList.contains('show'); closeAllMenus(); if (!isOpen) notificationsDropdown.classList.add('show'); });
            profileButton?.addEventListener('click', (e) => { e.stopPropagation(); const isOpen = profileDropdown.classList.contains('show'); closeAllMenus(); if (!isOpen) profileDropdown.classList.add('show'); });
            creditsInfoBtn?.addEventListener('click', (e) => { e.stopPropagation(); creditsTooltip.classList.toggle('show'); });
            document.addEventListener('click', (e) => { if (!e.target.closest('.dropdown-menu, #bell-button, #profile-button, #credits-info-btn')) closeAllMenus(); });
        };
        
        const initComposer = () => {
            const searchToggle = document.getElementById('search-toggle'), searchText = document.getElementById('search-text');
            let showSearch = true, isFocused = false;
            window.adjustTextareaHeight = (reset=false) => { 
                if (reset) messageTextarea.style.height = 'auto';
                messageTextarea.style.height='auto'; const newHeight=Math.min(Math.max(messageTextarea.scrollHeight, 52), 200); messageTextarea.style.height=`${newHeight}px`; 
            };
            window.updateInputState = () => { sendBtn.classList.toggle('active', messageTextarea.value.trim().length > 0); composerContainer.classList.toggle('focused', isFocused); };
            const toggleSearch = () => { showSearch = !showSearch; searchToggle.classList.toggle('active', showSearch); searchText.style.width = showSearch ? `${searchText.scrollWidth}px` : '0px'; searchText.style.opacity = showSearch ? '1' : '0'; };
            messageTextarea.addEventListener('input', () => { adjustTextareaHeight(); updateInputState(); });
            messageTextarea.addEventListener('focus', () => { isFocused = true; updateInputState(); });
            messageTextarea.addEventListener('blur', () => { isFocused = false; updateInputState(); });
            messageTextarea.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } });
            sendBtn.addEventListener('click', handleSendMessage);
            searchToggle.addEventListener('click', toggleSearch);
            newConversationBtn.addEventListener('click', handleNewConversation);
            setTimeout(() => { if (searchText) { searchText.style.width = showSearch ? `${searchText.scrollWidth}px` : '0px'; searchText.style.opacity = showSearch ? '1' : '0'; } }, 100);
        };

        // --- INICIALIZAÇÃO ---
        renderConversations();
        renderChatContent();
        initComposer();
        setupSidebar();
        setupHeaderDropdowns();
        lucide.createIcons({ strokeWidth: 1.5 });
    });
    </script>


    </body></html>