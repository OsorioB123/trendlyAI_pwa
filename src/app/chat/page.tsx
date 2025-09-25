'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { optimizeUnsplash } from '../../utils/image'
import Header from '../../components/layout/Header'
import BackgroundOverlay from '../../components/common/BackgroundOverlay'
import ChatSidebar from '../../components/chat/ChatSidebar'
import ChatMessages from '../../components/chat/ChatMessages'
import ChatInput from '../../components/chat/ChatInput'
import DeleteModal from '../../components/chat/DeleteModal'
import useChat from '../../hooks/useChat'
import useConversations from '../../hooks/useConversations'
import { Loader } from 'lucide-react'

// Mock background for now - in production this would come from user settings
const CURRENT_BACKGROUND = {
  value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
}

function ChatPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  
  // Chat hooks
  const chat = useChat()
  const conversations = useConversations()

  // Responsive background optimization for Unsplash
  const [bgUrl, setBgUrl] = useState(CURRENT_BACKGROUND.value)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const width = window.innerWidth
    const target = width <= 640 ? 800 : width <= 1280 ? 1280 : 1920
    setBgUrl(optimizeUnsplash(CURRENT_BACKGROUND.value, target))
  }, [])

  // Handle initial message from dashboard (guard against re-exec)
  const initialHandledRef = React.useRef(false)
  useEffect(() => {
    if (initialHandledRef.current) return
    if (!user?.id || conversations.isLoading) return
    const initMsg = searchParams.get('message')
    if (initMsg && initMsg.trim()) {
      conversations.createConversationWithMessage(initMsg.trim()).then((conversation) => {
        if (conversation) {
          chat.setActiveConversation(conversation)
        }
      })
      initialHandledRef.current = true
      try {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('message')
        const qs = params.toString()
        const url = qs ? `/chat?${qs}` : '/chat'
        router.replace(url)
      } catch {}
    }
  }, [user?.id, conversations.isLoading, searchParams, conversations.createConversationWithMessage, chat.setActiveConversation, router])


  // Redirect if not authenticated
  useEffect(() => {
    const isE2E = typeof window !== 'undefined' && (window as any).__E2E_TEST__ === true
    if (!isE2E && !authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.getConversationById(conversationId)
    if (conversation) {
      chat.setActiveConversation(conversation)
    }
  }

  // Handle message sent
  const handleMessageSent = () => {
    // Scroll to bottom and update conversation list if needed
    chat.scrollToBottom()
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!conversations.conversationToDelete) return
    
    const success = await conversations.executeDelete()
    if (success && chat.activeConversation?.id === conversations.conversationToDelete) {
      // If deleted conversation was active, clear it
      chat.setActiveConversation(null)
    }
  }

  // Handle outside clicks to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Close conversation menu if clicking outside
      if (conversations.conversationMenuId && 
          !target.closest('.relative.group') && 
          !target.closest('.conversation-dropdown-menu')) {
        conversations.setConversationMenuId(null)
      }
      
      // Cancel editing if clicking outside input
      if (conversations.editingConversationId && 
          !target.closest('input[type="text"]') && 
          !target.closest('.conversation-item')) {
        conversations.cancelRename()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [
    conversations.conversationMenuId,
    conversations.editingConversationId,
    conversations,
    conversations.cancelRename,
    conversations.setConversationMenuId
  ])

  // Show loading state
  if (authLoading || !user) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("${optimizeUnsplash(CURRENT_BACKGROUND.value, 800)}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          
        }}
      >
        <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex text-white font-['Inter'] antialiased bg-fixed-desktop"
      style={{
        backgroundImage: `url("${bgUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
      }}
    >
      {/* Background overlay */}
      <BackgroundOverlay />
      {/* Skip to chat messages */}
      <a href="#chat-log" className="skip-link">Pular para mensagens</a>

      {/* Chat Sidebar */}
      <ChatSidebar onConversationSelect={handleConversationSelect} />

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col md:ml-80">
        {/* Chat Header */}
        <Header onToggleSidebar={conversations.toggleMobileSidebar} />

        {/* Chat Messages */}
        <ChatMessages
          messages={chat.messages}
          isLoading={chat.isLoading}
          isStreaming={chat.isStreaming}
         onRegenerate={() => chat.regenerateLast()} />

        {/* Chat Input */}
        <ChatInput onMessageSent={handleMessageSent} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={conversations.showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={conversations.cancelDelete}
        isDeleting={conversations.isDeleting}
      />

      {/* Global Styles */}
      <style jsx>{`
        @keyframes fadeInUpBubble {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .liquid-glass {
          backdrop-filter: blur(20px);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .liquid-glass-header {
          backdrop-filter: blur(20px);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .liquid-glass-opaque {
          backdrop-filter: blur(20px);
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .liquid-glass-pill {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .conversation-item {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .conversation-item:hover {
          transform: translateX(2px);
        }

        .conversation-item.active {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
        }

        .conversation-dropdown-menu {
          backdrop-filter: blur(20px);
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.7) 100%
          );
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .message-bubble {
          transition: all 0.2s ease;
        }

        .user-bubble {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .assistant-bubble {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-composer-container {
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .chat-composer-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .composer-btn {
          transition: all 0.2s ease;
        }

        .composer-btn.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .search-toggle-btn.active {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgb(59, 130, 246);
          color: rgb(59, 130, 246);
        }

        .notification-dot {
          animation: pulse 2s infinite;
        }

        .credits-progress-bar {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
        }

        .credits-progress-fill {
          background: white;
          border-radius: 9999px;
          box-shadow: 0 0 15px 3px rgba(255, 255, 255, 0.4);
          transition: width 0.7s ease;
        }
      `}</style>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader className="w-8 h-8 animate-spin text-white" /></div>}>
      <ChatPageContent />
    </Suspense>
  )
}





