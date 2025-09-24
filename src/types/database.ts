// Minimal Supabase Database types used for typing the JS client
// Derived from context/Supabase/schema/*.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          full_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          is_premium: boolean
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['conversations']['Row']>
        Update: Partial<Database['public']['Tables']['conversations']['Row']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          tokens_used: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['messages']['Row']>
        Update: Partial<Database['public']['Tables']['messages']['Row']>
      }
      tools: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          icon: string | null
          content: string | null
          is_active: boolean
          is_premium: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['tools']['Row']>
        Update: Partial<Database['public']['Tables']['tools']['Row']>
      }
      user_tools: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          is_favorite: boolean
          last_used: string | null
          usage_count: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['user_tools']['Row']>
        Update: Partial<Database['public']['Tables']['user_tools']['Row']>
      }
      tracks: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          category: string | null
          difficulty_level: 'Iniciante' | 'Intermediário' | 'Avançado' | null
          estimated_duration: string | null
          thumbnail_url: string | null
          is_premium: boolean
          total_modules: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['tracks']['Row']>
        Update: Partial<Database['public']['Tables']['tracks']['Row']>
      }
      track_modules: {
        Row: {
          id: string
          track_id: string
          title: string
          content: Json
          order_index: number
          video_url: string | null
          tools: Json
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['track_modules']['Row']>
        Update: Partial<Database['public']['Tables']['track_modules']['Row']>
      }
      user_tracks: {
        Row: {
          id: string
          user_id: string
          track_id: string
          progress_percentage: number
          current_module_id: string | null
          started_at: string | null
          completed_at: string | null
          is_favorite: boolean
          last_accessed: string
        }
        Insert: Partial<Database['public']['Tables']['user_tracks']['Row']>
        Update: Partial<Database['public']['Tables']['user_tracks']['Row']>
      }
      user_module_progress: {
        Row: {
          id: string
          user_id: string
          track_id: string
          module_id: string
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['user_module_progress']['Row']>
        Update: Partial<Database['public']['Tables']['user_module_progress']['Row']>
      }
      track_reviews: {
        Row: {
          id: string
          user_id: string
          track_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['track_reviews']['Row']>
        Update: Partial<Database['public']['Tables']['track_reviews']['Row']>
      }
    }
  }
}
