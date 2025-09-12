-- =====================================================
-- TrendlyAI — FUNCTIONS AND TRIGGERS
-- NOTE: Run after create_tables.sql
-- =====================================================

BEGIN;

-- Update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '@' || regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Payment method: ensure only one default per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_payment_method()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_default IS TRUE THEN
    UPDATE public.payment_methods
    SET is_default = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS payment_method_default_trigger ON public.payment_methods;
CREATE TRIGGER payment_method_default_trigger
  BEFORE INSERT OR UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.ensure_single_default_payment_method();

-- Help Center: increment FAQ item views
CREATE OR REPLACE FUNCTION public.increment_faq_view_count(item_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.faq_items SET view_count = view_count + 1 WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Premium status sync from subscriptions
CREATE OR REPLACE FUNCTION public.auto_update_user_premium_status()
RETURNS trigger AS $$
DECLARE
  target_user_id uuid;
  has_active boolean;
BEGIN
  target_user_id := COALESCE(NEW.user_id, OLD.user_id);

  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = target_user_id
      AND s.status = 'active'
      AND (s.current_period_end IS NULL OR s.current_period_end > now())
  ) INTO has_active;

  UPDATE public.profiles
  SET is_premium = COALESCE(has_active, false), updated_at = now()
  WHERE id = target_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_update_user_premium_status_trigger ON public.subscriptions;
CREATE TRIGGER auto_update_user_premium_status_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.auto_update_user_premium_status();

-- Credits: consume credits and log usage
CREATE OR REPLACE FUNCTION public.consume_user_credits(user_id uuid, credit_amount integer DEFAULT 1)
RETURNS void AS $$
DECLARE
  current_balance integer;
BEGIN
  -- Ensure balance row exists
  INSERT INTO public.user_credits (user_id)
  VALUES (user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT current_credits INTO current_balance
  FROM public.user_credits
  WHERE user_id = user_id FOR UPDATE;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;

  IF current_balance < credit_amount THEN
    RAISE EXCEPTION 'insufficient_credits';
  END IF;

  UPDATE public.user_credits
  SET current_credits = current_credits - credit_amount,
      renewal_date = COALESCE(renewal_date, now() + interval '1 day')
  WHERE user_id = user_id;

  INSERT INTO public.user_credits_log (user_id, amount)
  VALUES (user_id, credit_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Credits: get used credits today
CREATE OR REPLACE FUNCTION public.get_credits_used_today(user_id uuid)
RETURNS integer AS $$
DECLARE
  total_used integer;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total_used
  FROM public.user_credits_log
  WHERE user_id = user_id
    AND created_at::date = now()::date;

  RETURN COALESCE(total_used, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Triggers for updated_at on frequently updated tables
-- Profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Conversations
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Messages
DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tools
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tracks
DROP TRIGGER IF EXISTS update_tracks_updated_at ON public.tracks;
CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Track Modules
DROP TRIGGER IF EXISTS update_track_modules_updated_at ON public.track_modules;
CREATE TRIGGER update_track_modules_updated_at
  BEFORE UPDATE ON public.track_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Track Reviews
DROP TRIGGER IF EXISTS update_track_reviews_updated_at ON public.track_reviews;
CREATE TRIGGER update_track_reviews_updated_at
  BEFORE UPDATE ON public.track_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Subscription tables
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON public.payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_history_updated_at ON public.billing_history;
CREATE TRIGGER update_billing_history_updated_at
  BEFORE UPDATE ON public.billing_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Help center tables
DROP TRIGGER IF EXISTS update_faq_categories_updated_at ON public.faq_categories;
CREATE TRIGGER update_faq_categories_updated_at
  BEFORE UPDATE ON public.faq_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_faq_items_updated_at ON public.faq_items;
CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;

