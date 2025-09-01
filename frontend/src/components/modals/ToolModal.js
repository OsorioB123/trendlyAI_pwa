import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Compass, 
  CheckCircle, 
  Code2, 
  MessageSquareCode, 
  BrainCircuit, 
  Cpu 
} from 'lucide-react';

const ToolModal = ({ tool, isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tool?.content || '');
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Tool logos mapping
  const toolLogos = {
    "Claude": <BrainCircuit className="w-4 h-4" />,
    "ChatGPT": <MessageSquareCode className="w-4 h-4" />,
    "Gemini": <Cpu className="w-4 h-4" />,
    "Midjourney": <Cpu className="w-4 h-4" />,
    "DALL-E": <Cpu className="w-4 h-4" />,
    "Stable Diffusion": <Cpu className="w-4 h-4" />
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setEditedContent(tool?.content || '');
      setIsExpanded(false);
      setIsEditing(false);
      setShowSaveButton(false);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, tool]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast('Prompt copiado!');
    }).catch(() => {
      showToast('Erro ao copiar prompt');
    });
  };

  const handleExpandPrompt = () => {
    setIsExpanded(true);
    setIsEditing(true);
  };

  const handleCollapsePrompt = () => {
    setIsExpanded(false);
    setIsEditing(false);
    setShowSaveButton(false);
  };

  const handleRestoreDefault = () => {
    if (confirm('Tem certeza? Suas edições serão perdidas.')) {
      setEditedContent(tool?.content || '');
      setShowSaveButton(false);
      showToast('Prompt restaurado ao padrão.');
    }
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem(`tool-${tool.id}`, editedContent);
    setShowSaveButton(false);
    showToast('Alterações salvas!');
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
    setShowSaveButton(true);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 300) + 'px';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tool) return null;

  const compatibilityTools = tool.compatibility?.map(toolName => (
    <div 
      key={toolName} 
      className="tool-logo-card p-2 rounded-lg flex flex-col items-center gap-1 transition-all hover:scale-110 hover:bg-white/10 hover:border-white/15 bg-white/5 border border-transparent" 
      title={toolName}
    >
      <div className="w-8 h-8 text-white/70 flex items-center justify-center">
        {toolLogos[toolName] || <Cpu className="w-4 h-4" />}
      </div>
      <span className="text-xs text-white/60">{toolName}</span>
    </div>
  )) || [];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-[8px] transition-opacity duration-400 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Modal Container */}
      <div 
        className={`fixed z-[101] transition-all duration-400 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } 
        ${window.innerWidth <= 768 
          ? 'bottom-0 left-0 right-0 h-[90vh] rounded-t-[20px] border-b-0' 
          : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(90vw,800px)] h-[min(85vh,750px)] rounded-3xl'
        }
        bg-[rgba(20,20,22,0.9)] backdrop-blur-[24px] border border-white/10 overflow-hidden`}
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
              <h2 className="text-2xl font-semibold tracking-tight pr-10 font-['Geist']">
                {tool.title}
              </h2>
              <p className="text-white/70 mt-2">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {tool.tags?.map(tag => (
                  <span key={tag} className="liquid-glass-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="modal-scroll-container flex-grow overflow-y-auto space-y-6 hide-scrollbar -mr-2 pr-2">
              
              {/* How to Use Guide */}
              {tool.how_to_use && (
                <div className="contained-card p-4">
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
                <div className="contained-card p-4">
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
              <div className="contained-card p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-white" />
                    Prompt Principal
                  </h4>
                  <button 
                    onClick={() => copyToClipboard(editedContent)}
                    className="copy-prompt-btn p-2 rounded-lg hover:bg-white/10 transition-colors" 
                    title="Copiar prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Mode */}
                {!isExpanded && (
                  <div>
                    <div className="prompt-preview bg-black/20 rounded-lg p-4 relative max-h-[120px] overflow-hidden">
                      <pre className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap font-mono">
                        {editedContent.substring(0, 200)}...
                      </pre>
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[rgba(20,20,22,1)] to-transparent"></div>
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
                      className="prompt-textarea w-full bg-black/30 p-4 rounded-lg text-sm leading-relaxed border border-white/10 resize-none focus:outline-none focus:border-white/30 transition-colors font-mono"
                      rows="8"
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
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[200] pointer-events-none backdrop-blur-[16px] bg-white/10 border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] rounded-full py-3 px-6 text-white text-sm font-medium transition-all duration-400">
          {toast.message}
        </div>
      )}

      <style jsx>{`
        .liquid-glass-tag {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          color: white;
        }

        .contained-card {
          background-color: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
        }

        .tool-logo-card {
          transition: all 0.2s ease;
          background-color: rgba(255,255,255,0.05);
          border: 1px solid transparent;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .modal-scroll-container {
          overscroll-behavior: contain;
          min-height: 0;
        }

        .prompt-textarea {
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
        }

        /* Mobile bottom sheet styles */
        @media (max-width: 768px) {
          .modal-container {
            bottom: 0;
            left: 0;
            right: 0;
            width: 100% !important;
            height: 90vh !important;
            border-radius: 20px 20px 0 0 !important;
            border-bottom: none;
            transform: translateY(100%);
          }

          .modal-container.show {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ToolModal;