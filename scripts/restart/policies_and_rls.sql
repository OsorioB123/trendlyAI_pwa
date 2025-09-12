-- =====================================================
-- TrendlyAI — POLICIES AND RLS
-- NOTE: Run after create_tables.sql
-- =====================================================

BEGIN;

-- Enable RLS on all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.track_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- CONVERSATIONS (owner-based)
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own conversations" ON public.conversations;
CREATE POLICY "Users can create own conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- MESSAGES (must belong to user's conversation)
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage messages in own conversations" ON public.messages;
CREATE POLICY "Users can manage messages in own conversations"
  ON public.messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
    )
  );

-- TOOLS
DROP POLICY IF EXISTS "Anyone can view active tools" ON public.tools;
CREATE POLICY "Anyone can view active tools"
  ON public.tools FOR SELECT
  TO authenticated
  USING (is_active = true);

-- USER TOOLS
DROP POLICY IF EXISTS "Users can manage own user_tools" ON public.user_tools;
CREATE POLICY "Users can manage own user_tools"
  ON public.user_tools FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- TRACKS (published)
DROP POLICY IF EXISTS "Anyone can view published tracks" ON public.tracks;
CREATE POLICY "Anyone can view published tracks"
  ON public.tracks FOR SELECT
  TO authenticated
  USING (is_published = true);

-- TRACK MODULES (only if parent track is published)
DROP POLICY IF EXISTS "Anyone can view modules of published tracks" ON public.track_modules;
CREATE POLICY "Anyone can view modules of published tracks"
  ON public.track_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks t
      WHERE t.id = track_modules.track_id AND t.is_published = true
    )
  );

-- USER TRACKS
DROP POLICY IF EXISTS "Users can manage own user_tracks" ON public.user_tracks;
CREATE POLICY "Users can manage own user_tracks"
  ON public.user_tracks FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- USER MODULE PROGRESS
DROP POLICY IF EXISTS "Users can manage own module progress" ON public.user_module_progress;
CREATE POLICY "Users can manage own module progress"
  ON public.user_module_progress FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- TRACK REVIEWS
DROP POLICY IF EXISTS "Users can view reviews" ON public.track_reviews;
CREATE POLICY "Users can view reviews"
  ON public.track_reviews FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON public.track_reviews;
CREATE POLICY "Users can manage own reviews"
  ON public.track_reviews FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- USER REFERRALS
DROP POLICY IF EXISTS "Users can manage own referrals" ON public.user_referrals;
CREATE POLICY "Users can manage own referrals"
  ON public.user_referrals FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- USER CREDITS
DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own credits" ON public.user_credits;
CREATE POLICY "Users can manage own credits"
  ON public.user_credits FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- USER CREDITS LOG (no direct writes from client expected)
DROP POLICY IF EXISTS "Users can view own credits log" ON public.user_credits_log;
CREATE POLICY "Users can view own credits log"
  ON public.user_credits_log FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- SUBSCRIPTION PLANS
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view active plans"
  ON public.subscription_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own subscription" ON public.subscriptions;
CREATE POLICY "Users can manage own subscription"
  ON public.subscriptions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- PAYMENT METHODS
DROP POLICY IF EXISTS "Users can manage own payment methods" ON public.payment_methods;
CREATE POLICY "Users can manage own payment methods"
  ON public.payment_methods FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- BILLING HISTORY
DROP POLICY IF EXISTS "Users can view own billing history" ON public.billing_history;
CREATE POLICY "Users can view own billing history"
  ON public.billing_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- HELP CENTER (public read)
DROP POLICY IF EXISTS "Public read categories" ON public.faq_categories;
CREATE POLICY "Public read categories"
  ON public.faq_categories FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Public read items" ON public.faq_items;
CREATE POLICY "Public read items"
  ON public.faq_items FOR SELECT
  TO public
  USING (is_active = true);

-- SUPPORT: user-owned
DROP POLICY IF EXISTS "Users manage own tickets" ON public.support_tickets;
CREATE POLICY "Users manage own tickets"
  ON public.support_tickets FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own messages" ON public.support_messages;
CREATE POLICY "Users view own messages"
  ON public.support_messages FOR SELECT
  TO authenticated
  USING (
    is_internal = false AND EXISTS (
      SELECT 1 FROM public.support_tickets st
      WHERE st.id = support_messages.ticket_id AND st.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users add messages on own tickets" ON public.support_messages;
CREATE POLICY "Users add messages on own tickets"
  ON public.support_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    is_internal = false AND EXISTS (
      SELECT 1 FROM public.support_tickets st
      WHERE st.id = support_messages.ticket_id AND st.user_id = auth.uid()
    )
  );

COMMIT;

