-- =====================================================
-- TrendlyAI — CLEAN TEST DATA
-- Removes only the data seeded by the seed scripts, keeps profiles
-- Run in SQL editor with sufficient privileges
-- =====================================================

BEGIN;

-- Prep CTEs for user and track/tool ids
WITH u_falci AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), u_osorio AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), tr_mkt AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'Marketing Digital'
), tr_ia AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'IA Generativa Avançada'
), tl_script AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Gerador de Roteiros'
), tl_trends AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Análise de Tendências'
)
-- Delete user module progress
DELETE FROM public.user_module_progress
WHERE (user_id IN (SELECT user_id FROM u_falci) AND track_id IN (SELECT track_id FROM tr_mkt))
   OR (user_id IN (SELECT user_id FROM u_osorio) AND track_id IN (SELECT track_id FROM tr_ia));

-- Delete user tracks
WITH u_falci AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), u_osorio AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), tr_mkt AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'Marketing Digital'
), tr_ia AS (
  SELECT id AS track_id FROM public.tracks WHERE title = 'IA Generativa Avançada'
)
DELETE FROM public.user_tracks ut
WHERE (ut.user_id IN (SELECT user_id FROM u_falci) AND ut.track_id IN (SELECT track_id FROM tr_mkt))
   OR (ut.user_id IN (SELECT user_id FROM u_osorio) AND ut.track_id IN (SELECT track_id FROM tr_ia));

-- Delete user tools
WITH u_falci AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), u_osorio AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), tl_script AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Gerador de Roteiros'
), tl_trends AS (
  SELECT id AS tool_id FROM public.tools WHERE title = 'Análise de Tendências'
)
DELETE FROM public.user_tools ut
WHERE (ut.user_id IN (SELECT user_id FROM u_falci) AND ut.tool_id IN (SELECT tool_id FROM tl_script))
   OR (ut.user_id IN (SELECT user_id FROM u_osorio) AND ut.tool_id IN (SELECT tool_id FROM tl_trends));

-- Delete messages linked to seeded conversation titles
WITH u_falci AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), u_osorio AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
), c_falci AS (
  SELECT id AS conversation_id FROM public.conversations WHERE user_id IN (SELECT user_id FROM u_falci) AND title IN ('Ideias de Conteúdo','Estratégia de Publicação')
), c_osorio AS (
  SELECT id AS conversation_id FROM public.conversations WHERE user_id IN (SELECT user_id FROM u_osorio) AND title IN ('Fluxo Premium','Campanha Sazonal')
)
DELETE FROM public.messages m
WHERE m.conversation_id IN (SELECT conversation_id FROM c_falci UNION ALL SELECT conversation_id FROM c_osorio);

-- Delete conversations
WITH u_falci AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
), u_osorio AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
)
DELETE FROM public.conversations
WHERE (user_id IN (SELECT user_id FROM u_falci) AND title IN ('Ideias de Conteúdo','Estratégia de Publicação'))
   OR (user_id IN (SELECT user_id FROM u_osorio) AND title IN ('Fluxo Premium','Campanha Sazonal'));

-- Delete FAQ items by specific questions we seeded
DELETE FROM public.faq_items
WHERE question IN (
  'O que é a TrendlyAI?',
  'Como começo a usar?',
  'Como funciona o cancelamento?',
  'Como usar os prompts?',
  'Meus dados estão seguros?'
);

-- Delete FAQ categories we seeded (will cascade items if any remain)
DELETE FROM public.faq_categories
WHERE slug IN ('primeiros-passos','assinatura','ferramentas','tecnico');

-- Delete tracks (cascade track_modules)
DELETE FROM public.tracks WHERE title IN ('IA Generativa Avançada','Design para Criadores','Marketing Digital');

-- Delete tools
DELETE FROM public.tools WHERE title IN ('Gerador de Roteiros','Análise de Tendências','Editor de Thumbnails','Gerador de Hashtags');

-- Remove subscription for osorio (keeps profile)
WITH u_osorio AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
)
DELETE FROM public.subscriptions WHERE user_id IN (SELECT user_id FROM u_osorio);

-- Optionally remove the plan if unused now
DELETE FROM public.subscription_plans sp
WHERE sp.name = 'Mestre Criador'
  AND NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.plan_id = sp.id);

COMMIT;

