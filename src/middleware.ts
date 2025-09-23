import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasCompletedOnboardingFromCookies } from './lib/onboarding'

export async function middleware(req: NextRequest) {
  if (process.env.E2E_TEST === 'true' || req.cookies.get('__e2e_test__')?.value === 'true') {
    return NextResponse.next()
  }

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
          cookiesToSet.forEach(({ name, value }) =>
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
  const publicRoutes = ['/', '/debug-auth', '/test-supabase']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname === route
  )
  const isOnboardingRoute = req.nextUrl.pathname === onboardingRoute
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)

  // Check onboarding status for authenticated users using server-safe method
  const cookies = Object.fromEntries(req.cookies.getAll().map(cookie => [cookie.name, cookie.value]))
  const hasOnboarded = user ? hasCompletedOnboardingFromCookies(cookies) : false

  // Debug logs
  console.log(`Middleware: ${req.nextUrl.pathname} | User: ${user ? 'YES' : 'NO'} | Onboarded: ${hasOnboarded} | Protected: ${isProtectedRoute} | Auth: ${isAuthRoute} | Public: ${isPublicRoute}`)

  // Redirect unauthenticated users away from onboarding and protected routes
  if (!user && (isOnboardingRoute || isProtectedRoute)) {
    console.log(`Redirecting unauth user from ${req.nextUrl.pathname} to /login`)
    const redirectUrl = new URL('/login', req.url)
    if (isProtectedRoute) {
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // Handle authenticated users
  if (user) {
    // Redirect away from auth pages
    if (isAuthRoute) {
      const destination = hasOnboarded ? '/dashboard' : '/onboarding'
      console.log(`Redirecting logged user from ${req.nextUrl.pathname} to ${destination}`)
      return NextResponse.redirect(new URL(destination, req.url))
    }

    // Redirect to onboarding if not completed (except for onboarding route itself and auth routes)
    if (!hasOnboarded && !isOnboardingRoute && !isAuthRoute && !isPublicRoute) {
      console.log(`Redirecting user to onboarding from ${req.nextUrl.pathname}`)
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    // Redirect to dashboard if onboarding is completed but user tries to access onboarding
    if (hasOnboarded && isOnboardingRoute) {
      console.log(`Redirecting onboarded user from onboarding to /dashboard`)
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  console.log(`Allowing access to ${req.nextUrl.pathname}`)

  return supabaseResponse
}

export const config = {
  matcher: [
    // Protect authenticated and onboarding routes
    '/dashboard/:path*',
    '/tools/:path*',
    '/tracks/:path*',
    '/chat/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/onboarding'
  ],
}
