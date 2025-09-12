# Content Management

## Current State
- Tables: `tracks`, `track_modules`, `tools`, `user_tracks`, `user_module_progress`, `track_reviews`.
- JSONB used for `tracks.content`, `track_modules.content/tools`, `tools.configuration`.
- Frontend/services and seed scripts assume extra fields on `tracks` not present in schema (subtitle, category, difficulty_level, estimated_duration, cover_image, is_premium, total_modules, order_index).  
- RLS: read for published/active; self-owned progress manageable by user.

## Gap Analysis
- Schema/app drift in `tracks` blocks population scripts and UI mapping.
- Premium access not enforced at DB (tools/tracks).  
- Indexing gaps for module ordering and progress lookups.
- `track_reviews` present; no aggregate materialization, may cause N+1 or scans.

## Recommendations
- Align `tracks` schema to app expectations (add columns); provide mapping views for legacy.
- Add GIN indexes on JSONB/search fields and composite indexes for common queries.
- Enforce premium gating in policies or views.
- Add helper views for ratings (avg, count) and for track with modules to simplify selects.

## Implementation Specifics (SQL)
1) Tracks Harmonization
```sql
ALTER TABLE public.tracks 
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS difficulty_level text,
  ADD COLUMN IF NOT EXISTS estimated_duration text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_modules int,
  ADD COLUMN IF NOT EXISTS order_index int;
CREATE INDEX IF NOT EXISTS idx_tracks_order ON public.tracks(order_index);
```
2) Content Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_track_modules_track_order 
  ON public.track_modules(track_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_tracks_user_track ON public.user_tracks(user_id, track_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress ON public.user_module_progress(user_id, track_id, module_id);
CREATE INDEX IF NOT EXISTS idx_tracks_tags ON public.tracks USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_tracks_content ON public.tracks USING GIN (content);
CREATE INDEX IF NOT EXISTS idx_tools_configuration ON public.tools USING GIN (configuration);
```
3) Ratings View
```sql
CREATE OR REPLACE VIEW public.track_review_stats AS
SELECT track_id,
       COUNT(*)::int AS reviews_count,
       AVG(rating)::numeric(4,2) AS average_rating
FROM public.track_reviews
GROUP BY track_id;
```
4) Premium RLS (example for tracks)
```sql
CREATE POLICY "View published tracks with premium check"
ON public.tracks FOR SELECT TO authenticated
USING (
  is_published = true AND (
    NOT COALESCE(is_premium,false) OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      WHERE s.user_id = auth.uid() AND s.status = 'active'
    )
  )
);
```

## Prioridade
- Alta: schema alignment for `tracks` + indexes.
- Média: ratings view and premium RLS.
- Baixa: optional helper views for `TrackWithModules` composition.

