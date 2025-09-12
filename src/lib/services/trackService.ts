import { supabase } from '../supabase'
import { 
  Track, 
  TrackWithModules, 
  TrackModule, 
  UserTrackProgress, 
  UserModuleProgress,
  TrackReview,
  ModuleAccess 
} from '../../types/track'

export interface TrackServiceError {
  message: string
  code?: string
}

export class TrackService {
  static async getTrackWithModules(trackId: string, userId?: string): Promise<TrackWithModules | null> {
    try {
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .select(`
          *,
          track_modules (
            id,
            title,
            content,
            order_index,
            video_url,
            tools,
            created_at,
            updated_at
          )
        `)
        .eq('id', trackId)
        .eq('is_published', true)
        .single()

      if (trackError) throw trackError
      if (!trackData) return null

      const modules: TrackModule[] = trackData.track_modules
        ?.sort((a: any, b: any) => a.order_index - b.order_index)
        .map((module: any) => ({
          id: module.id,
          trackId: trackId,
          title: module.title,
          content: module.content,
          orderIndex: module.order_index,
          videoUrl: module.video_url,
          tools: module.tools || [],
          createdAt: module.created_at ? new Date(module.created_at) : undefined,
          updatedAt: module.updated_at ? new Date(module.updated_at) : undefined
        })) || []

      const track: Track = {
        id: trackData.id,
        title: trackData.title,
        subtitle: trackData.subtitle,
        description: trackData.description,
        categories: trackData.category ? [trackData.category] : [],
        category: trackData.category,
        level: trackData.difficulty_level,
        estimatedDuration: trackData.estimated_duration,
        thumbnailUrl: trackData.thumbnail_url,
        isPremium: trackData.is_premium,
        totalModules: trackData.total_modules,
        isPublished: trackData.is_published,
        createdAt: trackData.created_at ? new Date(trackData.created_at) : undefined,
        updatedAt: trackData.updated_at ? new Date(trackData.updated_at) : undefined
      }

      let userProgress: UserTrackProgress | undefined
      let moduleProgress: UserModuleProgress[] = []
      let userReview: TrackReview | undefined

      if (userId) {
        [userProgress, moduleProgress, userReview] = await Promise.all([
          this.getUserTrackProgress(userId, trackId),
          this.getUserModuleProgress(userId, trackId),
          this.getUserTrackReview(userId, trackId)
        ])
      }

      const { data: reviewStats } = await supabase
        .from('track_reviews')
        .select('rating')
        .eq('track_id', trackId)

      const averageRating = reviewStats?.length 
        ? reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewStats.length
        : undefined

      return {
        ...track,
        modules,
        userProgress,
        moduleProgress,
        averageRating,
        totalReviews: reviewStats?.length || 0,
        userReview
      }
    } catch (error) {
      console.error('Error fetching track with modules:', error)
      return null
    }
  }

  static async getUserTrackProgress(userId: string, trackId: string): Promise<UserTrackProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_tracks')
        .select('*')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (!data) return null

