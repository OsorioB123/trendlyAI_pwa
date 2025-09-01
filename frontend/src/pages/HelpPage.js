import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Rocket, 
  Gem, 
  Zap, 
  HardDrive,
  ChevronDown,
  Headphones,
  X
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

const HelpPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [activeTab, setActiveTab] = useState('primeiros-passos');
  const [openAccordion, setOpenAccordion] = useState('O que é a TrendlyAI?');
  const [showChatWidget, setShowChatWidget] = useState(false);

  const tabs = [
    { id: 'primeiros-passos', label: 'Primeiros Passos', icon: Rocket },
    { id: 'assinatura', label: 'Assinatura', icon: Gem },
    { id: 'ferramentas', label: 'Ferramentas', icon: Zap },
    { id: 'tecnico', label: 'Questões Técnicas', icon: HardDrive }
  ];

  const faqData = {
    'primeiros-passos': [
      {
        question: 'O que é a TrendlyAI?',
        answer: 'TrendlyAI é sua orquestra de inteligência artificial para criação de conteúdo. Combinamos ferramentas de IA, trilhas de aprendizado e a assistente Salina para ajudar você a criar conteúdo de alta performance de forma mais rápida e estratégica.'
      },
      {
        question: 'Como começo a usar as ferramentas?',
        answer: 'A melhor forma de começar é pela Home. Você pode conversar diretamente com a Salina sobre o que deseja criar ou explorar as "Ferramentas recomendadas". Cada ferramenta possui um prompt pronto para uso que você pode abrir, editar e copiar com um clique.'
      },
      {
        question: 'O que são as Trilhas?',
        answer: 'As Trilhas são jornadas de aprendizado guiadas que combinam teoria e prática. Elas ensinam conceitos de marketing e criação de conteúdo, e integram as ferramentas da TrendlyAI para você aplicar o conhecimento imediatamente.'
      }
    ],
    'assinatura': [
      {
        question: 'Como funciona o cancelamento?',
        answer: 'Você pode cancelar sua assinatura a qualquer momento através do seu painel de "Gerenciar Assinatura" no menu do seu perfil. O acesso permanecerá ativo até o final do período já pago.'
      },
      {
        question: 'Quais são as formas de pagamento?',
        answer: 'Aceitamos os principais cartões de crédito (Visa, MasterCard, American Express) e PIX para planos anuais. Todo o processamento é feito de forma segura por nosso parceiro de pagamentos.'
      },
      {
        question: 'Posso trocar de plano depois?',
        answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas no próximo ciclo de cobrança, exceto para upgrades que são aplicados imediatamente.'
      }
    ],
    'ferramentas': [
      {
        question: 'Como uso os prompts das ferramentas?',
        answer: 'Cada ferramenta tem um prompt otimizado que você pode visualizar, editar e copiar. Clique em "Abrir ferramenta", personalize os campos necessários e depois copie o prompt para usar no ChatGPT, Claude ou qualquer IA de sua preferência.'
      },
      {
        question: 'Posso salvar meus trabalhos?',
        answer: 'Sim! Você pode salvar seus prompts personalizados e resultados na sua biblioteca pessoal. Isso permite reutilizar estratégias que funcionaram bem e manter um histórico dos seus melhores conteúdos.'
      },
      {
        question: 'Quantas ferramentas estão disponíveis?',
        answer: 'Temos mais de 50 ferramentas organizadas por categorias como redes sociais, e-mail marketing, copywriting, storytelling e análise de tendências. Adicionamos novas ferramentas regularmente baseadas no feedback dos usuários.'
      }
    ],
    'tecnico': [
      {
        question: 'A plataforma funciona no celular?',
        answer: 'Sim! A TrendlyAI é totalmente responsiva e funciona perfeitamente em todos os dispositivos. Você pode acessar ferramentas, trilhas e conversar com a Salina tanto no computador quanto no smartphone.'
      },
      {
        question: 'Meus dados estão seguros?',
        answer: 'Absolutamente. Usamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da indústria. Seus dados nunca são compartilhados com terceiros e você pode deletar sua conta a qualquer momento.'
      },
      {
        question: 'Posso usar offline?',
        answer: 'A TrendlyAI requer conexão com a internet para funcionar, pois depende de IA em tempo real. Porém, você pode copiar e salvar localmente os prompts e resultados para usar offline posteriormente.'
      }
    ]
  };

  const handleAccordionClick = (question) => {
    setOpenAccordion(openAccordion === question ? null : question);
  };

  const handleSalinaClick = () => {
    navigate('/chat');
  };

  const openChatWidget = () => {
    setShowChatWidget(true);
  };

  const closeChatWidget = () => {
    setShowChatWidget(false);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Header spacer */}
      <div style={{ height: '80px' }}></div>

      <main className="w-full mx-auto pb-32">
        <div className="max-w-5xl relative mr-auto ml-auto px-4 space-y-28">

          {/* Salina Reminder Section */}
          <section className="animate-entry">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"></div>
              <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-400">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                    <Sparkles className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                      A Salina é sua primeira guia.
                    </h2>
                    <p className="text-white/70 mb-6 max-w-prose">
                      Para dúvidas sobre estratégias, ideias ou como usar uma ferramenta, comece uma conversa com a Salina na Home. Ela tem acesso a todo o nosso conhecimento.
                    </p>
                    <button 
                      onClick={handleSalinaClick}
                      className="bg-white text-black rounded-full px-8 py-3 font-semibold hover:bg-gray-100 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                    >
                      Falar com a Salina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="animate-entry delay-1">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 lg:items-start">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1">
                <nav className="flex flex-col gap-1 relative">
                  <div 
                    className="absolute left-0 w-full h-12 bg-white/8 border border-white/10 rounded-lg transition-all duration-300"
                    style={{
                      transform: `translateY(${tabs.findIndex(tab => tab.id === activeTab) * 48}px)`
                    }}
                  />
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative z-10 flex items-center gap-3 px-4 py-3 font-medium transition-colors ${
                          activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {faqData[activeTab].map((item, index) => (
                    <div key={index} className="border-b border-white/10 last:border-b-0">
                      <button
                        onClick={() => handleAccordionClick(item.question)}
                        className="w-full flex justify-between items-center text-left py-5 hover:bg-white/5 transition-colors rounded-lg px-2"
                      >
                        <span className="font-semibold text-lg text-white pr-4">
                          {item.question}
                        </span>
                        <ChevronDown 
                          className={`w-6 h-6 text-white/60 transition-transform duration-300 flex-shrink-0 ${
                            openAccordion === item.question ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-500 ${
                          openAccordion === item.question ? 'max-h-96 pb-5' : 'max-h-0'
                        }`}
                      >
                        <div className="px-2 text-white/80 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support Section */}
          <section className="animate-entry delay-2 text-center border-t border-white/10 pt-16">
            <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
              Não encontrou o que procurava?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Nossa equipe de especialistas está aqui para ajudar com qualquer questão que a Salina não possa resolver. Fale diretamente conosco.
            </p>
            <button 
              onClick={openChatWidget}
              className="bg-white text-black rounded-full px-8 py-3 font-semibold hover:bg-gray-100 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
            >
              Iniciar Conversa com um Especialista
            </button>
          </section>
        </div>
      </main>

      {/* Chat Widget */}
      {showChatWidget && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl relative w-full max-w-sm h-[60vh] flex flex-col">
            {/* Widget Header */}
            <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-white/10">
              <div>
                <h3 className="font-semibold text-white">Suporte TrendlyAI</h3>
                <p className="text-xs text-white/60">Normalmente respondemos em 5 minutos.</p>
              </div>
              <button 
                onClick={closeChatWidget}
                className="text-white/60 hover:text-white bg-white/10 backdrop-blur-md border border-white/14 rounded-full w-9 h-9 flex items-center justify-center hover:bg-white/15 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Widget Content */}
            <div className="flex-grow p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/14 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-md p-3">
                    <p className="text-sm text-white/90">Olá! Como podemos ajudar você hoje? 👋</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Widget Input */}
            <div className="flex-shrink-0 p-4 border-t border-white/10">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                className="w-full bg-white/10 border border-white/14 rounded-full p-3 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md" 
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-entry {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: slideInFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-1 { animation-delay: 0.2s; }
        .animate-entry.delay-2 { animation-delay: 0.4s; }
        
        @keyframes slideInFade { 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `}</style>
    </div>
  );
};

export default HelpPage;