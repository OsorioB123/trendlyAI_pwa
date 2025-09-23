'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  X,
  Copy,
  Compass,
  CheckCircle,
  Code2,
  MessageSquareCode,
  BrainCircuit,
  Cpu,
  Sparkles,
} from 'lucide-react'
import type { Tool } from '../../types/tool'

interface ToolModalProps {
  tool: Tool | null
  isOpen: boolean
  onClose: () => void
}

type ToastState = {
  message: string
  visible: boolean
}

const COMPATIBILITY_ICONS: Record<string, JSX.Element> = {
  Claude: <BrainCircuit className="h-4 w-4" aria-hidden />,
  ChatGPT: <MessageSquareCode className="h-4 w-4" aria-hidden />,
  Gemini: <Cpu className="h-4 w-4" aria-hidden />,
  Midjourney: <Cpu className="h-4 w-4" aria-hidden />,
  'DALL-E': <Cpu className="h-4 w-4" aria-hidden />,
  'Stable Diffusion': <Cpu className="h-4 w-4" aria-hidden />,
}

export default function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false })

  const compatibilityTools = useMemo(() => {
    if (!tool?.compatibility?.length) return []

    return tool.compatibility.map((item) => {
      const label = mapCompatibilityLabel(item)
      const icon = COMPATIBILITY_ICONS[label] ?? <Sparkles className="h-4 w-4" aria-hidden />

      return (
        <span
          key={item}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
        >
          {icon}
          {label}
        </span>
      )
    })
  }, [tool])

  useEffect(() => {
    if (!isOpen || !tool) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lastFocusedElementRef.current = document.activeElement as HTMLElement

    setEditedContent(tool.content ?? '')
    setIsExpanded(false)
    setShowSaveButton(false)

    const focusTimeout = window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimeout)
    }
  }, [isOpen, tool])

  useEffect(() => {
    if (isOpen) return
    const timer = window.setTimeout(() => lastFocusedElementRef.current?.focus?.(), 0)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!toast.visible) return

    const timeout = window.setTimeout(() => setToast({ message: '', visible: false }), 2500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const showToast = (message: string) => setToast({ message, visible: true })

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      showToast('Prompt copiado!')
    } catch (error) {
      console.error('Failed to copy prompt:', error)
      showToast('Erro ao copiar prompt.')
    }
  }

  const handleRestoreDefault = () => {
    if (!tool) return
    const confirmation = window.confirm('Tem certeza? Suas ediÃ§Ãµes serÃ£o perdidas.')
    if (!confirmation) return

    setEditedContent(tool.content ?? '')
    setShowSaveButton(false)
    showToast('Prompt restaurado ao padrÃ£o.')
  }

  const handleSaveChanges = () => {
    if (!tool) return
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`tool-${tool.id}`, editedContent)
    }
    setShowSaveButton(false)
    showToast('AlteraÃ§Ãµes salvas!')
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(event.target.value)
    setShowSaveButton(true)

    event.target.style.height = 'auto'
    event.target.style.height = `${Math.min(event.target.scrollHeight, 300)}px`
  }

  const handleExpandPrompt = () => setIsExpanded(true)
  const handleCollapsePrompt = () => {
    setIsExpanded(false)
    setShowSaveButton(false)
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  if (!tool || !isOpen) {
    return null
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      <div
        className="fixed top-1/2 left-1/2 z-[101] h-[min(85vh,750px)] w-[min(90vw,800px)] -translate-x-1/2 -translate-y-1/2 transform rounded-3xl bg-slate-900/90 backdrop-blur-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 md:overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`tool-modal-title-${tool.id}`}
      >
        <div className="flex h-full flex-col p-6 pt-12 md:pt-6">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white/70 transition-colors hover:bg-black/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <header className="mb-6 flex-shrink-0 space-y-4 pr-10">
            <div className="space-y-2">
              <h2 id={`tool-modal-title-${tool.id}`} className="text-2xl font-semibold tracking-tight text-white">
                {tool.title}
              </h2>
              <p className="text-white/70">{tool.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <section className="-mr-2 flex-grow space-y-6 overflow-y-auto pr-2 scrollbar-hide">
            {tool.how_to_use && (
              <article className="rounded-xl bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <Compass className="mt-1 h-5 w-5 text-white" aria-hidden />
                  <div>
                    <h3 className="font-semibold text-white">Guia rÃ¡pido</h3>
                    <p className="mt-1 text-sm text-white/70">{tool.how_to_use}</p>
                  </div>
                </div>
              </article>
            )}

            {compatibilityTools.length > 0 && (
              <article className="rounded-xl bg-white/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
                  <CheckCircle className="h-4 w-4" aria-hidden />
                  TambÃ©m funciona com
                </h3>
                <div className="flex flex-wrap items-center gap-3">{compatibilityTools}</div>
              </article>
            )}

            <article className="space-y-4 rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Code2 className="h-4 w-4" aria-hidden />
                  Prompt principal
                </h3>
                <button
                  type="button"
                  onClick={() => copyToClipboard(editedContent)}
                  className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  title="Copiar prompt"
                >
                  <Copy className="h-4 w-4" aria-hidden />
                </button>
              </div>

              {!isExpanded && (
                <div>
                  <div className="relative max-h-[140px] overflow-hidden rounded-lg bg-black/20 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-200">
                      {editedContent.substring(0, 200)}{editedContent.length > 200 ? 'â€¦' : ''}
                    </pre>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent" />
                  </div>
                  <button
                    type="button"
                    onClick={handleExpandPrompt}
                    className="mt-3 text-sm font-medium text-white transition-colors hover:text-white/80"
                  >
                    Expandir para editar
                  </button>
                </div>
              )}

              {isExpanded && (
                <div className="space-y-3">
                  <textarea
                    className="h-auto w-full resize-none rounded-lg bg-black/30 p-4 font-mono text-sm leading-relaxed text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    rows={8}
                    value={editedContent}
                    onChange={handleContentChange}
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    {showSaveButton && (
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-300 transition-colors hover:bg-green-500/30"
                      >
                        Salvar alteraÃ§Ãµes
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRestoreDefault}
                      className="text-xs font-medium text-red-400/80 transition-colors hover:text-red-400"
                    >
                      Restaurar padrÃ£o
                    </button>
                    <button
                      type="button"
                      onClick={handleCollapsePrompt}
                      className="ml-auto text-sm text-white/60 transition-colors hover:text-white"
                    >
                      Recolher
                    </button>
                  </div>
                </div>
              )}
            </article>
          </section>
        </div>
      </div>

      {toast.visible && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-lg">
          {toast.message}
        </div>
      )}
    </>
  )
}

function mapCompatibilityLabel(value: string): string {
  switch (value) {
    case 'chatgpt':
      return 'ChatGPT'
    case 'claude':
      return 'Claude'
    case 'gemini':
      return 'Gemini'
    case 'midjourney':
      return 'Midjourney'
    case 'dalle':
      return 'DALL-E'
    case 'stable-diffusion':
      return 'Stable Diffusion'
    default:
      return value
  }
}

