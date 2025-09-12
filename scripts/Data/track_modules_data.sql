-- =====================================================
-- Track Modules: insere módulos por trilha
-- Dependências: tracks_data.sql
-- =====================================================

-- IA Generativa Avançada (3 módulos de exemplo)
WITH t AS (
  SELECT id FROM public.tracks WHERE title = 'IA Generativa Avançada' LIMIT 1
)
INSERT INTO public.track_modules (track_id, title, content, order_index, video_url, tools)
SELECT t.id, 'Briefing e Objetivos', '{"briefing":"Definir objetivos do conteúdo","prompts":[]}'::jsonb, 1, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Técnicas de Prompt', '{"briefing":"Técnicas avançadas","prompts":[]}'::jsonb, 2, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Refinamento e Publicação', '{"briefing":"Refinar e publicar","prompts":[]}'::jsonb, 3, NULL, '[]'::jsonb FROM t
ON CONFLICT DO NOTHING;

-- Design para Criadores (2 módulos de exemplo)
WITH t AS (
  SELECT id FROM public.tracks WHERE title = 'Design para Criadores' LIMIT 1
)
INSERT INTO public.track_modules (track_id, title, content, order_index, video_url, tools)
SELECT t.id, 'Fundamentos de Layout', '{"briefing":"Composição visual","prompts":[]}'::jsonb, 1, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Cores e Tipografia', '{"briefing":"Paletas e fontes","prompts":[]}'::jsonb, 2, NULL, '[]'::jsonb FROM t
ON CONFLICT DO NOTHING;

-- Marketing Digital (2 módulos de exemplo)
WITH t AS (
  SELECT id FROM public.tracks WHERE title = 'Marketing Digital' LIMIT 1
)
INSERT INTO public.track_modules (track_id, title, content, order_index, video_url, tools)
SELECT t.id, 'Público e Oferta', '{"briefing":"ICP e proposta","prompts":[]}'::jsonb, 1, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Métricas e Ajustes', '{"briefing":"KPIs e otimização","prompts":[]}'::jsonb, 2, NULL, '[]'::jsonb FROM t
ON CONFLICT DO NOTHING;
