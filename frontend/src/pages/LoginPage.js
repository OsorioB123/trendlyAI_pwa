import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      const hasCompletedOnboarding = localStorage.getItem('trendlyai-onboarding-completed');
      if (hasCompletedOnboarding) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await signIn(formData.email, formData.password);
      
      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // Handle specific error types
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique suas credenciais.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login.');
        } else if (signInError.message.includes('Too many requests')) {
          setError('Muitas tentativas de login. Tente novamente em alguns minutos.');
        } else {
          setError(signInError.message || 'Erro ao fazer login. Tente novamente.');
        }
        return;
      }

      if (data?.user) {
        console.log('Login successful:', data.user.email);
        
        // Set localStorage flag for compatibility
        localStorage.setItem('trendlyai-user-authenticated', 'true');
        
        // Navigate based on onboarding status
        const hasCompletedOnboarding = localStorage.getItem('trendlyai-onboarding-completed');
        if (hasCompletedOnboarding) {
          navigate('/home');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const { data, error: googleError } = await signInWithGoogle();
      
      if (googleError) {
        console.error('Google login error:', googleError);
        setError('Erro ao fazer login com Google. Tente novamente.');
        return;
      }

      // Google OAuth will redirect, so we don't need to handle navigation here
      console.log('Google login initiated');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Erro ao fazer login com Google. Tente novamente.');
    }
  };

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-black text-white font-['Inter'] antialiased"
        style={{
          backgroundImage: `url("${currentBackground.value}?w=800&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black text-white font-['Inter'] antialiased selection:bg-white/10 selection:text-white"
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

      <main className="w-full max-w-md px-4">
        <div className="w-full flex flex-col items-center">
          {/* Logo */}
          <img 
            src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
            alt="Logo da TrendlyAI" 
            className="w-48 mb-10 object-cover animate-fade-in-up"
            style={{ 
              animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
              animationDelay: '50ms' 
            }}
          />

          {/* Login Card */}
          <div 
            className="w-full rounded-3xl p-8 flex flex-col items-center gap-6 backdrop-blur-2xl bg-white/10 border border-white/15"
            style={{ 
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
              animationDelay: '120ms' 
            }}
          >
            {/* Error Message */}
            {error && (
              <div 
                className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
                style={{ 
                  animation: 'fadeInUp 0.3s ease-out both'
                }}
              >
                {error}
              </div>
            )}

            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-white text-sm font-medium bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                animationDelay: '200ms' 
              }}
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5"
              />
              {isLoading ? 'Conectando...' : 'Continuar com o Google'}
            </button>

            {/* Divider */}
            <div 
              className="w-full flex items-center gap-4"
              style={{ 
                animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                animationDelay: '280ms' 
              }}
            >
              <div className="w-full h-px bg-white/10" />
              <span className="text-xs text-white/50 tracking-wider">OU</span>
              <div className="w-full h-px bg-white/10" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              {/* Email Input */}
              <div 
                className="flex flex-col gap-2"
                style={{ 
                  animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                  animationDelay: '360ms' 
                }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border border-white/15 transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10 disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div 
                className="flex flex-col gap-2"
                style={{ 
                  animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                  animationDelay: '440ms' 
                }}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border border-white/15 transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10 disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 border border-white/20 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                style={{ 
                  animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                  animationDelay: '520ms' 
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            {/* Links */}
            <div 
              className="flex flex-col items-center gap-3 text-center"
              style={{ 
                animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                animationDelay: '600ms' 
              }}
            >
              <Link 
                to="/signup"
                className="text-white/60 hover:text-white text-xs transition-colors duration-300"
              >
                Não tem uma conta?{' '}
                <span className="font-semibold text-white">Crie uma aqui</span>
              </Link>
              <Link 
                to="/forgot-password"
                className="text-white/60 hover:text-white text-xs transition-colors duration-300"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Security Badge */}
            <div 
              className="flex items-center justify-center gap-2 text-xs text-white/40 mt-2"
              style={{ 
                animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                animationDelay: '680ms' 
              }}
            >
              <Lock className="w-3 h-3" strokeWidth={1.5} />
              <span>Protegido por Supabase</span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;