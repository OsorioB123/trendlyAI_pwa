// =====================================================
// SUBSCRIPTION TYPE DEFINITIONS FOR TRENDLYAI
// =====================================================

export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price_brl: number
  price_usd?: number
  billing_interval: 'month' | 'year'
  credits_limit: number
  features: Record<string, any>
  is_active: boolean
  stripe_price_id?: string
  created_at: Date
  updated_at: Date
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  plan?: SubscriptionPlan
  stripe_subscription_id?: string
  status: 'active' | 'paused' | 'canceled' | 'past_due' | 'incomplete'
  current_period_start?: Date
  current_period_end?: Date
  pause_until?: Date
  cancel_at?: Date
  canceled_at?: Date
  trial_start?: Date
  trial_end?: Date
  credits_used: number
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface PaymentMethod {
  id: string
  user_id: string
  stripe_payment_method_id?: string
  type: 'credit_card' | 'pix' | 'bank_transfer'
  brand?: string
  last_four?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface BillingHistoryItem {
  id: string
  user_id: string
  subscription_id: string
  stripe_invoice_id?: string
  amount_brl: number
  amount_usd?: number
  tax_amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  billing_date: Date
  due_date?: Date
  paid_at?: Date
  description?: string
  invoice_url?: string
  receipt_url?: string
  payment_method_id?: string
  payment_method?: PaymentMethod
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

// =====================================================
// COMPONENT PROPS INTERFACES
// =====================================================

export interface SubscriptionCardProps {
  subscription?: Subscription
  onUpgrade: () => void
  onPause: () => void
  onCancel: () => void
  onUpdatePayment: () => void
  isLoading?: boolean
}

export interface BillingHistoryProps {
  billingHistory: BillingHistoryItem[]
  onDownloadReceipt: (item: BillingHistoryItem) => void
  isLoading?: boolean
  showHistory: boolean
  onToggleHistory: () => void
}

export interface PauseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (months: number) => Promise<void>
  isLoading?: boolean
}

export interface CancelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason?: string) => Promise<void>
  subscription?: Subscription
  isLoading?: boolean
}

export interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethods: PaymentMethod[]
  onAddPaymentMethod: () => Promise<void>
  onSetDefault: (paymentMethodId: string) => Promise<void>
  onRemove: (paymentMethodId: string) => Promise<void>
  isLoading?: boolean
}

export interface PlanSelectorProps {
  plans: SubscriptionPlan[]
  currentPlan?: SubscriptionPlan
  onSelectPlan: (plan: SubscriptionPlan) => Promise<void>
  isLoading?: boolean
}

// =====================================================
// SERVICE RESPONSE INTERFACES
// =====================================================

export interface SubscriptionResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export interface PauseSubscriptionData {
  months: number
  reason?: string
}

export interface CancelSubscriptionData {
  reason?: string
  feedback?: string
}

export interface UpdatePaymentMethodData {
  payment_method_id: string
  set_as_default?: boolean
}

export interface CreateSubscriptionData {
  plan_id: string
  payment_method_id?: string
  trial_period_days?: number
}

// =====================================================
// HOOK INTERFACES
// =====================================================

export interface UseSubscriptionReturn {
  // Data
  subscription?: Subscription
  plans: SubscriptionPlan[]
  paymentMethods: PaymentMethod[]
  billingHistory: BillingHistoryItem[]
  
  // Loading states
  isLoading: boolean
  isUpdating: boolean
  
  // Error states
  error: string | null
  
  // Actions
  pauseSubscription: (data: PauseSubscriptionData) => Promise<SubscriptionResponse>
  cancelSubscription: (data: CancelSubscriptionData) => Promise<SubscriptionResponse>
  resumeSubscription: () => Promise<SubscriptionResponse>
  changeSubscription: (planId: string) => Promise<SubscriptionResponse>
  addPaymentMethod: (paymentMethodData: any) => Promise<SubscriptionResponse>
  updatePaymentMethod: (data: UpdatePaymentMethodData) => Promise<SubscriptionResponse>
  removePaymentMethod: (paymentMethodId: string) => Promise<SubscriptionResponse>
  downloadReceipt: (billingId: string) => Promise<SubscriptionResponse<string>>
  
  // Refresh data
  refetch: () => Promise<void>
}

// =====================================================
// VALIDATION AND CONSTANTS
// =====================================================

export const SUBSCRIPTION_STATUS_LABELS = {
  active: 'Ativa',
  paused: 'Pausada',
  canceled: 'Cancelada',
  past_due: 'Vencida',
  incomplete: 'Incompleta'
} as const

export const PAYMENT_METHOD_LABELS = {
  credit_card: 'Cartão de Crédito',
  pix: 'PIX',
  bank_transfer: 'Transferência Bancária'
} as const

export const BILLING_STATUS_LABELS = {
  pending: 'Pendente',
  paid: 'Pago',
  failed: 'Falhado',
  refunded: 'Reembolsado'
} as const

export const PLAN_FEATURES = {
  unlimited_insights: 'Insights Ilimitados',
  priority_support: 'Suporte Prioritário',
  advanced_analytics: 'Analytics Avançados',
  custom_templates: 'Templates Personalizados',
  annual_discount: 'Desconto Anual',
  basic_insights: 'Insights Básicos',
  community_support: 'Suporte da Comunidade'
} as const

// =====================================================
// UTILITY TYPES
// =====================================================

export type SubscriptionStatus = Subscription['status']
export type PaymentMethodType = PaymentMethod['type']
export type BillingStatus = BillingHistoryItem['status']
export type BillingInterval = SubscriptionPlan['billing_interval']

// =====================================================
// STRIPE INTEGRATION TYPES
// =====================================================

export interface StripePaymentIntent {
  id: string
  client_secret: string
  status: string
  amount: number
  currency: string
}

export interface StripeSubscriptionUpdate {
  subscription_id: string
  price_id?: string
  payment_method_id?: string
  proration_behavior?: 'create_prorations' | 'none'
}

export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: any
  }
  created: number
}

// =====================================================
// MOCK DATA INTERFACES (for development)
// =====================================================

export interface MockSubscriptionData {
  subscription: Subscription
  plans: SubscriptionPlan[]
  paymentMethods: PaymentMethod[]
  billingHistory: BillingHistoryItem[]
}

// =====================================================
// BRAZILIAN PAYMENT SPECIFIC TYPES
// =====================================================

export interface PixPaymentData {
  pix_key?: string
  qr_code?: string
  qr_code_url?: string
  expires_at?: Date
}

export interface BrazilianTaxData {
  cpf?: string
  cnpj?: string
  tax_id?: string
  tax_amount: number
  tax_rate: number
}

export interface BrazilianBillingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}