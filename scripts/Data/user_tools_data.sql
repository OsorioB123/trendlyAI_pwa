-- =====================================================
-- User Tools: marca favoritos e uso
-- Dependências: tools_data.sql, profiles existentes
-- =====================================================

-- Falci favorita: Gerador de Roteiros
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), t AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Gerador de Roteiros' LIMIT 1
)
INSERT INTO public.user_tools (user_id, tool_id, is_favorite, usage_count)
SELECT u.user_id, t.tool_id, true, 3 FROM u, t
ON CONFLICT (user_id, tool_id) DO UPDATE SET is_favorite = true, usage_count = GREATEST(public.user_tools.usage_count, 3);

-- Osório favorita: Análise de Tendências
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), t AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Análise de Tendências' LIMIT 1
)
INSERT INTO public.user_tools (user_id, tool_id, is_favorite, usage_count)
SELECT u.user_id, t.tool_id, true, 5 FROM u, t
ON CONFLICT (user_id, tool_id) DO UPDATE SET is_favorite = true, usage_count = GREATEST(public.user_tools.usage_count, 5);

