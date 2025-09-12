-- =====================================================
-- TrendlyAI — SEED ALL DATA (DEV/TEST)
-- Runs all per-table data inserts/updates in one transaction
-- Pre-req: Auth users exist for falci@trendlycorp.com and osorio@trendlycorp.com
-- =====================================================

BEGIN;

-- profiles_data.sql
UPDATE public.profiles
   SET full_name = COALESCE(full_name, 'Falci'),
       username = COALESCE(username, '@falci'),
       bio = COALESCE(bio, 'Criador Explorador na TrendlyAI'),
       preferences = COALESCE(preferences, '{}'::jsonb) || '{"studio_theme":"default"}'::jsonb
 WHERE email = 'falci@trendlycorp.com';

UPDATE public.profiles
   SET full_name = COALESCE(full_name, 'Osório'),
       username = COALESCE(username, '@osorio'),
       bio = COALESCE(bio, 'Criador Premium na TrendlyAI'),
       preferences = COALESCE(preferences, '{}'::jsonb) || '{"studio_theme":"midnight"}'::jsonb
 WHERE email = 'osorio@trendlycorp.com';

-- subscriptions_data.sql
INSERT INTO public.subscription_plans (name, description, price_brl, billing_interval, credits_limit, features, is_active)
SELECT 'Mestre Criador', 'Plano completo para criadores profissionais', 29.90, 'month', 5000,
       '{"unlimited_insights": true, "priority_support": true}'::jsonb, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_plans WHERE name = 'Mestre Criador'
);

WITH os AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), pl AS (
  SELECT id AS plan_id FROM public.subscription_plans WHERE name = 'Mestre Criador' ORDER BY created_at ASC LIMIT 1
)
INSERT INTO public.subscriptions (
  user_id, plan_id, status, current_period_start, current_period_end, credits_used, metadata
) SELECT os.user_id, pl.plan_id, 'active', now(), now() + interval '30 days', 0, '{}'::jsonb
  FROM os, pl
ON CONFLICT (user_id) DO UPDATE
  SET plan_id = EXCLUDED.plan_id,
      status = 'active',
      current_period_start = now(),
      current_period_end = now() + interval '30 days',
      updated_at = now();

-- tools_data.sql
INSERT INTO public.tools (title, description, category, icon, content, is_active, tags)
VALUES
  ('Gerador de Roteiros', 'Crie roteiros profissionais para seus vídeos', 'Criação', 'FileText', 'Prompt base para roteiros...', true, ARRAY['roteiro','vídeo','story']),
  ('Análise de Tendências', 'Descubra tendências do momento', 'Análise', 'TrendingUp', 'Prompt base para análise...', true, ARRAY['tendências','análise','insights']),
  ('Editor de Thumbnails', 'Crie thumbnails irresistíveis', 'Design', 'Image', 'Prompt para thumbnails...', true, ARRAY['design','thumbnail']),
  ('Gerador de Hashtags', 'Encontre as melhores hashtags', 'Marketing', 'Hash', 'Prompt para hashtags...', true, ARRAY['social','hashtags'])
ON CONFLICT DO NOTHING;

-- tracks_data.sql
INSERT INTO public.tracks (
  title, subtitle, description, category, difficulty_level, estimated_duration, thumbnail_url, is_premium, total_modules, is_published
)
VALUES
  ('IA Generativa Avançada', 'Domine IA para conteúdo', 'Técnicas avançadas de IA generativa', 'IA', 'Avançado', '3h',
   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', true, 6, true),
  ('Design para Criadores', 'Princípios visuais', 'Design focado em criadores de conteúdo', 'Design', 'Intermediário', '2h',
   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', false, 5, true),
  ('Marketing Digital', 'Estratégias 2025', 'Marketing completo e prático', 'Marketing', 'Iniciante', '1h30',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', false, 4, true)
ON CONFLICT DO NOTHING;

-- track_modules_data.sql
WITH t AS (SELECT id FROM public.tracks WHERE title = 'IA Generativa Avançada' LIMIT 1)
INSERT INTO public.track_modules (track_id, title, content, order_index, video_url, tools)
SELECT t.id, 'Briefing e Objetivos', '{"briefing":"Definir objetivos do conteúdo","prompts":[]}'::jsonb, 1, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Técnicas de Prompt', '{"briefing":"Técnicas avançadas","prompts":[]}'::jsonb, 2, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Refinamento e Publicação', '{"briefing":"Refinar e publicar","prompts":[]}'::jsonb, 3, NULL, '[]'::jsonb FROM t
ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM public.tracks WHERE title = 'Design para Criadores' LIMIT 1)
INSERT INTO public.track_modules (track_id, title, content, order_index, video_url, tools)
SELECT t.id, 'Fundamentos de Layout', '{"briefing":"Composição visual","prompts":[]}'::jsonb, 1, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Cores e Tipografia', '{"briefing":"Paletas e fontes","prompts":[]}'::jsonb, 2, NULL, '[]'::jsonb FROM t
ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM public.tracks WHERE title = 'Marketing Digital' LIMIT 1)
INSERT INTO public.track_modules (track_id, title, content, order_index, video_url, tools)
SELECT t.id, 'Público e Oferta', '{"briefing":"ICP e proposta","prompts":[]}'::jsonb, 1, NULL, '[]'::jsonb FROM t
UNION ALL
SELECT t.id, 'Métricas e Ajustes', '{"briefing":"KPIs e otimização","prompts":[]}'::jsonb, 2, NULL, '[]'::jsonb FROM t
ON CONFLICT DO NOTHING;

-- faq_categories_data.sql
INSERT INTO public.faq_categories (slug, name, description, icon, sort_order, is_active)
VALUES
  ('primeiros-passos', 'Primeiros Passos', 'Como começar a usar a TrendlyAI', 'Rocket', 1, true),
  ('assinatura', 'Assinatura', 'Planos e pagamentos', 'Gem', 2, true),
  ('ferramentas', 'Ferramentas', 'Uso das ferramentas de IA', 'Zap', 3, true),
  ('tecnico', 'Técnico', 'Questões técnicas e suporte', 'HardDrive', 4, true)
ON CONFLICT DO NOTHING;

-- faq_items_data.sql
INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'O que é a TrendlyAI?', 'Orquestra de IA para criadores de conteúdo.', 1, true, true
FROM public.faq_categories WHERE slug = 'primeiros-passos'
ON CONFLICT DO NOTHING;

INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Como começo a usar?', 'Acesse a Home, converse com a IA e explore as ferramentas.', 2, false, true
FROM public.faq_categories WHERE slug = 'primeiros-passos'
ON CONFLICT DO NOTHING;

INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Como funciona o cancelamento?', 'Você pode cancelar a qualquer momento no painel.', 1, true, true
FROM public.faq_categories WHERE slug = 'assinatura'
ON CONFLICT DO NOTHING;

INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Como usar os prompts?', 'Cada ferramenta possui prompts prontos para personalização.', 1, true, true
FROM public.faq_categories WHERE slug = 'ferramentas'
ON CONFLICT DO NOTHING;

INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Meus dados estão seguros?', 'Seguimos melhores práticas e criptografia de ponta a ponta.', 1, true, true
FROM public.faq_categories WHERE slug = 'tecnico'
ON CONFLICT DO NOTHING;

-- conversations_data.sql
WITH u AS (SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com')
INSERT INTO public.conversations (user_id, title)
SELECT u.user_id, 'Ideias de Conteúdo' FROM u
UNION ALL
SELECT u.user_id, 'Estratégia de Publicação' FROM u
ON CONFLICT DO NOTHING;

WITH u AS (SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com')
INSERT INTO public.conversations (user_id, title)
SELECT u.user_id, 'Fluxo Premium' FROM u
UNION ALL
SELECT u.user_id, 'Campanha Sazonal' FROM u
ON CONFLICT DO NOTHING;

-- messages_data.sql
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), c AS (
  SELECT id AS conversation_id FROM public.conversations
   WHERE title = 'Ideias de Conteúdo' AND user_id = (SELECT user_id FROM u) LIMIT 1
)
INSERT INTO public.messages (conversation_id, role, content, tokens_used)
SELECT c.conversation_id, 'assistant', 'Olá! Vamos gerar ideias de conteúdo?', 42 FROM c
UNION ALL
SELECT c.conversation_id, 'user', 'Quero 5 ideias para reels de marketing.', 24 FROM c
ON CONFLICT DO NOTHING;

WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), c AS (
  SELECT id AS conversation_id FROM public.conversations
   WHERE title = 'Fluxo Premium' AND user_id = (SELECT user_id FROM u) LIMIT 1
)
INSERT INTO public.messages (conversation_id, role, content, tokens_used)
SELECT c.conversation_id, 'assistant', 'Bem-vindo ao fluxo premium! Pronto para otimizar?', 35 FROM c
UNION ALL
SELECT c.conversation_id, 'user', 'Sim! Vamos criar um plano de campanha.', 28 FROM c
ON CONFLICT DO NOTHING;

-- user_tools_data.sql
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), t AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Gerador de Roteiros' LIMIT 1
)
INSERT INTO public.user_tools (user_id, tool_id, is_favorite, usage_count)
SELECT u.user_id, t.tool_id, true, 3 FROM u, t
ON CONFLICT (user_id, tool_id) DO UPDATE SET is_favorite = true, usage_count = GREATEST(public.user_tools.usage_count, 3);

WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), t AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Análise de Tendências' LIMIT 1
)
INSERT INTO public.user_tools (user_id, tool_id, is_favorite, usage_count)
SELECT u.user_id, t.tool_id, true, 5 FROM u, t
ON CONFLICT (user_id, tool_id) DO UPDATE SET is_favorite = true, usage_count = GREATEST(public.user_tools.usage_count, 5);

-- user_tracks_data.sql
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), tr AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'Marketing Digital' LIMIT 1
)
INSERT INTO public.user_tracks (user_id, track_id, progress_percentage, started_at, is_favorite)
SELECT u.user_id, tr.track_id, 25, now(), true FROM u, tr
ON CONFLICT (user_id, track_id) DO UPDATE SET progress_percentage = 25, is_favorite = true, last_accessed = now();

WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), tr AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'IA Generativa Avançada' LIMIT 1
)
INSERT INTO public.user_tracks (user_id, track_id, progress_percentage, started_at, is_favorite)
SELECT u.user_id, tr.track_id, 60, now(), true FROM u, tr
ON CONFLICT (user_id, track_id) DO UPDATE SET progress_percentage = 60, is_favorite = true, last_accessed = now();

-- user_module_progress_data.sql
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

COMMIT;
