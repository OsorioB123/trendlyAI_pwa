<!-- 1. CÓDIGO HTML -->
code
Html
<!-- 
  ESTRUTURA DO CARD 'CONTINUE SUA TRILHA'
  - O container principal precisa da classe .arsenal-card e .group
  - O posicionamento do botão .favorite-btn depende do position:relative no container
-->
<div class="arsenal-card group rounded-2xl overflow-hidden relative h-80" style="background-image: url('https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80')">
    
    <!-- Botão de Favorito -->
    <button class="favorite-btn liquid-glass-pill w-10 h-10 flex items-center justify-center" aria-label="Adicionar aos favoritos" title="Adicionar aos favoritos">
        <i data-lucide="heart" class="w-5 h-5"></i>
    </button>
    
    <!-- Conteúdo do Card com Overlay -->
    <div class="card-overlay absolute inset-0 flex flex-col justify-end p-6">
        <h3 class="font-medium text-white text-xl mb-4">Marketing Digital para Iniciantes</h3>
        
        <!-- Barra de Progresso -->
        <div class="flex items-center justify-between text-sm mb-2 text-white/80 progress-bar-label">
            <span>Progresso</span>
            <span>70%</span>
        </div>
        <div class="w-full bg-white/10 rounded-full h-2 mb-4">
            <div class="bg-white h-2 rounded-full transition-all duration-500" style="width: 70%"></div>
        </div>
        
        <!-- Ação Revelada no Hover (controlada pela classe .group do pai) -->
        <div class="card-hover-actions">
            <button class="liquid-glass-pill w-full py-3 font-medium">Continuar Trilha</button>
        </div>
    </div>
</div>
<!-- 2. CÓDIGO CSS -->
code
CSS
/* ESTILOS COMPLETOS PARA O COMPONENTE .arsenal-card E SUAS DEPENDÊNCIAS */

/* Estilo Base do Card */
.arsenal-card {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    background-size: cover;
    background-position: center;
}
.arsenal-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
}

/* Estilo do Overlay de Conteúdo */
.card-overlay {
    background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
    transition: all 0.4s ease;
}
.arsenal-card:hover .card-overlay {
    background: linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 70%, transparent 100%);
}

/* Estilo do Botão "Continuar Trilha" que aparece no Hover */
.card-hover-actions {
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.3s ease 0.1s;
}
.arsenal-card:hover .card-hover-actions {
    opacity: 1;
    transform: translateY(0);
}

/* Estilo da Barra de Progresso */
.progress-bar-label {
    opacity: 0.7;
    transition: opacity 0.3s ease;
}
.arsenal-card:hover .progress-bar-label {
    opacity: 1;
}

/* --- Estilos do Botão de Favorito e suas dependências --- */

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