-- =====================================================
-- Conversations: cria conversas exemplo para cada usuário
-- Dependências: profiles existentes para emails indicados
-- =====================================================

-- Falci
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'falci@trendlycorp.com'
)
INSERT INTO public.conversations (user_id, title)
SELECT u.user_id, 'Ideias de Conteúdo' FROM u
UNION ALL
SELECT u.user_id, 'Estratégia de Publicação' FROM u
ON CONFLICT DO NOTHING;

-- Osório
WITH u AS (
  SELECT id AS user_id FROM public.profiles WHERE email = 'osorio@trendlycorp.com'
)
INSERT INTO public.conversations (user_id, title)
SELECT u.user_id, 'Fluxo Premium' FROM u
UNION ALL
SELECT u.user_id, 'Campanha Sazonal' FROM u
ON CONFLICT DO NOTHING;

