'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { SettingsService } from '../lib/services/settingsService'
import {
  UserProfile,
  ProfileFormData,
  SecuritySettings,
  ChangeEmailRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  NotificationPreferences,
  SettingsTab,
  SecurityModal,
  SettingsUIState,
  ToastNotification,
  AvatarUploadResult,
  Verify2FASetup,
  UseSettingsReturn
} from '../types/settings'

let toastCounter = 0

export function useSettings(): UseSettingsReturn {
  const router = useRouter()
  
  // Data state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [security, setSecurity] = useState<SecuritySettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationPreferences | null>(null)
  const [user, setUser] = useState<any>(null)
  
  // UI state
  const [uiState, setUiState] = useState<SettingsUIState>({
    activeTab: 'profile',
    activeModal: null,
    isLoading: true,
    isSaving: {},
    editingField: null
  })
  
  const [error, setError] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  // Initialize user and data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setUiState(prev => ({ ...prev, isLoading: true }))
        setError(null)
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          router.push('/auth/login')
          return
        }
        
        setUser(session.user)
        
        // Load all settings data in parallel
        const [profileData, securityData, notificationData] = await Promise.all([
          SettingsService.getUserProfile(session.user.id),
          SettingsService.getSecuritySettings(session.user.id),
          SettingsService.getNotificationPreferences(session.user.id)
        ])
        
        setProfile(profileData)
        setSecurity(securityData)
        setNotifications(notificationData)
        
      } catch (error) {
        console.error('Error initializing settings:', error)
        setError('Erro ao carregar configurações')
      } finally {
        setUiState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        initializeData()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Profile actions
  const updateProfile = useCallback(async (data: Partial<ProfileFormData>): Promise<boolean> => {
    if (!user) return false
    
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, profile: true }
      }))
      
      const response = await SettingsService.updateProfile(user.id, data)
      
      if (response.success && response.data) {
        setProfile(response.data)
        showToast({
          type: 'success',
          message: response.message || 'Perfil atualizado com sucesso'
        })
        return true
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao atualizar perfil'
        })
        return false
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao atualizar perfil'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, profile: false }
      }))
    }
  }, [user])

  const uploadAvatar = useCallback(async (file: File): Promise<AvatarUploadResult> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' }
    
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, avatar: true }
      }))
      
      const result = await SettingsService.uploadAvatar(user.id, file)
      
      if (result.success && result.url) {
        setProfile(prev => prev ? { ...prev, avatar_url: result.url } : null)
        showToast({
          type: 'success',
          message: 'Foto de perfil atualizada com sucesso'
        })
      } else {
        showToast({
          type: 'error',
          message: result.error || 'Erro ao fazer upload da foto'
        })
      }
      
      return result
    } catch (error) {
      console.error('Error uploading avatar:', error)
      const errorResult = { success: false, error: 'Erro inesperado ao fazer upload' }
      showToast({
        type: 'error',
        message: errorResult.error
      })
      return errorResult
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, avatar: false }
      }))
    }
  }, [user])

  const updateStudioTheme = useCallback(async (themeId: string): Promise<boolean> => {
    if (!user) return false
    
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, theme: true }
      }))
      
      const response = await SettingsService.updateStudioTheme(user.id, themeId)
      
      if (response.success) {
        setProfile(prev => prev ? { ...prev, studio_theme: themeId } : null)
        showToast({
          type: 'success',
          message: response.message || 'Tema atualizado com sucesso'
        })
        return true
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao atualizar tema'
        })
        return false
      }
    } catch (error) {
      console.error('Error updating studio theme:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao atualizar tema'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, theme: false }
      }))
    }
  }, [user])

  // Security actions
  const changeEmail = useCallback(async (data: ChangeEmailRequest): Promise<boolean> => {
    if (!user) return false
    
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, email: true }
      }))
      
      const response = await SettingsService.changeEmail(data)
      
      if (response.success) {
        setSecurity(prev => prev ? { ...prev, email: data.new_email } : null)
        showToast({
          type: 'info',
          message: response.message || 'Verifique seu email para confirmar a alteração'
        })
        return true
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao alterar email'
        })
        return false
      }
    } catch (error) {
      console.error('Error changing email:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao alterar email'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, email: false }
      }))
    }
  }, [user])

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, password: true }
      }))
      
      const response = await SettingsService.changePassword(data)
      
      if (response.success) {
        setSecurity(prev => prev ? { ...prev, last_password_change: new Date() } : null)
        showToast({
          type: 'success',
          message: response.message || 'Senha alterada com sucesso'
        })
        return true
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao alterar senha'
        })
        return false
      }
    } catch (error) {
      console.error('Error changing password:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao alterar senha'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, password: false }
      }))
    }
  }, [])

  const setup2FA = useCallback(async (password: string): Promise<Verify2FASetup | false> => {
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, twoFactor: true }
      }))
      
      const response = await SettingsService.setup2FA(password)
      
      if (response.success && response.data) {
        setSecurity(prev => prev ? { ...prev, two_factor_enabled: true } : null)
        showToast({
          type: 'success',
          message: response.message || '2FA configurado com sucesso'
        })
        return response.data
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao configurar 2FA'
        })
        return false
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao configurar 2FA'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, twoFactor: false }
      }))
    }
  }, [])

  const deleteAccount = useCallback(async (data: DeleteAccountRequest): Promise<boolean> => {
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, deleteAccount: true }
      }))
      
      const response = await SettingsService.deleteAccount(data)
      
      if (response.success) {
        showToast({
          type: 'warning',
          message: response.message || 'Conta será excluída em 24 horas'
        })
        // Optionally redirect to a confirmation page
        setTimeout(() => {
          router.push('/account-deletion-scheduled')
        }, 3000)
        return true
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao excluir conta'
        })
        return false
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao excluir conta'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, deleteAccount: false }
      }))
    }
  }, [router])

  // Notification actions
  const updateNotifications = useCallback(async (prefs: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!user) return false
    
    try {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, notifications: true }
      }))
      
      const response = await SettingsService.updateNotificationPreferences(user.id, prefs)
      
      if (response.success && response.data) {
        setNotifications(response.data)
        showToast({
          type: 'success',
          message: response.message || 'Preferências atualizadas'
        })
        return true
      } else {
        showToast({
          type: 'error',
          message: response.error || 'Erro ao atualizar preferências'
        })
        return false
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      showToast({
        type: 'error',
        message: 'Erro inesperado ao atualizar preferências'
      })
      return false
    } finally {
      setUiState(prev => ({
        ...prev,
        isSaving: { ...prev.isSaving, notifications: false }
      }))
    }
  }, [user])

  // UI actions
  const setActiveTab = useCallback((tab: SettingsTab) => {
    setUiState(prev => ({ ...prev, activeTab: tab }))
  }, [])

  const setActiveModal = useCallback((modal: SecurityModal) => {
    setUiState(prev => ({ ...prev, activeModal: modal }))
  }, [])

  const setEditingField = useCallback((field: string | null) => {
    setUiState(prev => ({ ...prev, editingField: field }))
  }, [])

  const showToast = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const toast: ToastNotification = {
      id: `toast-${++toastCounter}`,
      duration: 5000,
      ...notification
    }
    
    setToasts(prev => [...prev, toast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id))
    }, toast.duration)
  }, [])

  const isLoading = uiState.isLoading

  return {
    profile,
    security,
    notifications,
    uiState,
    isLoading,
    error,
    
    // Profile actions
    updateProfile,
    uploadAvatar,
    updateStudioTheme,
    
    // Security actions
    changeEmail,
    changePassword,
    setup2FA,
    deleteAccount,
    
    // Notification actions
    updateNotifications,
    
    // UI actions
    setActiveTab,
    setActiveModal,
    setEditingField,
    showToast
  }
}