import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpar erro anterior
    setError('');
    setShowSuccess(false);

    // Validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);

    try {
      // Simular envio (substituir pela integração real com Supabase)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mostrar mensagem de sucesso
      setShowSuccess(true);
      setEmail('');

      console.log('E-mail de recuperação enviado para:', email);
      
      // Redirecionar para página de confirmação após 3 segundos
      setTimeout(() => {
        navigate('/link-sent');
      }, 3000);

    } catch (error) {
      setError('Erro ao enviar e-mail. Tente novamente.');
      console.error('Erro ao enviar e-mail de recuperação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col items-center">
        {/* Logo */}
        <img 
          src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
          alt="Logo da TrendlyAI" 
          className="w-48 mb-10 animate-fade-in-up object-cover"
        />

        {/* Card de Recuperação */}
        <div 
          className="w-full liquid-glass rounded-3xl p-8 flex flex-col animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          {/* Header */}
          <div>
            <Link 
              to="/login" 
              className="flex items-center text-white/60 hover:text-white text-sm font-medium gap-1.5 -ml-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o login
            </Link>
            <div 
              className="w-full mt-6 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-2 font-geist">
                Recuperar Senha
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Digite seu e-mail e enviaremos um link para você redefinir sua senha.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-8">
            <div 
              className="animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 ${error ? 'input-error' : ''}`}
                required
              />
              {error && (
                <p className={`error-message text-rose-400 text-xs ${error ? 'show' : ''}`}>
                  {error}
                </p>
              )}
            </div>

            {/* Botão */}
            <button 
              type="submit"
              disabled={isLoading}
              className="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up"
              style={{ animationDelay: '500ms' }}
            >
              {!isLoading && (
                <span>Enviar Link de Recuperação</span>
              )}
              {isLoading && (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Enviando...
                </div>
              )}
            </button>
          </form>

          {/* Mensagem de sucesso */}
          {showSuccess && (
            <div className="success-message rounded-xl p-4 mt-4 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-green-400 mt-0.5 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-green-400 font-medium text-sm">E-mail enviado com sucesso!</h3>
                  <p className="text-green-300/70 text-xs mt-1 leading-relaxed">
                    Verifique sua caixa de entrada e siga as instruções no e-mail para redefinir sua senha.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div 
            className="mt-auto pt-8 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
          >
            <Lock className="w-3 h-3" />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;