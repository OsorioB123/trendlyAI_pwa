import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const LinkSentPage = () => {
  return (
    <AuthLayout>
      <div className="w-full flex flex-col items-center">
        {/* Logo */}
        <img 
          src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
          alt="Logo da TrendlyAI" 
          className="w-48 mb-10 animate-fade-in-up object-cover"
        />

        {/* Card de Confirmação */}
        <div 
          className="w-full liquid-glass rounded-3xl p-8 flex flex-col text-center animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          {/* Wrapper para o conteúdo principal */}
          <div className="flex-grow flex flex-col items-center justify-center gap-6 py-8">
            {/* Ícone de Sucesso */}
            <div 
              className="liquid-glass-icon-bg w-20 h-20 rounded-full flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <MailCheck className="w-10 h-10 text-white" />
            </div>

            {/* Bloco de Texto */}
            <div 
              className="animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-2 font-geist">
                Link Enviado!
              </h2>
              <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                Verifique sua caixa de entrada (e a pasta de spam) para encontrar o link de redefinição de senha.
              </p>
            </div>

            {/* Botão de Ação */}
            <Link 
              to="/login" 
              className="primary-action-btn w-full max-w-xs text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg text-center mt-4 animate-fade-in-up inline-block"
              style={{ animationDelay: '400ms' }}
            >
              Ok, entendi
            </Link>
          </div>

          {/* Footer */}
          <div 
            className="flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            <Lock className="w-3 h-3" />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LinkSentPage;