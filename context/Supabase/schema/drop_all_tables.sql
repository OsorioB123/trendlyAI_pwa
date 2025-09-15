-- =====================================================
-- TrendlyAI — DROP ALL OBJECTS (SAFE RESET)
-- Purpose: Drop existing public tables, functions, triggers, and storage buckets
-- NOTE: Run in a safe environment. This is destructive.
-- =====================================================

BEGIN;

-- Drop functions (ignore if absent)
DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'update_updated_at_column';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE'; END IF;
END $$;

DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'handle_new_user';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE'; END IF;
END $$;

DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'ensure_single_default_payment_method';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.ensure_single_default_payment_method() CASCADE'; END IF;
END $$;

DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'increment_faq_view_count';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.increment_faq_view_count(uuid) CASCADE'; END IF;
END $$;

DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'auto_update_user_premium_status';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.auto_update_user_premium_status() CASCADE'; END IF;
END $$;

DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'consume_user_credits';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.consume_user_credits(uuid, integer) CASCADE'; END IF;
END $$;

DO $$ BEGIN
  PERFORM 1 FROM pg_proc WHERE proname = 'get_credits_used_today';
  IF FOUND THEN EXECUTE 'DROP FUNCTION IF EXISTS public.get_credits_used_today(uuid) CASCADE'; END IF;
END $$;

-- Drop tables (cascade drops triggers, policies, FKs)
DROP TABLE IF EXISTS public.support_messages CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.faq_items CASCADE;
DROP TABLE IF EXISTS public.faq_categories CASCADE;

DROP TABLE IF EXISTS public.billing_history CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;

DROP TABLE IF EXISTS public.user_credits_log CASCADE;
DROP TABLE IF EXISTS public.user_credits CASCADE;

DROP TABLE IF EXISTS public.track_reviews CASCADE;
DROP TABLE IF EXISTS public.user_module_progress CASCADE;
DROP TABLE IF EXISTS public.user_tracks CASCADE;
DROP TABLE IF EXISTS public.track_modules CASCADE;
DROP TABLE IF EXISTS public.tracks CASCADE;

DROP TABLE IF EXISTS public.user_tools CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;

DROP TABLE IF EXISTS public.user_referrals CASCADE;

DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.conversation_participants CASCADE; -- legacy if present

DROP TABLE IF EXISTS public.profiles CASCADE;

-- Clean up unused legacy Stripe model if present
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.prices CASCADE;
DROP TABLE IF EXISTS public.payment_history CASCADE;

COMMIT;

-- =====================================================
-- Storage: remove buckets and their objects if exist
-- =====================================================
BEGIN;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'storage') THEN
    -- Remove objects first, then buckets
    DELETE FROM storage.objects WHERE bucket_id IN ('avatars','attachments','content');
    DELETE FROM storage.buckets WHERE id IN ('avatars','attachments','content');
  END IF;
END $$;
COMMIT;

-- End of drop script

