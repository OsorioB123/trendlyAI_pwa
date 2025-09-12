// Base Track interface (extended for individual pages)
export interface Track {
  id: number | string
  title: string
  subtitle?: string
  description?: string
  progress?: number // For listing pages compatibility
  backgroundImage?: string // For listing pages compatibility
  categories: string[]
  category?: string // Primary category
  level: 'Iniciante' | 'Intermediário' | 'Avançado'
  status?: 'nao_iniciado' | 'em_andamento' | 'concluido' // For listing pages
  tags?: string[] // manter compatibilidade
  estimatedDuration?: string
  thumbnailUrl?: string
  isPremium?: boolean
  totalModules?: number
  isPublished?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Track Module interface
export interface TrackModule {
  id: string
  trackId: string
  title: string
  content: ModuleContent
  orderIndex: number
  videoUrl?: string
  tools?: ModuleTool[]
  createdAt?: Date
  updatedAt?: Date
}

// Module content structure
export interface ModuleContent {
  briefing: string
  objectives?: string[]
  videoId?: string
  prompts: ModulePrompt[]
  resources?: ModuleResource[]
}

// Module prompt structure
export interface ModulePrompt {
  id: string
  title: string
  description: string
  content: string
  category?: string
  tags?: string[]
}

// Module tool structure
export interface ModuleTool {
  id: string
  title: string
  description: string
  promptContent: string
}

// Module resource structure  
export interface ModuleResource {
  title: string
  description: string
  url: string
  type: 'link' | 'document' | 'video'
}

// User progress interfaces
export interface UserTrackProgress {
  id: string
  userId: string
  trackId: string
  startedAt: Date
  completedAt?: Date
  progressPercentage: number
  currentModuleId?: string
  isFavorite: boolean
}

export interface UserModuleProgress {
  id: string
  userId: string
  trackId: string
  moduleId: string
  completedAt?: Date
  isCompleted: boolean
  createdAt: Date
}

// Track review interface
export interface TrackReview {
  id: string
  userId: string
  trackId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  createdAt: Date
  updatedAt?: Date
}

// Module states for UI
export type ModuleState = 'completed' | 'current' | 'locked' | 'available'

// Extended track with modules and progress
export interface TrackWithModules extends Track {
  modules: TrackModule[]
  userProgress?: UserTrackProgress
  moduleProgress: UserModuleProgress[]
  averageRating?: number
  totalReviews?: number
  userReview?: TrackReview
}

// Module access control
export interface ModuleAccess {
  moduleId: string
  hasAccess: boolean
  reason?: 'premium_required' | 'previous_incomplete' | 'credits_required'
  requiredCredits?: number
}

// Component props interfaces
export interface TrackProgressProps {
  track: TrackWithModules
  onModuleClick: (module: TrackModule) => void
}

export interface ModuleModalProps {
  module: TrackModule | null
  track: TrackWithModules
  isOpen: boolean
  onClose: () => void
  onComplete: (moduleId: string) => void
  onChatWithSalina: (module: TrackModule) => void
}

export interface TrackRatingProps {
  trackId: string
  currentRating?: TrackReview
  onSubmitRating: (rating: number, comment?: string) => Promise<void>
}

// Existing filters interface for compatibility
export interface TracksFilters {
  search: string
  categories: string[]
  levels: string[]
  status: string[]
  sort: 'top' | 'recent'
}