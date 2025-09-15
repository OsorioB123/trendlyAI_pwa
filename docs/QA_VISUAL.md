# TrendlyAI PWA – Guia de QA Visual (UX/UI + Motion)

Este roteiro ajuda a validar rapidamente a experiência final em desktop e mobile, com foco em simplicidade e consistência.

## Preparação
- Iniciar dev server: `npm run dev` (abre em http://localhost:3000)
- Rodar smoke básico (com servidor rodando): `npm run smoke:dev`
- Testar em: Chrome (desktop + mobile emulador), Safari iOS (quando possível)

## Itens gerais
- Tipografia: Inter carregando sem FOUT; títulos e textos legíveis.
- Imagens: `next/image` nas áreas principais (logos, avatares, cards) sem distorção.
- Acessibilidade: foco visível em botões/links; alvos de toque ≥ 44px para ícones; `aria-label` em ícones.
- Motion: transições suaves em entrada; `prefers-reduced-motion` reduz animações.
- Vidro/blur: efeito “glass” sem lag perceptível em mobile (se houver, reduzir blur nas áreas grandes).

## Páginas

### 1) Home (`/`)
- Layout inicial, CTA visíveis; sem jumps de layout.

### 2) Onboarding (`/onboarding`)
- Slides 1/2/4: títulos e parágrafos com entrada suave.
- Slide 3: “spheres” centralizam corretamente; marcador “is-in-view” muda ao arrastar no mobile.
- Botões: “Pular” e “Próximo/Começar” com feedback; concluir leva ao dashboard.
- Reduced motion: transições mais discretas quando ativo.

### 3) Login/Registro/Forgot (`/(auth)/...`)
- Logos com `next/image`, sem warning de `<img>`.
- Erros exibidos claramente; foco de teclado navega bem.

### 4) Dashboard (`/dashboard` – após login)
- Header “glass”; campo de comando com sugestões; cards com “lift”.

### 5) Ferramentas (`/tools`)
- Busca com microinterações; chips com cores por categoria; drawer de filtros com Esc/Tab trap.
- Skeletons aparecem no carregamento; Tool Modal com copy/save e toasts quando aplicável.
- Reduced motion: “typing glow” e pulsos reduzidos.

### 6) Chat (`/chat` – após login)
- Mensagens entram suavemente e auto-scroll comporta-se; indicador “pensando”.
- Acessibilidade: `role="log"`, `aria-live` durante streaming; navegação por teclado.

### 7) Assinatura (`/subscription` – após login)
- Card/uso/estado entram com motion leve; toasts ao pausar/cancelar/recibo.
- Expand/collapse com suavidade; texto claro.

### 8) Perfil (`/profile` – após login)
- Avatar com `next/image`; edição inline funciona; seções “Seu Arsenal”, “Convidar e Ganhar”, “Próxima Ação” com motion unificado.

### 9) Ajuda (`/help`)
- Seções com motion; sidebar destaca a aba; acordeões suaves; botão “Iniciar conversa” abre modal.
- Botão fechar do widget tem `aria-label` e 44px de alvo.

## Dispositivos
- Desktop (≥1024px): verificar glass/blur e “lift”; no onboarding, layout em bottom-left.
- Mobile (≤768px): snap horizontal no slide 3; drawer de filtros; botões com alvos grandes e haptics suaves.

## Observações
- Se houver flicker/jitter em mobile com blur elevado, considerar reduzir o nível de blur em containers muito grandes.
- Garantir que toasts não cubram botões críticos; tempo de exibição adequado (≤5s).

