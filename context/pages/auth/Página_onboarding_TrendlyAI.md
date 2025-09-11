PÁGINA DE ONBOARDING:
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>TrendlyAI - Bem-vindo</title>
<!-- Fonts -->
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<!-- Scripts -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<style>
:root {
--brand-glow-color: white;
--bg-main: #101014;
}
/* --- ESTILOS GERAIS --- */
body {
background-color: var(--bg-main);
font-family: 'Inter', sans-serif;
-webkit-tap-highlight-color: transparent;
color: white;
}
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
/* --- ANIMAÇÕES GERAIS --- */
.fade-in-up, .animate-entry {
opacity: 0;
transform: translateY(20px);
animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-entry.delay-1 { animation-delay: 0.15s; }
.animate-entry.delay-2 { animation-delay: 0.3s; }
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
/* --- CONTROLES DO SLIDER --- */
.slide {
position: absolute;
width: 100%; height: 100%;
opacity: 0;
transition: opacity 0.6s ease-in-out;
visibility: hidden;
display: flex; flex-direction: column;
justify-content: flex-end;
}
.slide.active { opacity: 1; visibility: visible; }
.slide-dot {
height: 6px;
border-radius: 9999px;
cursor: pointer;
transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease;
}
/* --- COMPONENTE DE BOTÃO PRIMÁRIO --- */
.primary-button-glow {
position: relative; overflow: hidden; border-radius: 9999px;
display: inline-flex; align-items: center; justify-content: center;
font-weight: 500; padding: 0.875rem 2rem;
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
backdrop-filter: blur(12px);
background-color: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.14);
}
.primary-button-glow:hover {
transform: translateY(-3px) scale(1.03);
background-color: rgba(255, 255, 255, 0.15);
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.primary-button-glow:active { transform: scale(0.98); transition-duration: 0.1s; }
.border-glow {
position: absolute; inset: 0; border-radius: inherit; opacity: 0;
transition: opacity 0.4s ease; pointer-events: none;
mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
-webkit-mask-composite: xor; mask-composite: exclude;
}
.primary-button-glow:hover .border-glow { opacity: 1; }
.border-glow::before {
content: ''; position: absolute; inset: -150%;
background: conic-gradient(from 180deg at 50% 50%, var(--brand-glow-color), rgba(255, 255, 255, 0.5), var(--brand-glow-color));
animation: spin 4s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
/* --- BACKGROUNDS DOS SLIDES --- */
.slide-background {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100vh;
z-index: -10;
background-size: cover;
background-position: center;
opacity: 0;
transition: opacity 0.6s ease-in-out;
}
.slide-background.active {
opacity: 1;
}
/* --- AJUSTES FINAIS: ESTILOS DO SLIDE 3 (SELEÇÃO DE TEMA) --- */
.slide-content-theme { display: flex; flex-direction: column; height: 100%; }
.background-layer {
position: fixed; inset: 0; z-index: -2; opacity: 0;
transition: opacity 600ms cubic-bezier(0.25, 1, 0.5, 1);
background-size: cover; background-position: center;
}
.background-layer.is-active { opacity: 1; }
.liquid-glass-tag {
backdrop-filter: blur(10px); background-color: rgba(255, 255, 255, 0.12);
border: 1px solid rgba(255, 255, 255, 0.16); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
border-radius: 9999px; padding: 4px 12px; font-size: 12px;
font-weight: 500; color: white;
}
.theme-sphere {
position: relative;
width: 120px; height: 120px;
border-radius: 9999px; cursor: pointer;
border: 2px solid transparent;
overflow: hidden; /* Crucial para o efeito de zoom */
transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
background-color: #1a1a1a; /* Cor de fallback */
}
/* NOVO: Pseudo-elemento para a imagem de fundo */
.theme-sphere::before {
content: '';
position: absolute;
inset: -5px; /* Ligeiramente maior que o container */
border-radius: inherit;
background-image: var(--sphere-bg);
background-size: cover;
background-position: center;
transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
z-index: 1;
}
/* NOVO: Efeito de motion no hover */
.theme-sphere:hover::before {
transform: scale(1.1);
}
.theme-sphere::after { /* Efeito 3D de brilho/sombra */
content: ''; position: absolute; inset: 0; border-radius: inherit;
background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%);
box-shadow: inset 0 0 25px 5px rgba(0,0,0,0.3); mix-blend-mode: overlay;
z-index: 3;
}
@media (max-width: 1023px) {
#themes-track { scroll-snap-type: x mandatory; padding: 0 calc(50vw - 60px); }
.theme-sphere { transform: scale(0.9); opacity: 0.5; }
.theme-sphere.is-in-view { transform: scale(1); opacity: 1; }
}
.theme-sphere.is-selected { border-color: white; box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
.check-icon {
position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
background-color: rgba(0, 0, 0, 0.4); border-radius: 9999px;
opacity: 0; transform: scale(0.8); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
pointer-events: none; z-index: 2; /* Acima do BG, abaixo do brilho */
}
.theme-sphere.is-selected .check-icon { opacity: 1; transform: scale(1); }
</style></head>

<body class="min-h-screen overflow-hidden relative">
    <!-- Background placeholders for slides 1, 2, 4 -->
    <div id="slide-bg-1" class="slide-background active" style="background-image: url('https://i.ibb.co/602fn0G5/tela-1.webp');"></div>
    <div id="slide-bg-2" class="slide-background" style="background-image: url('https://i.ibb.co/0j3FZ1fm/tela-2.webp');"></div>
    <div id="slide-bg-4" class="slide-background" style="background-image: url('https://i.ibb.co/zTV6nP2q/tela-4.webp');"></div>

    <div id="background-container" class="hidden"></div>
    <div class="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10"></div>

    <main class="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-8 pb-10">
        <div id="slides-container" class="relative flex-1 min-h-0">
            
            <!-- Slide 1 -->
            <div id="slide-1" class="slide active">
                <div>
                    <h1 class="text-3xl md:text-4xl fade-in-up font-semibold tracking-tight mb-4" style="font-family:'Geist', sans-serif;">A tela em branco. O maior inimigo da criatividade.</h1>
                    <p class="fade-in-up max-w-md text-base text-white/80" style="animation-delay: 0.15s;">Por anos, as ferramentas nos deram mais botões, mas nunca uma direção. Elas nos deixaram sozinhos com o nosso maior desafio.</p>
                </div>
            </div>
            
            <!-- Slide 2 -->
            <div id="slide-2" class="slide">
                <div>
                    <h1 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 fade-in-up" style="font-family:'Geist', sans-serif;">E se você tivesse um gênio como co-piloto?</h1>
                    <p class="text-base text-white/80 mb-6 fade-in-up max-w-md" style="animation-delay: 0.15s;">Apresentando Salina, sua mente estratégica pessoal. Ela não te dá ferramentas. Ela conversa, guia e co-cria com você, transformando intenção em excelência.</p>
                </div>
            </div>
            
            <!-- Slide 3 - Seleção de Tema -->
            <div id="slide-3" class="slide">
                <div class="slide-content-theme">
                    <section class="text-center pt-8 pb-4 flex-shrink-0">
                        <h2 class="text-3xl font-semibold tracking-tight animate-entry" style="font-family:'Geist',sans-serif;">Defina a energia do seu estúdio.</h2>
                        <p class="mt-2 text-white/80 animate-entry delay-1">Escolha o ambiente que inspira seu trabalho hoje.</p>
                    </section>
                    <section class="flex-grow flex flex-col items-center justify-center min-h-0 py-8 animate-entry delay-2">
                        <div id="themes-gallery" class="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible pb-4">
                            <ol id="themes-track" class="flex items-center gap-6 lg:p-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:max-w-3xl lg:mx-auto"></ol>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Slide 4 -->
            <div id="slide-4" class="slide">
                <div>
                    <h1 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 fade-in-up" style="font-family:'Geist', sans-serif;">Bem-vindo ao seu novo estúdio criativo.</h1>
                    <p class="text-base text-white/80 mb-6 fade-in-up max-w-md" style="animation-delay: 0.15s;">Explore trilhas de aprendizado, domine ferramentas de precisão e converse com a Salina para transformar qualquer ideia em seu próximo grande projeto. O poder é seu.</p>
                </div>
            </div>
        </div>
        
        <!-- Controles Inferiores Globais -->
        <div class="flex-shrink-0 mt-8">
            <div class="flex items-center space-x-2 mb-10 fade-in-up" style="animation-delay: 0.3s;">
                <div id="dot-1" class="slide-dot" style="width: 24px; background-color: white;"></div>
                <div id="dot-2" class="slide-dot" style="width: 6px; background-color: rgba(255, 255, 255, 0.3);"></div>
                <div id="dot-3" class="slide-dot" style="width: 6px; background-color: rgba(255, 255, 255, 0.3);"></div>
                <div id="dot-4" class="slide-dot" style="width: 6px; background-color: rgba(255, 255, 255, 0.3);"></div>
            </div>
            
            <div class="flex items-center justify-between fade-in-up" style="animation-delay: 0.45s;">
                <button id="skip-btn" class="text-white/70 hover:text-white px-6 py-3.5 rounded-full font-medium transition-colors">Pular</button>
                <button id="next-btn" class="primary-button-glow">
                    <div class="border-glow"></div>
                    <span id="button-content" class="relative z-10 flex items-center"></span>
                </button>
            </div>
            
            <div class="w-[134px] h-[5px] bg-white/40 rounded-full mx-auto mt-8"></div>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.75 });

            // --- CONTROLE PRINCIPAL DO SLIDER ---
            let currentSlide = 1;
            const totalSlides = 4;
            const nextBtn = document.getElementById('next-btn');
            const skipBtn = document.getElementById('skip-btn');
            const buttonContent = document.getElementById('button-content');

            // --- VARIÁVEIS DO SELETOR DE TEMA (SLIDE 3) ---
            let themesInitialized = false;
            let selectedThemeId = 'default';
            const themes = [
                { id: 'default', name: 'Padrão Trendly', value: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
                { id: 'theme-2', name: 'Ambiente 2', value: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
                { id: 'theme-3', name: 'Ambiente 3', value: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
                { id: 'theme-4', name: 'Ambiente 4', value: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
                { id: 'theme-5', name: 'Ambiente 5', value: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
                { id: 'theme-6', name: 'Ambiente 6', value: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
                { id: 'theme-7', name: 'Ambiente 7', value: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
                { id: 'theme-8', name: 'Ambiente 8', value: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
                { id: 'theme-9', name: 'Ambiente 9', value: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
                { id: 'theme-10', name: 'Ambiente 10', value: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
                { id: 'theme-11', name: 'Ambiente 11', value: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
                { id: 'theme-12', name: 'Ambiente 12', value: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' },
            ];
            
            function showSlide(slideNumber) {
                // Handle slide content
                for (let i = 1; i <= totalSlides; i++) {
                    const slide = document.getElementById(`slide-${i}`);
                    const dot = document.getElementById(`dot-${i}`);
                    const isActive = (i === slideNumber);
                    slide.classList.toggle('active', isActive);
                    dot.style.width = isActive ? '24px' : '6px';
                    dot.style.backgroundColor = isActive ? 'white' : 'rgba(255, 255, 255, 0.3)';
                    if (isActive) {
                        const fadeElements = slide.querySelectorAll('.fade-in-up, .animate-entry');
                        fadeElements.forEach(el => {
                            el.style.animation = 'none';
                            el.offsetHeight;
                            el.style.animation = null;
                        });
                    }
                }
                
                // Handle slide backgrounds
                document.querySelectorAll('.slide-background').forEach(bg => bg.classList.remove('active'));
                if (slideNumber !== 3) {
                    const slideBg = document.getElementById(`slide-bg-${slideNumber}`);
                    if (slideBg) slideBg.classList.add('active');
                }
                
                const themeBgContainer = document.getElementById('background-container');
                themeBgContainer.classList.toggle('hidden', slideNumber !== 3);
                if (slideNumber === 3 && !themesInitialized) {
                    initThemeSelector();
                    themesInitialized = true;
                }

                buttonContent.innerHTML = (slideNumber === totalSlides) 
                    ? 'Começar <i data-lucide="check" class="ml-2 h-5 w-5"></i>'
                    : 'Próximo <i data-lucide="arrow-right" class="ml-2 h-5 w-5"></i>';
                lucide.createIcons({ strokeWidth: 1.75 });
            }

            nextBtn.addEventListener('click', () => {
                if (currentSlide < totalSlides) {
                    currentSlide++;
                    showSlide(currentSlide);
                } else {
                    console.log(`Onboarding concluído! Tema selecionado: ${selectedThemeId}`);
                }
            });

            skipBtn.addEventListener('click', () => console.log("Navegar para a próxima página (pulou)"));
            
            for (let i = 1; i <= totalSlides; i++) {
                document.getElementById(`dot-${i}`).addEventListener('click', () => {
                    if (currentSlide !== i) {
                        currentSlide = i;
                        showSlide(currentSlide);
                    }
                });
            }

            function initThemeSelector() {
                const themesTrack = document.getElementById('themes-track');
                themes.forEach((theme, index) => {
                    const bgLayer = document.createElement('div');
                    bgLayer.id = `bg-${theme.id}`;
                    bgLayer.className = 'background-layer';
                    bgLayer.style.backgroundImage = `url(${theme.value})`;
                    document.getElementById('background-container').appendChild(bgLayer);

                    const listItem = document.createElement('li');
                    listItem.className = 'flex-shrink-0 snap-center relative flex justify-center p-4';
                    const sphereButton = document.createElement('button');
                    sphereButton.id = `theme-${theme.id}`;
                    sphereButton.className = 'theme-sphere';
                    sphereButton.dataset.themeId = theme.id;
                    sphereButton.style.setProperty('--sphere-bg', `url(${theme.value})`);
                    sphereButton.innerHTML = `<div class="check-icon"><i data-lucide="check" class="w-8 h-8 text-white"></i></div>`;

                    if (index === 0) {
                        const tag = document.createElement('div');
                        tag.className = 'liquid-glass-tag absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10';
                        tag.textContent = 'Padrão Trendly';
                        listItem.appendChild(tag);
                    }
                    
                    listItem.prepend(sphereButton);
                    themesTrack.appendChild(listItem);
                });
                
                updateBackground(selectedThemeId);
                document.getElementById(`theme-${selectedThemeId}`).classList.add('is-selected', 'is-in-view');
                setupThemeEventListeners();
                if (window.innerWidth < 1024) {
                    setTimeout(() => document.getElementById(`theme-${selectedThemeId}`).parentElement.scrollIntoView({ behavior: 'auto', inline: 'center' }), 100);
                    setupIntersectionObserver();
                }
                lucide.createIcons({ strokeWidth: 1.5 });
            }

            function updateBackground(themeId) {
                document.querySelectorAll('.background-layer').forEach(layer => {
                    layer.classList.toggle('is-active', layer.id === `bg-${themeId}`);
                });
            }

            function setupThemeEventListeners() {
                document.querySelectorAll('.theme-sphere').forEach(sphere => {
                    sphere.addEventListener('click', () => {
                        selectedThemeId = sphere.dataset.themeId;
                        document.querySelectorAll('.theme-sphere').forEach(s => s.classList.remove('is-selected'));
                        sphere.classList.add('is-selected');
                        updateBackground(selectedThemeId);
                        if (window.innerWidth < 1024) {
                            sphere.parentElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                        }
                    });
                });
            }

            function setupIntersectionObserver() {
                const spheres = document.querySelectorAll('.theme-sphere');
                const options = { root: document.getElementById('themes-gallery'), rootMargin: '0px', threshold: 0.8 };
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const currentSphere = entry.target;
                            selectedThemeId = currentSphere.dataset.themeId;
                            spheres.forEach(s => s.classList.remove('is-in-view', 'is-selected'));
                            currentSphere.classList.add('is-in-view', 'is-selected');
                            updateBackground(selectedThemeId);
                        }
                    });
                }, options);
                spheres.forEach(sphere => observer.observe(sphere));
            }

            showSlide(1);
        });
    </script>

</body></html>