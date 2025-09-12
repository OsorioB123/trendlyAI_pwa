-- =====================================================
-- User Module Progress: marca módulos concluídos
-- Dependências: track_modules_data.sql, user_tracks_data.sql
-- =====================================================

-- Falci completa 1 módulo de "Marketing Digital"
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), tr AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'Marketing Digital' LIMIT 1
), m AS (
  SELECT id AS module_id FROM public.track_modules WHERE track_id = (SELECT track_id FROM tr) ORDER BY order_index ASC LIMIT 1
)
INSERT INTO public.user_module_progress (user_id, track_id, module_id, is_completed, completed_at)
SELECT u.user_id, tr.track_id, m.module_id, true, now() FROM u, tr, m
ON CONFLICT (user_id, module_id) DO NOTHING;

-- Osório completa 2 módulos de "IA Generativa Avançada"
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), tr AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'IA Generativa Avançada' LIMIT 1
), m AS (
  SELECT id AS module_id FROM public.track_modules WHERE track_id = (SELECT track_id FROM tr) ORDER BY order_index ASC LIMIT 2
)
INSERT INTO public.user_module_progress (user_id, track_id, module_id, is_completed, completed_at)
SELECT u.user_id, tr.track_id, m.module_id, true, now() FROM u, tr, m
ON CONFLICT (user_id, module_id) DO NOTHING;

