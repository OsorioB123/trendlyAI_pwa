import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gem, 
  Download, 
  PauseCircle, 
  XCircle, 
  ChevronDown,
  X
} from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelView, setShowCancelView] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedPauseMonths, setSelectedPauseMonths] = useState(null);

  const billingHistory = [
    {
      date: '15 de Janeiro, 2025',
      plan: 'Plano Mestre Criador - Mensal',
      amount: 'R$ 29,90'
    },
    {
      date: '15 de Dezembro, 2024',
      plan: 'Plano Mestre Criador - Mensal',
      amount: 'R$ 29,90'
    },
    {
      date: '15 de Novembro, 2024',
      plan: 'Plano Mestre Criador - Mensal',
      amount: 'R$ 29,90'
    }
  ];

  const handlePauseConfirm = () => {
    if (selectedPauseMonths) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + selectedPauseMonths);
      const formattedDate = futureDate.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      alert(`Assinatura pausada com sucesso! Será reativada em ${formattedDate}.`);
      setShowPauseModal(false);
      setSelectedPauseMonths(null);
    }
  };

  const handleCancelConfirm = () => {
    alert('Assinatura cancelada com sucesso!');
    setShowCancelView(false);
    setCancelReason('');
  };

  const handleBackToMain = () => {
    setShowCancelView(false);
    setCancelReason('');
  };

  if (showCancelView) {
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

        <main className="w-full mx-auto">
          <div className="max-w-3xl relative mr-auto ml-auto px-4 py-8">
            <div className="animate-entry">
              <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-4">
                Temos pena de o ver partir.
              </h1>
              <p className="text-white/70 mb-8">
                Seu acesso continuará até 15 de Fev, 2025.
              </p>
            </div>
            <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-6 md:p-8 animate-entry delay-1">
              <label htmlFor="cancel-reason" className="font-medium text-white block mb-2">
                O que poderíamos ter feito melhor? (Opcional)
              </label>
              <textarea 
                id="cancel-reason" 
                rows="4" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all resize-none" 
                placeholder="Seu feedback é muito valioso para nós..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="mt-6 flex flex-col sm:flex-row-reverse gap-4">
                <button 
                  onClick={handleCancelConfirm}
                  className="w-full sm:w-auto bg-red-800/50 hover:bg-red-800/70 text-white font-medium py-3 px-6 rounded-full transition-all hover:shadow-lg hover:shadow-red-800/20"
                >
                  Sim, cancelar minha assinatura
                </button>
                <button 
                  onClick={handleBackToMain}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-full transition-all"
                >
                  Não, quero continuar
                </button>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          .animate-entry {
            opacity: 0;
            transform: translateY(20px);
            animation: slideInFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-entry.delay-1 { animation-delay: 0.15s; }
          
          @keyframes slideInFade { 
            to { opacity: 1; transform: translateY(0); } 
          }
        `}</style>
      </div>
    );
  }

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

      <main className="w-full mx-auto">
        <div className="max-w-3xl relative mr-auto ml-auto px-4 py-8">
          <div className="animate-entry">
            <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-2">
              Gerenciar Assinatura
            </h1>
            <p className="text-white/60">Seu painel de controle de valor.</p>
          </div>

          {/* Main Subscription Card */}
          <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-6 md:p-8 my-8 animate-entry delay-1 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                  <Gem className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Plano Mestre Criador</h2>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">1,240</span>
                  <span className="text-white/60">insights gerados este mês</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="w-full sm:w-auto sm:text-right flex-shrink-0 pt-2 space-y-1">
                <div className="flex justify-between sm:justify-start sm:gap-4 items-center">
                  <span className="text-sm text-white/70">Renova em:</span>
                  <strong className="text-sm text-white">15 de Fev, 2025</strong>
                </div>
                <div className="flex justify-between sm:justify-start sm:gap-4 items-center">
                  <span className="text-sm text-white/70">Valor:</span>
                  <strong className="text-sm text-white">R$ 29,90</strong>
                </div>
              </div>
            </div>
            <div className="text-sm text-white/70 mt-4">
              Cobrado no seu Visa terminando em 4532.{' '}
              <button className="font-medium text-white hover:text-white/80 transition-colors hover:underline">
                Atualizar
              </button>
            </div>
            <div className="h-px bg-white/10 my-6"></div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                onClick={() => setShowBillingHistory(!showBillingHistory)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {showBillingHistory ? 'Ocultar histórico de cobranças' : 'Ver histórico completo de cobranças'}
              </button>
              <button 
                onClick={() => setShowPlanOptions(!showPlanOptions)}
                className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full px-6 py-3 text-sm font-medium w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-white/15 transition-all"
              >
                <span>{showPlanOptions ? 'Ocultar Opções' : 'Ver Opções de Plano'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showPlanOptions ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Billing History */}
          {showBillingHistory && (
            <div className="mb-10 animate-entry delay-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                Histórico de Cobranças
              </h2>
              <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl">
                <ul className="divide-y divide-white/10">
                  {billingHistory.map((item, index) => (
                    <li key={index} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors duration-200">
                      <div>
                        <p className="font-medium text-white">{item.date}</p>
                        <p className="text-sm text-white/60">{item.plan}</p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="font-semibold text-white">{item.amount}</span>
                        <button 
                          title="Baixar Recibo" 
                          className="bg-white/10 backdrop-blur-md border border-white/14 rounded-full w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Plan Options */}
          {showPlanOptions && (
            <div className="mb-10 animate-entry delay-3">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                    <PauseCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Pausar Assinatura</h3>
                  <p className="text-white/70 mb-4 text-sm">
                    Precisa de uma pausa? Seu arsenal e progresso ficarão salvos.
                  </p>
                  <button 
                    onClick={() => setShowPauseModal(true)}
                    className="w-full py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium"
                  >
                    Pausar Assinatura
                  </button>
                </div>
                <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Cancelar Assinatura</h3>
                  <p className="text-white/70 mb-4 text-sm">
                    Seu acesso continuará até o fim do ciclo de cobrança.
                  </p>
                  <button 
                    onClick={() => setShowCancelView(true)}
                    className="w-full py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm font-medium"
                  >
                    Prosseguir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/8 backdrop-blur-lg border border-white/14 rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Pausar sua jornada</h3>
              <button 
                onClick={() => {
                  setShowPauseModal(false);
                  setSelectedPauseMonths(null);
                }}
                className="text-white/60 hover:text-white transition-colors text-2xl leading-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Selecione por quanto tempo deseja pausar. Nenhuma cobrança será feita neste período.
            </p>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((months) => (
                <button 
                  key={months}
                  onClick={() => setSelectedPauseMonths(months)}
                  className={`flex-1 p-3 text-sm font-medium border rounded-lg transition-all ${
                    selectedPauseMonths === months 
                      ? 'bg-white/20 border-white' 
                      : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  {months} Mês{months > 1 ? 'es' : ''}
                </button>
              ))}
            </div>
            {selectedPauseMonths && (
              <p className="text-xs text-center text-white/60 mb-4">
                Sua assinatura será reativada em{' '}
                {new Date(Date.now() + selectedPauseMonths * 30 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
            <button 
              onClick={handlePauseConfirm}
              disabled={!selectedPauseMonths}
              className={`w-full bg-white text-black font-bold py-3 px-6 rounded-full transition-all ${
                selectedPauseMonths 
                  ? 'hover:bg-gray-100' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Confirmar Pausa
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-entry {
          opacity: 0;
          transform: translateY(20px);
          animation: slideInFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-entry.delay-1 { animation-delay: 0.15s; }
        .animate-entry.delay-2 { animation-delay: 0.3s; }
        .animate-entry.delay-3 { animation-delay: 0.45s; }
        
        @keyframes slideInFade { 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPage;