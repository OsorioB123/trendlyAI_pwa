// =====================================================
// CUSTOM HOOK FOR SUBSCRIPTION MANAGEMENT
// Complete state management for TrendlyAI subscriptions
// =====================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SubscriptionService from '../lib/services/subscriptionService'
import { shouldUseMockData, getMockDataScenario, getMockSubscriptionData } from '../lib/mockData/subscriptionMockData'
import type { 
  UseSubscriptionReturn,
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  BillingHistoryItem,
  PauseSubscriptionData,
  CancelSubscriptionData,
  UpdatePaymentMethodData,
  SubscriptionResponse
} from '../types/subscription'

/**
 * Custom hook for managing subscription state and operations
 */
export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth()
  
  // State management
  const [subscription, setSubscription] = useState<Subscription | undefined>()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Load all subscription data
   */
  const loadSubscriptionData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Use mock data in development mode
      if (shouldUseMockData()) {
        console.log('🎭 Using mock subscription data for development')
        const scenario = getMockDataScenario()
        const mockData = getMockSubscriptionData(scenario)
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setSubscription(mockData.subscription)
        setPlans(mockData.plans)
        setPaymentMethods(mockData.paymentMethods)
        setBillingHistory(mockData.billingHistory)
        
        setIsLoading(false)
        return
      }

      // Load all data in parallel for better performance
      const [
        subscriptionResponse,
        plansResponse,
        paymentMethodsResponse,
        billingHistoryResponse
      ] = await Promise.all([
        SubscriptionService.getUserSubscription(user.id),
        SubscriptionService.getSubscriptionPlans(),
        SubscriptionService.getPaymentMethods(user.id),
        SubscriptionService.getBillingHistory(user.id, 20)
      ])

      // Handle subscription data
      if (subscriptionResponse.success) {
        setSubscription(subscriptionResponse.data)
      } else {
        console.error('Failed to load subscription:', subscriptionResponse.error)
      }

      // Handle plans data
      if (plansResponse.success && plansResponse.data) {
        setPlans(plansResponse.data)
      } else {
        console.error('Failed to load plans:', plansResponse.error)
        setError('Erro ao carregar planos de assinatura')
      }

      // Handle payment methods data
      if (paymentMethodsResponse.success && paymentMethodsResponse.data) {
        setPaymentMethods(paymentMethodsResponse.data)
      } else {
        console.error('Failed to load payment methods:', paymentMethodsResponse.error)
      }

      // Handle billing history data
      if (billingHistoryResponse.success && billingHistoryResponse.data) {
        setBillingHistory(billingHistoryResponse.data)
      } else {
        console.error('Failed to load billing history:', billingHistoryResponse.error)
      }

    } catch (error) {
      console.error('Error loading subscription data:', error)
      setError('Erro ao carregar dados da assinatura')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  /**
   * Refresh all subscription data
   */
  const refetch = useCallback(async () => {
    await loadSubscriptionData()
  }, [loadSubscriptionData])

  // Load data on mount and user change
  useEffect(() => {
    loadSubscriptionData()
  }, [loadSubscriptionData])

  // =====================================================
  // SUBSCRIPTION OPERATIONS
  // =====================================================

  /**
   * Pause subscription for specified months
   */
  const pauseSubscription = useCallback(async (data: PauseSubscriptionData): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.pauseSubscription(user.id, data)
      
      if (response.success) {
        // Refresh subscription data to show updated status
        await loadSubscriptionData()
      } else {
        setError(response.error || 'Erro ao pausar assinatura')
      }

      return response

    } catch (error) {
      console.error('Error pausing subscription:', error)
      const errorMessage = 'Erro inesperado ao pausar assinatura'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id, loadSubscriptionData])

  /**
   * Cancel subscription
   */
  const cancelSubscription = useCallback(async (data: CancelSubscriptionData): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.cancelSubscription(user.id, data)
      
      if (response.success) {
        // Refresh subscription data to show updated status
        await loadSubscriptionData()
      } else {
        setError(response.error || 'Erro ao cancelar assinatura')
      }

      return response

    } catch (error) {
      console.error('Error canceling subscription:', error)
      const errorMessage = 'Erro inesperado ao cancelar assinatura'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id, loadSubscriptionData])

  /**
   * Resume paused subscription
   */
  const resumeSubscription = useCallback(async (): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.resumeSubscription(user.id)
      
      if (response.success) {
        // Refresh subscription data to show updated status
        await loadSubscriptionData()
      } else {
        setError(response.error || 'Erro ao reativar assinatura')
      }

      return response

    } catch (error) {
      console.error('Error resuming subscription:', error)
      const errorMessage = 'Erro inesperado ao reativar assinatura'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id, loadSubscriptionData])

  /**
   * Change subscription plan
   */
  const changeSubscription = useCallback(async (planId: string): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.changeSubscriptionPlan(user.id, planId)
      
      if (response.success) {
        // Refresh subscription data to show updated plan
        await loadSubscriptionData()
      } else {
        setError(response.error || 'Erro ao alterar plano')
      }

      return response

    } catch (error) {
      console.error('Error changing subscription:', error)
      const errorMessage = 'Erro inesperado ao alterar plano'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id, loadSubscriptionData])

  // =====================================================
  // PAYMENT METHOD OPERATIONS
  // =====================================================

  /**
   * Add new payment method
   */
  const addPaymentMethod = useCallback(async (paymentMethodData: any): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.addPaymentMethod(user.id, paymentMethodData)
      
      if (response.success) {
        // Refresh payment methods to show the new one
        const paymentMethodsResponse = await SubscriptionService.getPaymentMethods(user.id)
        if (paymentMethodsResponse.success && paymentMethodsResponse.data) {
          setPaymentMethods(paymentMethodsResponse.data)
        }
      } else {
        setError(response.error || 'Erro ao adicionar método de pagamento')
      }

      return response

    } catch (error) {
      console.error('Error adding payment method:', error)
      const errorMessage = 'Erro inesperado ao adicionar método de pagamento'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id])

  /**
   * Update payment method (e.g., set as default)
   */
  const updatePaymentMethod = useCallback(async (data: UpdatePaymentMethodData): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.updatePaymentMethod(user.id, data.payment_method_id, data)
      
      if (response.success) {
        // Refresh payment methods to show updated data
        const paymentMethodsResponse = await SubscriptionService.getPaymentMethods(user.id)
        if (paymentMethodsResponse.success && paymentMethodsResponse.data) {
          setPaymentMethods(paymentMethodsResponse.data)
        }
      } else {
        setError(response.error || 'Erro ao atualizar método de pagamento')
      }

      return response

    } catch (error) {
      console.error('Error updating payment method:', error)
      const errorMessage = 'Erro inesperado ao atualizar método de pagamento'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id])

  /**
   * Remove payment method
   */
  const removePaymentMethod = useCallback(async (paymentMethodId: string): Promise<SubscriptionResponse> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsUpdating(true)
      setError(null)

      const response = await SubscriptionService.removePaymentMethod(user.id, paymentMethodId)
      
      if (response.success) {
        // Remove from local state immediately for better UX
        setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId))
      } else {
        setError(response.error || 'Erro ao remover método de pagamento')
      }

      return response

    } catch (error) {
      console.error('Error removing payment method:', error)
      const errorMessage = 'Erro inesperado ao remover método de pagamento'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsUpdating(false)
    }
  }, [user?.id])

  // =====================================================
  // BILLING OPERATIONS
  // =====================================================

  /**
   * Download receipt for billing item
   */
  const downloadReceipt = useCallback(async (billingId: string): Promise<SubscriptionResponse<string>> => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setError(null)

      const response = await SubscriptionService.getReceiptUrl(user.id, billingId)
      
      if (response.success && response.data) {
        // Open receipt URL in new tab
        window.open(response.data, '_blank', 'noopener,noreferrer')
      } else {
        setError(response.error || 'Erro ao baixar recibo')
      }

      return response

    } catch (error) {
      console.error('Error downloading receipt:', error)
      const errorMessage = 'Erro inesperado ao baixar recibo'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [user?.id])

  // =====================================================
  // COMPUTED VALUES
  // =====================================================

  /**
   * Get current subscription status with user-friendly label
   */
  const subscriptionStatus = subscription?.status
  const isActive = subscriptionStatus === 'active'
  const isPaused = subscriptionStatus === 'paused'
  const isCanceled = subscriptionStatus === 'canceled'
  const isPastDue = subscriptionStatus === 'past_due'

  /**
   * Get credits usage information
   */
  const creditsInfo = subscription && subscription.plan ? {
    used: subscription.credits_used,
    limit: subscription.plan.credits_limit,
    remaining: Math.max(0, subscription.plan.credits_limit - subscription.credits_used),
    percentage: subscription.plan.credits_limit > 0 
      ? Math.round((subscription.credits_used / subscription.plan.credits_limit) * 100)
      : 0,
    isUnlimited: subscription.plan.credits_limit === 0
  } : null

  /**
   * Get default payment method
   */
  const defaultPaymentMethod = paymentMethods.find(pm => pm.is_default)

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // Data
    subscription,
    plans,
    paymentMethods,
    billingHistory,
    
    // Loading states
    isLoading,
    isUpdating,
    
    // Error state
    error,
    
    // Actions
    pauseSubscription,
    cancelSubscription,
    resumeSubscription,
    changeSubscription,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    downloadReceipt,
    
    // Utility
    refetch,

    // Computed values (additional helper properties)
    subscriptionStatus,
    isActive,
    isPaused,
    isCanceled,
    isPastDue,
    creditsInfo,
    defaultPaymentMethod
  } as UseSubscriptionReturn & {
    // Extended properties for convenience
    subscriptionStatus?: string
    isActive: boolean
    isPaused: boolean
    isCanceled: boolean
    isPastDue: boolean
    creditsInfo: any
    defaultPaymentMethod?: PaymentMethod
  }
}