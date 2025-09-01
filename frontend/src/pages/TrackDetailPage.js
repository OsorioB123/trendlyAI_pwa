import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Check, 
  WandSparkles, 
  Lock, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Star,
  Heart,
  Copy,
  ChevronDown,
  Play,
  X
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

// Mock data for track steps
const ETAPAS_DATA = {
  1: { 
    title: "Etapa 1: Gerar Ideias", 
    briefing: "Nesta etapa, seu objetivo é gerar um volume de ideias brutas. Assista ao tutorial para entender o framework mental e use os prompts para iniciar seu brainstorm.", 
    videoId: "dQw4w9WgXcQ",
    status: "concluida"
  },
  2: { 
    title: "Etapa 2: Definir Conceito", 
    briefing: "Refine suas ideias em um conceito claro e coeso, definindo a direção visual e a mensagem principal do seu projeto.", 
    videoId: null,
    status: "concluida"
  },
  3: { 
    title: "Etapa 3: Protótipo Visual", 
    briefing: "Crie um protótipo visual do seu conceito usando nosso assistente de IA para dar vida às suas ideias de forma tangível.", 
    videoId: null,
    status: "atual"
  },
  4: { 
    title: "Etapa 4: Testar Protótipo", 
    briefing: "Conclua as etapas anteriores para desbloquear esta.", 
    videoId: null,
    status: "bloqueada"
  },
  5: { 
    title: "Etapa 5: Finalizar Design", 
    briefing: "Conclua as etapas anteriores para desbloquear esta.", 
    videoId: null,
    status: "bloqueada"
  }
};

const PROMPT_CARDS = [
  {
    id: 1,
    title: "Gerador de Conceitos",
    description: "Crie múltiplas direções criativas para seu projeto",
    content: "Você é um especialista em design criativo. Gere 5 conceitos únicos para um projeto de [TIPO DE PROJETO]. Considere: público-alvo, estilo visual, mensagem principal e diferenciação no mercado."
  },
  {
    id: 2,
    title: "Estratégia Visual",
    description: "Desenvolva direções visuais específicas e detalhadas",
    content: "Atue como um diretor criativo experiente. Analise este briefing: [INSERIR BRIEFING]. Desenvolva 3 estratégias visuais distintas, cada uma com paleta de cores, tipografia e elementos gráficos específicos."
  }
];

