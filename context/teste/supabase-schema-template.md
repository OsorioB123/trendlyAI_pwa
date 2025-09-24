# TrendlyAI Supabase Schema Documentation

## Database Architecture Overview

### Core Tables Structure

#### **profiles** (User Management)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT false,
  credits_remaining INTEGER DEFAULT 50,
  monthly_credits_reset_date DATE,
  subscription_id TEXT,
  stripe_customer_id TEXT,
  preferences JSONB
);
```

#### **conversations** (Chat System)
```sql
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nova Conversa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false
);
```

#### **messages** (Chat Messages)
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tokens_used INTEGER,
  model_used TEXT DEFAULT 'gpt-3.5-turbo'
);
```

#### **tools** (AI Tools Library)
```sql
CREATE TABLE tools (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0
);
```

#### **tracks** (Learning Tracks)
```sql
CREATE TABLE tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('Iniciante', 'Intermediário', 'Avançado')),
  estimated_duration TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  total_modules INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER
);
```

#### **track_modules** (Track Content)
```sql
CREATE TABLE track_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  video_url TEXT,
  tools JSONB, -- Array of tool IDs for "Arsenal da Missão"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **user_tools** (User Tool Preferences)
```sql
CREATE TABLE user_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  custom_prompt TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);
```

#### **user_tracks** (Track Progress)
```sql
CREATE TABLE user_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  current_module_id UUID REFERENCES track_modules(id),
  is_favorite BOOLEAN DEFAULT false,
  UNIQUE(user_id, track_id)
);
```

#### **user_module_progress** (Module Completion)
```sql
CREATE TABLE user_module_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  module_id UUID REFERENCES track_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);
```

#### **track_reviews** (Track Evaluations)
```sql
CREATE TABLE track_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);
```

### Subscription Management (Stripe Integration)

#### **subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  plan_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **payment_history**
```sql
CREATE TABLE payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Em centavos
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **products** & **prices** (Stripe Product Sync)
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  active BOOLEAN,
  name TEXT,
  description TEXT,
  metadata JSONB
);

CREATE TABLE prices (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  active BOOLEAN,
  currency TEXT,
  interval TEXT,
  interval_count INTEGER,
  unit_amount INTEGER,
  metadata JSONB
);
```

## Database Functions & Triggers

### Key Functions (Based on your screenshots)

#### **User Management Functions**
- `handle_new_user()` - Trigger para criação automática de profile
- `update_updated_at_column()` - Trigger para atualizar timestamp
- `auto_update_user_premium_status()` - Atualizar status premium automaticamente

#### **Credit Management Functions**  
- `get_available_credits(user_uuid)` - Retorna créditos disponíveis
- `use_credit(user_uuid)` - Consome um crédito
- `reset_monthly_credits()` - Reset mensal de créditos
- `is_premium_user(user_uuid)` - Verifica se usuário é premium

#### **Track Progress Functions**
- `calculate_track_progress(user_uuid, track_uuid)` - Calcula progresso da trilha
- `calculate_active_tracks(user_uuid)` - Trilhas ativas do usuário
- `calculate_completed_modules(user_uuid)` - Módulos completados
- `complete_module(user_uuid, track_uuid, module_uuid)` - Marca módulo como completo
- `can_access_module(user_uuid, track_uuid, module_uuid)` - Verifica acesso ao módulo

#### **Chat Functions**
- `find_direct_conversation(user1_uuid, user2_uuid)` - Encontra conversa direta
- `get_conversation_details(conv_uuid)` - Detalhes da conversa
- `send_user_message(user_uuid, conversation_uuid, content)` - Envia mensagem

#### **Content Validation**
- `validate_track_content(track_uuid)` - Valida conteúdo da trilha
- `can_access_content(user_uuid, content_type, content_uuid)` - Verifica acesso a conteúdo

## Row Level Security (RLS) Policies

### profiles
- Users can view/update their own profile
- Profiles are created automatically on signup

### conversations & messages  
- Users can only access their own conversations
- Real-time subscriptions enabled for live chat

### tools
- Public read access for active tools
- Premium tools filtered based on user subscription

### tracks & track_modules
- Public read access for published tracks
- Premium content filtered based on subscription

### user_* tables
- Users can only access/modify their own data
- Progress tracking protected by user ownership

## Storage Buckets

### **avatars** (Public)
- User profile pictures
- Automatic image optimization
- Public read access

### **attachments** (Authenticated)  
- Chat file attachments
- User-uploaded content
- Authenticated access only

### **content** (Public)
- Track videos and images
- Course thumbnails
- Public CDN access

## Real-time Subscriptions Setup

### Chat Real-time
```javascript
// Real-time chat subscription
supabase
  .channel('conversations')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe()
```

### Progress Updates
```javascript
// Track progress real-time updates
supabase
  .channel('user_progress')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public', 
    table: 'user_module_progress',
    filter: `user_id=eq.${userId}`
  }, handleProgressUpdate)
  .subscribe()
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
```
