// =====================================================
// CUSTOM HOOK FOR CHAT FUNCTIONALITY
// Complete state management for TrendlyAI chat system
// =====================================================

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ChatService from '../lib/services/chatService'
import type {
  Message,
  Conversation,
  ChatInputState,
  UserCredits
} from '../types/chat'
import { CHAT_CONSTANTS, CHAT_ERRORS } from '../types/chat'

export interface UseChatReturn {
  // Data
  messages: Message[]
  activeConversation: Conversation | null
  userCredits: UserCredits | null
  
  // Loading states
  isLoading: boolean
  isSending: boolean
  isStreaming: boolean
  
  // Error state
  error: string | null
  
  // Input state
  inputState: ChatInputState
  
  // Actions
  sendMessage: (content: string) => Promise<boolean>
  setActiveConversation: (conversation: Conversation | null) => void
  updateInputState: (updates: Partial<ChatInputState>) => void
  clearInput: () => void
  
  // Real-time
  subscribeToMessages: () => void
  unsubscribeFromMessages: () => void
  
  // Utility
  refetch: () => Promise<void>
  clearError: () => void
  scrollToBottom: () => void
}

/**
 * Custom hook for managing chat state and operations
 */
export function useChat(): UseChatReturn {
  const { user } = useAuth()
  
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null)
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  
  // Input state
  const [inputState, setInputState] = useState<ChatInputState>({
    value: '',
    isFocused: false,
    isSearchEnabled: false,
    attachments: []
  })
  
  // Refs for real-time subscriptions
  const messagesSubscriptionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Load messages for active conversation
   */
  const loadMessages = useCallback(async () => {
    if (!user?.id || !activeConversation?.id) {
      setMessages([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await ChatService.getMessages(user.id, activeConversation.id)
      
      if (response.success && response.data) {
        setMessages(response.data.messages)
      } else {
        setError(response.error || CHAT_ERRORS.NETWORK_ERROR)
        setMessages([])
      }

    } catch (error) {
      console.error('Error loading messages:', error)
      setError('Erro ao carregar mensagens')
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, activeConversation?.id])

  /**
   * Load user credits
   */
  const loadCredits = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await ChatService.getUserCredits(user.id)
      
      if (response.success && response.data) {
        setUserCredits(response.data)
      }

    } catch (error) {
      console.error('Error loading credits:', error)
    }
  }, [user?.id])

  /**
   * Refetch all data
   */
  const refetch = useCallback(async () => {
    await Promise.all([
      loadMessages(),
      loadCredits()
    ])
  }, [loadMessages, loadCredits])

  // Load data when active conversation changes
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Load credits on mount
  useEffect(() => {
    loadCredits()
  }, [loadCredits])

  /**
   * Scroll to bottom of chat
   */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  // =====================================================
  // CHAT OPERATIONS
  // =====================================================

  /**
   * Send a message and get AI response
   */
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!user?.id || !activeConversation?.id) {
      setError(CHAT_ERRORS.UNAUTHORIZED)
      return false
    }

    if (!content.trim()) return false

    // Validate message length
    if (content.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH) {
      setError(CHAT_ERRORS.MESSAGE_TOO_LONG)
      return false
    }

    // Check credits
    if (!userCredits || userCredits.current <= 0) {
      setError(CHAT_ERRORS.INSUFFICIENT_CREDITS)
      return false
    }

    try {
      setIsSending(true)
      setIsStreaming(false)
      setError(null)

      // Optimistically add user message
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: activeConversation.id,
        role: 'user',
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, tempUserMessage])

      // Clear input immediately for better UX
      setInputState(prev => ({ ...prev, value: '' }))

      // Send message and get AI response
      const response = await ChatService.sendMessageWithAIResponse(
        user.id,
        activeConversation.id,
        content.trim()
      )

      if (response.success) {
        // Remove temp message and reload all messages to get the real ones
        await loadMessages()
        
        // Update credits
        await loadCredits()
        
        // Scroll to bottom
        setTimeout(() => scrollToBottom(), 100)
        
        return true
      } else {
        // Remove temp message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id))
        setError(response.error || CHAT_ERRORS.AI_SERVICE_ERROR)
        return false
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setError('Erro inesperado ao enviar mensagem')
      // Remove temp message
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')))
      return false
    } finally {
      setIsSending(false)
      setIsStreaming(false)
    }
  }, [user?.id, activeConversation?.id, userCredits, loadMessages, loadCredits, scrollToBottom])

  /**
   * Subscribe to messages for active conversation
   */
  const subscribeToMessages = useCallback(() => {
    if (!activeConversation?.id || messagesSubscriptionRef.current) return

    try {
      messagesSubscriptionRef.current = ChatService.subscribeToMessages(
        activeConversation.id,
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage: Message = {
              id: payload.new.id,
              conversation_id: payload.new.conversation_id,
              role: payload.new.role,
              content: payload.new.content,
              tokens_used: payload.new.tokens_used,
              created_at: payload.new.created_at,
              updated_at: payload.new.updated_at
            }

            setMessages(prev => {
              // Avoid duplicates
              const exists = prev.some(msg => msg.id === newMessage.id)
              if (exists) return prev
              
              return [...prev, newMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              )
            })

            // Auto-scroll to bottom for new messages
            setTimeout(() => scrollToBottom(), 100)
          }
        }
      )
    } catch (error) {
      console.error('Error subscribing to messages:', error)
    }
  }, [activeConversation?.id, scrollToBottom])

  /**
   * Unsubscribe from messages
   */
  const unsubscribeFromMessages = useCallback(() => {
    if (messagesSubscriptionRef.current) {
      ChatService.unsubscribe(messagesSubscriptionRef.current)
      messagesSubscriptionRef.current = null
    }
  }, [])

  /**
   * Set active conversation
   */
  const setActiveConversation = useCallback((conversation: Conversation | null) => {
    // Unsubscribe from previous conversation
    if (messagesSubscriptionRef.current) {
      ChatService.unsubscribe(messagesSubscriptionRef.current)
      messagesSubscriptionRef.current = null
    }

    setActiveConversationState(conversation)
    
    // Clear messages when switching conversations
    setMessages([])
    setError(null)
    
    // Clear input
    setInputState(prev => ({ 
      ...prev, 
      value: '',
      attachments: []
    }))

    // Subscribe to new conversation if provided
    if (conversation?.id) {
      subscribeToMessages()
    }
  }, [subscribeToMessages])

  // =====================================================
  // REAL-TIME FEATURES
  // =====================================================

  // Subscribe when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      subscribeToMessages()
    }

    return () => {
      unsubscribeFromMessages()
    }
  }, [activeConversation?.id, subscribeToMessages, unsubscribeFromMessages])

  // =====================================================
  // INPUT STATE MANAGEMENT
  // =====================================================

  /**
   * Update input state
   */
  const updateInputState = useCallback((updates: Partial<ChatInputState>) => {
    setInputState(prev => ({ ...prev, ...updates }))
  }, [])

  /**
   * Clear input
   */
  const clearInput = useCallback(() => {
    setInputState(prev => ({
      ...prev,
      value: '',
      attachments: []
    }))
  }, [])

  // =====================================================
  // UI UTILITIES
  // =====================================================

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 50)
    }
  }, [messages.length, scrollToBottom])

  // =====================================================
  // CLEANUP
  // =====================================================

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      unsubscribeFromMessages()
    }
  }, [unsubscribeFromMessages])

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // Data
    messages,
    activeConversation,
    userCredits,
    
    // Loading states
    isLoading,
    isSending,
    isStreaming,
    
    // Error state
    error,
    
    // Input state
    inputState,
    
    // Actions
    sendMessage,
    setActiveConversation,
    updateInputState,
    clearInput,
    
    // Real-time
    subscribeToMessages,
    unsubscribeFromMessages,
    
    // Utility
    refetch,
    clearError,
    scrollToBottom
  }
}

export default useChat
