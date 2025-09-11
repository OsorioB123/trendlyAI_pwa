PÁGINA RECUPERAR SENHA
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI — Recuperar Senha</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest"></script>
<style>
/* --- ESTILOS GERAIS E ATUALIZADOS --- */
body {
-webkit-tap-highlight-color: transparent;
}
/* Efeito Liquid Glass para o card (Consistente) */
.liquid-glass {
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
background-color: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
/* Estilo customizado para os inputs (Consistente) */
.form-input {
background-color: rgba(0, 0, 0, 0.2);
border: 1px solid rgba(255, 255, 255, 0.15);
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.form-input:focus {
outline: none;
background-color: rgba(0, 0, 0, 0.25);
border-color: rgba(255, 255, 255, 0.4);
box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}
/* Estilo para input com erro */
.input-error {
border-color: #fb7185; /* Tailwind rose-400 */
}
/* Botão de Ação Principal (Consistente) */
.primary-action-btn {
background-color: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.primary-action-btn:hover {
background-color: rgba(255, 255, 255, 0.15);
transform: translateY(-4px);
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}
.primary-action-btn:active {
transform: translateY(-1px) scale(0.98);
}
/* Estilo para mensagens de erro com animação */
.error-message {
max-height: 0;
overflow: hidden;
transition: max-height 0.3s ease-out, margin-top 0.3s ease-out;
}
.error-message.show {
max-height: 2.5rem;
margin-top: 0.25rem;
}
/* Estilo para mensagem de sucesso */
.success-message {
background-color: rgba(34, 197, 94, 0.1);
border: 1px solid rgba(34, 197, 94, 0.2);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
}
/* Animação de entrada (Consistente) */
.animate-fade-in-up {
animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fadeInUp {
from {
opacity: 0;
transform: translateY(25px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
</style></head>

<body class="min-h-screen flex flex-col items-center justify-center font-['Inter'] text-white p-4 bg-black"><div class="fixed top-0 w-full h-screen bg-cover bg-center -z-10" id="aura-image" style="background-image: url(&quot;https://i.ibb.co/Tx5Xxb2P/grad-1.webp?w=800&amp;q=80&quot;);"></div>

    <main class="w-full max-w-md flex flex-col items-center">
        
        <!-- Logo atualizado para imagem, mantendo a consistência -->
        <img src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&amp;q=80" alt="Logo da TrendlyAI" class="w-48 mb-10 animate-fade-in-up object-cover">

        <div class="w-full liquid-glass rounded-3xl p-8 flex flex-col animate-fade-in-up" style="animation-delay: 100ms;">
            
            <div>
                <a href="#" class="flex items-center text-white/60 hover:text-white text-sm font-medium gap-1.5 -ml-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fade-in-up" style="animation-delay: 200ms;">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    Voltar para o login
                </a>
                <div class="w-full mt-6 animate-fade-in-up" style="animation-delay: 300ms;">
                    <h2 class="text-2xl font-semibold tracking-tight mb-2" style="font-family:'Geist', sans-serif;">Recuperar Senha</h2>
                    <p class="text-white/70 text-sm leading-relaxed">Digite seu e-mail e enviaremos um link para você redefinir sua senha.</p>
                </div>
            </div>

            <!-- Formulário de recuperação -->
            <form id="recovery-form" class="w-full flex flex-col gap-5 mt-8" novalidate="">
                <div class="animate-fade-in-up" style="animation-delay: 400ms;">
                    <input type="email" id="email" name="email" placeholder="seu.email@exemplo.com" class="form-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50" required="">
                    <p id="email-error" class="error-message text-rose-400 text-xs"></p>
                </div>
                
                <!-- Botão atualizado com a classe .primary-action-btn -->
                <button type="submit" class="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up" style="animation-delay: 500ms;">
                    <span id="button-text">Enviar Link de Recuperação</span>
                    <div id="loading-spinner" class="hidden flex items-center justify-center gap-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        Enviando...
                    </div>
                </button>
            </form>

            <!-- Mensagem de sucesso (oculta inicialmente) -->
            <div id="success-message" class="hidden success-message rounded-xl p-4 mt-4 animate-fade-in-up">
                <div class="flex items-start gap-3">
                    <i data-lucide="check-circle" class="w-5 h-5 text-green-400 mt-0.5 shrink-0"></i>
                    <div>
                        <h3 class="text-green-400 font-medium text-sm">E-mail enviado com sucesso!</h3>
                        <p class="text-green-300/70 text-xs mt-1 leading-relaxed">
                            Verifique sua caixa de entrada e siga as instruções no e-mail para redefinir sua senha.
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-auto pt-8 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up" style="animation-delay: 600ms;">
                <i data-lucide="lock" class="w-3 h-3"></i>
                <span>Protegido por Supabase</span>
            </div>

        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });

            const form = document.getElementById('recovery-form');
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            const buttonText = document.getElementById('button-text');
            const loadingSpinner = document.getElementById('loading-spinner');
            const successMessage = document.getElementById('success-message');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Limpar erros anteriores
                emailInput.classList.remove('input-error');
                emailError.textContent = '';
                emailError.classList.remove('show');
                successMessage.classList.add('hidden');

                // Validar e-mail
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.classList.add('input-error');
                    emailError.textContent = 'Por favor, insira um e-mail válido.';
                    emailError.classList.add('show');
                    return;
                }

                // Mostrar loading
                buttonText.classList.add('hidden');
                loadingSpinner.classList.remove('hidden');
                form.querySelector('button').disabled = true;

                try {
                    // Simular envio (substituir pela integração real com Supabase)
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Mostrar mensagem de sucesso
                    successMessage.classList.remove('hidden');
                    emailInput.value = '';
                    
                    console.log('E-mail de recuperação enviado para:', emailInput.value);
                    
                } catch (error) {
                    // Em caso de erro
                    emailInput.classList.add('input-error');
                    emailError.textContent = 'Erro ao enviar e-mail. Tente novamente.';
                    emailError.classList.add('show');
                    console.error('Erro ao enviar e-mail de recuperação:', error);
                    
                } finally {
                    // Restaurar botão
                    buttonText.classList.remove('hidden');
                    loadingSpinner.classList.add('hidden');
                    form.querySelector('button').disabled = false;
                    
                    // Recriar ícones após mudanças no DOM
                    lucide.createIcons({ strokeWidth: 1.5 });
                }
            });
        });
    </script>

</body></html>