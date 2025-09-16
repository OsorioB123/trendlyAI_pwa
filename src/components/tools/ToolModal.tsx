'use client'

import { useState, useCallback, useEffect } from 'react'
import { X, Copy, RotateCcw, Compass, CheckCircle, Code2 } from 'lucide-react'
import { Tool } from '../../types/tool'

interface ToolModalProps {
  tool: Tool | null
  isOpen: boolean
  onClose: () => void
  onCopy?: (content: string) => void
  onSave?: (toolId: string, content: string) => void
}

export default function ToolModal({ 
  tool, 
  isOpen, 
  onClose, 
  onCopy, 
  onSave 
}: ToolModalProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Reset state when modal opens/closes or tool changes
  useEffect(() => {
    if (tool && isOpen) {
      const savedContent = localStorage.getItem(`tool_${tool.id}`) || tool.content
      setEditedContent(savedContent)
      setHasChanges(false)
      setIsEditMode(false)
    }
  }, [tool, isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleCopy = useCallback(async () => {
    if (!tool) return
    
    const contentToCopy = isEditMode ? editedContent : (localStorage.getItem(`tool_${tool.id}`) || tool.content)
    
    try {
      await navigator.clipboard.writeText(contentToCopy)
      if (onCopy) {
        onCopy(contentToCopy)
      } else {
        // Show success feedback
        const button = document.getElementById('copy-button')
        if (button) {
          const originalText = button.textContent
          button.textContent = 'Copiado!'
          setTimeout(() => {
            button.textContent = originalText
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }, [tool, isEditMode, editedContent, onCopy])

  const handleSave = useCallback(async () => {
    if (!tool || !hasChanges) return
    
    setIsSaving(true)
    
    try {
      localStorage.setItem(`tool_${tool.id}`, editedContent)
      
      if (onSave) {
        await onSave(tool.id, editedContent)
      }
      
      setHasChanges(false)
      
      // Show success feedback
      const button = document.getElementById('save-button')
      if (button) {
        const originalText = button.textContent
        button.textContent = 'Salvo!'
        setTimeout(() => {
          button.textContent = originalText
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to save tool:', error)
    } finally {
      setIsSaving(false)
    }
  }, [tool, editedContent, hasChanges, onSave])

  const handleRestore = useCallback(() => {
    if (!tool) return
    
    if (confirm('Tem certeza? Suas edições serão perdidas.')) {
      setEditedContent(tool.content)
      localStorage.removeItem(`tool_${tool.id}`)
      setHasChanges(false)
    }
  }, [tool])

  const handleContentChange = useCallback((newContent: string) => {
    setEditedContent(newContent)
    setHasChanges(newContent !== (tool?.content || ''))
  }, [tool])

  const getCategoryColor = (category: string) => {
    const colors = {
      'Copywriting': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'SEO': 'bg-green-500/20 text-green-300 border-green-500/30', 
      'Imagem': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Análise': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Negócios': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Marketing': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Design': 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    }
    return colors[category as keyof typeof colors] || 'bg-white/10 text-white/80 border-white/15'
  }

  const getCompatibilityIcon = (aiModel: string) => {
    const icons = {
      'ChatGPT': '🤖',
      'Claude': '🧠', 
      'Gemini': '💎',
      'Midjourney': '🎨',
      'DALL-E': '🖼️',
      'Stable Diffusion': '⚡'
    }
    return icons[aiModel as keyof typeof icons] || '🛠️'
  }

  if (!tool || !isOpen) return null

  const currentContent = isEditMode ? editedContent : (localStorage.getItem(`tool_${tool.id}`) || tool.content)
  const isContentModified = localStorage.getItem(`tool_${tool.id}`) !== null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-51 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-[24px] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto">
          
          {/* Header */}
          <div className="p-6 flex-shrink-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-semibold text-white mb-2 leading-tight">
                  {tool.title}
                </h2>
                <p className="text-white/70 mb-4">
                  {tool.description}
                </p>
                
                {/* Tags and Category */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-full backdrop-blur-lg ${getCategoryColor(tool.category).replace(/\bborder-\S+/g, '')}`}>
                    {tool.category}
                  </span>
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full flex-shrink-0"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Compatibility Section */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                Também funciona com
              </h4>
              <div className="flex flex-wrap gap-3">
                {tool.compatibility.map(ai => (
                  <div 
                    key={ai}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    title={ai}
                  >
                    <span className="text-sm">{getCompatibilityIcon(ai)}</span>
                    <span className="text-sm text-white/80">{ai}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Guide (if modified) */}
            {isContentModified && (
              <div className="bg-blue-500/10 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">Versão Personalizada</h4>
                    <p className="text-sm text-blue-200/80">
                      Você editou este prompt. Use o botão &quot;Restaurar Padrão&quot; para voltar à versão original.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Section */}
            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-white" />
                  Prompt Principal
                </h4>
                <div className="flex gap-2">
                  <button
                    id="copy-button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  
                  {!isEditMode ? (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                    >
                      Expandir para editar
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-lg text_white transition-colors"
                    >
                      Recolher
                    </button>
                  )}
                </div>
              </div>
              
              {isEditMode ? (
                <div className="space-y-3">
                  <textarea
                    value={editedContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full bg-black/30 p-4 rounded-lg text-sm leading-relaxed resize-none focus:outline-none transition-colors text-white/90 font-mono"
                    rows={Math.max(10, editedContent.split('\n').length)}
                    style={{ minHeight: '300px' }}
                  />
                  
                  <div className="flex items-center flex-wrap gap-3">
                    {hasChanges && (
                      <button
                        id="save-button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-green-500/20 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-green-500/30 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    )}
                    
                    {isContentModified && (
                      <button
                        onClick={handleRestore}
                        className="text-xs text-red-400/80 hover:text-red-400 transition-colors font-medium flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restaurar Padrão
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  className="bg-black/30 p-4 rounded-lg text-sm leading-relaxed text-white/90 font-mono whitespace-pre-wrap"
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  {currentContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
