// =====================================================
// MOCK DATA FOR SUBSCRIPTION DEVELOPMENT
// Used for testing UI without real Supabase/Stripe data
// =====================================================

import type { 
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  BillingHistoryItem,
  MockSubscriptionData
} from '../../types/subscription'

/**
 * Mock subscription plans
 */
export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-explorador',
    name: 'Explorador',
    description: 'Plano básico para começar sua jornada',
    price_brl: 0,
    price_usd: 0,
    billing_interval: 'month',
    credits_limit: 50,
    features: {
      basic_insights: true,
      community_support: true
    },
    is_active: true,
    stripe_price_id: 'price_1234567890',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 'plan-mestre',
    name: 'Mestre Criador',
    description: 'Plano completo para criadores profissionais',
    price_brl: 29.90,
    price_usd: 5.99,
    billing_interval: 'month',
    credits_limit: 5000,
    features: {
      unlimited_insights: true,
      priority_support: true,
      advanced_analytics: true,
      custom_templates: true
    },
    is_active: true,
    stripe_price_id: 'price_0987654321',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 'plan-mestre-anual',
    name: 'Mestre Criador Anual',
    description: 'Plano anual com desconto especial',
    price_brl: 299.00,
    price_usd: 59.99,
    billing_interval: 'year',
    credits_limit: 60000,
    features: {
      unlimited_insights: true,
      priority_support: true,
      advanced_analytics: true,
      custom_templates: true,
      annual_discount: true
    },
    is_active: true,
    stripe_price_id: 'price_1122334455',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  }
]

/**
 * Mock user subscription (active)
 */
export const mockActiveSubscription: Subscription = {
  id: 'sub-123456',
  user_id: 'user-123',
  plan_id: 'plan-mestre',
  plan: mockPlans[1], // Mestre Criador plan
  stripe_subscription_id: 'sub_1234567890abcdef',
  status: 'active',
  current_period_start: new Date('2025-01-15'),
  current_period_end: new Date('2025-02-15'),
  credits_used: 1240,
  metadata: {},
  created_at: new Date('2024-12-15'),
  updated_at: new Date('2025-01-15')
}

/**
 * Mock payment methods
 */
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-123',
    user_id: 'user-123',
    stripe_payment_method_id: 'pm_1234567890abcdef',
    type: 'credit_card',
    brand: 'Visa',
    last_four: '4532',
    exp_month: 12,
    exp_year: 2027,
    is_default: true,
    metadata: {},
    created_at: new Date('2024-12-15'),
    updated_at: new Date('2024-12-15')
  },
  {
    id: 'pm-456',
    user_id: 'user-123',
    stripe_payment_method_id: 'pm_0987654321fedcba',
    type: 'credit_card',
    brand: 'Mastercard',
    last_four: '8901',
    exp_month: 8,
    exp_year: 2026,
    is_default: false,
    metadata: {},
    created_at: new Date('2024-11-20'),
    updated_at: new Date('2024-11-20')
  }
]

/**
 * Mock billing history
 */
