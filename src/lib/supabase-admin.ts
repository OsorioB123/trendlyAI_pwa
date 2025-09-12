import { createClient } from '@supabase/supabase-js'

let supabaseAdminInstance: ReturnType<typeof createClient> | null = null

// Admin client with service role key for server-side operations
export const getSupabaseAdmin = () => {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration for admin client')
  }
  
  supabaseAdminInstance = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return supabaseAdminInstance
}

// For backward compatibility - lazy initialization
let _supabaseAdmin: ReturnType<typeof createClient> | null = null
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = getSupabaseAdmin()
    }
    return (_supabaseAdmin as any)[prop]
  }
})