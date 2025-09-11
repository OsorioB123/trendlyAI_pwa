HEADER PRIMÁRIA
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI - Navigation &amp; Upgrade</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<style>
:root {
--brand-pink: #bf4ea1;
--brand-mint: #9df4e9;
--brand-gold: #2fd159;
--grad-primary: linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-mint) 100%);
}
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
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.liquid-glass-pill:hover {
background-color: rgba(255, 255, 255, 0.15);
transform: scale(1.05);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.dropdown-menu {
opacity: 0;
transform: translateY(-10px) scale(0.95);
pointer-events: none;
transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
transform-origin: top right;
}
.dropdown-menu.show {
opacity: 1;
transform: translateY(0) scale(1);
pointer-events: auto;
}
.liquid-glass-opaque {
backdrop-filter: blur(24px);
background-color: rgba(30, 30, 40, 0.85);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
border-radius: 16px;
}
.menu-item:hover, .notification-item:hover {
background-color: rgba(255, 255, 255, 0.1);
transform: translateX(4px);
transition: all 0.2s ease;
}
.credits-progress-bar {
background-color: rgba(255, 255, 255, 0.1);
border-radius: 9999px;
overflow: hidden;
position: relative;
}
.credits-progress-fill {
height: 100%;
background: #FFFFFF;
border-radius: 9999px;
position: relative;
overflow: hidden;
box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.4);
transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.credit-tooltip {
opacity: 0;
transform: translateY(5px) scale(0.98);
pointer-events: none;
transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
transform-origin: bottom right;
}
.credit-tooltip.show {
opacity: 1;
transform: translateY(0) scale(1);
pointer-events: auto;
}
.plan-card {
border-radius: 16px;
padding: 24px;
cursor: pointer;
position: relative;
overflow: hidden;
transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
background-color: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.1);
}
.plan-card.recommended {
background: rgba(30, 30, 38, 0.5);
border: 1px solid rgba(255, 255, 255, 0.15);
transform: scale(1.05);
}
.plan-card:hover {
transform: scale(1.02);
}
.plan-card.recommended:hover {
transform: scale(1.07);
}
.cta-button {
width: 100%;
padding: 12px 0;
border-radius: 12px;
font-weight: 600;
transition: all 0.3s ease;
position: relative;
overflow: hidden;
}
.cta-primary {
background-color: #FFFFFF;
color: #111;
box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
}
.cta-primary:hover {
transform: scale(1.03);
box-shadow: 0 10px 40px rgba(255, 255, 255, 0.25);
}
.cta-secondary {
background: transparent;
border: 1px solid rgba(255, 255, 255, 0.25);
color: white;
}
.cta-secondary:hover {
background-color: var(--brand-mint);
border-color: var(--brand-mint);
color: #111;
}
.recommendation-tag {
font-size: 11px;
font-weight: 600;
padding: 4px 10px;
border-radius: 9999px;
background-color: rgba(191, 78, 161, 0.2);
color: #e387c5;
border: 1px solid rgba(191, 78, 161, 0.3);
}
.invitation-fade {
animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.invitation-fade:nth-child(1) { animation-delay: 0ms; }
.invitation-fade:nth-child(2) { animation-delay: 100ms; }
.invitation-fade:nth-child(3) { animation-delay: 200ms; }
.invitation-fade:nth-child(4) { animation-delay: 300ms; }
@keyframes fadeInUp {
from {
opacity: 0;
transform: translateY(20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
.header-fade {
animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideDown {
from {
opacity: 0;
transform: translateY(-20px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
.notification-dot {
animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
0%, 100% {
opacity: 0.75;
transform: scale(1);
}
50% {
opacity: 1;
transform: scale(1.1);
}
}
</style></head>
<body class="min-h-screen bg-gray-950 font-['Inter'] text-white overflow-x-hidden">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-30 pt-3 pr-4 pb-3 pl-4 header-fade">
        <div class="max-w-7xl flex sticky top-0 z-40 mr-auto ml-auto items-center justify-between liquid-glass rounded-full px-5 py-3">
            <!-- Logo -->
            <a href="#" aria-label="Voltar para a Home" class="flex items-center hover:opacity-80 transition-opacity">
                <!-- ATUALIZADO: Placeholder para o logo -->
                <img src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&amp;q=80" alt="TrendlyAI Logo" class="h-8 w-auto object-cover">
            </a>
            
            <div class="flex items-center gap-2">
                <!-- Notifications -->
                <div class="relative">
                    <button id="bell-button" class="relative w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="bell" class="lucide lucide-bell w-5 h-5"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>
                        <span class="absolute top-2 right-2 flex h-2 w-2">
                            <span class="notification-dot absolute inline-flex h-full w-full rounded-full bg-[var(--brand-gold)] opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-gold)]"></span>
                        </span>
                    </button>
                    
                    <div id="notifications-dropdown" class="dropdown-menu liquid-glass-opaque absolute top-full right-0 mt-2 p-2 w-80 z-50">
                        <div class="p-2 flex justify-between items-center">
                            <h4 class="text-white font-semibold text-sm">Notificações</h4>
                            <a href="#" class="text-xs text-white/60 hover:text-white transition-colors">Marcar como lidas</a>
                        </div>
                        <div class="space-y-1">
                            <a href="#" class="notification-item block p-3 rounded-lg">
                                <p class="text-sm text-white">Nova trilha de Storytelling disponível!</p>
                                <span class="text-xs text-white/60">há 5 min</span>
                            </a>
                            <a href="#" class="notification-item block p-3 rounded-lg">
                                <p class="text-sm text-white">Seu projeto "Roteiro para Reels" foi salvo.</p>
                                <span class="text-xs text-white/60">há 2 horas</span>
                            </a>
                        </div>
                        <div class="border-t border-white/10 mt-2 pt-2">
                            <a href="#" class="block text-center text-xs text-white/70 hover:text-white transition-colors p-2">Ver todas as notificações</a>
                        </div>
                    </div>
                </div>
                
                <!-- Profile -->
                <div class="relative">
                    <button id="profile-button" class="w-11 h-11 rounded-full flex items-center justify-center transition-all ring-2 ring-transparent hover:ring-white/30 liquid-glass-pill">
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
                                <p class="text-sm text-white/70 flex items-center gap-1.5">✨ <span>Explorador</span></p>
                            </div>
                        </div>
                        
                        <a href="#" class="block text-center w-full px-4 py-2.5 mb-5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 liquid-glass-pill">Meu Perfil</a>
                        
                        <div class="mb-2">
                            <div class="flex justify-between items-center mb-1.5">
                                <h6 class="text-xs font-medium text-white/80">Créditos Mensais da Salina</h6>
                                <div class="relative">
                                    <button id="credits-info-btn" class="text-white/60 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="info" class="lucide lucide-info w-3.5 h-3.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                                    </button>
                                    <div id="credits-tooltip" class="credit-tooltip liquid-glass absolute bottom-full right-0 mb-2 p-3 w-64">
                                        <p class="text-xs text-white/90">Seus créditos são usados para conversas com a Salina e se renovam a cada 24h. Precisa de mais? <a href="#" id="upgrade-link" class="font-semibold text-[var(--brand-gold)] hover:underline">Torne-se um Maestro</a> para ter acesso ilimitado.</p>
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
                            <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="gem" class="lucide lucide-gem w-4 h-4 text-white/70"><path d="M10.5 3 8 9l4 13 4-13-2.5-6"></path><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"></path><path d="M2 9h20"></path></svg>
                                <span>Gerenciar Assinatura</span>
                            </a>
                            <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="settings" class="lucide lucide-settings w-4 h-4 text-white/70"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>Configurações da Conta</span>
                            </a>
                            <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="help-circle" class="lucide lucide-help-circle w-4 h-4 text-white/70"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
                                <span>Central de Ajuda</span>
                            </a>
                            <div class="border-t border-white/10 my-2"></div>
                            <a href="#" class="menu-item flex items-center gap-3 p-2.5 text-red-400 hover:text-red-300 text-sm rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="log-out" class="lucide lucide-log-out w-4 h-4"><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path></svg>
                                <span>Sair da Conta</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="pt-20 p-6 min-h-screen flex items-center justify-center">
        
    </main>

    <!-- Upgrade Modal -->
    <div id="invitation-container" class="fixed inset-0 z-50 flex items-end opacity-0 pointer-events-none transition-opacity duration-500">
        <div id="invitation-backdrop" class="absolute inset-0 bg-black/30 opacity-0 transition-all duration-500"></div>
        <div id="invitation-sheet" class="liquid-glass relative w-full h-[85vh] md:h-[70vh] rounded-t-2xl flex flex-col transform translate-y-full transition-transform duration-600 ease-out">
            <div class="absolute top-0 left-0 right-0 flex justify-center pt-3 md:hidden">
                <div class="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>
            <button id="close-invitation-btn" class="hidden md:flex absolute top-4 right-4 w-10 h-10 items-center justify-center liquid-glass-pill rounded-full z-20 hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="x" class="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
            <div class="flex-grow pt-10 p-6 md:p-10 overflow-y-auto flex flex-col justify-start md:justify-center">
                <div class="text-center mb-8 md:mb-10 relative z-10">
                    <h2 class="text-3xl md:text-5xl font-bold tracking-tight invitation-fade">Torne-se o Maestro.</h2>
                    <p class="text-white/70 mt-3 max-w-2xl mx-auto invitation-fade">Acesso ilimitado a todas as estratégias, instrumentos e ao poder de orquestração do nosso Estúdio.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mx-auto mb-8 md:mb-10 relative z-10">
                    <div id="plan-anual" class="plan-card recommended invitation-fade">
                        <div class="relative z-10">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-semibold text-lg text-white">Plano Anual</h3>
                                <span class="recommendation-tag whitespace-nowrap">✨ Nossa Recomendação</span>
                            </div>
                            <div class="mb-6">
                                <span class="text-4xl md:text-5xl font-bold text-white tracking-tight">R$149</span>
                                <span class="text-white/70">/mês</span>
                                <p class="text-xs font-normal text-white/60 mt-2">Cobrado R$1.788 anualmente. Uma economia de 50%.</p>
                            </div>
                            <button class="cta-button cta-primary">Entrar para o Estúdio (Anual)</button>
                        </div>
                    </div>
                    <div id="plan-trimestral" class="plan-card invitation-fade">
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
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/70 invitation-fade relative z-10">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="shield-check" class="lucide lucide-shield-check w-4 h-4 text-[var(--brand-mint)]"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        <span>Garantia de 21 Dias</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="lock" class="lucide lucide-lock w-4 h-4"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span>Compra 100% Segura</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="refresh-cw" class="lucide lucide-refresh-cw w-4 h-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                        <span>Cancele a Qualquer Momento</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            
            function setupHeaderDropdowns() {
                const bellButton = document.getElementById('bell-button');
                const notificationsDropdown = document.getElementById('notifications-dropdown');
                const profileButton = document.getElementById('profile-button');
                const profileDropdown = document.getElementById('profile-dropdown');
                const creditsInfoBtn = document.getElementById('credits-info-btn');
                const creditsTooltip = document.getElementById('credits-tooltip');
                
                const closeAllMenus = () => {
                    notificationsDropdown.classList.remove('show');
                    profileDropdown.classList.remove('show');
                    creditsTooltip.classList.remove('show');
                };
                
                bellButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isAlreadyOpen = notificationsDropdown.classList.contains('show');
                    closeAllMenus();
                    if (!isAlreadyOpen) notificationsDropdown.classList.add('show');
                });
                
                profileButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isAlreadyOpen = profileDropdown.classList.contains('show');
                    closeAllMenus();
                    if (!isAlreadyOpen) profileDropdown.classList.add('show');
                });
                
                creditsInfoBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    creditsTooltip.classList.toggle('show');
                });
                
                document.addEventListener('click', (e) => {
                    const isInsideDropdown = e.target.closest('.dropdown-menu') || 
                                           e.target.closest('#bell-button') || 
                                           e.target.closest('#profile-button') ||
                                           e.target.closest('#credits-info-btn');
                    if (!isInsideDropdown) {
                        closeAllMenus();
                    }
                });
            }

            function setupUpgradePopup() {
                const invitationContainer = document.getElementById('invitation-container');
                const invitationBackdrop = document.getElementById('invitation-backdrop');
                const invitationSheet = document.getElementById('invitation-sheet');
                const upgradeLink = document.getElementById('upgrade-link');
                const demoUpgradeBtn = document.getElementById('demo-upgrade-btn');
                const closeBtn = document.getElementById('close-invitation-btn');
                const planCards = document.querySelectorAll('.plan-card');
                
                const openInvitation = () => {
                    document.body.style.overflow = 'hidden';
                    invitationContainer.classList.remove('opacity-0', 'pointer-events-none');
                    invitationContainer.classList.add('opacity-100');
                    
                    setTimeout(() => {
                        invitationBackdrop.classList.add('opacity-100');
                        invitationSheet.classList.remove('translate-y-full');
                        invitationSheet.classList.add('translate-y-0');
                    }, 50);
                };
                
                const closeInvitation = () => {
                    document.body.style.overflow = '';
                    invitationBackdrop.classList.remove('opacity-100');
                    invitationSheet.classList.remove('translate-y-0');
                    invitationSheet.classList.add('translate-y-full');
                    
                    setTimeout(() => {
                        invitationContainer.classList.add('opacity-0', 'pointer-events-none');
                        invitationContainer.classList.remove('opacity-100');
                    }, 600);
                };
                
                upgradeLink?.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openInvitation();
                });
                
                demoUpgradeBtn?.addEventListener('click', (e) => {
                    e.preventDefault();
                    openInvitation();
                });
                
                closeBtn?.addEventListener('click', closeInvitation);
                invitationBackdrop?.addEventListener('click', closeInvitation);
                
                planCards.forEach(card => {
                    card.addEventListener('click', () => {
                        planCards.forEach(c => c.classList.remove('recommended'));
                        card.classList.add('recommended');
                    });
                });
            }
            
            setupHeaderDropdowns();
            setupUpgradePopup();
        });
    </script>

</body></html>