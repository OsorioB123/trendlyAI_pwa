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

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBackground } = useBackground();
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Conversations state
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Ideias para Reels de Café', timestamp: 'Agora', isActive: true }
  ]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [conversationMenuId, setConversationMenuId] = useState(null);
  
  // Dropdowns state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Refs
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize messages on component mount or when conversation changes
  useEffect(() => {
    // Check if coming from home page with a message
    const homeMessage = location.state?.message;
    if (homeMessage) {
      startNewConversationWithMessage(homeMessage);
    } else {
      // Default welcome message
      setMessages([
        {
          id: 1,
          type: 'assistant',
          content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?',
          timestamp: new Date()
        }
      ]);
    }
  }, [location.state]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const startNewConversationWithMessage = (message) => {
    const newConversation = {
      id: Date.now(),
      title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
      timestamp: 'Agora',
      isActive: true
    };
    
    // Update conversations
    setConversations(prev => [
      newConversation,
      ...prev.map(conv => ({ ...conv, isActive: false }))
    ]);
    
    setActiveConversationId(newConversation.id);
    
    // Set initial messages
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'user',
        content: message,
        timestamp: new Date()
      }
    ]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: 3,
        type: 'assistant',
        content: 'Ótima pergunta! Vou te ajudar com isso. Deixe-me pensar nas melhores estratégias para o seu caso...',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const startNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: 'Nova Conversa',
      timestamp: 'Agora',
      isActive: true
    };
    
    setConversations(prev => [
      newConversation,
      ...prev.map(conv => ({ ...conv, isActive: false }))
    ]);
    
    setActiveConversationId(newConversation.id);
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?',
        timestamp: new Date()
      }
    ]);
    
    // Close mobile sidebar
    setIsMobileSidebarOpen(false);
  };

  const selectConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      isActive: conv.id === conversationId
    })));
    setActiveConversationId(conversationId);
    setIsMobileSidebarOpen(false);
  };

  const editConversationTitle = (conversationId, newTitle) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, title: newTitle } : conv
    ));
    setEditingConversationId(null);
  };

  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversationId === conversationId && conversations.length > 1) {
      // Switch to first remaining conversation
      const remaining = conversations.filter(conv => conv.id !== conversationId);
      if (remaining.length > 0) {
        selectConversation(remaining[0].id);
      }
    }
    setConversationMenuId(null);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Update conversation title if it's still "Nova Conversa"
    const activeConv = conversations.find(conv => conv.id === activeConversationId);
    if (activeConv && activeConv.title === 'Nova Conversa') {
      const newTitle = userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? '...' : '');
      editConversationTitle(activeConversationId, newTitle);
    }
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Essa é uma excelente pergunta! Vou te ajudar a explorar essa ideia. Baseado no que você mencionou, posso sugerir algumas abordagens interessantes...',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
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

  const toggleDesktopSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      
      {/* Header spacer */}
      <div style={{ height: '80px' }} className="fixed top-0 left-0 right-0 z-40" />

      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Conversations Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-[85%] sm:w-80 h-full z-50 transform transition-transform duration-300 md:relative md:transform-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${!isSidebarOpen ? 'md:-translate-x-full' : 'md:translate-x-0'}`}
      >
        <div className="liquid-glass w-full h-full flex flex-col rounded-none md:rounded-3xl md:m-4 md:h-[calc(100vh-2rem)]">
          {/* Sidebar Header */}
          <div className="p-4 flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center h-11">
              <button
                onClick={() => navigate(-1)}
                className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:hidden"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h3 className="text-white font-semibold tracking-tight hidden md:block">Conversas</h3>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:hidden"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={toggleDesktopSidebar}
                className="text-white/60 hover:text-white hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-white font-semibold tracking-tight mt-2 md:hidden">Conversas</h3>
          </div>

          {/* Divider */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="h-px bg-white/10 rounded-full" />
          </div>

          {/* Conversations List */}
          <div className="flex-grow overflow-y-auto hide-scrollbar px-2 space-y-1">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="relative group">
                <button
                  onClick={() => selectConversation(conversation.id)}
                  className={`conversation-item w-full text-left p-3 rounded-xl transition-all ${
                    conversation.isActive ? 'bg-white/15' : 'hover:bg-white/10'
                  }`}
                >
                  <h4 className="font-medium text-sm text-white truncate pr-8">
                    {conversation.title}
                  </h4>
                  <p className="text-xs text-white/60 mt-1">{conversation.timestamp}</p>
                </button>
                
                {/* 3-dots menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConversationMenuId(conversationMenuId === conversation.id ? null : conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown menu */}
                  {conversationMenuId === conversation.id && (
                    <div className="absolute top-full right-0 mt-1 liquid-glass rounded-lg p-2 w-40 z-10">
                      <button
                        onClick={() => {
                          setEditingConversationId(conversation.id);
                          setConversationMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full p-2 text-sm rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => deleteConversation(conversation.id)}
                        className="flex items-center gap-2 w-full p-2 text-sm rounded-lg hover:bg-white/10 transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* New Conversation Button */}
          <div className="p-2 flex-shrink-0">
            <button
              onClick={startNewConversation}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nova Conversa</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Open sidebar button (desktop) */}
      <button
        onClick={toggleDesktopSidebar}
        className={`fixed left-4 top-24 w-12 h-12 rounded-full liquid-glass flex items-center justify-center shadow-lg z-20 transition-all duration-300 ${
          isSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-4 scale-95' : 'opacity-100 pointer-events-auto translate-x-0 scale-100'
        } hidden md:block`}
      >
        <PanelLeftOpen className="w-5 h-5 text-white" />
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Chat Header */}
        <header className="fixed top-0 left-0 right-0 z-30 pt-3 pr-4 pb-3 pl-4">
          <div 
            className={`max-w-7xl flex sticky top-0 z-40 mr-auto ml-auto items-center justify-between liquid-glass-header rounded-full px-5 py-3 transition-all duration-300 ${
              !isSidebarOpen ? '' : 'md:ml-80'
            }`}
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-11 h-11 hidden md:flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={toggleMobileSidebar}
                className="w-11 h-11 flex md:hidden items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/home')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://i.ibb.co/S4B3GHJN/Sem-nome-Apresenta-o-43-64-x-40-px-180-x-96-px.png" 
                  alt="TrendlyAI Logo" 
                  className="h-8 w-auto object-cover"
                />
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="notification-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-pulse" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                </button>
                
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 liquid-glass rounded-2xl p-4 w-80 z-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-semibold text-sm">Notificações</h4>
                      <button className="text-xs text-white/60 hover:text-white transition-colors">
                        Marcar como lidas
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <p className="text-sm text-white">Nova trilha de Storytelling disponível!</p>
                        <span className="text-xs text-white/60">há 5 min</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all ring-2 ring-transparent hover:ring-white/30 liquid-glass"
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
                  <div className="absolute top-full right-0 mt-2 liquid-glass rounded-2xl p-4 w-72 z-50">
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
                        <p className="text-sm text-white/70">✨ Explorador</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate('/profile')}
                      className="block text-center w-full px-4 py-2.5 mb-5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
                    >
                      Meu Perfil
                    </button>
                    
                    <div className="space-y-1">
                      <button
                        onClick={() => navigate('/subscription')}
                        className="flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full hover:bg-white/10 transition-colors"
                      >
                        <Gem className="w-4 h-4 text-white/70" />
                        <span>Gerenciar Assinatura</span>
                      </button>
                      <button
                        onClick={() => navigate('/settings')}
                        className="flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full hover:bg-white/10 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-white/70" />
                        <span>Configurações da Conta</span>
                      </button>
                      <button
                        onClick={() => navigate('/help')}
                        className="flex items-center gap-3 p-2.5 text-white text-sm rounded-lg w-full hover:bg-white/10 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-white/70" />
                        <span>Central de Ajuda</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <main 
          ref={messagesRef}
          className={`flex-1 overflow-y-auto pt-24 pb-32 transition-all duration-300 ${
            !isSidebarOpen ? '' : 'md:ml-80'
          }`}
        >
          <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 animate-fade-in ${
                  message.type === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-emerald-400 flex items-center justify-center font-semibold text-sm shrink-0" />
                )}
                
                <div className={`message-bubble max-w-[85%] rounded-2xl p-4 ${
                  message.type === 'user' 
                    ? 'user-bubble bg-white/15 border border-white/25' 
                    : 'assistant-bubble bg-white/5 border border-white/15'
                }`}>
                  <p className="text-white/95 leading-relaxed">{message.content}</p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-4 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-emerald-400 flex items-center justify-center font-semibold text-sm shrink-0" />
                <div className="assistant-bubble bg-white/5 border border-white/15 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-100" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Message Input */}
        <div 
          className={`fixed bottom-0 right-0 p-4 transition-all duration-300 ${
            !isSidebarOpen ? 'left-0' : 'left-0 md:ml-80'
          }`}
        >
          <div className="w-full max-w-4xl mx-auto">
            <div className="liquid-glass rounded-2xl overflow-hidden">
              <div className="overflow-y-auto max-h-[200px]">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Converse com a IA..."
                  className="w-full bg-white/5 border-none rounded-t-2xl text-white placeholder-white/60 resize-none outline-none min-h-[52px] leading-tight p-4 hide-scrollbar"
                  rows={1}
                />
              </div>
              
              <div className="bg-white/5 h-12 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer rounded-lg p-2 hover:bg-white/10 transition-colors">
                    <input type="file" className="hidden" />
                    <Paperclip className="w-4 h-4 text-white/60" />
                  </label>
                  
                  <button
                    onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                      isSearchEnabled 
                        ? 'bg-emerald-400/15 border-emerald-400 text-emerald-400' 
                        : 'bg-white/5 border-transparent text-white/40 hover:text-white/80'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Search</span>
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className={`rounded-lg p-2 transition-colors ${
                    inputValue.trim() && !isLoading
                      ? 'bg-emerald-400/15 text-emerald-400 hover:bg-emerald-400/25'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .liquid-glass {
          backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;