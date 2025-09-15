-- =====================================================
-- Profiles: complementa dados para os usuários existentes no Auth
-- Pré-requisito: usuários criados no Supabase Auth (handle_new_user criou profiles)
-- =====================================================

-- Atualiza perfil do usuário free (Falci)
UPDATE public.profiles
   SET full_name = COALESCE(full_name, 'Falci'),
       username = COALESCE(username, '@falci'),
       bio = COALESCE(bio, 'Criador Explorador na TrendlyAI'),
       preferences = COALESCE(preferences, '{}'::jsonb) || '{"studio_theme":"default"}'::jsonb
 WHERE email = 'falci@trendlycorp.com';

-- Atualiza perfil do usuário premium (Osorio)
UPDATE public.profiles
   SET full_name = COALESCE(full_name, 'Osório'),
       username = COALESCE(username, '@osorio'),
       bio = COALESCE(bio, 'Criador Premium na TrendlyAI'),
       preferences = COALESCE(preferences, '{}'::jsonb) || '{"studio_theme":"midnight"}'::jsonb
 WHERE email = 'osorio@trendlycorp.com';

-- Observação: o campo is_premium será atualizado via subscriptions_data.sql

