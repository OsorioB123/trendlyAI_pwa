'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { respectReducedMotion } from '@/lib/motion'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  Rocket, 
  Gem, 
  Zap, 
  HardDrive,
  ChevronDown,
  Headphones,
  X
} from 'lucide-react'
import { useBackground } from '../../contexts/BackgroundContext'
import { useHelp } from '../../hooks/useHelp'
import Header from '../../components/layout/Header'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'
import { HeaderVariant } from '../../types/header'
import type { FAQItem } from '../../types/help'

export default function HelpPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const helpData = useHelp('primeiros-passos')
  const {
    setActiveCategory,
    markFAQViewed,
    searchFAQ,
    createSupportTicket,
    isLoading,
    isSearching,
    error: helpError,
    refetch,
    faqItems
  } = helpData
  const transitionSafe = respectReducedMotion({ transition: { duration: 0.3 } }).transition as any
  
  // Local state for UI
  const [activeTab, setActiveTab] = useState('primeiros-passos')
  const [openAccordion, setOpenAccordion] = useState<string | null>('O que é a TrendlyAI?')
  const [showChatWidget, setShowChatWidget] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDescription, setTicketDescription] = useState('')
  const [ticketPriority, setTicketPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')
  const [ticketFeedback, setTicketFeedback] = useState<string | null>(null)

  // Update FAQ items when active tab changes
  useEffect(() => {
    if (activeTab && setActiveCategory) {
      setActiveCategory(activeTab)
    }
  }, [activeTab, setActiveCategory])

  // Tab configuration
  const tabs = [
    { id: 'primeiros-passos', label: 'Primeiros Passos', icon: Rocket },
    { id: 'assinatura', label: 'Assinatura', icon: Gem },
    { id: 'ferramentas', label: 'Ferramentas', icon: Zap },
    { id: 'tecnico', label: 'Questões Técnicas', icon: HardDrive }
  ]

  const handleAccordionClick = (question: string) => {
    setOpenAccordion(openAccordion === question ? null : question)
  }

  const handleSalinaClick = () => {
    // Navigate to chat page (assuming it exists)
    router.push('/chat')
  }

  const openChatWidget = () => {
    setShowChatWidget(true)
  }

  const closeChatWidget = () => {
    setShowChatWidget(false)
  }

  const handleFAQItemClick = async (item: FAQItem) => {
    // Mark FAQ as viewed
    if (markFAQViewed) {
      await markFAQViewed(item.id)
    }
    
    // Toggle accordion
    handleAccordionClick(item.question)
  }

  // Search handler
  const handleSearch = async () => {
    const query = searchQuery.trim()
    if (searchFAQ) {
      await searchFAQ({ query, category: activeTab })
    }
  }

  // Create ticket handler
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setTicketFeedback(null)
    const subject = ticketSubject.trim()
    const description = ticketDescription.trim()
    if (!subject || !description) {
      setTicketFeedback('Preencha assunto e descrição.')
      return
    }
    if (!createSupportTicket) {
      setTicketFeedback('Função de ticket indisponível no momento.')
      return
    }

    const { success, error } = await createSupportTicket({
      subject,
      description,
      category: activeTab,
      priority: ticketPriority,
    })
    if (success) {
      setTicketFeedback('Ticket criado com sucesso!')
      setTicketSubject('')
      setTicketDescription('')
      setTicketPriority('normal')
      setTimeout(() => setShowCreateTicket(false), 800)
    } else {
      setTicketFeedback(error || 'Erro ao criar ticket')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
        }}
      >
        <BackgroundOverlay />
        <Header variant={HeaderVariant.SECONDARY} />
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Carregando Central de Ajuda...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <BackgroundOverlay />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }}></div>

      <main className="w-full mx-auto pb-32">
        <div className="max-w-5xl relative mr-auto ml-auto px-4 space-y-28">

          {/* Search Bar + Create Ticket */}
          <section>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                  placeholder="Busque por palavras-chave (ex.: trilhas, ferramentas, assinatura)"
                  className="w-full h-12 px-4 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-gray-100 disabled:opacity-50"
                >
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              <button
                onClick={() => setShowCreateTicket(true)}
                className="h-12 px-5 rounded-xl bg-white/10 text-white hover:bg-white/15"
              >
                Criar ticket
              </button>
            </div>
          </section>

          {/* Salina Reminder Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitionSafe}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"></div>
              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-400">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center rounded-full bg-white/5">
                    <Sparkles className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight font-geist">
                      A Salina é sua primeira guia.
                    </h2>
                    <p className="text-white/70 mb-6 max-w-prose">
                      Para dúvidas sobre estratégias, ideias ou como usar uma ferramenta, comece uma conversa com a Salina na Home. Ela tem acesso a todo o nosso conhecimento.
                    </p>
                    <button 
                      onClick={handleSalinaClick}
                      className="bg-white text-black rounded-full px-8 py-3 font-semibold hover:bg-gray-100 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                    >
                      Falar com a Salina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...(transitionSafe || {}), delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 lg:items-start">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1">
                <nav className="flex flex-col gap-1 relative">
                  <div 
                    className="absolute left-0 w-full h-12 bg-white/8 rounded-lg transition-all duration-300"
                    style={{
                      transform: `translateY(${tabs.findIndex(tab => tab.id === activeTab) * 48}px)`
                    }}
                  />
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        disabled={isLoading}
                        className={`relative z-10 flex items-center gap-3 px-4 py-3 font-medium transition-colors disabled:opacity-50 ${
                          activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                {helpError ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                    <p className="text-red-400 text-sm">{helpError}</p>
                    <button 
                      onClick={refetch}
                      className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqItems.map((item) => (
                      <div key={item.id} className="last:border-b-0">
                        <button
                          type="button"
                          id={`faq-toggle-${item.id}`}
                          aria-expanded={openAccordion === item.question}
                          aria-controls={`faq-panel-${item.id}`}
                          onClick={() => handleFAQItemClick(item)}
                          className="w-full flex justify-between items-center text-left py-5 hover:bg-white/5 transition-colors rounded-lg px-2"
                        >
                          <span className="font-semibold text-lg text-white pr-4">
                            {item.question}
                          </span>
                          <ChevronDown 
                            className={`w-6 h-6 text-white/60 transition-transform duration-300 flex-shrink-0 ${
                              openAccordion === item.question ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        <div 
                          id={`faq-panel-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-toggle-${item.id}`}
                          className={`overflow-hidden transition-all duration-500 ${
                            openAccordion === item.question ? 'max-h-96 pb-5' : 'max-h-0'
                          }`}
                        >
                          <div className="px-2 text-white/80 leading-relaxed">
                            {item.answer}
                            {item.is_featured && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                                <Sparkles className="w-3 h-3" />
                                <span>Pergunta em destaque</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

            {faqItems.length === 0 && !isLoading && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                          <Headphones className="w-8 h-8 text-white/40" />
                        </div>
                        <p className="text-white/60 mb-2">Nenhuma pergunta encontrada</p>
                        <p className="text-white/40 text-sm">Selecione uma categoria ou entre em contato conosco</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Contact Support Section */}
          <motion.section
            className="text-center pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...(transitionSafe || {}), delay: 0.2 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight font-geist">
              Não encontrou o que procurava?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Nossa equipe de especialistas está aqui para ajudar com qualquer questão que a Salina não possa resolver. Fale diretamente conosco.
            </p>
            <button 
              onClick={openChatWidget}
              className="bg-white text-black rounded-full px-8 py-3 font-semibold hover:bg-gray-100 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
            >
              Iniciar Conversa com um Especialista
            </button>
          </motion.section>
        </div>
      </main>

      {/* Chat Widget */}
      {showChatWidget && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/8 backdrop-blur-lg rounded-2xl relative w-full max-w-sm h-[60vh] flex flex-col">
            {/* Widget Header */}
            <div className="flex-shrink-0 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">Suporte TrendlyAI</h3>
                <p className="text-xs text-white/60">Normalmente respondemos em 5 minutos.</p>
              </div>
              <button 
                onClick={closeChatWidget}
                className="text-white/60 hover:text-white bg-white/10 backdrop-blur-md rounded-full w-11 h-11 flex items-center justify-center hover:bg-white/15 transition-all"
                aria-label="Fechar conversa de suporte"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Widget Content */}
            <div className="flex-grow p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-md p-3">
                    <p className="text-sm text-white/90">Olá! Como podemos ajudar você hoje? 👋</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Widget Input */}
            <div className="flex-shrink-0 p-4">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                aria-label="Mensagem para o suporte"
                className="w-full bg-white/10 rounded-full p-3 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateTicket(false)} />
          <form 
            onSubmit={handleCreateTicket}
            className="relative bg-white/8 backdrop-blur-lg rounded-2xl w-full max-w-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novo Ticket de Suporte</h3>
              <button type="button" onClick={() => setShowCreateTicket(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-sm text-white/70 mb-2">Assunto</label>
            <input
              type="text"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 focus:outline-none"
              placeholder="Descreva brevemente o problema"
            />

            <label className="block text-sm text-white/70 mb-2">Descrição</label>
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              rows={5}
              className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 focus:outline-none resize-y"
              placeholder="Explique em detalhes o que aconteceu"
            />

            <div className="flex items-center gap-3 mb-4">
              <label className="block text-sm text-white/70">Prioridade</label>
              <select
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-white/10 focus:outline-none"
              >
                <option value="low" className="bg-black">Baixa</option>
                <option value="normal" className="bg-black">Normal</option>
                <option value="high" className="bg-black">Alta</option>
                <option value="urgent" className="bg-black">Urgente</option>
              </select>
            </div>

            {ticketFeedback && (
              <div className="mb-3 text-sm text-white/80">{ticketFeedback}</div>
            )}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreateTicket(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-100">
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Motion now handled via Framer Motion */}
    </div>
  )
}
