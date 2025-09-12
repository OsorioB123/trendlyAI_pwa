# 🤝 Referral System Tables

## user_referrals (Referral Management)

**Purpose**: Manage user referral codes, credits, and affiliate program

### Schema
```sql
CREATE TABLE user_referrals (
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
```

### Indexes
```sql
CREATE INDEX idx_user_referrals_user_id ON user_referrals(user_id);
CREATE INDEX idx_user_referrals_code ON user_referrals(referral_code);
CREATE INDEX idx_user_referrals_affiliate ON user_referrals(is_affiliate_eligible);
```

### Key Relationships
- `profiles(id)` → Referral owner
- One-to-one relationship with profiles

### Business Logic

#### Referral Code Generation
- **Format**: `{username}{4-digit-random}` (e.g., `bruno1234`)
- **Fallback**: `user{6-digit-random}` if no username
- **Uniqueness**: Automatic collision detection and regeneration
- **Length**: Maximum 20 characters

#### Credit System
- **Referrer Reward**: 10 credits per successful referral
- **Referee Reward**: 5 bonus credits on signup
- **Credit Types**:
  - `total_credits`: Lifetime earned credits
  - `pending_credits`: Credits awaiting confirmation
- **Credit Validation**: 30-day confirmation period

#### Affiliate Program
- **Eligibility**: 5+ successful referrals
- **Commission**: 20% of referee subscription payments
- **Payout**: Monthly via Stripe Connect
- **Tracking**: All earnings tracked in `affiliate_earnings`

### Common Queries

#### Get User Referral Info
```typescript
const { data } = await supabase
  .from('user_referrals')
  .select('*')
  .eq('user_id', userId)
  .single()
```

#### Generate New Referral Code
```typescript
async function generateReferralCode(userId: string): Promise<string> {
  // Get user profile for username
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username')
    .eq('id', userId)
    .single()

  // Generate base code
  const baseName = (profile?.username || profile?.display_name || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 8)
  
  let referralCode = `${baseName}${Math.random().toString(36).substring(2, 6)}`
  
  // Check for uniqueness
  let attempts = 0
  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('user_referrals')
      .select('referral_code')
      .eq('referral_code', referralCode)
      .single()

    if (!existing) break
    
    referralCode = `${baseName}${Math.random().toString(36).substring(2, 6)}`
    attempts++
  }

  return referralCode
}
```

#### Create Referral Record
```typescript
const { data } = await supabase
  .from('user_referrals')
  .insert([{
    user_id: userId,
    referral_code: await generateReferralCode(userId),
    total_credits: 0,
    total_referrals: 0,
    pending_credits: 0,
    affiliate_earnings: 0.00,
    is_affiliate_eligible: false
  }])
  .select()
  .single()
```

---

## referral_transactions (Referral Activity Log)

**Purpose**: Track all referral-related transactions and activity

### Schema
```sql
CREATE TABLE referral_transactions (
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
  metadata JSONB, -- Stripe payment info, subscription details, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Indexes
```sql
CREATE INDEX idx_referral_transactions_referrer ON referral_transactions(referrer_id);
CREATE INDEX idx_referral_transactions_referee ON referral_transactions(referee_id);
CREATE INDEX idx_referral_transactions_code ON referral_transactions(referral_code);
CREATE INDEX idx_referral_transactions_type ON referral_transactions(transaction_type);
CREATE INDEX idx_referral_transactions_status ON referral_transactions(status);
```

### Key Relationships
- `profiles(id)` → Referrer (person who made referral)
- `profiles(id)` → Referee (person who was referred)
- `user_referrals.referral_code` → Referral code used

### Business Logic

#### Transaction Types
1. **signup**: New user registered with referral code
2. **subscription**: Referee purchased premium subscription
3. **credit_award**: Credits awarded to referrer
4. **affiliate_payout**: Commission payment to affiliate

#### Status Flow
1. **pending**: Transaction created, awaiting confirmation
2. **confirmed**: Transaction validated, credits/earnings updated
3. **paid**: Affiliate commission paid out
4. **cancelled**: Transaction voided or refunded

### Common Queries

#### Track Referral Signup
```typescript
const { data } = await supabase
  .from('referral_transactions')
  .insert([{
    referrer_id: referrerId,
    referee_id: newUserId,
    referral_code: code,
    transaction_type: 'signup',
    credit_amount: 10, // Credits for referrer
    status: 'pending'
  }])
  .select()
  .single()