      return {
        id: data.id,
        userId: data.user_id,
        trackId: data.track_id,
        startedAt: new Date(data.started_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        progressPercentage: data.progress_percentage,
        currentModuleId: data.current_module_id,
        isFavorite: data.is_favorite
      }
    } catch (error) {
      console.error('Error fetching user track progress:', error)
      return null
    }
  }

  static async getUserModuleProgress(userId: string, trackId: string): Promise<UserModuleProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('track_id', trackId)

      if (error) throw error
      if (!data) return []

      return data.map(progress => ({
        id: progress.id,
        userId: progress.user_id,
        trackId: progress.track_id,
        moduleId: progress.module_id,
        completedAt: progress.completed_at ? new Date(progress.completed_at) : undefined,
        isCompleted: progress.is_completed,
        createdAt: new Date(progress.created_at)
      }))
    } catch (error) {
      console.error('Error fetching user module progress:', error)
      return []
    }
  }

  static async getUserTrackReview(userId: string, trackId: string): Promise<TrackReview | null> {
    try {
      const { data, error } = await supabase
        .from('track_reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (!data) return null

      return {
        id: data.id,
        userId: data.user_id,
        trackId: data.track_id,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date(data.created_at),
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
      }
    } catch (error) {
      console.error('Error fetching user track review:', error)
      return null
    }
  }

  static async startTrack(userId: string, trackId: string): Promise<UserTrackProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_tracks')
        .upsert({
          user_id: userId,
          track_id: trackId,
          started_at: new Date().toISOString(),
          progress_percentage: 0
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.user_id,
        trackId: data.track_id,
        startedAt: new Date(data.started_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        progressPercentage: data.progress_percentage,
        currentModuleId: data.current_module_id,
        isFavorite: data.is_favorite
      }
    } catch (error) {
      console.error('Error starting track:', error)
      return null
    }
  }

  static async completeModule(userId: string, trackId: string, moduleId: string): Promise<boolean> {
    try {
      const { error: moduleError } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: userId,
          track_id: trackId,
          module_id: moduleId,
          is_completed: true,
          completed_at: new Date().toISOString()
        })

      if (moduleError) throw moduleError

      const progressPercentage = await this.calculateTrackProgress(userId, trackId)

      const { error: trackError } = await supabase
        .from('user_tracks')
        .update({ 
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('track_id', trackId)

      if (trackError) throw trackError

      return true
    } catch (error) {
      console.error('Error completing module:', error)
      return false
    }
  }

  static async calculateTrackProgress(userId: string, trackId: string): Promise<number> {
    try {
      const { data: totalModules } = await supabase
        .from('track_modules')
        .select('id')
        .eq('track_id', trackId)

      const { data: completedModules } = await supabase
        .from('user_module_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .eq('is_completed', true)

      if (!totalModules?.length) return 0

      return Math.round((completedModules?.length || 0) / totalModules.length * 100)
    } catch (error) {
      console.error('Error calculating track progress:', error)
      return 0
    }
  }

  static async toggleFavoriteTrack(userId: string, trackId: string): Promise<boolean> {
    try {
      const { data: current } = await supabase
        .from('user_tracks')
        .select('is_favorite')
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .single()

      const newFavoriteStatus = !current?.is_favorite

      const { error } = await supabase
        .from('user_tracks')
        .upsert({
          user_id: userId,
          track_id: trackId,
          is_favorite: newFavoriteStatus,
          started_at: new Date().toISOString()
        })

      if (error) throw error

      return newFavoriteStatus
    } catch (error) {
      console.error('Error toggling favorite track:', error)
      return false
    }
  }

  static async submitTrackReview(
    userId: string, 
    trackId: string, 
    rating: 1 | 2 | 3 | 4 | 5, 
    comment?: string
  ): Promise<TrackReview | null> {
    try {
      const { data, error } = await supabase
        .from('track_reviews')
        .upsert({
          user_id: userId,
          track_id: trackId,
          rating,
          comment,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.user_id,
        trackId: data.track_id,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date(data.created_at),
        updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
      }
    } catch (error) {
      console.error('Error submitting track review:', error)
      return null
    }
  }

  static async checkModuleAccess(userId: string, trackId: string, moduleId: string): Promise<ModuleAccess> {
    try {
      const track = await this.getTrackWithModules(trackId, userId)
      if (!track) {
        return {
          moduleId,
          hasAccess: false,
          reason: 'premium_required'
        }
      }

      if (track.isPremium) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', userId)
          .single()

        if (!profile?.is_premium) {
          return {
            moduleId,
            hasAccess: false,
            reason: 'premium_required'
          }
        }
      }

      const moduleIndex = track.modules.findIndex(m => m.id === moduleId)
      if (moduleIndex === 0) {
        return {
          moduleId,
          hasAccess: true
        }
      }

      const previousModule = track.modules[moduleIndex - 1]
      const previousCompleted = track.moduleProgress.some(
        p => p.moduleId === previousModule.id && p.isCompleted
      )

      if (!previousCompleted) {
        return {
          moduleId,
          hasAccess: false,
          reason: 'previous_incomplete'
        }
      }

      return {
        moduleId,
        hasAccess: true
      }
    } catch (error) {
      console.error('Error checking module access:', error)
      return {
        moduleId,
        hasAccess: false,
        reason: 'premium_required'
      }
    }
  }

  static async getRecommendedTracks(userId?: string, limit: number = 6): Promise<Track[]> {
    try {
      let query = supabase
        .from('tracks')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      const { data, error } = await query

      if (error) throw error
      if (!data) return []

      return data.map(track => ({
        id: track.id,
        title: track.title,
        subtitle: track.subtitle,
        description: track.description,
        categories: track.category ? [track.category] : [],
        category: track.category,
        level: track.difficulty_level,
        estimatedDuration: track.estimated_duration,
        thumbnailUrl: track.thumbnail_url,
        isPremium: track.is_premium,
        totalModules: track.total_modules,
        isPublished: track.is_published,
        createdAt: track.created_at ? new Date(track.created_at) : undefined,
        updatedAt: track.updated_at ? new Date(track.updated_at) : undefined
      }))
    } catch (error) {
      console.error('Error fetching recommended tracks:', error)
      return []
    }
  }
}