<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI - Configurações</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
<style>
:root {
--brand-red: #ff4136;
--golden: #FFFFFF;
}
body {
-webkit-tap-highlight-color: transparent;
transition: background-image 0.5s ease-in-out;
background-size: cover;
background-position: center;
background-attachment: fixed;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
/* --- ESTILOS GERAIS --- */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.liquid-glass { backdrop-filter: blur(20px); background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28); border-radius: 20px; }
.settings-tabs-list { position: relative; display: inline-flex; padding: 4px; border-radius: 12px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); }
.settings-tab-trigger { position: relative; z-index: 2; border: none; background: none; color: #a1a1aa; padding: 10px 20px; font-size: 0.875rem; font-weight: 500; border-radius: 8px; cursor: pointer; transition: color 0.3s ease, padding 0.3s ease; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
.settings-tab-trigger.is-active { color: white; }
#active-tab-indicator { position: absolute; z-index: 1; top: 4px; left: 0; height: calc(100% - 8px); border-radius: 8px; background-color: rgba(255, 255, 255, 0.1); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.settings-panel { display: none; }
.settings-panel.is-active { display: block; animation: panel-enter 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes panel-enter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
#toast-notification { position: fixed; bottom: -100px; left: 50%; transform: translateX(-50%); z-index: 200; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); backdrop-filter: blur(16px); background-color: rgba(30, 30, 40, 0.85); border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 12px 20px; color: white; }
#toast-notification.show { bottom: 24px; }
.liquid-glass-pill {
backdrop-filter: blur(20px);
background-color: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
border-radius: 9999px;
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.liquid-glass-pill:hover {
background-color: rgba(255, 255, 255, 0.15);
transform: scale(1.05);
}
.info-group {
padding: 1rem;
border-radius: 0.5rem;
transition: background-color 0.2s ease;
}
.info-group:hover {
background-color: rgba(255, 255, 255, 0.05);
}
.danger-zone {
border: 1px solid rgba(255, 65, 54, 0.4);
background-color: rgba(255, 65, 54, 0.05);
}
#profile-picture-upload .overlay {
background-color: rgba(0,0,0,0.5);
border-radius: 50%;
opacity: 0;
transition: opacity 0.2s ease;
}
#profile-picture-upload:hover .overlay {
opacity: 1;
}
@media (max-width: 639px) {
.settings-tabs-list {
display: grid;
grid-template-columns: repeat(3, 1fr);
width: 100%;
}
.settings-tab-trigger {
padding: 10px;
justify-content: center;
gap: 0;
}
.settings-tab-trigger .tab-label {
display: none;
}
}
/* --- ESTILOS DO SELETOR DE AMBIENTE --- */
.theme-sphere {
position: relative;
width: 80px;
height: 80px;
border-radius: 9999px;
cursor: pointer;
border: 2px solid transparent;
overflow: hidden;
-webkit-tap-highlight-color: transparent;
transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
border-color 0.3s ease;
}
.theme-sphere:hover {
transform: scale(1.1);
}
.theme-sphere::before {
content: '';
position: absolute;
inset: -5px;
background-image: var(--bg-image);
background-size: cover;
background-position: center;
z-index: -1;
}
.theme-sphere::after {
content: '';
position: absolute;
inset: 0;
border-radius: inherit;
background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%);
box-shadow: inset 0 0 20px 3px rgba(0,0,0,0.3);
mix-blend-mode: overlay;
}
@media (max-width: 1023px) {
#studio-environment-track {
scroll-snap-type: x mandatory;
padding: 0 calc(50% - 40px);
}
.theme-sphere {
transform: scale(0.9);
opacity: 0.7;
}
.theme-sphere.is-in-view {
transform: scale(1.1);
opacity: 1;
}
}
.theme-sphere.is-selected {
border-color: white;
transform: scale(1.1);
}
.check-icon {
position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
background-color: rgba(0, 0, 0, 0.4); border-radius: 9999px;
opacity: 0; transform: scale(0.8);
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
pointer-events: none; z-index: 2;
}
.theme-sphere.is-selected .check-icon { opacity: 1; transform: scale(1); }
@keyframes fade-in {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
animation: fade-in 0.6s ease-out;
}
/* --- ESTILOS REFINADOS PARA EDIÇÃO DE PERFIL --- */
.profile-field {
position: relative;
padding: 12px 16px;
border-radius: 8px;
transition: background-color 0.2s ease;
cursor: pointer;
min-height: 60px;
display: flex;
flex-direction: column;
justify-content: center;
}
.profile-field:hover {
background-color: rgba(255, 255, 255, 0.04);
}
.profile-text {
position: relative;
display: flex;
justify-content: space-between;
align-items: center;
width: 100%;
}
.profile-field-content {
position: relative;
flex: 1;
cursor: pointer;
padding: 4px 0;
}
.profile-field-text {
color: white;
font-size: 1rem;
line-height: 1.5;
transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
position: relative;
}
.profile-field.editing .profile-field-content {
cursor: text;
}
.profile-field.editing .profile-field-text {
outline: none;
caret-color: var(--golden);
position: relative;
}
.profile-field.editing .profile-field-content::after {
content: '';
position: absolute;
bottom: 0;
left: 0;
right: 0;
height: 2px;
background: linear-gradient(90deg, var(--golden) 0%, rgba(255, 255, 255, 0.6) 100%);
border-radius: 1px;
animation: golden-border-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes golden-border-appear {
from {
transform: scaleX(0);
opacity: 0;
}
to {
transform: scaleX(1);
opacity: 1;
}
}
.edit-icon {
opacity: 0;
transition: opacity 0.15s ease;
pointer-events: none;
color: rgba(255, 255, 255, 0.6);
cursor: pointer;
padding: 4px;
width: 16px;
height: 16px;
}
.profile-field:hover .edit-icon {
opacity: 1;
pointer-events: auto;
}
@keyframes white-pulse {
0% {
color: white;
}
50% {
color: #ffffff;
text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}
100% {
color: white;
text-shadow: none;
}
}
.profile-field-text.saved {
animation: white-pulse 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
/* --- ESTILOS PARA MODAIS DE SEGURANÇA --- */
.modal-backdrop {
position: fixed;
inset: 0;
background-color: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(8px);
z-index: 100;
display: flex;
align-items: center;
justify-content: center;
padding: 1rem;
opacity: 0;
visibility: hidden;
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-backdrop.show {
opacity: 1;
visibility: visible;
}
.modal {
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.14);
border-radius: 16px;
padding: 2rem;
max-width: 400px;
width: 100%;
transform: scale(0.9) translateY(20px);
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-backdrop.show .modal {
transform: scale(1) translateY(0);
}
.modal-input {
width: 100%;
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.14);
border-radius: 8px;
padding: 12px;
color: white;
font-size: 0.875rem;
margin-bottom: 1rem;
transition: border-color 0.2s ease;
}
.modal-input:focus {
outline: none;
border-color: rgba(255, 255, 255, 0.3);
}
.modal-input::placeholder {
color: rgba(255, 255, 255, 0.5);
}
.btn-primary {
width: 100%;
background-color: white;
color: black;
border: none;
border-radius: 8px;
padding: 12px 16px;
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
margin-bottom: 0.75rem;
}
.btn-primary:hover:not(:disabled) {
background-color: rgba(255, 255, 255, 0.9);
}
.btn-primary:disabled {
opacity: 0.5;
cursor: not-allowed;
}
.btn-secondary {
width: 100%;
background: none;
border: none;
color: rgba(255, 255, 255, 0.7);
padding: 8px;
cursor: pointer;
text-decoration: underline;
font-size: 0.875rem;
transition: color 0.2s ease;
}
.btn-secondary:hover {
color: white;
}
.btn-danger {
width: 100%;
background-color: #ef4444;
color: white;
border: none;
border-radius: 8px;
padding: 12px 16px;
font-weight: 600;
cursor: pointer;
transition: all 0.2s ease;
margin-bottom: 0.75rem;
}
.btn-danger:hover:not(:disabled) {
background-color: #dc2626;
}
.btn-danger:disabled {
opacity: 0.5;
cursor: not-allowed;
}
.security-field {
padding: 1rem;
border-radius: 0.5rem;
transition: background-color 0.2s ease;
display: flex;
justify-content: space-between;
align-items: center;
flex-wrap: wrap;
gap: 0.5rem 1rem;
}
.security-field:hover {
background-color: rgba(255, 255, 255, 0.05);
}
.change-btn {
background: none;
border: 1px solid rgba(255, 255, 255, 0.2);
color: rgba(255, 255, 255, 0.8);
padding: 6px 16px;
border-radius: 6px;
font-size: 0.875rem;
cursor: pointer;
transition: all 0.2s ease;
flex-shrink: 0;
}
.change-btn:hover {
background-color: rgba(255, 255, 255, 0.1);
color: white;
}
@media (max-width: 370px) {
.change-btn {
width: 100%;
text-align: center;
}
}
</style></head>
<body class="min-h-screen bg-gray-950 text-white overflow-x-hidden antialiased selection:bg-white/10 selection:text-white">
    
    <div style="height: 80px;"></div>

    <main class="w-full mx-auto pb-32">
        <div id="settings-container" class="max-w-4xl relative mr-auto ml-auto px-4">
            <header class="mb-10 mt-12 opacity-0 animate-fade-in" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
                <h2 class="text-3xl font-semibold text-white tracking-tight" style="font-family:'Geist',sans-serif;">Configurações</h2>
                <p class="text-white/70 mt-2">Gerencie seu perfil, conta e preferências.</p>
            </header>
            
            <div class="w-full overflow-x-auto hide-scrollbar mb-10 opacity-0 animate-fade-in" style="animation-delay: 0.4s; animation-fill-mode: forwards;">
                <div id="settings-tabs" class="settings-tabs-list">
                    <div id="active-tab-indicator"></div>
                    <button class="settings-tab-trigger is-active hover:text-white" data-tab="profile">
                        <i data-lucide="user-circle-2" class="w-4 h-4" style="stroke-width: 1.5;"></i>
                        <span class="tab-label">Perfil</span>
                    </button>
                    <button class="settings-tab-trigger hover:text-white" data-tab="security">
                        <i data-lucide="lock" class="w-4 h-4" style="stroke-width: 1.5;"></i>
                        <span class="tab-label">Segurança</span>
                    </button>
                    <button class="settings-tab-trigger hover:text-white" data-tab="notifications">
                        <i data-lucide="bell" class="w-4 h-4" style="stroke-width: 1.5;"></i>
                        <span class="tab-label">Notificações</span>
                    </button>
                </div>
            </div>

            <div class="relative space-y-6">
                <section id="profile-panel" class="settings-panel is-active opacity-0 animate-fade-in" style="animation-delay: 0.6s; animation-fill-mode: forwards;">
                    <div class="liquid-glass p-8 md:p-10">
                        <div class="grid grid-cols-1 gap-y-10">
                            <div class="flex items-center gap-6">
                                <label id="profile-picture-upload" class="group relative flex-shrink-0 cursor-pointer">
                                    <input type="file" id="avatar-input" class="hidden" accept="image/png, image/jpeg, image/gif">
                                    <img id="avatar-preview" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&amp;q=80" alt="Avatar" class="w-20 h-20 rounded-full object-cover transition-all duration-300 ring-1 ring-white/10 group-hover:ring-white/20">
                                    <div class="overlay absolute inset-0 flex items-center justify-center">
                                        <i data-lucide="camera" class="w-6 h-6 text-white" style="stroke-width: 1.5;"></i>
                                    </div>
                                </label>
                                <div>
                                    <h3 class="text-lg font-semibold text-white">Sua Foto de Perfil</h3>
                                    <p class="text-sm text-white/70">Clique na imagem para alterar.</p>
                                </div>
                            </div>
                            
                            <div class="space-y-6">
                                <div class="profile-field" data-field="name">
                                    <label class="block text-sm font-medium text-white/70 mb-2">Nome</label>
                                    <div class="profile-text">
                                        <div class="profile-field-content">
                                            <div class="profile-field-text" contenteditable="false">Sofia</div>
                                        </div>
                                        <i data-lucide="edit-2" class="edit-icon" style="stroke-width: 1.5;"></i>
                                    </div>
                                </div>
                                
                                <div class="profile-field" data-field="username">
                                    <label class="block text-sm font-medium text-white/70 mb-2">Nome de Usuário</label>
                                    <div class="profile-text">
                                        <div class="profile-field-content">
                                            <div class="profile-field-text" contenteditable="false">@sofia</div>
                                        </div>
                                        <i data-lucide="edit-2" class="edit-icon" style="stroke-width: 1.5;"></i>
                                    </div>
                                </div>
                                
                                <div class="profile-field" data-field="bio">
                                    <label class="block text-sm font-medium text-white/70 mb-2">Bio</label>
                                    <div class="profile-text">
                                        <div class="profile-field-content">
                                            <div class="profile-field-text" contenteditable="false">Explorando o futuro da criação de conteúdo com IA.</div>
                                        </div>
                                        <i data-lucide="edit-2" class="edit-icon" style="stroke-width: 1.5;"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-white/10 pt-10">
                                <div class="mb-6">
                                     <h3 class="text-lg font-semibold text-white" style="font-family:'Geist',sans-serif;">Ambiente do Estúdio</h3>
                                     <p class="mt-1 text-sm text-white/70">Escolha o gradiente que define seu espaço de trabalho.</p>
                                </div>
                                
                                <div id="studio-environment-gallery" class="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible mt-4 py-4">
                                     <ol id="studio-environment-track" class="flex items-center gap-4 py-4
                                                lg:grid lg:grid-cols-6 lg:gap-x-4 lg:gap-y-6 lg:p-0">
                                     </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="security-panel" class="settings-panel">
                    <div class="liquid-glass p-8 md:p-10">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-white" style="font-family:'Geist',sans-serif;">Segurança da Conta</h3>
                            <div class="space-y-4">
                                <div class="security-field">
                                    <div class="flex-1 min-w-0">
                                        <label class="block text-sm font-medium text-white/70 mb-1">Email</label>
                                        <span class="text-white break-all">sofia@example.com</span>
                                    </div>
                                    <button class="change-btn" data-action="change-email">Alterar</button>
                                </div>
                                
                                <div class="security-field">
                                    <div class="flex-1 min-w-0">
                                        <label class="block text-sm font-medium text-white/70 mb-1">Senha</label>
                                        <span class="text-white">••••••••</span>
                                    </div>
                                    <button class="change-btn" data-action="change-password">Alterar</button>
                                </div>
                                
                                <div class="security-field">
                                    <div class="flex-1 min-w-0">
                                        <label class="block text-sm font-medium text-white/70 mb-1">Autenticação de Dois Fatores</label>
                                        <span class="text-white/80 text-sm">Adicione uma camada extra de segurança</span>
                                    </div>
                                    <button class="change-btn" data-action="setup-2fa">Configurar</button>
                                </div>
                            </div>
                            
                            <div class="border-t border-white/10 pt-6">
                                <div class="danger-zone p-6 rounded-lg">
                                    <h4 class="text-white font-semibold mb-2">Zona Perigosa</h4>
                                    <p class="text-white/70 text-sm mb-4">Essas ações são irreversíveis. Proceda com cuidado.</p>
                                    <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors" data-action="delete-account">
                                        Excluir Conta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="notifications-panel" class="settings-panel">
                    <div class="liquid-glass p-8 md:p-10">
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-white" style="font-family:'Geist',sans-serif;">Preferências de Notificação</h3>
                            <div class="space-y-6">
                                <div class="flex items-center justify-between info-group">
                                    <div class="flex-1 mr-4">
                                        <p class="text-white font-medium">Notificações por email</p>
                                        <p class="text-sm text-white/70">Receba atualizações importantes por email</p>
                                    </div>
                                    <div class="w-11 h-6 bg-white/20 rounded-full p-1 cursor-pointer transition-colors hover:bg-white/30 flex-shrink-0">
                                        <div class="w-4 h-4 bg-white rounded-full transition-transform"></div>
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between info-group">
                                    <div class="flex-1 mr-4">
                                        <p class="text-white font-medium">Notificações push</p>
                                        <p class="text-sm text-white/70">Receba notificações no navegador</p>
                                    </div>
                                    <div class="w-11 h-6 bg-white rounded-full p-1 cursor-pointer flex-shrink-0">
                                        <div class="w-4 h-4 bg-gray-900 rounded-full transform translate-x-5 transition-transform"></div>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between info-group">
                                    <div class="flex-1 mr-4">
                                        <p class="text-white font-medium">Relatórios semanais</p>
                                        <p class="text-sm text-white/70">Receba um resumo semanal da sua atividade</p>
                                    </div>
                                    <div class="w-11 h-6 bg-white rounded-full p-1 cursor-pointer flex-shrink-0">
                                        <div class="w-4 h-4 bg-gray-900 rounded-full transform translate-x-5 transition-transform"></div>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between info-group">
                                    <div class="flex-1 mr-4">
                                        <p class="text-white font-medium">Marketing</p>
                                        <p class="text-sm text-white/70">Receba dicas e ofertas especiais</p>
                                    </div>
                                    <div class="w-11 h-6 bg-white/20 rounded-full p-1 cursor-pointer transition-colors hover:bg-white/30 flex-shrink-0">
                                        <div class="w-4 h-4 bg-white rounded-full transition-transform"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </main>
    
    <!-- Modal para alterar email -->
    <div id="change-email-modal" class="modal-backdrop">
        <div class="modal">
            <h3 class="text-xl font-semibold text-white mb-2" style="font-family:'Geist',sans-serif;">Alterar seu Email</h3>
            <p class="text-white/70 text-sm mb-6">Digite sua senha atual e o novo email para confirmar a alteração.</p>
            
            <input type="password" class="modal-input" placeholder="Senha atual" id="email-current-password">
            <input type="email" class="modal-input" placeholder="Novo email" id="new-email">
            
            <button class="btn-primary" id="save-email-btn" disabled="">Salvar Novo Email</button>
            <button class="btn-secondary" onclick="closeModal('change-email-modal')">Cancelar</button>
        </div>
    </div>

    <!-- Modal para alterar senha -->
    <div id="change-password-modal" class="modal-backdrop">
        <div class="modal">
            <h3 class="text-xl font-semibold text-white mb-2" style="font-family:'Geist',sans-serif;">Alterar sua Senha</h3>
            <p class="text-white/70 text-sm mb-6">Digite sua senha atual e escolha uma nova senha segura.</p>
            
            <input type="password" class="modal-input" placeholder="Senha atual" id="password-current">
            <input type="password" class="modal-input" placeholder="Nova senha" id="password-new">
            <input type="password" class="modal-input" placeholder="Confirme a nova senha" id="password-confirm">
            
            <button class="btn-primary" id="save-password-btn" disabled="">Salvar Nova Senha</button>
            <button class="btn-secondary" onclick="closeModal('change-password-modal')">Cancelar</button>
        </div>
    </div>

    <!-- Modal para configurar 2FA -->
    <div id="setup-2fa-modal" class="modal-backdrop">
        <div class="modal">
            <h3 class="text-xl font-semibold text-white mb-2" style="font-family:'Geist',sans-serif;">Configurar Autenticação de Dois Fatores</h3>
            <p class="text-white/70 text-sm mb-6">Configure 2FA para adicionar uma camada extra de segurança à sua conta.</p>
            
            <input type="password" class="modal-input" placeholder="Digite sua senha atual" id="2fa-password">
            
            <button class="btn-primary" id="setup-2fa-btn" disabled="">Configurar 2FA</button>
            <button class="btn-secondary" onclick="closeModal('setup-2fa-modal')">Cancelar</button>
        </div>
    </div>

    <!-- Modal para excluir conta -->
    <div id="delete-account-modal" class="modal-backdrop">
        <div class="modal">
            <h3 class="text-xl font-semibold text-white mb-2" style="font-family:'Geist',sans-serif;">Você tem certeza absoluta?</h3>
            <p class="text-white/70 text-sm mb-6">Esta ação é irreversível. Todos os seus dados, projetos e trilhas serão permanentemente apagados. Não há como voltar atrás.</p>
            
            <input type="text" class="modal-input" placeholder="Digite 'EXCLUIR' para confirmar" id="delete-confirmation">
            
            <button class="btn-danger" id="delete-account-btn" disabled="">Sim, excluir minha conta permanentemente</button>
            <button class="btn-secondary" onclick="closeModal('delete-account-modal')">Cancelar</button>
        </div>
    </div>
    
    <div id="toast-notification" class="flex items-center gap-4">
        <i id="toast-icon" data-lucide="check-circle" class="w-5 h-5 text-green-400" style="stroke-width: 1.5;"></i>
        <span id="toast-message">Configurações salvas.</span>
    </div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons({ strokeWidth: 1.5 });

    // Toast functionality
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    let toastTimeout;

    function showToast(message, type = 'success') {
        if (toastMessage) toastMessage.textContent = message;
        
        if (toastIcon) {
            toastIcon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'info');
            toastIcon.className = `w-5 h-5 ${type === 'success' ? 'text-green-400' : 'text-blue-400'}`;
            lucide.createIcons({
                nodes: [toastIcon],
                attrs: { 'stroke-width': 1.5 }
            });
        }

        if (toast) toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // Tab navigation
    const tabs = document.querySelectorAll('.settings-tab-trigger');
    const panels = document.querySelectorAll('.settings-panel');
    const indicator = document.getElementById('active-tab-indicator');

    function updateActiveTab(activeTab) {
        tabs.forEach(tab => tab.classList.remove('is-active'));
        panels.forEach(panel => panel.classList.remove('is-active'));
        
        activeTab.classList.add('is-active');
        const targetPanel = document.getElementById(`${activeTab.dataset.tab}-panel`);
        if (targetPanel) targetPanel.classList.add('is-active');

        if (!indicator) return;

        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = activeTab.parentElement.getBoundingClientRect();
        
        const scrollLeft = activeTab.parentElement.scrollLeft;
        const position = (tabRect.left - containerRect.left) + scrollLeft;

        const width = tabRect.width;
        
        indicator.style.transform = `translateX(${position}px)`;
        indicator.style.width = `${width}px`;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => updateActiveTab(tab));
    });

    const activeTab = document.querySelector('.settings-tab-trigger.is-active');
    if (activeTab) {
        setTimeout(() => updateActiveTab(activeTab), 100);
    }
    
    // Profile picture upload
    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');

    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                    showToast('Foto de perfil atualizada.', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- SISTEMA REFINADO DE EDIÇÃO DE PERFIL ---
    const profileFields = document.querySelectorAll('.profile-field');
    let currentEditingField = null;

    function startEditing(field) {
        if (currentEditingField && currentEditingField !== field) {
            saveField(currentEditingField, false);
        }

        currentEditingField = field;
        field.classList.add('editing');

        const textElement = field.querySelector('.profile-field-text');
        const originalText = textElement.textContent;

        textElement.contentEditable = true;
        textElement.focus();
        
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(textElement);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        field.dataset.originalText = originalText;

        textElement.addEventListener('keydown', handleKeyDown);
        textElement.addEventListener('blur', handleBlur);
        textElement.addEventListener('input', handleInput);
    }

    function handleKeyDown(e) {
        const field = currentEditingField;
        const textElement = e.target;

        if (e.key === 'Enter') {
            e.preventDefault();
            textElement.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit(field);
        }
    }

    function handleBlur(e) {
        const field = currentEditingField;
        if (field) {
            saveField(field, true);
        }
    }

    function handleInput(e) {
        const text = e.target.textContent;
        if (text.includes('\n')) {
            e.target.textContent = text.replace(/\n/g, '');
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(e.target);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    function saveField(field, showAnimation = true) {
        if (!field) return;

        const textElement = field.querySelector('.profile-field-text');
        let newValue = textElement.textContent.trim();
        const fieldType = field.dataset.field;
        const originalText = field.dataset.originalText;

        if (!newValue) {
            newValue = originalText;
            textElement.textContent = newValue;
        }

        if (fieldType === 'username') {
            if (!newValue.startsWith('@')) {
                newValue = '@' + newValue.replace(/@/g, '');
            }
            textElement.textContent = newValue;
        }

        textElement.contentEditable = false;
        textElement.removeEventListener('keydown', handleKeyDown);
        textElement.removeEventListener('blur', handleBlur);
        textElement.removeEventListener('input', handleInput);
        field.classList.remove('editing');
        currentEditingField = null;

        if (newValue !== originalText && showAnimation) {
            textElement.classList.add('saved');
            setTimeout(() => {
                textElement.classList.remove('saved');
            }, 700);

            const fieldNames = {
                name: 'Nome',
                username: 'Nome de usuário',
                bio: 'Bio'
            };
            showToast(`${fieldNames[fieldType]} atualizado.`, 'success');
        }

        delete field.dataset.originalText;
    }

    function cancelEdit(field) {
        if (!field) return;

        const textElement = field.querySelector('.profile-field-text');
        const originalText = field.dataset.originalText;

        textElement.textContent = originalText;

        textElement.contentEditable = false;
        textElement.removeEventListener('keydown', handleKeyDown);
        textElement.removeEventListener('blur', handleBlur);
        textElement.removeEventListener('input', handleInput);
        field.classList.remove('editing');
        currentEditingField = null;

        delete field.dataset.originalText;
    }

    profileFields.forEach(field => {
        const textElement = field.querySelector('.profile-field-text');
        const editIcon = field.querySelector('.edit-icon');
        const content = field.querySelector('.profile-field-content');

        content.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!field.classList.contains('editing')) {
                startEditing(field);
            }
        });

        editIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!field.classList.contains('editing')) {
                startEditing(field);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (currentEditingField && !currentEditingField.contains(e.target)) {
            const textElement = currentEditingField.querySelector('.profile-field-text');
            if (textElement) {
                textElement.blur();
            }
        }
    });

    // Security modal functions
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            const firstInput = modal.querySelector('.modal-input');
            if (firstInput) firstInput.focus();
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.querySelectorAll('.modal-input').forEach(input => input.value = '');
            modal.querySelectorAll('.btn-primary, .btn-danger').forEach(btn => btn.disabled = true);
        }
    };

    document.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action) {
            switch (action) {
                case 'change-email': openModal('change-email-modal'); break;
                case 'change-password': openModal('change-password-modal'); break;
                case 'setup-2fa': openModal('setup-2fa-modal'); break;
                case 'delete-account': openModal('delete-account-modal'); break;
            }
        }
    });

    // Modal input validation
    function validateEmailModal() {
        const currentPassword = document.getElementById('email-current-password').value;
        const newEmail = document.getElementById('new-email').value;
        const saveBtn = document.getElementById('save-email-btn');
        saveBtn.disabled = !(currentPassword.length > 0 && newEmail.includes('@') && newEmail.length > 5);
    }
    function validatePasswordModal() {
        const current = document.getElementById('password-current').value;
        const newPass = document.getElementById('password-new').value;
        const confirm = document.getElementById('password-confirm').value;
        const saveBtn = document.getElementById('save-password-btn');
        saveBtn.disabled = !(current.length > 0 && newPass.length >= 6 && newPass === confirm);
    }
    function validate2FAModal() {
        document.getElementById('setup-2fa-btn').disabled = document.getElementById('2fa-password').value.length === 0;
    }
    function validateDeleteModal() {
        document.getElementById('delete-account-btn').disabled = document.getElementById('delete-confirmation').value !== 'EXCLUIR';
    }

    document.getElementById('email-current-password').addEventListener('input', validateEmailModal);
    document.getElementById('new-email').addEventListener('input', validateEmailModal);
    document.getElementById('password-current').addEventListener('input', validatePasswordModal);
    document.getElementById('password-new').addEventListener('input', validatePasswordModal);
    document.getElementById('password-confirm').addEventListener('input', validatePasswordModal);
    document.getElementById('2fa-password').addEventListener('input', validate2FAModal);
    document.getElementById('delete-confirmation').addEventListener('input', validateDeleteModal);

    // Save handlers
    document.getElementById('save-email-btn').addEventListener('click', () => { closeModal('change-email-modal'); showToast('Email alterado com sucesso.', 'success'); });
    document.getElementById('save-password-btn').addEventListener('click', () => { closeModal('change-password-modal'); showToast('Sua senha foi alterada com sucesso.', 'success'); });
    document.getElementById('setup-2fa-btn').addEventListener('click', () => { closeModal('setup-2fa-modal'); showToast('Autenticação de dois fatores configurada.', 'success'); });
    document.getElementById('delete-account-btn').addEventListener('click', () => { closeModal('delete-account-modal'); showToast('Conta excluída permanentemente.', 'success'); });
    
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => { backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(backdrop.id); }); });

    // Toggle switches
    document.querySelectorAll('.w-11.h-6').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const slider = this.querySelector('div');
            const isOn = slider.classList.contains('translate-x-5');
            
            if (isOn) {
                this.classList.remove('bg-white');
                this.classList.add('bg-white/20');
                slider.classList.remove('translate-x-5', 'bg-gray-900');
                slider.classList.add('bg-white');
            } else {
                this.classList.remove('bg-white/20');
                this.classList.add('bg-white');
                slider.classList.remove('bg-white');
                slider.classList.add('translate-x-5', 'bg-gray-900');
            }
            showToast('Configuração atualizada.', 'success');
        });
    });

    // --- LÓGICA DO AMBIENTE DO ESTÚDIO ---
    (() => {
        const galleryContainer = document.getElementById('studio-environment-gallery');
        if (!galleryContainer) return;

        const themesTrack = document.getElementById('studio-environment-track');
        const auraImage = document.getElementById('aura-image');
        
        const themes = [
            { id: 'default', value: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
            { id: 'theme-2', value: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
            { id: 'theme-3', value: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
            { id: 'theme-4', value: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
            { id: 'theme-5', value: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
            { id: 'theme-6', value: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
            { id: 'theme-7', value: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
            { id: 'theme-8', value: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
            { id: 'theme-9', value: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
            { id: 'theme-10', value: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
            { id: 'theme-11', value: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
            { id: 'theme-12', value: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' }
        ];
        
        function selectTheme(themeId, notify = false) {
            const theme = themes.find(t => t.id === themeId);
            if (!theme) return;
            
            if (auraImage) auraImage.style.backgroundImage = `url(${theme.value})`;

            document.querySelectorAll('.theme-sphere').forEach(s => s.classList.remove('is-selected'));
            const newSelectedSphere = document.querySelector(`.theme-sphere[data-theme-id="${themeId}"]`);
            if (newSelectedSphere) {
                newSelectedSphere.classList.add('is-selected');
                if (window.innerWidth < 1024) {
                    document.querySelectorAll('.theme-sphere').forEach(s => s.classList.remove('is-in-view'));
                    newSelectedSphere.classList.add('is-in-view');
                }
            }
            localStorage.setItem('studioTheme', themeId);
            if (notify) showToast('Ambiente atualizado.', 'success');
        }

        function initStudioThemes() {
            themes.forEach((theme) => {
                const listItem = document.createElement('li');
                listItem.className = 'flex-shrink-0 snap-center lg:flex lg:justify-center';
                const sphereButton = document.createElement('button');
                sphereButton.className = 'theme-sphere';
                sphereButton.dataset.themeId = theme.id;
                sphereButton.style.setProperty('--bg-image', `url(${theme.value})`);
                sphereButton.innerHTML = `<div class="check-icon"><i data-lucide="check" class="w-6 h-6 text-white" style="stroke-width: 1.5;"></i></div>`;
                listItem.appendChild(sphereButton);
                themesTrack.appendChild(listItem);
            });
            
            lucide.createIcons({ strokeWidth: 1.5 });

            const savedThemeId = localStorage.getItem('studioTheme') || themes[0].id;
            selectTheme(savedThemeId, false);

            themesTrack.addEventListener('click', (e) => {
                const sphere = e.target.closest('.theme-sphere');
                if (sphere && !sphere.classList.contains('is-selected')) {
                    selectTheme(sphere.dataset.themeId, true);
                    if (window.innerWidth < 1024) {
                        sphere.parentElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                    }
                }
            });

            if (window.innerWidth < 1024) {
                const spheres = document.querySelectorAll('#studio-environment-track .theme-sphere');
                const options = { root: galleryContainer, rootMargin: '0px', threshold: 0.8 };
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const sphere = entry.target;
                        sphere.classList.toggle('is-in-view', entry.isIntersecting);
                    });
                }, options);
                spheres.forEach(sphere => observer.observe(sphere));
            }
        }
        initStudioThemes();
    })();

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.settings-tab-trigger.is-active');
        if (activeTab) updateActiveTab(activeTab);
    });
});
</script>
</body></html>