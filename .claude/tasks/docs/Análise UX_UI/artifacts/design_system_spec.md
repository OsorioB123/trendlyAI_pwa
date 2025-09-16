# TrendlyAI Design System — Spec v1.1

## Foundations
- Fonts: `Inter` (primária), `Geist Sans` (opcional/headers). Definir fallback: `system-ui, -apple-system, sans-serif`.
- Colors (dark-first):
  - Background: `#0A0A0A` (ou token `--bg-main`) com overlays adaptativos.
  - Foreground: `#FFFFFF` com opacidades em tokens (`--opacity-xx`).
  - Brand: Amarelo “Maestro” para CTAs/indicadores; Roxo/Azul apenas como realce secundário.
- Spacing/Radius/Shadow: usar `src/styles/design-tokens.css` exclusivamente; evitar valores “mágicos”.

## Glassmorphism/Liquid Glass
- Níveis padronizados (aplicar como utilities globais):
  - `glass-1` (antigo glass-light): blur 12px, bg 0.08, border 0.12
  - `glass-2` (antigo glass-medium): blur 20–24px, gradient leve, border 0.15
  - `glass-3` (antigo glass-heavy): blur 24–28px, gradient 3 stops, shadow-glass-3
- Regras:
  - Mobile: preferir `glass-1` e backgrounds estáticos (sem blur animado).
  - Texto sobre glass: mínimo AA — reforçar overlay se fundo variável.

## Motion Tokens
- Durations: fast 150ms, normal 200–250ms, slow 350–500ms.
- Easing padrão: `cubic-bezier(0.16, 1, 0.3, 1)`; interactive tap: spring stiff/damping 400/25.
- Prefers-reduced-motion: obrigatório em todos os componentes interativos.

## Focus/States
- Focus ring global `.focus-ring`:
  - Outline 2px com halo (shadow-glow-brand em CTAs, shadow-glow-white em neutros).
  - Sempre visível em `:focus-visible`.
- States: `loading`, `success`, `error`, `warning` disponíveis como variantes visuais + `aria-live`.

## Components (princípios)
- Botões: primário (brand), secundário (glass-1), ghost (text-only), destructive (red-700/brand-negativo). Tamanhos: sm/md/lg.
- Inputs: `ui/input` + `ui/label` + help/error text padrão; ícones à esquerda; focus-ring consistente.
- Dialog/Sheet: usar `ui/dialog`/`ui/sheet` (Radix) com foco inicial; áreas glass-2.
- Cards: tolerância de hover: scale 1.02, sombra +1 nível; transições 200ms.
- Toasts: `components/ui/Toast` centralizado; variantes success/error/info; tempo padrão 4–6s.

## Theming/Paleta
- Neutral scale: branco 100%, 80%, 60%, 40%, 20% (tokens).
- Brand: amarelo Maestro (primário), roxo/azul (secundários), vermelhos/verdes (feedback).
- Utilizar `color-mix` em classes de categoria com tokens de cor (já definido em design-tokens.css).

## Tipos/Grids
- Tipo: Escala de `--text-sm` a `--text-5xl`, line-heights em tokens.
- Grid: `max-w-7xl` (desktop), `max-w-3xl` (artigos/painéis), gutters 16–24px.

