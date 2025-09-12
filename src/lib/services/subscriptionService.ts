// =====================================================
// SUBSCRIPTION SERVICE FOR TRENDLYAI
// Complete Supabase integration for subscription management
// =====================================================

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { 
  Subscription, 
  SubscriptionPlan, 
  PaymentMethod, 
  BillingHistoryItem,
  SubscriptionResponse,
  PauseSubscriptionData,
  CancelSubscriptionData,
  UpdatePaymentMethodData,
  CreateSubscriptionData
} from '../../types/subscription'

class SubscriptionService {
  private supabase = createClientComponentClient()

  // =====================================================
  // SUBSCRIPTION PLANS
  // =====================================================

  /**
   * Get all active subscription plans
   */
  static async getSubscriptionPlans(): Promise<SubscriptionResponse<SubscriptionPlan[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_brl', { ascending: true })

      if (error) {
        console.error('Error fetching subscription plans:', error)
        return { success: false, error: error.message }
      }

      const plans: SubscriptionPlan[] = data.map(plan => ({
        ...plan,
        created_at: new Date(plan.created_at),
        updated_at: new Date(plan.updated_at)
      }))

      return { success: true, data: plans }

    } catch (error) {
      console.error('Subscription plans fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar planos de assinatura' 
      }
    }
  }

  /**
   * Get a specific subscription plan by ID
   */
  static async getSubscriptionPlan(planId: string): Promise<SubscriptionResponse<SubscriptionPlan>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (error) {
        console.error('Error fetching subscription plan:', error)
        return { success: false, error: error.message }
      }

      const plan: SubscriptionPlan = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: plan }

    } catch (error) {
      console.error('Subscription plan fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar plano de assinatura' 
      }
    }
  }

  // =====================================================
  // USER SUBSCRIPTION MANAGEMENT
  // =====================================================

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionResponse<Subscription>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching user subscription:', error)
        return { success: false, error: error.message }
      }

      if (!data) {
        return { success: true, data: undefined }
      }

      const subscription: Subscription = {
        ...data,
        plan: data.plan ? {
          ...data.plan,
          created_at: new Date(data.plan.created_at),
          updated_at: new Date(data.plan.updated_at)
        } : undefined,
        current_period_start: data.current_period_start ? new Date(data.current_period_start) : undefined,
        current_period_end: data.current_period_end ? new Date(data.current_period_end) : undefined,
        pause_until: data.pause_until ? new Date(data.pause_until) : undefined,
        cancel_at: data.cancel_at ? new Date(data.cancel_at) : undefined,
        canceled_at: data.canceled_at ? new Date(data.canceled_at) : undefined,
        trial_start: data.trial_start ? new Date(data.trial_start) : undefined,
        trial_end: data.trial_end ? new Date(data.trial_end) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: subscription }

    } catch (error) {
      console.error('User subscription fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar assinatura do usuário' 
      }
    }
  }

  /**
   * Create a new subscription for user
   */
  static async createSubscription(userId: string, subscriptionData: CreateSubscriptionData): Promise<SubscriptionResponse<Subscription>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: subscriptionData.plan_id,
          status: 'incomplete', // Will be updated by Stripe webhook
          credits_used: 0,
          metadata: {}
        })
        .select('*')
        .single()

      if (error) {
        console.error('Error creating subscription:', error)
        return { success: false, error: error.message }
      }

      const subscription: Subscription = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: subscription }

    } catch (error) {
      console.error('Subscription creation error:', error)
      return { 
        success: false, 
        error: 'Erro ao criar assinatura' 
      }
    }
  }

  /**
   * Pause user subscription
   */
  static async pauseSubscription(userId: string, data: PauseSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const pauseUntil = new Date()
      pauseUntil.setMonth(pauseUntil.getMonth() + data.months)

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'paused',
          pause_until: pauseUntil.toISOString(),
          metadata: { pause_reason: data.reason }
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error pausing subscription:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Subscription pause error:', error)
      return { 
        success: false, 
        error: 'Erro ao pausar assinatura' 
      }
    }
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(userId: string, data: CancelSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          metadata: { 
            cancel_reason: data.reason,
            feedback: data.feedback 
          }
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error canceling subscription:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Subscription cancellation error:', error)
      return { 
        success: false, 
        error: 'Erro ao cancelar assinatura' 
      }
    }
  }

  /**
   * Resume paused subscription
   */
  static async resumeSubscription(userId: string): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          pause_until: null
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error resuming subscription:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Subscription resume error:', error)
      return { 
        success: false, 
        error: 'Erro ao reativar assinatura' 
      }
    }
  }

  /**
   * Change subscription plan
   */
  static async changeSubscriptionPlan(userId: string, newPlanId: string): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_id: newPlanId,
          metadata: { plan_change_date: new Date().toISOString() }
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error changing subscription plan:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Subscription plan change error:', error)
      return { 
        success: false, 
        error: 'Erro ao alterar plano de assinatura' 
      }
    }
  }

  // =====================================================
  // PAYMENT METHODS
  // =====================================================

  /**
   * Get user's payment methods
   */
  static async getPaymentMethods(userId: string): Promise<SubscriptionResponse<PaymentMethod[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payment methods:', error)
        return { success: false, error: error.message }
      }

      const paymentMethods: PaymentMethod[] = data.map(method => ({
        ...method,
        created_at: new Date(method.created_at),
        updated_at: new Date(method.updated_at)
      }))

      return { success: true, data: paymentMethods }

    } catch (error) {
      console.error('Payment methods fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar métodos de pagamento' 
      }
    }
  }

  /**
   * Add new payment method
   */
  static async addPaymentMethod(userId: string, paymentMethodData: Partial<PaymentMethod>): Promise<SubscriptionResponse<PaymentMethod>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          ...paymentMethodData,
          metadata: paymentMethodData.metadata || {}
        })
        .select('*')
        .single()

      if (error) {
        console.error('Error adding payment method:', error)
        return { success: false, error: error.message }
      }

      const paymentMethod: PaymentMethod = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      }

      return { success: true, data: paymentMethod }

    } catch (error) {
      console.error('Payment method addition error:', error)
      return { 
        success: false, 
        error: 'Erro ao adicionar método de pagamento' 
      }
    }
  }

  /**
   * Update payment method
   */
  static async updatePaymentMethod(userId: string, paymentMethodId: string, data: UpdatePaymentMethodData): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from('payment_methods')
        .update({
          is_default: data.set_as_default || false
        })
        .eq('user_id', userId)
        .eq('id', paymentMethodId)

      if (error) {
        console.error('Error updating payment method:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Payment method update error:', error)
      return { 
        success: false, 
        error: 'Erro ao atualizar método de pagamento' 
      }
    }
  }

  /**
   * Remove payment method
   */
  static async removePaymentMethod(userId: string, paymentMethodId: string): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('user_id', userId)
        .eq('id', paymentMethodId)

      if (error) {
        console.error('Error removing payment method:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Payment method removal error:', error)
      return { 
        success: false, 
        error: 'Erro ao remover método de pagamento' 
      }
    }
  }

  // =====================================================
  // BILLING HISTORY
  // =====================================================

  /**
   * Get user's billing history
   */
  static async getBillingHistory(userId: string, limit: number = 50): Promise<SubscriptionResponse<BillingHistoryItem[]>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('billing_history')
        .select(`
          *,
          payment_method:payment_methods(*)
        `)
        .eq('user_id', userId)
        .order('billing_date', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching billing history:', error)
        return { success: false, error: error.message }
      }

      const billingHistory: BillingHistoryItem[] = data.map(item => ({
        ...item,
        billing_date: new Date(item.billing_date),
        due_date: item.due_date ? new Date(item.due_date) : undefined,
        paid_at: item.paid_at ? new Date(item.paid_at) : undefined,
        payment_method: item.payment_method ? {
          ...item.payment_method,
          created_at: new Date(item.payment_method.created_at),
          updated_at: new Date(item.payment_method.updated_at)
        } : undefined,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }))

      return { success: true, data: billingHistory }

    } catch (error) {
      console.error('Billing history fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao carregar histórico de cobrança' 
      }
    }
  }

  /**
   * Get receipt download URL
   */
  static async getReceiptUrl(userId: string, billingId: string): Promise<SubscriptionResponse<string>> {
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase
        .from('billing_history')
        .select('receipt_url, invoice_url')
        .eq('user_id', userId)
        .eq('id', billingId)
        .single()

      if (error) {
        console.error('Error fetching receipt URL:', error)
        return { success: false, error: error.message }
      }

      const receiptUrl = data.receipt_url || data.invoice_url
      if (!receiptUrl) {
        return { success: false, error: 'Recibo não disponível' }
      }

      return { success: true, data: receiptUrl }

    } catch (error) {
      console.error('Receipt URL fetch error:', error)
      return { 
        success: false, 
        error: 'Erro ao obter URL do recibo' 
      }
    }
  }

  // =====================================================
  // WEBHOOK PROCESSING
  // =====================================================

  /**
   * Process Stripe webhook event
   * This would typically be called from a webhook endpoint
   */
  static async processWebhookEvent(eventType: string, eventData: any): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      switch (eventType) {
        case 'customer.subscription.updated':
          // Update subscription status from Stripe
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: eventData.status,
              current_period_start: new Date(eventData.current_period_start * 1000).toISOString(),
              current_period_end: new Date(eventData.current_period_end * 1000).toISOString(),
              stripe_subscription_id: eventData.id
            })
            .eq('stripe_subscription_id', eventData.id)

          if (updateError) throw updateError
          break

        case 'invoice.payment_succeeded':
          // Add to billing history
          const { error: billingError } = await supabase
            .from('billing_history')
            .insert({
              user_id: eventData.customer, // This needs to be mapped from Stripe customer ID
              stripe_invoice_id: eventData.id,
              amount_brl: eventData.amount_paid / 100, // Convert from cents
              status: 'paid',
              billing_date: new Date(eventData.created * 1000).toISOString(),
              paid_at: new Date().toISOString(),
              description: eventData.description || 'Pagamento de assinatura',
              invoice_url: eventData.invoice_pdf,
              receipt_url: eventData.receipt_url
            })

          if (billingError) throw billingError
          break

        default:
          console.log('Unhandled webhook event:', eventType)
      }

      return { success: true }

    } catch (error) {
      console.error('Webhook processing error:', error)
      return { 
        success: false, 
        error: 'Erro ao processar evento do webhook' 
      }
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Update subscription credits usage
   */
  static async updateCreditsUsage(userId: string, creditsUsed: number): Promise<SubscriptionResponse> {
    try {
      const supabase = createClientComponentClient()

      const { error } = await supabase
        .from('subscriptions')
        .update({
          credits_used: creditsUsed
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating credits usage:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('Credits usage update error:', error)
      return { 
        success: false, 
        error: 'Erro ao atualizar uso de créditos' 
      }
    }
  }

  /**
   * Check if user has reached credits limit
   */
  static async checkCreditsLimit(userId: string): Promise<SubscriptionResponse<{ canUse: boolean, remaining: number }>> {
    try {
      const subscriptionResponse = await this.getUserSubscription(userId)
      
      if (!subscriptionResponse.success || !subscriptionResponse.data) {
        return { success: false, error: 'Assinatura não encontrada' }
      }

      const subscription = subscriptionResponse.data
      const planResponse = await this.getSubscriptionPlan(subscription.plan_id)
      
      if (!planResponse.success || !planResponse.data) {
        return { success: false, error: 'Plano não encontrado' }
      }

      const plan = planResponse.data
      const remaining = Math.max(0, plan.credits_limit - subscription.credits_used)
      const canUse = remaining > 0 || plan.credits_limit === 0 // 0 = unlimited

      return { 
        success: true, 
        data: { canUse, remaining }
      }

    } catch (error) {
      console.error('Credits limit check error:', error)
      return { 
        success: false, 
        error: 'Erro ao verificar limite de créditos' 
      }
    }
  }
}

export default SubscriptionService