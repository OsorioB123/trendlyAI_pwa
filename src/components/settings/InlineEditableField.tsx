'use client'

import { useState, useEffect, useRef } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { InlineEditableFieldProps } from '../../types/settings'

export default function InlineEditableField({
  label,
  value,
  field,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  placeholder = 'Digite aqui...',
  maxLength,
  validation
}: InlineEditableFieldProps) {
  const [currentValue, setCurrentValue] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedAnimation, setShowSavedAnimation] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      
      // Select all text for easy replacement
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      } else {
        const range = document.createRange()
        const sel = window.getSelection()
        range.selectNodeContents(inputRef.current)
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }, [isEditing])

  const validateInput = (val: string): string | null => {
    if (validation) {
      return validation(val)
    }
    
    if (maxLength && val.length > maxLength) {
      return `Máximo ${maxLength} caracteres`
    }
    
    if (field === 'username') {
      const cleanUsername = val.replace('@', '')
      if (cleanUsername.length < 3) {
        return 'Nome de usuário deve ter pelo menos 3 caracteres'
      }
      if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        return 'Apenas letras, números e underscore são permitidos'
      }
    }
    
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setCurrentValue(newValue)
    
    const validationError = validateInput(newValue)
    setError(validationError)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleSave = async () => {
    if (error) return
    
    let processedValue = currentValue.trim()
    
    // Special processing for username
    if (field === 'username') {
      if (!processedValue.startsWith('@')) {
        processedValue = '@' + processedValue.replace(/@/g, '')
      }
    }

    if (processedValue === value) {
      onCancel()
      return
    }

    setIsSaving(true)
    
    try {
      const success = await onSave(field, processedValue)
      
      if (success) {
        setShowSavedAnimation(true)
        setTimeout(() => setShowSavedAnimation(false), 700)
        onCancel() // Exit editing mode
      }
    } catch (error) {
      console.error('Error saving field:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setCurrentValue(value)
    setError(null)
    onCancel()
  }

  const isMultiline = field === 'bio'
  const CharCount = maxLength ? (
    <span className={`text-xs ${
      currentValue.length > maxLength 
        ? 'text-red-400' 
        : currentValue.length > maxLength * 0.8 
          ? 'text-orange-400' 
          : 'text-white/40'
    }`}>
      {currentValue.length}/{maxLength}
    </span>
  ) : null

  if (!isEditing) {
    return (
      <div className="profile-field group relative p-4 rounded-lg transition-colors hover:bg-white/5 cursor-pointer min-h-[60px] flex flex-col justify-center"
           onClick={() => onEdit(field)}>
        <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`text-white text-base leading-relaxed break-words ${
              showSavedAnimation ? 'animate-pulse-white' : ''
            }`}>
              {value || (
                <span className="text-white/40 italic">{placeholder}</span>
              )}
            </div>
          </div>
          <Edit2 
            size={16} 
            className="text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-3" 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="profile-field editing relative p-4 rounded-lg bg-white/5 border border-white/20">
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      
      <div className="space-y-3">
        <div className="relative">
          {isMultiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={currentValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={3}
              disabled={isSaving}
              className="w-full bg-transparent border-none outline-none text-white text-base leading-relaxed resize-none placeholder-white/40 disabled:opacity-50"
              style={{ 
                borderBottom: '2px solid transparent',
                borderImage: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%) 1',
                borderImageSlice: 1,
                animation: 'golden-border-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={currentValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              disabled={isSaving}
              className="w-full bg-transparent border-none outline-none text-white text-base leading-relaxed placeholder-white/40 disabled:opacity-50"
              style={{ 
                borderBottom: '2px solid transparent',
                borderImage: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%) 1',
                borderImageSlice: 1,
                animation: 'golden-border-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {error && (
              <span className="text-red-400 text-xs">{error}</span>
            )}
            {!error && CharCount}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1.5 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-md transition-all duration-200 disabled:opacity-50"
              title="Cancelar (Esc)"
            >
              <X size={16} />
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving || !!error || currentValue.trim() === value}
              className="p-1.5 text-white hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Salvar (Enter)"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="text-xs text-white/50">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> para salvar, {' '}
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Esc</kbd> para cancelar
        </div>
      </div>
    </div>
  )
}

// Global styles to add to your CSS
const inlineEditStyles = `
  @keyframes golden-border-appear {
    from {
      transform: scaleX(0);
      opacity: 0;
    }
    to {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  @keyframes pulse-white {
    0%, 100% {
      color: white;
      text-shadow: none;
    }
    50% {
      color: #ffffff;
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
    }
  }

  .animate-pulse-white {
    animation: pulse-white 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .profile-field.editing .profile-field-content::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
    border-radius: 1px;
    animation: golden-border-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`