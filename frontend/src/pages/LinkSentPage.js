import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, Lock } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';

const LinkSentPage = () => {
  const { currentBackground } = useBackground();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center font-['Inter'] text-white p-4 bg-black"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

      <main className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <img 
          src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
          alt="Logo da TrendlyAI" 
          className="w-48 mb-10 animate-fade-in-up object-cover"
        />

        {/* Confirmation Card */}
        <div 
          className="w-full liquid-glass rounded-3xl p-8 flex flex-col text-center animate-fade-in-up" 
          style={{ animationDelay: '100ms' }}
        >
          {/* Main Content Wrapper */}
          <div className="flex-grow flex flex-col items-center justify-center gap-6 py-8">
            {/* Success Icon */}
            <div 
              className="liquid-glass-icon-bg w-20 h-20 rounded-full flex items-center justify-center animate-fade-in-up backdrop-blur-16 bg-white/10 border border-white/14 shadow-lg" 
              style={{ animationDelay: '200ms' }}
            >
              <MailCheck className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>

            {/* Text Block */}
            <div 
              className="animate-fade-in-up" 
              style={{ animationDelay: '300ms' }}
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-2 font-['Geist']">
                Link Enviado!
              </h2>
              <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                Verifique sua caixa de entrada (e a pasta de spam) para encontrar o link de redefinição de senha.
              </p>
            </div>

            {/* Action Button */}
            <Link 
              to="/login"
              className="primary-action-btn w-full max-w-xs text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg text-center mt-4 animate-fade-in-up bg-white/10 border border-white/20 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300" 
              style={{ animationDelay: '400ms' }}
            >
              Ok, entendi
            </Link>
          </div>

          {/* Security Badge */}
          <div 
            className="flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up" 
            style={{ animationDelay: '500ms' }}
          >
            <Lock className="w-3 h-3" strokeWidth={1.5} />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Efeito Liquid Glass para o card (Consistente) */
        .liquid-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Círculo com fundo liquid glass para o ícone (Mantido) */
        .liquid-glass-icon-bg {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        /* Botão de Ação Principal (Consistente) */
        .primary-action-btn {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .primary-action-btn:hover {
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .primary-action-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* Animação de entrada (Consistente) */
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
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

export default LinkSentPage;