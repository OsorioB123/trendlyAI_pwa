import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set authentication flag
      localStorage.setItem('trendlyai-user-authenticated', 'true');
      
      // Navigate to onboarding or home based on user status
      const hasCompletedOnboarding = localStorage.getItem('trendlyai-onboarding-completed');
      if (hasCompletedOnboarding) {
        navigate('/home');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    console.log('Google login initiated');
    localStorage.setItem('trendlyai-user-authenticated', 'true');
    
    const hasCompletedOnboarding = localStorage.getItem('trendlyai-onboarding-completed');
    if (hasCompletedOnboarding) {
      navigate('/home');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black text-white font-['Inter'] antialiased selection:bg-white/10 selection:text-white"
      style={{
        backgroundImage: 'radial-gradient(1200px 600px at 70% -10%, rgba(120,119,198,0.18) 0%, transparent 60%), radial-gradient(900px 500px at -10% 100%, rgba(56,189,248,0.14) 0%, transparent 60%)'
      }}
    >
      {/* Background Image */}
      <div 
        className="fixed top-0 w-full h-screen bg-cover bg-center -z-10" 
        style={{
          backgroundImage: `url("${currentBackground.value}")`
        }}
      />

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
            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-white text-sm font-medium bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300"
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
              Continuar com o Google
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
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border border-white/15 transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10"
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
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 bg-black/20 border border-white/15 transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 border border-white/20 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
                  animationDelay: '520ms' 
                }}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
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