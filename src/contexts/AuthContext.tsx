'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { hasCompletedOnboarding, markOnboardingComplete, clearOnboardingStatus, shouldShowOnboarding } from '../lib/onboarding'

interface Profile {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio?: string
  level: string
  streak_days: number
  total_tracks: number
  completed_modules: number
  credits: number
  max_credits?: number
  preferences?: any
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ data: any; error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: any; error: any }>
  updateAvatar: (avatarUrl: string) => Promise<{ data: any; error: any }>
  refreshProfile: () => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ data: any; error: any }>
  // Onboarding-related methods
  completeOnboarding: () => void
  checkOnboardingStatus: () => boolean
  needsOnboarding: boolean
  // Helper methods
  isAuthenticated: boolean
  hasProfile: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Load user profile if authenticated
        if (session?.user) {
          await loadUserProfile(session.user.id)
          // Check onboarding status
          const shouldOnboard = shouldShowOnboarding(true)
          setNeedsOnboarding(shouldOnboard)
          console.log('Initial onboarding check:', shouldOnboard)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        })
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          console.log('👤 User session found, loading profile...')
          try {
            // Load or create user profile with timeout
            const profilePromise = loadUserProfile(session.user.id)
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile loading timeout')), 5000)
            )
            
            await Promise.race([profilePromise, timeoutPromise])
            console.log('✅ Profile loading completed successfully')
            
            // Handle profile creation on signup and onboarding checks
            if (event === 'SIGNED_IN' && session?.user) {
              console.log('📝 Checking/creating profile for signed in user...')
              try {
                await loadUserProfile(session.user.id)
              } catch (error) {
                // If profile doesn't exist, create it
                console.log('Creating profile for user without one')
                await createUserProfile(session.user)
              }
              
              // Check onboarding status after profile is loaded/created
              const shouldOnboard = shouldShowOnboarding(true)
              setNeedsOnboarding(shouldOnboard)
              console.log('Sign-in onboarding check:', shouldOnboard)
            }
          } catch (error) {
            console.error('❌ Profile loading failed or timed out:', error)
            // Continue with auth flow even if profile loading fails
          }
        } else {
          console.log('🚫 No user session, clearing profile and onboarding status')
          setProfile(null)
          setNeedsOnboarding(false)
        }
        
        // Always ensure loading is set to false after auth state change
        console.log('✅ Auth state change complete - setting loading to false')
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, this is handled by the trigger
          console.log('Profile not found, will be created by trigger')
          // Set a default profile while waiting for trigger to create it
          setProfile({
            id: userId,
            email: '',
            display_name: 'Usuário',
            level: 'Iniciante',
            credits: 0,
            streak_days: 0,
            total_tracks: 0,
            completed_modules: 0
          })
        } else {
          console.error('Error loading profile:', error)
          throw error // Re-throw to be caught by timeout mechanism
        }
        return
      }

      console.log('Profile loaded successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
      throw error // Re-throw to be caught by timeout mechanism
    }
  }

  const createUserProfile = async (user: User) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email || '',
        display_name: user.user_metadata?.display_name || 
                     user.email?.split('@')[0] || 
                     'Usuário',
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return
      }

      setProfile(data)
      console.log('Profile created successfully:', data)
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Starting signIn process for:', email)
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('🔍 SignIn response:', { 
        hasUser: !!data?.user, 
        userEmail: data?.user?.email,
        hasSession: !!data?.session,
        error: error?.message 
      })
      
      return { data, error }
    } catch (error) {
      console.error('❌ Sign in error:', error)
      return { data: null, error }
    } finally {
      console.log('✅ SignIn finally block - setting loading to false')
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any = {}) => {
    try {
      setLoading(true)
      console.log('🔄 Starting signup process for:', email)
      console.log('📝 User data received:', userData)
      
      // CORREÇÃO: Estruturar corretamente os dados para o Supabase
      const signUpOptions = {
        email,
        password,
        options: {
          data: userData // Os dados do usuário devem estar dentro de options.data
        }
      }
      
      console.log('📤 Sending signup request with options:', signUpOptions)
      
      const { data, error } = await supabase.auth.signUp(signUpOptions)
      
      if (error) {
        console.error('❌ Signup error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        })
      } else {
        console.log('✅ Signup successful:', data)
        console.log('📊 Signup data details:', {
          hasUser: !!data.user,
          userEmail: data.user?.email,
          hasSession: !!data.session,
          needsConfirmation: data.user && !data.session,
          userMetadata: data.user?.user_metadata
        })
        
        if (data.user && !data.session) {
          console.log('📧 User created but needs email confirmation')
        } else if (data.session) {
          console.log('🎉 User created and automatically signed in')
        }
      }
      
      return { data, error }
    } catch (error) {
      console.error('❌ Signup exception:', error)
      return { data: null, error }
    } finally {
      console.log('✅ SignUp process complete - setting loading to false')
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (!error) {
        setUser(null)
        setSession(null)
        setProfile(null)
        setNeedsOnboarding(false)
        
        // Clear any local storage data including onboarding status
        clearOnboardingStatus()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('trendlyai-user-authenticated')
        }
      }
      
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      return { data, error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { data: null, error }
      }

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error in updateProfile:', error)
      return { data: null, error }
    }
  }

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating avatar:', error)
        return { data: null, error }
      }

      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error in updateAvatar:', error)
      return { data: null, error }
    }
  }

  const refreshProfile = async () => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      await loadUserProfile(user.id)
      return { error: null }
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      })
      
      return { data, error }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { data: null, error }
    }
  }

  // Onboarding-related methods
  const completeOnboarding = () => {
    markOnboardingComplete()
    setNeedsOnboarding(false)
    console.log('Onboarding marked as complete')
  }

  const checkOnboardingStatus = () => {
    return hasCompletedOnboarding()
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updateAvatar,
    refreshProfile,
    signInWithGoogle,
    // Onboarding-related methods
    completeOnboarding,
    checkOnboardingStatus,
    needsOnboarding,
    // Helper methods
    isAuthenticated: !!user,
    hasProfile: !!profile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext