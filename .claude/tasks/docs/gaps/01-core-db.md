# Core Database Analysis

## Current State
- Canonical docs confirm 15 core tables; repo schema includes extras (e.g., `subscription_plans`, `payment_methods`, `billing_history`, FAQ/support).  
- Notable mismatches between app and DB:
  - Chat: code expects `conversations.user_id` and `messages.role`; schema uses `created_by` + `conversation_participants` and `messages.sender_id/message_type`.
  - Content: code/scripts expect `tracks.subtitle, category, difficulty_level, estimated_duration, cover_image, is_premium, total_modules, order_index`; schema has `difficulty, duration_minutes, background_image, tags`.
  - Product/Prices (Stripe) in docs vs. `subscription_plans/*` in schema.
- RLS present on main tables; timestamp triggers exist for key tables.

## Gap Analysis
- Consistency: Frontend services and seed scripts diverge from schema (high risk of runtime failures).
- Integrity: Missing FKs in some areas of docs (e.g., `payment_history.subscription_id`) vs actual new billing tables.
- Performance: Missing common indexes: 
  - `track_modules(track_id, order_index)`; 
  - `user_module_progress(user_id, track_id, module_id)`; 
  - `user_tracks(user_id, track_id)` unique exists but no composite index for reads; 
  - JSONB fields (`tracks.content`, `tools.configuration`) without GIN indexes.
- RLS: Some policies are “authenticated can read all active” without premium checks; premium gating not enforced at DB.

## Recommendations
- Choose a single source of truth for schema: either (A) extend DB to match app/scripts, or (B) refactor app to match current DB. Prefer A for content domain to avoid refactor cost.
- Add missing columns to `tracks` and harmonize names; add views for backward compatibility if needed.
- Chat domain: adopt participants model; add compatibility view for `conversations_with_owner` exposing `user_id` for legacy code.
- Standardize subscriptions to `subscription_plans/subscriptions/billing_history/payment_methods`; deprecate `products/prices` references in docs.
- Add suggested indexes and premium gating via policies.

## Implementation Specifics (SQL)
1) Harmonize Tracks
```sql
ALTER TABLE public.tracks 
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS difficulty_level text,
  ADD COLUMN IF NOT EXISTS estimated_duration text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_modules int;
```
2) Content Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_track_modules_track_order 
  ON public.track_modules(track_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_composite 
  ON public.user_module_progress(user_id, track_id, module_id);
CREATE INDEX IF NOT EXISTS idx_tracks_content_gin 
  ON public.tracks USING GIN (content);
CREATE INDEX IF NOT EXISTS idx_tools_configuration_gin 
  ON public.tools USING GIN (configuration);
```
3) Chat Compatibility View
```sql
CREATE OR REPLACE VIEW public.conversations_legacy AS
SELECT c.id,
       cp.user_id AS user_id,
       c.title,
       c.created_at,
       c.updated_at
FROM public.conversations c
JOIN public.conversation_participants cp
  ON cp.conversation_id = c.id;
```
4) Premium Access Policy Example
```sql
CREATE POLICY "Only non-premium or premium users can view tools"
ON public.tools FOR SELECT TO authenticated
USING (
  NOT is_premium OR EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = auth.uid() AND s.status = 'active'
  )
);
```

## Prioridade
- Alta: schema–app mismatches (chat, tracks), premium gating, indexes.
- Média: deprecate products/prices docs; add JSONB indexes.
- Baixa: views for legacy compatibility once app is refactored.

