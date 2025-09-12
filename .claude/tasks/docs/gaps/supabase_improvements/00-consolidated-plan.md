# Consolidated Supabase Improvement Plan

## 1) Consolidated Schema (SQL by Stage)

Stage A — Align Content Domain
```sql
-- Tracks: add missing columns used by app/seeds
ALTER TABLE public.tracks 
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS difficulty_level text,
  ADD COLUMN IF NOT EXISTS estimated_duration text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_modules int,
  ADD COLUMN IF NOT EXISTS order_index int;
CREATE INDEX IF NOT EXISTS idx_tracks_order ON public.tracks(order_index);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_track_modules_track_order ON public.track_modules(track_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_tracks_user_track ON public.user_tracks(user_id, track_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress ON public.user_module_progress(user_id, track_id, module_id);
CREATE INDEX IF NOT EXISTS idx_tracks_tags ON public.tracks USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_tracks_content ON public.tracks USING GIN (content);
CREATE INDEX IF NOT EXISTS idx_tools_configuration ON public.tools USING GIN (configuration);
```

Stage B — Auth & Profile (credits + stats)
```sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS credits_cycle_start timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS credits_used_this_cycle int DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Stats trigger
CREATE OR REPLACE FUNCTION public.update_profile_stats() RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles p SET 
    completed_modules = (SELECT COUNT(1) FROM public.user_module_progress ump WHERE ump.user_id = p.id AND ump.completed = true),
    total_tracks = (SELECT COUNT(1) FROM public.user_tracks ut WHERE ut.user_id = p.id),
    updated_at = now()
  WHERE p.id = COALESCE(NEW.user_id, OLD.user_id);
  RETURN COALESCE(NEW, OLD);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_profile_stats ON public.user_tracks;
CREATE TRIGGER trigger_update_profile_stats
AFTER INSERT OR UPDATE OR DELETE ON public.user_tracks
FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();

DROP TRIGGER IF EXISTS trigger_update_profile_stats_modules ON public.user_module_progress;
CREATE TRIGGER trigger_update_profile_stats_modules
AFTER INSERT OR UPDATE OR DELETE ON public.user_module_progress
FOR EACH ROW EXECUTE FUNCTION public.update_profile_stats();

-- Credits API
CREATE OR REPLACE FUNCTION public.get_available_credits(user_uuid uuid) RETURNS jsonb AS $$
DECLARE rec record; result jsonb; BEGIN
  SELECT credits, max_credits, credits_cycle_start, credits_used_this_cycle INTO rec FROM public.profiles WHERE id = user_uuid;
  IF NOT FOUND THEN RETURN jsonb_build_object('current',0,'total',0,'percentage',0,'renewal_date',null); END IF;
  result := jsonb_build_object('current', rec.credits,'total', rec.max_credits,'percentage', CASE WHEN rec.max_credits>0 THEN ROUND((rec.credits::numeric/rec.max_credits)*100) ELSE 0 END,'renewal_date', rec.credits_cycle_start + interval '30 days');
  RETURN result; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.use_credit(user_uuid uuid) RETURNS boolean AS $$
DECLARE cur int; BEGIN
  SELECT credits INTO cur FROM public.profiles WHERE id=user_uuid FOR UPDATE;
  IF NOT FOUND OR cur <= 0 THEN RETURN false; END IF;
  UPDATE public.profiles SET credits = credits - 1, credits_used_this_cycle = credits_used_this_cycle + 1, updated_at = now() WHERE id = user_uuid;
  RETURN true; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reset_monthly_credits() RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET credits = max_credits, credits_used_this_cycle = 0, credits_cycle_start = now(), updated_at = now();
END; $$ LANGUAGE plpgsql;
```

