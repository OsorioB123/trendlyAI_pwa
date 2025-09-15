-- =====================================================
-- User Tracks: cria progresso de trilha por usuário
-- Dependências: tracks_data.sql, profiles existentes
-- =====================================================

-- Falci inicia "Marketing Digital"
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), tr AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'Marketing Digital' LIMIT 1
)
INSERT INTO public.user_tracks (user_id, track_id, progress_percentage, started_at, is_favorite)
SELECT u.user_id, tr.track_id, 25, now(), true FROM u, tr
ON CONFLICT (user_id, track_id) DO UPDATE SET progress_percentage = 25, is_favorite = true, last_accessed = now();

-- Osório em "IA Generativa Avançada"
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), tr AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'IA Generativa Avançada' LIMIT 1
)
INSERT INTO public.user_tracks (user_id, track_id, progress_percentage, started_at, is_favorite)
SELECT u.user_id, tr.track_id, 60, now(), true FROM u, tr
ON CONFLICT (user_id, track_id) DO UPDATE SET progress_percentage = 60, is_favorite = true, last_accessed = now();

