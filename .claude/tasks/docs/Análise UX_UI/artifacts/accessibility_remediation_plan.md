# Accessibility Remediation Plan (WCAG AA)

## Prioridade 1 (2–4 dias)
- Foco visível global `.focus-ring` e aplicação em todos os controles interativos
- Contraste: overlays de 30–50% atrás de títulos/textos sobre gradientes
- Modais/drawers: foco inicial, trap e retorno de foco; `aria-labelledby`/`aria-describedby`
- Listas/cards clicáveis semânticos (`button`/`a`) com teclado (Enter/Space)

## Prioridade 2 (4–6 dias)
- `aria-live` para toasts e ações (favoritar, copiar, filtros aplicados)
- Estados `aria-busy` em containers durante carregamentos
- Labels/`aria-*` consistentes em inputs, toggles, favoritos
- Navegação por teclado nos menus de Header (perfil/notificações)

## Prioridade 3 (contínuo)
- Respeitar `prefers-reduced-motion` em todas as micro-interações
- Testes manuais com leitor de tela (NVDA/VoiceOver) nos fluxos críticos
- Auditoria recorrente com axe DevTools e Lighthouse

## Métricas de Conclusão
- Lighthouse A11y ≥ 95 em rotas-chave
- 0 issues “Serious/Critical” no axe por tela principal
- Checklist WCAG AA de foco/contraste/modais/teclado 100% atendida

