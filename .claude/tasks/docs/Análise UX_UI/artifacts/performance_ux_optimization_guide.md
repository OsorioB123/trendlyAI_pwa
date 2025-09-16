# Performance + UX Optimization Guide

## PWA & Caching
- Service Worker: cache-first para estáticos (icons, fontes, chunks), SWR para imagens; fallback `/offline`.
- `next-pwa` (ou SW manual) integrado ao App Router; registrar SW em `layout`/client.
- Meta iOS: apple web app + status bar style; ícones apple.

## Imagens
- Padronizar `next/image` e `sizes`; util de otimização central (Unsplash/Supabase) com breakpoints.
- Placeholder blur e lazy em grids; evitar `backdrop-blur` alto em listas (usar background imagem blurreada).

## Motion
- Padronizar `MOTION_CONSTANTS`; banir valores mágicos.
- `prefers-reduced-motion` obrigatório (skeletons, nav ripple, tool/track cards, dialogs).

## Data Fetching UX
- `aria-busy` em containers; skeletons consistentes; retry/backoff em erros.
- Persistência de filtros em URL para evitar recomputes/confusão ao voltar.

## Build/Bundle
- Checar divisões de bundle para páginas densas (tools/tracks/chat).
- Import dinâmico para componentes pesados opcionais (ex.: modais ricos).

