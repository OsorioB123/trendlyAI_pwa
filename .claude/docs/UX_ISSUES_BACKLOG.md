# TrendlyAI PWA – Backlog de Mini‑Issues (UX/UI)

Use estas issues como base para abrir tarefas no GitHub/Jira. Cada item inclui objetivo e critérios de aceite simples.

1) A11y: `aria-expanded` nos acordeões de Help
- Objetivo: adicionar `aria-expanded` e `aria-controls` aos botões de pergunta no `/help`.
- Aceite: Leitores de tela anunciam abertura/fechamento; navegação por teclado funciona; sem regressões visuais.

2) A11y: foco visível consistente em todos os botões ícone
- Objetivo: padronizar foco com anel visível (ex.: outline/ring) em ícones do Header e botões de cards.
- Aceite: todos os ícones exibem foco claro ao usar Tab; contraste AA.

3) A11y: AvatarUpload com `next/image` (quando preview mudar)
- Objetivo: migrar `<img>` para `next/image` quando o preview usar `blob:`/URL em vez de DataURL.
- Aceite: preview funciona; sem CLS; sem warnings de imagem; performance ok.

4) Perf: opcional reduzir blur em containers grandes (mobile)
- Objetivo: aliviar GPU em devices modestos reduzindo `backdrop-blur` em containers muito grandes.
- Aceite: sem perda perceptível de estética; FPS estável em scroll/anim.

5) Motion: padronizar durations/delays via `MOTION_CONSTANTS`
- Objetivo: trocar durations e delays hardcoded por constantes globais (coerência e manutenção).
- Aceite: timeline consistente; `prefers-reduced-motion` continua respeitado.

6) A11y: `role`/labels em controles do Help widget
- Objetivo: revisar input e botões do widget de chat do Help adicionando labels auxiliares (placeholder já ajuda, mas reforçar com `aria-label` se necessário).
- Aceite: campo anunciado corretamente; botão de fechar já possui `aria-label`.

7) UX: estados vazios com onboarding/contexto
- Objetivo: ajustar mensagens em estados vazios (Tracks/Tools/Help) com links diretos ou dicas rápidas.
- Aceite: mensagens atualizadas; sem regressões; links levam a ações úteis.

8) UX: documentação de design tokens
- Objetivo: documentar rapidamente cores/espessuras/raios e patterns de vidro no `globals.css`.
- Aceite: doc curta no repo; usada como referência para PRs.

9) A11y: atalho “pular para conteúdo”
- Objetivo: adicionar link “skip to content” no layout, visível ao focar, que posiciona o foco no `<main>`.
- Aceite: disponível com Tab; não aparece fora do foco; sem regressões de layout.

10) Perf: revisar imagens remotas de background
- Objetivo: onde possível, servir dimensões menores para fundos (cres). Manter qualidade; reduzir peso.
- Aceite: page weight reduzido em mobile; sem degradação notável.

