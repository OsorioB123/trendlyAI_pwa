# 🔌 TrendlyAI Supabase API Reference

## Service Layer API Documentation

This document provides a complete reference for all Supabase service methods used in TrendlyAI.

---

## ProfileService

### `getUserProfile(userId: string)`
**Purpose**: Fetch complete user profile data

```typescript
const result = await ProfileService.getUserProfile(userId)
// Returns: ServiceResponse<UserProfile>
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "display_name": "João Silva",
    "bio": "Desenvolvedor apaixonado por IA",
    "avatar_url": "https://...",
    "level": "Explorador",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### `updateProfile(userId: string, updates: ProfileUpdateData)`
**Purpose**: Update user profile information

```typescript
const result = await ProfileService.updateProfile(userId, {
  display_name: "Novo Nome",
  bio: "Nova biografia"
})
// Returns: ServiceResponse<UserProfile>
```

### `uploadAvatar(userId: string, file: File)`
**Purpose**: Upload and set user avatar

```typescript
const result = await ProfileService.uploadAvatar(userId, fileObject)
// Returns: ServiceResponse<string> (avatar URL)
```

### `getProfileMetrics(userId: string)`
**Purpose**: Get user activity metrics

```typescript
const result = await ProfileService.getProfileMetrics(userId)
// Returns: ServiceResponse<ProfileMetrics>
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "total_tracks": 5,
    "completed_modules": 15,
    "streak_days": 7,
    "active_tracks": 2,
    "favorite_tools": 8
  }
}
```

### `getArsenalData(userId: string)`
**Purpose**: Get user's favorite tracks and tools

```typescript
const result = await ProfileService.getArsenalData(userId)
// Returns: ServiceResponse<ArsenalData>
```

### `getReferralInfo(userId: string)`
**Purpose**: Get user's referral information

```typescript
const result = await ProfileService.getReferralInfo(userId)
// Returns: ServiceResponse<ReferralInfo>
```

### `getNextActionRecommendation(userId: string)`
**Purpose**: Get AI-powered next action recommendation

```typescript
const result = await ProfileService.getNextActionRecommendation(userId)
// Returns: ServiceResponse<NextActionRecommendation>
```

---

## ChatService

### `getConversations(userId: string)`
**Purpose**: Get user's conversation history

```typescript
const conversations = await ChatService.getConversations(userId)
// Returns: Conversation[]
```

### `createConversation(userId: string, title?: string)`
**Purpose**: Create new conversation

```typescript
const conversation = await ChatService.createConversation(userId, "Nova Conversa")
// Returns: Conversation
```

### `getMessages(conversationId: string)`
**Purpose**: Get conversation messages

```typescript
const messages = await ChatService.getMessages(conversationId)
// Returns: Message[]
```

### `sendMessage(conversationId: string, content: string, role: string)`
**Purpose**: Send message to conversation

```typescript
const message = await ChatService.sendMessage(
  conversationId, 
  "Olá, como você pode me ajudar?", 
  "user"
)
// Returns: Message
```

---

## ToolsService

### `getTools(category?: string, isPremium?: boolean)`
**Purpose**: Get available AI tools

```typescript
const tools = await ToolsService.getTools("Marketing", false)
// Returns: Tool[]
```

### `getUserTools(userId: string)`
**Purpose**: Get user's tool preferences

```typescript
const userTools = await ToolsService.getUserTools(userId)
// Returns: UserTool[]
```

### `addToFavorites(userId: string, toolId: string)`
**Purpose**: Add tool to user favorites

```typescript
const result = await ToolsService.addToFavorites(userId, toolId)
// Returns: boolean
```

### `updateToolUsage(userId: string, toolId: string)`
**Purpose**: Track tool usage

```typescript
await ToolsService.updateToolUsage(userId, toolId)
// Returns: void
```

---

## TracksService

### `getTracks(category?: string, isPremium?: boolean)`
**Purpose**: Get available learning tracks

```typescript
const tracks = await TracksService.getTracks("IA & Negócios", false)
// Returns: Track[]
```

### `getTrackDetails(trackId: string)`
**Purpose**: Get detailed track information

```typescript
const track = await TracksService.getTrackDetails(trackId)
// Returns: Track with modules
```

### `getUserTracks(userId: string)`
**Purpose**: Get user's track progress

```typescript
const userTracks = await TracksService.getUserTracks(userId)
// Returns: UserTrack[]
```

### `startTrack(userId: string, trackId: string)`
**Purpose**: Start a new track

```typescript
const result = await TracksService.startTrack(userId, trackId)
// Returns: UserTrack
```

### `completeModule(userId: string, trackId: string, moduleId: string)`
**Purpose**: Mark module as completed

```typescript
const result = await TracksService.completeModule(userId, trackId, moduleId)
// Returns: boolean
```

---

## SubscriptionService

### `getUserSubscription(userId: string)`
**Purpose**: Get user's subscription status

```typescript
const subscription = await SubscriptionService.getUserSubscription(userId)
// Returns: Subscription | null
```

### `createCheckoutSession(userId: string, priceId: string)`
**Purpose**: Create Stripe checkout session

```typescript
const session = await SubscriptionService.createCheckoutSession(userId, priceId)
// Returns: { sessionId: string }
```

### `cancelSubscription(subscriptionId: string)`
**Purpose**: Cancel user subscription

```typescript
const result = await SubscriptionService.cancelSubscription(subscriptionId)
// Returns: boolean
```

### `getPaymentHistory(userId: string)`
**Purpose**: Get user's payment history

```typescript
const payments = await SubscriptionService.getPaymentHistory(userId)
// Returns: Payment[]
```

---

## ReferralService

### `generateReferralCode(userId: string)`
**Purpose**: Generate unique referral code

```typescript
const code = await ReferralService.generateReferralCode(userId)
// Returns: string
```

### `processReferralSignup(referralCode: string, newUserId: string)`
**Purpose**: Process new user referral

```typescript
const result = await ReferralService.processReferralSignup(code, newUserId)
// Returns: boolean
```

### `getReferralTransactions(userId: string)`
**Purpose**: Get referral transaction history

```typescript
const transactions = await ReferralService.getReferralTransactions(userId)
// Returns: ReferralTransaction[]
```

### `confirmReferral(transactionId: string)`
**Purpose**: Confirm pending referral

```typescript
const result = await ReferralService.confirmReferral(transactionId)
// Returns: boolean
```

---

## Real-time Subscriptions

### Chat Messages
```typescript
const subscription = supabase
  .channel(`messages_${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new])
  })
  .subscribe()

// Cleanup
return () => supabase.removeChannel(subscription)
```

### Progress Updates
```typescript
const subscription = supabase
  .channel(`progress_${userId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'user_module_progress',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    updateProgressUI(payload.new)
  })
  .subscribe()
