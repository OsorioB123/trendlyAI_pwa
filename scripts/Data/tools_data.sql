-- =====================================================
-- Tools: insere ferramentas de exemplo
-- =====================================================

INSERT INTO public.tools (title, description, category, icon, content, is_active, tags)
VALUES
  ('Gerador de Roteiros', 'Crie roteiros profissionais para seus vídeos', 'Criação', 'FileText', 'Prompt base para roteiros...', true, ARRAY['roteiro','vídeo','story']),
  ('Análise de Tendências', 'Descubra tendências do momento', 'Análise', 'TrendingUp', 'Prompt base para análise...', true, ARRAY['tendências','análise','insights']),
  ('Editor de Thumbnails', 'Crie thumbnails irresistíveis', 'Design', 'Image', 'Prompt para thumbnails...', true, ARRAY['design','thumbnail']),
  ('Gerador de Hashtags', 'Encontre as melhores hashtags', 'Marketing', 'Hash', 'Prompt para hashtags...', true, ARRAY['social','hashtags'])
ON CONFLICT DO NOTHING;

