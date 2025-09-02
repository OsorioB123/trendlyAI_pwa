import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Database type definitions for better TypeScript support (if needed later)
export const DATABASE_TABLES = {
  PROFILES: 'profiles',
  CONVERSATIONS: 'conversations',
  CONVERSATION_PARTICIPANTS: 'conversation_participants', 
  MESSAGES: 'messages',
  TRACKS: 'tracks',
  TOOLS: 'tools',
  USER_TRACKS: 'user_tracks',
  USER_TOOLS: 'user_tools'
}

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  ATTACHMENTS: 'attachments',
  CONTENT: 'content'
}

export default supabase