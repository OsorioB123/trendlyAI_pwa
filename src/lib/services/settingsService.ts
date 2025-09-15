import { supabase, STORAGE_BUCKETS } from '../supabase'
import type { Database } from '@/types/database'
import {
  UserProfile,
  ProfileFormData,
  SecuritySettings,
  ChangeEmailRequest,
  ChangePasswordRequest,
  Setup2FARequest,
  Verify2FASetup,
  DeleteAccountRequest,
  NotificationPreferences,
  SettingsResponse,
  ValidationResult,
  PasswordValidation,
  AvatarUploadResult,
  VALIDATION_RULES,
  DEFAULT_NOTIFICATION_PREFERENCES,
  STUDIO_THEMES
} from '../../types/settings'

export class SettingsService {
  
  // Profile operations
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      if (!data) return null

      const row = data as Database['public']['Tables']['profiles']['Row']
      return {
        id: row.id,
        full_name: row.full_name || '',
        username: row.username || `user${row.id.slice(0, 8)}`,
        bio: row.bio || '',
        avatar_url: row.avatar_url || undefined,
        studio_theme: (row.preferences as any)?.studio_theme || 'default',
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  static async updateProfile(
    userId: string, 
    profileData: Partial<ProfileFormData>
  ): Promise<SettingsResponse<UserProfile>> {
    try {
      const updates: any = {}
      
      if (profileData.full_name !== undefined) {
        const nameValidation = this.validateName(profileData.full_name)
        if (!nameValidation.isValid) {
          return {
            success: false,
            error: Object.values(nameValidation.errors)[0]
          }
        }
        updates.full_name = profileData.full_name.trim()
      }

      if (profileData.username !== undefined) {
        let username = profileData.username.trim()
        if (!username.startsWith('@')) {
          username = '@' + username.replace(/@/g, '')
        }
        
        const usernameValidation = this.validateUsername(username)
        if (!usernameValidation.isValid) {
          return {
            success: false,
            error: Object.values(usernameValidation.errors)[0]
          }
        }

        const existingUser = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .neq('id', userId)
          .single()

        if (existingUser.data) {
          return {
            success: false,
            error: 'Este nome de usuário já está em uso'
          }
        }

        updates.username = username
      }

      if (profileData.bio !== undefined) {
        const bioValidation = this.validateBio(profileData.bio)
        if (!bioValidation.isValid) {
          return {
            success: false,
            error: Object.values(bioValidation.errors)[0]
          }
        }
        updates.bio = profileData.bio.trim()
      }

      if (Object.keys(updates).length === 0) {
        return { success: false, error: 'Nenhuma alteração fornecida' }
      }

      updates.updated_at = new Date().toISOString()

      const { data, error } = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      const profile = await this.getUserProfile(userId)
      return {
        success: true,
        data: profile!,
        message: 'Perfil atualizado com sucesso'
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        error: 'Erro ao atualizar perfil'
      }
    }
  }

  static async uploadAvatar(userId: string, file: File): Promise<AvatarUploadResult> {
    try {
      if (!this.validateAvatarFile(file)) {
        return {
          success: false,
          error: 'Arquivo inválido. Use PNG, JPG ou GIF até 5MB'
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(fileName)

      const avatarUrl = urlData.publicUrl

      const { error: updateError } = await (supabase
        .from('profiles') as any)
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      return {
        success: true,
        url: avatarUrl
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return {
        success: false,
        error: 'Erro ao fazer upload da foto'
      }
    }
  }

  static async updateStudioTheme(userId: string, themeId: string): Promise<SettingsResponse<string>> {
    try {
      const theme = STUDIO_THEMES.find(t => t.id === themeId)
      if (!theme) {
        return {
          success: false,
          error: 'Tema inválido'
        }
      }

      const { data: currentProfile } = await (supabase
        .from('profiles') as any)
        .select('preferences')
        .eq('id', userId)
        .single()

      const preferences = {
        ...((currentProfile as Database['public']['Tables']['profiles']['Row'])?.preferences as any || {}),
        studio_theme: themeId
      }

      const { error } = await (supabase
        .from('profiles') as any)
        .update({ 
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      return {
        success: true,
        data: themeId,
        message: 'Tema atualizado com sucesso'
      }
    } catch (error) {
      console.error('Error updating studio theme:', error)
      return {
        success: false,
        error: 'Erro ao atualizar tema'
      }
    }
  }

  // Security operations
  static async getSecuritySettings(userId: string): Promise<SecuritySettings | null> {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return null

      const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('preferences')
        .eq('id', userId)
        .single()

      const pref = ((profile as any)?.preferences) as any
      return {
        email: user.user.email!,
        has_password: !!(user.user as any).encrypted_password,
        two_factor_enabled: pref?.two_factor_enabled || false,
        last_password_change: pref?.last_password_change 
          ? new Date(pref.last_password_change)
          : undefined,
        last_email_change: pref?.last_email_change
          ? new Date(pref.last_email_change)
          : undefined
      }
    } catch (error) {
      console.error('Error fetching security settings:', error)
      return null
    }
  }

  static async changeEmail(data: ChangeEmailRequest): Promise<SettingsResponse<string>> {
    try {
      const emailValidation = this.validateEmail(data.new_email)
      if (!emailValidation.isValid) {
        return {
          success: false,
          error: Object.values(emailValidation.errors)[0]
        }
      }

      const { error } = await supabase.auth.updateUser({
        email: data.new_email
      })

      if (error) {
        if (error.message.includes('Email already in use')) {
          return {
            success: false,
            error: 'Este email já está sendo usado por outra conta'
          }
        }
        throw error
      }

      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        await this.updateSecurityMetadata(user.user.id, {
          last_email_change: new Date().toISOString()
        })
      }

      return {
        success: true,
        data: data.new_email,
        message: 'Verifique seu email para confirmar a alteração'
      }
    } catch (error) {
      console.error('Error changing email:', error)
      return {
        success: false,
        error: 'Erro ao alterar email'
      }
    }
  }

  static async changePassword(data: ChangePasswordRequest): Promise<SettingsResponse<boolean>> {
    try {
      const passwordValidation = this.validatePassword(data.new_password)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: 'Nova senha não atende aos critérios de segurança'
        }
      }

      if (data.new_password !== data.confirm_password) {
        return {
          success: false,
          error: 'Confirmação de senha não confere'
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      })

      if (error) throw error

      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        await this.updateSecurityMetadata(user.user.id, {
          last_password_change: new Date().toISOString()
        })
      }

      return {
        success: true,
        data: true,
        message: 'Senha alterada com sucesso'
      }
    } catch (error) {
      console.error('Error changing password:', error)
      return {
        success: false,
        error: 'Erro ao alterar senha'
      }
    }
  }

  static async setup2FA(password: string): Promise<SettingsResponse<Verify2FASetup>> {
    try {
      // Some projects may not have MFA enabled; handle gracefully
      if (!('mfa' in supabase.auth)) {
        return {
          success: false,
          error: 'MFA não está habilitado neste projeto Supabase. Ative MFA para usar esta função.'
        }
      }

      const { data, error } = await (supabase.auth as any).mfa.enroll({ factorType: 'totp' })

      if (error) {
        const msg = (error as any)?.message || String(error)
        // Friendly messages for common cases
        if (/not enabled|not supported|404/i.test(msg)) {
          return {
            success: false,
            error: 'MFA não está habilitado no projeto. Habilite MFA no Supabase (Authentication → MFA) e tente novamente.'
          }
        }
        throw error
      }

      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      )

      return {
        success: true,
        data: {
          token: data.totp.qr_code,
          backup_codes: backupCodes
        },
        message: '2FA configurado com sucesso'
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error)
      return {
        success: false,
        error: 'Erro ao configurar 2FA'
      }
    }
  }

