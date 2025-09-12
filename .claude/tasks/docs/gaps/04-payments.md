# Payments & Subscriptions

## Current State
- Schema (repo): `subscription_plans`, `subscriptions`, `payment_methods`, `billing_history` with rich fields and statuses.
- Docs (context): `products`/`prices` (Stripe) + `subscriptions/payment_history`. Mismatch with current schema used by frontend (`subscription_plans` etc.).
- RLS not visible for these tables in the provided schema excerpts.
- Webhooks/Stripe sync not documented in-repo.

## Gap Analysis
- Dual models (products/prices vs plans) cause confusion; align to one.
- Missing RLS may expose sensitive payment data if not enforced.
- No audit trail for status changes besides history; no integrity constraints between billing and subscriptions cycles.
- Credits linkage (subscription → profile credits) not specified.

## Recommendations
- Standardize on `subscription_plans` model and deprecate `products/prices` references in docs/UI.
- Add strict RLS: users see only their own `subscriptions`, `payment_methods`, `billing_history`; admins via role.
- Add webhook-driven functions to update `subscriptions.status` and append to `billing_history` atomically.
- Link active subscription to credits policy (refresh on activation/change).
- Add indexes for lookups and reporting.

## Implementation Specifics (SQL)
1) RLS Policies
```sql
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions" ON public.subscriptions
FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own subscriptions" ON public.subscriptions
FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users manage own payment methods" ON public.payment_methods
FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users view own billing" ON public.billing_history
FOR SELECT TO authenticated USING (user_id = auth.uid());
```
2) Webhook Helper (status change + credits)
```sql
CREATE OR REPLACE FUNCTION public.apply_subscription_status(
  p_user uuid,
  p_status text,
  p_period_start timestamptz,
  p_period_end timestamptz
) RETURNS void AS $$
BEGIN
  UPDATE public.subscriptions
     SET status = p_status,
         current_period_start = p_period_start,
         current_period_end = p_period_end,
         updated_at = now()
   WHERE user_id = p_user;

  IF p_status = 'active' THEN
    UPDATE public.profiles
       SET credits = max_credits,
           credits_cycle_start = coalesce(p_period_start, now()),
           credits_used_this_cycle = 0,
           updated_at = now()
     WHERE id = p_user;
  END IF;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;
```
3) Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_user_date ON public.billing_history(user_id, billing_date DESC);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods(user_id, is_default);
```

## Prioridade
- Alta: RLS for payments/billing, webhook helper.
- Média: index coverage, deprecate products/prices references.
- Baixa: reporting views and admin roles.

