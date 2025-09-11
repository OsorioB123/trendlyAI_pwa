// Settings-related interfaces for TrendlyAI account management

// Profile tab interfaces
export interface UserProfile {
  id: string
  full_name: string
  username: string
  bio?: string
  avatar_url?: string
  studio_theme: string
  created_at: Date
  updated_at: Date
}

export interface ProfileFormData {
  full_name: string
  username: string
  bio: string
}

export interface StudioTheme {
  id: string
  name: string
  preview_url: string
  gradient_url: string
}

// Security tab interfaces
export interface SecuritySettings {
  email: string
  has_password: boolean
  two_factor_enabled: boolean
  last_password_change?: Date
  last_email_change?: Date
}

export interface ChangeEmailRequest {
  current_password: string
  new_email: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface Setup2FARequest {
  current_password: string
}

export interface Verify2FASetup {
  token: string
  backup_codes: string[]
}

export interface DeleteAccountRequest {
  confirmation_text: string
  current_password?: string
}

// Notification preferences interfaces
export interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  weekly_reports: boolean
  marketing_emails: boolean
  track_progress_updates: boolean
  new_features: boolean
  security_alerts: boolean // Always true, cannot be disabled
}

// Settings API response interfaces
export interface SettingsResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form validation interfaces
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface PasswordValidation {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  isValid: boolean
}

// Modal and UI state interfaces
export type SettingsTab = 'profile' | 'security' | 'notifications'

export type SecurityModal = 
  | 'change-email' 
  | 'change-password' 
  | 'setup-2fa' 
  | 'delete-account'
  | null

export interface SettingsUIState {
  activeTab: SettingsTab
  activeModal: SecurityModal
  isLoading: boolean
  isSaving: Record<string, boolean>
  editingField: string | null
}

// Toast notification interfaces
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

// File upload interfaces
export interface AvatarUploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface FileUploadProgress {
  loaded: number
  total: number
  percentage: number
}

// Hook return types
export interface UseSettingsReturn {
  profile: UserProfile | null
  security: SecuritySettings | null
  notifications: NotificationPreferences | null
  uiState: SettingsUIState
  isLoading: boolean
  error: string | null
  
  // Profile actions
  updateProfile: (data: Partial<ProfileFormData>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<AvatarUploadResult>
  updateStudioTheme: (themeId: string) => Promise<boolean>
  
  // Security actions
  changeEmail: (data: ChangeEmailRequest) => Promise<boolean>
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>
  setup2FA: (password: string) => Promise<Verify2FASetup | false>
  deleteAccount: (data: DeleteAccountRequest) => Promise<boolean>
  
  // Notification actions
  updateNotifications: (prefs: Partial<NotificationPreferences>) => Promise<boolean>
  
  // UI actions
  setActiveTab: (tab: SettingsTab) => void
  setActiveModal: (modal: SecurityModal) => void
  setEditingField: (field: string | null) => void
  showToast: (notification: Omit<ToastNotification, 'id'>) => void
}

// Component props interfaces
export interface SettingsTabsProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

export interface ProfileTabProps {
  profile: UserProfile
  themes: StudioTheme[]
  isLoading: boolean
  onUpdateProfile: (data: Partial<ProfileFormData>) => Promise<boolean>
  onUploadAvatar: (file: File) => Promise<AvatarUploadResult>
  onUpdateTheme: (themeId: string) => Promise<boolean>
  editingField: string | null
  onEditField: (field: string | null) => void
}

export interface SecurityTabProps {
  security: SecuritySettings
  onChangeEmail: (data: ChangeEmailRequest) => Promise<boolean>
  onChangePassword: (data: ChangePasswordRequest) => Promise<boolean>
  onSetup2FA: (password: string) => Promise<Verify2FASetup | false>
  onDeleteAccount: (data: DeleteAccountRequest) => Promise<boolean>
  activeModal: SecurityModal
  onSetActiveModal: (modal: SecurityModal) => void
}

export interface NotificationsTabProps {
  preferences: NotificationPreferences
  onUpdatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<boolean>
  isLoading: boolean
}

// Form component props
export interface InlineEditableFieldProps {
  label: string
  value: string
  field: string
  isEditing: boolean
  onEdit: (field: string) => void
  onSave: (field: string, value: string) => Promise<boolean>
  onCancel: () => void
  placeholder?: string
  maxLength?: number
  validation?: (value: string) => string | null
}

export interface SecurityModalProps {
  type: SecurityModal
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<boolean>
  isLoading?: boolean
}

export interface ToggleSwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

// Studio themes configuration
export const STUDIO_THEMES: StudioTheme[] = [
  { id: 'default', name: 'Padrão', preview_url: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp', gradient_url: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
  { id: 'theme-2', name: 'Aurora', preview_url: 'https://i.ibb.co/TBV2V62G/grad-2.webp', gradient_url: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
  { id: 'theme-3', name: 'Oceano', preview_url: 'https://i.ibb.co/dsNWJkJf/grad-3.webp', gradient_url: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
  { id: 'theme-4', name: 'Sunset', preview_url: 'https://i.ibb.co/HfKNrwFH/grad-4.webp', gradient_url: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
  { id: 'theme-5', name: 'Floresta', preview_url: 'https://i.ibb.co/RT6rQFKx/grad-5.webp', gradient_url: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
  { id: 'theme-6', name: 'Neon', preview_url: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp', gradient_url: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
  { id: 'theme-7', name: 'Cosmos', preview_url: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp', gradient_url: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
  { id: 'theme-8', name: 'Cristal', preview_url: 'https://i.ibb.co/BJ4stZv/grad-8.webp', gradient_url: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
  { id: 'theme-9', name: 'Fogo', preview_url: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp', gradient_url: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
  { id: 'theme-10', name: 'Lavanda', preview_url: 'https://i.ibb.co/d49qW7f6/grad-10.webp', gradient_url: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
  { id: 'theme-11', name: 'Golden', preview_url: 'https://i.ibb.co/TD15qTjy/grad-11.webp', gradient_url: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
  { id: 'theme-12', name: 'Midnight', preview_url: 'https://i.ibb.co/JwVj3XGH/grad-12.webp', gradient_url: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' }
]

// Validation constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  BIO_MAX_LENGTH: 160,
  NAME_MAX_LENGTH: 50,
  DELETE_CONFIRMATION_TEXT: 'EXCLUIR'
} as const

// Default preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email_notifications: false,
  push_notifications: true,
  weekly_reports: true,
  marketing_emails: false,
  track_progress_updates: true,
  new_features: true,
  security_alerts: true
}