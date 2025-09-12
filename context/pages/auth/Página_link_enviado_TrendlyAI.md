PÁGINA LINK ENVIADO
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI — Link Enviado</title>
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
/* Círculo com fundo liquid glass para o ícone (Mantido) */
.liquid-glass-icon-bg {
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
background-color: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.14);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
        
        <!-- Logo atualizado para imagem, finalizando a consistência -->
        <img src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&amp;q=80" alt="Logo da TrendlyAI" class="w-48 mb-10 animate-fade-in-up object-cover">

        <!-- Card de Confirmação -->
        <div class="w-full liquid-glass rounded-3xl p-8 flex flex-col text-center animate-fade-in-up" style="animation-delay: 100ms;">
            
            <!-- Wrapper para o conteúdo principal -->
            <div class="flex-grow flex flex-col items-center justify-center gap-6 py-8">
                <!-- Ícone de Sucesso -->
                <div class="liquid-glass-icon-bg w-20 h-20 rounded-full flex items-center justify-center animate-fade-in-up" style="animation-delay: 200ms;">
                    <!-- Cor do ícone atualizada para branco usando classe Tailwind -->
                    <i data-lucide="mail-check" class="w-10 h-10 text-white"></i>
                </div>
                
                <!-- Bloco de Texto -->
                <div class="animate-fade-in-up" style="animation-delay: 300ms;">
                    <h2 class="text-2xl font-semibold tracking-tight mb-2" style="font-family:'Geist', sans-serif;">Link Enviado!</h2>
                    <p class="text-white/70 text-sm max-w-xs leading-relaxed">
                        Verifique sua caixa de entrada (e a pasta de spam) para encontrar o link de redefinição de senha.
                    </p>
                </div>

                <!-- Botão de Ação -->
                <!-- Botão atualizado com a classe .primary-action-btn -->
                <a href="#" class="primary-action-btn w-full max-w-xs text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg text-center mt-4 animate-fade-in-up" style="animation-delay: 400ms;">
                    Ok, entendi
                </a>
            </div>

            <!-- Extensão "Protegido por" -->
            <div class="flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up" style="animation-delay: 500ms;">
                <i data-lucide="lock" class="w-3 h-3"></i>
                <span>Protegido por Supabase</span>
            </div>
            
        </div>
    </main>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons({ strokeWidth: 1.5 });
        });
    </script>

</body></html>