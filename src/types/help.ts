// =====================================================
// HELP CENTER TYPE DEFINITIONS FOR TRENDLYAI
// =====================================================

export interface FAQCategory {
  id: string
  slug: string
  name: string
  description?: string
  icon?: string
  sort_order: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface FAQItem {
  id: string
  category_id: string
  category?: FAQCategory
  question: string
  answer: string
  sort_order: number
  is_featured: boolean
  is_active: boolean
  tags: string[]
  view_count: number
  helpful_count: number
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface SupportTicket {
  id: string
  user_id?: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category?: string
  assigned_to?: string
  resolution?: string
  first_response_at?: Date
  resolved_at?: Date
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface SupportMessage {
  id: string
  ticket_id: string
  sender_id?: string
  message: string
  is_internal: boolean
  attachments: any[]
  created_at: Date
}

// =====================================================
// COMPONENT PROPS INTERFACES
// =====================================================

export interface FAQTabsProps {
  categories: FAQCategory[]
  activeTab: string
  onTabChange: (tabId: string) => void
  isLoading?: boolean
}

export interface FAQAccordionProps {
  items: FAQItem[]
  openItem: string | null
  onItemToggle: (questionId: string) => void
  onItemView?: (itemId: string) => void
  isLoading?: boolean
}

export interface FAQItemProps {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  onView?: () => void
}

export interface SalinaReminderProps {
  onChatClick: () => void
  className?: string
}

export interface SupportContactProps {
  onOpenChatWidget: () => void
  className?: string
}

export interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage: (message: string) => Promise<void>
  messages: SupportMessage[]
  isLoading?: boolean
}

export interface HelpSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

// =====================================================
// SERVICE RESPONSE INTERFACES
// =====================================================

export interface HelpResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export interface SearchFAQData {
  query: string
  category?: string
  limit?: number
}

export interface CreateSupportTicketData {
  subject: string
  description: string
  category?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

export interface AddSupportMessageData {
  ticket_id: string
  message: string
  attachments?: any[]
}

export interface FAQViewData {
  item_id: string
}

export interface FAQHelpfulData {
  item_id: string
  helpful: boolean
}

// =====================================================
// HOOK INTERFACES
// =====================================================

export interface UseHelpReturn {
  // Data
  categories: FAQCategory[]
  faqItems: FAQItem[]
  currentCategory?: FAQCategory
  supportTickets: SupportTicket[]
  
  // Loading states
  isLoading: boolean
  isSearching: boolean
  isSendingMessage: boolean
  
  // Error states
  error: string | null
  
  // FAQ Actions
  loadCategories: () => Promise<HelpResponse<FAQCategory[]>>
  loadFAQItems: (categoryId: string) => Promise<HelpResponse<FAQItem[]>>
  searchFAQ: (data: SearchFAQData) => Promise<HelpResponse<FAQItem[]>>
  markFAQViewed: (itemId: string) => Promise<HelpResponse>
  markFAQHelpful: (data: FAQHelpfulData) => Promise<HelpResponse>
  
  // Support Actions
  createSupportTicket: (data: CreateSupportTicketData) => Promise<HelpResponse<SupportTicket>>
  getUserSupportTickets: () => Promise<HelpResponse<SupportTicket[]>>
  addSupportMessage: (data: AddSupportMessageData) => Promise<HelpResponse<SupportMessage>>
  
  // UI State Actions
  setActiveCategory: (categorySlug: string) => void
  setSearchResults: (items: FAQItem[]) => void
  clearError: () => void
  
  // Refresh data
  refetch: () => Promise<void>
}

// =====================================================
// VALIDATION AND CONSTANTS
// =====================================================

export const FAQ_CATEGORY_ICONS = {
  'primeiros-passos': 'Rocket',
  'assinatura': 'Gem', 
  'ferramentas': 'Zap',
  'tecnico': 'HardDrive'
} as const

export const FAQ_CATEGORY_LABELS = {
  'primeiros-passos': 'Primeiros Passos',
  'assinatura': 'Assinatura',
  'ferramentas': 'Ferramentas', 
  'tecnico': 'Questões Técnicas'
} as const

export const SUPPORT_TICKET_STATUS_LABELS = {
  open: 'Aberto',
  in_progress: 'Em Andamento',
  waiting_user: 'Aguardando Usuário',
  resolved: 'Resolvido',
  closed: 'Fechado'
} as const

export const SUPPORT_TICKET_PRIORITY_LABELS = {
  low: 'Baixa',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente'
} as const

export const SUPPORT_TICKET_PRIORITY_COLORS = {
  low: 'text-gray-500',
  normal: 'text-blue-500', 
  high: 'text-orange-500',
  urgent: 'text-red-500'
} as const

// =====================================================
// UTILITY TYPES
// =====================================================

export type FAQCategorySlug = 'primeiros-passos' | 'assinatura' | 'ferramentas' | 'tecnico'
export type SupportTicketStatus = SupportTicket['status']
export type SupportTicketPriority = SupportTicket['priority']

// =====================================================
// MOCK DATA INTERFACES (for development)
// =====================================================

export interface MockHelpData {
  categories: FAQCategory[]
  faqItems: FAQItem[]
  supportTickets: SupportTicket[]
  supportMessages: SupportMessage[]
}

// =====================================================
// SEARCH AND FILTERING INTERFACES
// =====================================================

export interface FAQSearchFilters {
  query?: string
  category?: string
  featured?: boolean
  tags?: string[]
}

export interface FAQSearchResult extends FAQItem {
  relevanceScore?: number
  matchedFields?: string[]
}

// =====================================================
// ANALYTICS INTERFACES
// =====================================================

export interface FAQAnalytics {
  most_viewed: FAQItem[]
  most_helpful: FAQItem[]
  search_queries: { query: string; count: number; results: number }[]
  category_popularity: { category: FAQCategory; view_count: number }[]
}

export interface SupportAnalytics {
  ticket_count_by_status: Record<SupportTicketStatus, number>
  average_response_time: number
  resolution_rate: number
  satisfaction_rating: number
}

// =====================================================
// CHAT WIDGET SPECIFIC INTERFACES
// =====================================================

export interface ChatWidgetMessage {
  id: string
  type: 'user' | 'system' | 'support'
  content: string
  timestamp: Date
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface ChatWidgetState {
  isOpen: boolean
  isConnected: boolean
  isTyping: boolean
  messages: ChatWidgetMessage[]
  currentTicket?: SupportTicket
}

// =====================================================
// API ENDPOINT INTERFACES
// =====================================================

export interface FAQEndpoints {
  getCategories: () => string
  getFAQItems: (categoryId: string) => string
  searchFAQ: () => string
  viewFAQ: (itemId: string) => string
  markHelpful: (itemId: string) => string
}

export interface SupportEndpoints {
  createTicket: () => string
  getTickets: (userId: string) => string
  getTicket: (ticketId: string) => string
  addMessage: (ticketId: string) => string
  getMessages: (ticketId: string) => string
}

// =====================================================
// ERROR HANDLING INTERFACES
// =====================================================

export interface HelpErrorCode {
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND'
  FAQ_ITEM_NOT_FOUND: 'FAQ_ITEM_NOT_FOUND'
  SEARCH_FAILED: 'SEARCH_FAILED'
  TICKET_CREATE_FAILED: 'TICKET_CREATE_FAILED'
  TICKET_NOT_FOUND: 'TICKET_NOT_FOUND'
  MESSAGE_SEND_FAILED: 'MESSAGE_SEND_FAILED'
  UNAUTHORIZED: 'UNAUTHORIZED'
  NETWORK_ERROR: 'NETWORK_ERROR'
}

export interface HelpError {
  code: keyof HelpErrorCode
  message: string
  details?: any
}

// =====================================================
// FORM VALIDATION INTERFACES
// =====================================================

export interface SupportTicketFormData {
  subject: string
  description: string
  category?: string
  priority: SupportTicketPriority
}

export interface SupportTicketFormErrors {
  subject?: string
  description?: string
  category?: string
  priority?: string
}

export interface ChatMessageFormData {
  message: string
  attachments?: File[]
}

export interface ChatMessageFormErrors {
  message?: string
  attachments?: string
}