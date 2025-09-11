PÁGINA CRIAR CONTA
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI — Criar Conta</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest"></script>
<style>
/* --- ESTILOS GERAIS E ATUALIZADOS --- */
body {
-webkit-tap-highlight-color: transparent;
}
/* Efeito Liquid Glass para o card (Mantido e consistente) */
.liquid-glass {
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
background-color: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
/* Estilo customizado para os inputs (Consistente com Login) */
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
/* Estilo para input com erro (Mantido para UX) */
.input-error {
border-color: #fb7185; /* Tailwind rose-400 */
}
/* Botão de Ação Principal (Consistente com Login) */
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
/* Estilo para o checkbox customizado (ATUALIZADO) */
.custom-checkbox {
appearance: none; -webkit-appearance: none;
background-color: rgba(0, 0, 0, 0.2);
border: 1px solid rgba(255, 255, 255, 0.2);
transition: all 0.2s ease;
cursor: pointer;
}
.custom-checkbox:checked {
border-color: rgba(255, 255, 255, 0.8);
background-color: #FFF;
background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
background-size: 100% 100%;
background-position: center;
background-repeat: no-repeat;
}
/* Estilo para mensagens de erro com animação (Mantido) */
.error-message {
max-height: 0;
overflow: hidden;
transition: max-height 0.3s ease-out, margin-top 0.3s ease-out;
}
.error-message.show {
max-height: 2.5rem; /* Aumentado para acomodar mensagens de senha mais longas */
margin-top: 0.25rem;
}
/* Animação de entrada (Consistente com Login) */
.animate-fade-in-up {
animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fadeInUp {
from { opacity: 0; transform: translateY(25px); }
to { opacity: 1; transform: translateY(0); }
}
</style></head>

<body class="min-h-screen flex flex-col items-center justify-center font-['Inter'] text-white p-4 bg-black"><div class="fixed top-0 w-full h-screen bg-cover bg-center -z-10" id="aura-image" style="background-image: url(&quot;https://i.ibb.co/Tx5Xxb2P/grad-1.webp?w=800&amp;q=80&quot;);"></div>

    <main class="w-full max-w-md flex flex-col items-center">
        
        <!-- PONTO 1: Logo atualizado para usar imagem, mantendo a consistência -->
        <img src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&amp;q=80" alt="Logo da TrendlyAI" class="w-48 mb-10 animate-fade-in-up object-cover">

        <div class="w-full liquid-glass rounded-3xl p-8 flex flex-col animate-fade-in-up" style="animation-delay: 100ms;">
            
            <div>
                <a href="#" class="flex items-center text-white/60 hover:text-white text-sm font-medium gap-1.5 -ml-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fade-in-up" style="animation-delay: 200ms;">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    Voltar para o login
                </a>
                <h2 class="text-2xl font-semibold tracking-tight mt-6 animate-fade-in-up" style="font-family:'Geist', sans-serif; animation-delay: 300ms;">Crie sua Conta</h2>
            </div>

            <form id="signup-form" class="flex-grow flex flex-col mt-6" novalidate="">
                <div class="space-y-4">
                    <!-- Campo Nome -->
                    <div class="animate-fade-in-up" style="animation-delay: 400ms;">
                        <label for="name" class="block text-sm font-medium text-white/80 mb-1.5">Seu nome</label>
                        <input type="text" id="name" name="name" class="form-input w-full rounded-xl px-4 py-2.5 text-sm" required="">
                        <p id="name-error" class="error-message text-rose-400 text-xs"></p>
                    </div>
                    <!-- Campo E-mail -->
                    <div class="animate-fade-in-up" style="animation-delay: 500ms;">
                        <label for="email" class="block text-sm font-medium text-white/80 mb-1.5">Seu e-mail</label>
                        <input type="email" id="email" name="email" class="form-input w-full rounded-xl px-4 py-2.5 text-sm" required="">
                        <p id="email-error" class="error-message text-rose-400 text-xs"></p>
                    </div>
                    <!-- Campo Senha -->
                    <div class="animate-fade-in-up" style="animation-delay: 600ms;">
                        <label for="password" class="block text-sm font-medium text-white/80 mb-1.5">Crie uma senha</label>
                        <input type="password" id="password" name="password" class="form-input w-full rounded-xl px-4 py-2.5 text-sm" required="">
                        <p id="password-error" class="error-message text-rose-400 text-xs"></p>
                    </div>
                </div>

                <!-- Campo Termos -->
                <div class="mt-6 animate-fade-in-up" style="animation-delay: 700ms;">
                    <div class="flex items-start">
                         <!-- PONTO 2: Checkbox com estilo atualizado -->
                         <input id="terms" name="terms" type="checkbox" class="custom-checkbox h-4 w-4 mt-0.5 rounded-sm shrink-0" required="">
                         <label for="terms" class="ml-3 text-xs text-white/70">
                             <!-- PONTO 3: Estilo dos links atualizado para ser consistente -->
                             Eu aceito os <a href="#" class="font-semibold text-white hover:underline">Termos de Serviço</a> e a <a href="#" class="font-semibold text-white hover:underline">Política de Privacidade</a>.
                         </label>
                    </div>
                     <p id="terms-error" class="error-message text-rose-400 text-xs ml-7"></p>
                </div>
                
                <!-- Botão de Ação -->
                <div class="mt-auto pt-4"> <!-- Wrapper para garantir espaçamento correto -->
                    <!-- PONTO 4: Botão atualizado com a classe .primary-action-btn -->
                    <button type="submit" class="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up" style="animation-delay: 800ms;">
                        Criar Conta
                    </button>
                </div>
            </form>

            <div class="mt-6 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up" style="animation-delay: 900ms;">
                <i data-lucide="lock" class="w-3 h-3"></i>
                <span>Protegido por Supabase</span>
            </div>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });

            // A lógica de validação em JavaScript permanece a mesma, pois é agnóstica em relação ao estilo.
            const form = document.getElementById('signup-form');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const termsInput = document.getElementById('terms');

            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');
            const termsError = document.getElementById('terms-error');

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let isValid = validateForm();
                
                if (isValid) {
                    console.log('Formulário válido! Enviando para o backend...');
                    // Lógica de envio para o Supabase aqui
                }
            });

            function validateForm() {
                let valid = true;
                // Limpar erros anteriores
                [nameInput, emailInput, passwordInput].forEach(input => input.classList.remove('input-error'));
                [nameError, emailError, passwordError, termsError].forEach(error => {
                    error.textContent = '';
                    error.classList.remove('show');
                });

                // Validação do Nome
                if (nameInput.value.trim().length < 2) {
                    valid = false;
                    nameInput.classList.add('input-error');
                    nameError.textContent = 'O nome parece curto demais.';
                    nameError.classList.add('show');
                }

                // Validação do E-mail
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    valid = false;
                    emailInput.classList.add('input-error');
                    emailError.textContent = 'Por favor, insira um e-mail válido.';
                    emailError.classList.add('show');
                }

                // Validação da Senha
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
                if (!passwordRegex.test(passwordInput.value)) {
                    valid = false;
                    passwordInput.classList.add('input-error');
                    passwordError.textContent = 'A senha deve ter no mínimo 8 caracteres e 1 número.';
                    passwordError.classList.add('show');
                }

                // Validação dos Termos
                if (!termsInput.checked) {
                    valid = false;
                    termsError.textContent = 'Você deve aceitar os termos para continuar.';
                    termsError.classList.add('show');
                }

                return valid;
            }
        });
    </script>


</body></html>