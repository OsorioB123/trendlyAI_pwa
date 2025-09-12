# 👤 Core User Tables

## profiles (User Management)

**Purpose**: Central user data and profile management

### Schema
```sql
CREATE TABLE profiles (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Subscription Management
  is_premium BOOLEAN DEFAULT false,
  credits_remaining INTEGER DEFAULT 50,
  monthly_credits_reset_date DATE,
  subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- User Preferences
  preferences JSONB
);
```

### Indexes
```sql
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);
```

### Key Relationships
- `auth.users(id)` → Primary authentication
- `conversations(user_id)` → User conversations
- `user_tools(user_id)` → Tool preferences
- `user_tracks(user_id)` → Track progress
- `subscriptions(user_id)` → Subscription data
- `user_referrals(user_id)` → Referral information

### Business Logic
- **Free Users**: 50 monthly credits, limited to free tools/tracks
- **Premium Users**: Unlimited credits, access to all content
- **Profile Completion**: Tracked by display_name, bio, avatar_url
- **Gamification**: Level progression based on completed content

### Common Queries
```typescript
// Get user profile with subscription info
const { data } = await supabase
  .from('profiles')
  .select(`
    *, 
    subscriptions(*)
  `)
  .eq('id', userId)
  .single()

// Update user profile
const { data } = await supabase
  .from('profiles')
  .update({ display_name, bio })
  .eq('id', userId)
  .select()
  .single()
```

---

## conversations (Chat System)

**Purpose**: Chat conversations between users and Salina AI

### Schema
```sql
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nova Conversa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  
  -- Conversation metadata
  context_data JSONB, -- Stores conversation context for AI
  tool_used UUID REFERENCES tools(id), -- Tool that initiated conversation
  track_context UUID REFERENCES tracks(id) -- Track context if applicable
);
```

### Indexes
```sql
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_tool_used ON conversations(tool_used);
```

### Key Relationships
- `profiles(id)` → Conversation owner
- `messages(conversation_id)` → Chat messages
- `tools(id)` → Tool that started conversation
- `tracks(id)` → Track context

### Business Logic
- **Auto-titling**: First message content used for title
- **Archiving**: Old conversations auto-archived after 30 days
- **Context Preservation**: AI conversation context stored in JSONB
- **Real-time Updates**: Live message updates via Supabase Realtime

### Common Queries
```typescript
// Get user conversations with latest message
const { data } = await supabase
  .from('conversations')
  .select(`
    *,
    messages!messages_conversation_id_fkey(
      content,
      created_at,
      role
    )
  `)
  .eq('user_id', userId)
  .eq('is_archived', false)
  .order('updated_at', { ascending: false })
  .limit(1, { foreignTable: 'messages' })

// Create new conversation
const { data } = await supabase
  .from('conversations')
  .insert([{
    user_id: userId,
    title: 'Nova Conversa',
    tool_used: toolId
  }])
  .select()
  .single()
```

---

## messages (Chat Messages)

**Purpose**: Individual messages in chat conversations

### Schema
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- AI Usage Tracking
  tokens_used INTEGER,
  model_used TEXT DEFAULT 'gpt-4',
  cost_cents INTEGER, -- Cost in cents
  
  -- Message Metadata
  metadata JSONB, -- Tool outputs, file attachments, etc.
  parent_message_id UUID REFERENCES messages(id), -- For message threading
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE
);
```

### Indexes
```sql
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_role ON messages(role);
```

### Key Relationships
- `conversations(id)` → Parent conversation
- `messages(id)` → Parent message (for threading)

### Business Logic
- **Credit Consumption**: Each AI response consumes 1 user credit
- **Token Tracking**: AI usage monitoring for cost analysis
- **Message Threading**: Support for message replies/threads
- **Real-time Delivery**: Live message streaming

### Common Queries
```typescript
// Get conversation messages
const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: true })

// Send user message
const { data } = await supabase
  .from('messages')
  .insert([{
    conversation_id: conversationId,
    content: messageContent,
    role: 'user'
  }])
  .select()
  .single()

// Real-time subscription
const subscription = supabase
  .channel(`messages_${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe()
```

---

## RLS Policies

### profiles
```sql
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public profiles for basic info (display_name, avatar_url)
CREATE POLICY "Public profile info" ON profiles
  FOR SELECT USING (true) -- Limited columns via API
```

### conversations
```sql
-- Users can only access their own conversations
CREATE POLICY "Users can view own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);
```

### messages  
```sql
-- Users can only access messages from their conversations
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
```

---

## Triggers & Functions

### Auto Profile Creation
```sql
-- Automatically create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### Update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```