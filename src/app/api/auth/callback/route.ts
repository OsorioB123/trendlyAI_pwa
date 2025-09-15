import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  const { event, session } = await request.json()

  let response = NextResponse.json({ success: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // No incoming cookies needed for setting
          return []
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    if (event === 'SIGNED_OUT') {
      await supabase.auth.signOut()
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      // Ensure server sets the auth cookies for SSR/middleware
      if (session?.access_token && session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })
      }
    }
  } catch (e) {
    // Don't fail hard; return success=false to aid debugging
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 200 })
  }

  return response
}

