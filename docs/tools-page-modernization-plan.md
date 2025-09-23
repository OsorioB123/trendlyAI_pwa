# TrendlyAI Tools Page Modernization Plan

_Last updated: 2025-09-23_

## Goal
Track the full refactor plan for the /tools page so we keep history even if chat context resets.

## Overview
- **Scope**: /tools page (Next.js App Router) with focus on filters, responsive UX, Supabase integration.
- **Target**: modern UI, consistent filters (client + server), accessible experience for ~5-10k monthly visits.
- **Primary files**:
  - src/app/tools/page.tsx
  - src/components/tools/ToolsFiltersDrawer.tsx
  - src/components/search/SearchBar.tsx
  - src/components/cards/ToolCard.tsx
  - src/components/modals/ToolModal.tsx

## Progress Snapshot
| Phase | Description | Status | Notes |
| ----- | ----------- | ------ | ----- |
| 1 | Supabase integration (server filters, data normalization, favorites) | [x] Done | Section 1.1; passed 
px tsc --noEmit. |
| 2 | Layout & responsiveness (hero, persistent filter bar, adaptive grid) | [~] In progress | Hero sections refreshed, persistent summary added; polish on cards/grid pending. |
| 3 | Filter components (SearchBar, drawer, shadcn patterns, a11y) | [~] In progress | SearchBar rebuilt com sugestÃµes acessÃ­veis; drawer reorganizado. |
| 4 | Cards, modal, favorites UX polish | [ ] Open | Pending new layout decisions. |
| 5 | Validation (smoke, Playwright, a11y, docs) | [ ] Open | Plan after phases 2-4. |

## 1. Supabase Integration (Done)
### 1.1 Delivered items
- **Mapping helpers** (src/app/tools/page.tsx:21-112)
  - Added TOOL_TYPE_VALUES, AI_COMPATIBILITY_VALUES, prefixes 	ype: / compat:.
  - mapToolRowToTool extracts type and compatibility from tags, keeps the remaining tags.
- **Default filters**: DEFAULT_FILTERS centralises the initial state and reset logic.
- **State setup**: hasLoadedOnceRef distinguishes the first load from refreshes.
- **Supabase query with filters** (useEffect on lines ~132-207)
  - Applies search, category, type, compatibility, sort on the server.
  - Escapes % and _ via escapeIlikePattern.
  - Sorts by updated_at for the "recent" option and falls back to 	itle.
  - Rebuilds categories from the result set.
- **Favorites** (loadUserFavorites and usage in handleToggleFavorite)
  - Separate fetch from user_tools; clears favorites when user is absent.
  - Toggle handler performs optimistic update, Supabase upsert, then reloads favorites.
- **Client post-processing**
  - Keeps client filtering for activity/search for UX redundancy while keeping order consistent with server results.
- **Clear filters**
  - Reuses DEFAULT_FILTERS, resets pagination, and syncs URL query params.
- **Validation**
  - 
px tsc --noEmit executed successfully.

### 1.2 Follow-ups / risks
- Ensure Supabase seeds include 	ype: / compat: tags for the new mapping.
- Consider Supabase pagination (
ange) after layout work if dataset grows.
- supabase-js order does not expose 
ullsLast; current usage sticks to { ascending }.

## 2. Layout & Responsiveness (To do)
### Objectives
- Replace the container with <main> + semantic sections; avoid rigid max-w blocks.
- Provide a persistent filter summary bar (chips, counts, loader) above the grid.
- Tune hero, grid, and spacing for mobile / tablet / desktop.
- Disable ackgroundAttachment: 'fixed' for touch devices.
- Revisit skeletons and empty/error states for consistent visuals.

### Suggested subtasks
1. **Base structure**: convert main wrapper to <main className="relative mx-auto ...">, introduce sections/breadcrumbs.
2. **Filter bar**: chips with quick removal, badge counter, integrate Loader2 when refetching.
3. **Grid/events**: explicit breakpoints (1/2/3/4 columns), align card heights.
4. **Hero/CTAs**: refine typography and call-to-action placement.
5. **Feedback**: unify alerts/toasts (consider shadcn Alert), inline loading, and error surfaces.

