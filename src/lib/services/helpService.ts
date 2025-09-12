// =====================================================
// HELP CENTER SERVICE FOR TRENDLYAI
// Complete Supabase integration for FAQ and support management
// =====================================================

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { 
  FAQCategory,
  FAQItem,
  SupportTicket,
  SupportMessage,
  HelpResponse,
  SearchFAQData,
  CreateSupportTicketData,
  AddSupportMessageData,
  FAQViewData,
  FAQHelpfulData,
  FAQSearchFilters
} from '../../types/help'

class HelpService {
  private supabase = createClientComponentClient()

  // =====================================================
  // FAQ CATEGORIES
  // =====================================================

  /**
   * Get all active FAQ categories
   */
  static async getFAQCategories(): Promise<HelpResponse<FAQCategory[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('faq_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching FAQ categories:', error)
        return { success: false, error: error.message }
      }

      const categories: FAQCategory[] = data.map(category => ({
        ...category,
        created_at: new Date(category.created_at),
        updated_at: new Date(category.updated_at)
      }))

      return { success: true, data: categories }

    } catch (error) {
      console.error('FAQ categories fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar categorias de ajuda' 
      }
    }
  }

  /**
   * Get a specific FAQ category by slug
   */
  static async getFAQCategoryBySlug(slug: string): Promise<HelpResponse<FAQCategory>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('faq_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching FAQ category:', error)
        return { success: false, error: error.message }
      }

      const category: FAQCategory = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: category }

    } catch (error) {
      console.error('FAQ category fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar categoria de ajuda' 
      }
    }
  }

  // =====================================================
  // FAQ ITEMS
  // =====================================================

  /**
   * Get all active FAQ items for a category
   */
  static async getFAQItemsByCategory(categoryId: string): Promise<HelpResponse<FAQItem[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('faq_items')
        .select(`
          *,
          category:faq_categories(*)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching FAQ items:', error)
        return { success: false, error: error.message }
      }

      const items: FAQItem[] = data.map(item => ({
        ...item,
        category: item.category ? {
          ...item.category,
          created_at: new Date(item.category.created_at),
          updated_at: new Date(item.category.updated_at)
        } : undefined,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }))

      return { success: true, data: items }

    } catch (error) {
      console.error('FAQ items fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar perguntas frequentes' 
      }
    }
  }

  /**
   * Get all active FAQ items for a category by slug
   */
  static async getFAQItemsByCategorySlug(categorySlug: string): Promise<HelpResponse<FAQItem[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('faq_items')
        .select(`
          *,
          category:faq_categories!inner(*)
        `)
        .eq('category.slug', categorySlug)
        .eq('is_active', true)
        .eq('category.is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching FAQ items by category slug:', error)
        return { success: false, error: error.message }
      }

      const items: FAQItem[] = data.map(item => ({
        ...item,
        category: item.category ? {
          ...item.category,
          created_at: new Date(item.category.created_at),
          updated_at: new Date(item.category.updated_at)
        } : undefined,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }))

      return { success: true, data: items }

    } catch (error) {
      console.error('FAQ items by category slug fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar perguntas frequentes' 
      }
    }
  }

  /**
   * Get featured FAQ items across all categories
   */
  static async getFeaturedFAQItems(limit: number = 10): Promise<HelpResponse<FAQItem[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('faq_items')
        .select(`
          *,
          category:faq_categories(*)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching featured FAQ items:', error)
        return { success: false, error: error.message }
      }

      const items: FAQItem[] = data.map(item => ({
        ...item,
        category: item.category ? {
          ...item.category,
          created_at: new Date(item.category.created_at),
          updated_at: new Date(item.category.updated_at)
        } : undefined,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }))

      return { success: true, data: items }

    } catch (error) {
      console.error('Featured FAQ items fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar perguntas em destaque' 
      }
    }
  }

  /**
   * Search FAQ items by query
   */
  static async searchFAQItems(searchData: SearchFAQData): Promise<HelpResponse<FAQItem[]>> {
    try {
      const supabase = createClientComponentClient()
      const { query, category, limit = 20 } = searchData

      let queryBuilder = supabase
        .from('faq_items')
        .select(`
          *,
          category:faq_categories(*)
        `)
        .eq('is_active', true)

      // Full text search on question and answer
      if (query) {
        queryBuilder = queryBuilder.or(
          `question.ilike.%${query}%,answer.ilike.%${query}%`
        )
      }

      // Filter by category if specified
      if (category) {
        queryBuilder = queryBuilder.eq('category.slug', category)
      }

      const { data, error } = await queryBuilder
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error searching FAQ items:', error)
        return { success: false, error: error.message }
      }

      const items: FAQItem[] = data.map(item => ({
        ...item,
        category: item.category ? {
          ...item.category,
          created_at: new Date(item.category.created_at),
          updated_at: new Date(item.category.updated_at)
        } : undefined,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }))

      return { success: true, data: items }

    } catch (error) {
      console.error('FAQ search error:', error)
      return { 
        success: false, 
        error: 'Erro ao pesquisar perguntas frequentes' 
      }
    }
  }

  /**
   * Mark FAQ item as viewed (increment view count)
   */
  static async markFAQViewed(itemId: string): Promise<HelpResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase.rpc('increment_faq_view_count', {
        item_id: itemId
      })

      if (error) {
        console.error('Error marking FAQ as viewed:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('FAQ view count increment error:', error)
      return { 
        success: false, 
        error: 'Erro ao registrar visualização' 
      }
    }
  }

  /**
   * Mark FAQ item as helpful
   */
  static async markFAQHelpful(data: FAQHelpfulData): Promise<HelpResponse> {
    try {
      const supabase = createClientComponentClient()
      const { item_id, helpful } = data

      const { error } = await supabase
        .from('faq_items')
        .update({
          helpful_count: helpful 
            ? supabase.sql`helpful_count + 1`
            : supabase.sql`GREATEST(helpful_count - 1, 0)`
        })
        .eq('id', item_id)

      if (error) {
        console.error('Error marking FAQ as helpful:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('FAQ helpful count update error:', error)
      return { 
        success: false, 
        error: 'Erro ao registrar feedback' 
      }
    }
  }

  // =====================================================
  // SUPPORT TICKETS
  // =====================================================

  /**
   * Create a new support ticket
   */
  static async createSupportTicket(userId: string, ticketData: CreateSupportTicketData): Promise<HelpResponse<SupportTicket>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: userId,
          ...ticketData
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating support ticket:', error)
        return { success: false, error: error.message }
      }

      const ticket: SupportTicket = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        first_response_at: data.first_response_at ? new Date(data.first_response_at) : undefined,
        resolved_at: data.resolved_at ? new Date(data.resolved_at) : undefined
      }

      return { success: true, data: ticket }

    } catch (error) {
      console.error('Support ticket creation error:', error)
      return { 
        success: false, 
        error: 'Erro ao criar ticket de suporte' 
      }
    }
  }

  /**
   * Get user support tickets
   */
  static async getUserSupportTickets(userId: string): Promise<HelpResponse<SupportTicket[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user support tickets:', error)
        return { success: false, error: error.message }
      }

      const tickets: SupportTicket[] = data.map(ticket => ({
        ...ticket,
        created_at: new Date(ticket.created_at),
        updated_at: new Date(ticket.updated_at),
        first_response_at: ticket.first_response_at ? new Date(ticket.first_response_at) : undefined,
        resolved_at: ticket.resolved_at ? new Date(ticket.resolved_at) : undefined
      }))

      return { success: true, data: tickets }

    } catch (error) {
      console.error('User support tickets fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar tickets de suporte' 
      }
    }
  }

  /**
   * Get a specific support ticket
   */
  static async getSupportTicket(userId: string, ticketId: string): Promise<HelpResponse<SupportTicket>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching support ticket:', error)
        return { success: false, error: error.message }
      }

      const ticket: SupportTicket = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        first_response_at: data.first_response_at ? new Date(data.first_response_at) : undefined,
        resolved_at: data.resolved_at ? new Date(data.resolved_at) : undefined
      }

      return { success: true, data: ticket }

    } catch (error) {
      console.error('Support ticket fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar ticket de suporte' 
      }
    }
  }

  /**
   * Update support ticket status
   */
  static async updateSupportTicketStatus(
    userId: string, 
    ticketId: string, 
    status: SupportTicket['status']
  ): Promise<HelpResponse<SupportTicket>> {
    try {
      const supabase = createClientComponentClient()

      const updateData: any = { status }

      // Set resolved_at timestamp when resolving
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating support ticket status:', error)
        return { success: false, error: error.message }
      }

      const ticket: SupportTicket = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        first_response_at: data.first_response_at ? new Date(data.first_response_at) : undefined,
        resolved_at: data.resolved_at ? new Date(data.resolved_at) : undefined
      }

      return { success: true, data: ticket }

    } catch (error) {
      console.error('Support ticket status update error:', error)
      return { 
        success: false, 
        error: 'Erro ao atualizar status do ticket' 
      }
    }
  }

  // =====================================================
  // SUPPORT MESSAGES
  // =====================================================

  /**
   * Add message to support ticket
   */
  static async addSupportMessage(userId: string, messageData: AddSupportMessageData): Promise<HelpResponse<SupportMessage>> {
    try {
      const supabase = createClientComponentClient()

      // Verify user owns the ticket
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('id', messageData.ticket_id)
        .eq('user_id', userId)
        .single()

      if (!ticket) {
        return { 
          success: false, 
          error: 'Ticket não encontrado ou sem permissão' 
        }
      }

      const { data, error } = await supabase
        .from('support_messages')
        .insert([{
          ticket_id: messageData.ticket_id,
          sender_id: userId,
          message: messageData.message,
          attachments: messageData.attachments || []
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding support message:', error)
        return { success: false, error: error.message }
      }

      const message: SupportMessage = {
        ...data,
        created_at: new Date(data.created_at)
      }

      return { success: true, data: message }

    } catch (error) {
      console.error('Support message creation error:', error)
      return { 
        success: false, 
        error: 'Erro ao enviar mensagem' 
      }
    }
  }

  /**
   * Get messages for a support ticket
   */
  static async getSupportMessages(userId: string, ticketId: string): Promise<HelpResponse<SupportMessage[]>> {
    try {
      const supabase = createClientComponentClient()

      // Verify user owns the ticket
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('id', ticketId)
        .eq('user_id', userId)
        .single()

      if (!ticket) {
        return { 
          success: false, 
          error: 'Ticket não encontrado ou sem permissão' 
        }
      }

      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .eq('is_internal', false)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching support messages:', error)
        return { success: false, error: error.message }
      }

      const messages: SupportMessage[] = data.map(message => ({
        ...message,
        created_at: new Date(message.created_at)
      }))

      return { success: true, data: messages }

    } catch (error) {
      console.error('Support messages fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar mensagens' 
      }
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Get help center statistics
   */
  static async getHelpCenterStats(): Promise<HelpResponse<any>> {
    try {
      const supabase = createClientComponentClient()

      const [categoriesResult, itemsResult, ticketsResult] = await Promise.all([
        supabase.from('faq_categories').select('id').eq('is_active', true),
        supabase.from('faq_items').select('id, view_count').eq('is_active', true),
        supabase.from('support_tickets').select('id, status')
      ])

      const stats = {
        total_categories: categoriesResult.data?.length || 0,
        total_faq_items: itemsResult.data?.length || 0,
        total_views: itemsResult.data?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0,
        total_tickets: ticketsResult.data?.length || 0,
        open_tickets: ticketsResult.data?.filter(t => t.status === 'open').length || 0,
        resolved_tickets: ticketsResult.data?.filter(t => t.status === 'resolved').length || 0
      }

      return { success: true, data: stats }

    } catch (error) {
      console.error('Help center stats error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar estatísticas' 
      }
    }
  }
}

export default HelpService