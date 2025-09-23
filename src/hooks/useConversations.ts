// =====================================================
// CUSTOM HOOK FOR CONVERSATIONS MANAGEMENT
// Sidebar conversation list and management functionality
// =====================================================

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ChatService from '../lib/services/chatService'
import type {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest
} from '../types/chat'
import { CHAT_CONSTANTS, CHAT_ERRORS, PORTUGUESE_MESSAGES } from '../types/chat'

export interface UseConversationsReturn {
  // Data
  conversations: Conversation[]
  activeConversationId: string | null
  
  // UI State
  isMobileSidebarOpen: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  editingConversationId: string | null
  editingTitle: string
  conversationMenuId: string | null
  showDeleteModal: boolean
  conversationToDelete: string | null
  
  // Loading & Error
  isLoading: boolean
  error: string | null
  
  // Actions - Conversation Management
  createConversation: (request?: CreateConversationRequest) => Promise<Conversation | null>
  createConversationWithMessage: (message: string) => Promise<Conversation | null>
  updateConversation: (id: string, updates: UpdateConversationRequest) => Promise<boolean>
  deleteConversation: (id: string) => Promise<boolean>
  selectConversation: (id: string) => void
  
  // Actions - UI State
  setActiveConversationId: (id: string | null) => void
  toggleMobileSidebar: () => void
  setIsMobileSidebarOpen: (open: boolean) => void
  
  // Actions - Editing
  startRenaming: (id: string, currentTitle: string) => void
  saveRename: () => Promise<boolean>
  cancelRename: () => void
  setEditingTitle: (title: string) => void
  
  // Actions - Context Menu
  setConversationMenuId: (id: string | null) => void
  
  // Actions - Delete Modal
  confirmDeleteConversation: (id: string) => void
  executeDelete: () => Promise<boolean>
  cancelDelete: () => void
  
  // Real-time
  subscribeToConversations: () => void
  unsubscribeFromConversations: () => void
  
  // Utility
  refetch: () => Promise<void>
  clearError: () => void
  searchConversations: (query: string) => Promise<Conversation[]>
  getConversationById: (id: string) => Conversation | undefined
}

/**
 * Custom hook for managing conversations and sidebar functionality
 */
