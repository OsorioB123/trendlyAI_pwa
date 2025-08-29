import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementar lógica de login real
    console.log('Login attempt:', formData);
    
    // Simular login bem-sucedido
    localStorage.setItem('trendlyai-user-authenticated', 'true');
    
    // Verificar se precisa mostrar onboarding
    const isOnboardingCompleted = localStorage.getItem('trendlyai-onboarding-completed');
    if (!isOnboardingCompleted) {
      navigate('/onboarding');
    } else {
      navigate('/home');
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar login com Google real
    console.log('Google login attempt');
    
    // Simular login bem-sucedido
    localStorage.setItem('trendlyai-user-authenticated', 'true');
    
    // Verificar se precisa mostrar onboarding
    const isOnboardingCompleted = localStorage.getItem('trendlyai-onboarding-completed');
    if (!isOnboardingCompleted) {
      navigate('/onboarding');
    } else {
      navigate('/home');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full flex flex-col items-center">
        {/* Logo */}
        <img 
          src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
          alt="Logo da TrendlyAI" 
          className="w-48 mb-10 object-cover animate-fade-in-up"
          style={{ animationDelay: '50ms' }}
        />

        {/* Card de Login */}
        <div 
          className="w-full rounded-3xl p-8 flex flex-col items-center gap-6 liquid-glass animate-fade-in-up"
          style={{ animationDelay: '120ms' }}
        >
          {/* Botão Google */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-white text-sm font-medium google-btn hover:bg-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
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
            className="w-full flex items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '280ms' }}
          >
            <div className="w-full h-px bg-white/10"></div>
            <span className="text-xs text-white/50 tracking-wider">OU</span>
            <div className="w-full h-px bg-white/10"></div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div 
              className="flex flex-col gap-2 animate-fade-in-up"
              style={{ animationDelay: '360ms' }}
            >
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 form-input"
              />
            </div>
            <div 
              className="flex flex-col gap-2 animate-fade-in-up"
              style={{ animationDelay: '440ms' }}
            >
              <input
                type="password"
                name="password"
                placeholder="Senha"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 form-input"
              />
            </div>

            <button 
              type="submit"
              className="w-full text-white text-[15px] font-semibold py-3 rounded-xl primary-action-btn shadow-lg mt-2 animate-fade-in-up"
              style={{ animationDelay: '520ms' }}
            >
              Entrar
            </button>
          </form>

          {/* Links */}
          <div 
            className="flex flex-col items-center gap-3 text-center animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
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

          {/* Footer */}
          <div 
            className="flex items-center justify-center gap-2 text-xs text-white/40 mt-2 animate-fade-in-up"
            style={{ animationDelay: '680ms' }}
          >
            <Lock className="w-3 h-3" />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;