```

### Profile Changes
```typescript
const subscription = supabase
  .channel(`profile_${userId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `id=eq.${userId}`
  }, (payload) => {
    updateProfileUI(payload.new)
  })
  .subscribe()
```

---

## Error Handling

### ServiceResponse Type
```typescript
interface ServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Types
- **Authentication Error**: User not logged in
- **Authorization Error**: User lacks permission
- **Validation Error**: Invalid input data
- **Network Error**: Connection issues
- **Database Error**: Supabase operation failed

### Error Handling Pattern
```typescript
const handleServiceCall = async () => {
  try {
    const result = await ProfileService.getUserProfile(userId)
    
    if (result.success && result.data) {
      setProfile(result.data)
    } else {
      setError(result.error || 'Unknown error')
    }
  } catch (error) {
    setError('Network or unexpected error')
    console.error('Service call failed:', error)
  }
}
```

---

## Performance Best Practices

### Query Optimization
1. **Select only needed columns**:
   ```typescript
   .select('id, display_name, avatar_url')
   ```

2. **Use proper filtering**:
   ```typescript
   .eq('user_id', userId)
   .eq('is_active', true)
   ```

3. **Implement pagination**:
   ```typescript
   .range(0, 9) // First 10 results
   .order('created_at', { ascending: false })
   ```

### Caching Strategy
```typescript
// Cache user profile for 5 minutes
const cachedProfile = useMemo(() => profile, [profile?.updated_at])

// Invalidate cache on updates
useEffect(() => {
  if (profileUpdated) {
    refetchProfile()
  }
}, [profileUpdated])
```

### Connection Management
```typescript
// Lazy Supabase client initialization
const getClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key)
  }
  return supabaseInstance
}
```

---

## Testing

### Mock Service Responses
```typescript
// Mock successful response
const mockSuccess = <T>(data: T): ServiceResponse<T> => ({
  success: true,
  data
})

// Mock error response
const mockError = (error: string): ServiceResponse => ({
  success: false,
  error
})
```

### Integration Testing
```typescript
describe('ProfileService', () => {
  it('should fetch user profile', async () => {
    const result = await ProfileService.getUserProfile(testUserId)
    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('display_name')
  })
})
```