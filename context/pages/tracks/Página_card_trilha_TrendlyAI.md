<html lang="pt-BR"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trilha Criativa - TrendlyAI</title>
    <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {
            --brand-green: #2fd159;
            --brand-yellow: #efd135;
        }
        /* --- DESIGN SYSTEM CORE --- */
        body { -webkit-tap-highlight-color: transparent; background-color: #0A0A0C; }
        body.modal-open { overflow: hidden; }
        .content-card { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35); }
        .liquid-glass-pill { backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 9999px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .liquid-glass-pill:hover { background-color: rgba(255, 255, 255, 0.15); }
        .liquid-glass-pill:active { transform: scale(0.97); }
        .liquid-glass-input { background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(5px); transition: all 0.3s ease; }
        .liquid-glass-input:focus { background-color: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); box-shadow: 0 0 0 3px rgba(255,255,255,0.1); }

        /* --- BOTÕES --- */
        .btn-primary { background-color: #ffffff; color: #000000; font-weight: 600; border-radius: 0.75rem; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .btn-primary:hover:not(:disabled) { transform: scale(1.03); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-secondary { position: relative; overflow: hidden; background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; font-weight: 500; border-radius: 0.75rem; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .btn-secondary:not(:disabled):hover { background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.4); }
        .btn-secondary:active { transform: scale(0.98); }
        .btn-secondary:disabled, .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .btn-secondary.is-completed { background-color: var(--brand-green); border-color: var(--brand-green); color: white; }
        .btn-secondary .btn-text { transition: opacity 0.2s ease-out; }
        .btn-secondary .btn-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .btn-secondary.is-completing .btn-text { opacity: 0; }
        .btn-secondary.is-completing .btn-icon { transform: translate(-50%, -50%) scale(1); opacity: 1; }

        /* --- ANIMAÇÕES & MOTION --- */
        @keyframes pulse-white { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); } 70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } }
        @keyframes pulse-play { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .border-glow { position: absolute; inset: 0; border-radius: inherit; opacity: 0; transition: opacity 0.4s ease; pointer-events: none; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .border-glow::before { content: ''; position: absolute; inset: -150%; background: conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0), white, rgba(255,255,255,0)); animation: spin 4s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(20px); opacity: 0; } }

        /* --- TRILHA & ETAPAS --- */
        #trilha-container { margin: clamp(24px, 5vh, 48px) auto 0; z-index: 2; }
        #trilha-mobile { position: relative; list-style: none; padding: 0; margin: 0 auto; width: 100%; max-width: 420px; }
        #trilha-mobile::before { content: ''; position: absolute; top: 36px; bottom: 36px; left: 50%; width: 120px; transform: translateX(-50%); background-repeat: repeat-y; background-position: center top; background-size: contain; background-image: url("data:image/svg+xml,%3Csvg width='120' height='100' viewBox='0 0 120 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0C0 0 0 50 60 50C120 50 120 100 60 100' stroke='rgba(255,255,255,0.25)' stroke-width='2' stroke-dasharray='5 5'/%3E%3C/svg%3E"); z-index: -1; }
        .trilha-etapa { position: relative; display: flex; justify-content: center; align-items: center; height: 110px; }
        .trilha-btn { width: clamp(68px, 16vw, 76px); height: clamp(68px, 16vw, 76px); display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease; border-radius: 9999px; }
        .trilha-btn:hover { transform: scale(1.05); } .trilha-btn:active { transform: scale(0.95); } .trilha-btn:focus-visible { outline: 3px solid white; outline-offset: 3px; }
        .trilha-etapa:nth-child(odd) .trilha-btn { margin-right: 55%; } .trilha-etapa:nth-child(even) .trilha-btn { margin-left: 55%; }
        .trilha-etapa--concluida .trilha-btn { background: white; color: black; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .trilha-etapa--atual .trilha-btn { animation: pulse-white 2.5s infinite; background-color: rgba(255, 255, 255, 0.2); }
        .trilha-etapa--bloqueada .trilha-btn { background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; }
        .trilha-etapa--bloqueada .trilha-btn svg { opacity: 0.3; }
        .trilha-etapa--bloqueada:hover .trilha-btn { transform: scale(1.05); background-color: rgba(255, 255, 255, 0.05); }
        .trilha-etapa--bloqueada:active .trilha-btn { transform: scale(0.98); }

        /* --- MODAL ITENS BLOQUEADOS --- */
        .locked-modal-overlay { position: fixed; inset: 0; z-index: 2000; display: none; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 1.5rem; animation: fadeIn 0.3s ease forwards; }
        .locked-modal-overlay.is-hiding { animation: fadeOut 0.3s ease forwards; }
        .locked-modal-content { animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; max-width: 400px; width: 100%; text-align: center; backdrop-filter: blur(12px); background-color: rgba(30, 30, 30, 0.5); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4); border-radius: 1rem; padding: 2rem; }
        .locked-modal-overlay.is-hiding .locked-modal-content { animation: slideOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .locked-modal-content .icon-wrapper { width: 56px; height: 56px; margin: 0 auto 1.25rem; background-color: rgba(255,255,255,0.1); border-radius: 50%; display:flex; align-items:center; justify-content:center; }
        @media (max-width: 640px) { .locked-modal-overlay { align-items: flex-end; padding: 1rem; } .locked-modal-content { max-width: 100%; margin-bottom: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0; } }

        /* --- DOSSIER --- */
        .dossier-overlay { position: fixed; inset: 0; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.6s ease; background-color: rgba(10, 10, 12, 0.5); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        .dossier-overlay.active { opacity: 1; pointer-events: all; }
        .expanding-circle { position: absolute; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; transform: scale(0); pointer-events: none; z-index: 1001; }
        .expanding-circle.animate { transform: scale(40); opacity: 0; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease 0.3s; }
        .dossier-content { position: absolute; inset: 0; z-index: 1002; opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.3s; overflow-y: auto; scroll-behavior: smooth; }
        .dossier-content.visible { opacity: 1; transform: translateY(0); }
        .dossier-header { position: fixed; top: 0; left: 0; right: 0; height: 80px; backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.05); z-index: 1003; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; }
        .dossier-header h1 { text-shadow: 0 1px 4px rgba(0,0,0,0.5); }
        .video-placeholder { cursor: pointer; }
        .video-placeholder .play-icon { animation: pulse-play 2s infinite ease-in-out; }

        /* --- PROMPT CARDS REFINADOS --- */
        .prompt-card { position: relative; overflow: hidden; backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 1rem; padding: 1.5rem; transition: all 0.3s ease; cursor: pointer; }
        .prompt-card:hover { background-color: rgba(255, 255, 255, 0.1); transform: translateY(-4px); }
        .prompt-card:hover .border-glow { opacity: 1; }
        .prompt-card p { color: #A0A0A0; font-size: 0.95rem; }
        .prompt-card .chevron { transition: transform 0.3s ease; }
        .prompt-card.expanded .chevron { transform: rotate(180deg); }
        .prompt-card-content { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.5s cubic-bezier(0.25, 1, 0.5, 1); margin-top: 0; }
        .prompt-card.expanded .prompt-card-content { grid-template-rows: 1fr; margin-top: 1rem; }
        .prompt-card-content > div { overflow: hidden; }
        
        .prompt-action-icon { background: none; border: none; padding: 4px; border-radius: 50%; color: #888; cursor: pointer; transition: all 0.2s ease; }
        .prompt-action-icon:hover { color: #FFF; background-color: rgba(255,255,255,0.1); }
        .prompt-action-icon.favorited { color: #FFD700; }

        /* --- SISTEMA DE AVALIAÇÃO --- */
        .rating-stars { display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 16px; }
        .rating-star { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; transition: all 0.2s ease; }
        .rating-star svg { color: rgba(255, 255, 255, 0.3); transition: color 0.2s ease; }
        .rating-star:hover svg, .rating-star.star-hover svg { color: var(--brand-yellow); transform: scale(1.15); }
        .rating-star.star-filled svg { color: var(--brand-yellow); }

        .rating-comment-section {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .rating-comment-section.is-visible {
            grid-template-rows: 1fr;
        }
        .rating-comment-section > div {
            overflow: hidden;
            padding-top: 16px; /* Adiciona espaço quando visível */
        }
        
        /* --- TOAST --- */
        .toast { position: fixed; bottom: 30px; left: 50%; background-color: rgba(255, 255, 255, 0.9); color: #000; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 500; z-index: 2001; opacity: 0; transform: translateX(-50%) translateY(10px); transition: all 0.3s ease; }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* --- POPUP AVALIAÇÃO ENVIADA --- */
        .rating-success-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2001; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
        .rating-success-overlay.show { opacity: 1; pointer-events: all; }
        .rating-success-popup { position: fixed; top: 50%; left: 50%; background-color: rgba(30, 30, 30, 0.8); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 2rem; border-radius: 1rem; text-align: center; z-index: 2002; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: calc(100% - 32px); max-width: 320px;
            opacity: 0; transform: translate(-50%, -50%) scale(0.95); pointer-events: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .rating-success-overlay.show .rating-success-popup { opacity: 1; transform: translate(-50%, -50%) scale(1); pointer-events: all; }

    </style>
</head>
<body class="font-['Inter'] text-white overflow-x-hidden relative">
    
    
    <div style="height: 80px;"></div>

    <main class="w-full mx-auto px-4 sm:px-6 pb-24" id="mainContent">
        <header class="relative pt-6 lg:pt-8 text-center max-w-4xl mx-auto">
            <h1 class="text-white tracking-tighter" style="font-family: 'Geist', sans-serif; font-weight: 700; font-size: clamp(32px, 5vw, 56px); line-height: 1.1;">Trilha de Design Criativo</h1>
            <p class="mt-4 text-white/70 mx-auto" style="max-width: 720px; font-size: clamp(16px, 2vw, 18px);">Da ideia ao protótipo final — no seu ritmo.</p>
        </header>

        <div id="trilha-container">
            <ol id="trilha-mobile">
                <li class="trilha-etapa trilha-etapa--concluida" data-step="1"><button class="trilha-btn" aria-label="Etapa 1: Gerar Ideias"><i data-lucide="check" style="width: 32px; height: 32px;"></i></button></li>
                <li class="trilha-etapa trilha-etapa--concluida" data-step="2"><button class="trilha-btn" aria-label="Etapa 2: Definir Conceito"><i data-lucide="check" style="width: 32px; height: 32px;"></i></button></li>
                <li class="trilha-etapa trilha-etapa--atual" data-step="3"><button class="trilha-btn liquid-glass-pill" aria-label="Etapa 3: Protótipo Visual"><div class="relative z-10 flex items-center justify-center"><i data-lucide="wand-sparkles" style="width: 34px; height: 34px;"></i></div></button></li>
                <li class="trilha-etapa trilha-etapa--bloqueada" data-step="4" data-title="Testar Protótipo" data-description="Conclua as etapas anteriores para desbloquear esta."><button class="trilha-btn" aria-label="Etapa 4: Testar Protótipo (bloqueado)"><i data-lucide="lock" style="width: 32px; height: 32px;"></i></button></li>
                <li class="trilha-etapa trilha-etapa--bloqueada" data-step="5" data-title="Finalizar Design" data-description="Conclua as etapas anteriores para desbloquear esta."><button class="trilha-btn" aria-label="Etapa 5: Finalizar Design (bloqueado)"><i data-lucide="award" style="width: 32px; height: 32px;"></i></button></li>
            </ol>
        </div>

        <div class="mt-12 space-y-8 max-w-lg mx-auto">
            <div class="content-card rounded-2xl p-6">
                <h2 class="text-xl font-semibold mb-4 tracking-tight" style="font-family: 'Geist', sans-serif;">Sua Jornada Criativa</h2>
                <p class="text-white/70 mb-6">Navegue pelas etapas da sua jornada. Clique na etapa atual para continuar.</p>
                <button class="w-full btn-primary px-4 py-3 flex items-center justify-center" id="continueCurrent">
                    <span>Continuar Protótipo Visual</span>
                    <i data-lucide="arrow-right" class="ml-2" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
            
            <!-- Card de Avaliação -->
            <div id="rating-card" class="content-card rounded-2xl p-6">
                <h2 class="text-xl font-semibold mb-4 tracking-tight text-center" style="font-family: 'Geist', sans-serif;">Avalie esta trilha</h2>
                <div class="rating-stars">
                    <button class="rating-star" data-value="1" aria-label="Avaliar com 1 estrela"><i data-lucide="star" style="width: 28px; height: 28px;"></i></button>
                    <button class="rating-star" data-value="2" aria-label="Avaliar com 2 estrelas"><i data-lucide="star" style="width: 28px; height: 28px;"></i></button>
                    <button class="rating-star" data-value="3" aria-label="Avaliar com 3 estrelas"><i data-lucide="star" style="width: 28px; height: 28px;"></i></button>
                    <button class="rating-star" data-value="4" aria-label="Avaliar com 4 estrelas"><i data-lucide="star" style="width: 28px; height: 28px;"></i></button>
                    <button class="rating-star" data-value="5" aria-label="Avaliar com 5 estrelas"><i data-lucide="star" style="width: 28px; height: 28px;"></i></button>
                </div>
                <div class="rating-comment-section" id="rating-comment-section">
                    <div>
                        <textarea id="rating-comment" class="w-full rounded-lg p-3 mb-4 text-white/90 placeholder-white/40 focus:outline-none liquid-glass-input" rows="3" placeholder="Deixe um comentário (opcional)..."></textarea>
                        <button id="submit-rating-btn" class="w-full btn-primary px-4 py-3">Enviar Avaliação</button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- DOSSIER OVERLAY -->
    <div class="dossier-overlay" id="dossierOverlay">
        <div class="expanding-circle" id="expandingCircle"></div>
        <header class="dossier-header">
            <button id="backBtn" class="flex-1 text-left flex items-center text-white/80 hover:text-white transition-colors"><i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i><span class="ml-2 font-medium hidden sm:inline">Voltar</span></button>
            <h1 id="dossierTitle" class="flex-shrink text-lg font-semibold tracking-tight truncate text-center px-2" style="font-family: 'Geist', sans-serif;"></h1>
            <div class="flex-1 text-right"></div>
        </header>
        <div class="dossier-content" id="dossierContent">
            <div class="max-w-3xl mx-auto px-6 pt-24 pb-48">
                <section class="mb-16">
                    <h2 class="text-4xl font-bold mb-4 tracking-tighter" style="font-family: 'Geist', sans-serif;">Sua Missão</h2>
                    <p class="text-white/80 text-lg leading-relaxed mb-10" id="briefingText"></p>
                    
                    <div id="videoContainer" class="mb-16" style="display: none;">
                        <div id="videoPlayer" class="content-card rounded-xl overflow-hidden aspect-video relative video-placeholder">
                           <div class="bg-black/50 w-full h-full flex items-center justify-center">
                               <i data-lucide="play" class="text-white/60 w-16 h-16 play-icon"></i>
                           </div>
                        </div>
                    </div>
                </section>

                <section class="mb-16">
                    <h2 class="text-3xl font-semibold mb-8 tracking-tight text-white" style="font-family: 'Geist', sans-serif;">Arsenal da Missão</h2>
                    <div class="space-y-4" id="promptCards">
                         <!-- Cards de Prompt -->
                        <div class="prompt-card" data-prompt="Você é um especialista em design criativo. Gere 5 conceitos únicos para um projeto de [TIPO DE PROJETO]. Considere: público-alvo, estilo visual, mensagem principal e diferenciação no mercado.">
                            <div class="border-glow"></div>
                            <div class="relative z-10">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1 pr-4">
                                        <h3 class="text-lg font-semibold mb-1 text-white">Gerador de Conceitos</h3>
                                        <p>Crie múltiplas direções criativas para seu projeto</p>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <button class="prompt-action-icon favorite-btn" aria-label="Favoritar">
                                            <i data-lucide="heart" style="width: 20px; height: 20px;"></i>
                                        </button>
                                        <button class="prompt-action-icon copy-btn" aria-label="Copiar prompt">
                                            <i data-lucide="copy" style="width: 20px; height: 20px;"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="flex justify-end mt-2">
                                    <i data-lucide="chevron-down" class="chevron text-white/60" style="width: 18px; height: 18px;"></i>
                                </div>
                            </div>
                            <div class="prompt-card-content">
                                <div>
                                    <div class="content-card rounded-lg p-4 bg-black/30">
                                        <p class="text-sm text-white/90 font-mono leading-relaxed">Você é um especialista em design criativo. Gere 5 conceitos únicos para um projeto de [TIPO DE PROJETO]. Considere: público-alvo, estilo visual, mensagem principal e diferenciação no mercado.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="prompt-card" data-prompt="Atue como um diretor criativo experiente. Analise este briefing: [INSERIR BRIEFING]. Desenvolva 3 estratégias visuais distintas, cada uma com paleta de cores, tipografia e elementos gráficos específicos.">
                            <div class="border-glow"></div>
                            <div class="relative z-10">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1 pr-4">
                                        <h3 class="text-lg font-semibold mb-1 text-white">Estratégia Visual</h3>
                                        <p>Desenvolva direções visuais específicas e detalhadas</p>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <button class="prompt-action-icon favorite-btn" aria-label="Favoritar">
                                            <i data-lucide="heart" style="width: 20px; height: 20px;"></i>
                                        </button>
                                        <button class="prompt-action-icon copy-btn" aria-label="Copiar prompt">
                                            <i data-lucide="copy" style="width: 20px; height: 20px;"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="flex justify-end mt-2">
                                    <i data-lucide="chevron-down" class="chevron text-white/60" style="width: 18px; height: 18px;"></i>
                                </div>
                            </div>
                            <div class="prompt-card-content">
                                <div>
                                    <div class="content-card rounded-lg p-4 bg-black/30">
                                        <p class="text-sm text-white/90 font-mono leading-relaxed">Atue como um diretor criativo experiente. Analise este briefing: [INSERIR BRIEFING]. Desenvolva 3 estratégias visuais distintas, cada uma com paleta de cores, tipografia e elementos gráficos específicos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-16">
                    <div class="border-t border-white/10 pt-10">
                        <h2 class="text-[2rem] font-semibold mb-6 tracking-tight text-white" style="font-family: 'Geist', sans-serif;">Execução com a Salina</h2>
                        <p class="text-white/80 text-lg leading-relaxed mb-8">Agora que você tem as ferramentas, é hora de refinar. Leve seus prompts e ideias para a Salina.</p>
                        <div class="text-center">
                            <button id="chatSalinaBtn" class="btn-primary px-8 py-4 text-lg font-semibold">Conversar com Salina</button>
                        </div>
                    </div>
                </section>

                <section class="mb-8">
                    <div class="text-center">
                        <button id="completeStepBtn" class="btn-secondary px-8 py-3 text-base font-semibold w-full max-w-sm mx-auto h-[50px]">
                            <span class="btn-text">Marcar Etapa como Concluída</span>
                            <i data-lucide="check" class="btn-icon" style="width: 24px; height: 24px;"></i>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <!-- Modal de Etapa Bloqueada -->
    <div id="lockedModal" class="locked-modal-overlay">
        <div class="locked-modal-content">
            <div class="icon-wrapper"><i data-lucide="lock" class="text-white/70" style="width: 28px; height: 28px;"></i></div>
            <h3 id="lockedModalTitle" class="text-xl font-semibold mb-2" style="font-family: 'Geist', sans-serif;">Etapa Bloqueada</h3>
            <p id="lockedModalDescription" class="text-white/70 mb-6">Conclua as etapas anteriores para desbloquear esta.</p>
            <button id="closeLockedModalBtn" class="btn-secondary w-full py-2.5">Entendi</button>
        </div>
    </div>

    <!-- Popup de Sucesso da Avaliação -->
    <div id="ratingSuccessOverlay" class="rating-success-overlay">
        <div id="ratingSuccessPopup" class="rating-success-popup">
            <div class="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 border border-white/10">
                <i data-lucide="check" class="text-[var(--brand-green)]" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Avaliação Enviada!</h3>
            <p class="text-white/70">Obrigado pelo seu feedback.</p>
        </div>
    </div>

    <div id="toast" class="toast">Prompt copiado!</div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        lucide.createIcons();

        const dossierOverlay = document.getElementById('dossierOverlay');
        const expandingCircle = document.getElementById('expandingCircle');
        const dossierContent = document.getElementById('dossierContent');
        const dossierTitle = document.getElementById('dossierTitle');
        const briefingText = document.getElementById('briefingText');
        const backBtn = document.getElementById('backBtn');
        const completeStepBtn = document.getElementById('completeStepBtn');
        const lockedModal = document.getElementById('lockedModal');
        const toast = document.getElementById('toast');
        const chatSalinaBtn = document.getElementById('chatSalinaBtn');
        const videoContainer = document.getElementById('videoContainer');
        const videoPlayer = document.getElementById('videoPlayer');

        const etapasData = {
            1: { title: "Etapa 1: Gerar Ideias", briefing: "Nesta etapa, seu objetivo é gerar um volume de ideias brutas. Assista ao tutorial para entender o framework mental e use os prompts para iniciar seu brainstorm.", videoId: "dQw4w9WgXcQ" },
            2: { title: "Etapa 2: Definir Conceito", briefing: "Refine suas ideias em um conceito claro e coeso, definindo a direção visual e a mensagem principal do seu projeto.", videoId: null },
            3: { title: "Etapa 3: Protótipo Visual", briefing: "Crie um protótipo visual do seu conceito usando nosso assistente de IA para dar vida às suas ideias de forma tangível.", videoId: null }
        };

        function showToast(message) { 
            toast.textContent = message; 
            toast.classList.add('show'); 
            setTimeout(() => toast.classList.remove('show'), 2500); 
        }
        
        // --- INÍCIO DO SISTEMA DE AVALIAÇÃO CORRIGIDO ---
        const ratingStars = document.querySelectorAll('.rating-star');
        const ratingCommentSection = document.getElementById('rating-comment-section');
        const ratingCommentInput = document.getElementById('rating-comment');
        const submitRatingBtn = document.getElementById('submit-rating-btn');
        const ratingSuccessOverlay = document.getElementById('ratingSuccessOverlay');
        let currentRating = 0;

        function updateStarsVisual(rating) {
            ratingStars.forEach((star, index) => {
                // CORREÇÃO: Seleciona o elemento <svg> dentro do botão, não o <i>
                const icon = star.querySelector('svg');
                if (!icon) return; // Segurança caso o ícone não exista

                if (index < rating) {
                    star.classList.add('star-filled');
                    icon.setAttribute('fill', 'currentColor'); // Aplica o preenchimento
                } else {
                    star.classList.remove('star-filled');
                    icon.setAttribute('fill', 'none'); // Remove o preenchimento
                }
            });
        }
        
        ratingStars.forEach((star) => {
            star.addEventListener('mouseover', () => {
                const hoverValue = parseInt(star.dataset.value);
                ratingStars.forEach((s, i) => {
                    s.classList.toggle('star-hover', i < hoverValue);
                });
            });
            
            star.addEventListener('mouseleave', () => {
                ratingStars.forEach(s => s.classList.remove('star-hover'));
                updateStarsVisual(currentRating); // Garante que o estado fixo volte após o hover
            });
            
            star.addEventListener('click', (e) => {
                e.preventDefault();
                currentRating = parseInt(star.dataset.value);
                updateStarsVisual(currentRating); // Atualiza visualmente para a seleção permanente
                ratingCommentSection.classList.add('is-visible'); // Mostra a seção de comentário
            });
        });

        submitRatingBtn.addEventListener('click', () => {
            const comment = ratingCommentInput.value.trim();
            console.log(`Avaliação enviada: ${currentRating} estrelas. Comentário: "${comment}"`);
            
            // Mostrar popup de sucesso
            ratingSuccessOverlay.classList.add('show');
            lucide.createIcons({ nodes: [ratingSuccessOverlay] }); // Re-renderiza o ícone de check se necessário
            
            // Após um tempo, esconde o popup e reseta o formulário
            setTimeout(() => {
                ratingSuccessOverlay.classList.remove('show');
                
                // Resetar estado
                currentRating = 0;
                updateStarsVisual(0);
                ratingCommentInput.value = '';
                ratingCommentSection.classList.remove('is-visible');
            }, 2000);
        });
        // --- FIM DO SISTEMA DE AVALIAÇÃO ---
        
        function openDossier(stepNumber, clickedBtn) {
            if (!etapasData[stepNumber]) return;
            const data = etapasData[stepNumber];

            dossierContent.scrollTop = 0;
            
            const rect = clickedBtn.getBoundingClientRect();
            expandingCircle.style.left = `${rect.left + rect.width / 2}px`;
            expandingCircle.style.top = `${rect.top + rect.height / 2}px`;
            expandingCircle.style.width = `${rect.width}px`;
            expandingCircle.style.height = `${rect.height}px`;
            
            dossierTitle.textContent = data.title;
            briefingText.textContent = data.briefing;
            
            if (data.videoId) {
                videoContainer.style.display = 'block';
                videoPlayer.innerHTML = `<div class="bg-black/50 w-full h-full flex items-center justify-center"><i data-lucide="play" class="text-white/60 w-16 h-16 play-icon"></i></div>`;
                lucide.createIcons();
                videoPlayer.dataset.videoId = data.videoId;
                videoPlayer.classList.add('video-placeholder');
            } else {
                videoContainer.style.display = 'none';
            }
            
            dossierOverlay.classList.add('active');
            document.body.classList.add('modal-open');
            requestAnimationFrame(() => {
                expandingCircle.classList.add('animate');
                setTimeout(() => dossierContent.classList.add('visible'), 300);
            });
            
            completeStepBtn.classList.remove('is-completing', 'is-completed');
            completeStepBtn.disabled = false;
        }

        function closeDossier() {
            dossierContent.classList.remove('visible');
            setTimeout(() => { 
                expandingCircle.classList.remove('animate'); 
                setTimeout(() => { 
                    dossierOverlay.classList.remove('active'); 
                    document.body.classList.remove('modal-open'); 
                }, 600);
            }, 100);
        }

        videoPlayer.addEventListener('click', function() {
            if (this.classList.contains('video-placeholder')) {
                const videoId = this.dataset.videoId;
                this.classList.remove('video-placeholder');
                this.innerHTML = `<iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            }
        });

        function openLockedModal(title, description) {
            document.getElementById('lockedModalTitle').textContent = title;
            document.getElementById('lockedModalDescription').textContent = description;
            lockedModal.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
        
        function closeLockedModal() {
            lockedModal.classList.add('is-hiding');
            lockedModal.addEventListener('animationend', () => {
                lockedModal.style.display = 'none';
                lockedModal.classList.remove('is-hiding');
                if(!dossierOverlay.classList.contains('active')) {
                    document.body.classList.remove('modal-open');
                }
            }, { once: true });
        }

        document.getElementById('closeLockedModalBtn').addEventListener('click', closeLockedModal);
        lockedModal.addEventListener('click', (e) => { if (e.target === lockedModal) closeLockedModal(); });
        document.querySelectorAll('.trilha-etapa--bloqueada').forEach(step => step.addEventListener('click', (e) => { e.stopPropagation(); openLockedModal(step.dataset.title, step.dataset.description); }));
        document.querySelectorAll('.trilha-etapa:not(.trilha-etapa--bloqueada)').forEach(etapa => etapa.addEventListener('click', () => { openDossier(parseInt(etapa.dataset.step), etapa.querySelector('.trilha-btn')); }));
        document.getElementById('continueCurrent')?.addEventListener('click', () => { const currentStep = document.querySelector('.trilha-etapa--atual'); if (currentStep) openDossier(parseInt(currentStep.dataset.step), currentStep.querySelector('.trilha-btn')); });

        backBtn.addEventListener('click', closeDossier);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (dossierOverlay.classList.contains('active')) closeDossier(); else if (lockedModal.style.display === 'flex') closeLockedModal(); } });

        document.querySelectorAll('.prompt-card').forEach(card => {
            card.addEventListener('click', (e) => { if (e.target.closest('button')) return; card.classList.toggle('expanded'); });
            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => { e.stopPropagation(); favoriteBtn.classList.toggle('favorited'); const heartIcon = favoriteBtn.querySelector('i'); heartIcon.setAttribute('fill', favoriteBtn.classList.contains('favorited') ? 'currentColor' : 'none'); });
            const copyBtn = card.querySelector('.copy-btn');
            copyBtn.addEventListener('click', (e) => { e.stopPropagation(); navigator.clipboard.writeText(card.dataset.prompt).then(() => { const originalIcon = copyBtn.innerHTML; copyBtn.innerHTML = `<i data-lucide="check" style="width: 20px; height: 20px;"></i>`; lucide.createIcons({nodes: [copyBtn]}); setTimeout(() => { copyBtn.innerHTML = originalIcon; lucide.createIcons({nodes: [copyBtn]}); }, 2000); showToast('Prompt copiado!'); }); });
        });
        
        completeStepBtn.addEventListener('click', () => {
            if (completeStepBtn.classList.contains('is-completing')) return;
            completeStepBtn.classList.add('is-completing', 'is-completed');
            completeStepBtn.disabled = true;
            setTimeout(() => { closeDossier(); }, 1500); 
        });
    });
    </script>

</body></html>