const TrackDetailPage = () => {
  const navigate = useNavigate();
  const { trackId } = useParams();
  const { currentBackground } = useBackground();
  const [showDossier, setShowDossier] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedStepInfo, setLockedStepInfo] = useState({ title: '', description: '' });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingComment, setShowRatingComment] = useState(false);
  const [ratingComment, setRatingComment] = useState('');
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [completingStep, setCompletingStep] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState({});
  const [favoritedPrompts, setFavoritedPrompts] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const [playingVideo, setPlayingVideo] = useState(false);

  const trackData = {
    title: "Trilha de Design Criativo",
    description: "Da ideia ao protótipo final — no seu ritmo."
  };

  useEffect(() => {
    if (showDossier) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showDossier]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  const openDossier = (stepNumber) => {
    if (!ETAPAS_DATA[stepNumber]) return;
    setCurrentStep(stepNumber);
    setShowDossier(true);
    setPlayingVideo(false);
  };

  const closeDossier = () => {
    setShowDossier(false);
    setCurrentStep(null);
    setTimeout(() => {
      setCompletingStep(false);
    }, 300);
  };

  const handleLockedStep = (stepNumber) => {
    const stepData = ETAPAS_DATA[stepNumber];
    setLockedStepInfo({
      title: stepData.title,
      description: stepData.briefing
    });
    setShowLockedModal(true);
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
    setShowRatingComment(true);
  };

  const submitRating = () => {
    console.log(`Avaliação enviada: ${rating} estrelas. Comentário: "${ratingComment}"`);
    setShowRatingSuccess(true);
    
    setTimeout(() => {
      setShowRatingSuccess(false);
      setRating(0);
      setShowRatingComment(false);
      setRatingComment('');
    }, 2000);
  };

  const togglePromptExpansion = (promptId) => {
    setExpandedPrompts(prev => ({
      ...prev,
      [promptId]: !prev[promptId]
    }));
  };

  const togglePromptFavorite = (promptId) => {
    setFavoritedPrompts(prev => ({
      ...prev,
      [promptId]: !prev[promptId]
    }));
  };

  const copyPrompt = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      showToast('Prompt copiado!');
    });
  };

  const completeStep = () => {
    setCompletingStep(true);
    setTimeout(() => {
      closeDossier();
    }, 1500);
  };

  const StepButton = ({ stepNumber, status, icon: Icon }) => {
    const isEven = stepNumber % 2 === 0;
    
    return (
      <li className={`trilha-etapa trilha-etapa--${status}`} data-step={stepNumber}>
        <button 
          className={`trilha-btn ${isEven ? 'ml-[55%]' : 'mr-[55%]'} ${
            status === 'atual' ? 'liquid-glass-pill animate-pulse-white' :
            status === 'concluida' ? 'bg-white text-black shadow-lg' :
            'bg-white/5 border border-white/10'
          }`}
          onClick={() => {
            if (status === 'bloqueada') {
              handleLockedStep(stepNumber);
            } else {
              openDossier(stepNumber);
            }
          }}
          aria-label={`${ETAPAS_DATA[stepNumber].title} ${status === 'bloqueada' ? '(bloqueado)' : ''}`}
        >
          <Icon className={`w-8 h-8 ${status === 'bloqueada' ? 'opacity-30' : ''}`} />
        </button>
      </li>
    );
  };

  const PromptCard = ({ prompt }) => {
    const isExpanded = expandedPrompts[prompt.id];
    const isFavorited = favoritedPrompts[prompt.id];

    return (
      <div 
        className={`prompt-card ${isExpanded ? 'expanded' : ''}`}
        onClick={() => togglePromptExpansion(prompt.id)}
      >
        <div className="border-glow"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-semibold mb-1 text-white">{prompt.title}</h3>
              <p className="text-white/70">{prompt.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className={`prompt-action-icon favorite-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePromptFavorite(prompt.id);
                }}
                aria-label="Favoritar"
              >
                <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button 
                className="prompt-action-icon copy-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  copyPrompt(prompt.content);
                }}
                aria-label="Copiar prompt"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <ChevronDown className={`chevron text-white/60 w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <div className={`prompt-card-content grid transition-all duration-500 ease-out ${
          isExpanded ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr] mt-0'
        }`}>
          <div className="overflow-hidden">
            <div className="content-card rounded-lg p-4 bg-black/30">
              <p className="text-sm text-white/90 font-mono leading-relaxed">{prompt.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen font-['Inter'] text-white overflow-x-hidden relative"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`,
        backgroundColor: '#0A0A0C'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }}></div>

      <main className="w-full mx-auto px-4 sm:px-6 pb-24">
        <header className="relative pt-6 lg:pt-8 text-center max-w-4xl mx-auto">
          <h1 className="text-white tracking-tighter font-['Geist'] font-bold text-[clamp(32px,5vw,56px)] leading-[1.1]">
            {trackData.title}
          </h1>
          <p className="mt-4 text-white/70 mx-auto max-w-[720px] text-[clamp(16px,2vw,18px)]">
            {trackData.description}
          </p>
        </header>

        <div className="mt-[clamp(24px,5vh,48px)] z-2">
          <ol className="relative list-none p-0 m-0 w-full max-w-[420px] mx-auto trilha-mobile">
            <StepButton stepNumber={1} status="concluida" icon={Check} />
            <StepButton stepNumber={2} status="concluida" icon={Check} />
            <StepButton stepNumber={3} status="atual" icon={WandSparkles} />
            <StepButton stepNumber={4} status="bloqueada" icon={Lock} />
            <StepButton stepNumber={5} status="bloqueada" icon={Award} />
          </ol>
        </div>

        <div className="mt-12 space-y-8 max-w-lg mx-auto">
          <div className="content-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 tracking-tight font-['Geist']">Sua Jornada Criativa</h2>
            <p className="text-white/70 mb-6">Navegue pelas etapas da sua jornada. Clique na etapa atual para continuar.</p>
            <button 
              className="w-full btn-primary px-4 py-3 flex items-center justify-center"
              onClick={() => openDossier(3)}
            >
              <span>Continuar Protótipo Visual</span>
              <ArrowRight className="ml-2 w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Rating Card */}
          <div className="content-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 tracking-tight text-center font-['Geist']">Avalie esta trilha</h2>
            <div className="rating-stars flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  className={`rating-star p-2 rounded-full transition-all hover:scale-115 ${
                    starValue <= (hoverRating || rating) ? 'star-filled text-[#efd135]' : 'text-white/30'
                  }`}
                  onClick={() => handleStarClick(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Avaliar com ${starValue} estrela${starValue > 1 ? 's' : ''}`}
                >
                  <Star className="w-7 h-7" fill={starValue <= (hoverRating || rating) ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <div className={`rating-comment-section grid transition-all duration-400 ease-out ${
              showRatingComment ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
              <div className="overflow-hidden pt-4">
                <textarea 
                  className="w-full rounded-lg p-3 mb-4 text-white/90 placeholder-white/40 focus:outline-none liquid-glass-input" 
                  rows="3" 
                  placeholder="Deixe um comentário (opcional)..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                />
                <button 
                  className="w-full btn-primary px-4 py-3"
                  onClick={submitRating}
                >
                  Enviar Avaliação
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dossier Overlay */}
      {showDossier && (
        <div className="dossier-overlay fixed inset-0 z-[1000] bg-[rgba(10,10,12,0.5)] backdrop-blur-3xl">
          <header className="dossier-header fixed top-0 left-0 right-0 h-20 backdrop-blur-3xl bg-white/5 z-[1003] flex items-center justify-between px-6">
            <button 
              onClick={closeDossier}
              className="flex-1 text-left flex items-center text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-2 font-medium hidden sm:inline">Voltar</span>
            </button>
            <h1 className="flex-shrink text-lg font-semibold tracking-tight truncate text-center px-2 font-['Geist']">
              {currentStep && ETAPAS_DATA[currentStep]?.title}
            </h1>
            <div className="flex-1 text-right"></div>
          </header>
          <div className="dossier-content absolute inset-0 z-[1002] overflow-y-auto scroll-smooth pt-24 pb-48">
            <div className="max-w-3xl mx-auto px-6">
              <section className="mb-16">
                <h2 className="text-4xl font-bold mb-4 tracking-tighter font-['Geist']">Sua Missão</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-10">
                  {currentStep && ETAPAS_DATA[currentStep]?.briefing}
                </p>

                {currentStep && ETAPAS_DATA[currentStep]?.videoId && (
                  <div className="mb-16">
                    <div className="content-card rounded-xl overflow-hidden aspect-video relative video-placeholder">
                      {!playingVideo ? (
                        <div 
                          className="bg-black/50 w-full h-full flex items-center justify-center cursor-pointer"
                          onClick={() => setPlayingVideo(true)}
                        >
                          <Play className="text-white/60 w-16 h-16 animate-pulse" />
                        </div>
                      ) : (
                        <iframe 
                          className="w-full h-full" 
                          src={`https://www.youtube.com/embed/${ETAPAS_DATA[currentStep].videoId}?autoplay=1&rel=0`} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                )}
              </section>

              <section className="mb-16">
                <h2 className="text-3xl font-semibold mb-8 tracking-tight text-white font-['Geist']">Arsenal da Missão</h2>
                <div className="space-y-4">
                  {PROMPT_CARDS.map(prompt => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              </section>

              <section className="mb-16">
                <div className="border-t border-white/10 pt-10">
                  <h2 className="text-[2rem] font-semibold mb-6 tracking-tight text-white font-['Geist']">Execução com a Salina</h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-8">Agora que você tem as ferramentas, é hora de refinar. Leve seus prompts e ideias para a Salina.</p>
                  <div className="text-center">
                    <button 
                      className="btn-primary px-8 py-4 text-lg font-semibold"
                      onClick={() => navigate('/chat')}
                    >
                      Conversar com Salina
                    </button>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="text-center">
                  <button 
                    className={`btn-secondary px-8 py-3 text-base font-semibold w-full max-w-sm mx-auto h-[50px] relative overflow-hidden ${
                      completingStep ? 'is-completing is-completed bg-[#2fd159] border-[#2fd159] text-white' : ''
                    }`}
                    onClick={completeStep}
                    disabled={completingStep}
                  >
                    <span className={`btn-text transition-opacity duration-200 ${completingStep ? 'opacity-0' : 'opacity-100'}`}>
                      Marcar Etapa como Concluída
                    </span>
                    <Check className={`btn-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300 ${
                      completingStep ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`} />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Locked Modal */}
      {showLockedModal && (
        <div className="locked-modal-overlay fixed inset-0 z-[2000] flex justify-center items-center bg-black/70 backdrop-blur-lg p-6">
          <div className="locked-modal-content max-w-[400px] w-full text-center backdrop-blur-xl bg-[rgba(30,30,30,0.5)] border border-white/14 shadow-[0_8px_24px_rgba(0,0,0,0.4)] rounded-2xl p-8">
            <div className="icon-wrapper w-14 h-14 mx-auto mb-5 bg-white/10 rounded-full flex items-center justify-center">
              <Lock className="text-white/70 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-['Geist']">{lockedStepInfo.title}</h3>
            <p className="text-white/70 mb-6">{lockedStepInfo.description}</p>
            <button 
              className="btn-secondary w-full py-2.5"
              onClick={() => setShowLockedModal(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Rating Success Popup */}
      {showRatingSuccess && (
        <div className="rating-success-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-[2001] flex items-center justify-center">
          <div className="rating-success-popup bg-[rgba(30,30,30,0.8)] backdrop-blur-2xl border border-white/10 text-white p-8 rounded-2xl text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-w-[320px] w-[calc(100%-32px)]">
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 border border-white/10">
              <Check className="text-[#2fd159] w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Avaliação Enviada!</h3>
            <p className="text-white/70">Obrigado pelo seu feedback.</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="toast fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 text-black px-6 py-3 rounded-lg font-medium z-[2001]">
          {toast.message}
        </div>
      )}

      <style jsx>{`
        :root {
          --brand-green: #2fd159;
          --brand-yellow: #efd135;
        }
        
        .content-card { 
          backdrop-filter: blur(20px); 
          background-color: rgba(255, 255, 255, 0.07); 
          border: 1px solid rgba(255, 255, 255, 0.12); 
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35); 
        }
        
        .liquid-glass-pill { 
          backdrop-filter: blur(10px); 
          background-color: rgba(255, 255, 255, 0.1); 
          border: 1px solid rgba(255, 255, 255, 0.14); 
          border-radius: 9999px; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .liquid-glass-input { 
          background-color: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.1); 
          backdrop-filter: blur(5px); 
          transition: all 0.3s ease; 
        }
        
        .liquid-glass-input:focus { 
          background-color: rgba(255,255,255,0.08); 
          border-color: rgba(255,255,255,0.25); 
          box-shadow: 0 0 0 3px rgba(255,255,255,0.1); 
        }
        
        .btn-primary { 
          background-color: #ffffff; 
          color: #000000; 
          font-weight: 600; 
          border-radius: 0.75rem; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .btn-primary:hover:not(:disabled) { 
          transform: scale(1.03); 
          box-shadow: 0 10px 20px rgba(0,0,0,0.2); 
        }
        
        .btn-secondary { 
          position: relative; 
          overflow: hidden; 
          background-color: transparent; 
          border: 1px solid rgba(255, 255, 255, 0.3); 
          color: #ffffff; 
          font-weight: 500; 
          border-radius: 0.75rem; 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        
        .btn-secondary:not(:disabled):hover { 
          background-color: rgba(255, 255, 255, 0.1); 
          border-color: rgba(255, 255, 255, 0.4); 
        }
        
        .trilha-mobile::before { 
          content: ''; 
          position: absolute; 
          top: 36px; 
          bottom: 36px; 
          left: 50%; 
          width: 120px; 
          transform: translateX(-50%); 
          background-repeat: repeat-y; 
          background-position: center top; 
          background-size: contain; 
          background-image: url("data:image/svg+xml,%3Csvg width='120' height='100' viewBox='0 0 120 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0C0 0 0 50 60 50C120 50 120 100 60 100' stroke='rgba(255,255,255,0.25)' stroke-width='2' stroke-dasharray='5 5'/%3E%3C/svg%3E"); 
          z-index: -1; 
        }
        
        .trilha-etapa { 
          position: relative; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 110px; 
        }
        
        .trilha-btn { 
          width: clamp(68px, 16vw, 76px); 
          height: clamp(68px, 16vw, 76px); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          position: relative; 
          cursor: pointer; 
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease; 
          border-radius: 9999px; 
        }
        
        .trilha-btn:hover { 
          transform: scale(1.05); 
        }
        
        .animate-pulse-white {
          animation: pulse-white 2.5s infinite;
        }
        
        @keyframes pulse-white { 
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); } 
          70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); } 
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); } 
        }
        
        .prompt-card { 
          position: relative; 
          overflow: hidden; 
          backdrop-filter: blur(10px); 
          background-color: rgba(255, 255, 255, 0.07); 
          border: 1px solid rgba(255, 255, 255, 0.12); 
          border-radius: 1rem; 
          padding: 1.5rem; 
          transition: all 0.3s ease; 
          cursor: pointer; 
        }
        
        .prompt-card:hover { 
          background-color: rgba(255, 255, 255, 0.1); 
          transform: translateY(-4px); 
        }
        
        .border-glow { 
          position: absolute; 
          inset: 0; 
          border-radius: inherit; 
          opacity: 0; 
          transition: opacity 0.4s ease; 
          pointer-events: none; 
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
          -webkit-mask-composite: xor; 
          mask-composite: exclude; 
        }
        
        .prompt-card:hover .border-glow { 
          opacity: 1; 
        }
        
        .border-glow::before { 
          content: ''; 
          position: absolute; 
          inset: -150%; 
          background: conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0), white, rgba(255,255,255,0)); 
          animation: spin 4s linear infinite; 
        }
        
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        
        .prompt-action-icon { 
          background: none; 
          border: none; 
          padding: 4px; 
          border-radius: 50%; 
          color: #888; 
          cursor: pointer; 
          transition: all 0.2s ease; 
        }
        
        .prompt-action-icon:hover { 
          color: #FFF; 
          background-color: rgba(255,255,255,0.1); 
        }
        
        .prompt-action-icon.favorited { 
          color: #FFD700; 
        }
        
        .modal-open { 
          overflow: hidden; 
        }
      `}</style>
    </div>
  );
};

export default TrackDetailPage;