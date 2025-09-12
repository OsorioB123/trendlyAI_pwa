-- =====================================================
-- Subscriptions: define usuário premium (osorio) e mantém falci como free
-- Dependências: subscription_plans, subscriptions, trigger auto_update_user_premium_status
-- =====================================================

-- Garante existência de um plano premium "Mestre Criador"
INSERT INTO public.subscription_plans (name, description, price_brl, billing_interval, credits_limit, features, is_active)
SELECT 'Mestre Criador', 'Plano completo para criadores profissionais', 29.90, 'month', 5000,
       '{"unlimited_insights": true, "priority_support": true}'::jsonb, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscription_plans WHERE name = 'Mestre Criador'
);

-- Seleciona IDs necessários
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

-- Observação: o trigger auto_update_user_premium_status ajustará profiles.is_premium = true para o Osório
