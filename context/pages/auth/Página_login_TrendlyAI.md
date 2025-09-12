PÁGINA DE LOGIN
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TrendlyAI — Login</title>
<link href="https://unpkg.com/@geist-ui/fonts/geist-sans.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest"></script>
<style>
@keyframes fadeInUp {
from { opacity: 0; transform: translateY(25px); }
to { opacity: 1; transform: translateY(0); }
}
</style></head>
<body class="min-h-screen flex items-center justify-center bg-black text-white font-['Inter'] antialiased selection:bg-white/10 selection:text-white" style="background-image: radial-gradient(1200px 600px at 70% -10%, rgba(120,119,198,0.18) 0%, transparent 60%), radial-gradient(900px 500px at -10% 100%, rgba(56,189,248,0.14) 0%, transparent 60%);"><div class="fixed top-0 w-full h-screen bg-cover bg-center -z-10" id="aura-image" style="background-image: url(&quot;https://i.ibb.co/Tx5Xxb2P/grad-1.webp?w=800&amp;q=80&quot;);"></div>
  <main class="w-full max-w-md px-4">
    <div class="w-full flex flex-col items-center">
      <img src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&amp;q=80" alt="Logo da TrendlyAI" class="w-48 mb-10 object-cover" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 50ms;">

      <div class="w-full rounded-3xl p-8 flex flex-col items-center gap-6 backdrop-blur-2xl bg-white/10 border border-white/15" style="box-shadow: 0 8px 32px rgba(0,0,0,0.3); animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 120ms;">
        <button class="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-white text-sm font-medium bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 200ms;">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5">
          Continuar com o Google
        </button>

        <div class="w-full flex items-center gap-4" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 280ms;">
          <div class="w-full h-px bg-white/10"></div>
          <span class="text-xs text-white/50 tracking-wider">OU</span>
          <div class="w-full h-px bg-white/10"></div>
        </div>

        <form class="w-full flex flex-col gap-4">
          <div class="flex flex-col gap-2" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 360ms;">
            <input type="email" placeholder="E-mail" required="" class="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border border-white/15 transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10">
          </div>
          <div class="flex flex-col gap-2" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 440ms;">
            <input type="password" placeholder="Senha" required="" class="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border border-white/15 transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10">
          </div>

          <button type="submit" class="w-full text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 border border-white/20 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300 mt-2" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 520ms;">
            Entrar
          </button>
        </form>

        <div class="flex flex-col items-center gap-3 text-center" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 600ms;">
          <a href="#" class="text-white/60 hover:text-white text-xs transition-colors duration-300">
            Não tem uma conta?
            <span class="font-semibold text-white">Crie uma aqui</span>
          </a>
          <a href="#" class="text-white/60 hover:text-white text-xs transition-colors duration-300">
            Esqueceu sua senha?
          </a>
        </div>

        <div class="flex items-center justify-center gap-2 text-xs text-white/40 mt-2" style="animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 680ms;">
          <i data-lucide="lock" class="w-3 h-3"></i>
          <span>Protegido por Supabase</span>
        </div>
      </div>
    </div>
  </main>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons({ strokeWidth: 1.5 });
    });
  </script>

</body></html>