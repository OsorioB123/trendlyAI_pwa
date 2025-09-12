// =====================================================
// MOCK DATA FOR HELP CENTER DEVELOPMENT
// Used for testing UI without real Supabase data
// =====================================================

import type { 
  FAQCategory,
  FAQItem,
  SupportTicket,
  SupportMessage,
  MockHelpData
} from '../../types/help'

/**
 * Mock FAQ categories
 */
export const mockFAQCategories: FAQCategory[] = [
  {
    id: 'cat-primeiros-passos',
    slug: 'primeiros-passos',
    name: 'Primeiros Passos',
    description: 'Como começar a usar a TrendlyAI',
    icon: 'Rocket',
    sort_order: 1,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 'cat-assinatura',
    slug: 'assinatura',
    name: 'Assinatura',
    description: 'Dúvidas sobre planos e pagamentos',
    icon: 'Gem',
    sort_order: 2,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 'cat-ferramentas',
    slug: 'ferramentas',
    name: 'Ferramentas',
    description: 'Como usar as ferramentas de IA',
    icon: 'Zap',
    sort_order: 3,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 'cat-tecnico',
    slug: 'tecnico',
    name: 'Questões Técnicas',
    description: 'Problemas técnicos e suporte',
    icon: 'HardDrive',
    sort_order: 4,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  }
]

/**
 * Mock FAQ items
 */
