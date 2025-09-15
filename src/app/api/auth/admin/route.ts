import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side admin client with service role key
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Simple server-only authorization using a static admin token
function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization') || ''
  const token = header.toLowerCase().startsWith('bearer ')
    ? header.slice(7)
    : null

  const expected = process.env.ADMIN_API_TOKEN
  if (!expected) {
    // If no token is configured, deny in production by default
    // and allow in development only.
    return process.env.NODE_ENV !== 'production'
  }
  return token === expected
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { action, ...params } = await request.json()
    const supabaseAdmin = getSupabaseAdmin()

    switch (action) {
      case 'listUsers': {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers()
        
        return NextResponse.json({
          success: !error,
          error: error?.message,
          total_users: data?.users?.length || 0,
          users: data?.users?.map(u => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            confirmed_at: u.confirmed_at,
            last_sign_in_at: u.last_sign_in_at,
            user_metadata: u.user_metadata
          })) || []
        })
      }

      case 'getUserById': {
        const { userId } = params
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)
        
        return NextResponse.json({
          success: !error,
          error: error?.message,
          user_found: !!data?.user,
          user_data: data?.user
        })
      }

      case 'testConfig': {
        return NextResponse.json({
          service_key_available: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          service_key_prefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20),
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Admin API endpoint',
    available_actions: ['listUsers', 'getUserById', 'testConfig'],
    requires: 'Authorization: Bearer <ADMIN_API_TOKEN>'
  })
}
