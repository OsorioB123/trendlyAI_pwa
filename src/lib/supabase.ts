import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Got: ${supabaseUrl}`)
  }

  if (!supabaseAnonKey) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Got: ${supabaseAnonKey}`)
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return supabaseInstance
}

// For backward compatibility - lazy initialization
let _supabase: ReturnType<typeof createClient> | null = null
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabase) {
      _supabase = getSupabase()
    }
    return (_supabase as any)[prop]
  }
})

// Database type definitions for better TypeScript support
export const DATABASE_TABLES = {
  PROFILES: 'profiles',
  CONVERSATIONS: 'conversations',
  CONVERSATION_PARTICIPANTS: 'conversation_participants', 
  MESSAGES: 'messages',
  TRACKS: 'tracks',
  TOOLS: 'tools',
  USER_TRACKS: 'user_tracks',
  USER_TOOLS: 'user_tools'
} as const

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  ATTACHMENTS: 'attachments',
  CONTENT: 'content'
} as const

export default supabase