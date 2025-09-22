# Phase 1.2 - Current Dashboard Assessment

## Files and Dependencies
- Entry: src/app/dashboard/page.tsx (client component wrapped by ProtectedRoute).
- Shared layouts: Layout uses Header (src/components/layout/Header), BackgroundOverlay, Background context.
- Data contexts: useAuth (supabase auth + profiles table), useBackground.
- UI building blocks: Carousel, TrackCard, ToolCard, ToolModal.
- Animation utilities: framer-motion, custom MOTION_CONSTANTS.

## Component Map
- **ProtectedRoute**: client-side gatekeeping; redirects unauthenticated users.
- **Hero area**: animated greeting, command bar with icebreaker pills.
- **Track sections**: two Carousel instances using TrackCard (compact + full variants).
- **Tool section**: Carousel with ToolCard full variant; opens ToolModal.
- **Modal**: ToolModal handles clipboard, localStorage edits, compatibility badges.

## Data and Supabase Integration
- Dashboard currently relies on mock arrays (MOCK_TRACKS, MOCK_RECOMMENDED_TRACKS, MOCK_TOOLS).
- Supabase usage limited to AuthContext profile display_name for greeting.
- No live Supabase queries, caching, or subscriptions; favorites only stored in component state.
- Router interactions push to static routes (/tracks/:id, /tools).

## UX and IA Observations
- **Content density**: Three horizontal carousels stacked; little vertical hierarchy beyond section headings.
- **Action clarity**: Primary CTA is the command bar submit button; subsequent cards rely on hover states to reveal actions.
- **Personalization**: Greeting only dynamic element; rest of dashboard not personalized despite available profile metrics (level, streak, credits).
- **Feedback**: Favorite toggles log to console only; no toasts, no persistence, no disabled states post-error.
- **Copy mix**: Portuguese labels plus occasional English (e.g., Continue sua Trilha vs placeholder text).

## Responsiveness Review
- Carousel enforces 85% width items on mobile, but sections share same layout; hero min-height 40vh may push content below fold on small screens.
- Command bar animation uses scale transform; layout relies on min-w card widths that may cause horizontal scroll even on small screens.
- Background image fixed attachment may jank on mobile Safari.
- ToolModal introduces mobile variant classes (mobile: prefix) but relies on custom Tailwind variant (needs confirmation).

## Motion and Interaction
- Extensive framer-motion usage per card; no centralized motion tokens; potential redundancy.
- Command bar characters animate individually via inline map, causing 50ms delays per letter – can be heavy on large names.
- Carousels use smooth scrolling plus manual button states but no focus management.

## Accessibility Gaps
- Missing page landmarks (main/section roles) beyond header.
- Command form lacks associated label or aria description for placeholder-only input.
- Icebreaker buttons rely on color + hover; no aria annotations on toggle.
- Carousel navigation buttons hidden on mobile; keyboard users must tab through entire scroll area.
- ToolModal uses confirm() for restore (blocking, not labelled), removes body scroll with inline style but no inert attribute for background.
- Favorite buttons rely on color to indicate state; no textual state besides aria-pressed but no sr-only text.

## Performance Considerations
- Large remote Unsplash images used directly as backgrounds and card thumbnails (no optimization, no Image component for hero).
- No skeletons or loading placeholders; content pops after state ready.
- Modal loads entire prompt content even when collapsed; no virtualization for long text.
- Multiple map renders without memoization; acceptable now but may degrade with real data.

## Reliability and Error Handling
- Favorites toggle handlers async but swallow errors with console.error; no user feedback.
- Clipboard write lacks fallback for HTTP or permission errors.
- Router push on ProtectedRoute for unauthenticated user can trigger navigation loops without awaiting (should use replace).

## User Flow Summary
1. Arrival -> ProtectedRoute ensures auth -> background overlay displayed.
2. User sees greeting + command input -> optionally selects icebreaker -> submit navigates to chat with query param.
3. Scroll down to track carousels -> click card -> pushes to /tracks/:id (page not implemented).
4. Tools carousel -> click -> opens ToolModal -> optional copy/edit favorites (state only).

## Key Pain Points to Address
- Replace mock data with Supabase queries (profiles, tracks, tools, user favorites).
- Introduce clear content grouping (overview metrics, growth, tasks, learning).
- Provide responsive grid alternative to carousels, especially for desktop analytics.
- Harden a11y with labels, focus traps, keyboard nav, and reduced-motion support.
- Improve performance through image optimization, suspense loaders, and caching layers.
- Ensure interactions (favorites, copy) persist and provide user-visible feedback.

Artifacts pending: Playwright screenshot automation once stable dev server is available (blocked during review because Next dev server must run persistently in CLI).