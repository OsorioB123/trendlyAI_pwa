# Phase 1.3 - Shadcn Component Inventory

## Existing ui/ Components
- **Button** (Button.tsx): primary and secondary actions; supports variants.
- **Skeleton**: placeholder states for loading cards and charts.
- **Toast** plus toast hook: user feedback for favorites, errors.
- **Accordion**: expandable FAQs or insights.
- **Alert**: inline warnings and error banners.
- **AspectRatio**: maintain chart or media proportions.
- **Avatar**: profile identity chips.
- **Badge**: status chips for content type and maturity.
- **Breadcrumb**: navigation context if we add nested sections.
- **Checkbox**: filter controls.
- **Command**: command palette; reuse for search or quick actions.
- **Dialog**: accessible modal base (candidate to replace custom ToolModal).
- **Input**: hero command field or filters.
- **Label**: accessibility for form controls.
- **Popover**: inline detail reveals (trend explanations).
- **Select**: timeframe selectors.
- **Separator**: divide summary sections.
- **Sheet**: slide-over panels (mobile filter drawer).

## Recommended Additions from Shadcn Registry
- **Card**: standardized container for KPI tiles and feed entries.
- **Tabs**: switch between Overview, Growth, Content without navigation reloads.
- **Table / Data Table**: tabular breakdown of recent posts or transactions (wraps TanStack Table).
- **Progress**: consistent progress bar for learning tracks and onboarding completion.
- **Tooltip**: metric definitions, sparkline hover values.
- **Toggle / Switch**: quick filters (for example, show only priority tasks).
- **Dropdown Menu**: item-level actions (share, duplicate prompt, archive).
- **ScrollArea**: accessible horizontal scrolling replacement for custom Carousel.
- **Chart wrappers**: replicate shadcn examples with Recharts line and area charts inside Card.

## Layout Patterns to Compose
- Grid plus Card for responsive sections instead of carousels; apply classes like md:grid-cols-2 and lg:grid-cols-4 for KPI density.
- Combine Tabs and ScrollArea for multi-panel analytics.
- Pair Table with a toolbar built from Input, Select, Checkbox for dataset filters.
- Apply Sheet for mobile filter overlays while keeping desktop filter rail visible.

## Motion and Interaction Enhancements
- Lean on Tailwind transitions and Dialog animations to reduce redundant framer-motion usage.
- Use Skeleton and Progress to show loading states tied to Supabase fetch hooks.
- Trigger Toast on all write actions (favorites, copies, errors).

## Gaps to Cover
- Need charting integration; plan to wrap Recharts primitives under components/ui/charts styled with Card.
- For Kanban-like task views, combine Card and ScrollArea to build lists without extra libraries.
- Replace custom Carousel with accessible ScrollArea plus CSS snap if horizontal layout remains.

## Next Steps
- Once registry access is restored, run npx shadcn@latest add card progress tabs table tooltip dropdown-menu scroll-area to scaffold missing primitives.
- Refactor ToolModal and TrackCard to compose Dialog, Card, Badge, Progress, Tooltip rather than bespoke markup.
- Centralize design tokens via Tailwind theme (colors, radii, spacing) to align new components with Trendly branding.