export const mockFAQItems: FAQItem[] = [
  // Primeiros Passos
  {
    id: 'faq-1',
    category_id: 'cat-primeiros-passos',
    category: mockFAQCategories[0],
    question: 'O que é a TrendlyAI?',
    answer: 'TrendlyAI é sua orquestra de inteligência artificial para criação de conteúdo. Combinamos ferramentas de IA, trilhas de aprendizado e a assistente Salina para ajudar você a criar conteúdo de alta performance de forma mais rápida e estratégica.',
    sort_order: 1,
    is_featured: true,
    is_active: true,
    tags: ['introdução', 'conceito', 'salina'],
    view_count: 1250,
    helpful_count: 89,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-2',
    category_id: 'cat-primeiros-passos',
    category: mockFAQCategories[0],
    question: 'Como começo a usar as ferramentas?',
    answer: 'A melhor forma de começar é pela Home. Você pode conversar diretamente com a Salina sobre o que deseja criar ou explorar as "Ferramentas recomendadas". Cada ferramenta possui um prompt pronto para uso que você pode abrir, editar e copiar com um clique.',
    sort_order: 2,
    is_featured: false,
    is_active: true,
    tags: ['começar', 'ferramentas', 'home'],
    view_count: 892,
    helpful_count: 67,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-3',
    category_id: 'cat-primeiros-passos',
    category: mockFAQCategories[0],
    question: 'O que são as Trilhas?',
    answer: 'As Trilhas são jornadas de aprendizado guiadas que combinam teoria e prática. Elas ensinam conceitos de marketing e criação de conteúdo, e integram as ferramentas da TrendlyAI para você aplicar o conhecimento imediatamente.',
    sort_order: 3,
    is_featured: false,
    is_active: true,
    tags: ['trilhas', 'aprendizado', 'marketing'],
    view_count: 743,
    helpful_count: 54,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },

  // Assinatura
  {
    id: 'faq-4',
    category_id: 'cat-assinatura',
    category: mockFAQCategories[1],
    question: 'Como funciona o cancelamento?',
    answer: 'Você pode cancelar sua assinatura a qualquer momento através do seu painel de "Gerenciar Assinatura" no menu do seu perfil. O acesso permanecerá ativo até o final do período já pago.',
    sort_order: 1,
    is_featured: true,
    is_active: true,
    tags: ['cancelamento', 'assinatura', 'perfil'],
    view_count: 567,
    helpful_count: 43,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-5',
    category_id: 'cat-assinatura',
    category: mockFAQCategories[1],
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos os principais cartões de crédito (Visa, MasterCard, American Express) e PIX para planos anuais. Todo o processamento é feito de forma segura por nosso parceiro de pagamentos.',
    sort_order: 2,
    is_featured: false,
    is_active: true,
    tags: ['pagamento', 'cartão', 'pix'],
    view_count: 445,
    helpful_count: 38,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-6',
    category_id: 'cat-assinatura',
    category: mockFAQCategories[1],
    question: 'Posso trocar de plano depois?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas no próximo ciclo de cobrança, exceto para upgrades que são aplicados imediatamente.',
    sort_order: 3,
    is_featured: false,
    is_active: true,
    tags: ['trocar', 'plano', 'upgrade'],
    view_count: 332,
    helpful_count: 29,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },

  // Ferramentas
  {
    id: 'faq-7',
    category_id: 'cat-ferramentas',
    category: mockFAQCategories[2],
    question: 'Como uso os prompts das ferramentas?',
    answer: 'Cada ferramenta tem um prompt otimizado que você pode visualizar, editar e copiar. Clique em "Abrir ferramenta", personalize os campos necessários e depois copie o prompt para usar no ChatGPT, Claude ou qualquer IA de sua preferência.',
    sort_order: 1,
    is_featured: true,
    is_active: true,
    tags: ['prompts', 'ferramentas', 'copiar'],
    view_count: 923,
    helpful_count: 72,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-8',
    category_id: 'cat-ferramentas',
    category: mockFAQCategories[2],
    question: 'Posso salvar meus trabalhos?',
    answer: 'Sim! Você pode salvar seus prompts personalizados e resultados na sua biblioteca pessoal. Isso permite reutilizar estratégias que funcionaram bem e manter um histórico dos seus melhores conteúdos.',
    sort_order: 2,
    is_featured: false,
    is_active: true,
    tags: ['salvar', 'biblioteca', 'histórico'],
    view_count: 678,
    helpful_count: 51,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-9',
    category_id: 'cat-ferramentas',
    category: mockFAQCategories[2],
    question: 'Quantas ferramentas estão disponíveis?',
    answer: 'Temos mais de 50 ferramentas organizadas por categorias como redes sociais, e-mail marketing, copywriting, storytelling e análise de tendências. Adicionamos novas ferramentas regularmente baseadas no feedback dos usuários.',
    sort_order: 3,
    is_featured: false,
    is_active: true,
    tags: ['quantidade', 'categorias', 'novas'],
    view_count: 512,
    helpful_count: 41,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },

  // Técnico
  {
    id: 'faq-10',
    category_id: 'cat-tecnico',
    category: mockFAQCategories[3],
    question: 'A plataforma funciona no celular?',
    answer: 'Sim! A TrendlyAI é totalmente responsiva e funciona perfeitamente em todos os dispositivos. Você pode acessar ferramentas, trilhas e conversar com a Salina tanto no computador quanto no smartphone.',
    sort_order: 1,
    is_featured: true,
    is_active: true,
    tags: ['celular', 'responsivo', 'mobile'],
    view_count: 789,
    helpful_count: 63,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-11',
    category_id: 'cat-tecnico',
    category: mockFAQCategories[3],
    question: 'Meus dados estão seguros?',
    answer: 'Absolutamente. Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da indústria. Seus dados nunca são compartilhados com terceiros e você pode deletar sua conta a qualquer momento.',
    sort_order: 2,
    is_featured: false,
    is_active: true,
    tags: ['segurança', 'dados', 'privacidade'],
    view_count: 634,
    helpful_count: 48,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  },
  {
    id: 'faq-12',
    category_id: 'cat-tecnico',
    category: mockFAQCategories[3],
    question: 'Posso usar offline?',
    answer: 'A TrendlyAI requer conexão com a internet para funcionar, pois depende de IA em tempo real. Porém, você pode copiar e salvar localmente os prompts e resultados para usar offline posteriormente.',
    sort_order: 3,
    is_featured: false,
    is_active: true,
    tags: ['offline', 'internet', 'local'],
    view_count: 423,
    helpful_count: 32,
    metadata: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2025-01-10')
  }
]

