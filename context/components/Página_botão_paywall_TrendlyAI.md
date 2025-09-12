BOTÃO PAYWALL
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrendlyAI - Convite ao Estúdio</title>
    <link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        :root {
            --brand-green: #2fd159; /* COR PRINCIPAL DE DESTAQUE */
        }

        /* Estilos base da sheet (sem alterações) */
        .liquid-glass { backdrop-filter: blur(24px); background-color: rgba(18, 18, 22, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5); }
        .liquid-glass-pill { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 9999px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .liquid-glass-pill:hover { background-color: rgba(255, 255, 255, 0.15); transform: scale(1.05); }

        /* Estilos e animações da sheet (sem alterações) */
        #invitation-container.active { opacity: 1; pointer-events: auto; }
        #invitation-backdrop { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        #invitation-backdrop.active { opacity: 1; backdrop-filter: saturate(0.8) blur(8px); }
        #invitation-sheet { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; touch-action: none; }
        #invitation-sheet.active { transform: translateY(0); }
        #invitation-sheet::before { content: ''; position: absolute; top: -20%; left: 50%; transform: translateX(-50%); width: 150%; height: 100%; background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.08), transparent 60%); filter: blur(20px); opacity: 0; transition: opacity 0.8s ease-out 0.4s; }
        #invitation-sheet.active::before { opacity: 1; }
        .invitation-anim { opacity: 0; transform: translateY(20px); animation: item-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes item-enter { to { opacity: 1; transform: translateY(0); } }

        /* Fundo dos cards liquid glass NEUTRO para ambos */
        .plan-card { 
            border-radius: 16px; 
            padding: 24px; 
            cursor: pointer; 
            position: relative; 
            overflow: hidden; 
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Destaque para o card recomendado */
        @media (min-width: 768px) { 
            .plan-card.recommended { 
                transform: scale(1.05); 
                border-color: rgba(47, 209, 89, 0.25); /* Borda verde apenas no recomendado */
            } 
        }

        /* CORREÇÃO APLICADA: O glow agora é um ponto de luz, não uma camada de cor */
        .card-glow::before { 
            content: ''; 
            position: absolute; 
            inset: 0; 
            /* De linear-gradient para radial-gradient para criar um ponto de luz */
            background: radial-gradient(circle at 50% 50%, var(--brand-green) 0%, rgba(47, 209, 89, 0) 60%);
            opacity: 0; 
            filter: blur(30px); 
            mix-blend-mode: screen; 
            border-radius: inherit; 
            pointer-events: none; 
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .plan-card.recommended .card-glow::before { 
            opacity: 0.35; /* Opacidade ajustada para o novo efeito */
            animation: pulse 4s ease-in-out infinite alternate; 
        }
        @keyframes pulse { 
            from { opacity: 0.25; transform: scale(0.95); } 
            to { opacity: 0.45; transform: scale(1.05); } 
        }

        /* Estilos dos botões (sem alterações) */
        .cta-button { width: 100%; padding: 12px 0; border-radius: 12px; font-weight: 600; font-size: 15px; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .cta-primary { 
            background-color: var(--brand-green); 
            color: #000000; 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .cta-primary:hover { 
            transform: scale(1.03); 
            background-color: #3de66e;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(47, 209, 89, 0.4);
        }
        .cta-light-flow::after { 
            content: ''; 
            position: absolute; 
            top: 0; right: 0; bottom: 0; left: 0; 
            background: linear-gradient(90deg, transparent, rgba(200, 255, 215, 0.5), transparent); 
            width: 200%; 
            opacity: 0.8; 
            animation: flow-light 5s ease-in-out infinite; 
            animation-delay: 2s; 
        }
        @keyframes flow-light { 
            0% { transform: translateX(-100%); } 
            100% { transform: translateX(100%); } 
        }
        .cta-secondary { 
            background: transparent; 
            border: 1px solid rgba(255, 255, 255, 0.25); 
            color: white; 
        }
        .cta-secondary:hover { 
            background-color: #FFFFFF; 
            border-color: #FFFFFF; 
            color: #000000; 
        }
        .recommendation-tag { 
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px; 
            font-weight: 600; 
            padding: 4px 10px; 
            border-radius: 9999px; 
            background-color: #1a4d2a;
            color: var(--brand-green);
            border: 1px solid var(--brand-green);
        }
        
        /* Estilos de utilidade (sem alterações) */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .grabber-bar { width: 40px; height: 5px; background-color: rgba(255, 255, 255, 0.3); border-radius: 9999px; }
    </style>
</head>
<body class="bg-gray-950 text-white font-['Inter'] antialiased flex items-center justify-center min-h-screen">

    <button id="open-invitation-btn" class="liquid-glass-pill px-6 py-3">Acessar Recurso Bloqueado</button>

    <div id="invitation-container" class="fixed inset-0 z-50 flex items-end opacity-0 pointer-events-none hidden">
        <div id="invitation-backdrop" class="absolute inset-0 bg-black/30 opacity-0"></div>

        <div id="invitation-sheet" class="liquid-glass relative w-full h-[85vh] md:h-[70vh] rounded-t-2xl flex flex-col transform translate-y-full">
            <div class="absolute top-0 left-0 right-0 flex justify-center pt-3 md:hidden">
                <div class="grabber-bar"></div>
            </div>
            <button id="close-invitation-btn" class="hidden md:flex absolute top-4 right-4 w-10 h-10 items-center justify-center liquid-glass-pill !rounded-full z-20">
                <i data-lucide="x" class="w-5 h-5" style="stroke-width: 1.5"></i>
            </button>
            
            <div id="invitation-scroll-content" class="flex-grow pt-10 p-6 md:p-10 overflow-y-auto flex flex-col justify-start md:justify-center hide-scrollbar">
                <div class="text-center mb-8 md:mb-10 relative z-10">
                    <h2 class="text-3xl md:text-5xl font-bold tracking-tight invitation-anim mb-4" style="font-family:'Geist', sans-serif;">Torne-se o Maestro.</h2>
                    <p class="text-white/70 mt-3 max-w-2xl mx-auto invitation-anim text-lg" style="animation-delay: 150ms;">Acesso ilimitado a todas as estratégias, instrumentos e ao poder de orquestração do nosso Estúdio.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mx-auto mb-8 md:mb-10 relative z-10">
                    <div id="plan-anual" class="plan-card recommended invitation-anim" style="animation-delay: 300ms;">
                        <div class="card-glow"></div>
                        <div class="relative z-10">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-semibold text-lg text-white">Plano Anual</h3>
                                <span class="recommendation-tag whitespace-nowrap">
                                    <i data-lucide="sparkles" class="w-3 h-3" style="stroke-width: 1.5"></i> 
                                    Nossa Recomendação
                                </span>
                            </div>
                            <div class="mb-6">
                                <span class="text-4xl md:text-5xl font-bold text-white tracking-tight">R$149</span>
                                <span class="text-white/70">/mês</span>
                                <p class="text-xs font-normal text-white/60 mt-2">Cobrado R$1.788 anualmente. Uma economia de 50%.</p>
                            </div>
                            <button class="cta-button cta-primary cta-light-flow">Entrar para o Estúdio (Anual)</button>
                        </div>
                    </div>
                    <div id="plan-trimestral" class="plan-card invitation-anim" style="animation-delay: 450ms;">
                         <div class="relative z-10">
                            <h3 class="font-semibold text-lg text-white mb-4">Plano Trimestral</h3>
                            <div class="mb-6">
                                <span class="text-4xl md:text-5xl font-bold text-white tracking-tight">R$299</span>
                                <span class="text-white/70">/mês</span>
                                <p class="text-xs font-normal text-white/60 mt-2">Cobrado R$897 trimestralmente.</p>
                            </div>
                            <button class="cta-button cta-secondary">Continuar com o Trimestral</button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/70 invitation-anim relative z-10 border-t border-white/10 pt-6" style="animation-delay: 600ms;">
                    <div class="flex items-center gap-2">
                        <i data-lucide="shield-check" class="w-4 h-4 text-[var(--brand-green)]" style="stroke-width: 1.5"></i>
                        <span>Garantia de 21 Dias</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="lock" class="w-4 h-4" style="stroke-width: 1.5"></i>
                        <span>Compra 100% Segura</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <i data-lucide="refresh-cw" class="w-4 h-4" style="stroke-width: 1.5"></i>
                        <span>Cancele a Qualquer Momento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const invitationContainer = document.getElementById('invitation-container');
        const invitationBackdrop = document.getElementById('invitation-backdrop');
        const invitationSheet = document.getElementById('invitation-sheet');
        const openBtn = document.getElementById('open-invitation-btn');
        const closeBtn = document.getElementById('close-invitation-btn');
        const planCards = document.querySelectorAll('.plan-card');
        const scrollContent = document.getElementById('invitation-scroll-content');

        const openInvitation = () => {
            scrollContent.scrollTop = 0; 
            document.body.style.overflow = 'hidden';
            invitationSheet.style.transform = ''; 
            invitationContainer.classList.remove('hidden');
            void invitationContainer.offsetWidth; 
            invitationContainer.classList.add('active');
            invitationBackdrop.classList.add('active');
            invitationSheet.classList.add('active');
            lucide.createIcons();
        };

        const closeInvitation = () => {
            document.body.style.overflow = '';
            invitationContainer.classList.remove('active');
            invitationBackdrop.classList.remove('active');
            invitationSheet.style.transform = 'translateY(100%)';

            setTimeout(() => {
                invitationContainer.classList.add('hidden');
                invitationSheet.classList.remove('active');
            }, 600);
        };
        
        openBtn.addEventListener('click', openInvitation);
        closeBtn.addEventListener('click', closeInvitation);
        invitationBackdrop.addEventListener('click', closeInvitation);

        planCards.forEach(card => {
            card.addEventListener('click', () => {
                planCards.forEach(c => c.classList.remove('recommended'));
                card.classList.add('recommended');
            });
        });
        
        let isDragging = false;
        let startY = 0;
        let currentY = 0;
        let startTime = 0;

        const onDragStart = (e) => {
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            const sheetRect = invitationSheet.getBoundingClientRect();
            const handleAreaHeight = 80;

            if (y > sheetRect.top + handleAreaHeight) {
                isDragging = false;
                return;
            }
            
            isDragging = true;
            startY = y;
            startTime = Date.now();
            invitationSheet.style.transition = 'none';
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            if (e.touches) e.preventDefault();
            currentY = e.touches ? e.touches[0].clientY : e.clientY;
            const deltaY = currentY - startY;
            if (deltaY > 0) {
                invitationSheet.style.transform = `translateY(${deltaY}px)`;
            }
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            
            const deltaY = currentY - startY;
            const deltaTime = Date.now() - startTime;
            const velocity = deltaY / deltaTime;
            const dragThreshold = invitationSheet.offsetHeight * 0.30;
            
            invitationSheet.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            if (deltaY > dragThreshold || (velocity > 0.5 && deltaY > 50)) {
                closeInvitation();
            } else {
                invitationSheet.style.transform = 'translateY(0)';
            }

            startY = 0;
            currentY = 0;
            startTime = 0;
        };

        invitationSheet.addEventListener('touchstart', onDragStart, { passive: true });
        invitationSheet.addEventListener('touchmove', onDragMove);
        invitationSheet.addEventListener('touchend', onDragEnd);
        invitationSheet.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
        
        lucide.createIcons();
    });
    </script>
</body>
</html>