  static async deleteAccount(data: DeleteAccountRequest): Promise<SettingsResponse<boolean>> {
    try {
      if (data.confirmation_text !== VALIDATION_RULES.DELETE_CONFIRMATION_TEXT) {
        return {
          success: false,
          error: 'Texto de confirmação incorreto'
        }
      }

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        return {
          success: false,
          error: 'Usuário não autenticado'
        }
      }

      const gracePeriodHours = 24
      const deletionDate = new Date()
      deletionDate.setHours(deletionDate.getHours() + gracePeriodHours)

      await (supabase
        .from('profiles') as any)
        .update({
          preferences: {
            account_deletion_scheduled: deletionDate.toISOString(),
            account_deletion_reason: 'user_requested'
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user.user.id)

      return {
        success: true,
        data: true,
        message: `Conta será excluída em ${gracePeriodHours} horas. Você pode cancelar fazendo login novamente.`
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      return {
        success: false,
        error: 'Erro ao excluir conta'
      }
    }
  }

  // Notification preferences
  static async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const { data } = await (supabase
        .from('profiles') as any)
        .select('preferences')
        .eq('id', userId)
        .single()

      const row: any = (data as any) || {}
      const prefs = row?.preferences?.notifications || {}
      
      return {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...prefs
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error)
      return DEFAULT_NOTIFICATION_PREFERENCES
    }
  }

