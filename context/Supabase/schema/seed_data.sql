-- =====================================================
-- TrendlyAI — OPTIONAL SEED DATA
-- NOTE: Run only in development/testing environments
-- =====================================================

BEGIN;

-- Subscription plans
INSERT INTO public.subscription_plans (name, description, price_brl, price_usd, billing_interval, credits_limit, features, is_active)
VALUES
  ('Explorador', 'Plano básico para começar sua jornada', 0.00, 0.00, 'month', 50,
   '{"basic_insights": true, "community_support": true}', true),
  ('Mestre Criador', 'Plano completo para criadores profissionais', 29.90, 5.99, 'month', 5000,
   '{"unlimited_insights": true, "priority_support": true, "advanced_analytics": true, "custom_templates": true}', true),
  ('Mestre Criador Anual', 'Plano anual com desconto especial', 299.00, 59.99, 'year', 60000,
   '{"unlimited_insights": true, "priority_support": true, "advanced_analytics": true, "custom_templates": true, "annual_discount": true}', true)
ON CONFLICT DO NOTHING;

-- Sample tracks
INSERT INTO public.tracks (title, subtitle, description, category, difficulty_level, estimated_duration, thumbnail_url, is_premium, total_modules, is_published)
VALUES
  ('IA Generativa Avançada', 'Domine técnicas de IA para conteúdo', 'Curso avançado de IA generativa', 'IA', 'Avançado', '3h',
   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', true, 6, true),
  ('Design para Criadores', 'Princípios de design visual', 'Design para criadores de conteúdo', 'Design', 'Intermediário', '2h',
   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', false, 5, true)
ON CONFLICT DO NOTHING;

-- Sample tools
INSERT INTO public.tools (title, description, category, icon, content, is_active, tags)
VALUES
  ('Gerador de Roteiros', 'Crie roteiros profissionais para seus vídeos', 'Criação', 'FileText', 'Prompt de roteiro...', true, ARRAY['roteiro','vídeo']),
  ('Análise de Tendências', 'Descubra tendências do momento', 'Análise', 'TrendingUp', 'Prompt de análise...', true, ARRAY['tendências','análise'])
ON CONFLICT DO NOTHING;

-- Help Center categories
INSERT INTO public.faq_categories (slug, name, description, icon, sort_order)
VALUES
  ('primeiros-passos', 'Primeiros Passos', 'Como começar a usar a TrendlyAI', 'Rocket', 1),
  ('assinatura', 'Assinatura', 'Dúvidas sobre planos e pagamentos', 'Gem', 2),
  ('ferramentas', 'Ferramentas', 'Como usar as ferramentas de IA', 'Zap', 3)
ON CONFLICT DO NOTHING;

-- Help Center items (few examples)
INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured)
SELECT id, 'O que é a TrendlyAI?', 'Orquestra de IA para criadores de conteúdo.', 1, true
FROM public.faq_categories WHERE slug = 'primeiros-passos'
ON CONFLICT DO NOTHING;

COMMIT;

