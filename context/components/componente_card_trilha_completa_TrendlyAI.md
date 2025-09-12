<!-- 1. CÓDIGO HTML -->
code
Html
<!-- 
  ESTRUTURA DO CARD 'TRILHA RECOMENDADA'
  - O container principal precisa das classes .interactive-card e .card-glow
  - O botão .favorite-btn e as tags .liquid-glass-tag dependem do position:relative no container
-->
<div class="interactive-card rounded-2xl overflow-hidden relative h-64 card-glow">
    <!-- Imagem de Fundo -->
    <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80" alt="Vendas Online" class="absolute w-full h-full object-cover">
    
    <!-- Botão de Favorito -->
    <button class="favorite-btn liquid-glass-pill w-10 h-10 flex items-center justify-center" aria-label="Adicionar aos favoritos" title="Adicionar aos favoritos">
        <i data-lucide="heart" class="w-5 h-5"></i>
    </button>
    
    <!-- Tags de Categoria -->
    <div class="absolute top-0 left-0 p-5 flex items-start gap-2">
        <span class="liquid-glass-tag">Vendas</span>
        <span class="liquid-glass-tag">Intermediário</span>
    </div>

    <!-- Overlay e Título -->
    <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
        <div class="p-5">
            <h3 class="font-medium text-white text-lg">Funil de Vendas para E-commerce</h3>
        </div>
    </div>
</div>
<!-- 2. CÓDIGO CSS -->
code
CSS
/* ESTILOS COMPLETOS PARA O COMPONENTE .interactive-card E SUAS DEPENDÊNCIAS */

/* Estilo Base do Card */
.interactive-card { 
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
}
.interactive-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.35);
}

/* Efeito de Brilho Pulsante */
.card-glow::before { 
    content: ''; 
    position: absolute; 
    inset: 0; 
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%); 
    opacity: 0.1; 
    filter: blur(20px); 
    mix-blend-mode: screen; 
    border-radius: inherit; 
    animation: pulse 4s ease-in-out infinite; 
    pointer-events: none; 
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
}
@keyframes pulse { 
    0%, 100% { opacity: 0.08; transform: scale(0.95); } 
    50% { opacity: 0.2; transform: scale(1.05); } 
}

/* Dependência Visual: .liquid-glass-tag */
.liquid-glass-tag { 
    backdrop-filter: blur(10px); 
    background-color: rgba(255, 255, 255, 0.12); 
    border: 1px solid rgba(255, 255, 255, 0.16); 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); 
    border-radius: 9999px; 
    padding: 2px 10px; 
    font-size: 11px; 
    font-weight: 500; 
    color: white; 
}

/* --- Estilos do Botão de Favorito e suas dependências (IDÊNTICOS AO CARD ANTERIOR) --- */

/* Dependência Visual: .liquid-glass-pill */
.liquid-glass-pill { 
    backdrop-filter: blur(20px); 
    background-color: rgba(255, 255, 255, 0.1); 
    border: 1px solid rgba(255, 255, 255, 0.14); 
    border-radius: 9999px; 
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
}
.liquid-glass-pill:hover { 
    background-color: rgba(255, 255, 255, 0.15); 
}
.liquid-glass-pill:active { 
    transform: scale(0.97); 
}

/* Estilo Funcional: .favorite-btn */
.favorite-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 20;
    cursor: pointer;
}
.favorite-btn:active {
    transform: scale(0.9);
}
.favorite-btn i, .favorite-btn svg {
    transition: all 0.2s ease;
    stroke: rgba(255, 255, 255, 0.8);
    fill: none;
    color: rgba(255, 255, 255, 0.8);
}
.favorite-btn:hover i, .favorite-btn:hover svg {
    stroke: white;
    color: white;
}
.favorite-btn.is-favorited i, .favorite-btn.is-favorited svg {
    stroke: #ef4444; /* red-500 */
    fill: #ef4444;
    color: #ef4444;
}
.favorite-btn.is-favorited {
    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}
<!-- 3. CÓDIGO JAVASCRIPT (Funcionalidade) -->
Este único bloco de código JavaScript deve ser incluído no final da página (antes de </body>). Ele controlará a funcionalidade de todos os botões de favorito, para ambos os tipos de card.
code
JavaScript
<script>
    // É recomendado executar este código após o DOM estar totalmente carregado.
    document.addEventListener('DOMContentLoaded', () => {
    
        // 1. Inicializa os ícones da biblioteca Lucide
        // Certifique-se de que a biblioteca Lucide está carregada
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ strokeWidth: 1.5 });
        }

        // 2. Lógica para o botão de Favoritar (controla todos os cards)
        // Usa delegação de eventos para máxima eficiência.
        document.body.addEventListener('click', e => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            
            if (favoriteBtn) {
                // Impede que o clique no botão acione qualquer ação no card pai.
                e.stopPropagation(); 
                
                // Alterna a classe que controla o visual (preenchido/vazio).
                favoriteBtn.classList.toggle('is-favorited');
                const isFavorited = favoriteBtn.classList.contains('is-favorited');
                
                // Atualiza a label para acessibilidade, informando a nova ação.
                const newLabel = isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
                favoriteBtn.setAttribute('aria-label', newLabel);
                favoriteBtn.setAttribute('title', newLabel); // Também atualiza a dica de ferramenta
                
                // Opcional: Adicionar uma função de feedback, como um toast.
                // Ex: showToast(isFavorited ? 'Adicionado aos favoritos!' : 'Removido dos favoritos.');
                console.log(newLabel);
            }
        });
        
    });
</script>