  static async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<SettingsResponse<NotificationPreferences>> {
    try {
      const { data: currentProfile } = await (supabase
        .from('profiles') as any)
        .select('preferences')
        .eq('id', userId)
        .single()

      const currentRow: any = (currentProfile as any) || {}
      const currentPrefs = currentRow?.preferences?.notifications || DEFAULT_NOTIFICATION_PREFERENCES
      const updatedPrefs = { ...currentPrefs, ...preferences }

      const newPreferences = {
        ...((currentProfile as Database['public']['Tables']['profiles']['Row'])?.preferences as any || {}),
        notifications: updatedPrefs
      }

      const { error } = await (supabase
        .from('profiles') as any)
        .update({ 
          preferences: newPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      return {
        success: true,
        data: updatedPrefs,
        message: 'Preferências atualizadas'
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      return {
        success: false,
        error: 'Erro ao atualizar preferências'
      }
    }
  }

  // Helper methods
  private static async updateSecurityMetadata(userId: string, metadata: Record<string, any>) {
      const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('preferences')
      .eq('id', userId)
      .single()

    const preferences = {
      ...(((currentProfile as any)?.preferences) || {}),
      ...metadata
    }

    await (supabase
      .from('profiles') as any)
      .update({ 
        preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
  }

  // Validation methods
  static validateName(name: string): ValidationResult {
    const errors: Record<string, string> = {}
    
    if (!name.trim()) {
      errors.name = 'Nome é obrigatório'
    } else if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      errors.name = `Nome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  static validateUsername(username: string): ValidationResult {
    const errors: Record<string, string> = {}
    const cleanUsername = username.replace('@', '')
    
    if (!cleanUsername) {
      errors.username = 'Nome de usuário é obrigatório'
    } else if (cleanUsername.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
      errors.username = `Nome de usuário deve ter pelo menos ${VALIDATION_RULES.USERNAME_MIN_LENGTH} caracteres`
    } else if (cleanUsername.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
      errors.username = `Nome de usuário deve ter no máximo ${VALIDATION_RULES.USERNAME_MAX_LENGTH} caracteres`
    } else if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      errors.username = 'Nome de usuário pode conter apenas letras, números e underscore'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  static validateBio(bio: string): ValidationResult {
    const errors: Record<string, string> = {}
    
    if (bio.length > VALIDATION_RULES.BIO_MAX_LENGTH) {
      errors.bio = `Bio deve ter no máximo ${VALIDATION_RULES.BIO_MAX_LENGTH} caracteres`
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  static validateEmail(email: string): ValidationResult {
    const errors: Record<string, string> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!email.trim()) {
      errors.email = 'Email é obrigatório'
    } else if (!emailRegex.test(email)) {
      errors.email = 'Formato de email inválido'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  static validatePassword(password: string): PasswordValidation {
    return {
      minLength: password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      get isValid() {
        return this.minLength && this.hasUppercase && this.hasLowercase && 
               this.hasNumber && this.hasSpecialChar
      }
    }
  }

  private static validateAvatarFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize
  }
}