### 2.1 Progresso recente
- Wrapper principal usa <main> com skip-link, background adaptativo e padding consistente (src/app/tools/page.tsx).
- Barra persistente exibe contador, carregamento Loader2, chips removÃ­veis e CTA de limpar filtros.
- Drawer mobile usa cabeÃ§alho fixo, corpo rolÃ¡vel e padding seguro (src/components/tools/ToolsFiltersDrawer.tsx).
- Skeletons, load-more e empty state alinhados ao novo grid responsivo (1 â†’ 4 colunas).

### 2.2 PrÃ³ximos passos
- Ajustar ToolCard/Modal para alturas consistentes e foco declarado.
- Validar comportamento em telas <640px (scroll do drawer + fixar cabeÃ§alho).
- Revisar gradientes/backdrop para reduzir opacidade em temas claros.


### Dependencies
- UX decisions (wireframes, design tokens).
- Possible helper hooks for breakpoints or reduced motion handling.

## 3. Filter Components (To do)
- **SearchBar**: ensure keyboard nav, aria-live accuracy, mobile layout, fix icon encoding, possibly adopt shadcn Command/Combobox patterns.
- **ToolsFiltersDrawer**: reuse toggle helpers to avoid duplicate logic, consider grouping filters (tabs/accordions), sticky footer with actions, summary of active filters.
- **Filter summary**: represent active filters as removable chips outside the drawer.
### 3.1 Progresso recente
- SearchBar refeito com navegaÃ§Ã£o por teclado, resumos aria-live e sugestÃµes de quick filters acessÃ­veis (src/components/search/SearchBar.tsx).
- ToolsFiltersDrawer reorganizado com resumo de chips, seÃ§Ãµes agrupadas, sticky footer e integraÃ§Ã£o com tipos/compatibilidades (src/components/tools/ToolsFiltersDrawer.tsx).
- SearchBar e ToolsFiltersDrawer com strings/Ã­cones normalizados (acentos vÃ¡lidos) e atributos de combobox ajustados para manter aria-expanded vÃ¡lido; lint/tsc limpos (npm run lint, npx tsc --noEmit).

### 3.2 PrÃ³ximos passos
- Avaliar uso de Command/Combox para busca avanÃ§ada dentro do drawer.
- Incluir filtros salvos e suporte a combinaÃ§Ãµes multi-select persistentes.
- Garantir testes de teclado completos (tab/shift+tab) em todos os componentes.

## 4. Cards / Modal / Favorites (To do)
- Standardise quick actions (favorite, open modal) with accessible patterns.
- Align skeleton vs. final card visuals to reduce duplication.
- Cards e modal com interações de favorito/abre modal padronizadas, foco controlado e strings saneadas (src/components/cards/ToolCard.tsx, src/components/modals/ToolModal.tsx).
- Update modal notifications (loading, saved states) and confirm copy actions feedback.
- Ensure favorite state is in sync after Supabase operations (already ready in the data layer).

## 5. Validation & QA (To do)
- Run npm run smoke:dev (/, /api/auth/admin, /test-supabase).
- Draft Playwright scenarios (mobile vs desktop filters, favorites, drawer interactions).
- Accessibility checklist: keyboard flow, aria attributes, reduced motion, contrast.
- Performance: watch layout shifts, skeleton timing, background behaviour.

## Reference Material
- Supabase types: src/types/database.ts.
- shadcn CLI: 
px shadcn@latest list '@shadcn' --query <component>.
- Prior analyses: docs/tools_filters_review_report.md, docs/accessibility_review_tools_page.md, docs/dashboard-redesign/*.

---

> Keep this file updated whenever a phase or subtask changes status. Link to PRs, commits, or screenshots as we progress.