export const mockBillingHistory: BillingHistoryItem[] = [
  {
    id: 'bill-001',
    user_id: 'user-123',
    subscription_id: 'sub-123456',
    stripe_invoice_id: 'in_1234567890abcdef',
    amount_brl: 29.90,
    amount_usd: 5.99,
    tax_amount: 0,
    status: 'paid',
    billing_date: new Date('2025-01-15'),
    paid_at: new Date('2025-01-15'),
    description: 'Plano Mestre Criador - Mensal',
    invoice_url: 'https://example.com/invoice-001.pdf',
    receipt_url: 'https://example.com/receipt-001.pdf',
    payment_method_id: 'pm-123',
    payment_method: mockPaymentMethods[0],
    metadata: {},
    created_at: new Date('2025-01-15'),
    updated_at: new Date('2025-01-15')
  },
  {
    id: 'bill-002',
    user_id: 'user-123',
    subscription_id: 'sub-123456',
    stripe_invoice_id: 'in_0987654321fedcba',
    amount_brl: 29.90,
    amount_usd: 5.99,
    tax_amount: 0,
    status: 'paid',
    billing_date: new Date('2024-12-15'),
    paid_at: new Date('2024-12-15'),
    description: 'Plano Mestre Criador - Mensal',
    invoice_url: 'https://example.com/invoice-002.pdf',
    receipt_url: 'https://example.com/receipt-002.pdf',
    payment_method_id: 'pm-123',
    payment_method: mockPaymentMethods[0],
    metadata: {},
    created_at: new Date('2024-12-15'),
    updated_at: new Date('2024-12-15')
  },
  {
    id: 'bill-003',
    user_id: 'user-123',
    subscription_id: 'sub-123456',
    stripe_invoice_id: 'in_1122334455667788',
    amount_brl: 29.90,
    amount_usd: 5.99,
    tax_amount: 0,
    status: 'paid',
    billing_date: new Date('2024-11-15'),
    paid_at: new Date('2024-11-15'),
    description: 'Plano Mestre Criador - Mensal',
    invoice_url: 'https://example.com/invoice-003.pdf',
    receipt_url: 'https://example.com/receipt-003.pdf',
    payment_method_id: 'pm-123',
    payment_method: mockPaymentMethods[0],
    metadata: {},
    created_at: new Date('2024-11-15'),
    updated_at: new Date('2024-11-15')
  }
]

/**
 * Complete mock subscription data
 */
export const mockSubscriptionData: MockSubscriptionData = {
  subscription: mockActiveSubscription,
  plans: mockPlans,
  paymentMethods: mockPaymentMethods,
  billingHistory: mockBillingHistory
}

/**
 * Mock subscription variations for different scenarios
 */
export const mockPausedSubscription: Subscription = {
  ...mockActiveSubscription,
  id: 'sub-paused',
  status: 'paused',
  pause_until: new Date('2025-04-15'),
  metadata: { pause_reason: 'Férias' }
}

export const mockCanceledSubscription: Subscription = {
  ...mockActiveSubscription,
  id: 'sub-canceled',
  status: 'canceled',
  canceled_at: new Date('2025-01-10'),
  metadata: { 
    cancel_reason: 'Não preciso mais',
    feedback: 'Produto muito bom, mas não tenho tempo para usar agora.'
  }
}

export const mockFreeSubscription: Subscription = {
  id: 'sub-free',
  user_id: 'user-123',
  plan_id: 'plan-explorador',
  plan: mockPlans[0], // Explorador plan
  status: 'active',
  current_period_start: new Date('2025-01-01'),
  current_period_end: new Date('2025-02-01'),
  credits_used: 35,
  metadata: {},
  created_at: new Date('2025-01-01'),
  updated_at: new Date('2025-01-01')
}

/**
 * Function to get mock data based on scenario
 */
export function getMockSubscriptionData(scenario: 'active' | 'paused' | 'canceled' | 'free' = 'active'): MockSubscriptionData {
  let subscription: Subscription

  switch (scenario) {
    case 'paused':
      subscription = mockPausedSubscription
      break
    case 'canceled':
      subscription = mockCanceledSubscription
      break
    case 'free':
      subscription = mockFreeSubscription
      break
    default:
      subscription = mockActiveSubscription
  }

  return {
    subscription,
    plans: mockPlans,
    paymentMethods: scenario === 'free' ? [] : mockPaymentMethods,
    billingHistory: scenario === 'free' ? [] : mockBillingHistory
  }
}

/**
 * Check if we should use mock data (development mode)
 */
export function shouldUseMockData(): boolean {
  return process.env.NODE_ENV === 'development' && 
         process.env.NEXT_PUBLIC_USE_MOCK_SUBSCRIPTION === 'true'
}

/**
 * Get mock data scenario from environment or default
 */
export function getMockDataScenario(): 'active' | 'paused' | 'canceled' | 'free' {
  const scenario = process.env.NEXT_PUBLIC_MOCK_SUBSCRIPTION_SCENARIO as any
  return ['active', 'paused', 'canceled', 'free'].includes(scenario) ? scenario : 'active'
}