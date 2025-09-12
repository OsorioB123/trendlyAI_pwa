-- =====================================================
-- TrendlyAI — INDEXES
-- NOTE: Run after tables are created
-- =====================================================

BEGIN;

-- Conversations & Messages
CREATE INDEX IF NOT EXISTS idx_conversations_user_updated ON public.conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at ASC);

-- Tools
CREATE INDEX IF NOT EXISTS idx_tools_active ON public.tools(is_active);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_tags_gin ON public.tools USING GIN(tags);

-- Tracks
CREATE INDEX IF NOT EXISTS idx_tracks_published ON public.tracks(is_published);
CREATE INDEX IF NOT EXISTS idx_track_modules_track_order ON public.track_modules(track_id, order_index);

-- User progress & reviews
CREATE INDEX IF NOT EXISTS idx_user_tracks_user ON public.user_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tracks_track ON public.user_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_track ON public.user_module_progress(user_id, track_id);
CREATE INDEX IF NOT EXISTS idx_track_reviews_track ON public.track_reviews(track_id);

-- Subscriptions & billing
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_default ON public.payment_methods(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_billing_history_user_date ON public.billing_history(user_id, billing_date DESC);

-- Help center
CREATE INDEX IF NOT EXISTS idx_faq_categories_active_order ON public.faq_categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_items_category_active_order ON public.faq_items(category_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_faq_items_tags_gin ON public.faq_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON public.support_tickets(user_id, status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_created ON public.support_messages(ticket_id, created_at);

-- Credits
CREATE INDEX IF NOT EXISTS idx_user_credits_log_user_date ON public.user_credits_log(user_id, created_at);

COMMIT;

