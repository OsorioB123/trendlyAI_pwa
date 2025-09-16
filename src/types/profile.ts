// =====================================================
// PROFILE TYPE DEFINITIONS FOR TRENDLYAI
// =====================================================

export interface UserProfile {
  id: string
  user_id: string
  display_name?: string
  bio?: string
  level: ProfileLevel
  avatar_url?: string
  total_tracks: number
  completed_modules: number
  streak_days: number
  referral_code?: string
  referral_credits: number
  created_at: Date
  updated_at: Date
}

export interface ProfileMetrics {
  total_tracks: number
  completed_modules: number
  streak_days: number
  active_tracks: number
  favorite_tools: number
}

export interface Track {
  id: string
  title: string
  progress: number
  backgroundImage: string
  description?: string
  category?: string
  created_at: Date
  updated_at: Date
}

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  is_favorite: boolean
  usage_count: number
  created_at: Date
}

export interface ArsenalData {
  tracks: Track[]
  tools: Tool[]
}

export interface ReferralInfo {
  referral_code: string
  total_credits: number
  total_referrals: number
  pending_credits: number
  affiliate_earnings: number
  is_affiliate_eligible: boolean
}

export interface NextActionRecommendation {
  id: string
  title: string
  description: string
  action_text: string
  action_url?: string
  priority: 'low' | 'medium' | 'high'
  category: string
  created_at: Date
}

// =====================================================
// COMPONENT PROPS INTERFACES
// =====================================================

export interface ProfileHeaderProps {
  profile: UserProfile
  editingField: string | null
  onEditField: (field: string | null) => void
  onSaveField: (field: string, value: string) => Promise<boolean>
  onAvatarUpload: (file: File) => Promise<boolean>
  isUploading: boolean
  isSaving: boolean
  className?: string
}

export interface ProfileMetricsProps {
  metrics: ProfileMetrics
  level: ProfileLevel
  className?: string
}

export interface ArsenalSectionProps {
  arsenalData: ArsenalData
  activeTab: ArsenalTab
  onTabChange: (tab: ArsenalTab) => void
  onTrackClick: (track: Track) => void
  onNavigateToTools: () => void
  isLoading?: boolean
  className?: string
}

export interface ReferralSectionProps {
  referralInfo: ReferralInfo
  activeTab: ReferralTab
  onTabChange: (tab: ReferralTab) => void
  onCopyReferralLink: () => void
  onNavigateToAffiliate: () => void
  className?: string
}

export interface NextActionProps {
  recommendation: NextActionRecommendation
  onActionClick: () => void
  className?: string
}

export interface InlineEditFieldProps {
  value: string
  field: string
  isEditing: boolean
  onEdit: () => void
  onSave: (value: string) => Promise<boolean>
  onCancel: () => void
  placeholder?: string
  maxLength?: number
  multiline?: boolean
  validation?: (value: string) => string | null
  className?: string
}

// =====================================================
// SERVICE INTERFACES
// =====================================================

export interface ProfileService {
  getUserProfile: (userId: string) => Promise<ServiceResponse<UserProfile>>
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<ServiceResponse<UserProfile>>
  uploadAvatar: (userId: string, file: File) => Promise<ServiceResponse<string>>
  getProfileMetrics: (userId: string) => Promise<ServiceResponse<ProfileMetrics>>
  getArsenalData: (userId: string) => Promise<ServiceResponse<ArsenalData>>
  getReferralInfo: (userId: string) => Promise<ServiceResponse<ReferralInfo>>
  getNextActionRecommendation: (userId: string) => Promise<ServiceResponse<NextActionRecommendation>>
  generateReferralCode: (userId: string) => Promise<ServiceResponse<string>>
}

export interface ServiceResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

// =====================================================
// HOOK INTERFACES
// =====================================================

export interface UseProfileReturn {
  // Data
  profile: UserProfile | null
  metrics: ProfileMetrics | null
  arsenalData: ArsenalData | null
  referralInfo: ReferralInfo | null
  nextAction: NextActionRecommendation | null
  
  // Loading states
  isLoading: boolean
  isUploading: boolean
  isSaving: boolean
  
  // Error states
  error: string | null
  
  // Form state
  editingField: string | null
  formData: Partial<UserProfile>
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>
  uploadAvatar: (file: File) => Promise<boolean>
  setEditingField: (field: string | null) => void
  saveField: (field: string, value: string) => Promise<boolean>
  cancelEdit: () => void
  
  // Data refresh
  refetch: () => Promise<void>
  clearError: () => void
}

// =====================================================
// FORM AND VALIDATION INTERFACES
// =====================================================

export interface ProfileFormData {
  display_name: string
  bio: string
  level: ProfileLevel
}

export interface ProfileFormErrors {
  display_name?: string
  bio?: string
  level?: string
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ProfileValidationRules {
  display_name: ValidationRule
  bio: ValidationRule
}

// =====================================================
// CONSTANTS AND ENUMS
// =====================================================

export type ProfileLevel = 
  | 'Explorador' 
  | 'Criador' 
  | 'Inovador' 
  | 'Visionário' 
  | 'Maestro'

export type ArsenalTab = 'trails' | 'tools'
export type ReferralTab = 'credits' | 'affiliate'

export const PROFILE_LEVELS: Record<ProfileLevel, { 
  name: string
  color: string
  description: string 
}> = {
  'Explorador': {
    name: 'Explorador',
    color: 'text-blue-400',
    description: 'Iniciando a jornada criativa'
  },
  'Criador': {
    name: 'Criador', 
    color: 'text-green-400',
    description: 'Desenvolvendo habilidades'
  },
  'Inovador': {
    name: 'Inovador',
    color: 'text-purple-400', 
    description: 'Criando soluções únicas'
  },
  'Visionário': {
    name: 'Visionário',
    color: 'text-orange-400',
    description: 'Liderando tendências'
  },
  'Maestro': {
    name: 'Maestro',
    color: 'text-yellow-400',
    description: 'Dominando a arte criativa'
  }
} as const

export const PROFILE_VALIDATION_RULES: ProfileValidationRules = {
  display_name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  bio: {
    maxLength: 200
  }
}

export const ARSENAL_TABS: Record<ArsenalTab, {
  id: ArsenalTab
  label: string
  icon: string
}> = {
  trails: {
    id: 'trails',
    label: 'Trilhas Salvas',
    icon: 'Navigation'
  },
  tools: {
    id: 'tools', 
    label: 'Ferramentas',
    icon: 'Wrench'
  }
} as const

export const REFERRAL_TABS: Record<ReferralTab, {
  id: ReferralTab
  label: string
  icon: string
}> = {
  credits: {
    id: 'credits',
    label: 'Indique e Ganhe Créditos',
    icon: 'Gift'
  },
  affiliate: {
    id: 'affiliate',
    label: 'Programa de Afiliados', 
    icon: 'DollarSign'
  }
} as const

// =====================================================
// API ENDPOINT INTERFACES
// =====================================================

export interface ProfileEndpoints {
  getProfile: (userId: string) => string
  updateProfile: (userId: string) => string
  uploadAvatar: (userId: string) => string
  getMetrics: (userId: string) => string
  getArsenal: (userId: string) => string
  getReferral: (userId: string) => string
  getNextAction: (userId: string) => string
}

// =====================================================
// ERROR HANDLING INTERFACES
// =====================================================

export interface ProfileErrorCode {
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND'
  UPDATE_FAILED: 'UPDATE_FAILED'
  AVATAR_UPLOAD_FAILED: 'AVATAR_UPLOAD_FAILED'
  METRICS_LOAD_FAILED: 'METRICS_LOAD_FAILED'
  ARSENAL_LOAD_FAILED: 'ARSENAL_LOAD_FAILED'
  REFERRAL_LOAD_FAILED: 'REFERRAL_LOAD_FAILED'
  VALIDATION_ERROR: 'VALIDATION_ERROR'
  UNAUTHORIZED: 'UNAUTHORIZED'
  NETWORK_ERROR: 'NETWORK_ERROR'
}

export interface ProfileError {
  code: keyof ProfileErrorCode
  message: string
  field?: string
  details?: any
}

// =====================================================
// MOCK DATA INTERFACES (for development)
// =====================================================

export interface MockProfileData {
  profile: UserProfile
  metrics: ProfileMetrics
  arsenalData: ArsenalData
  referralInfo: ReferralInfo
  nextAction: NextActionRecommendation
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type ProfileField = keyof Pick<UserProfile, 'display_name' | 'bio' | 'level'>
export type EditableProfileData = Pick<UserProfile, 'display_name' | 'bio' | 'level'>
export type ProfileUpdateData = Partial<EditableProfileData>

// =====================================================
// ANIMATION AND UI STATE INTERFACES
// =====================================================

export interface ProfileAnimationState {
  isEntering: boolean
  hasAnimated: boolean
  delayIndex: number
}

export interface ProfileUIState {
  activeArsenalTab: ArsenalTab
  activeReferralTab: ReferralTab
  showSuccessMessage: boolean
  successMessage: string
  showErrorMessage: boolean
  errorMessage: string
}

// =====================================================
// AVATAR UPLOAD INTERFACES
// =====================================================

export interface AvatarUploadOptions {
  maxSize: number // in bytes
  allowedTypes: string[]
  compressionQuality: number
  targetSize: number // width/height in pixels
}

export interface AvatarUploadResult {
  url: string
  filename: string
  size: number
  type: string
}

export const DEFAULT_AVATAR_OPTIONS: AvatarUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  compressionQuality: 0.8,
  targetSize: 400
} as const
