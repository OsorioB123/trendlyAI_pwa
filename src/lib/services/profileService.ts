// =====================================================
// PROFILE SERVICE FOR TRENDLYAI
// Complete Supabase integration for profile management
// =====================================================

import { getSupabase } from '../supabase'
import type { 
  UserProfile,
  ProfileMetrics,
  Track,
  Tool,
  ArsenalData,
  ReferralInfo,
  NextActionRecommendation,
  ServiceResponse,
  ProfileUpdateData,
  AvatarUploadResult
} from '../../types/profile'
import { uploadImage, compressImage, deleteImage } from '../../../frontend/src/utils/supabaseStorage'

class ProfileService {
  private getClient() {
    return getSupabase()
  }

  // =====================================================
  // PROFILE MANAGEMENT
  // =====================================================

  /**
   * Get user profile data
   */
  static async getUserProfile(userId: string): Promise<ServiceResponse<UserProfile>> {
    try {

      const { data, error } = await this.getClient()
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return { success: false, error: error.message }
      }

      if (!data) {
        return { 
          success: false, 
          error: 'Perfil não encontrado' 
        }
      }

      const profile: UserProfile = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: profile }

    } catch (error) {
      console.error('Profile fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar perfil' 
      }
    }
  }

  /**
   * Update user profile data
   */
  static async updateProfile(userId: string, updates: ProfileUpdateData): Promise<ServiceResponse<UserProfile>> {
    try {

      // Clean the updates object
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
      )

      const { data, error } = await this.getClient()
        .from('profiles')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: error.message }
      }

      const profile: UserProfile = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: profile }

    } catch (error) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        error: 'Erro ao atualizar perfil' 
      }
    }
  }

  /**
   * Upload and update user avatar
   */
  static async uploadAvatar(userId: string, file: File): Promise<ServiceResponse<string>> {
    try {

      // Get current profile to delete old avatar if exists
      const { data: profile } = await this.getClient()
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', userId)
        .single()

      // Compress image before upload
      const compressedFile = await compressImage(file, 400, 0.8)
      
      // Upload to Supabase Storage
      const { data: avatarUrl, error: uploadError } = await uploadImage(
        compressedFile, 
        'avatars', 
        userId
      )

      if (uploadError) {
        console.error('Avatar upload error:', uploadError)
        return { success: false, error: uploadError.message }
      }

      // Update profile with new avatar URL
      const { data, error: updateError } = await this.getClient()
        .from('profiles')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select('avatar_url')
        .single()

      if (updateError) {
        console.error('Avatar URL update error:', updateError)
        return { success: false, error: updateError.message }
      }

      // Delete old avatar if it exists and is different
      if (profile?.avatar_url && profile.avatar_url !== avatarUrl) {
        await deleteImage(profile.avatar_url, 'avatars')
      }

      return { success: true, data: avatarUrl }

    } catch (error) {
      console.error('Avatar upload service error:', error)
      return { 
        success: false, 
        error: 'Erro ao fazer upload do avatar' 
      }
    }
  }

  // =====================================================
  // PROFILE METRICS
  // =====================================================

  /**
   * Get user profile metrics
   */
  static async getProfileMetrics(userId: string): Promise<ServiceResponse<ProfileMetrics>> {
    try {

      const [
        tracksResult,
        modulesResult,
        streakResult,
        activeTracksResult,
        toolsResult
      ] = await Promise.all([
        // Total tracks user has access to
        this.getClient()
          .from('user_track_progress')
          .select('id')
          .eq('user_id', userId),

        // Completed modules
        this.getClient()
          .from('user_module_progress')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'completed'),

        // Calculate streak days (this would need a more complex query or RPC function)
        this.getClient().rpc('calculate_user_streak', { user_id: userId }),

        // Active tracks (in progress)
        this.getClient()
          .from('user_track_progress')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active'),

        // Favorite tools
        this.getClient()
          .from('user_favorite_tools')
          .select('id')
          .eq('user_id', userId)
      ])

      const metrics: ProfileMetrics = {
        total_tracks: tracksResult.data?.length || 0,
        completed_modules: modulesResult.data?.length || 0,
        streak_days: streakResult.data || 0,
        active_tracks: activeTracksResult.data?.length || 0,
        favorite_tools: toolsResult.data?.length || 0
      }

      return { success: true, data: metrics }

    } catch (error) {
      console.error('Profile metrics error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar métricas do perfil' 
      }
    }
  }

  // =====================================================
  // ARSENAL DATA (TRACKS & TOOLS)
  // =====================================================

  /**
   * Get user arsenal data (tracks and tools)
   */
  static async getArsenalData(userId: string): Promise<ServiceResponse<ArsenalData>> {
    try {

      const [tracksResult, toolsResult] = await Promise.all([
        // User saved tracks
        this.getClient()
          .from('user_track_progress')
          .select(`
            *,
            track:tracks(*)
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),

        // User favorite tools
        this.getClient()
          .from('user_favorite_tools')
          .select(`
            *,
            tool:tools(*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ])

      if (tracksResult.error) {
        console.error('Error fetching user tracks:', tracksResult.error)
        return { success: false, error: tracksResult.error.message }
      }

      if (toolsResult.error) {
        console.error('Error fetching user tools:', toolsResult.error)
        return { success: false, error: toolsResult.error.message }
      }

      const tracks: Track[] = tracksResult.data?.map(item => ({
        id: item.track.id,
        title: item.track.title,
        description: item.track.description,
        category: item.track.category,
        progress: item.progress_percentage || 0,
        backgroundImage: item.track.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        created_at: new Date(item.track.created_at),
        updated_at: new Date(item.track.updated_at)
      })) || []

      const tools: Tool[] = toolsResult.data?.map(item => ({
        id: item.tool.id,
        name: item.tool.name,
        description: item.tool.description,
        category: item.tool.category,
        icon: item.tool.icon,
        is_favorite: true,
        usage_count: item.usage_count || 0,
        created_at: new Date(item.tool.created_at)
      })) || []

      const arsenalData: ArsenalData = { tracks, tools }

      return { success: true, data: arsenalData }

    } catch (error) {
      console.error('Arsenal data fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar dados do arsenal' 
      }
    }
  }

  // =====================================================
  // REFERRAL SYSTEM
  // =====================================================

  /**
   * Get user referral information
   */
  static async getReferralInfo(userId: string): Promise<ServiceResponse<ReferralInfo>> {
    try {

      const { data, error } = await this.getClient()
        .from('user_referrals')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error is acceptable
        console.error('Error fetching referral info:', error)
        return { success: false, error: error.message }
      }

      // If no referral record exists, create one with default values
      if (!data) {
        const referralCode = await this.generateReferralCode(userId)
        
        if (!referralCode.success) {
          return { success: false, error: referralCode.error }
        }

        const referralInfo: ReferralInfo = {
          referral_code: referralCode.data!,
          total_credits: 0,
          total_referrals: 0,
          pending_credits: 0,
          affiliate_earnings: 0,
          is_affiliate_eligible: false
        }

        return { success: true, data: referralInfo }
      }

      const referralInfo: ReferralInfo = {
        referral_code: data.referral_code,
        total_credits: data.total_credits || 0,
        total_referrals: data.total_referrals || 0,
        pending_credits: data.pending_credits || 0,
        affiliate_earnings: data.affiliate_earnings || 0,
        is_affiliate_eligible: data.is_affiliate_eligible || false
      }

      return { success: true, data: referralInfo }

    } catch (error) {
      console.error('Referral info fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar informações de indicação' 
      }
    }
  }

  /**
   * Generate referral code for user
   */
  static async generateReferralCode(userId: string): Promise<ServiceResponse<string>> {
    try {

      // Get user profile to generate code based on username or name
      const { data: profile } = await this.getClient()
        .from('profiles')
        .select('display_name, username')
        .eq('user_id', userId)
        .single()

      // Generate referral code
      const baseName = (profile?.username || profile?.display_name || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 8)
      
      const randomSuffix = Math.random().toString(36).substring(2, 6)
      let referralCode = `${baseName}${randomSuffix}`

      // Check if code already exists, if so, generate another
      let attempts = 0
      while (attempts < 5) {
        const { data: existing } = await this.getClient()
          .from('user_referrals')
          .select('referral_code')
          .eq('referral_code', referralCode)
          .single()

        if (!existing) break

        referralCode = `${baseName}${Math.random().toString(36).substring(2, 6)}`
        attempts++
      }

      // Insert referral record
      const { error } = await this.getClient()
        .from('user_referrals')
        .insert([{
          user_id: userId,
          referral_code: referralCode,
          total_credits: 0,
          total_referrals: 0,
          pending_credits: 0,
          affiliate_earnings: 0,
          is_affiliate_eligible: false
        }])

      if (error) {
        console.error('Error creating referral code:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: referralCode }

    } catch (error) {
      console.error('Referral code generation error:', error)
      return { 
        success: false, 
        error: 'Erro ao gerar código de indicação' 
      }
    }
  }

  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  /**
   * Get next action recommendation for user
   */
  static async getNextActionRecommendation(userId: string): Promise<ServiceResponse<NextActionRecommendation>> {
    try {

      // This would typically use AI/ML or rule-based system
      // For now, return a mock recommendation
      const recommendation: NextActionRecommendation = {
        id: '1',
        title: 'Sua Próxima Jogada',
        description: 'Notei que você dominou IA Generativa. Para elevar seu jogo, a técnica de prompt engineering avançado é o passo lógico para seus roteiros.',
        action_text: 'Aprender esta Técnica',
        action_url: '/tracks/prompt-engineering-avancado',
        priority: 'high',
        category: 'skill-progression',
        created_at: new Date()
      }

      return { success: true, data: recommendation }

    } catch (error) {
      console.error('Next action recommendation error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar recomendação' 
      }
    }
  }

  // =====================================================
  // PROFILE INITIALIZATION
  // =====================================================

  /**
   * Initialize profile for new user
   */
  static async initializeProfile(userId: string, initialData?: Partial<UserProfile>): Promise<ServiceResponse<UserProfile>> {
    try {

      const defaultProfile = {
        user_id: userId,
        display_name: '',
        bio: '',
        level: 'Explorador' as const,
        total_tracks: 0,
        completed_modules: 0,
        streak_days: 0,
        referral_credits: 0,
        ...initialData
      }

      const { data, error } = await this.getClient()
        .from('profiles')
        .insert([defaultProfile])
        .select()
        .single()

      if (error) {
        console.error('Error initializing profile:', error)
        return { success: false, error: error.message }
      }

      const profile: UserProfile = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: profile }

    } catch (error) {
      console.error('Profile initialization error:', error)
      return { 
        success: false, 
        error: 'Erro ao inicializar perfil' 
      }
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Get profile completion percentage
   */
  static async getProfileCompletion(userId: string): Promise<ServiceResponse<number>> {
    try {
      const profileResult = await this.getUserProfile(userId)
      
      if (!profileResult.success || !profileResult.data) {
        return { success: false, error: 'Perfil não encontrado' }
      }

      const profile = profileResult.data
      let completionScore = 0
      const totalFields = 4

      // Check each field
      if (profile.display_name?.trim()) completionScore += 25
      if (profile.bio?.trim()) completionScore += 25
      if (profile.avatar_url) completionScore += 25
      if (profile.level !== 'Explorador') completionScore += 25

      return { success: true, data: completionScore }

    } catch (error) {
      console.error('Profile completion calculation error:', error)
      return { 
        success: false, 
        error: 'Erro ao calcular completude do perfil' 
      }
    }
  }

  /**
   * Delete user profile and associated data
   */
  static async deleteProfile(userId: string): Promise<ServiceResponse> {
    try {

      // Get profile to delete avatar
      const { data: profile } = await this.getClient()
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', userId)
        .single()

      // Delete avatar from storage
      if (profile?.avatar_url) {
        await deleteImage(profile.avatar_url, 'avatars')
      }

      // Delete profile record
      const { error } = await this.getClient()
        .from('profiles')
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Profile deletion error:', error)
      return { 
        success: false, 
        error: 'Erro ao deletar perfil' 
      }
    }
  }
}

export default ProfileService