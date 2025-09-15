// =====================================================
// CHAT MESSAGES COMPONENT
// Message display with streaming support and animations
// =====================================================


'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '../../types/chat'
import { PORTUGUESE_MESSAGES } from '../../types/chat'
import { MOTION_CONSTANTS } from '@/lib/motion'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  className?: string
}

interface MessageBubbleProps {
  message: Message
  isLatest: boolean
}

function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const bubbleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: MOTION_CONSTANTS.DURATION.normal } },
    exit: { opacity: 0, y: -10, transition: { duration: MOTION_CONSTANTS.DURATION.fast } },
  }

  return (
    <motion.div
      layout
      variants={bubbleVariants as any}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-start gap-4 w-full ${isUser ? 'justify-end' : ''}`}
    >
      <div
        className={`message-bubble border-radius-18 p-3 ${
          isUser
            ? 'user-bubble bg-white/12 border border-white/20 max-w-[70%] md:max-w-[60%]'
            : 'assistant-bubble bg-white/5 border border-white/15 max-w-[90%] md:max-w-[75%]'
        }`}
        style={{ borderRadius: '18px', padding: '12px 16px' }}
      >
        <div className="markdown-content text-white/95 leading-relaxed">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    </motion.div>
  )
}

function ThinkingIndicator() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-4 ai-thinking-container"
    >
      <div
        className="assistant-bubble message-bubble bg-white/5 border border-white/15"
        style={{ borderRadius: '18px', padding: '12px 16px' }}
      >
        <motion.div
          className="ai-thinking-text text-lg font-semibold bg-gradient-to-r from-white/40 via-white/90 to-white/40 bg-clip-text text-transparent"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {PORTUGUESE_MESSAGES.THINKING}
        </motion.div>
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white/80 mb-2">
        Pronto para conversar!
      </h3>
      <p className="text-sm text-white/60 max-w-sm leading-relaxed">
        Envie uma mensagem para começar nossa conversa. Estou aqui para ajudar com suas ideias e projetos.
      </p>
    </div>
  )
}

export function ChatMessages({ 
  messages, 
  isLoading, 
  isStreaming,
  className 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [messages.length, isLoading])

  // Handle manual scroll detection for auto-scroll behavior
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isScrolledToBottom = true

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      isScrolledToBottom = distanceFromBottom < 50 // 50px threshold
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  if (!messages || (messages.length === 0 && !isLoading)) {
    return (
      <main
        id="chat-log"
        ref={containerRef}
        className={`flex-grow overflow-y-auto hide-scrollbar scroll-smooth ${className}`}
        style={{ 
          paddingTop: '100px', 
          paddingBottom: '160px' 
        }}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-atomic="false"
        tabIndex={-1}
      >
        <EmptyState />
        <div ref={messagesEndRef} />
      </main>
    )
  }

  return (
    <main
      id="chat-log"
      ref={containerRef}
      className={`flex-grow overflow-y-auto hide-scrollbar scroll-smooth ${className}`}
      style={{ 
        paddingTop: '100px', 
        paddingBottom: '160px' 
      }}
      role="log"
      aria-live={isStreaming ? 'polite' : 'off'}
      aria-relevant="additions"
      aria-atomic="false"
      aria-busy={isLoading || isStreaming}
      tabIndex={-1}
    >
      <motion.div
        className="w-full max-w-3xl mx-auto p-4 flex flex-col gap-6"
        variants={MOTION_CONSTANTS.VARIANTS.staggerContainer as any}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
          {(isLoading || isStreaming) && (
            <ThinkingIndicator />
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>
    </main>
  )
}

export default ChatMessages
