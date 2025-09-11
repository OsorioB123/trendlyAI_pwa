-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR TRENDLYAI PWA
-- =====================================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'DBTYA+29HFM4eOKlSFuQ5QEFldeu4cpruOfy+4qHiH7ERKSbR8ZNgFMq3qG7jgUUKCv0TKHRH5Y2lXLVkahEbQ==';

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  level TEXT DEFAULT 'Explorador',
  streak_days INTEGER DEFAULT 0,
  total_tracks INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 50,
  max_credits INTEGER DEFAULT 50,
  metadata JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{"background": "modern-gradient"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- CONVERSATIONS TABLE
-- =====================================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  title TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CONVERSATION PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations - users can only see conversations they participate in
CREATE POLICY "Users can view conversations they participate in" 
ON public.conversations FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = conversations.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create conversations" 
ON public.conversations FOR INSERT 
TO authenticated 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update conversations they participate in" 
ON public.conversations FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = conversations.id AND user_id = auth.uid()
  )
);

-- RLS Policies for conversation participants
CREATE POLICY "Users can view participants of conversations they're in" 
ON public.conversation_participants FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp2
    WHERE cp2.conversation_id = conversation_participants.conversation_id 
    AND cp2.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add participants to conversations they're in" 
ON public.conversation_participants FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp2
    WHERE cp2.conversation_id = conversation_participants.conversation_id 
    AND cp2.user_id = auth.uid()
  )
);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Indexes for better performance
CREATE INDEX idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in conversations they participate in" 
ON public.messages FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages in conversations they participate in" 
ON public.messages FOR INSERT 
TO authenticated 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
  )
);

-- =====================================================
-- TRACKS TABLE
-- =====================================================
CREATE TABLE public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}',
  background_image TEXT,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER DEFAULT 30,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tracks - public read access for published tracks
CREATE POLICY "Anyone can view published tracks" 
ON public.tracks FOR SELECT 
TO authenticated 
USING (is_published = true);

-- Indexes for tracks
CREATE INDEX idx_tracks_published ON public.tracks(is_published);
CREATE INDEX idx_tracks_tags ON public.tracks USING GIN(tags);

-- =====================================================
-- USER TRACKS TABLE (User Progress)
-- =====================================================
CREATE TABLE public.user_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

ALTER TABLE public.user_tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user tracks
CREATE POLICY "Users can view their own track progress" 
ON public.user_tracks FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own track progress" 
ON public.user_tracks FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- TOOLS TABLE
-- =====================================================
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tools - public read access for active tools
CREATE POLICY "Anyone can view active tools" 
ON public.tools FOR SELECT 
TO authenticated 
USING (is_active = true);

-- =====================================================
-- USER TOOLS TABLE (Favorites)
-- =====================================================
CREATE TABLE public.user_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  last_used TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

ALTER TABLE public.user_tools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user tools
CREATE POLICY "Users can view their own tool preferences" 
ON public.user_tools FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own tool preferences" 
ON public.user_tools FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON public.conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON public.messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at 
  BEFORE UPDATE ON public.tracks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at 
  BEFORE UPDATE ON public.tools 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to find or create direct conversation
CREATE OR REPLACE FUNCTION find_direct_conversation(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  SELECT c.id INTO conversation_id
  FROM public.conversations c
  WHERE c.type = 'direct'
  AND EXISTS (
    SELECT 1 FROM public.conversation_participants cp1 
    WHERE cp1.conversation_id = c.id AND cp1.user_id = user1_id
  )
  AND EXISTS (
    SELECT 1 FROM public.conversation_participants cp2 
    WHERE cp2.conversation_id = c.id AND cp2.user_id = user2_id
  )
  LIMIT 1;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversation details with participants
CREATE OR REPLACE FUNCTION get_conversation_details(conv_id UUID)
RETURNS TABLE (
  id UUID,
  type TEXT,
  title TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  participants JSONB,
  message_count BIGINT,
  last_message JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.type,
    c.title,
    c.created_by,
    c.created_at,
    c.updated_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'user_id', cp.user_id,
            'display_name', p.display_name,
            'avatar_url', p.avatar_url,
            'joined_at', cp.joined_at,
            'last_seen', cp.last_seen
          )
        )
        FROM public.conversation_participants cp
        JOIN public.profiles p ON p.id = cp.user_id
        WHERE cp.conversation_id = c.id
      ), 
      '[]'::jsonb
    ) as participants,
    (
      SELECT COUNT(*)
      FROM public.messages m
      WHERE m.conversation_id = c.id
    ) as message_count,
    (
      SELECT jsonb_build_object(
        'id', m.id,
        'content', m.content,
        'message_type', m.message_type,
        'sender_id', m.sender_id,
        'sender_name', p.display_name,
        'created_at', m.created_at
      )
      FROM public.messages m
      JOIN public.profiles p ON p.id = m.sender_id
      WHERE m.conversation_id = c.id
      ORDER BY m.created_at DESC
      LIMIT 1
    ) as last_message
  FROM public.conversations c
  WHERE c.id = conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE BUCKETS AND POLICIES
