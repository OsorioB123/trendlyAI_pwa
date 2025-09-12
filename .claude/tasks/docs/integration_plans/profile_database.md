# Profile Service Supabase Integration Plan

## Overview
The ProfileContent.tsx is currently using mock data because the ProfileService.ts was designed for table names that don't match the actual Supabase database schema. This plan provides a comprehensive integration strategy to connect the profile functionality with the existing database structure without creating new tables.

## Critical Issues Identified

### 1. Table Name Mismatches
**Current Service References vs Actual Database Tables:**
- ProfileService uses: `user_track_progress` → **Actual table**: `user_tracks`  
- ProfileService uses: `user_module_progress` → **Actual table**: `user_module_progress`  
- ProfileService uses: `user_favorite_tools` → **Actual table**: `user_tools`  
- ProfileService uses: `user_referrals` → **No existing table** (needs creation)
- ProfileService uses: `profiles.user_id` → **Actual column**: `profiles.id` (references auth.users(id))

### 2. Service Method Issues
- Several service methods reference wrong column names
- Missing column mappings for existing schema
- Incorrect relationships and foreign key references
- Missing authentication context in database queries

### 3. Hook Integration
- `useProfile` hook is disabled due to service issues
- ProfileContent.tsx falls back to mock data
- No real-time data integration currently active

## Database Requirements

### Tables Already Available (No Creation Needed)
✅ **profiles** - Complete with all required columns
✅ **user_tracks** - For track progress management  
✅ **user_module_progress** - For module completion tracking
✅ **user_tools** - For tool preferences and favorites
✅ **tools** - Contains all available tools
✅ **tracks** - Contains all available learning tracks
✅ **track_modules** - Contains track content structure
✅ **subscriptions** - For subscription management

### Tables That Need Creation
❌ **user_referrals** - For referral system functionality

```sql
-- This is the ONLY table that needs to be created
CREATE TABLE user_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  total_credits INTEGER DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  pending_credits INTEGER DEFAULT 0,
  affiliate_earnings INTEGER DEFAULT 0,
  is_affiliate_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Missing Database Functions
Several RPC functions referenced in ProfileService need creation:

```sql
-- Function to calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  -- Implementation for calculating consecutive active days
  -- This is a simplified version - real implementation would be more complex
  RETURN 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Frontend Integration Architecture

### Updated ProfileService.ts Implementation

The current ProfileService has critical issues that prevent it from working with the actual database schema. Here are the required fixes:

#### 1. Fix Table and Column References
```javascript
// WRONG (current implementation)
static async getUserProfile(userId: string): Promise<ServiceResponse<UserProfile>> {
  const { data, error } = await this.getClient()
    .from('profiles')
    .select('*')
    .eq('user_id', userId) // ❌ Wrong column name
    .single()

// CORRECT (updated implementation)  
static async getUserProfile(userId: string): Promise<ServiceResponse<UserProfile>> {
  const { data, error } = await this.getClient()
    .from('profiles')
    .select('*')
    .eq('id', userId) // ✅ Correct - profiles.id references auth.users(id)
    .single()
```

#### 2. Fix Arsenal Data Queries
```javascript
// WRONG (current implementation)
static async getArsenalData(userId: string): Promise<ServiceResponse<ArsenalData>> {
  const [tracksResult, toolsResult] = await Promise.all([
    this.getClient()
      .from('user_track_progress') // ❌ Wrong table name
      .select(`*, track:tracks(*)`)
      .eq('user_id', userId),
    
    this.getClient()
      .from('user_favorite_tools') // ❌ Wrong table name
      .select(`*, tool:tools(*)`)
      .eq('user_id', userId)
  ])

// CORRECT (updated implementation)
static async getArsenalData(userId: string): Promise<ServiceResponse<ArsenalData>> {
  const [tracksResult, toolsResult] = await Promise.all([
    this.getClient()
      .from('user_tracks') // ✅ Correct table name
      .select(`
        *,
        track:tracks(
          id, title, subtitle, description, category, 
          difficulty_level, estimated_duration, thumbnail_url, is_premium
        )
      `)
      .eq('user_id', userId),
    
    this.getClient()
      .from('user_tools') // ✅ Correct table name  
      .select(`
        *,
        tool:tools(
          id, title, description, category, tags, is_premium
        )
      `)
      .eq('user_id', userId)
      .eq('is_favorite', true) // ✅ Only get favorited tools
  ])
```

