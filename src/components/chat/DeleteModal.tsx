// =====================================================
// DELETE CONFIRMATION MODAL
// Confirmation modal for deleting conversations
// =====================================================

'use client'

import React from 'react'
import { Trash2, X } from 'lucide-react'
import { PORTUGUESE_MESSAGES } from '../../types/chat'

interface DeleteModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export function DeleteModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  isDeleting = false 
}: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60" 
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="liquid-glass relative w-full max-w-md mx-4 p-6 rounded-2xl">
        <div className="text-center">
          {/* Icon */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-2">
            {PORTUGUESE_MESSAGES.CONFIRM_DELETE_TITLE}
          </h3>
          
          {/* Message */}
          <p className="text-white/70 mb-6">
            {PORTUGUESE_MESSAGES.CONFIRM_DELETE_MESSAGE}
          </p>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {PORTUGUESE_MESSAGES.CANCEL}
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Excluindo...' : PORTUGUESE_MESSAGES.DELETE}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal