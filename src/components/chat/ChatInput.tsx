// =====================================================
// CHAT INPUT COMPONENT
// Message input with credit integration and file support
// =====================================================

'use client'

import React, { useRef, useEffect } from 'react'
import {
  Send,
  Paperclip,
  Globe
} from 'lucide-react'
import useChat from '../../hooks/useChat'
import { CHAT_CONSTANTS, PORTUGUESE_MESSAGES } from '../../types/chat'

interface ChatInputProps {
  className?: string
  onMessageSent?: () => void
}

export function ChatInput({ className, onMessageSent }: ChatInputProps) {
  const {
    inputState,
    userCredits,
    isSending,
    error,
    sendMessage,
    updateInputState,
    clearInput
  } = useChat()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 52), 
        200
      )
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [inputState.value])

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Handle message sending
  const handleSendMessage = async () => {
    const message = inputState.value.trim()
    if (!message || isSending) return

    // Validate message length
    if (message.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH) {
      return
    }

    const success = await sendMessage(message)
    if (success) {
      onMessageSent?.()
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateInputState({ value: e.target.value })
  }

  // Handle focus/blur
  const handleFocus = () => {
    updateInputState({ isFocused: true })
  }

  const handleBlur = () => {
    updateInputState({ isFocused: false })
  }

  // Toggle search
  const toggleSearch = () => {
    updateInputState({ isSearchEnabled: !inputState.isSearchEnabled })
  }

  // Handle file input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    updateInputState({ 
      attachments: [...inputState.attachments, ...files]
    })
  }

  // Check if can send message
  const canSendMessage = inputState.value.trim().length > 0 && 
                        !isSending &&
                        inputState.value.length <= CHAT_CONSTANTS.MAX_MESSAGE_LENGTH

  // Check if has credits
  const hasCredits = userCredits && userCredits.current > 0

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-20 p-4 md:ml-80 ${className}`}>
      <div className="w-full max-w-3xl mx-auto">
        {/* Credits Warning */}
        {!hasCredits && (
          <div className="mb-3 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-200 text-sm text-center">
            <p>
              Você não tem créditos suficientes para enviar mensagens.{' '}
              <button className="font-semibold text-amber-100 hover:underline">
                Torne-se um Maestro
              </button>{' '}
              para ter acesso ilimitado.
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Character Count Warning */}
        {inputState.value.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH * 0.8 && (
          <div className="mb-2 text-right">
            <span className={`text-xs ${
              inputState.value.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH 
                ? 'text-red-400' 
                : 'text-amber-400'
            }`}>
              {inputState.value.length} / {CHAT_CONSTANTS.MAX_MESSAGE_LENGTH}
            </span>
          </div>
        )}

        {/* Input Container */}
        <div 
          className={`chat-composer-container bg-[#1E1F22] border border-white/10 rounded-2xl flex flex-col transition-all duration-200 ${
            inputState.isFocused ? 'border-white/30' : ''
          } ${!hasCredits ? 'opacity-50' : ''}`}
        >
          {/* File Attachments Preview */}
          {inputState.attachments.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <div className="flex flex-wrap gap-2">
                {inputState.attachments.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="truncate max-w-32">{file.name}</span>
                    <button 
                      onClick={() => {
                        const newAttachments = [...inputState.attachments]
                        newAttachments.splice(index, 1)
                        updateInputState({ attachments: newAttachments })
                      }}
                      className="text-white/40 hover:text-white/80 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Textarea Container */}
          <div className="overflow-y-auto max-h-[200px] hide-scrollbar p-1">
            <textarea
              ref={textareaRef}
              value={inputState.value}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              placeholder={hasCredits ? PORTUGUESE_MESSAGES.TYPING_PLACEHOLDER : 'Você precisa de créditos para conversar...'}
              disabled={!hasCredits || isSending}
              className={`chat-composer-textarea w-full hide-scrollbar p-3 bg-transparent border-none text-white resize-none outline-none leading-6 text-base placeholder-white/50 disabled:cursor-not-allowed ${
                inputState.value.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH ? 'text-red-400' : ''
              }`}
              style={{ 
                minHeight: '52px', 
                maxHeight: '200px' 
              }}
              rows={1}
            />
          </div>
          
          {/* Actions Bar */}
          <div className="chat-composer-actions flex items-center justify-between p-2 px-3">
            <div className="flex items-center gap-2">
              {/* File Upload */}
              <label className={`composer-btn flex items-center justify-center w-9 h-9 rounded-lg bg-white/8 text-white/60 hover:bg-white/12 hover:text-white transition-all cursor-pointer ${
                !hasCredits ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  disabled={!hasCredits}
                  multiple
                />
                <Paperclip className="w-5 h-5" />
              </label>
              
              {/* Search Toggle */}
              <button
                onClick={toggleSearch}
                disabled={!hasCredits}
                className={`search-toggle-btn flex items-center gap-2 h-9 px-2 rounded-full cursor-pointer transition-all border ${
                  inputState.isSearchEnabled 
                    ? 'active bg-blue-500/15 border-blue-500 text-blue-500' 
                    : 'bg-white/8 border-transparent text-white/60 hover:text-white hover:bg-white/12'
                } ${!hasCredits ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Globe className="w-4 h-4" />
                <span 
                  className="search-text transition-all duration-300 whitespace-nowrap overflow-hidden"
                  style={{
                    width: inputState.isSearchEnabled ? 'auto' : '0px',
                    opacity: inputState.isSearchEnabled ? '1' : '0'
                  }}
                >
                  {PORTUGUESE_MESSAGES.SEARCH}
                </span>
              </button>
            </div>
            
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!canSendMessage || !hasCredits}
              className={`composer-btn flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                canSendMessage && hasCredits
                  ? 'active bg-white/15 text-white hover:bg-white/20' 
                  : 'bg-white/8 text-white/60 cursor-not-allowed'
              } ${isSending ? 'animate-pulse' : ''}`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Credits Display */}
          {userCredits && (
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Créditos: {userCredits.current}/{userCredits.total}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/60 rounded-full transition-all duration-300"
                      style={{ width: `${userCredits.percentage}%` }}
                    />
                  </div>
                  <span>{userCredits.percentage}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInput