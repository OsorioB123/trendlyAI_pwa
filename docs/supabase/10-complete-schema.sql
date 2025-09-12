-- =====================================================
-- TRENDLYAI COMPLETE SUPABASE SCHEMA
-- Complete database setup script with all tables, functions, and policies
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =====================================================
-- CORE USER TABLES
-- =====================================================

-- profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  bio TEXT,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  level TEXT DEFAULT 'Explorador',
  total_tracks INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  referral_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Subscription Management
  is_premium BOOLEAN DEFAULT false,
  credits_remaining INTEGER DEFAULT 50,
  monthly_credits_reset_date DATE,
  subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- User Preferences
  preferences JSONB
);

-- conversations (chat system)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nova Conversa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  
  -- Conversation metadata
  context_data JSONB,
  tool_used UUID,
  track_context UUID
);

-- messages (chat messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- AI Usage Tracking
  tokens_used INTEGER,
  model_used TEXT DEFAULT 'gpt-4',
  cost_cents INTEGER,
  
  -- Message Metadata
  metadata JSONB,
  parent_message_id UUID REFERENCES messages(id),
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- CONTENT TABLES
-- =====================================================

-- tools (AI tools library)
CREATE TABLE IF NOT EXISTS tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  prompt_content TEXT NOT NULL,
  original_prompt TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  ai_recommendations JSONB,
  quick_guide TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  icon TEXT
);

-- tracks (learning tracks)
CREATE TABLE IF NOT EXISTS tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('Iniciante', 'Intermediário', 'Avançado')),
  estimated_duration TEXT,
  cover_image TEXT,
  is_premium BOOLEAN DEFAULT false,
  total_modules INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER
);

-- track_modules (track content)
CREATE TABLE IF NOT EXISTS track_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  video_url TEXT,
  tools JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- USER PROGRESS TABLES
-- =====================================================

-- user_tools (user tool preferences)
CREATE TABLE IF NOT EXISTS user_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  custom_prompt TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, tool_id)
);

-- user_tracks (track progress)
CREATE TABLE IF NOT EXISTS user_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0, -- Progress percentage 0-100
  current_module_id UUID REFERENCES track_modules(id),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, track_id)
);

-- user_module_progress (module completion)
CREATE TABLE IF NOT EXISTS user_module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  module_id UUID REFERENCES track_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, module_id)
);

-- track_reviews (track evaluations)
CREATE TABLE IF NOT EXISTS track_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, track_id)
);

-- =====================================================
-- SUBSCRIPTION SYSTEM
-- =====================================================

-- subscriptions (Stripe integration)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  plan_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- payment_history
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Em centavos
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- products (Stripe product sync)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  active BOOLEAN,
  name TEXT,
  description TEXT,
  metadata JSONB
);

-- prices (Stripe pricing sync)
CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  active BOOLEAN,
  currency TEXT,
  interval TEXT,
  interval_count INTEGER,
  unit_amount INTEGER,
  metadata JSONB
);

-- =====================================================
-- REFERRAL SYSTEM
-- =====================================================

-- user_referrals (referral management)
CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  total_credits INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  pending_credits INTEGER DEFAULT 0,
  affiliate_earnings DECIMAL(10,2) DEFAULT 0.00,
  is_affiliate_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- referral_transactions (referral activity log)
CREATE TABLE IF NOT EXISTS referral_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code VARCHAR(20) NOT NULL,
  
  -- Transaction Details
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN ('signup', 'subscription', 'credit_award', 'affiliate_payout')
  ),
  credit_amount INTEGER DEFAULT 0,
  monetary_amount DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'BRL',
  
  -- Status Tracking
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'paid', 'cancelled')
  ),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- conversations
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_tool_used ON conversations(tool_used);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);

-- tools
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);
CREATE INDEX IF NOT EXISTS idx_tools_is_premium ON tools(is_premium);

-- tracks
CREATE INDEX IF NOT EXISTS idx_tracks_category ON tracks(category);
CREATE INDEX IF NOT EXISTS idx_tracks_is_published ON tracks(is_published);
CREATE INDEX IF NOT EXISTS idx_tracks_is_premium ON tracks(is_premium);

-- user_tools
CREATE INDEX IF NOT EXISTS idx_user_tools_user_id ON user_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tools_tool_id ON user_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_tools_is_favorite ON user_tools(is_favorite);

-- user_tracks
CREATE INDEX IF NOT EXISTS idx_user_tracks_user_id ON user_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tracks_track_id ON user_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_user_tracks_progress ON user_tracks(progress);

-- user_module_progress
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_track_id ON user_module_progress(track_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_completed ON user_module_progress(is_completed);

-- user_referrals
CREATE INDEX IF NOT EXISTS idx_user_referrals_user_id ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_code ON user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_referrals_affiliate ON user_referrals(is_affiliate_eligible);

-- referral_transactions
CREATE INDEX IF NOT EXISTS idx_referral_transactions_referrer ON referral_transactions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_transactions_referee ON referral_transactions(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_transactions_code ON referral_transactions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_transactions_type ON referral_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_referral_transactions_status ON referral_transactions(status);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  current_date_check DATE := CURRENT_DATE;
  has_activity BOOLEAN;
BEGIN
  LOOP
    -- Check if user has activity on current_date_check
    SELECT EXISTS (
      SELECT 1 FROM user_module_progress 
      WHERE user_id = user_uuid 
      AND DATE(completed_at) = current_date_check
      AND is_completed = true
    ) INTO has_activity;
    
    IF NOT has_activity THEN
      EXIT;
    END IF;
    
    streak_count := streak_count + 1;
    current_date_check := current_date_check - INTERVAL '1 day';
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Process referral signup
CREATE OR REPLACE FUNCTION process_referral_signup(
  referral_code_param VARCHAR(20),
  new_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_record RECORD;
BEGIN
  -- Find referrer by code
  SELECT ur.user_id, ur.total_referrals 
  INTO referrer_record
  FROM user_referrals ur 
  WHERE ur.referral_code = referral_code_param;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Create transaction record
  INSERT INTO referral_transactions (
    referrer_id, referee_id, referral_code, 
    transaction_type, credit_amount, status
  ) VALUES (
    referrer_record.user_id, new_user_id, referral_code_param,
    'signup', 10, 'pending'
  );
  
  -- Award bonus credits to referee
  UPDATE profiles 
  SET referral_credits = referral_credits + 5
  WHERE id = new_user_id;
  
  -- Check if referrer becomes affiliate eligible
  IF referrer_record.total_referrals >= 4 THEN
    UPDATE user_referrals 
    SET is_affiliate_eligible = true
    WHERE user_id = referrer_record.user_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Update referral stats trigger function
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE user_referrals SET
      total_referrals = total_referrals + 1,
      total_credits = total_credits + NEW.credit_amount,
      updated_at = timezone('utc'::text, now())
    WHERE user_id = NEW.referrer_id;
    
    UPDATE profiles SET
      referral_credits = referral_credits + NEW.credit_amount
    WHERE id = NEW.referrer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto profile creation trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Update timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_tracks_updated_at
  BEFORE UPDATE ON user_tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_referrals_updated_at
  BEFORE UPDATE ON user_referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Referral stats update trigger
CREATE TRIGGER update_referral_stats_trigger
  AFTER UPDATE ON referral_transactions
  FOR EACH ROW EXECUTE FUNCTION update_referral_stats();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_transactions ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- conversations policies
CREATE POLICY "Users can view own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

-- messages policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM conversations WHERE id = conversation_id
    )
  );

-- tools policies (public read for active tools)
CREATE POLICY "Anyone can view active tools" ON tools
  FOR SELECT USING (is_active = true);

-- tracks policies (public read for published tracks)
CREATE POLICY "Anyone can view published tracks" ON tracks
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view track modules" ON track_modules
  FOR SELECT USING (true);

-- user_* table policies (users can only access their own data)
CREATE POLICY "Users can manage own tool preferences" ON user_tools
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own track progress" ON user_tracks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own module progress" ON user_module_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own track reviews" ON track_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment history" ON payment_history
  FOR SELECT USING (auth.uid() = user_id);

-- user_referrals policies
CREATE POLICY "Users can view own referral data" ON user_referrals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own referral data" ON user_referrals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral data" ON user_referrals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- referral_transactions policies
CREATE POLICY "Users can view related transactions" ON referral_transactions
  FOR SELECT USING (
    auth.uid() = referrer_id OR auth.uid() = referee_id
  );

-- =====================================================
-- STORAGE BUCKETS (Create manually in Supabase Dashboard)
-- =====================================================

/*
Create these buckets in the Supabase Storage dashboard:

1. avatars (public)
   - Public access for user profile pictures
   - File size limit: 2MB
   - Allowed types: image/jpeg, image/png, image/webp

2. attachments (authenticated)
   - Chat file attachments
   - File size limit: 10MB
   - Authenticated access only

3. content (public)
   - Track videos and images
   - Public CDN access
   - File size limit: 100MB
*/

-- =====================================================
-- INITIAL DATA (Optional)
-- =====================================================

-- Insert default tools categories
INSERT INTO tools (title, description, category, prompt_content, original_prompt, is_premium) VALUES
('Gerador de Headlines', 'Crie títulos impactantes para suas campanhas', 'Marketing', 'Gere 5 headlines criativas para: [PRODUTO/SERVIÇO]', 'Gere 5 headlines criativas para: [PRODUTO/SERVIÇO]', false),
('Análise de Concorrentes', 'Analise a concorrência do seu nicho', 'Estratégia', 'Analise os principais concorrentes de [EMPRESA] no setor [SETOR]', 'Analise os principais concorrentes de [EMPRESA] no setor [SETOR]', true)
ON CONFLICT DO NOTHING;

-- Insert default track categories
INSERT INTO tracks (title, subtitle, description, category, difficulty_level, is_premium, is_published) VALUES
('Fundamentos de IA para Negócios', 'Aprenda como a IA pode transformar seu negócio', 'Introdução prática aos conceitos de Inteligência Artificial aplicados ao mundo dos negócios', 'IA & Negócios', 'Iniciante', false, true),
('Marketing Digital com IA', 'Automatize e otimize suas campanhas', 'Domine as ferramentas de IA para criar campanhas de marketing mais eficazes', 'Marketing', 'Intermediário', true, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Script execution completed successfully
-- Next steps:
-- 1. Create storage buckets manually in Supabase Dashboard
-- 2. Set up Stripe webhook endpoints
-- 3. Configure environment variables
-- 4. Test RLS policies with sample data