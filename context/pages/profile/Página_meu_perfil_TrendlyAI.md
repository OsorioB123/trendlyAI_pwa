PÁGINA MEU PERFIL
<html lang="pt-BR"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Quartel-General - TrendlyAI</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        .liquid-glass { 
            backdrop-filter: blur(20px); 
            background-color: rgba(255, 255, 255, 0.08); 
            border: 1px solid rgba(255, 255, 255, 0.12); 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18); 
            border-radius: 20px; 
        }
        
        .liquid-glass-pill { 
            backdrop-filter: blur(20px); 
            background-color: rgba(255, 255, 255, 0.08); 
            border: 1px solid rgba(255, 255, 255, 0.12); 
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); 
            border-radius: 9999px; 
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .liquid-glass-pill:hover { 
            background-color: rgba(255, 255, 255, 0.15); 
            transform: translateY(-1px) scale(1.02); 
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); 
        }

        .animate-entry { 
            opacity: 0; 
            transform: translateY(30px); 
            animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        
        .animate-entry.delay-1 { animation-delay: 0.15s; }
        .animate-entry.delay-2 { animation-delay: 0.3s; }
        .animate-entry.delay-3 { animation-delay: 0.45s; }
        
        @keyframes slideInFade { 
            to { opacity: 1; transform: translateY(0); } 
        }

        .avatar-interactive-wrapper { 
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .avatar-interactive-wrapper:hover { 
            transform: scale(1.05); 
        }
        
        .avatar-overlay { 
            background-color: rgba(0,0,0,0); 
            transition: all 0.3s ease; 
        }
        
        .avatar-interactive-wrapper:hover .avatar-overlay { 
            background-color: rgba(0,0,0,0.6); 
        }
        
        .avatar-overlay svg { 
            opacity: 0; 
            transform: scale(0.8); 
            transition: all 0.3s ease; 
        }
        
        .avatar-interactive-wrapper:hover .avatar-overlay svg { 
            opacity: 1; 
            transform: scale(1); 
        }

        .metric-pill { 
            backdrop-filter: blur(10px); 
            background-color: rgba(255, 255, 255, 0.08); 
            border: 1px solid rgba(255, 255, 255, 0.12); 
            border-radius: 9999px; 
            padding: 8px 16px; 
            font-size: 13px; 
            font-weight: 500; 
            color: white; 
            display: inline-flex; 
            align-items: center; 
            gap: 8px; 
            transition: all 0.3s ease; 
        }
        
        .metric-pill:hover { 
            background-color: rgba(255,255,255,0.15); 
            transform: translateY(-2px); 
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); 
        }
        
        .metric-pill:hover .lucide-flame { 
            animation: flicker 1.5s ease-in-out infinite; 
        }
        
        @keyframes flicker { 
            0%, 100% { color: #ffffff; transform: scale(1); } 
            50% { color: #f3f4f6; transform: scale(1.1); } 
        }

        .border-glow-container { 
            position: relative; 
            border-radius: 20px; 
        }
        
        .border-glow-container::before {
            content: '';
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: glow-pulse 4s ease-in-out infinite;
        }
        
        @keyframes glow-pulse { 
            0%, 100% { opacity: 0.6; } 
            50% { opacity: 1; } 
        }

        .tab-indicator { 
            position: absolute; 
            bottom: -1px; 
            left: 0; 
            height: 2px; 
            background-color: rgba(255, 255, 255, 0.9); 
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
            border-radius: 1px; 
        }
        
        .tab-pane { 
            transition: opacity 0.4s ease, transform 0.4s ease; 
        }
        
        .tab-pane.hidden { 
            opacity: 0; 
            pointer-events: none; 
            position: absolute; 
            transform: translateY(20px); 
        }
        
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

        .empty-state-icon { 
            animation: pulse-icon 4s ease-in-out infinite; 
            background: rgba(255, 255, 255, 0.05); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
        }
        
        @keyframes pulse-icon { 
            0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); 
            } 
            50% { 
                transform: scale(1.05); 
                box-shadow: 0 0 30px 10px rgba(255, 255, 255, 0.1); 
            } 
        }

        .referral-tab.active {
            background-color: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            color: #ffffff;
            transform: translateY(0) scale(1);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .referral-pane {
            transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .referral-pane.hidden {
            opacity: 0;
            pointer-events: none;
            position: absolute;
            transform: translateY(15px);
            inset: 0;
        }

        .premium-button {
            background: linear-gradient(145deg, #ffffff, #e6e6e6);
            color: #111827;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.3);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-button:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.4);
        }
    </style>
</head>
<body class="min-h-screen bg-gray-950 font-['Inter'] text-white overflow-x-hidden">

    <div style="height: 80px;"></div>

    <main class="w-full mx-auto">
        <div class="max-w-6xl relative mx-auto px-6 py-10">

            <!-- Header Unificado -->
            <section class="flex flex-col md:flex-row gap-8 items-center text-center md:text-left mb-16 animate-entry">
                <button class="relative flex-shrink-0 group avatar-interactive-wrapper">
                    <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
                        <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&amp;q=80" alt="Avatar do usuário" class="w-full h-full object-cover">
                    </div>
                    <div class="absolute inset-0 rounded-full flex items-center justify-center avatar-overlay">
                        <i data-lucide="camera" class="w-6 h-6 text-white"></i>
                    </div>
                </button>
                <div class="flex-grow">
                    <h1 class="text-5xl font-medium text-white tracking-tight mb-2">João da Silva</h1>
                    <p class="text-white/60 text-lg mb-6">Nível Criativo: Estrategista</p>
                    <div class="flex flex-wrap justify-center md:justify-start items-center gap-3">
                        <div class="metric-pill">
                            <i data-lucide="navigation" class="w-4 h-4"></i>
                            4 Trilhas Ativas
                        </div>
                        <div class="metric-pill">
                            <i data-lucide="award" class="w-4 h-4"></i>
                            12 Módulos Concluídos
                        </div>
                        <div class="metric-pill">
                            <i data-lucide="flame" class="w-4 h-4"></i>
                            Streak: 5 Dias
                        </div>
                    </div>
                </div>
            </section>

            <!-- Próxima Ação -->
            <section class="mb-16 animate-entry delay-1">
                <div class="border-glow-container">
                    <div class="liquid-glass p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div class="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-white/8 border border-white/12">
                            <i data-lucide="lightbulb" class="w-7 h-7 text-white"></i>
                        </div>
                        <div class="flex-grow">
                            <h2 class="text-xl font-medium text-white mb-2">Sua Próxima Jogada</h2>
                            <p class="text-white/70 leading-relaxed">Notei que você dominou IA Generativa. Para elevar seu jogo, a técnica de <strong>prompt engineering avançado</strong> é o passo lógico para seus roteiros.</p>
                        </div>
                        <button class="liquid-glass-pill px-6 py-3 flex-shrink-0 flex items-center gap-3 font-medium w-full md:w-auto justify-center">
                            <i data-lucide="play" class="w-4 h-4"></i>
                            <span>Aprender esta Técnica</span>
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Arsenal -->
            <section class="liquid-glass p-8 animate-entry delay-2">
                <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8">
                    <h2 class="text-3xl font-medium text-white tracking-tight">Seu Arsenal</h2>
                    <div id="tab-container" class="relative flex border-b border-white/10">
                        <button data-tab="trails" class="tab-button active text-white px-6 py-3 font-medium transition-colors">
                            Trilhas Salvas
                        </button>
                        <button data-tab="tools" class="tab-button text-white/60 hover:text-white px-6 py-3 font-medium transition-colors">
                            Ferramentas
                        </button>
                        <div id="tab-indicator" class="tab-indicator" style="width: 133px; left: 0px;"></div>
                    </div>
                </div>

                <div class="relative mt-8 min-h-[400px]">
                    <!-- Trilhas Salvas -->
                    <div id="content-trails" class="tab-pane grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&amp;q=80')">
                            <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                <h3 class="font-medium text-white text-xl mb-4">IA Generativa Avançada</h3>
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
                        
                        <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&amp;q=80')">
                            <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                <h3 class="font-medium text-white text-xl mb-4">Design para Criadores</h3>
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
                        
                        <div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&amp;q=80')">
                            <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
                                <h3 class="font-medium text-white text-xl mb-4">Marketing Digital</h3>
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
                    </div>
                    
                    <!-- Ferramentas -->
                    <div id="content-tools" class="tab-pane hidden">
                        <div class="text-center py-16 flex flex-col items-center">
                            <div class="empty-state-icon flex items-center justify-center w-24 h-24 rounded-full">
                                <i data-lucide="wrench" class="w-12 h-12 text-white"></i>
                            </div>
                            <h3 class="text-2xl font-medium text-white mt-8 mb-3">Seu arsenal aguarda.</h3>
                            <p class="text-white/60 max-w-md leading-relaxed mb-8">Favorite as ferramentas e prompts que definem seu gênio criativo para encontrá-los aqui.</p>
                            <button class="liquid-glass-pill px-8 py-4 flex items-center gap-3 font-medium">
                                <i data-lucide="compass" class="w-5 h-5"></i>
                                <span>Explorar Ferramentas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Convidar e Ganhar -->
            <section class="mt-16 animate-entry delay-3">
                <h2 class="text-3xl font-medium text-white tracking-tight mb-8">Convidar e Ganhar</h2>

                <div id="referral-tab-container" class="flex flex-wrap items-center gap-4 mb-6">
                    <button data-tab="credits" class="referral-tab liquid-glass-pill active text-white/80 hover:text-white px-6 py-3 font-medium transition-colors flex items-center gap-3">
                        <i data-lucide="gift" class="w-4 h-4"></i>
                        <span>Indique e Ganhe Créditos</span>
                    </button>
                    <button data-tab="affiliate" class="referral-tab liquid-glass-pill text-white/60 hover:text-white px-6 py-3 font-medium transition-colors flex items-center gap-3">
                        <i data-lucide="dollar-sign" class="w-4 h-4"></i>
                        <span>Programa de Afiliados</span>
                    </button>
                </div>

                <div class="relative min-h-[320px]">
                    <div class="liquid-glass w-full p-8 md:p-10">
                        <div class="relative w-full h-full">
                            <!-- Conteúdo: Indique e Ganhe Créditos -->
                            <div id="referral-content-credits" class="referral-pane flex flex-col justify-center h-full">
                                <h3 class="text-2xl md:text-3xl font-medium text-white mb-3">Convide um amigo, ganhe 20 créditos.</h3>
                                <p class="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8">Quando seu amigo se cadastra usando seu link, vocês dois ganham créditos para usar na plataforma.</p>
                                
                                <div class="flex flex-col sm:flex-row gap-4 items-center mb-6">
                                    <div class="flex-grow w-full sm:w-auto bg-black/30 border border-white/10 rounded-full px-5 py-3 text-white/80 text-center sm:text-left">
                                        trendly.ai/ref/joaosilva
                                    </div>
                                    <button class="liquid-glass-pill px-6 py-3 w-full sm:w-auto font-medium flex items-center justify-center gap-2">
                                        <i data-lucide="copy" class="w-4 h-4"></i>
                                        <span>Copiar Link</span>
                                    </button>
                                </div>
                                <p class="text-sm text-white/50">Você já ganhou <strong>60 créditos</strong> com suas indicações.</p>
                            </div>

                            <!-- Conteúdo: Programa de Afiliados -->
                            <div id="referral-content-affiliate" class="referral-pane hidden flex flex-col justify-center h-full">
                                <h3 class="text-2xl md:text-3xl font-medium text-white mb-3">Torne-se nosso Parceiro.</h3>
                                <p class="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8">Como Maestro, você tem acesso exclusivo ao nosso programa de afiliados. Ganhe <strong>10% de comissão recorrente</strong> para cada novo assinante que indicar.</p>
                                <div class="flex">
                                    <button class="premium-button rounded-full px-8 py-4 font-semibold flex items-center gap-3">
                                        <span>Acessar Painel de Afiliado</span>
                                        <i data-lucide="arrow-right" class="w-5 h-5"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });

            // Tab functionality for Arsenal
            const tabContainer = document.getElementById('tab-container');
            if (tabContainer) {
                const indicator = document.getElementById('tab-indicator');
                const tabButtons = tabContainer.querySelectorAll('.tab-button');
                const contentPanes = {
                    trails: document.getElementById('content-trails'),
                    tools: document.getElementById('content-tools')
                };
                
                const updateIndicator = (el) => {
                    if (!indicator || !el) return;
                    indicator.style.width = `${el.offsetWidth}px`;
                    indicator.style.left = `${el.offsetLeft}px`;
                };
                
                const activeTab = tabContainer.querySelector('.tab-button.active');
                if (activeTab) {
                    setTimeout(() => updateIndicator(activeTab), 100);
                }

                tabButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const targetTab = button.dataset.tab;
                        
                        tabButtons.forEach(btn => {
                            btn.classList.remove('active', 'text-white');
                            btn.classList.add('text-white/60', 'hover:text-white');
                        });
                        button.classList.add('active', 'text-white');
                        button.classList.remove('text-white/60', 'hover:text-white');
                        
                        updateIndicator(button);

                        Object.values(contentPanes).forEach(pane => pane.classList.add('hidden'));
                        if (contentPanes[targetTab]) {
                            contentPanes[targetTab].classList.remove('hidden');
                        }
                    });
                });

                window.addEventListener('resize', () => {
                    const currentActiveTab = tabContainer.querySelector('.tab-button.active');
                    if (currentActiveTab) {
                        updateIndicator(currentActiveTab);
                    }
                });
            }

            // Tab functionality for Referral Section
            const referralTabContainer = document.getElementById('referral-tab-container');
            if (referralTabContainer) {
                const referralButtons = referralTabContainer.querySelectorAll('.referral-tab');
                const referralPanes = {
                    credits: document.getElementById('referral-content-credits'),
                    affiliate: document.getElementById('referral-content-affiliate')
                };
                
                referralButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const targetPane = button.dataset.tab;
                        
                        referralButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        Object.values(referralPanes).forEach(pane => {
                            if (pane) pane.classList.add('hidden');
                        });
                        if (referralPanes[targetPane]) {
                            referralPanes[targetPane].classList.remove('hidden');
                        }
                    });
                });
            }
        });
    </script>

</body></html>