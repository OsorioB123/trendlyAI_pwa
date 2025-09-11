# TrendlyAI Supabase Database Schema

## Database Overview

TrendlyAI uses Supabase with PostgreSQL as the primary database, implementing comprehensive Row Level Security (RLS) policies for data isolation and user privacy. The schema supports a freemium SaaS model with subscription management, real-time chat functionality, and learning track progression.

## Core Tables Structure

### User Management

#### `profiles`
```sql
-- User profile and subscription data
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  full_name text,
  avatar_url text,
  subscription_status text DEFAULT 'free',
  credits_remaining integer DEFAULT 50,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

#### `subscriptions`
```sql
-- Stripe subscription management
subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  plan_type text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

### Chat System

#### `conversations`
```sql
-- Chat conversations with Salina AI
conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  title text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

#### `messages`
```sql
-- Individual chat messages
messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id),
  user_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  is_ai_response boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
)
```

### Content Management

#### `tools`
```sql
-- AI tools and prompts
tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  category text,
  is_premium boolean DEFAULT false,
  prompt_template text,
  ai_recommendation text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

#### `tracks`
```sql
-- Learning tracks
tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  category text,
  difficulty_level text,
  total_modules integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  background_image text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

### User Interactions

#### `user_tools`
```sql
-- User tool preferences and customizations
user_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  tool_id uuid REFERENCES tools(id),
  is_favorite boolean DEFAULT false,
  custom_prompt text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

#### `user_tracks`
```sql
-- User track progress
user_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  track_id uuid REFERENCES tracks(id),
  current_module integer DEFAULT 0,
  completed_modules integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

#### `user_module_progress`
```sql
-- Individual module completion tracking
user_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  track_id uuid REFERENCES tracks(id),
  module_number integer,
  is_completed boolean DEFAULT false,
  completion_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
)
```

#### `track_reviews`
```sql
-- Track ratings and reviews
track_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  track_id uuid REFERENCES tracks(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
```

### Payment Management

#### `payment_history`
```sql
-- Stripe payment tracking
payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  stripe_payment_intent_id text,
  amount integer,
  currency text DEFAULT 'brl',
  status text,
  description text,
  created_at timestamp with time zone DEFAULT now()
)
```

#### `products`
```sql
-- Stripe product definitions
products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id text UNIQUE,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
)
```

#### `prices`
```sql
-- Stripe pricing information
prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  stripe_price_id text UNIQUE,
  unit_amount integer,
  currency text DEFAULT 'brl',
  interval_type text, -- 'month', 'year'
  interval_count integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
)
```

## Database Functions

### User Management Functions

#### `handle_new_user()`
```sql
-- Trigger function: Creates profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `update_updated_at_column()`
```sql
-- Trigger function: Updates timestamp on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Business Logic Functions

#### `get_available_credits(user_uuid uuid)`
```sql
-- Returns available credits for user based on subscription
CREATE OR REPLACE FUNCTION get_available_credits(user_uuid uuid)
RETURNS jsonb AS $$
DECLARE
  user_profile profiles%ROWTYPE;
  subscription_active boolean;
