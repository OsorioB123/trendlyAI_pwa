// =====================================================
// CUSTOM HOOK FOR PROFILE MANAGEMENT
// Complete state management for TrendlyAI user profiles
// =====================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProfileService from '../lib/services/profileService'
import type { 
  UseProfileReturn,
  UserProfile,
  ProfileMetrics,
  ArsenalData,
  ReferralInfo,
  NextActionRecommendation,
  ServiceResponse,
  ProfileUpdateData,
  ProfileFormData
} from '../types/profile'

/**
 * Custom hook for managing profile state and operations
 */
export function useProfile(): UseProfileReturn {
  const { user, profile: authProfile, updateProfile: updateAuthProfile, updateAvatar: updateAuthAvatar } = useAuth()
  
  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [metrics, setMetrics] = useState<ProfileMetrics | null>(null)
  const [arsenalData, setArsenalData] = useState<ArsenalData | null>(null)
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null)
  const [nextAction, setNextAction] = useState<NextActionRecommendation | null>(null)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  
  // Form state for inline editing
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Load all profile data
   */
  const loadProfileData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Load profile data from auth context first (it may already be available)
      if (authProfile) {
        setProfile(authProfile as unknown as UserProfile)
          setFormData({
            display_name: authProfile.display_name || '',
            bio: authProfile.bio || '',
            level: (authProfile.level || 'Explorador') as any
          })
      } else {
        // Fallback to service if auth context doesn't have profile
        const profileResponse = await ProfileService.getUserProfile(user.id)
        if (profileResponse.success && profileResponse.data) {
          setProfile(profileResponse.data as UserProfile)
          setFormData({
            display_name: profileResponse.data.display_name || '',
            bio: profileResponse.data.bio || '',
            level: (profileResponse.data.level || 'Explorador') as any
          })
        }
      }

      // Load additional profile data in parallel
      const [metricsResponse, arsenalResponse, referralResponse, nextActionResponse] = await Promise.all([
        ProfileService.getProfileMetrics(user.id),
        ProfileService.getArsenalData(user.id),
        ProfileService.getReferralInfo(user.id),
        ProfileService.getNextActionRecommendation(user.id)
      ])

      // Set metrics
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data)
      }

      // Set arsenal data
      if (arsenalResponse.success && arsenalResponse.data) {
        setArsenalData(arsenalResponse.data)
      }

      // Set referral info
      if (referralResponse.success && referralResponse.data) {
        setReferralInfo(referralResponse.data)
      }

      // Set next action
      if (nextActionResponse.success && nextActionResponse.data) {
        setNextAction(nextActionResponse.data)
      }

    } catch (error) {
      console.error('Error loading profile data:', error)
      setError('Erro ao carregar dados do perfil')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, authProfile])

  /**
   * Refresh all profile data
   */
  const refetch = useCallback(async () => {
    await loadProfileData()
  }, [loadProfileData])

  // Load data on mount and user change
  useEffect(() => {
    loadProfileData()
  }, [loadProfileData])

  // Update local profile when auth profile changes
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile as unknown as UserProfile)
      setFormData({
        display_name: authProfile.display_name || '',
        bio: authProfile.bio || '',
        level: (authProfile.level || 'Explorador') as any
      })
    }
  }, [authProfile])

  // =====================================================
  // PROFILE OPERATIONS
  // =====================================================

  /**
   * Update profile data
   */
  const updateProfile = useCallback(async (updates: ProfileUpdateData): Promise<boolean> => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return false
    }

    try {
      setError(null)
      
      // Use auth context method first (it may have better integration)
      if (updateAuthProfile) {
        const result = await updateAuthProfile(updates)
        if (result) {
          return true
        }
      }
      
      // Fallback to service
      const response = await ProfileService.updateProfile(user.id, updates)
      
      if (response.success && response.data) {
        setProfile(response.data)
        // Update form data to reflect the changes
        setFormData(prev => ({ ...prev, ...updates }))
        return true
      } else {
        setError(response.error || 'Erro ao atualizar perfil')
        return false
      }

    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Erro inesperado ao atualizar perfil')
      return false
    }
  }, [user?.id, updateAuthProfile])

  /**
   * Upload avatar
   */
  const uploadAvatar = useCallback(async (file: File): Promise<boolean> => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return false
    }

    try {
      setIsUploading(true)
      setError(null)

      // Upload via service (simple path)
      const response = await ProfileService.uploadAvatar(user.id, file)
      
      if (response.success && response.data) {
        // Update profile with new avatar URL
        setProfile(prev => prev ? { ...prev, avatar_url: response.data } : null)
        return true
      } else {
        setError(response.error || 'Erro ao fazer upload do avatar')
        return false
      }

    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError('Erro inesperado no upload do avatar')
      return false
    } finally {
      setIsUploading(false)
    }
  }, [user?.id, updateAuthAvatar])

  /**
   * Save specific field with optimistic updates
   */
  const saveField = useCallback(async (field: string, value: string): Promise<boolean> => {
    if (!profile) return false

    try {
      setIsSaving(true)
      setError(null)

      // Optimistic update
      const previousValue = formData[field as keyof typeof formData]
      setFormData(prev => ({ ...prev, [field]: value }))

      // Update profile
      const updates = { [field]: value } as ProfileUpdateData
      const success = await updateProfile(updates)

      if (success) {
        setEditingField(null)
        return true
      } else {
        // Revert optimistic update
        setFormData(prev => ({ ...prev, [field]: previousValue }))
        return false
      }

    } catch (error) {
      console.error(`Error saving field ${field}:`, error)
      setError('Erro ao salvar alterações')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [profile, formData, updateProfile])

  /**
   * Cancel edit and revert changes
   */
  const cancelEdit = useCallback(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        level: (profile.level || 'Explorador') as any
      })
    }
    setEditingField(null)
  }, [profile])

  // =====================================================
  // ARSENAL OPERATIONS
  // =====================================================

  /**
   * Refresh arsenal data
   */
  const refreshArsenal = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false

    try {
      const response = await ProfileService.getArsenalData(user.id)
      
      if (response.success && response.data) {
        setArsenalData(response.data)
        return true
      } else {
        setError(response.error || 'Erro ao carregar arsenal')
        return false
      }

    } catch (error) {
      console.error('Error refreshing arsenal:', error)
      setError('Erro inesperado ao carregar arsenal')
      return false
    }
  }, [user?.id])

  /**
   * Refresh metrics
   */
  const refreshMetrics = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false

    try {
      const response = await ProfileService.getProfileMetrics(user.id)
      
      if (response.success && response.data) {
        setMetrics(response.data)
        return true
      } else {
        setError(response.error || 'Erro ao carregar métricas')
        return false
      }

    } catch (error) {
      console.error('Error refreshing metrics:', error)
      setError('Erro inesperado ao carregar métricas')
      return false
    }
  }, [user?.id])

  /**
   * Refresh referral info
   */
  const refreshReferral = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false

    try {
      const response = await ProfileService.getReferralInfo(user.id)
      
      if (response.success && response.data) {
        setReferralInfo(response.data)
        return true
      } else {
        setError(response.error || 'Erro ao carregar informações de indicação')
        return false
      }

    } catch (error) {
      console.error('Error refreshing referral info:', error)
      setError('Erro inesperado ao carregar indicações')
      return false
    }
  }, [user?.id])

  // =====================================================
  // UI STATE ACTIONS
  // =====================================================

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Set editing field
   */
  const setEditingFieldHandler = useCallback((field: string | null) => {
    setEditingField(field)
    // Reset form data to current profile values when starting to edit
    if (field && profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        level: profile.level || 'Explorador'
      })
    }
  }, [profile])

  // =====================================================
  // COMPUTED VALUES
  // =====================================================

  /**
   * Check if profile data is available
   */
  const hasProfileData = Boolean(profile)

  /**
   * Check if profile is complete
   */
  const isProfileComplete = Boolean(
    profile?.display_name?.trim() &&
    profile?.bio?.trim() &&
    profile?.avatar_url
  )

  /**
   * Get profile completion percentage
   */
  const completionPercentage = (() => {
    if (!profile) return 0
    let score = 0
    if (profile.display_name?.trim()) score += 25
    if (profile.bio?.trim()) score += 25
    if (profile.avatar_url) score += 25
    if (profile.level !== 'Explorador') score += 25
    return score
  })()

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // Data
    profile,
    metrics,
    arsenalData,
    referralInfo,
    nextAction,
    
    // Loading states
    isLoading,
    isUploading,
    isSaving,
    
    // Error state
    error,
    
    // Form state
    editingField,
    formData,
    
    // Actions
    updateProfile,
    uploadAvatar,
    setEditingField: setEditingFieldHandler,
    saveField,
    cancelEdit,
    
    // Data refresh
    refetch,
    clearError,

    // Extended methods for convenience
    // Note: internal refresh helpers are not part of the public API to keep it simple

    // Computed values omitted from public API
  }
}

export default useProfile
