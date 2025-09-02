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
  Info
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
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setMessage('');
    adjustTextareaHeight();

    // Add thinking animation
    const thinkingMessage = createThinkingMessage();
    setMessages(prev => [...prev, thinkingMessage]);
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = prev.filter(msg => msg.type !== 'thinking');
        const aiResponse = simulateAIResponse(userMessage.content);
        return [...newMessages, aiResponse];
      });
      setIsTyping(false);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const toggleDesktopSidebar = () => {
    setShowDesktopSidebar(!showDesktopSidebar);
  };

  const startNewConversation = () => {
    setMessages([{
      id: 1,
      type: 'assistant',
      content: 'Olá! 👋 Sou seu assistente TrendlyAI. Como posso impulsionar suas ideias hoje?',
      timestamp: new Date()
    }]);
    setShowMobileSidebar(false);
  };

  const ThinkingAnimation = ({ text }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [fadeClass, setFadeClass] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setFadeClass('fade-out');
        
        setTimeout(() => {
          setCurrentTextIndex(prev => (prev + 1) % thinkingTexts.length);
          setFadeClass('');
        }, 150);
      }, 1500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex items-center justify-center p-4">
        <div className="relative px-4 py-2 w-full">
          <div className={`ai-thinking-text ${fadeClass}`}>
            {thinkingTexts[currentTextIndex]}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="chat-page-container"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

      {/* Mobile Sidebar Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          showMobileSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileSidebar(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-[85%] sm:w-80 h-full z-50 transform transition-transform duration-300 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${
          showDesktopSidebar ? 'md:translate-x-0' : 'md:-translate-x-full'
        }`}
      >
        <div className="liquid-glass w-full h-full flex flex-col rounded-none md:rounded-3xl md:m-4">
          {/* Sidebar Header */}
          <div className="p-4 flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center h-11">
              <button 
                onClick={() => navigate(-1)}
                className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:hidden"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <h3 className="text-white font-semibold tracking-tight hidden md:block">
                Conversas
              </h3>
              
              <button 
                onClick={() => setShowMobileSidebar(false)}
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
            
            <h3 className="text-white font-semibold tracking-tight mt-2 md:hidden">
              Conversas
            </h3>
          </div>

          {/* Divider */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="h-px bg-white/10 rounded-full" />
          </div>

          {/* Conversations List */}
          <div className="flex-grow overflow-y-auto hide-scrollbar px-2 space-y-1">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`conversation-item w-full text-left p-3 rounded-lg transition-all ${
                  conversation.active ? 'active' : ''
                }`}
                onClick={() => setShowMobileSidebar(false)}
              >
                <h4 className="font-medium text-sm text-white truncate">
                  {conversation.title}
                </h4>
                <p className="text-xs text-white/60 mt-1">
                  {conversation.time}
                </p>
              </button>
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

      {/* Desktop Sidebar Toggle Button */}
      <button 
        onClick={toggleDesktopSidebar}
        className={`fixed left-4 top-24 w-12 h-12 rounded-full liquid-glass-pill hidden md:flex items-center justify-center shadow-lg z-20 transition-all duration-300 ${
          showDesktopSidebar ? 'opacity-0 pointer-events-none transform -translate-x-4 scale-95' : 'opacity-100 pointer-events-auto transform translate-x-0 scale-100'
        }`}
      >
        <PanelLeftOpen className="w-5 h-5 text-white" />
      </button>

      {/* Main Chat Container */}
      <div 
        className={`chat-container transition-all duration-300 ${
          showDesktopSidebar ? 'md:ml-[21rem]' : 'md:ml-0'
        }`}
      >
        {/* Header */}
        <Header 
          variant={HeaderVariant.CHAT} 
          onMenuToggle={toggleMobileSidebar}
          showMobileSidebar={showMobileSidebar}
        />

        {/* Chat Area */}
        <main 
          ref={chatAreaRef}
          className="chat-area hide-scrollbar"
        >
          <div className="chat-area-content w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex items-start gap-4 ${
                  msg.type === 'user' ? 'justify-end' : ''
                }`}
              >
                {msg.type === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-emerald-400 flex items-center justify-center font-semibold text-sm shrink-0">
                    AI
                  </div>
                )}
                
                <div className={`message-bubble ${
                  msg.type === 'user' ? 'user-bubble' : 'assistant-bubble'
                }`}>
                  {msg.type === 'thinking' ? (
                    <ThinkingAnimation text={msg.content} />
                  ) : (
                    <div className="markdown-content">
                      <p>{msg.content}</p>
                    </div>
                  )}
                </div>
                
                {msg.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm shrink-0">
                    S
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Chat Composer */}
        <div 
          className={`composer-container transition-all duration-300 ${
            showDesktopSidebar ? '' : ''
          }`}
        >
          <div className="w-full max-w-4xl mx-auto p-4">
            <div className={`chat-composer-container ${isFocused ? 'focused' : ''}`}>
              <div className="overflow-y-auto max-h-[200px] hide-scrollbar p-1">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    adjustTextareaHeight();
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyPress}
                  placeholder={isSearchEnabled ? "Search the web..." : "Digite sua mensagem..."}
                  className="chat-composer-textarea w-full hide-scrollbar p-3"
                  rows={1}
                />
              </div>
              
              <div className="chat-composer-actions">
                <div className="flex items-center gap-2">
                  <label className="composer-btn cursor-pointer">
                    <input type="file" className="hidden" />
                    <Paperclip className="w-5 h-5" />
                  </label>
                  
                  <button 
                    onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                    className={`search-toggle-btn ${isSearchEnabled ? 'active' : ''}`}
                  >
                    <Globe className="w-4 h-4" />
                    <span 
                      className="search-text"
                      style={{
                        width: isSearchEnabled ? 'auto' : '0px',
                        opacity: isSearchEnabled ? '1' : '0',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Search
                    </span>
                  </button>
                </div>
                
                <button 
                  onClick={sendMessage}
                  className={`composer-btn ${message.trim() ? 'active' : ''}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;