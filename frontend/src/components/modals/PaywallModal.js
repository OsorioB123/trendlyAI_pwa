import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, RefreshCw } from 'lucide-react';

const PaywallModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end opacity-100 transition-opacity duration-500">
      <div 
        className="absolute inset-0 bg-black/30 opacity-100 transition-all duration-500"
        onClick={onClose}
      />
      
      <div className="liquid-glass relative w-full h-[85vh] md:h-[70vh] rounded-t-2xl flex flex-col transform translate-y-0 transition-transform duration-600 ease-out">
        {/* Mobile handle */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 md:hidden">
          <div className="w-10 h-1 bg-white/30 rounded-full"></div>
        </div>
        
        {/* Close button (desktop) */}
        <button 
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 w-10 h-10 items-center justify-center liquid-glass-pill rounded-full z-20 hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="flex-grow pt-10 p-6 md:p-10 overflow-y-auto flex flex-col justify-start md:justify-center">
          <div className="text-center mb-8 md:mb-10 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight invitation-fade">
              Torne-se o Maestro.
            </h2>
            <p className="text-white/70 mt-3 max-w-2xl mx-auto invitation-fade">
              Acesso ilimitado a todas as estratégias, instrumentos e ao poder de orquestração do nosso Estúdio.
            </p>
          </div>
          
          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mx-auto mb-8 md:mb-10 relative z-10">
            {/* Annual Plan */}
            <div className="plan-card recommended invitation-fade">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-white">Plano Anual</h3>
                  <span className="recommendation-tag whitespace-nowrap">✨ Nossa Recomendação</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">R$149</span>
                  <span className="text-white/70">/mês</span>
                  <p className="text-xs font-normal text-white/60 mt-2">
                    Cobrado R$1.788 anualmente. Uma economia de 50%.
                  </p>
                </div>
                <button className="cta-button cta-primary">
                  Entrar para o Estúdio (Anual)
                </button>
              </div>
            </div>
            
            {/* Quarterly Plan */}
            <div className="plan-card invitation-fade">
              <div className="relative z-10">
                <h3 className="font-semibold text-lg text-white mb-4">Plano Trimestral</h3>
                <div className="mb-6">
                  <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">R$299</span>
                  <span className="text-white/70">/mês</span>
                  <p className="text-xs font-normal text-white/60 mt-2">
                    Cobrado R$897 trimestralmente.
                  </p>
                </div>
                <button className="cta-button cta-secondary">
                  Continuar com o Trimestral
                </button>
              </div>
            </div>
          </div>
          
          {/* Guarantees */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/70 invitation-fade relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9df4e9]" />
              <span>Garantia de 21 Dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Cancele a Qualquer Momento</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .plan-card {
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .plan-card.recommended {
          background: rgba(30, 30, 38, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }

        .plan-card:hover {
          transform: scale(1.02);
        }

        .plan-card.recommended:hover {
          transform: scale(1.07);
        }

        .cta-button {
          width: 100%;
          padding: 12px 0;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-primary {
          background-color: #FFFFFF;
          color: #111;
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
        }

        .cta-primary:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 40px rgba(255, 255, 255, 0.25);
        }

        .cta-secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
        }

        .cta-secondary:hover {
          background-color: #9df4e9;
          border-color: #9df4e9;
          color: #111;
        }

        .recommendation-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          background-color: rgba(191, 78, 161, 0.2);
          color: #e387c5;
          border: 1px solid rgba(191, 78, 161, 0.3);
        }

        .invitation-fade {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .invitation-fade:nth-child(1) { animation-delay: 0ms; }
        .invitation-fade:nth-child(2) { animation-delay: 100ms; }
        .invitation-fade:nth-child(3) { animation-delay: 200ms; }
        .invitation-fade:nth-child(4) { animation-delay: 300ms; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PaywallModal;