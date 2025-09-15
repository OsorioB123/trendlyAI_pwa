-- =====================================================
-- Tracks: insere trilhas de exemplo
-- =====================================================

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

