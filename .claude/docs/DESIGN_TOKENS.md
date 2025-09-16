# TrendlyAI – Design Tokens (referência rápida)

Esta referência consolida variáveis e padrões usados no `globals.css` para facilitar consistência.

## Cores
- Fundo base: `--bg-main: #101014`
- Texto: branco (`#fff`) com opacidades variadas (`/70`, `/60`, etc.)
- Gradientes: roxos/azuis (ver `.bg-gradient-to-br`, `.bg-gradient-to-r`)

## Vidro (Glass)
- `.liquid-glass`: `backdrop-filter: blur(20px)` + fundo translúcido + borda leve + sombra
- `.glass-medium`: blur(24px) + gradiente translúcido + borda + sombras
- `.glass-heavy`: blur(32px) + gradiente mais intenso + múltiplas sombras
- Mobile (≤640px): blur reduzido para melhor performance

## Sombras
- `shadow-glass-1` a `shadow-glass-5`: níveis crescentes de profundidade e nitidez

## Animações
- Framer Motion centralizado em `src/lib/motion.ts` com:
  - `SPRING`: `stiff`, `smooth`, `bouncy`, `gentle`
  - `DURATION`: `instant`, `fast`, `normal`, `slow`, `glacial`
  - `EASING`: `smooth`, `bounce`, `ease`, `linear`
  - `VARIANTS`: `fadeIn`, `scale`, `slideUp/down`, `staggerContainer`
  - `respectReducedMotion`: para respeitar `prefers-reduced-motion`

## Tipografia
- Inter via `next/font` (layout)
- Geist via link (opcional para títulos; pode migrar para font local futuramente)

## Utilitários
- `.focus-ring`: anel de foco visível (3px) para ícones/botões
- `.hide-scrollbar`: oculta barras de scroll (WebKit/Firefox/IE)
- `.line-clamp-2/3`: truncamento de texto

## Recomendações
- Evitar hardcode de durations e delays; usar `MOTION_CONSTANTS`.
- Manter contraste AA em textos sobre vidro e fundos com gradiente.
- Alvos mínimos de 44px para toque em botões ícone.

