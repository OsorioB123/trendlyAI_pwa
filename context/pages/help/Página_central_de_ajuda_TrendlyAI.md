PÁGINA DE SUPORTE
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI - Suporte</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<style>
body { -webkit-tap-highlight-color: transparent; }

/* --- ESTILOS GERAIS (REUTILIZADOS E ADAPTADOS) --- */
.liquid-glass { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28); border-radius: 16px; }
.liquid-glass-pill { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 9999px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.liquid-glass-pill:hover { background-color: rgba(255, 255, 255, 0.15); transform: scale(1.05); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-entry { opacity: 0; transform: translateY(30px) scale(0.98); animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-entry.delay-1 { animation-delay: 0.2s; } .animate-entry.delay-2 { animation-delay: 0.4s; }
@keyframes slideInFade { to { opacity: 1; transform: translateY(0) scale(1); } }

/* --- NOVOS ESTILOS PARA A PÁGINA DE SUPORTE (MONOCROMÁTICA) --- */

/* Card Principal (Substitui .gradient-border-glass) */
.support-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.support-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
.card-glow::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    opacity: 0.08; filter: blur(20px); mix-blend-mode: screen; border-radius: inherit;
    animation: pulse 4s ease-in-out infinite;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes pulse { 0%, 100% { opacity: 0.08; transform: scale(0.95); } 50% { opacity: 0.18; transform: scale(1.05); } }

/* Botão Monocromático (Substitui .btn-gradient) */
.btn-primary-monochrome {
    padding: 12px 28px; border-radius: 9999px; font-weight: 600;
    background-color: white; color: black;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.btn-primary-monochrome:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 12px 25px rgba(255, 255, 255, 0.2), 0 12px 35px rgba(0, 0, 0, 0.3);
}

/* Biblioteca de Sabedoria (FAQ com Abas) */
.faq-tabs { position: relative; }
.faq-tab-btn { width: 100%; padding: 12px 16px; border-radius: 8px; color: #888888; font-weight: 500; transition: color 0.3s ease, background-color 0.3s ease; position: relative; z-index: 2; }
.faq-tab-btn:hover { color: white; background-color: rgba(255, 255, 255, 0.05); }
.faq-tab-btn.is-active { color: white; }
#active-tab-indicator {
    position: absolute; left: 0; width: 100%; border-radius: 8px; background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 1;
}
.tab-content { transition: opacity 0.3s ease; }

/* Acordeão */
.accordion-item { border-bottom: 1px solid rgba(255,255,255,0.1); }
.accordion-header { padding: 20px 0; cursor: pointer; transition: background-color 0.3s ease; }
.accordion-header i { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.accordion-header.is-open i { transform: rotate(180deg); }
.accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.accordion-content-inner { padding-bottom: 20px; color: #A0A0A0; line-height: 1.6; }

/* Widget de Chat */
#chat-widget-container { transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
#chat-widget-backdrop { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
#chat-widget-container.active { opacity: 1; pointer-events: auto; }
#chat-widget-backdrop.active { opacity: 1; backdrop-filter: saturate(0.8) blur(8px); }
#chat-widget {
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: 0; transform: translateY(40px) scale(0.95);
}
#chat-widget-container.active #chat-widget { opacity: 1; transform: translateY(0) scale(1); }
</style>
</head>
<body class="min-h-screen bg-gray-950 font-['Inter'] text-white overflow-x-hidden">
    <div class="fixed top-0 w-full h-screen bg-cover bg-center -z-10" id="aura-image" style="background-image: url('https://i.postimg.cc/QxYjGKPT/8.png?w=800&q=80');"></div>
    
    <!-- Spacer para o Header Fixo -->
    <div style="height: 80px;"></div>

    <main class="w-full mx-auto pb-32">
        <div id="support-container" class="max-w-5xl relative mr-auto ml-auto px-4 space-y-28">
            
            <section id="salina-reminder" class="animate-entry">
                <div class="support-card card-glow p-8 relative">
                    <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div class="flex-shrink-0 w-28 h-28 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                            <i data-lucide="sparkles" class="w-14 h-14 text-white"></i>
                        </div>
                        <div class="">
                            <h2 class="text-2xl font-semibold text-white mb-2 tracking-tight" style="font-family:'Geist',sans-serif;">A Salina é sua primeira guia.</h2>
                            <p class="text-white/70 mb-6 max-w-prose">
                                Para dúvidas sobre estratégias, ideias ou como usar uma ferramenta, comece uma conversa com a Salina na Home. Ela tem acesso a todo o nosso conhecimento.
                            </p>
                            <a href="#" class="btn-primary-monochrome inline-block">Falar com a Salina</a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq-section" class="animate-entry delay-1">
                 <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 lg:items-start">
                    <aside class="lg:col-span-1">
                        <nav id="faq-tabs-nav" class="faq-tabs flex flex-col gap-1 relative">
                            <div id="active-tab-indicator" style="height: 48px; transform: translateY(0px);"></div>
                            <button class="faq-tab-btn is-active flex items-center gap-3" data-tab="primeiros-passos">
                                <i data-lucide="rocket" class="w-4 h-4"></i> <span>Primeiros Passos</span>
                            </button>
                            <button class="faq-tab-btn flex items-center gap-3" data-tab="assinatura">
                                <i data-lucide="gem" class="w-4 h-4"></i> <span>Assinatura</span>
                            </button>
                             <button class="faq-tab-btn flex items-center gap-3" data-tab="ferramentas">
                                <i data-lucide="zap" class="w-4 h-4"></i> <span>Ferramentas</span>
                            </button>
                            <button class="faq-tab-btn flex items-center gap-3" data-tab="tecnico">
                                <i data-lucide="hard-drive" class="w-4 h-4"></i> <span>Questões Técnicas</span>
                            </button>
                        </nav>
                    </aside>
                    <div id="faq-content" class="lg:col-span-3">
                        <div id="primeiros-passos" class="tab-content">
                            <div class="accordion">
                                <div class="accordion-item"><button class="accordion-header is-open w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">O que é a TrendlyAI?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content" style="max-height: 500px;"><div class="accordion-content-inner">TrendlyAI é sua orquestra de inteligência artificial para criação de conteúdo. Combinamos ferramentas de IA, trilhas de aprendizado e a assistente Salina para ajudar você a criar conteúdo de alta performance de forma mais rápida e estratégica.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Como começo a usar as ferramentas?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">A melhor forma de começar é pela Home. Você pode conversar diretamente com a Salina sobre o que deseja criar ou explorar as "Ferramentas recomendadas". Cada ferramenta possui um prompt pronto para uso que você pode abrir, editar e copiar com um clique.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">O que são as Trilhas?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">As Trilhas são jornadas de aprendizado guiadas que combinam teoria e prática. Elas ensinam conceitos de marketing e criação de conteúdo, e integram as ferramentas da TrendlyAI para você aplicar o conhecimento imediatamente.</div></div></div>
                            </div>
                        </div>
                        <div id="assinatura" class="tab-content hidden opacity-0">
                             <div class="accordion">
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Como funciona o cancelamento?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Você pode cancelar sua assinatura a qualquer momento através do seu painel de "Gerenciar Assinatura" no menu do seu perfil. O acesso permanecerá ativo até o final do período já pago.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Quais são as formas de pagamento?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Aceitamos os principais cartões de crédito (Visa, MasterCard, American Express) e PIX para planos anuais. Todo o processamento é feito de forma segura por nosso parceiro de pagamentos.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Posso trocar de plano depois?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas no próximo ciclo de cobrança, exceto para upgrades que são aplicados imediatamente.</div></div></div>
                            </div>
                        </div>
                        <div id="ferramentas" class="tab-content hidden opacity-0">
                            <div class="accordion">
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Como uso os prompts das ferramentas?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Cada ferramenta tem um prompt otimizado que você pode visualizar, editar e copiar. Clique em "Abrir ferramenta", personalize os campos necessários e depois copie o prompt para usar no ChatGPT, Claude ou qualquer IA de sua preferência.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Posso salvar meus trabalhos?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Sim! Você pode salvar seus prompts personalizados e resultados na sua biblioteca pessoal. Isso permite reutilizar estratégias que funcionaram bem e manter um histórico dos seus melhores conteúdos.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Quantas ferramentas estão disponíveis?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Temos mais de 50 ferramentas organizadas por categorias como redes sociais, e-mail marketing, copywriting, storytelling e análise de tendências. Adicionamos novas ferramentas regularmente baseadas no feedback dos usuários.</div></div></div>
                            </div>
                        </div>
                        <div id="tecnico" class="tab-content hidden opacity-0">
                            <div class="accordion">
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">A plataforma funciona no celular?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Sim! A TrendlyAI é totalmente responsiva e funciona perfeitamente em todos os dispositivos. Você pode acessar ferramentas, trilhas e conversar com a Salina tanto no computador quanto no smartphone.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Meus dados estão seguros?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">Absolutamente. Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da indústria. Seus dados nunca são compartilhados com terceiros e você pode deletar sua conta a qualquer momento.</div></div></div>
                                <div class="accordion-item"><button class="accordion-header w-full flex justify-between items-center text-left"><span class="font-semibold text-lg">Posso usar offline?</span><i data-lucide="chevron-down" class="w-6 h-6 text-white/60"></i></button><div class="accordion-content"><div class="accordion-content-inner">A TrendlyAI requer conexão com a internet para funcionar, pois depende de IA em tempo real. Porém, você pode copiar e salvar localmente os prompts e resultados para usar offline posteriormente.</div></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="contact-support" class="animate-entry delay-2 text-center border-t border-white/10 pt-16">
                 <h2 class="text-3xl font-semibold text-white mb-3 tracking-tight" style="font-family:'Geist',sans-serif;">Não encontrou o que procurava?</h2>
                 <p class="text-white/70 mb-8 max-w-lg mx-auto">Nossa equipe de especialistas está aqui para ajudar com qualquer questão que a Salina não possa resolver. Fale diretamente conosco.</p>
                 <button id="open-chat-btn" class="btn-primary-monochrome">Iniciar Conversa com um Especialista</button>
            </section>
        </div>
    </main>

    <!-- HTML DO WIDGET DE CHAT (SIMULADO) -->
    <div id="chat-widget-container" class="fixed inset-0 z-50 flex items-end justify-end p-4 opacity-0 pointer-events-none">
        <div id="chat-widget-backdrop" class="absolute inset-0 bg-black/40 opacity-0"></div>
        <div id="chat-widget" class="liquid-glass relative w-full max-w-sm h-[60vh] rounded-2xl flex flex-col">
            <div class="flex-shrink-0 p-4 flex justify-between items-center border-b border-white/10">
                <div>
                    <h3 class="font-semibold text-white">Suporte TrendlyAI</h3>
                    <p class="text-xs text-white/60">Normalmente respondemos em 5 minutos.</p>
                </div>
                <button id="close-chat-btn" class="text-white/60 hover:text-white liquid-glass-pill w-9 h-9 flex items-center justify-center" aria-label="Fechar chat">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
            <div class="flex-grow p-4 overflow-y-auto hide-scrollbar">
                <div class="space-y-4">
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center flex-shrink-0">
                            <i data-lucide="headphones" class="w-4 h-4 text-white"></i>
                        </div>
                        <div class="bg-white/10 rounded-2xl rounded-tl-md p-3">
                            <p class="text-sm text-white/90">Olá! Como podemos ajudar você hoje? 👋</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-shrink-0 p-4 border-t border-white/10">
                <label class="sr-only" for="chat-input">Mensagem</label>
                <input id="chat-input" type="text" placeholder="Digite sua mensagem..." class="w-full bg-white/10 border-white/14 border rounded-full p-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
        </div>
    </div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons({ strokeWidth: 1.5 });
        
        // --- LÓGICA PARA A PÁGINA DE SUPORTE ---
        
        // 1. Lógica das Abas do FAQ
        function setupFaqTabs() {
            const tabsNav = document.getElementById('faq-tabs-nav');
            if (!tabsNav) return;
            const contentContainer = document.getElementById('faq-content');
            const activeIndicator = document.getElementById('active-tab-indicator');
            const tabButtons = tabsNav.querySelectorAll('.faq-tab-btn');

            tabsNav.addEventListener('click', (e) => {
                const clickedTab = e.target.closest('.faq-tab-btn');
                if (!clickedTab) return;
                const targetId = clickedTab.dataset.tab;
                const targetContent = document.getElementById(targetId);
                activeIndicator.style.transform = `translateY(${clickedTab.offsetTop}px)`;
                activeIndicator.style.height = `${clickedTab.offsetHeight}px`;
                tabButtons.forEach(btn => btn.classList.remove('is-active'));
                clickedTab.classList.add('is-active');
                const currentActiveContent = contentContainer.querySelector('.tab-content:not(.hidden)');
                if (currentActiveContent && currentActiveContent !== targetContent) {
                    currentActiveContent.style.opacity = '0';
                    setTimeout(() => {
                        currentActiveContent.classList.add('hidden');
                        targetContent.classList.remove('hidden');
                        requestAnimationFrame(() => { targetContent.style.opacity = '1'; });
                    }, 150);
                } else if (!currentActiveContent) {
                    targetContent.classList.remove('hidden');
                    requestAnimationFrame(() => { targetContent.style.opacity = '1'; });
                }
            });
            const initialActiveTab = tabsNav.querySelector('.is-active');
            if(initialActiveTab) {
                activeIndicator.style.transform = `translateY(${initialActiveTab.offsetTop}px)`;
                activeIndicator.style.height = `${initialActiveTab.offsetHeight}px`;
            }
        }
        setupFaqTabs();
        
        // 2. Lógica do Acordeão
        function setupAccordion() {
            const faqContent = document.getElementById('faq-content');
            if (!faqContent) return;
            
            faqContent.addEventListener('click', (e) => {
                const header = e.target.closest('.accordion-header');
                if (!header) return;
                
                const content = header.nextElementSibling;
                const isOpen = header.classList.contains('is-open');

                const parentAccordion = header.closest('.accordion');
                parentAccordion.querySelectorAll('.accordion-header').forEach(h => {
                    if (h !== header) {
                        h.classList.remove('is-open');
                        h.nextElementSibling.style.maxHeight = '0px';
                    }
                });

                if (isOpen) {
                    header.classList.remove('is-open');
                    content.style.maxHeight = '0px';
                } else {
                    header.classList.add('is-open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
        setupAccordion();

        // 3. Lógica do Widget de Chat
        function setupChatWidget() {
            const openBtn = document.getElementById('open-chat-btn');
            const container = document.getElementById('chat-widget-container');
            if (!openBtn || !container) return;
            const closeBtn = container.querySelector('#close-chat-btn');
            const backdrop = container.querySelector('#chat-widget-backdrop');
            
            const openChat = () => { container.classList.add('active'); backdrop.classList.add('active'); document.body.style.overflow = 'hidden'; };
            const closeChat = () => { container.classList.remove('active'); backdrop.classList.remove('active'); document.body.style.overflow = ''; };

            openBtn.addEventListener('click', openChat);
            if(closeBtn) closeBtn.addEventListener('click', closeChat);
            if(backdrop) backdrop.addEventListener('click', closeChat);

            // Fechar com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeChat();
            });
        }
        setupChatWidget();
    });
</script>
</body>
</html>