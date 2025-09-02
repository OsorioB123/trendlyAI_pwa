import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MailCheck, Lock } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage = () => {
  const { currentBackground } = useBackground();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: resetError } = await resetPassword(email);
      
      if (resetError) {
        console.error('Reset password error:', resetError);
        
        // Handle specific error types
        if (resetError.message.includes('user not found')) {
          setError('Não encontramos uma conta com este e-mail.');
        } else if (resetError.message.includes('rate limit')) {
          setError('Muitas tentativas. Tente novamente em alguns minutos.');
        } else {
          setError(resetError.message || 'Erro ao enviar e-mail. Tente novamente.');
        }
        return;
      }

      console.log('Password reset email sent successfully:', data);
      setIsEmailSent(true);
      
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isEmailSent) {
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
        <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

        <main className="w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <img 
            src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
            alt="Logo da TrendlyAI" 
            className="w-48 mb-10 animate-fade-in-up object-cover"
          />

          {/* Success Card */}
          <div className="w-full liquid-glass rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <MailCheck className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight mb-4 font-['Geist']">
              E-mail Enviado!
            </h2>

            <p className="text-white/70 mb-6 leading-relaxed">
              Enviamos as instruções de recuperação para{' '}
              <span className="font-semibold text-white">{email}</span>.
              <br />
              Verifique sua caixa de entrada e spam.
            </p>

            <div className="w-full space-y-4">
              <Link
                to="/login"
                className="w-full flex items-center justify-center text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 border border-white/20 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
              >
                Voltar para Login
              </Link>

              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                  setError('');
                }}
                className="w-full text-white/60 hover:text-white text-sm transition-colors duration-300"
              >
                Tentar com outro e-mail
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-6">
              <Lock className="w-3 h-3" strokeWidth={1.5} />
              <span>Protegido por Supabase</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

        {/* Recovery Card */}
        <div 
          className="w-full liquid-glass rounded-3xl p-8 flex flex-col animate-fade-in-up" 
          style={{ animationDelay: '100ms' }}
        >
          <div>
            <Link 
              to="/login"
              className="flex items-center text-white/60 hover:text-white text-sm font-medium gap-1.5 -ml-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fade-in-up" 
              style={{ animationDelay: '200ms' }}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Voltar para o login
            </Link>
            <div 
              className="w-full mt-6 animate-fade-in-up" 
              style={{ animationDelay: '300ms' }}
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-2 font-['Geist']">
                Recuperar Senha
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Digite seu e-mail e enviaremos um link para você redefinir sua senha.
              </p>
            </div>
          </div>

          {/* Recovery Form */}
          <form 
            onSubmit={handleSubmit} 
            className="w-full flex flex-col gap-5 mt-8" 
            noValidate
          >
            <div 
              className="animate-fade-in-up" 
              style={{ animationDelay: '400ms' }}
            >
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={handleEmailChange}
                className={`form-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10 ${
                  emailError ? 'border-rose-400' : 'border-white/15'
                }`}
                required
              />
              {emailError && (
                <p className="error-message show text-rose-400 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up bg-white/10 border border-white/20 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ animationDelay: '500ms' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Enviando...
                </div>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="success-message rounded-xl p-4 mt-4 animate-fade-in-up bg-green-500/10 border border-green-500/20 backdrop-blur-20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="text-green-400 font-medium text-sm">E-mail enviado com sucesso!</h3>
                  <p className="text-green-300/70 text-xs mt-1 leading-relaxed">
                    Verifique sua caixa de entrada e siga as instruções no e-mail para redefinir sua senha.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Badge */}
          <div 
            className="mt-auto pt-8 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up" 
            style={{ animationDelay: '600ms' }}
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

        /* Estilo customizado para os inputs (Consistente) */
        .form-input {
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .form-input:focus {
          outline: none;
          background-color: rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        /* Estilo para input com erro */
        .input-error {
          border-color: #fb7185; /* Tailwind rose-400 */
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

        /* Estilo para mensagens de erro com animação */
        .error-message {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, margin-top 0.3s ease-out;
        }

        .error-message.show {
          max-height: 2.5rem;
          margin-top: 0.25rem;
        }

        /* Estilo para mensagem de sucesso */
        .success-message {
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
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

export default ForgotPasswordPage;