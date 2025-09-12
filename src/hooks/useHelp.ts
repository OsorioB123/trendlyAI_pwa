// =====================================================
// CUSTOM HOOK FOR HELP CENTER MANAGEMENT
// Complete state management for TrendlyAI help center
// =====================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import HelpService from '../lib/services/helpService'
import { shouldUseMockHelpData, getMockHelpDataScenario, getMockHelpData } from '../lib/mockData/helpMockData'
import type { 
  UseHelpReturn,
  FAQCategory,
  FAQItem,
  SupportTicket,
  SupportMessage,
  HelpResponse,
  SearchFAQData,
  CreateSupportTicketData,
  AddSupportMessageData,
  FAQViewData,
  FAQHelpfulData
} from '../types/help'

/**
 * Custom hook for managing help center state and operations
 */
export function useHelp(initialCategorySlug?: string): UseHelpReturn {
  const { user } = useAuth()
  
  // State management
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [faqItems, setFaqItems] = useState<FAQItem[]>([])
  const [currentCategory, setCurrentCategory] = useState<FAQCategory | undefined>()
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([])
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Load all help center data
   */
  const loadHelpData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Use mock data in development mode
      if (shouldUseMockHelpData()) {
        console.log('🎭 Using mock help center data for development')
        const scenario = getMockHelpDataScenario()
        const mockData = getMockHelpData(scenario)
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setCategories(mockData.categories)
        setFaqItems(mockData.faqItems)
        setSupportTickets(mockData.supportTickets)
        
        // Set initial category
        if (initialCategorySlug) {
          const category = mockData.categories.find(cat => cat.slug === initialCategorySlug)
          if (category) {
            setCurrentCategory(category)
            const categoryItems = mockData.faqItems.filter(item => item.category_id === category.id)
            setFaqItems(categoryItems)
          }
        }
        
        setIsLoading(false)
        return
      }

      // Load categories first
      const categoriesResponse = await HelpService.getFAQCategories()
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data)
        
        // Set initial category or first category
        let targetCategory: FAQCategory | undefined
        if (initialCategorySlug) {
          targetCategory = categoriesResponse.data.find(cat => cat.slug === initialCategorySlug)
        }
        if (!targetCategory && categoriesResponse.data.length > 0) {
          targetCategory = categoriesResponse.data[0]
        }
        
        if (targetCategory) {
          setCurrentCategory(targetCategory)
          
          // Load FAQ items for the initial category
          const faqResponse = await HelpService.getFAQItemsByCategory(targetCategory.id)
          if (faqResponse.success && faqResponse.data) {
            setFaqItems(faqResponse.data)
          }
        }
      } else {
        console.error('Failed to load categories:', categoriesResponse.error)
        setError('Erro ao carregar categorias de ajuda')
      }

      // Load user support tickets if authenticated
      if (user?.id) {
        const ticketsResponse = await HelpService.getUserSupportTickets(user.id)
        if (ticketsResponse.success && ticketsResponse.data) {
          setSupportTickets(ticketsResponse.data)
        }
      }

    } catch (error) {
      console.error('Error loading help data:', error)
      setError('Erro ao carregar dados da central de ajuda')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, initialCategorySlug])

  /**
   * Refresh all help center data
   */
  const refetch = useCallback(async () => {
    await loadHelpData()
  }, [loadHelpData])

  // Load data on mount and user change
  useEffect(() => {
    loadHelpData()
  }, [loadHelpData])

  // =====================================================
  // FAQ OPERATIONS
  // =====================================================

  /**
   * Load FAQ categories
   */
  const loadCategories = useCallback(async (): Promise<HelpResponse<FAQCategory[]>> => {
    try {
      setError(null)
      
      if (shouldUseMockHelpData()) {
        const mockData = getMockHelpData()
        setCategories(mockData.categories)
        return { success: true, data: mockData.categories }
      }

      const response = await HelpService.getFAQCategories()
      
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        setError(response.error || 'Erro ao carregar categorias')
      }

      return response

    } catch (error) {
      console.error('Error loading categories:', error)
      const errorMessage = 'Erro inesperado ao carregar categorias'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Load FAQ items for a specific category
   */
  const loadFAQItems = useCallback(async (categoryId: string): Promise<HelpResponse<FAQItem[]>> => {
    try {
      setError(null)
      
      if (shouldUseMockHelpData()) {
        const mockData = getMockHelpData()
        const items = mockData.faqItems.filter(item => item.category_id === categoryId)
        setFaqItems(items)
        return { success: true, data: items }
      }

      const response = await HelpService.getFAQItemsByCategory(categoryId)
      
      if (response.success && response.data) {
        setFaqItems(response.data)
      } else {
        setError(response.error || 'Erro ao carregar perguntas frequentes')
      }

      return response

    } catch (error) {
      console.error('Error loading FAQ items:', error)
      const errorMessage = 'Erro inesperado ao carregar perguntas frequentes'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  /**
   * Search FAQ items
   */
  const searchFAQ = useCallback(async (data: SearchFAQData): Promise<HelpResponse<FAQItem[]>> => {
    try {
      setIsSearching(true)
      setError(null)
      
      if (shouldUseMockHelpData()) {
        const mockData = getMockHelpData()
        let results = mockData.faqItems
        
        // Simple search simulation
        if (data.query) {
          const query = data.query.toLowerCase()
          results = results.filter(item => 
            item.question.toLowerCase().includes(query) || 
            item.answer.toLowerCase().includes(query)
          )
        }
        
        if (data.category) {
          const category = mockData.categories.find(cat => cat.slug === data.category)
          if (category) {
            results = results.filter(item => item.category_id === category.id)
          }
        }
        
        // Simulate search delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setFaqItems(results)
        return { success: true, data: results }
      }

      const response = await HelpService.searchFAQItems(data)
      
      if (response.success && response.data) {
        setFaqItems(response.data)
      } else {
        setError(response.error || 'Erro ao pesquisar perguntas frequentes')
      }

      return response

    } catch (error) {
      console.error('Error searching FAQ:', error)
      const errorMessage = 'Erro inesperado ao pesquisar'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsSearching(false)
    }
  }, [])

  /**
   * Mark FAQ item as viewed
   */
  const markFAQViewed = useCallback(async (itemId: string): Promise<HelpResponse> => {
    try {
      if (shouldUseMockHelpData()) {
        // In mock mode, just simulate success
        return { success: true }
      }

      const response = await HelpService.markFAQViewed(itemId)
      
      if (!response.success) {
        console.error('Failed to mark FAQ as viewed:', response.error)
      }

      return response

    } catch (error) {
      console.error('Error marking FAQ as viewed:', error)
      return { success: false, error: 'Erro ao registrar visualização' }
    }
  }, [])

  /**
   * Mark FAQ item as helpful
   */
  const markFAQHelpful = useCallback(async (data: FAQHelpfulData): Promise<HelpResponse> => {
    try {
      if (shouldUseMockHelpData()) {
        // In mock mode, just simulate success
        return { success: true }
      }

      const response = await HelpService.markFAQHelpful(data)
      
      if (!response.success) {
        console.error('Failed to mark FAQ as helpful:', response.error)
      }

      return response

    } catch (error) {
      console.error('Error marking FAQ as helpful:', error)
      return { success: false, error: 'Erro ao registrar feedback' }
    }
  }, [])

  // =====================================================
  // SUPPORT TICKET OPERATIONS
  // =====================================================

  /**
   * Create a new support ticket
   */
  const createSupportTicket = useCallback(async (data: CreateSupportTicketData): Promise<HelpResponse<SupportTicket>> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setError(null)
      
      if (shouldUseMockHelpData()) {
        // Simulate ticket creation in mock mode
        const newTicket: SupportTicket = {
          id: 'mock-ticket-' + Date.now(),
          user_id: user.id,
          subject: data.subject,
          description: data.description,
          status: 'open',
          priority: data.priority || 'normal',
          category: data.category,
          metadata: {},
          created_at: new Date(),
          updated_at: new Date()
        }
        
        setSupportTickets(prev => [newTicket, ...prev])
        return { success: true, data: newTicket }
      }

      const response = await HelpService.createSupportTicket(user.id, data)
      
      if (response.success && response.data) {
        // Add the new ticket to local state
        setSupportTickets(prev => [response.data!, ...prev])
      } else {
        setError(response.error || 'Erro ao criar ticket de suporte')
      }

      return response

    } catch (error) {
      console.error('Error creating support ticket:', error)
      const errorMessage = 'Erro inesperado ao criar ticket'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [user?.id])

  /**
   * Get user support tickets
   */
  const getUserSupportTickets = useCallback(async (): Promise<HelpResponse<SupportTicket[]>> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setError(null)
      
      if (shouldUseMockHelpData()) {
        const mockData = getMockHelpData()
        setSupportTickets(mockData.supportTickets)
        return { success: true, data: mockData.supportTickets }
      }

      const response = await HelpService.getUserSupportTickets(user.id)
      
      if (response.success && response.data) {
        setSupportTickets(response.data)
      } else {
        setError(response.error || 'Erro ao carregar tickets de suporte')
      }

      return response

    } catch (error) {
      console.error('Error getting support tickets:', error)
      const errorMessage = 'Erro inesperado ao carregar tickets'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [user?.id])

  /**
   * Add message to support ticket
   */
  const addSupportMessage = useCallback(async (data: AddSupportMessageData): Promise<HelpResponse<SupportMessage>> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsSendingMessage(true)
      setError(null)
      
      if (shouldUseMockHelpData()) {
        // Simulate message creation in mock mode
        const newMessage: SupportMessage = {
          id: 'mock-message-' + Date.now(),
          ticket_id: data.ticket_id,
          sender_id: user.id,
          message: data.message,
          is_internal: false,
          attachments: data.attachments || [],
          created_at: new Date()
        }
        
        return { success: true, data: newMessage }
      }

      const response = await HelpService.addSupportMessage(user.id, data)
      
      if (!response.success) {
        setError(response.error || 'Erro ao enviar mensagem')
      }

      return response

    } catch (error) {
      console.error('Error adding support message:', error)
      const errorMessage = 'Erro inesperado ao enviar mensagem'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsSendingMessage(false)
    }
  }, [user?.id])

  // =====================================================
  // UI STATE ACTIONS
  // =====================================================

  /**
   * Set active category and load its FAQ items
   */
  const setActiveCategory = useCallback(async (categorySlug: string) => {
    try {
      const category = categories.find(cat => cat.slug === categorySlug)
      if (!category) {
        console.error('Category not found:', categorySlug)
        return
      }

      setCurrentCategory(category)
      await loadFAQItems(category.id)
      
    } catch (error) {
      console.error('Error setting active category:', error)
      setError('Erro ao carregar categoria')
    }
  }, [categories, loadFAQItems])

  /**
   * Set search results directly (for search UI)
   */
  const setSearchResults = useCallback((items: FAQItem[]) => {
    setFaqItems(items)
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // =====================================================
  // COMPUTED VALUES
  // =====================================================

  /**
   * Get category by slug
   */
  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find(cat => cat.slug === slug)
  }, [categories])

  /**
   * Get featured FAQ items
   */
  const featuredItems = faqItems.filter(item => item.is_featured)

  /**
   * Get open support tickets count
   */
  const openTicketsCount = supportTickets.filter(ticket => ticket.status === 'open').length

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // Data
    categories,
    faqItems,
    currentCategory,
    supportTickets,
    
    // Loading states
    isLoading,
    isSearching,
    isSendingMessage,
    
    // Error state
    error,
    
    // FAQ Actions
    loadCategories,
    loadFAQItems,
    searchFAQ,
    markFAQViewed,
    markFAQHelpful,
    
    // Support Actions
    createSupportTicket,
    getUserSupportTickets,
    addSupportMessage,
    
    // UI State Actions
    setActiveCategory,
    setSearchResults,
    clearError,
    
    // Utility
    refetch,

    // Computed values (additional helper properties)
    getCategoryBySlug,
    featuredItems,
    openTicketsCount
  } as UseHelpReturn & {
    // Extended properties for convenience
    getCategoryBySlug: (slug: string) => FAQCategory | undefined
    featuredItems: FAQItem[]
    openTicketsCount: number
  }
}