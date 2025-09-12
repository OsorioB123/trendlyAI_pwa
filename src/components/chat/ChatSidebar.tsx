// =====================================================
// CHAT SIDEBAR COMPONENT
// Conversation list with management functionality
// =====================================================

'use client'

import React, { useRef, useEffect } from 'react'
import {
  X,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2
} from 'lucide-react'
import useConversations from '../../hooks/useConversations'
import { PORTUGUESE_MESSAGES } from '../../types/chat'

interface ChatSidebarProps {
  className?: string
  onConversationSelect?: (conversationId: string) => void
}

export function ChatSidebar({ className, onConversationSelect }: ChatSidebarProps) {
  const {
    // Data
    conversations,
    activeConversationId,
    
    // UI State
    isMobileSidebarOpen,
    editingConversationId,
    editingTitle,
    conversationMenuId,
    isCreating,
    
    // Loading & Error
    isLoading,
    error,
    
    // Actions
    createConversation,
    selectConversation,
    setIsMobileSidebarOpen,
    startRenaming,
    saveRename,
    cancelRename,
    setEditingTitle,
    setConversationMenuId,
    confirmDeleteConversation,
    clearError
  } = useConversations()

  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when starting to edit
  useEffect(() => {
    if (editingConversationId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingConversationId])

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    selectConversation(conversationId)
    onConversationSelect?.(conversationId)
  }

  // Handle new conversation
  const handleNewConversation = async () => {
    await createConversation()
  }

  // Handle rename key press
  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveRename()
    } else if (e.key === 'Escape') {
      cancelRename()
    }
  }

  // Handle rename blur
  const handleRenameBlur = () => {
    saveRename()
  }

  // Close mobile sidebar
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileSidebar}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 w-[85%] sm:w-80 h-full z-50 transform transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${className}`}
      >
        <div className="liquid-glass w-full h-full flex flex-col rounded-none md:rounded-3xl md:m-4 md:h-[calc(100vh-2rem)]">
          {/* Sidebar Header */}
          <div className="p-4 flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center h-11">
              <h3 className="text-white font-semibold tracking-tight hidden md:block">
                {PORTUGUESE_MESSAGES.CONVERSATIONS}
              </h3>
              <h3 className="text-white font-semibold tracking-tight mt-2 md:hidden">
                {PORTUGUESE_MESSAGES.CONVERSATIONS}
              </h3>
              <button
                onClick={closeMobileSidebar}
                className="w-11 h-11 flex items-center justify-center text-white rounded-full transition-all hover:bg-white/10 active:scale-95 md:hidden"
                aria-label={PORTUGUESE_MESSAGES.CLOSE_MENU}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="h-px bg-white/10 rounded-full" />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <div className="flex justify-between items-start">
                <span>{error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-300 hover:text-red-200 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-grow overflow-y-auto hide-scrollbar px-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/60" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-sm text-white/50 px-4 py-2">
                {PORTUGUESE_MESSAGES.NO_CONVERSATIONS}
              </p>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className="relative group">
                  <button
                    onClick={() => handleConversationSelect(conversation.id)}
                    className={`conversation-item w-full text-left p-3 flex justify-between items-center transition-all duration-200 rounded-xl ${
                      conversation.id === activeConversationId 
                        ? 'active bg-white/15' 
                        : 'hover:bg-white/8 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {editingConversationId === conversation.id ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={handleRenameKeyPress}
                          onBlur={handleRenameBlur}
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h4 className="font-medium text-sm text-white truncate">
                          {conversation.title}
                        </h4>
                      )}
                    </div>
                  </button>
                  
                  {/* Options Menu Button */}
                  {editingConversationId !== conversation.id && (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setConversationMenuId(
                            conversationMenuId === conversation.id ? null : conversation.id
                          )
                        }}
                        className={`conversation-options-btn p-1 rounded-md hover:bg-white/10 transition-opacity ${
                          conversationMenuId === conversation.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                        }`}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  {/* Dropdown Menu */}
                  {conversationMenuId === conversation.id && (
                    <div className="conversation-dropdown-menu liquid-glass absolute top-full right-2 mt-1 p-2 w-40 z-10 rounded-lg opacity-100 transform scale-100 pointer-events-auto">
                      <button
                        onClick={() => startRenaming(conversation.id, conversation.title)}
                        className="dropdown-item w-full text-left flex items-center gap-2 p-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        {PORTUGUESE_MESSAGES.RENAME_CONVERSATION}
                      </button>
                      <button
                        onClick={() => confirmDeleteConversation(conversation.id)}
                        className="dropdown-item w-full text-left flex items-center gap-2 p-2 text-sm rounded-md text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        {PORTUGUESE_MESSAGES.DELETE_CONVERSATION}
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
              disabled={isCreating}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98] ${
                isCreating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">
                {isCreating ? 'Criando...' : PORTUGUESE_MESSAGES.NEW_CONVERSATION}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default ChatSidebar