export function useConversations(): UseConversationsReturn {
  const { user } = useAuth()
  
  // Data state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null)
  
  // UI state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [conversationMenuId, setConversationMenuId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  
  // Real-time subscription ref
  const conversationsSubscriptionRef = useRef<any>(null)

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Load conversations for user
   */
  const loadConversations = useCallback(async () => {
    if (!user?.id) {
      setConversations([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await ChatService.getConversations(user.id)
      
      if (response.success && response.data) {
        setConversations(response.data.conversations)
        
        // Set first conversation as active if none is set
        if (!activeConversationId && response.data.conversations.length > 0) {
          setActiveConversationIdState(response.data.conversations[0].id)
        }
      } else {
        setError(response.error || CHAT_ERRORS.NETWORK_ERROR)
        setConversations([])
      }

    } catch (error) {
      console.error('Error loading conversations:', error)
      setError('Erro ao carregar conversas')
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, activeConversationId])

  /**
   * Refetch conversations
   */
  const refetch = useCallback(async () => {
    await loadConversations()
  }, [loadConversations])

  // Load conversations on mount and user change
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // =====================================================
  // CONVERSATION MANAGEMENT
  // =====================================================

  /**
   * Create a new conversation
   */
  const createConversation = useCallback(async (request?: CreateConversationRequest): Promise<Conversation | null> => {
    if (!user?.id) {
      setError(CHAT_ERRORS.UNAUTHORIZED)
      return null
    }

    try {
      setIsCreating(true)
      setError(null)

      const conversationRequest = request || {
        title: PORTUGUESE_MESSAGES.NEW_CONVERSATION
      }

      const response = await ChatService.createConversation(user.id, conversationRequest)
      
      if (response.success && response.data) {
        const newConversation = response.data
        
        // Add to conversations list at the beginning
        setConversations(prev => [newConversation, ...prev])
        
        // Set as active
        setActiveConversationIdState(newConversation.id)
        
        // Close mobile sidebar
        setIsMobileSidebarOpen(false)
        
        return newConversation
      } else {
        setError(response.error || 'Erro ao criar conversa')
        return null
      }

    } catch (error) {
      console.error('Error creating conversation:', error)
      setError('Erro inesperado ao criar conversa')
      return null
    } finally {
      setIsCreating(false)
    }
  }, [user?.id])

  /**
   * Create conversation with initial message
   */
  const createConversationWithMessage = useCallback(async (message: string): Promise<Conversation | null> => {
    if (!user?.id || !message.trim()) return null

    const title = message.length > CHAT_CONSTANTS.MAX_TITLE_LENGTH 
      ? message.substring(0, CHAT_CONSTANTS.MAX_TITLE_LENGTH) + '...'
      : message

    return await createConversation({
      title,
      initial_message: message.trim()
    })
  }, [user?.id, createConversation])

  /**
   * Update conversation
   */
  const updateConversation = useCallback(async (id: string, updates: UpdateConversationRequest): Promise<boolean> => {
    if (!user?.id) {
      setError(CHAT_ERRORS.UNAUTHORIZED)
      return false
    }

    try {
      setIsUpdating(true)
      setError(null)

      // Optimistic update
      setConversations(prev => 
        prev.map(conv => 
          conv.id === id 
            ? { ...conv, ...updates, updated_at: new Date().toISOString() }
            : conv
        )
      )

      const response = await ChatService.updateConversation(user.id, id, updates)
      
      if (response.success && response.data) {
        // Update with real data from server
        setConversations(prev => 
          prev.map(conv => 
            conv.id === id ? response.data! : conv
          )
        )
        return true
      } else {
        // Revert optimistic update
        await loadConversations()
        setError(response.error || 'Erro ao atualizar conversa')
        return false
      }

    } catch (error) {
      console.error('Error updating conversation:', error)
      await loadConversations() // Revert optimistic update
      setError('Erro inesperado ao atualizar conversa')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id, loadConversations])

  /**
   * Delete conversation
   */
  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    if (!user?.id) {
      setError(CHAT_ERRORS.UNAUTHORIZED)
      return false
    }

    try {
      setIsDeleting(true)
      setError(null)

      const response = await ChatService.deleteConversation(user.id, id)
      
      if (response.success) {
        // Remove from conversations list
        setConversations(prev => prev.filter(conv => conv.id !== id))
        
        // Handle active conversation
        if (activeConversationId === id) {
          const remainingConversations = conversations.filter(conv => conv.id !== id)
          if (remainingConversations.length > 0) {
            setActiveConversationIdState(remainingConversations[0].id)
          } else {
            // Create a new conversation if none left
            await createConversation()
          }
        }
        
        return true
      } else {
        setError(response.error || 'Erro ao excluir conversa')
        return false
      }

    } catch (error) {
      console.error('Error deleting conversation:', error)
      setError('Erro inesperado ao excluir conversa')
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [user?.id, activeConversationId, conversations, createConversation])

  /**
   * Select conversation and close mobile sidebar
   */
  const selectConversation = useCallback((id: string) => {
    setActiveConversationIdState(id)
    setIsMobileSidebarOpen(false)
    setConversationMenuId(null)
    
    // Cancel any active editing
    if (editingConversationId) {
      setEditingConversationId(null)
      setEditingTitle('')
    }
  }, [editingConversationId])

  /**
   * Set active conversation ID
   */
  const setActiveConversationId = useCallback((id: string | null) => {
    setActiveConversationIdState(id)
  }, [])

  // =====================================================
  // MOBILE SIDEBAR
  // =====================================================

  /**
   * Toggle mobile sidebar
   */
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev)
  }, [])

  // =====================================================
  // CONVERSATION EDITING
  // =====================================================

  /**
   * Start renaming conversation
   */
  const startRenaming = useCallback((id: string, currentTitle: string) => {
    setEditingConversationId(id)
    setEditingTitle(currentTitle)
    setConversationMenuId(null)
  }, [])

  /**
   * Save rename
   */
  const saveRename = useCallback(async (): Promise<boolean> => {
    if (!editingTitle.trim() || !editingConversationId) return false

    const success = await updateConversation(editingConversationId, {
      title: editingTitle.trim()
    })

    if (success) {
      setEditingConversationId(null)
      setEditingTitle('')
    }

    return success
  }, [editingTitle, editingConversationId, updateConversation])

  /**
   * Cancel rename
   */
  const cancelRename = useCallback(() => {
    setEditingConversationId(null)
    setEditingTitle('')
  }, [])

  // =====================================================
  // DELETE MODAL
  // =====================================================

  /**
   * Show delete confirmation modal
   */
  const confirmDeleteConversation = useCallback((id: string) => {
    setConversationToDelete(id)
    setShowDeleteModal(true)
    setConversationMenuId(null)
  }, [])

  /**
   * Execute delete
   */
  const executeDelete = useCallback(async (): Promise<boolean> => {
    if (!conversationToDelete) return false

    const success = await deleteConversation(conversationToDelete)
    
    if (success) {
      setShowDeleteModal(false)
      setConversationToDelete(null)
    }

    return success
  }, [conversationToDelete, deleteConversation])

  /**
   * Cancel delete
   */
  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false)
    setConversationToDelete(null)
  }, [])

  // =====================================================
  // REAL-TIME FEATURES
  // =====================================================

  /**
   * Subscribe to conversations changes
   */
  const subscribeToConversations = useCallback(() => {
    if (!user?.id || conversationsSubscriptionRef.current) return

    try {
      conversationsSubscriptionRef.current = ChatService.subscribeToConversations(
        user.id,
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              const newConversation: Conversation = payload.new
              setConversations(prev => {
                // Avoid duplicates
                if (prev.some(conv => conv.id === newConversation.id)) return prev
                return [newConversation, ...prev]
              })
              break

            case 'UPDATE':
              const updatedConversation: Conversation = payload.new
              setConversations(prev => 
                prev.map(conv => 
                  conv.id === updatedConversation.id ? updatedConversation : conv
                )
              )
              break

            case 'DELETE':
              const deletedId = payload.old.id
              setConversations(prev => prev.filter(conv => conv.id !== deletedId))
              break
          }
        }
      )
    } catch (error) {
      console.error('Error subscribing to conversations:', error)
    }
  }, [user?.id])

  /**
   * Unsubscribe from conversations
   */
  const unsubscribeFromConversations = useCallback(() => {
    if (conversationsSubscriptionRef.current) {
      ChatService.unsubscribe(conversationsSubscriptionRef.current)
      conversationsSubscriptionRef.current = null
    }
  }, [])

  // Subscribe on mount
  useEffect(() => {
    subscribeToConversations()

    return () => {
      unsubscribeFromConversations()
    }
  }, [subscribeToConversations, unsubscribeFromConversations])

  // =====================================================
  // SEARCH & UTILITY
  // =====================================================

  /**
   * Search conversations
   */
  const searchConversations = useCallback(async (query: string): Promise<Conversation[]> => {
    if (!user?.id || !query.trim()) return conversations

    try {
      const response = await ChatService.searchConversations(user.id, query.trim())
      
      if (response.success && response.data) {
        return response.data
      } else {
        console.error('Search error:', response.error)
        return []
      }

    } catch (error) {
      console.error('Error searching conversations:', error)
      return []
    }
  }, [user?.id, conversations])

  /**
   * Get conversation by ID
   */
  const getConversationById = useCallback((id: string): Conversation | undefined => {
    return conversations.find(conv => conv.id === id)
  }, [conversations])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // Data
    conversations,
    activeConversationId,
    
    // UI State
    isMobileSidebarOpen,
    isCreating,
    isUpdating,
    isDeleting,
    editingConversationId,
    editingTitle,
    conversationMenuId,
    showDeleteModal,
    conversationToDelete,
    
    // Loading & Error
    isLoading,
    error,
    
    // Actions - Conversation Management
    createConversation,
    createConversationWithMessage,
    updateConversation,
    deleteConversation,
    selectConversation,
    
    // Actions - UI State
    setActiveConversationId,
    toggleMobileSidebar,
    setIsMobileSidebarOpen,
    
    // Actions - Editing
    startRenaming,
    saveRename,
    cancelRename,
    setEditingTitle,
    
    // Actions - Context Menu
    setConversationMenuId,
    
    // Actions - Delete Modal
    confirmDeleteConversation,
    executeDelete,
    cancelDelete,
    
    // Real-time
    subscribeToConversations,
    unsubscribeFromConversations,
    
    // Utility
    refetch,
    clearError,
    searchConversations,
    getConversationById
  }
}

export default useConversations