BEGIN
  SELECT * INTO user_profile FROM profiles WHERE id = user_uuid;
  
  -- Check if user has active premium subscription
  subscription_active := is_premium_user(user_uuid);
  
  IF subscription_active THEN
    RETURN jsonb_build_object(
      'credits_remaining', -1,  -- -1 indicates unlimited
      'is_unlimited', true,
      'plan_type', 'premium'
    );
  ELSE
    RETURN jsonb_build_object(
      'credits_remaining', user_profile.credits_remaining,
      'is_unlimited', false,
      'plan_type', 'free'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `use_credit(user_uuid uuid)`
```sql
-- Deducts one credit from user account
CREATE OR REPLACE FUNCTION use_credit(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  current_credits integer;
  is_premium boolean;
BEGIN
  -- Check if user is premium (unlimited credits)
  is_premium := is_premium_user(user_uuid);
  
  IF is_premium THEN
    RETURN true;  -- Premium users have unlimited credits
  END IF;
  
  -- Get current credits
  SELECT credits_remaining INTO current_credits 
  FROM profiles WHERE id = user_uuid;
  
  -- Check if user has credits available
  IF current_credits <= 0 THEN
    RETURN false;
  END IF;
  
  -- Deduct one credit
  UPDATE profiles 
  SET credits_remaining = credits_remaining - 1,
      updated_at = now()
  WHERE id = user_uuid;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `is_premium_user(user_uuid uuid)`
```sql
-- Checks if user has active premium subscription
CREATE OR REPLACE FUNCTION is_premium_user(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  subscription_record subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO subscription_record
  FROM subscriptions
  WHERE user_id = user_uuid
    AND status = 'active'
    AND current_period_end > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `can_access_content(user_uuid uuid, content_type text, content_id uuid)`
```sql
-- Determines if user can access premium content
CREATE OR REPLACE FUNCTION can_access_content(
  user_uuid uuid, 
  content_type text, 
  content_id uuid
)
RETURNS boolean AS $$
DECLARE
  is_premium_content boolean;
  user_is_premium boolean;
BEGIN
  -- Check if content is premium
  IF content_type = 'tool' THEN
    SELECT is_premium INTO is_premium_content 
    FROM tools WHERE id = content_id;
  ELSIF content_type = 'track' THEN
    SELECT is_premium INTO is_premium_content 
    FROM tracks WHERE id = content_id;
  ELSE
    RETURN false;  -- Unknown content type
  END IF;
  
  -- If content is free, allow access
  IF NOT is_premium_content THEN
    RETURN true;
  END IF;
  
  -- Check if user is premium
  user_is_premium := is_premium_user(user_uuid);
  
  RETURN user_is_premium;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Progress Tracking Functions

#### `calculate_track_progress(user_uuid uuid, track_uuid uuid)`
```sql
-- Calculates completion percentage for a track
CREATE OR REPLACE FUNCTION calculate_track_progress(
  user_uuid uuid, 
  track_uuid uuid
)
RETURNS integer AS $$
DECLARE
  total_modules integer;
  completed_modules integer;
  progress_percentage integer;
BEGIN
  -- Get total modules in track
  SELECT total_modules INTO total_modules
  FROM tracks WHERE id = track_uuid;
  
  -- Get completed modules count
  SELECT COUNT(*) INTO completed_modules
  FROM user_module_progress
  WHERE user_id = user_uuid
    AND track_id = track_uuid
    AND is_completed = true;
  
  -- Calculate percentage
  IF total_modules > 0 THEN
    progress_percentage := (completed_modules * 100) / total_modules;
  ELSE
    progress_percentage := 0;
  END IF;
  
  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### `complete_module(user_uuid uuid, track_uuid uuid, module_num integer)`
```sql
-- Marks a module as completed and unlocks next module
CREATE OR REPLACE FUNCTION complete_module(
  user_uuid uuid,
  track_uuid uuid, 
  module_num integer
)
RETURNS boolean AS $$
DECLARE
  existing_progress user_module_progress%ROWTYPE;
BEGIN
  -- Check if module already completed
  SELECT * INTO existing_progress
  FROM user_module_progress
  WHERE user_id = user_uuid
    AND track_id = track_uuid
    AND module_number = module_num;
  
  IF FOUND AND existing_progress.is_completed THEN
    RETURN true;  -- Already completed
  END IF;
  
  -- Insert or update completion record
  INSERT INTO user_module_progress (
    user_id, track_id, module_number, 
    is_completed, completion_date
  )
  VALUES (
    user_uuid, track_uuid, module_num,
    true, now()
  )
  ON CONFLICT (user_id, track_id, module_number)
  DO UPDATE SET
    is_completed = true,
    completion_date = now();
  
  -- Update user_tracks progress
  UPDATE user_tracks
  SET 
    completed_modules = (
      SELECT COUNT(*) FROM user_module_progress
      WHERE user_id = user_uuid 
        AND track_id = track_uuid 
        AND is_completed = true
    ),
    current_module = GREATEST(current_module, module_num + 1),
    updated_at = now()
  WHERE user_id = user_uuid AND track_id = track_uuid;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Row Level Security (RLS) Policies

### Profile Policies
```sql
-- Users can only view and update their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Chat Policies
```sql
-- Users can only access their own conversations and messages
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages from their conversations"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Content Access Policies
```sql
-- Anyone can view active tools (premium check handled in application)
CREATE POLICY "Anyone can view active tools"
  ON tools FOR SELECT
  USING (true);

-- Anyone can view published tracks
CREATE POLICY "Anyone can view published tracks"
  ON tracks FOR SELECT
  USING (true);

-- Users can manage their own tool preferences
CREATE POLICY "Users can manage their own tool preferences"
  ON user_tools FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage their own track progress
CREATE POLICY "Users can manage their own track progress"
  ON user_tracks FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own module progress"
  ON user_module_progress FOR ALL
  USING (auth.uid() = user_id);

-- Users can manage their own reviews
CREATE POLICY "Users can manage their own reviews"
  ON track_reviews FOR ALL
  USING (auth.uid() = user_id);

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON track_reviews FOR SELECT
  USING (true);
```

### Subscription Policies
```sql
-- Users can only view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own payment history
CREATE POLICY "Users can view their own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can view active products and prices
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active prices"
  ON prices FOR SELECT
  USING (is_active = true);
```

## Storage Buckets

### `avatars` Bucket
- **Purpose**: User profile avatars
- **Access**: Authenticated users can upload/update their own avatars
- **File Types**: JPG, PNG, WebP
- **Size Limit**: 2MB per file

### `attachments` Bucket  
- **Purpose**: Chat message attachments
- **Access**: Authenticated users for their own conversations
- **File Types**: Images, documents, media files
- **Size Limit**: 10MB per file

### `content` Bucket
- **Purpose**: Track content (videos, images, documents)
- **Access**: Public read, admin write
- **File Types**: All media types
- **Size Limit**: 100MB per file

## Database Triggers

### Automatic Timestamp Updates
```sql
-- Update updated_at column on row changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### User Profile Creation
```sql
-- Create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Subscription Management
```sql
-- Update user premium status when subscription changes
CREATE TRIGGER auto_update_user_premium_status
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION auto_update_user_premium_status();
```

## Integration Notes

### Frontend Integration Points
- All database operations should use Supabase client with proper error handling
- Real-time subscriptions for chat messages and notifications
- File uploads through Supabase Storage with progress tracking
- Subscription status validation before accessing premium features

### Security Considerations
- All tables have RLS enabled with user-specific policies
- Sensitive operations (credit usage, subscription changes) use SECURITY DEFINER functions
- File uploads require authentication and size/type validation
- API keys and secrets stored in Supabase vault (when available)

### Performance Optimizations
- Database indexes on frequently queried columns (user_id, created_at)
- Connection pooling for high-traffic scenarios
- Optimized queries for user dashboard and progress tracking
- Efficient real-time subscription patterns