# Phase 2.1 - Dashboard Redesign Implementation Plan

Goals: elevate information hierarchy for creators, preserve Supabase auth/storage, and ship a responsive PWA-ready dashboard with motion and accessibility best practices.

## 1. Page Structure & Wireframe
- Page shell: keep ProtectedRoute + Header + BackgroundOverlay, move hero into responsive container, replace fixed background image with themed gradient token.
- Above the fold (desktop): two-column layout with width clamp (max 1280px).
- Left column: Command Hub card (prompt input, saved prompts, quick links to create content/chat).
- Right column: Creator Snapshot card (avatar, streak, credits, upcoming events, CTA to update profile).
- Below fold sections (desktop order):
  1. Performance KPIs grid (4 metric cards with mini sparkline charts).
  2. Growth Insights tabs (Audience, Revenue, Content) combining Area/Bar charts and key ratios.
  3. Action Queue table (scheduled posts, review requests, Supabase tasks) with quick actions.
  4. Content Highlights list (top performing posts with engagement deltas and trend badges).
  5. Learning Progress grid (user tracks with progress bars, resume CTA).
  6. AI Toolbelt library (prompt cards, quick copy, Dialog-based detail panels).
- Tablet: stack columns with sticky Command Hub, scrollable KPI row via ScrollArea.
- Mobile: linear sections, hero compresses into single card, bottom Sheet exposes quick actions and notifications.

## 2. Information Hierarchy & UX
- Emphasize measurable progress: top metrics summarize reach, revenue, community, learning streak.
- Provide explicit CTAs: "Create new drop", "Resume track", "Open chat", "View analytics".
- Segment content by intent: Overview (metrics), Act (tasks/toolbelt), Learn (tracks).
- Add context helpers: tooltips for metrics, inline insights ("+12% vs last week").
- Personalize copy using profile preferences (level, goals).

## 3. Motion & Interaction Plan
- Use Tailwind transition utilities for standard hover/focus; reserve framer-motion for section reveal and chart transitions.
- Animate Command Hub focus (scale + glow) under 200ms, respect prefers-reduced-motion.
- Stagger KPI cards with 60ms delay on initial load; use IntersectionObserver to trigger when in viewport.
- Charts use minimal tweening (opacity/translate) when switching tabs to avoid jank.
- Provide micro-interaction for favorites and copy (Toast + subtle scale).

## 4. Accessibility & Responsive Standards
- Ensure semantic landmarks: header, main, sections, nav, aside as needed.
- Link Command Hub input to visible label, add aria-describedby for hint text.
- All interactive elements get focus ring and keyboard handlers (Space/Enter).
- Provide skip link to main content; ensure tab order follows reading order.
- Honor prefers-reduced-motion, dark/light themes (respect existing background context).
- Maintain minimum touch target 44x44px, high contrast (>= 4.5:1).

## 5. Supabase Data & Integration
- Profiles: load via AuthContext; extend to fetch streak_days, credits, preferences.
- Tracks: reuse TrackService.getRecommendedTracks, map to progress grid, subscribe to user_tracks changes for real-time progress.
- Tools: create ToolService (tools + user_tools favorites), support optimistic favorite toggle + copy history.
- Analytics metrics: introduce DashboardService pulling aggregated metrics from tables (e.g., content_performance, subscriptions). If missing, mock via edge functions placeholder.
- Notifications/tasks: fetch from support_tickets or create lightweight actions table; fallback to static suggestions.
- Use SWR or React Query to cache reads, with Supabase channel subscriptions for real-time updates.
- Error handling: central error boundary per section with Alert component and retry button.

## 6. Loading, Error, and Empty States
- Display Skeleton grid for KPIs and Content Highlights while queries resolve.
- Show zero-state illustrations (e.g., no scheduled posts) with CTA to create one.
- Use Toast + Alert for Supabase mutations (favorites, prompt saves).
- Provide offline notice leveraging PWA service worker events.

## 7. Performance Strategy
- Replace Unsplash hero backgrounds with local optimized assets or gradient tokens.
- Lazy-load heavy modules (charts, Tool Dialog content) via dynamic import.
- Memoize derived data (e.g., computed deltas) and defer non-critical animation until idle.
- Prefetch chat route when user focuses Command Hub.
- Continue using service worker for caching shell; add stale-while-revalidate around Supabase REST calls.

## 8. Implementation Milestones
1. Scaffold new layout structure + responsive grid with placeholder data.
2. Wire Supabase data hooks (metrics, tracks, tools) with caching and real-time updates.
3. Replace custom components with Shadcn primitives (Card, Tabs, Table, Dialog, Progress, Tooltip).
4. Integrate charts (Recharts) with theming + accessibility labels.
5. Add motion + skeleton + empty states with prefers-reduced-motion fallbacks.
6. QA: a11y checks, smoke tests, PWA performance review, Playwright capture.

## 9. Risks & Mitigations
- Data gaps: if analytics tables incomplete, introduce API stub service returning mock metrics behind feature flag.
- Performance regression: monitor bundle size using next build analyze, split charts to separate chunk.
- Supabase rate limits: batch requests via RPC when possible, avoid per-card queries.
- Regression fallback: maintain feature flag to toggle new dashboard vs legacy until stable.