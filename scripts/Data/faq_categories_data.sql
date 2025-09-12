-- =====================================================
-- FAQ Categories: categorias públicas
-- =====================================================

INSERT INTO public.faq_categories (slug, name, description, icon, sort_order, is_active)
VALUES
  ('primeiros-passos', 'Primeiros Passos', 'Como começar a usar a TrendlyAI', 'Rocket', 1, true),
  ('assinatura', 'Assinatura', 'Planos e pagamentos', 'Gem', 2, true),
  ('ferramentas', 'Ferramentas', 'Uso das ferramentas de IA', 'Zap', 3, true),
  ('tecnico', 'Técnico', 'Questões técnicas e suporte', 'HardDrive', 4, true)
ON CONFLICT DO NOTHING;

