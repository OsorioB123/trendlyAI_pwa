// =====================================================
// CHAT SERVICE FOR TRENDLYAI  
// Complete Supabase integration for chat functionality
// =====================================================

import { supabase } from '../supabase'
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  UpdateConversationRequest,
  CreateMessageRequest,
  ChatServiceResponse,
  ConversationsResponse,
  MessagesResponse,
  AIResponseOptions,
  UserCredits
} from '../../types/chat'
import { CHAT_CONSTANTS, CHAT_ERRORS, PORTUGUESE_MESSAGES } from '../../types/chat'

class ChatService {

  // =====================================================
  // CONVERSATION MANAGEMENT
  // =====================================================

  /**
   * Get user conversations with pagination
   */
  static async getConversations(
    userId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ChatServiceResponse<ConversationsResponse>> {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('conversations')
        .select(`
          *,
          messages!inner(id, content, role, created_at)
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching conversations:', error)
        return { success: false, error: error.message }
      }

      // Transform data to include message count and last message info
      const conversations: Conversation[] = (data as any[] | undefined)?.map((conv: any) => {
        const sortedMessages = conv.messages?.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || []
        
        return {
          id: conv.id,
          user_id: conv.user_id,
          title: conv.title,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          message_count: conv.messages?.length || 0,
          last_message_at: sortedMessages[0]?.created_at
        }
      }) || []

      const response: ConversationsResponse = {
        conversations,
        total: count || 0,
        page,
        limit
      }

      return { success: true, data: response }

    } catch (error) {
      console.error('Conversations fetch error:', error)
      return {
        success: false,
        error: CHAT_ERRORS.NETWORK_ERROR
      }
    }
  }

  /**
   * Create a new conversation
   */
  static async createConversation(
    userId: string,
    request: CreateConversationRequest
  ): Promise<ChatServiceResponse<Conversation>> {
    try {
      const { data, error } = await (supabase as any)
        .from('conversations')
        .insert([{
          user_id: userId,
          title: request.title || PORTUGUESE_MESSAGES.NEW_CONVERSATION,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating conversation:', error)
        return { success: false, error: error.message }
      }

      // If there's an initial message, create it
      if (request.initial_message) {
        // Create welcome message first
        await this.createMessage(userId, {
          conversation_id: data.id,
          role: 'assistant',
          content: PORTUGUESE_MESSAGES.INITIAL_GREETING
        })

        // Then create user message
        await this.createMessage(userId, {
          conversation_id: data.id,
          role: 'user',
          content: request.initial_message
        })

        // Update conversation title based on initial message
        const title = request.initial_message.length > CHAT_CONSTANTS.MAX_TITLE_LENGTH 
          ? request.initial_message.substring(0, CHAT_CONSTANTS.MAX_TITLE_LENGTH) + '...'
          : request.initial_message

        await this.updateConversation(userId, data.id, { title })
      } else {
        // Create welcome message only
        await this.createMessage(userId, {
          conversation_id: data.id,
          role: 'assistant',
          content: PORTUGUESE_MESSAGES.WELCOME_MESSAGE
        })
      }

      const conversation: Conversation = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { success: true, data: conversation }

    } catch (error) {
      console.error('Conversation creation error:', error)
      return {
        success: false,
        error: 'Erro ao criar conversa'
      }
    }
  }

  /**
   * Update conversation
   */
  static async updateConversation(
    userId: string,
    conversationId: string,
    updates: UpdateConversationRequest
  ): Promise<ChatServiceResponse<Conversation>> {
    try {
      const { data, error } = await (supabase as any)
        .from('conversations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating conversation:', error)
        return { success: false, error: error.message }
      }

      const conversation: Conversation = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { success: true, data: conversation }

    } catch (error) {
      console.error('Conversation update error:', error)
      return {
        success: false,
        error: 'Erro ao atualizar conversa'
      }
    }
  }

  /**
   * Delete conversation and all its messages
   */
  static async deleteConversation(
    userId: string,
    conversationId: string
  ): Promise<ChatServiceResponse<void>> {
    try {
      // First delete all messages
      const { error: messagesError } = await (supabase as any)
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)

      if (messagesError) {
        console.error('Error deleting messages:', messagesError)
        return { success: false, error: messagesError.message }
      }

      // Then delete the conversation
      const { error } = await (supabase as any)
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting conversation:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Conversation deletion error:', error)
      return {
        success: false,
        error: 'Erro ao excluir conversa'
      }
    }
  }

  // =====================================================
  // MESSAGE MANAGEMENT
  // =====================================================

  /**
   * Get messages for a conversation
   */
  static async getMessages(
    userId: string,
    conversationId: string,
    page: number = 1,
    limit: number = CHAT_CONSTANTS.MESSAGES_PER_PAGE
  ): Promise<ChatServiceResponse<MessagesResponse>> {
    try {
      const offset = (page - 1) * limit

      // Verify user has access to this conversation
      const { data: conversation } = await (supabase as any)
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single()

      if (!conversation) {
        return {
          success: false,
          error: CHAT_ERRORS.CONVERSATION_NOT_FOUND
        }
      }

      const { data, error, count } = await (supabase as any)
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching messages:', error)
        return { success: false, error: error.message }
      }

      const messages: Message[] = ((data as any[]) || []).map((msg: any) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        role: msg.role,
        content: msg.content,
        tokens_used: msg.tokens_used,
        created_at: msg.created_at,
        updated_at: msg.updated_at
      })) || []

      const response: MessagesResponse = {
        messages,
        total: count || 0,
        conversation_id: conversationId
      }

      return { success: true, data: response }

    } catch (error) {
      console.error('Messages fetch error:', error)
      return {
        success: false,
        error: CHAT_ERRORS.NETWORK_ERROR
      }
    }
  }

  /**
   * Create a new message
   */
  static async createMessage(
    userId: string,
    request: CreateMessageRequest
  ): Promise<ChatServiceResponse<Message>> {
    try {
      // Verify user has access to this conversation
      const { data: conversation } = await (supabase as any)
        .from('conversations')
        .select('id')
        .eq('id', request.conversation_id)
        .eq('user_id', userId)
        .single()

      if (!conversation) {
        return {
          success: false,
          error: CHAT_ERRORS.CONVERSATION_NOT_FOUND
        }
      }

      // Validate message length
      if (request.content.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH) {
        return {
          success: false,
          error: CHAT_ERRORS.MESSAGE_TOO_LONG
        }
      }

      const { data, error } = await (supabase as any)
        .from('messages')
        .insert([{
          conversation_id: request.conversation_id,
          role: request.role,
          content: request.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating message:', error)
        return { success: false, error: error.message }
      }

      // Update conversation's updated_at timestamp
      await (supabase as any)
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', request.conversation_id)

      const message: Message = {
        id: data.id,
        conversation_id: data.conversation_id,
        role: data.role,
        content: data.content,
        tokens_used: data.tokens_used,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { success: true, data: message }

    } catch (error) {
      console.error('Message creation error:', error)
      return {
        success: false,
        error: 'Erro ao criar mensagem'
      }
    }
  }

  // =====================================================
  // AI INTEGRATION
  // =====================================================

  /**
   * Send message and get AI response
   */
  static async sendMessageWithAIResponse(
    userId: string,
    conversationId: string,
    userMessage: string,
    options?: AIResponseOptions
  ): Promise<ChatServiceResponse<Message>> {
    try {
      // Check user credits first
      const creditsResult = await this.getUserCredits(userId)
      if (!creditsResult.success) {
        return { success: false, error: creditsResult.error }
      }

      if (creditsResult.data!.current <= 0) {
        return {
          success: false,
          error: CHAT_ERRORS.INSUFFICIENT_CREDITS
        }
      }

      // Create user message
      const userMessageResult = await this.createMessage(userId, {
        conversation_id: conversationId,
        role: 'user',
        content: userMessage
      })

      if (!userMessageResult.success) {
        return { success: false, error: userMessageResult.error }
      }

      // Generate AI response (this would integrate with Salina/OpenAI)
      const aiResponse = await this.generateAIResponse(
        userId,
        conversationId,
        userMessage,
        options
      )

      if (!aiResponse.success) {
        return { success: false, error: aiResponse.error }
      }

      // Create AI message
      const aiMessageResult = await this.createMessage(userId, {
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse.data!.content
      })

      if (!aiMessageResult.success) {
        return { success: false, error: aiMessageResult.error }
      }

      // Deduct credits
      await this.consumeUserCredits(userId, 1)

      return { success: true, data: aiMessageResult.data! }

    } catch (error) {
      console.error('AI response error:', error)
      return {
        success: false,
        error: CHAT_ERRORS.AI_SERVICE_ERROR
      }
    }
  }

  /**
   * Generate AI response (integrate with Salina)
   */
  private static async generateAIResponse(
    userId: string,
    conversationId: string,
    userMessage: string,
    options?: AIResponseOptions
  ): Promise<ChatServiceResponse<{ content: string; tokens_used: number }>> {
    try {
      // Get conversation context (last few messages)
      const messagesResult = await this.getMessages(userId, conversationId)
      if (!messagesResult.success) {
        return { success: false, error: messagesResult.error }
      }

      // This would integrate with your Salina AI service
      // For now, return a simulated response
      const responses = [
        'Esta Ã© uma resposta simulada da Salina. Integre com sua API de IA para gerar respostas reais.',
        'Ã“tima pergunta! Vou te ajudar com isso. Deixe-me pensar nas melhores estratÃ©gias para o seu caso...',
        'Entendo perfeitamente! Baseado no que vocÃª mencionou, posso sugerir algumas abordagens interessantes...',
        'Excelente ideia! Vamos trabalhar juntos para desenvolver isso. Aqui estÃ£o algumas sugestÃµes...',
        'Perfeito! Com base na nossa conversa, vejo que vocÃª estÃ¡ indo na direÃ§Ã£o certa. Aqui estÃ¡ minha anÃ¡lise...'
      ]

      const baseResponse = responses[Math.floor(Math.random() * responses.length)]
      const maxTokens = options?.max_tokens ? Math.max(options.max_tokens, 50) : undefined
      const content = maxTokens ? baseResponse.slice(0, maxTokens) : baseResponse
      const tokens_used = Math.floor(content.length / 4) // Rough estimation

      return {
        success: true,
        data: { content, tokens_used }
      }

    } catch (error) {
      console.error('AI generation error:', error)
      return {
        success: false,
        error: CHAT_ERRORS.AI_SERVICE_ERROR
      }
    }
  }


  /**
   * Get last user message content in a conversation
   */
  static async getLastUserMessage(userId: string, conversationId: string): Promise<ChatServiceResponse<Message>> {
    try {
      const { data, error } = await (supabase as any)
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        return { success: false, error: error.message }
      }

      const rows = (data as any[]) || []
      const lastUser = rows.find((m: any) => m.role === 'user')
      if (!lastUser) {
        return { success: false, error: 'Mensagem não encontrada' }
      }

      const msg: Message = {
        id: lastUser.id,
        conversation_id: lastUser.conversation_id,
        role: lastUser.role,
        content: lastUser.content,
        tokens_used: lastUser.tokens_used,
        created_at: lastUser.created_at,
        updated_at: lastUser.updated_at,
      }
      return { success: true, data: msg }
    } catch (err) {
      return { success: false, error: CHAT_ERRORS.NETWORK_ERROR }
    }

  }

  /**
   * Regenerate last assistant response based on the last user message
   */
  static async regenerateLastResponse(
    userId: string,
    conversationId: string,
    options?: AIResponseOptions
  ): Promise<ChatServiceResponse<Message>> {
    try {
      // Ensure there is a user message to regenerate from
      const lastUserResult = await this.getLastUserMessage(userId, conversationId)
      if (!lastUserResult.success || !lastUserResult.data) {
        return { success: false, error: lastUserResult.error || 'Sem mensagem de usuário para regenerar' }
      }

      // Check credits
      const creditsResult = await this.getUserCredits(userId)
      if (!creditsResult.success) {
        return { success: false, error: creditsResult.error }
      }
      if ((creditsResult.data?.current ?? 0) <= 0) {
        return { success: false, error: CHAT_ERRORS.INSUFFICIENT_CREDITS }
      }

      // Generate a new AI response
      const aiResponse = await this.generateAIResponse(
        userId,
        conversationId,
        lastUserResult.data.content,
        options
      )
      if (!aiResponse.success || !aiResponse.data) {
        return { success: false, error: aiResponse.error || CHAT_ERRORS.AI_SERVICE_ERROR }
      }

      // Create new assistant message
      const aiMessageResult = await this.createMessage(userId, {
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse.data.content
      })
      if (!aiMessageResult.success || !aiMessageResult.data) {
        return { success: false, error: aiMessageResult.error || 'Falha ao salvar resposta' }
      }

      // Deduct credits
      await this.consumeUserCredits(userId, 1)

      return { success: true, data: aiMessageResult.data }
    } catch (err) {
      console.error('Regenerate response error:', err)
      return { success: false, error: CHAT_ERRORS.AI_SERVICE_ERROR }
    }
  }
  // REAL-TIME FEATURES
  // =====================================================

  /**
   * Subscribe to conversation messages
   */
  static subscribeToMessages(
    conversationId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe()
  }

  /**
   * Subscribe to conversations
   */
  static subscribeToConversations(
    userId: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  /**
   * Unsubscribe from real-time updates
   */
  static unsubscribe(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription)
    }
  }

  // =====================================================
  // CREDIT SYSTEM
  // =====================================================

  /**
   * Get user credits information
   */
  static async getUserCredits(userId: string): Promise<ChatServiceResponse<UserCredits>> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user credits:', error)
        return { success: false, error: error.message }
      }

      if (!data) {
        // Initialize credits for new user
        return await this.initializeUserCredits(userId)
      }

      const row: any = data as any
      const credits: UserCredits = {
        current: row?.current_credits || 0,
        total: row?.total_credits || 50,
        percentage: Math.round(((row?.current_credits || 0) / (row?.total_credits || 50)) * 100),
        renewal_date: row?.renewal_date
      }

      return { success: true, data: credits }

    } catch (error) {
      console.error('Credits fetch error:', error)
      return {
        success: false,
        error: 'Erro ao carregar crÃ©ditos'
      }
    }
  }

  /**
   * Initialize credits for new user
   */
  static async initializeUserCredits(userId: string): Promise<ChatServiceResponse<UserCredits>> {
    try {
      const renewalDate = new Date()
      renewalDate.setDate(renewalDate.getDate() + 1) // Next day

      const { data, error } = await (supabase as any)
        .from('user_credits')
        .insert([{
          user_id: userId,
          current_credits: 50,
          total_credits: 50,
          renewal_date: renewalDate.toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Error initializing credits:', error)
        return { success: false, error: error.message }
      }

      const row: any = data as any
      const credits: UserCredits = {
        current: row.current_credits,
        total: row.total_credits,
        percentage: 100,
        renewal_date: row.renewal_date
      }

      return { success: true, data: credits }

    } catch (error) {
      console.error('Credits initialization error:', error)
      return {
        success: false,
        error: 'Erro ao inicializar crÃ©ditos'
      }
    }
  }

  /**
   * Consume user credits
   */
  static async consumeUserCredits(userId: string, amount: number = 1): Promise<ChatServiceResponse<UserCredits>> {
    try {
      const { error } = await (supabase as any).rpc('consume_user_credits', {
        user_id: userId,
        credit_amount: amount
      })

      if (error) {
        console.error('Error consuming credits:', error)
        return { success: false, error: error.message }
      }

      return await this.getUserCredits(userId)

    } catch (error) {
      console.error('Credit consumption error:', error)
      return {
        success: false,
        error: 'Erro ao consumir crÃ©ditos'
      }
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Search conversations by title or content
   */
  static async searchConversations(
    userId: string,
    query: string,
    limit: number = 20
  ): Promise<ChatServiceResponse<Conversation[]>> {
    try {
      const { data, error } = await (supabase as any)
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,messages.content.ilike.%${query}%`)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error searching conversations:', error)
        return { success: false, error: error.message }
      }

      const conversations = data || []
      return { success: true, data: conversations }

    } catch (error) {
      console.error('Conversation search error:', error)
      return {
        success: false,
        error: 'Erro ao buscar conversas'
      }
    }
  }

  /**
   * Get conversation statistics
   */
  static async getConversationStats(userId: string): Promise<ChatServiceResponse<{
    total_conversations: number;
    total_messages: number;
    credits_used_today: number;
  }>> {
    try {
      const [conversationsResult, messagesResult, creditsResult] = await Promise.all([
        (supabase as any)
          .from('conversations')
          .select('id', { count: 'exact' })
          .eq('user_id', userId),

        (supabase as any)
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('conversations.user_id', userId),

        (supabase as any).rpc('get_credits_used_today', { user_id: userId })
      ])

      const stats = {
        total_conversations: conversationsResult.count || 0,
        total_messages: messagesResult.count || 0,
        credits_used_today: creditsResult.data || 0
      }

      return { success: true, data: stats }

    } catch (error) {
      console.error('Stats fetch error:', error)
      return {
        success: false,
        error: 'Erro ao carregar estatÃ­sticas'
      }
    }
  }
}

export default ChatService






