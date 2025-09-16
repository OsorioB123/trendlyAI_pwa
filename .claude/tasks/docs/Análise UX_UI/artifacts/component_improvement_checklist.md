# Component Improvement Checklist

## Formulários (Login/Registro/Settings)
- [ ] Migrar inputs para `components/ui/input` + `ui/label` + ajuda/erro padronizados
- [ ] Adicionar `.focus-ring` + mensagens de erro com `aria-live="polite"`
- [ ] Validar contraste placeholder/labels em fundo gradiente/glass
- [ ] Botões: primário/secondary/ghost destrinchados e consistentes

## Modais/Drawers
- [ ] Padronizar em `ui/dialog`/`ui/sheet` (Radix)
- [ ] Foco inicial no título/campo principal e retorno de foco ao elemento de origem
- [ ] `aria-labelledby`/`aria-describedby` e fechar com Esc/overlay
- [ ] Animações via `MOTION_CONSTANTS` e `respectReducedMotion`

## Search/Filters
- [ ] Consolidar para uma única `SearchBar` com prop `variant` (tools/tracks)
- [ ] Persistir filtros em querystring e restaurar no mount
- [ ] `aria-live` para contagem de resultados e loading
- [ ] Chips/toggles com `role`/`aria-pressed` e focus visível

## Cards (Tools/Tracks)
- [ ] Tornar clicáveis como `a`/`button` semântico; tabIndex e Enter/Space
- [ ] Hover/tap: scale 1.02/0.98; sombra +1 nível; 200ms smooth
- [ ] Estados: loading (Skeleton), empty (CTA), error (retry)
- [ ] Favoritos/copiar: feedback visual + `aria-live`

## Navegação
- [ ] Header: foco/aria para menus (notificações/perfil/créditos)
- [ ] MobileBottomNav: ripple/tap com reduced-motion; `aria-current` no item ativo
- [ ] Command Palette (Cmd+K) com `ui/command` para rotas principais

## Chat
- [ ] `aria-live` para status “Pensando…” e mensagens novas
- [ ] Input com atalhos (Shift+Enter) e ajuda acessível
- [ ] Gerenciar “busy/loading” no container, bloqueando ação duplicada