#### 3. Fix Profile Metrics Calculations
```javascript
// Updated metrics calculation with correct table references
static async getProfileMetrics(userId: string): Promise<ServiceResponse<ProfileMetrics>> {
  try {
    const [
      activeTracksResult,
      completedModulesResult,
      favoriteToolsResult,
      streakResult
    ] = await Promise.all([
      // Active tracks
      this.getClient()
        .from('user_tracks')
        .select('id')
        .eq('user_id', userId)
        .neq('completed_at', null), // Only count active tracks

      // Completed modules  
      this.getClient()
        .from('user_module_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('is_completed', true),

      // Favorite tools count
      this.getClient()
        .from('user_tools')
        .select('id')
        .eq('user_id', userId)
        .eq('is_favorite', true),

      // Streak calculation (requires RPC function)
      this.getClient().rpc('calculate_user_streak', { user_uuid: userId })
    ])

    const metrics: ProfileMetrics = {
      total_tracks: activeTracksResult.data?.length || 0,
      completed_modules: completedModulesResult.data?.length || 0,
      streak_days: streakResult.data || 0,
      active_tracks: activeTracksResult.data?.length || 0,
      favorite_tools: favoriteToolsResult.data?.length || 0
    }

    return { success: true, data: metrics }
  } catch (error) {
    console.error('Profile metrics error:', error)
    return { 
      success: false, 
      error: 'Erro ao carregar métricas do perfil' 
    }
  }
}
```

### Custom Hook Implementation (useProfile)

The disabled `useProfile` hook needs to be re-enabled with proper error handling:

```javascript
// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileService from '../lib/services/profileService'
import type { UserProfile, ProfileMetrics, ArsenalData, ReferralInfo, NextActionRecommendation } from '../types/profile'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [metrics, setMetrics] = useState<ProfileMetrics | null>(null)
  const [arsenal, setArsenal] = useState<ArsenalData>({ tracks: [], tools: [] })
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)
  const [nextAction, setNextAction] = useState<NextActionRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfileData = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const [
        profileResult,
        metricsResult,
        arsenalResult,
        referralResult,
        nextActionResult
      ] = await Promise.all([
        ProfileService.getUserProfile(user.id),
        ProfileService.getProfileMetrics(user.id),
        ProfileService.getArsenalData(user.id),
        ProfileService.getReferralInfo(user.id),
        ProfileService.getNextActionRecommendation(user.id)
      ])

      if (profileResult.success) {
        setProfile(profileResult.data!)
      } else {
        console.warn('Profile load warning:', profileResult.error)
      }

      if (metricsResult.success) {
        setMetrics(metricsResult.data!)
      }

      if (arsenalResult.success) {
        setArsenal(arsenalResult.data!)
      }

      if (referralResult.success) {
        setReferralInfo(referralResult.data!)
      }

      if (nextActionResult.success) {
        setNextAction(nextActionResult.data!)
      }

    } catch (err) {
      console.error('Profile data loading error:', err)
      setError('Erro ao carregar dados do perfil')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const updateProfile = useCallback(async (data: any) => {
    if (!user?.id) return { success: false, error: 'Usuário não autenticado' }

    setIsUpdating(true)
    try {
      const result = await ProfileService.updateProfile(user.id, data)
      if (result.success) {
        setProfile(result.data!)
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar perfil' }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id])

  const updateAvatar = useCallback(async (file: File) => {
    if (!user?.id) return { success: false, error: 'Usuário não autenticado' }

    setIsUpdating(true)
    try {
      const result = await ProfileService.uploadAvatar(user.id, file)
      if (result.success) {
        // Reload profile to get updated avatar URL
        await loadProfileData()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar avatar' }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id, loadProfileData])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    if (user?.id) {
      loadProfileData()
    }
  }, [user?.id, loadProfileData])

  return {
    profile,
    metrics,
    arsenal,
    referralInfo,
    nextAction,
    isLoading,
    isUpdating,
    error,
    clearError,
    updateProfile,
    updateAvatar,
    refetch: loadProfileData
  }
}
```

## Security Implementation

### Row Level Security Policies Required

All necessary RLS policies should already exist based on the schema, but verify these are active:

```sql
-- Verify these policies exist and are enabled
-- profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- user_tracks table  
ALTER TABLE user_tracks ENABLE ROW LEVEL SECURITY;

-- user_tools table
ALTER TABLE user_tools ENABLE ROW LEVEL SECURITY;

-- user_module_progress table
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;

-- user_referrals table (needs creation with RLS)
CREATE POLICY "Users can view own referral data" ON user_referrals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own referral data" ON user_referrals  
  FOR UPDATE USING (auth.uid() = user_id);
```

## Performance Optimization

### Database Indexes for Profile Queries

Verify these indexes exist for optimal performance:

```sql
-- Check if these indexes exist (they should based on the schema)
CREATE INDEX IF NOT EXISTS idx_user_tracks_user_id ON user_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tools_user_id ON user_tools(user_id);  
CREATE INDEX IF NOT EXISTS idx_user_tools_favorite ON user_tools(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_completed ON user_module_progress(user_id, is_completed);
```

### Query Optimization Patterns

The service should use efficient queries:

