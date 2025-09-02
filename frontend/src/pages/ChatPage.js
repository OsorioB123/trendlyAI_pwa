import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  Globe, 
  Menu, 
  X, 
  Plus, 
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  MoreHorizontal,
  Edit,
  Trash2,
  Bell,
  Settings,
  HelpCircle,
  Gem,
  LogOut,
  Info,
  CheckCircle,
  Sparkles,
  Pencil
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import '../styles/chat.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBackground } = useBackground();
  
  // Chat state
  const [conversations, setConversations] = useState([
    { 
      id: Date.now(), 
      title: 'Ideias para Reels de Café', 
      messages: [
        { role: 'assistant', content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?' }
      ] 
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Sidebar state (desktop always open, only mobile toggles)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCreditsTooltip, setShowCreditsTooltip] = useState(false);
  const [conversationMenuId, setConversationMenuId] = useState(null);
  
  // Rename functionality
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  
  // Input state
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Refs
  const textareaRef = useRef(null);
  const chatAreaRef = useRef(null);
  const chatContentRef = useRef(null);

  // Handle message from HomePage
  useEffect(() => {
    const homeMessage = location.state?.message;
    if (homeMessage) {
      handleNewConversationWithMessage(homeMessage);
    }
  }, [location.state]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 52), 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [messageInput]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [conversations, activeConversationId]);

  const handleNewConversationWithMessage = (message) => {
    const newConversation = {
      id: Date.now(),
      title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
      messages: [
        { role: 'assistant', content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?' },
        { role: 'user', content: message }
      ]
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    // Simulate AI response
    setTimeout(() => {
      simulateAIResponse(newConversation.id);
    }, 1000);
  };

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: 'Nova Conversa',
      messages: [
        { role: 'assistant', content: 'Pode começar! Sobre o que vamos conversar?' }
      ]
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setIsMobileSidebarOpen(false);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setIsMobileSidebarOpen(false);
    setConversationMenuId(null);
  };

  const startRenaming = (conversationId, currentTitle) => {
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle);
    setConversationMenuId(null);
  };

  const saveRename = () => {
    if (editingTitle.trim() && editingConversationId) {
      setConversations(prev => 
        prev.map(c => c.id === editingConversationId ? { ...c, title: editingTitle.trim() } : c)
      );
    }
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const cancelRename = () => {
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const handleRenameKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveRename();
    } else if (e.key === 'Escape') {
      cancelRename();
    }
  };

  const confirmDeleteConversation = (conversationId) => {
    setConversationToDelete(conversationId);
    setShowDeleteModal(true);
    setConversationMenuId(null);
  };

  const executeDelete = () => {
    if (!conversationToDelete) return;
    
    setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
    
    if (activeConversationId === conversationToDelete) {
      const remaining = conversations.filter(c => c.id !== conversationToDelete);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        handleNewConversation();
      }
    }
    
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  const sendMessage = () => {
    const message = messageInput.trim();
    if (!message) return;
    
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation) return;
    
    // Add user message
    setConversations(prev => 
      prev.map(c => 
        c.id === activeConversationId 
          ? { ...c, messages: [...c.messages, { role: 'user', content: message }] }
          : c
      )
    );
    
    // Update conversation title if it's still "Nova Conversa"
    if (activeConversation.title === 'Nova Conversa') {
      const newTitle = message.substring(0, 30) + (message.length > 30 ? '...' : '');
      setConversations(prev => 
        prev.map(c => 
          c.id === activeConversationId 
            ? { ...c, title: newTitle }
            : c
        )
      );
    }
    
    setMessageInput('');
    simulateAIResponse(activeConversationId);
  };

  const simulateAIResponse = (conversationId) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const responses = [
        'Esta é uma resposta simulada. Integre com sua API de IA para gerar respostas reais.',
        'Ótima pergunta! Vou te ajudar com isso. Deixe-me pensar nas melhores estratégias para o seu caso...',
        'Entendo perfeitamente! Baseado no que você mencionou, posso sugerir algumas abordagens interessantes...',
        'Excelente ideia! Vamos trabalhar juntos para desenvolver isso. Aqui estão algumas sugestões...'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? { ...c, messages: [...c.messages, { role: 'assistant', content: randomResponse }] }
            : c
        )
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleSearch = () => {
    setIsSearchEnabled(!isSearchEnabled);
  };

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowProfileDropdown(false);
    setShowCreditsTooltip(false);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div 
      className="min-h-screen flex text-white font-['Inter'] antialiased"
      style={{
        backgroundImage: `url("${currentBackground.value}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Conversations Sidebar - Always visible on desktop */}
      <aside 
        className={`fixed top-0 left-0 w-[85%] sm:w-80 h-full z-50 transform transition-transform duration-300 md:relative md:transform-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="liquid-glass w-full h-full flex flex-col rounded-none md:rounded-3xl md:m-4 md:h-[calc(100vh-2rem)]">
          {/* Sidebar Header */}
          <div className="p-4 flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center h-11">
              <h3 className="text-white font-semibold tracking-tight hidden md:block">Conversas</h3>
              <h3 className="text-white font-semibold tracking-tight mt-2 md:hidden">Conversas</h3>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:hidden"
                aria-label="Fechar Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="h-px bg-white/10 rounded-full" />
          </div>

          {/* Conversations List */}
          <div className="flex-grow overflow-y-auto hide-scrollbar px-2 space-y-1">
            {conversations.length === 0 ? (
              <p className="text-center text-sm text-white/50 px-4 py-2">
                Inicie uma nova conversa para começar.
              </p>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className="relative group">
                  <button
                    onClick={() => selectConversation(conversation.id)}
                    className={`conversation-item w-full text-left p-3 flex justify-between items-center transition-all duration-200 rounded-xl ${
                      conversation.id === activeConversationId 
                        ? 'active bg-white/15' 
                        : 'hover:bg-white/8 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {editingConversationId === conversation.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={handleRenameKeyPress}
                            onBlur={saveRename}
                            className="flex-1 bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                            autoFocus
                          />
                          <button
                            onClick={saveRename}
                            className="p-1 rounded-md hover:bg-white/10 transition-colors"
                            aria-label="Salvar nome"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </button>
                        </div>
                      ) : (
                        <h4 className="font-medium text-sm text-white truncate">
                          {conversation.title}
                        </h4>
                      )}
                    </div>
                  </button>
                  
                  {/* 3-dots menu */}
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConversationMenuId(
                          conversationMenuId === conversation.id ? null : conversation.id
                        );
                      }}
                      className={`conversation-options-btn p-1 rounded-md hover:bg-white/10 transition-opacity ${
                        conversationMenuId === conversation.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                      }`}
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {conversationMenuId === conversation.id && (
                    <div className="conversation-dropdown-menu liquid-glass absolute top-full right-2 mt-1 p-2 w-40 z-10 rounded-lg opacity-100 transform scale-100 pointer-events-auto">
                      <button
                        onClick={() => startRenaming(conversation.id, conversation.title)}
                        className="dropdown-item w-full text-left flex items-center gap-2 p-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Renomear
                      </button>
                      <button
                        onClick={() => confirmDeleteConversation(conversation.id)}
                        className="dropdown-item w-full text-left flex items-center gap-2 p-2 text-sm rounded-md text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* New Conversation Button */}
          <div className="p-2 flex-shrink-0">
            <button
              onClick={handleNewConversation}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nova Conversa</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Container - Always with sidebar space on desktop */}
      <div className="flex-1 flex flex-col md:ml-80">
        {/* Chat Header */}
        <header className="fixed top-0 left-0 right-0 z-30 pt-3 pr-4 pb-3 pl-4">
          <div 
            className="max-w-7xl flex sticky top-0 z-40 mr-auto ml-auto items-center justify-between liquid-glass-header rounded-full px-5 py-3 md:ml-80"
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-11 h-11 hidden md:flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
                aria-label="Voltar"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={toggleMobileSidebar}
                className="w-11 h-11 flex md:hidden items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
                aria-label="Abrir Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/home')}
                className="flex items-center hover:opacity-80 transition-opacity"
                aria-label="Voltar para a Home"
              >
                <img 
                  src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png?w=800&q=80" 
                  alt="TrendlyAI Logo" 
                  className="h-8 w-auto object-cover"
                />
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const isOpen = showNotifications;
                    closeAllMenus();
                    if (!isOpen) setShowNotifications(true);
                  }}
                  className="relative w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
                  aria-label="Notificações"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="notification-dot absolute inline-flex h-full w-full rounded-full bg-[#2fd159] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2fd159]" />
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="dropdown-menu show liquid-glass-opaque absolute top-full right-0 mt-2 p-2 w-80 z-50 rounded-lg">
                    <div className="p-2 flex justify-between items-center">
                      <h4 className="text-white font-semibold text-sm">Notificações</h4>
                      <button className="text-xs text-white/60 hover:text-white transition-colors">
                        Marcar como lidas
                      </button>
                    </div>
                    <div className="space-y-1">
                      <button className="notification-item block p-3 rounded-lg w-full text-left hover:bg-white/10">
                        <p className="text-sm text-white">Nova trilha de Storytelling disponível!</p>
                        <span className="text-xs text-white/60">há 5 min</span>
                      </button>
                      <button className="notification-item block p-3 rounded-lg w-full text-left hover:bg-white/10">
                        <p className="text-sm text-white">Seu projeto "Roteiro para Reels" foi salvo.</p>
                        <span className="text-xs text-white/60">há 2 horas</span>
                      </button>
                    </div>
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button className="block text-center text-xs text-white/70 hover:text-white transition-colors p-2 w-full">
                        Ver todas as notificações
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const isOpen = showProfileDropdown;
                    closeAllMenus();
                    if (!isOpen) setShowProfileDropdown(true);
                  }}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ring-2 ring-transparent hover:ring-white/30 liquid-glass-pill"
                  aria-label="Menu do Perfil"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80" 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
                
                {showProfileDropdown && (
                  <div className="dropdown-menu show liquid-glass-opaque absolute top-full right-0 mt-2 p-4 w-72 z-50 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80" 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">João da Silva</h5>
                        <p className="text-sm text-white/70 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span>Explorador</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/profile')}
                      className="block text-center w-full px-4 py-2.5 mb-5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 liquid-glass-pill"
                    >
                      Meu Perfil
                    </button>

                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <h6 className="text-xs font-medium text-white/80">Créditos Mensais</h6>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCreditsTooltip(!showCreditsTooltip);
                            }}
                            className="text-white/60 hover:text-white transition-colors"
                            aria-label="Informações sobre créditos"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          {showCreditsTooltip && (
                            <div className="credit-tooltip show liquid-glass absolute bottom-full right-0 mb-2 p-3 w-64 rounded-lg">
                              <p className="text-xs text-white/90">
                                Seus créditos são usados para conversas e se renovam a cada 24h. Precisa de mais?{' '}
                                <button className="font-semibold text-[#2fd159] hover:underline">
                                  Torne-se um Maestro
                                </button>{' '}
                                para ter acesso ilimitado.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="credits-progress-bar w-full h-3 bg-white/10 rounded-full">
                          <div 
                            className="credits-progress-fill h-full bg-white rounded-full shadow-[0_0_15px_3px_rgba(255,255,255,0.4)] transition-all duration-700" 
                            style={{ width: '70%' }}
                          />
                        </div>
                        <p className="text-xs text-right text-white/60 mt-1">35/50</p>
                      </div>
                    </div>

                    <div className="space-y-1 border-t border-white/10 pt-3 mt-4">
                      <button 
                        onClick={() => navigate('/subscription')}
                        className="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left hover:bg-white/10"
                      >
                        <Gem className="w-4 h-4 text-white/70" />
                        <span>Gerenciar Assinatura</span>
                      </button>
                      <button 
                        onClick={() => navigate('/settings')}
                        className="menu-item flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full text-left hover:bg-white/10"
                      >
                        <Settings className="w-4 h-4 text-white/70" />
                        <span>Configurações</span>
                      </button>
                      <div className="border-t border-white/10 my-2" />
                      <button 
                        onClick={() => {
                          localStorage.removeItem('trendlyai-user-authenticated');
                          navigate('/login');
                        }}
                        className="menu-item flex items-center gap-3 p-2.5 text-red-400 hover:text-red-300 text-sm rounded-lg w-full text-left hover:bg-white/10"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main 
          ref={chatAreaRef}
          className="flex-grow overflow-y-auto hide-scrollbar scroll-smooth"
          style={{ paddingTop: '100px', paddingBottom: '160px' }}
        >
          <div 
            ref={chatContentRef}
            className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6"
          >
            {activeConversation?.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 w-full ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
                style={{ animation: 'fadeInUpBubble 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-emerald-400 flex items-center justify-center font-semibold text-sm shrink-0">
                    AI
                  </div>
                )}
                <div 
                  className={`message-bubble max-w-[85%] border-radius-18 p-3 ${
                    message.role === 'user' 
                      ? 'user-bubble bg-white/12 border border-white/20' 
                      : 'assistant-bubble bg-white/5 border border-white/15'
                  }`}
                  style={{ borderRadius: '18px', padding: '12px 16px' }}
                >
                  <div className="markdown-content text-white/95 leading-relaxed">
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* AI Thinking Indicator */}
            {isLoading && (
              <div className="flex items-start gap-4 ai-thinking-container">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-emerald-400 flex items-center justify-center font-semibold text-sm shrink-0">
                  AI
                </div>
                <div className="assistant-bubble message-bubble bg-white/5 border border-white/15" style={{ borderRadius: '18px', padding: '12px 16px' }}>
                  <div className="ai-thinking-text text-lg font-semibold bg-gradient-to-r from-white/40 via-white/90 to-white/40 bg-clip-text text-transparent animate-pulse">
                    Pensando...
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Chat Composer */}
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 md:ml-80">
          <div className="w-full max-w-4xl mx-auto">
            <div 
              className={`chat-composer-container bg-[#1E1F22] border border-white/10 rounded-2xl flex flex-col transition-all duration-200 ${
                isInputFocused ? 'border-white/30' : ''
              }`}
            >
              <div className="overflow-y-auto max-h-[200px] hide-scrollbar p-1">
                <textarea
                  ref={textareaRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={handleKeyPress}
                  placeholder="Converse com a IA..."
                  className="chat-composer-textarea w-full hide-scrollbar p-3 bg-transparent border-none text-white resize-none outline-none leading-6 text-base placeholder-white/50"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                  rows={1}
                />
              </div>
              
              <div className="chat-composer-actions flex items-center justify-between p-2 px-3">
                <div className="flex items-center gap-2">
                  <label className="composer-btn flex items-center justify-center w-9 h-9 rounded-lg bg-white/8 text-white/60 hover:bg-white/12 hover:text-white transition-all cursor-pointer">
                    <input type="file" className="hidden" />
                    <Paperclip className="w-5 h-5" />
                  </label>
                  
                  <button
                    onClick={toggleSearch}
                    className={`search-toggle-btn flex items-center gap-2 h-9 px-2 rounded-full cursor-pointer transition-all border ${
                      isSearchEnabled 
                        ? 'active bg-blue-500/15 border-blue-500 text-blue-500' 
                        : 'bg-white/8 border-transparent text-white/60 hover:text-white hover:bg-white/12'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span 
                      className="search-text transition-all duration-300 whitespace-nowrap overflow-hidden"
                      style={{
                        width: isSearchEnabled ? 'auto' : '0px',
                        opacity: isSearchEnabled ? '1' : '0'
                      }}
                    >
                      Search
                    </span>
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  className={`composer-btn flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                    messageInput.trim() 
                      ? 'active bg-white/15 text-white' 
                      : 'bg-white/8 text-white/60 hover:bg-white/12 hover:text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={cancelDelete} />
          <div className="liquid-glass relative w-full max-w-md mx-4 p-6 rounded-2xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Excluir Conversa
              </h3>
              <p className="text-white/70 mb-6">
                Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(showNotifications || showProfileDropdown || conversationMenuId) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            closeAllMenus();
            setConversationMenuId(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;