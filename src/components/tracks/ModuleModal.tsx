'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Play, MessageCircle, Copy, CheckCircle2, Star, ExternalLink, Sparkles } from 'lucide-react'
import { ModuleModalProps, ModulePrompt } from '../../types/track'

export default function ModuleModal({
  module,
  track,
  isOpen,
  onClose,
  onComplete,
  onChatWithSalina
}: ModuleModalProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<ModulePrompt | null>(null)
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [expandAnimation, setExpandAnimation] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setExpandAnimation(true), 50)
    } else {
      setExpandAnimation(false)
      setSelectedPrompt(null)
      setIsVideoPlaying(false)
    }
  }, [isOpen])

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

  const handleCopyPrompt = async (prompt: ModulePrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopiedPromptId(prompt.id)
      setTimeout(() => setCopiedPromptId(null), 2000)
    } catch (error) {
      console.error('Failed to copy prompt:', error)
    }
  }

  const handleCompleteModule = () => {
    if (module) {
      onComplete(module.id)
      onClose()
    }
  }

  const isModuleCompleted = module && track.moduleProgress.some(
    p => p.moduleId === module.id && p.isCompleted
  )

  if (!module || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with expanding circle animation */}
      <div 
        className={`absolute inset-0 bg-black transition-all duration-700 ease-out ${
          expandAnimation ? 'bg-opacity-90' : 'bg-opacity-0'
        }`}
        style={{
          background: expandAnimation 
            ? 'radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)'
            : 'radial-gradient(circle at center, transparent 0%, transparent 100%)'
        }}
        onClick={onClose}
      />

      {/* Modal Container with expanding animation */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-4xl max-h-[90vh] mx-4 transition-all duration-700 ease-out ${
          expandAnimation 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-75 opacity-0 translate-y-8'
        }`}
      >
        <div className="rounded-3xl overflow-hidden glass-strong">
          {/* Header */}
          <div className="relative p-6 bg-white/10">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {track.modules.findIndex(m => m.id === module.id) + 1}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
                <div className="flex items-center gap-4">
                  {isModuleCompleted && (
                    <span className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Concluído
                    </span>
                  )}
                  <span className="text-white/60 text-sm">
                    Módulo {track.modules.findIndex(m => m.id === module.id) + 1} de {track.modules.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Video Section */}
            {module.videoUrl && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Vídeo do Módulo</h3>
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  {!isVideoPlaying ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <Play className="w-10 h-10 text-white ml-1" />
                      </button>
                    </div>
                  ) : (
                    <video 
                      src={module.videoUrl}
                      controls 
                      autoPlay 
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Briefing Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Briefing do Módulo</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed">{module.content.briefing}</p>
              </div>

              {module.content.objectives && module.content.objectives.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-white mb-3">Objetivos de Aprendizado</h4>
                  <ul className="space-y-2">
                    {module.content.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/80">
                        <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Prompts Section */}
            {module.content.prompts && module.content.prompts.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Prompts Estratégicos ({module.content.prompts.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {module.content.prompts.map((prompt) => (
                    <div key={prompt.id} className="group relative">
                      <div className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                            {prompt.title}
                          </h4>
                          <button
                            onClick={() => handleCopyPrompt(prompt)}
                            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copiedPromptId === prompt.id ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/60" />
                            )}
                          </button>
                        </div>
                        
                        <p className="text-sm text-white/70 mb-3 line-clamp-3">
                          {prompt.description}
                        </p>

                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {prompt.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedPrompt(prompt)}
                            className="flex-1 py-2 px-3 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                          >
                            Ver Completo
                          </button>
                          <button
                            onClick={() => handleCopyPrompt(prompt)}
                            className="py-2 px-3 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Arsenal da Missão (Tools) */}
            {module.tools && module.tools.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Arsenal da Missão ({module.tools.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {module.tools.map((tool) => (
                    <div key={tool.id} className="p-4 bg-white/5 rounded-xl">
                      <h4 className="font-medium text-white mb-2">{tool.title}</h4>
                      <p className="text-sm text-white/70 mb-3">{tool.description}</p>
                      <button className="w-full py-2 px-3 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Usar Ferramenta
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Section */}
            {module.content.resources && module.content.resources.length > 0 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recursos Adicionais</h3>
                <div className="space-y-3">
                  {module.content.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white group-hover:text-blue-300">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-white/60">{resource.description}</p>
                          <span className="text-xs text-white/40 capitalize">
                            {resource.type}
                          </span>
                        </div>
                        <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-blue-300" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white/5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onChatWithSalina(module)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Conversar com Salina
              </button>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Fechar
                </button>
                
                {!isModuleCompleted && (
                  <button
                    onClick={handleCompleteModule}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Concluir Módulo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setSelectedPrompt(null)}
          />
          <div className="relative w-full max-w-2xl mx-4">
            <div className="rounded-2xl p-6 glass-strong">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedPrompt.title}</h3>
                <button 
                  onClick={() => setSelectedPrompt(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <p className="text-white/80 mb-4">{selectedPrompt.description}</p>

              <div className="p-4 bg-white/5 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-white/60 mb-2">PROMPT COMPLETO:</h4>
                <pre className="text-sm text-white/90 whitespace-pre-wrap font-mono">
                  {selectedPrompt.content}
                </pre>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleCopyPrompt(selectedPrompt)}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  {copiedPromptId === selectedPrompt.id ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedPromptId === selectedPrompt.id ? 'Copiado!' : 'Copiar Prompt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
