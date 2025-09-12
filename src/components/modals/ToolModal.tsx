'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Copy, 
  Compass, 
  CheckCircle, 
  Code2, 
  MessageSquareCode, 
  BrainCircuit, 
  Cpu 
} from 'lucide-react'
import { Tool } from '../../types/tool'

interface ToolModalProps {
  tool: Tool | null
  isOpen: boolean
  onClose: () => void
}

export default function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(tool?.content || '')
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })

  // Tool logos mapping
  const toolLogos = {
    "Claude": <BrainCircuit className="w-4 h-4" />,
    "ChatGPT": <MessageSquareCode className="w-4 h-4" />,
    "Gemini": <Cpu className="w-4 h-4" />,
    "Midjourney": <Cpu className="w-4 h-4" />,
    "DALL-E": <Cpu className="w-4 h-4" />,
    "Stable Diffusion": <Cpu className="w-4 h-4" />
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setEditedContent(tool?.content || '')
      setIsExpanded(false)
      setIsEditing(false)
      setShowSaveButton(false)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, tool])

  const showToast = (message: string) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 2500)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast('Prompt copiado!')
    }).catch(() => {
      showToast('Erro ao copiar prompt')
    })
  }

  const handleExpandPrompt = () => {
    setIsExpanded(true)
    setIsEditing(true)
  }

  const handleCollapsePrompt = () => {
    setIsExpanded(false)
    setIsEditing(false)
    setShowSaveButton(false)
  }

  const handleRestoreDefault = () => {
    if (confirm('Tem certeza? Suas edições serão perdidas.')) {
      setEditedContent(tool?.content || '')
      setShowSaveButton(false)
      showToast('Prompt restaurado ao padrão.')
    }
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to backend/localStorage
    if (tool) {
      localStorage.setItem(`tool-${tool.id}`, editedContent)
    }
    setShowSaveButton(false)
    showToast('Alterações salvas!')
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value)
    setShowSaveButton(true)
    
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 300) + 'px'
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !tool) return null

  const compatibilityTools = tool.compatibility?.map(toolName => (
    <div 
      key={toolName} 
      className="p-2 rounded-lg flex flex-col items-center gap-1 transition-all hover:scale-110 hover:bg-white/10 hover:border-white/15 bg-white/5 border border-transparent" 
      title={toolName}
    >
      <div className="w-8 h-8 text-white/70 flex items-center justify-center">
        {toolLogos[toolName as keyof typeof toolLogos] || <Cpu className="w-4 h-4" />}
      </div>
      <span className="text-xs text-white/60">{toolName}</span>
    </div>
  )) || []

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div 
        className={`fixed z-[101] transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(90vw,800px)] h-[min(85vh,750px)] rounded-3xl
        backdrop-blur-2xl bg-slate-900/90 border border-white/10 overflow-hidden md:block
        mobile:fixed mobile:bottom-0 mobile:left-0 mobile:right-0 mobile:h-[90vh] mobile:rounded-t-[20px] mobile:border-b-0 mobile:transform-none mobile:w-full mobile:translate-x-0 mobile:translate-y-0`}
      >
        {/* Inner Content */}
        <div className={`h-full w-full transition-all duration-300 ${
          isOpen ? 'opacity-100 transform-none' : 'opacity-0 translate-y-5'
        }`}>
          <div className="p-6 pt-12 md:pt-6 h-full flex flex-col">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header */}
            <div className="flex-shrink-0 mb-6">
              <h2 className="text-2xl font-semibold tracking-tight pr-10 font-sans">
                {tool.title}
              </h2>
              <p className="text-white/70 mt-2">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {tool.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full backdrop-blur-lg bg-white/10 border border-white/15 text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto space-y-6 scrollbar-hide -mr-2 pr-2">
              
              {/* How to Use Guide */}
              {tool.how_to_use && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">Guia Rápido</h4>
                      <p className="text-sm text-white/70 mt-1">{tool.how_to_use}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Compatibility Tools */}
              {compatibilityTools.length > 0 && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    Também funciona com
                  </h4>
                  <div className="flex items-center flex-wrap gap-3">
                    {compatibilityTools}
                  </div>
                </div>
              )}

              {/* Main Prompt Section */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-white" />
                    Prompt Principal
                  </h4>
                  <button 
                    onClick={() => copyToClipboard(editedContent)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors" 
                    title="Copiar prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Mode */}
                {!isExpanded && (
                  <div>
                    <div className="bg-black/20 rounded-lg p-4 relative max-h-[120px] overflow-hidden">
                      <pre className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap font-mono">
                        {editedContent.substring(0, 200)}...
                      </pre>
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    </div>
                    <button 
                      onClick={handleExpandPrompt}
                      className="mt-3 text-sm font-medium text-white hover:text-white/80 transition-colors"
                    >
                      Expandir para editar
                    </button>
                  </div>
                )}

                {/* Edit Mode */}
                {isExpanded && (
                  <div>
                    <textarea
                      className="w-full bg-black/30 p-4 rounded-lg text-sm leading-relaxed border border-white/10 resize-none focus:outline-none focus:border-white/30 transition-colors font-mono text-white"
                      rows={8}
                      value={editedContent}
                      onChange={handleContentChange}
                    />
                    <div className="mt-3 flex items-center flex-wrap gap-4">
                      {showSaveButton && (
                        <button 
                          onClick={handleSaveChanges}
                          className="bg-green-500/20 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-green-500/30 transition-colors"
                        >
                          Salvar Alterações
                        </button>
                      )}
                      <button 
                        onClick={handleRestoreDefault}
                        className="text-xs text-red-400/80 hover:text-red-400 transition-colors font-medium"
                      >
                        Restaurar Padrão
                      </button>
                      <button 
                        onClick={handleCollapsePrompt}
                        className="text-sm text-white/60 hover:text-white transition-colors ml-auto"
                      >
                        Recolher
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[200] pointer-events-none backdrop-blur-lg bg-white/10 border border-white/15 shadow-2xl rounded-full py-3 px-6 text-white text-sm font-medium transition-all duration-300">
          {toast.message}
        </div>
      )}
    </>
  )
}