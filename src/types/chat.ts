export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_used?: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  message_count?: number;
  last_message_at?: string;
}

export interface CreateConversationRequest {
  title: string;
  initial_message?: string;
}

export interface UpdateConversationRequest {
  title?: string;
}

export interface CreateMessageRequest {
  conversation_id: string;
  role: MessageRole;
  content: string;
}

export interface StreamingMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  is_streaming: boolean;
  partial_content?: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export interface ConversationListItem {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isActive: boolean;
}

export interface ChatInputState {
  value: string;
  isFocused: boolean;
  isSearchEnabled: boolean;
  attachments: File[];
}

export interface UserCredits {
  current: number;
  total: number;
  percentage: number;
  renewal_date: string;
}

export interface ChatServiceResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  conversation_id: string;
}

export interface AIResponseOptions {
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface StreamResponse {
  id: string;
  content: string;
  finished: boolean;
  tokens_used?: number;
}

export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_TITLE_LENGTH: 100,
  DEFAULT_CONVERSATION_TITLE: 'Nova Conversa',
  MESSAGES_PER_PAGE: 50,
  SIDEBAR_WIDTH_DESKTOP: 320,
  MOBILE_BREAKPOINT: 768,
  AUTO_SCROLL_THRESHOLD: 100,
  TYPING_INDICATOR_DELAY: 2000,
  MESSAGE_FADE_DURATION: 400,
} as const;

export const CHAT_ERRORS = {
  CONVERSATION_NOT_FOUND: 'Conversa não encontrada',
  MESSAGE_TOO_LONG: 'Mensagem muito longa',
  INSUFFICIENT_CREDITS: 'Créditos insuficientes',
  NETWORK_ERROR: 'Erro de conexão',
  AI_SERVICE_ERROR: 'Erro no serviço de IA',
  UNAUTHORIZED: 'Não autorizado',
} as const;

export const PORTUGUESE_MESSAGES = {
  NEW_CONVERSATION: 'Nova Conversa',
  WELCOME_MESSAGE: 'Pode começar! Sobre o que vamos conversar?',
  INITIAL_GREETING: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?',
  THINKING: 'Pensando...',
  TYPING_PLACEHOLDER: 'Converse com a IA...',
  RENAME_CONVERSATION: 'Renomear',
  DELETE_CONVERSATION: 'Excluir',
  CONFIRM_DELETE_TITLE: 'Excluir Conversa',
  CONFIRM_DELETE_MESSAGE: 'Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.',
  CANCEL: 'Cancelar',
  DELETE: 'Excluir',
  NO_CONVERSATIONS: 'Inicie uma nova conversa para começar.',
  CONVERSATIONS: 'Conversas',
  CLOSE_MENU: 'Fechar Menu',
  OPEN_MENU: 'Abrir Menu',
  BACK: 'Voltar',
  NOTIFICATIONS: 'Notificações',
  PROFILE_MENU: 'Menu do Perfil',
  MY_PROFILE: 'Meu Perfil',
  MONTHLY_CREDITS: 'Créditos Mensais',
  CREDITS_INFO: 'Seus créditos são usados para conversas e se renovam a cada 24h. Precisa de mais?',
  BECOME_MAESTRO: 'Torne-se um Maestro',
  UNLIMITED_ACCESS: 'para ter acesso ilimitado.',
  MANAGE_SUBSCRIPTION: 'Gerenciar Assinatura',
  SETTINGS: 'Configurações',
  LOGOUT: 'Sair da Conta',
  SEARCH: 'Search',
  ATTACHMENT: 'Anexar arquivo',
  SEND_MESSAGE: 'Enviar mensagem',
} as const;