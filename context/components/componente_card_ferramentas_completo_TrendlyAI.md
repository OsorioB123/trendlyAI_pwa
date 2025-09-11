<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Card de Prompt Dinâmico - TrendlyAI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        body {
            -webkit-tap-highlight-color: transparent;
            font-family: 'Inter', sans-serif;
        }
        .prompt-card {
            position: relative;
            overflow: hidden;
            background-color: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                        box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
                        opacity 0.3s ease;
            cursor: pointer;
        }
        .prompt-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
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
        
        /* --- ESTILOS DO BOTÃO DE FAVORITO --- */
        .favorite-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 20;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        .favorite-btn:active {
            transform: scale(0.9);
        }
        .favorite-btn svg {
            transition: all 0.2s ease;
            stroke: rgba(255, 255, 255, 0.8);
            fill: none;
        }
        .favorite-btn:hover svg {
            stroke: white;
        }
        .favorite-btn.is-favorited svg {
            stroke: #ef4444; /* red-500 */
            fill: #ef4444; /* red-500 */
        }
        .favorite-btn.is-favorited {
            animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        /* --- FIM DOS ESTILOS DE FAVORITO --- */

        .prompt-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 100;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(8px);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                        visibility 0.4s;
        }
        .prompt-modal-backdrop.show {
            opacity: 1;
            visibility: visible;
        }
        .prompt-modal-container {
            position: fixed;
            z-index: 101;
            background: rgba(20, 20, 22, 0.9);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .prompt-modal-container.show {
            opacity: 1;
            visibility: visible;
        }
        .prompt-modal-inner-content {
            opacity: 0;
            transform: translateY(20px);
            height: 100%;
            width: 100%;
            transition: opacity 0.3s ease 0.1s,
                        transform 0.3s ease 0.1s;
        }
        .prompt-modal-container.show .prompt-modal-inner-content {
            opacity: 1;
            transform: translateY(0);
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
        .tool-logo-card:hover {
            transform: scale(1.1);
            background-color: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.15);
        }
        .prompt-preview {
            background-color: rgba(0,0,0,0.2);
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.6;
            color: #d1d5db;
            max-height: 120px;
            overflow: hidden;
            position: relative;
            padding: 1rem;
            font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
        }
        .prompt-preview::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(to top, rgba(20, 20, 22, 1), transparent);
        }
        .prompt-textarea {
            font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
            font-size: 13px;
            line-height: 1.6;
        }
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
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
            opacity: 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .modal-scroll-container {
            overscroll-behavior: contain;
            min-height: 0;
        }
        @media (min-width: 769px) {
            .prompt-modal-container {
                will-change: width, height, top, left, border-radius;
            }
        }
        @media (max-width: 768px) {
            .prompt-modal-container {
                bottom: 0;
                left: 0;
                right: 0;
                width: 100% !important;
                height: 90vh !important;
                border-radius: 20px 20px 0 0 !important;
                border-bottom: none;
                transform: translateY(100%);
            }
            .prompt-modal-container.show {
                transform: translateY(0);
            }
        }
    </style>
