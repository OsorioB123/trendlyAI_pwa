/**
 * Onboarding utility functions
 * Manages user onboarding status and flow
 */

// Unified key across app, middleware and auth flows
export const ONBOARDING_STORAGE_KEY = 'trendlyai-onboarding-completed'

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return false
  }
}

/**
 * Mark onboarding as complete
 */
export function markOnboardingComplete(): void {
  if (typeof window === 'undefined') return
  
  try {
    // Persist in localStorage for client logic
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    // Also set a cookie so middleware/SSR can read it
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    document.cookie = `${ONBOARDING_STORAGE_KEY}=true; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax${isSecure ? '; Secure' : ''}`
  } catch (error) {
    console.error('Error marking onboarding complete:', error)
  }
}

/**
 * Clear onboarding status (useful for logout or reset)
 */
export function clearOnboardingStatus(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    // Clear cookie by setting Max-Age=0
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    document.cookie = `${ONBOARDING_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax${isSecure ? '; Secure' : ''}`
  } catch (error) {
    console.error('Error clearing onboarding status:', error)
  }
}

/**
 * Determine if onboarding should be shown
 * Takes into account user profile and completion status
 */
export function shouldShowOnboarding(userProfile?: any): boolean {
  // If user hasn't completed onboarding, show it
  if (!hasCompletedOnboarding()) {
    return true
  }
  
  // If user profile is missing key information, show onboarding
  if (userProfile && (!userProfile.display_name || !userProfile.onboarding_completed)) {
    return true
  }
  
  return false
}

/**
 * Reset onboarding for testing purposes
 */
export function resetOnboarding(): void {
  clearOnboardingStatus()
}

/**
 * Check onboarding status from cookies (for middleware)
 * This is used in server-side middleware where localStorage is not available
 */
export function hasCompletedOnboardingFromCookies(cookies?: any): boolean {
  if (!cookies) return false

  try {
    // Support both NextRequest cookie store and plain object maps
    if (typeof cookies.get === 'function') {
      return cookies.get(ONBOARDING_STORAGE_KEY)?.value === 'true'
    }
    if (typeof cookies === 'object') {
      return cookies[ONBOARDING_STORAGE_KEY] === 'true'
    }
    return false
  } catch (error) {
    console.error('Error checking onboarding status from cookies:', error)
    return false
  }
}
