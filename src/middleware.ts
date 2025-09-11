import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: req,
  })
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error('Middleware auth error:', error)
    // Continue without user if auth fails
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/tools', '/tracks', '/chat', '/profile', '/settings']
  const authRoutes = ['/login', '/register', '/forgot-password']
  const onboardingRoute = '/onboarding'
  const publicRoutes = ['/', '/debug-auth', '/test-supabase', '/register']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname === route
  )
  const isOnboardingRoute = req.nextUrl.pathname === onboardingRoute
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // Debug logs
  console.log(`Middleware: ${req.nextUrl.pathname} | User: ${user ? 'YES' : 'NO'} | Protected: ${isProtectedRoute} | Auth: ${isAuthRoute} | Public: ${isPublicRoute}`)

  // Redirect authenticated users away from auth pages to dashboard (but allow public routes)
  if (user && isAuthRoute) {
    console.log(`Redirecting logged user from ${req.nextUrl.pathname} to /dashboard`)
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect unauthenticated users away from onboarding
  if (!user && isOnboardingRoute) {
    console.log(`Redirecting unauth user from onboarding to /login`)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect unauthenticated users to login for protected routes (but allow public routes)
  if (!user && isProtectedRoute && !isPublicRoute) {
    console.log(`Redirecting unauth user from ${req.nextUrl.pathname} to /login`)
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  console.log(`Allowing access to ${req.nextUrl.pathname}`)

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}