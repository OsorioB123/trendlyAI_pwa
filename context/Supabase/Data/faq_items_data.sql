-- =====================================================
-- FAQ Items: perguntas públicas
-- Dependências: faq_categories_data.sql
-- =====================================================

-- Primeiros Passos
INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'O que é a TrendlyAI?', 'Orquestra de IA para criadores de conteúdo.', 1, true, true
FROM public.faq_categories WHERE slug = 'primeiros-passos'
ON CONFLICT DO NOTHING;

INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Como começo a usar?', 'Acesse a Home, converse com a IA e explore as ferramentas.', 2, false, true
FROM public.faq_categories WHERE slug = 'primeiros-passos'
ON CONFLICT DO NOTHING;

-- Assinatura
INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Como funciona o cancelamento?', 'Você pode cancelar a qualquer momento no painel.', 1, true, true
FROM public.faq_categories WHERE slug = 'assinatura'
ON CONFLICT DO NOTHING;

-- Ferramentas
INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Como usar os prompts?', 'Cada ferramenta possui prompts prontos para personalização.', 1, true, true
FROM public.faq_categories WHERE slug = 'ferramentas'
ON CONFLICT DO NOTHING;

-- Técnico
INSERT INTO public.faq_items (category_id, question, answer, sort_order, is_featured, is_active)
SELECT id, 'Meus dados estão seguros?', 'Seguimos melhores práticas e criptografia de ponta a ponta.', 1, true, true
FROM public.faq_categories WHERE slug = 'tecnico'
ON CONFLICT DO NOTHING;