```javascript
// Optimized arsenal query with specific field selection
static async getArsenalData(userId: string): Promise<ServiceResponse<ArsenalData>> {
  const [tracksResult, toolsResult] = await Promise.all([
    this.getClient()
      .from('user_tracks')
      .select(`
        id, progress_percentage, started_at, completed_at,
        track:tracks!inner(
          id, title, subtitle, description, category,
          difficulty_level, thumbnail_url, is_premium
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(20), // Limit for performance

    this.getClient()
      .from('user_tools')
      .select(`
        id, usage_count, last_used_at,
        tool:tools!inner(
          id, title, description, category, tags, is_premium
        )
      `)
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .order('last_used_at', { ascending: false })
      .limit(50) // Limit for performance
  ])

  // Process results...
}
```

## Manual Supabase Configuration

### Database Setup Steps

1. **Create Missing Table** (user_referrals):
   ```sql
   CREATE TABLE user_referrals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     referral_code TEXT UNIQUE NOT NULL,
     total_credits INTEGER DEFAULT 0,
     total_referrals INTEGER DEFAULT 0,
     pending_credits INTEGER DEFAULT 0,
     affiliate_earnings INTEGER DEFAULT 0,
     is_affiliate_eligible BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Create RLS Policies** for user_referrals:
   ```sql
   ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can view own referrals" ON user_referrals
     FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can update own referrals" ON user_referrals
     FOR UPDATE USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert own referrals" ON user_referrals  
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

3. **Create Database Functions**:
   ```sql
   CREATE OR REPLACE FUNCTION calculate_user_streak(user_uuid UUID)
   RETURNS INTEGER AS $$
   DECLARE
     streak_count INTEGER := 0;
   BEGIN
     -- Basic implementation - can be enhanced later
     -- For now, return 0 as placeholder
     RETURN streak_count;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

4. **Create Profile Trigger** (if not exists):
   ```sql
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO profiles (id, email, full_name, created_at, updated_at)
     VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NOW(), NOW());
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger if not exists
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION handle_new_user();
   ```

### Environment Variables Required
```env
# Should already be configured
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Implementation Priority and Timeline

### Phase 1: Critical Fixes (Immediate)
1. ✅ Fix ProfileService.ts table and column references
2. ✅ Create user_referrals table in Supabase
3. ✅ Enable useProfile hook in ProfileContent.tsx
4. ✅ Test basic profile loading functionality

### Phase 2: Full Integration (1-2 days)  
1. ✅ Implement complete arsenal data loading
2. ✅ Add referral system functionality
3. ✅ Implement avatar upload functionality
4. ✅ Add profile update capabilities

### Phase 3: Optimization (3-5 days)
1. ✅ Add real-time subscriptions for profile updates
2. ✅ Implement caching strategies
3. ✅ Add comprehensive error handling
4. ✅ Performance optimization and monitoring

## Risk Assessment and Mitigation

### Technical Risks
- **Database Query Performance**: Mitigated by proper indexing and query limits
- **Authentication Edge Cases**: Handled by comprehensive error boundaries
- **Real-time Connection Issues**: Fallback to polling if subscriptions fail

### Security Risks  
- **Data Exposure**: Prevented by RLS policies on all tables
- **Unauthorized Updates**: Mitigated by proper authentication checks
- **File Upload Security**: Handled by Supabase Storage security policies

## Key Code Files to Update

### Files That Need Updates:
1. **C:\Users\bruno\Documents\Trendly\Claude Code\trendlyAI_pwa\src\lib\services\profileService.ts** - Fix all table/column references
2. **C:\Users\bruno\Documents\Trendly\Claude Code\trendlyAI_pwa\src\app\profile\ProfileContent.tsx** - Re-enable useProfile hook
3. **C:\Users\bruno\Documents\Trendly\Claude Code\trendlyAI_pwa\src\hooks\useProfile.ts** - Implement full hook functionality

### Critical Implementation Changes:

```javascript
// In ProfileContent.tsx - Replace mock profile with real hook
import { useProfile } from '../../hooks/useProfile'

export default function ProfileContent() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  // Replace mock data with real hook
  const profile = useProfile() // ✅ Enable this line
  
  // Remove mock profile object entirely
  // const profile = { ... } // ❌ Remove this
```

## Expected Outcomes

After implementing this integration plan:

1. **Profile page will display real user data** instead of mock data
2. **Arsenal section will show actual user tracks and favorite tools**
3. **Profile metrics will reflect real progress and usage statistics**  
4. **Avatar upload and profile editing will be fully functional**
5. **Referral system will be operational with real codes and tracking**
6. **All data will be properly secured with RLS policies**
7. **Performance will be optimized with proper indexing and query patterns**

## Handoff Requirements

### For Frontend Developer
- Follow the updated ProfileService.ts patterns for all database operations
- Use the provided useProfile hook implementation
- Handle loading and error states properly in UI components
- Test all functionality with real user accounts

### For Testing
- Test profile loading with different user scenarios
- Verify all CRUD operations work correctly
- Test avatar upload functionality with various file types
- Validate proper error handling and user feedback
- Test referral code generation and tracking

This comprehensive integration plan addresses all identified issues and provides a clear path to connect the profile functionality with the existing Supabase database structure without unnecessary table creation.