/**
 * Mock support tickets
 */
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    user_id: 'user-123',
    subject: 'Problema com carregamento de ferramentas',
    description: 'Olá, estou tendo dificuldades para carregar as ferramentas de copywriting. Quando clico em "Abrir ferramenta", a página fica em loading indefinidamente. Podem me ajudar?',
    status: 'in_progress',
    priority: 'normal',
    category: 'technical',
    first_response_at: new Date('2025-01-14T10:30:00Z'),
    metadata: {
      browser: 'Chrome',
      os: 'Windows 11'
    },
    created_at: new Date('2025-01-13T14:20:00Z'),
    updated_at: new Date('2025-01-14T10:30:00Z')
  },
  {
    id: 'ticket-2',
    user_id: 'user-123',
    subject: 'Dúvida sobre mudança de plano',
    description: 'Gostaria de fazer upgrade do meu plano Explorador para Mestre Criador. Como funciona a cobrança proporcional? Vou pagar a diferença imediatamente?',
    status: 'resolved',
    priority: 'low',
    category: 'billing',
    first_response_at: new Date('2025-01-12T09:15:00Z'),
    resolved_at: new Date('2025-01-12T11:45:00Z'),
    resolution: 'Explicado o processo de upgrade e cobrança proporcional. Cliente satisfeito com a resposta.',
    metadata: {},
    created_at: new Date('2025-01-12T08:30:00Z'),
    updated_at: new Date('2025-01-12T11:45:00Z')
  },
  {
    id: 'ticket-3',
    user_id: 'user-123',
    subject: 'Sugestão de nova ferramenta',
    description: 'Seria possível criar uma ferramenta específica para geração de legendas para Instagram? Algo que combine hashtags + copy + call-to-action de forma mais integrada?',
    status: 'open',
    priority: 'low',
    category: 'feature_request',
    metadata: {
      feature_type: 'tool_request'
    },
    created_at: new Date('2025-01-11T16:45:00Z'),
    updated_at: new Date('2025-01-11T16:45:00Z')
  }
]

/**
 * Mock support messages
 */
export const mockSupportMessages: SupportMessage[] = [
  {
    id: 'msg-1',
    ticket_id: 'ticket-1',
    sender_id: 'support-agent-1',
    message: 'Olá! Obrigado por entrar em contato. Vou ajudar você com esse problema de carregamento. Pode me informar qual navegador está usando e se acontece com todas as ferramentas ou apenas algumas específicas?',
    is_internal: false,
    attachments: [],
    created_at: new Date('2025-01-14T10:30:00Z')
  },
  {
    id: 'msg-2',
    ticket_id: 'ticket-1',
    sender_id: 'user-123',
    message: 'Oi, obrigado pela resposta! Estou usando Chrome na versão mais recente, Windows 11. O problema acontece principalmente com as ferramentas de copywriting, as outras categorias parecem funcionar normalmente.',
    is_internal: false,
    attachments: [],
    created_at: new Date('2025-01-14T11:15:00Z')
  },
  {
    id: 'msg-3',
    ticket_id: 'ticket-2',
    sender_id: 'support-agent-2',
    message: 'Olá! Que bom que está interessado em fazer upgrade para o plano Mestre Criador! 🎉\n\nQuando você faz upgrade, funciona assim:\n1. Você paga apenas a diferença proporcional do período restante\n2. A cobrança é feita imediatamente\n3. Seu próximo ciclo continua na mesma data\n\nPor exemplo, se você tem 15 dias restantes no seu ciclo atual, pagará apenas 50% da diferença entre os planos. É bem justo! 😊\n\nPosso ativar o upgrade para você agora mesmo se quiser!',
    is_internal: false,
    attachments: [],
    created_at: new Date('2025-01-12T09:15:00Z')
  }
]

/**
 * Complete mock help data
 */
export const mockHelpData: MockHelpData = {
  categories: mockFAQCategories,
  faqItems: mockFAQItems,
  supportTickets: mockSupportTickets,
  supportMessages: mockSupportMessages
}

/**
 * Mock help data variations for different scenarios
 */
export const mockHelpDataScenarios = {
  'default': mockHelpData,
  'empty': {
    categories: [],
    faqItems: [],
    supportTickets: [],
    supportMessages: []
  },
  'minimal': {
    categories: mockFAQCategories.slice(0, 2),
    faqItems: mockFAQItems.slice(0, 4),
    supportTickets: mockSupportTickets.slice(0, 1),
    supportMessages: mockSupportMessages.slice(0, 1)
  }
}

/**
 * Function to get mock data based on scenario
 */
export function getMockHelpData(scenario: keyof typeof mockHelpDataScenarios = 'default'): MockHelpData {
  return mockHelpDataScenarios[scenario] || mockHelpData
}

/**
 * Check if we should use mock data (development mode)
 */
export function shouldUseMockHelpData(): boolean {
  return process.env.NODE_ENV === 'development' && 
         process.env.NEXT_PUBLIC_USE_MOCK_HELP === 'true'
}

/**
 * Get mock data scenario from environment or default
 */
export function getMockHelpDataScenario(): keyof typeof mockHelpDataScenarios {
  const scenario = process.env.NEXT_PUBLIC_MOCK_HELP_SCENARIO as keyof typeof mockHelpDataScenarios
  return mockHelpDataScenarios[scenario] ? scenario : 'default'
}