</head>
<body class="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
    
    <div id="prompt-container" class="w-full max-w-md">
        <div class="prompt-card fade-in" data-prompt-id="prompt-roteiro-viral-001" style="animation-delay: 0.1s">
            
            <!-- BOTÃO DE FAVORITO ADICIONADO AQUI -->
            <button class="favorite-btn w-10 h-10 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40" aria-label="Adicionar aos favoritos">
                <i data-lucide="heart" class="w-5 h-5"></i>
            </button>
            
            <div class="relative z-10 flex flex-col h-full">
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold text-white mb-2 leading-snug tracking-tight pr-8">
                        Crie um Roteiro Viral em 30 Segundos
                    </h3>
                    <p class="text-sm text-white/70 line-clamp-2 leading-relaxed">
                        Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2 my-4">
                    <span class="liquid-glass-tag">roteiro</span>
                    <span class="liquid-glass-tag">storytelling</span>
                </div>
                <div class="flex items-center justify-between text-xs text-white/50 mt-auto">
                    <span>Clique para abrir</span>
                    <div class="flex items-center gap-1 hover:text-white transition-colors">
                        <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="prompt-modal-backdrop" class="prompt-modal-backdrop"></div>
    <div id="prompt-modal-container" class="prompt-modal-container"></div>
    <div id="toast-notification">Prompt copiado!</div>

    <script>
        const promptsData = [{
            id: "prompt-roteiro-viral-001",
            title: "Crie um Roteiro Viral em 30 Segundos",
            description: "Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.",
            type: "text-generation",
            tags: ["roteiro", "storytelling"],
            compatible_with: ["Claude", "ChatGPT"],
            content: `Você é um especialista em storytelling viral para redes sociais.

CONTEXTO:
- Tema: [TEMA]
- Público-alvo: [PÚBLICO-ALVO]
- Tom de voz: [TOM DE VOZ]
- Duração: 30-60 segundos

ESTRUTURA OBRIGATÓRIA:
1. GANCHO (0-3s): Uma frase impactante que pare o scroll
2. DESENVOLVIMENTO (3-45s): Apresente o problema/solução/história
3. CALL TO ACTION (45-60s): Convide para ação específica

CRITÉRIOS DE SUCESSO:
- Use linguagem simples e direta
- Inclua elementos de curiosidade ou surpresa
- Termine com uma pergunta ou convite à interação
- Mantenha o ritmo acelerado

Crie o roteiro seguindo exatamente esta estrutura.`,
            how_to_use: "Substitua [TEMA], [PÚBLICO-ALVO] e [TOM DE VOZ] pelos seus dados específicos antes de usar o prompt."
        }];

        const toolLogos = {
            "Claude": `<i data-lucide="brain-circuit" class="w-4 h-4"></i>`,
            "ChatGPT": `<i data-lucide="message-square-code" class="w-4 h-4"></i>`
        };

        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });
            
            const promptContainer = document.getElementById('prompt-container');
            const modalBackdrop = document.getElementById('prompt-modal-backdrop');
            const modalContainer = document.getElementById('prompt-modal-container');
            let currentPromptId = null;
            let originalCardRect = null;
            let isMobile = window.innerWidth <= 768;
            let isAnimating = false;
            
            function populateOficina(promptId) {
                const prompt = promptsData.find(p => p.id === promptId);
                if (!prompt) return;

                let howToUseHTML = '', recommendationsHTML = '', promptAreaHTML = '';

                if (prompt.how_to_use) {
                    howToUseHTML = `
                        <div class="contained-card p-4">
                            <div class="flex items-start gap-3">
                                <i data-lucide="compass" class="w-5 h-5 text-white flex-shrink-0 mt-1"></i>
                                <div>
                                    <h4 class="font-semibold">Guia Rápido</h4>
                                    <p class="text-sm text-white/70 mt-1">${prompt.how_to_use}</p>
                                </div>
                            </div>
                        </div>`;
                }

                if (prompt.compatible_with?.length > 0) {
                    const toolsHTML = prompt.compatible_with.map(tool => `
                        <div class="tool-logo-card p-2 rounded-lg flex flex-col items-center gap-1" title="${tool}">
                            <div class="w-8 h-8 text-white/70 flex items-center justify-center">
                                ${toolLogos[tool] || `<i data-lucide="cpu" class="w-4 h-4"></i>`}
                            </div>
                            <span class="text-xs text-white/60">${tool}</span>
                        </div>
                    `).join('');

                    recommendationsHTML = `
                        <div class="contained-card p-4">
                            <h4 class="font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="check-circle" class="w-4 h-4 text-white"></i>
                                Também funciona com
                            </h4>
                            <div class="flex items-center flex-wrap gap-3">${toolsHTML}</div>
                        </div>`;
                }

                if (prompt.content) {
                    const savedContent = localStorage.getItem(prompt.id) || prompt.content;
                    promptAreaHTML = `
                        <div class="contained-card p-4 space-y-4">
                            <div class="flex justify-between items-center">
                                <h4 class="font-semibold flex items-center gap-2">
                                    <i data-lucide="code-2" class="w-4 h-4 text-white"></i>
                                    Prompt Principal
                                </h4>
                                <button class="copy-prompt-btn p-2 rounded-lg hover:bg-white/10 transition-colors" title="Copiar prompt">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div id="prompt-display-mode">
                                <div class="prompt-preview">${savedContent.substring(0, 200).replace(/\n/g, '<br>')}...</div>
                                <button id="expand-prompt-btn" class="mt-3 text-sm font-medium text-white hover:text-white/80 transition-colors">
                                    Expandir para editar
                                </button>
                            </div>
                            <div id="prompt-edit-mode" class="hidden">
                                <textarea class="prompt-textarea w-full bg-black/30 p-4 rounded-lg text-sm leading-relaxed border border-white/10 resize-none focus:outline-none focus:border-white/30 transition-colors" rows="1">${savedContent}</textarea>
                                <div class="mt-3 flex items-center flex-wrap gap-4">
                                    <button class="save-prompt-btn hidden bg-green-500/20 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-green-500/30 transition-colors">
                                        Salvar Alterações
                                    </button>
                                    <button id="restore-prompt-btn" class="text-xs text-red-400/80 hover:text-red-400 transition-colors font-medium">
                                        Restaurar Padrão
                                    </button>
                                    <button id="collapse-prompt-btn" class="text-sm text-white/60 hover:text-white transition-colors ml-auto">
                                        Recolher
                                    </button>
                                </div>
                            </div>
                        </div>`;
                }

                modalContainer.innerHTML = `
                    <div class="prompt-modal-inner-content">
                        <div class="p-6 pt-12 md:pt-6 h-full flex flex-col">
                            <button id="close-modal-btn" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full z-10">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                            <div class="flex-shrink-0 mb-6">
                                <h2 id="modal-title" class="text-2xl font-semibold tracking-tight pr-10">${prompt.title}</h2>
                            </div>
                            <div class="modal-scroll-container flex-grow overflow-y-auto space-y-6 hide-scrollbar -mr-2 pr-2">
                                ${howToUseHTML}
                                ${recommendationsHTML}
                                ${promptAreaHTML}
                            </div>
                        </div>
                    </div>`;

                lucide.createIcons({ strokeWidth: 1.5 });
            }
            
            function openOficina(cardElement) {
                if (isAnimating) return;
                isAnimating = true;
                
                currentPromptId = cardElement.dataset.promptId;
                document.body.style.overflow = 'hidden';
                
                populateOficina(currentPromptId);

                if (!isMobile) {
                    originalCardRect = cardElement.getBoundingClientRect();
                    Object.assign(modalContainer.style, {
                        width: `${originalCardRect.width}px`,
                        height: `${originalCardRect.height}px`,
                        top: `${originalCardRect.top}px`,
                        left: `${originalCardRect.left}px`,
                        borderRadius: '16px'
                    });
                }
                
                modalBackdrop.classList.add('show');
                modalContainer.classList.add('show');
                
                requestAnimationFrame(() => {
                    if (!isMobile) {
                        Object.assign(modalContainer.style, {
                            width: 'min(90vw, 800px)',
                            height: 'min(85vh, 750px)',
                            top: '50%',
                            left: '50%',
                            borderRadius: '24px',
                            transform: 'translate(-50%, -50%)'
                        });
                    }
                    
                    setTimeout(() => {
                        isAnimating = false;
                    }, 400);
                });
            }
            
            function closeOficina() {
                if (!currentPromptId || isAnimating) return;
                isAnimating = true;

                modalBackdrop.classList.remove('show');
                modalContainer.classList.remove('show');
                
                if (!isMobile && originalCardRect) {
                    Object.assign(modalContainer.style, {
                        width: `${originalCardRect.width}px`,
                        height: `${originalCardRect.height}px`,
                        top: `${originalCardRect.top}px`,
                        left: `${originalCardRect.left}px`,
                        borderRadius: '16px',
                        transform: 'translate(0, 0)'
                    });
                }

                setTimeout(() => {
                    document.body.style.overflow = '';
                    currentPromptId = null;
                    originalCardRect = null;
                    isAnimating = false;
                    
                    if (isMobile) {
                        modalContainer.style.transform = '';
                    }
                }, 400);
            }
            
            function autoResizeTextarea(textarea) {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
            }
            
            function showToast(message) {
                const toast = document.getElementById('toast-notification');
                toast.textContent = message;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            }
            
            // --- ATUALIZAÇÃO NO EVENT LISTENER ---
            // Usando delegação de eventos no body para capturar cliques de forma eficiente
            document.body.addEventListener('click', e => {
                const favoriteBtn = e.target.closest('.favorite-btn');
                const card = e.target.closest('.prompt-card');

                if (favoriteBtn) {
                    // Impede que o clique no botão de favorito abra o modal
                    e.stopPropagation(); 
                    
                    favoriteBtn.classList.toggle('is-favorited');
                    const isFavorited = favoriteBtn.classList.contains('is-favorited');
                    
                    // Atualiza a label para acessibilidade
                    favoriteBtn.setAttribute('aria-label', isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
                    
                    showToast(isFavorited ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.');
                    return; // Encerra a função aqui
                }

                // Se o clique não foi no botão de favorito, mas foi em um card, abre o modal
                if (card) {
                    openOficina(card);
                }
            });

            modalContainer.addEventListener('click', e => {
                if (!currentPromptId) return;

                if (e.target.closest('#close-modal-btn')) {
                    closeOficina();
                    return;
                }

                if (e.target.closest('#expand-prompt-btn')) {
                    document.getElementById('prompt-display-mode').classList.add('hidden');
                    document.getElementById('prompt-edit-mode').classList.remove('hidden');
                    const textarea = modalContainer.querySelector('.prompt-textarea');
                    autoResizeTextarea(textarea);
                    textarea.focus();
                }

                if (e.target.closest('#collapse-prompt-btn')) {
                    document.getElementById('prompt-edit-mode').classList.add('hidden');
                    document.getElementById('prompt-display-mode').classList.remove('hidden');
                }

                if (e.target.closest('#restore-prompt-btn')) {
                    if (confirm('Tem certeza? Suas edições serão perdidas.')) {
                        const originalPrompt = promptsData.find(p => p.id === currentPromptId);
                        const textarea = modalContainer.querySelector('.prompt-textarea');
                        if (originalPrompt && textarea) {
                            textarea.value = originalPrompt.content;
                            localStorage.removeItem(currentPromptId);
                            modalContainer.querySelector('.save-prompt-btn').classList.add('hidden');
                            autoResizeTextarea(textarea);
                            showToast('Prompt restaurado ao padrão.');
                        }
                    }
                }

                const copyBtn = e.target.closest('.copy-prompt-btn');
                if (copyBtn) {
                    const textToCopy = localStorage.getItem(currentPromptId) || 
                                     promptsData.find(p => p.id === currentPromptId).content;
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => showToast('Prompt copiado!'));
                }

                const saveBtn = e.target.closest('.save-prompt-btn');
                if (saveBtn) {
                    const textarea = modalContainer.querySelector('.prompt-textarea');
                    localStorage.setItem(currentPromptId, textarea.value);
                    showToast('Alterações salvas!');
                    saveBtn.classList.add('hidden');
                }
            });

            modalContainer.addEventListener('input', e => {
                if (e.target.classList.contains('prompt-textarea')) {
                    autoResizeTextarea(e.target);
                    const saveBtn = modalContainer.querySelector('.save-prompt-btn');
                    if (saveBtn) saveBtn.classList.remove('hidden');
                }
            });

            modalBackdrop.addEventListener('click', closeOficina);
            
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && currentPromptId) {
                    closeOficina();
                }
            });

            window.addEventListener('resize', () => {
                isMobile = window.innerWidth <= 768;
            });
        });
    </script>
</body>
</html>