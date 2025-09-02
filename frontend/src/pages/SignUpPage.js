import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome parece curto demais.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.';
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres e 1 número.';
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = 'Você deve aceitar os termos para continuar.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate signup process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Formulário válido! Enviando para o backend...', formData);
      
      // Set authentication flag
      localStorage.setItem('trendlyai-user-authenticated', 'true');
      
      // Navigate to onboarding
      navigate('/onboarding');
      
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-['Inter'] text-white p-4 bg-black">
      {/* Background Image */}
      <div 
        className="fixed top-0 w-full h-screen bg-cover bg-center -z-10" 
        style={{
          backgroundImage: `url("${currentBackground.value}")`
        }}
      />

      <main className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <img 
          src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
          alt="Logo da TrendlyAI" 
          className="w-48 mb-10 animate-fade-in-up object-cover"
        />

        {/* Signup Card */}
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
            <h2 
              className="text-2xl font-semibold tracking-tight mt-6 animate-fade-in-up font-['Geist']" 
              style={{ animationDelay: '300ms' }}
            >
              Crie sua Conta
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow flex flex-col mt-6" noValidate>
            <div className="space-y-4">
              {/* Name Field */}
              <div 
                className="animate-fade-in-up" 
                style={{ animationDelay: '400ms' }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">
                  Seu nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 bg-black/20 border transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10 ${
                    errors.name ? 'border-rose-400' : 'border-white/15'
                  }`}
                  required
                />
                {errors.name && (
                  <p className="error-message show text-rose-400 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div 
                className="animate-fade-in-up" 
                style={{ animationDelay: '500ms' }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 bg-black/20 border transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10 ${
                    errors.email ? 'border-rose-400' : 'border-white/15'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="error-message show text-rose-400 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div 
                className="animate-fade-in-up" 
                style={{ animationDelay: '600ms' }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1.5">
                  Crie uma senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 bg-black/20 border transition-all duration-300 outline-none focus:bg-black/25 focus:border-white/40 focus:ring-4 focus:ring-white/10 ${
                    errors.password ? 'border-rose-400' : 'border-white/15'
                  }`}
                  required
                />
                {errors.password && (
                  <p className="error-message show text-rose-400 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div 
              className="mt-6 animate-fade-in-up" 
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="custom-checkbox h-4 w-4 mt-0.5 rounded-sm shrink-0 appearance-none bg-black/20 border border-white/20 transition-all duration-200 cursor-pointer checked:border-white/80 checked:bg-white"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-xs text-white/70">
                  Eu aceito os{' '}
                  <a href="#" className="font-semibold text-white hover:underline">
                    Termos de Serviço
                  </a>{' '}
                  e a{' '}
                  <a href="#" className="font-semibold text-white hover:underline">
                    Política de Privacidade
                  </a>
                  .
                </label>
              </div>
              {errors.terms && (
                <p className="error-message show text-rose-400 text-xs ml-7 mt-1">
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up bg-white/10 border border-white/20 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animationDelay: '800ms' }}
              >
                {isLoading ? 'Criando Conta...' : 'Criar Conta'}
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div 
            className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up" 
            style={{ animationDelay: '900ms' }}
          >
            <Lock className="w-3 h-3" strokeWidth={1.5} />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Efeito Liquid Glass para o card (Mantido e consistente) */
        .liquid-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Estilo customizado para os inputs (Consistente com Login) */
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

        /* Estilo para input com erro (Mantido para UX) */
        .input-error {
          border-color: #fb7185; /* Tailwind rose-400 */
        }

        /* Botão de Ação Principal (Consistente com Login) */
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

        /* Estilo para o checkbox customizado (ATUALIZADO) */
        .custom-checkbox {
          appearance: none; 
          -webkit-appearance: none;
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .custom-checkbox:checked {
          border-color: rgba(255, 255, 255, 0.8);
          background-color: #FFF;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Estilo para mensagens de erro com animação (Mantido) */
        .error-message {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out, margin-top 0.3s ease-out;
        }

        .error-message.show {
          max-height: 2.5rem; /* Aumentado para acomodar mensagens de senha mais longas */
          margin-top: 0.25rem;
        }

        /* Animação de entrada (Consistente com Login) */
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

export default SignUpPage;