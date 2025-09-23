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
  background: string // CSS gradient/background definition
  imageUrl: string
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
  // Extra flags used in UI components (aliases/extended options)
  marketing_communications?: boolean
  feature_updates?: boolean
  community_activity?: boolean
  system_maintenance?: boolean
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
  toasts: ToastNotification[]
  dismissToast: (id: string) => void
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
  security_alerts: true,
  marketing_communications: false,
  feature_updates: true,
  community_activity: false,
  system_maintenance: true
}
