# TrendlyAI PWA – Checklist de Acessibilidade (A11y)

Este checklist ajuda a manter a UX inclusiva e consistente. Use-o ao revisar PRs.

## Itens Gerais
- Semântica
  - Usar `<button>` para ações (evitar `<div>` clicável). Adicionamos isso nos dots do Onboarding.
  - Títulos em ordem (h1 > h2 > h3), sem pular níveis quando possível.
- Foco e teclado
  - Foco visível em todos os controles interativos (links, botões, inputs).
  - Navegação via teclado cobre todas as ações (tab, enter, esc, setas em listas quando aplicável).
  - Evitar “trap de foco” fora de modais/drawers; garantir trap DENTRO de modais (feito em Tools Filters Drawer).
- ARIA
  - `aria-label`/`title` em botões ícone (Header, Help widget, etc.).
  - `aria-expanded` e `aria-controls` quando há expand/collapse (Subscription: aplicado em histórico e opções de plano).
  - Live regions para conteúdo dinâmico (Chat: `role="log"`, `aria-live="polite"`).
- Contraste e tamanho
  - Checar contraste de texto/ícones (sobretudo com vidro e sobreposições negras). Meta: AA.
  - Alvos de toque ≥ 44px (ícones redondos aumentados onde necessário, ex.: Help widget fechar).
- Motion
  - Respeito a `prefers-reduced-motion` (Onboarding, Help, Profile, Tools Search/Chips, Chat, Subscription).
- Imagens e mídia
  - `next/image` sempre com `alt` significativo. Evitar texto essencial em imagens quando possível.

## Notas por rota (pontos de atenção)
- Onboarding (`/onboarding`)
  - Dots agora são `<button>` com `aria-label` e `aria-current`/`aria-controls`.
  - Slide 3: `IntersectionObserver` mantém “is-in-view” – OK; garantir que botões tenham foco via teclado (spheres são `<button>`).
- Tools (`/tools`)
  - Drawer de filtros com focus trap e Esc – OK.
  - SearchBar/Chips respeitam reduced motion – OK.
- Chat (`/chat`)
  - Log de mensagens com `role="log"`, `aria-live` no streaming – OK.
  - Verificar foco no input e anúncios de novo conteúdo em leitores de tela.
- Subscription (`/subscription`)
  - `aria-expanded`/`aria-controls` nos toggles e ids nas seções – OK.
  - Toasters com mensagem clara e `aria-live` implícita (via DOM) – OK.
- Profile (`/profile`)
  - AvatarUpload mantém `<img>` por DataURL; ao migrar para `blob:`/URL, considerar `next/image`.
  - Seções com motion e foco adequados – OK.
- Help (`/help`)
  - Widget “fechar” com `aria-label` e alvo 44px – OK.
  - Acordeões: setas rotacionam; garantir que o botão do acordeão tenha atributo `aria-expanded` (pode ser evoluído).

## Ferramentas de verificação
- Lighthouse (Acessibilidade ≥ 90)
- Axe DevTools
- VoiceOver/NVDA/JAWS (amostral)
- DevTools: simular `prefers-reduced-motion`

