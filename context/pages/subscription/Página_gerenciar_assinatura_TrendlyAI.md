PÁGINA gerenciar assinatura
<html lang="pt-BR"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Assinatura - TrendlyAI</title>
    <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        body { 
            -webkit-tap-highlight-color: transparent;
            font-family: 'Inter', sans-serif;
        }
        .geist-font { font-family: 'Geist', sans-serif; }

        .liquid-glass {
            backdrop-filter: blur(20px);
            background-color: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
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
            transform: scale(1.03);
        }
        .liquid-glass-pill:active { transform: scale(0.98); }

        .liquid-glass-opaque {
            backdrop-filter: blur(24px);
            background-color: rgba(30, 30, 40, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            border-radius: 20px;
        }

        .animate-entry {
            opacity: 0;
            transform: translateY(20px);
            animation: slideInFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-1 { animation-delay: 0.15s; }
        .animate-entry.delay-2 { animation-delay: 0.3s; }
        .animate-entry.delay-3 { animation-delay: 0.45s; }
        .animate-entry.delay-4 { animation-delay: 0.6s; }

        @keyframes slideInFade { to { opacity: 1; transform: translateY(0); } }

        .interactive-lift { transition: all 0.3s ease-out; }
        .interactive-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3); }
        
        /* ESTILOS PARA CONTAINERS EXPANSÍVEIS */
        .expandable-container {
            transition: max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out, margin-top 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin-top: 0;
        }
        .expandable-container.open {
            max-height: 1000px; /* Altura generosa para o conteúdo */
            opacity: 1;
        }
        #plan-options-container.open { margin-top: 1.5rem; }
        #billing-history-container.open { margin-top: 2.5rem; } /* my-10 */
        
        .chevron-icon { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

        .modal-backdrop { transition: opacity 0.3s ease; }
        .modal-content { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-backdrop.hidden { opacity: 0; pointer-events: none; }
        .modal-backdrop.hidden .modal-content { transform: scale(0.95); }
    </style>
</head>

<body class="min-h-screen bg-gray-950 text-white overflow-x-hidden">
    

    <div style="height: 80px;"></div>

    <main class="w-full mx-auto">
        <div id="page-container" class="max-w-3xl relative mr-auto ml-auto px-4 py-8">

            <div id="main-view">
                <div class="animate-entry">
                    <h1 class="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-2 geist-font">Gerenciar Assinatura</h1>
                    <p class="text-white/60">Seu painel de controle de valor.</p>
                </div>
                
                <div class="liquid-glass p-6 md:p-8 my-8 animate-entry delay-1 interactive-lift" style="border-radius: 20px;">
                    <div class="flex flex-col sm:flex-row items-start justify-between gap-6">
                        <div class="w-full">
                            <div class="flex items-center gap-3 mb-4">
                                <i data-lucide="gem" class="w-6 h-6 text-white"></i>
                                <h2 class="text-xl font-semibold text-white geist-font">Plano Mestre Criador</h2>
                            </div>
                            <div class="flex items-baseline gap-2 mb-2">
                                <span class="text-3xl font-bold geist-font">1,240</span>
                                <span class="text-white/60">insights gerados este mês</span>
                            </div>
                            <div class="w-full bg-white/10 rounded-full h-2">
                                <div class="bg-white h-2 rounded-full" style="width: 25%;"></div>
                            </div>
                        </div>
                        <div class="w-full sm:w-auto sm:text-right flex-shrink-0 pt-2 space-y-1">
                            <div class="flex justify-between sm:justify-start sm:gap-4 items-center">
                                <span class="text-sm text-white/70">Renova em:</span>
                                <strong class="text-sm text-white">15 de Fev, 2025</strong>
                            </div>
                            <div class="flex justify-between sm:justify-start sm:gap-4 items-center">
                                <span class="text-sm text-white/70">Valor:</span>
                                <strong class="text-sm text-white">R$ 29,90</strong>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm text-white/70 mt-4">
                        Cobrado no seu Visa terminando em 4532. 
                        <button class="font-medium text-white hover:text-white/80 transition-colors hover:underline">Atualizar</button>
                    </div>
                    <div class="h-px bg-white/10 my-6"></div>
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button id="toggle-history-btn" class="text-sm text-white/60 hover:text-white transition-colors">Ver histórico completo de cobranças</button>
                        <button id="show-options-btn" class="liquid-glass-pill px-6 py-3 text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2">
                            <span id="options-btn-text">Ver Opções de Plano</span>
                            <i data-lucide="chevron-down" class="w-4 h-4 chevron-icon"></i>
                        </button>
                    </div>
                </div>

                <!-- SEÇÃO DE HISTÓRICO DE COBRANÇAS -->
                <div id="billing-history-container" class="expandable-container">
                    <div class="animate-entry delay-2">
                        <h2 class="text-2xl font-semibold tracking-tight text-white geist-font">Histórico de Cobranças</h2>
                        <div class="liquid-glass mt-6" style="border-radius: 20px;">
                            <ul class="divide-y divide-white/10">
                                <li class="p-4 flex justify-between items-center hover:bg-white/5 transition-colors duration-200">
                                    <div>
                                        <p class="font-medium text-white">15 de Janeiro, 2025</p>
                                        <p class="text-sm text-white/60">Plano Mestre Criador - Mensal</p>
                                    </div>
                                    <div class="flex items-center gap-4 text-right">
                                        <span class="font-semibold text-white">R$ 29,90</span>
                                        <a href="#" title="Baixar Recibo" class="liquid-glass-pill w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
                                            <i data-lucide="download" class="w-4 h-4"></i>
                                        </a>
                                    </div>
                                </li>
                                <li class="p-4 flex justify-between items-center hover:bg-white/5 transition-colors duration-200">
                                    <div>
                                        <p class="font-medium text-white">15 de Dezembro, 2024</p>
                                        <p class="text-sm text-white/60">Plano Mestre Criador - Mensal</p>
                                    </div>
                                    <div class="flex items-center gap-4 text-right">
                                        <span class="font-semibold text-white">R$ 29,90</span>
                                        <a href="#" title="Baixar Recibo" class="liquid-glass-pill w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
                                            <i data-lucide="download" class="w-4 h-4"></i>
                                        </a>
                                    </div>
                                </li>
                                <li class="p-4 flex justify-between items-center hover:bg-white/5 transition-colors duration-200">
                                    <div>
                                        <p class="font-medium text-white">15 de Novembro, 2024</p>
                                        <p class="text-sm text-white/60">Plano Mestre Criador - Mensal</p>
                                    </div>
                                    <div class="flex items-center gap-4 text-right">
                                        <span class="font-semibold text-white">R$ 29,90</span>
                                        <a href="#" title="Baixar Recibo" class="liquid-glass-pill w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
                                            <i data-lucide="download" class="w-4 h-4"></i>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id="plan-options-container" class="expandable-container">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="liquid-glass p-6 animate-entry delay-3 interactive-lift" style="border-radius: 20px;">
                            <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                                <i data-lucide="pause-circle" class="w-6 h-6 text-white"></i>
                            </div>
                            <h3 class="text-lg font-semibold mb-2 geist-font">Pausar Assinatura</h3>
                            <p class="text-white/70 mb-4 text-sm">Precisa de uma pausa? Seu arsenal e progresso ficarão salvos.</p>
                            <button id="open-pause-modal-btn" class="w-full py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium">Pausar Assinatura</button>
                        </div>
                        <div class="liquid-glass p-6 animate-entry delay-4 interactive-lift" style="border-radius: 20px;">
                            <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                <i data-lucide="x-circle" class="w-6 h-6 text-red-400"></i>
                            </div>
                            <h3 class="text-lg font-semibold mb-2 geist-font">Cancelar Assinatura</h3>
                            <p class="text-white/70 mb-4 text-sm">Seu acesso continuará até o fim do ciclo de cobrança.</p>
                            <button id="proceed-to-cancel-btn" class="w-full py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm font-medium">Prosseguir</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="cancel-view" class="hidden">
                <div class="animate-entry">
                    <h1 class="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4 geist-font">Temos pena de o ver partir.</h1>
                    <p class="text-white/70 mb-8">Seu acesso continuará até 15 de Fev, 2025.</p>
                </div>
                <div class="liquid-glass p-6 md:p-8 animate-entry delay-1" style="border-radius: 20px;">
                    <label for="cancel-reason" class="font-medium text-white block mb-2">O que poderíamos ter feito melhor? (Opcional)</label>
                    <textarea id="cancel-reason" rows="4" class="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all resize-none" placeholder="Seu feedback é muito valioso para nós..."></textarea>
                    <div class="mt-6 flex flex-col sm:flex-row-reverse gap-4">
                        <button id="confirm-cancel-btn" class="w-full sm:w-auto bg-red-800/50 hover:bg-red-800/70 text-white font-medium py-3 px-6 rounded-full transition-all hover:shadow-lg hover:shadow-red-800/20">
                            Sim, cancelar minha assinatura
                        </button>
                        <button id="back-to-main-btn" class="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-all">
                            Não, quero continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <div id="pause-modal" class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 hidden">
        <div class="modal-content liquid-glass-opaque w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-white geist-font">Pausar sua jornada</h3>
                <button class="close-modal-btn text-white/60 hover:text-white transition-colors text-2xl leading-none">×</button>
            </div>
            <p class="text-sm text-white/70 mb-4">Selecione por quanto tempo deseja pausar. Nenhuma cobrança será feita neste período.</p>
            <div class="flex gap-2 mb-4">
                <button class="pause-option-btn flex-1 p-3 text-sm font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-all" data-months="1">1 Mês</button>
                <button class="pause-option-btn flex-1 p-3 text-sm font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-all" data-months="2">2 Meses</button>
                <button class="pause-option-btn flex-1 p-3 text-sm font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-all" data-months="3">3 Meses</button>
            </div>
            <p id="pause-confirmation-text" class="text-xs text-center text-white/60 h-4 mb-4 transition-opacity opacity-0"></p>
            <button id="confirm-pause-btn" class="w-full bg-white text-black font-bold py-3 px-6 rounded-full transition-all opacity-50 cursor-not-allowed disabled:opacity-50">
                Confirmar Pausa
            </button>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });

            const mainView = document.getElementById('main-view');
            const cancelView = document.getElementById('cancel-view');

            // --- Lógica dos Containers Expansíveis ---

            // Opções de Plano
            const showOptionsBtn = document.getElementById('show-options-btn');
            const optionsContainer = document.getElementById('plan-options-container');
            const optionsBtnText = document.getElementById('options-btn-text');
            const chevronIcon = showOptionsBtn.querySelector('.chevron-icon');

            showOptionsBtn.addEventListener('click', () => {
                const isOpen = optionsContainer.classList.toggle('open');
                chevronIcon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
                optionsBtnText.textContent = isOpen ? 'Ocultar Opções' : 'Ver Opções de Plano';
            });

            // Histórico de Cobranças
            const toggleHistoryBtn = document.getElementById('toggle-history-btn');
            const historyContainer = document.getElementById('billing-history-container');

            toggleHistoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = historyContainer.classList.toggle('open');
                toggleHistoryBtn.textContent = isOpen ? 'Ocultar histórico de cobranças' : 'Ver histórico completo de cobranças';
                
                if (isOpen) {
                    setTimeout(() => {
                        historyContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 150); // Pequeno delay para a animação começar
                }
            });

            // --- Lógica de Navegação ---
            document.getElementById('proceed-to-cancel-btn').addEventListener('click', () => {
                mainView.classList.add('hidden');
                cancelView.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            document.getElementById('back-to-main-btn').addEventListener('click', () => {
                cancelView.classList.add('hidden');
                mainView.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // --- Lógica do Modal de Pausa ---
            const pauseModal = document.getElementById('pause-modal');
            const openPauseModalBtn = document.getElementById('open-pause-modal-btn');
            const pauseOptionBtns = document.querySelectorAll('.pause-option-btn');
            const confirmPauseBtn = document.getElementById('confirm-pause-btn');
            const pauseConfirmationText = document.getElementById('pause-confirmation-text');

            openPauseModalBtn.addEventListener('click', () => pauseModal.classList.remove('hidden'));
            
            pauseModal.querySelector('.close-modal-btn').addEventListener('click', () => {
                pauseModal.classList.add('hidden');
            });

            pauseModal.addEventListener('click', (e) => {
                if (e.target === pauseModal) {
                    pauseModal.classList.add('hidden');
                }
            });

            pauseOptionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    pauseOptionBtns.forEach(b => b.classList.remove('bg-white/20', 'border-white'));
                    btn.classList.add('bg-white/20', 'border-white');

                    const months = parseInt(btn.dataset.months);
                    const futureDate = new Date();
                    futureDate.setMonth(futureDate.getMonth() + months);
                    const formattedDate = futureDate.toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });

                    pauseConfirmationText.textContent = `Sua assinatura será reativada em ${formattedDate}.`;
                    pauseConfirmationText.classList.remove('opacity-0');

                    confirmPauseBtn.disabled = false;
                    confirmPauseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                });
            });

            confirmPauseBtn.addEventListener('click', () => {
                if (!confirmPauseBtn.disabled) {
                    alert('Assinatura pausada com sucesso!');
                    pauseModal.classList.add('hidden');
                }
            });
        });
    </script>

</body></html>