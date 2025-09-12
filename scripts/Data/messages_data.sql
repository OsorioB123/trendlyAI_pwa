-- =====================================================
-- Messages: cria mensagens exemplo por conversa
-- Dependências: conversations_data.sql
-- =====================================================

-- Mensagens para Falci: conversa "Ideias de Conteúdo"
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

-- Mensagens para Osório: conversa "Fluxo Premium"
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

