/**
 * Onboarding utility functions
 */

export const ONBOARDING_STORAGE_KEY = 'trendlyai-onboarding-completed'

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
}

/**
 * Server-safe version to check onboarding status from cookies/headers
 * Used by middleware where localStorage is not available
 */
export function hasCompletedOnboardingFromCookies(cookies?: { [key: string]: string }): boolean {
  if (!cookies) return false
  return cookies[ONBOARDING_STORAGE_KEY] === 'true'
}

/**
 * Mark onboarding as completed
 */
export function markOnboardingComplete(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    // Also set a cookie for server-side consistency
    document.cookie = `${ONBOARDING_STORAGE_KEY}=true; path=/; max-age=31536000; SameSite=Lax`
  }
}

/**
 * Clear onboarding completion status
 */
export function clearOnboardingStatus(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    // Also clear the cookie
    document.cookie = `${ONBOARDING_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

/**
 * Get redirect path after onboarding completion
 */
export function getOnboardingRedirectPath(): string {
  // Check if there's a redirect URL in query params or session storage
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const redirect = urlParams.get('redirect')
    if (redirect) {
      return decodeURIComponent(redirect)
    }
    
    const sessionRedirect = sessionStorage.getItem('trendlyai-auth-redirect')
    if (sessionRedirect) {
      sessionStorage.removeItem('trendlyai-auth-redirect')
      return sessionRedirect
    }
  }
  
  return '/dashboard'
}

/**
 * Check if user should see onboarding
 * Returns true if user is authenticated but hasn't completed onboarding
 */
export function shouldShowOnboarding(isAuthenticated: boolean): boolean {
  if (!isAuthenticated) return false
  return !hasCompletedOnboarding()
}

/**
 * Handle onboarding completion with proper cleanup
 */
export async function completeOnboarding(): Promise<string> {
  markOnboardingComplete()
  return getOnboardingRedirectPath()
}