-- =====================================================

-- Create storage buckets (run these in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true);

-- Storage policies will be created via dashboard or API

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Sample tracks data
INSERT INTO public.tracks (title, description, background_image, difficulty, is_published, tags) VALUES
('IA Generativa Avançada', 'Domine as técnicas mais avançadas de inteligência artificial generativa', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', 'advanced', true, ARRAY['IA', 'Generativa', 'Avançado']),
('Design para Criadores', 'Aprenda princípios de design visual para criadores de conteúdo', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80', 'intermediate', true, ARRAY['Design', 'Criativo', 'Visual']),
('Marketing Digital', 'Estratégias completas de marketing digital para 2025', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'beginner', true, ARRAY['Marketing', 'Digital', 'Estratégia']);

-- Sample tools data
INSERT INTO public.tools (name, description, category, icon, is_active, is_premium) VALUES
('Gerador de Roteiros', 'Crie roteiros profissionais para seus vídeos', 'Criação', 'FileText', true, false),
('Análise de Tendências', 'Descubra as tendências mais quentes do momento', 'Análise', 'TrendingUp', true, true),
('Editor de Thumbnails', 'Crie thumbnails irresistíveis para seus vídeos', 'Design', 'Image', true, false),
('Gerador de Hashtags', 'Encontre as hashtags perfeitas para seu conteúdo', 'Social Media', 'Hash', true, false);

-- =====================================================
-- SUBSCRIPTION TABLES
-- =====================================================

-- Subscription Plans (Master data)
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_brl DECIMAL(10,2) NOT NULL,
  price_usd DECIMAL(10,2),
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('month', 'year')),
  credits_limit INTEGER DEFAULT 0,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'canceled', 'past_due', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  pause_until TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  credits_used INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Payment Methods
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('credit_card', 'pix', 'bank_transfer')),
  brand TEXT,
  last_four TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing History
CREATE TABLE public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE,
  amount_brl DECIMAL(10,2) NOT NULL,
  amount_usd DECIMAL(10,2),
  tax_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  billing_date DATE NOT NULL,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  description TEXT,
  invoice_url TEXT,
  receipt_url TEXT,
  payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for subscription tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans FOR SELECT 
TO authenticated 
USING (is_active = true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" 
ON public.subscriptions FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription" 
ON public.subscriptions FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- RLS Policies for payment_methods
CREATE POLICY "Users can view their own payment methods" 
ON public.payment_methods FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own payment methods" 
ON public.payment_methods FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for billing_history
CREATE POLICY "Users can view their own billing history" 
ON public.billing_history FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON public.payment_methods(user_id, is_default) WHERE is_default = true;
CREATE INDEX idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX idx_billing_history_date ON public.billing_history(billing_date DESC);
CREATE INDEX idx_billing_history_subscription ON public.billing_history(subscription_id);

-- Triggers for updating updated_at
CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON public.subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON public.subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON public.payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_history_updated_at 
  BEFORE UPDATE ON public.billing_history 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.payment_methods 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER payment_method_default_trigger
  BEFORE INSERT OR UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_payment_method();

-- Sample subscription plans data
INSERT INTO public.subscription_plans (name, description, price_brl, price_usd, billing_interval, credits_limit, features) VALUES
('Mestre Criador', 'Plano completo para criadores profissionais', 29.90, 5.99, 'month', 5000, 
 '{"unlimited_insights": true, "priority_support": true, "advanced_analytics": true, "custom_templates": true}'),
('Explorador', 'Plano básico para começar sua jornada', 0.00, 0.00, 'month', 50, 
 '{"basic_insights": true, "community_support": true}'),
('Mestre Criador Anual', 'Plano anual com desconto especial', 299.00, 59.99, 'year', 60000,
 '{"unlimited_insights": true, "priority_support": true, "advanced_analytics": true, "custom_templates": true, "annual_discount": true}');

-- =====================================================
-- ENABLE REALTIME (Run in Supabase dashboard)
-- =====================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.billing_history;