Stage C — Chat Compatibility & Safety
```sql
-- Compatibility views
CREATE OR REPLACE VIEW public.conversations_legacy AS
SELECT c.id, cp.user_id AS user_id, c.title, c.created_at, c.updated_at
FROM public.conversations c JOIN public.conversation_participants cp ON cp.conversation_id = c.id;

CREATE OR REPLACE VIEW public.messages_legacy AS
SELECT m.id, m.conversation_id,
       CASE WHEN m.message_type IN ('system') THEN 'assistant'
            WHEN m.sender_id = auth.uid() THEN 'user'
            ELSE 'assistant' END AS role,
       m.content, m.created_at, m.updated_at
FROM public.messages m;

-- Safe message insert + updated_at bump
CREATE OR REPLACE FUNCTION public.send_user_message(p_user uuid,p_conversation uuid,p_content text) RETURNS uuid AS $$
DECLARE new_id uuid; BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = p_conversation AND cp.user_id = p_user) THEN
    RAISE EXCEPTION 'User not in conversation';
  END IF;
  PERFORM public.use_credit(p_user);
  INSERT INTO public.messages (conversation_id, sender_id, content, message_type)
  VALUES (p_conversation, p_user, p_content, 'text') RETURNING id INTO new_id;
  UPDATE public.conversations SET updated_at = now() WHERE id = p_conversation;
  RETURN new_id; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_conversation_on_new_message
AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Stage D — Payments RLS & Webhook Helper
```sql
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own subscriptions" ON public.subscriptions FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own payment methods" ON public.payment_methods FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users view own billing" ON public.billing_history FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.apply_subscription_status(p_user uuid,p_status text,p_period_start timestamptz,p_period_end timestamptz) RETURNS void AS $$
BEGIN
  UPDATE public.subscriptions SET status = p_status,current_period_start = p_period_start,current_period_end = p_period_end,updated_at = now() WHERE user_id = p_user;
  IF p_status = 'active' THEN
    UPDATE public.profiles SET credits = max_credits,credits_cycle_start = coalesce(p_period_start, now()),credits_used_this_cycle = 0,updated_at = now() WHERE id = p_user;
  END IF;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_user_date ON public.billing_history(user_id, billing_date DESC);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods(user_id, is_default);
```

## 2) Migration Plan (Sequential)
- M1: Back up DB (full logical dump) and disable API clients briefly.
- M2: Stage A (tracks alignment + indexes) — safe additive changes.
- M3: Stage B (profiles credits+stats) — additive columns + functions + triggers.
- M4: Stage C (chat views/functions/triggers) — additive; do not drop legacy fields.
- M5: Stage D (payments RLS + helper + indexes).
- M6: App alignment: update queries to use new columns/views where needed; or keep views until refactor.
- M7: Validate and re-enable API clients.

## 3) Validation Checklist
- Content
  - Seed `scripts/*.sql` runs without errors; tracks list renders; modules order correct.
  - Premium tracks hidden for non-active users; visible for active subscribers.
- Profiles & Credits
  - New user signup creates profile; `get_available_credits` returns expected JSON.
  - `use_credit` decrements and respects zero boundary; monthly reset restores credits.
  - Progress changes update `completed_modules/total_tracks`.
- Chat
  - `send_user_message` inserts message and bumps `conversations.updated_at`.
  - Legacy frontend lists conversations/messages via `*_legacy` views.
- Payments
  - RLS blocks cross-user reads; billing history lists only own records.
  - Webhook path updates subscription and refreshes credits (simulate call).

## 4) Rollback Strategy
- Keep pre-migration dump for restore.
- All changes are additive; to roll back: drop created functions/triggers/views and new columns using `ALTER TABLE ... DROP COLUMN IF EXISTS` in reverse order.
- Re-point frontend to previous queries if views are removed.

## 5) Performance Impact
- Positive: composite/GIN indexes reduce scan time on modules/progress/search; message indexes already present.
- Minimal write overhead: new triggers and updated_at bump add negligible cost relative to message insert path.
- Storage: additional columns/views have minor footprint; GIN indexes add memory/disk but benefit read-heavy workloads.