```

#### Get Referral History
```typescript
const { data } = await supabase
  .from('referral_transactions')
  .select(`
    *,
    referee:profiles!referee_id(display_name, email)
  `)
  .eq('referrer_id', userId)
  .order('created_at', { ascending: false })
```

---

## Database Functions

### Calculate Referral Stats
```sql
CREATE OR REPLACE FUNCTION calculate_user_referral_stats(user_uuid UUID)
RETURNS TABLE (
  total_referrals INTEGER,
  pending_referrals INTEGER,
  total_credits INTEGER,
  affiliate_earnings DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN rt.status = 'confirmed' THEN 1 END)::INTEGER as total_referrals,
    COUNT(CASE WHEN rt.status = 'pending' THEN 1 END)::INTEGER as pending_referrals,
    COALESCE(SUM(CASE WHEN rt.status = 'confirmed' THEN rt.credit_amount END), 0)::INTEGER as total_credits,
    COALESCE(SUM(CASE WHEN rt.status = 'paid' THEN rt.monetary_amount END), 0.00) as affiliate_earnings
  FROM referral_transactions rt
  WHERE rt.referrer_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
```

### Process Referral Signup
```sql
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
  IF referrer_record.total_referrals >= 4 THEN -- Will be 5 after this referral
    UPDATE user_referrals 
    SET is_affiliate_eligible = true
    WHERE user_id = referrer_record.user_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

## RLS Policies

### user_referrals
```sql
-- Users can view their own referral data
CREATE POLICY "Users can view own referral data" ON user_referrals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own referral data
CREATE POLICY "Users can update own referral data" ON user_referrals
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own referral data
CREATE POLICY "Users can insert own referral data" ON user_referrals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### referral_transactions
```sql
-- Users can view transactions where they are referrer or referee
CREATE POLICY "Users can view related transactions" ON referral_transactions
  FOR SELECT USING (
    auth.uid() = referrer_id OR auth.uid() = referee_id
  );

-- Only system can insert transactions (via functions)
CREATE POLICY "System can insert transactions" ON referral_transactions
  FOR INSERT WITH CHECK (false); -- Handled via functions only
```

---

## Triggers

### Auto Update Referral Stats
```sql
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS trigger AS $$
BEGIN
  -- Update referrer stats when transaction confirmed
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE user_referrals SET
      total_referrals = total_referrals + 1,
      total_credits = total_credits + NEW.credit_amount,
      updated_at = timezone('utc'::text, now())
    WHERE user_id = NEW.referrer_id;
    
    -- Award credits to referrer profile
    UPDATE profiles SET
      referral_credits = referral_credits + NEW.credit_amount
    WHERE id = NEW.referrer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_referral_stats_trigger
  AFTER UPDATE ON referral_transactions
  FOR EACH ROW EXECUTE FUNCTION update_referral_stats();
```

### Auto Update Timestamps
```sql
CREATE TRIGGER update_user_referrals_updated_at
  BEFORE UPDATE ON user_referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Integration Examples

### Profile Page Referral Section
```typescript
// Get complete referral info for profile page
const getUserReferralData = async (userId: string) => {
  const { data: referralInfo } = await supabase
    .from('user_referrals')
    .select('*')
    .eq('user_id', userId)
    .single()

  const { data: recentTransactions } = await supabase
    .from('referral_transactions')
    .select(`
      *,
      referee:profiles!referee_id(display_name, email)
    `)
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  return { referralInfo, recentTransactions }
}
```

### Referral Code Usage
```typescript
// Apply referral code during signup
const applyReferralCode = async (code: string, newUserId: string) => {
  const { data } = await supabase.rpc('process_referral_signup', {
    referral_code_param: code,
    new_user_id: newUserId
  })
  
  return data
}
```