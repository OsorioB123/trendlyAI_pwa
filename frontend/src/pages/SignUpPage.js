import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação do Nome
    if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome parece curto demais.';
    }

    // Validação do E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.';
    }

    // Validação da Senha
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres e 1 número.';
    }

    // Validação dos Termos
    if (!formData.terms) {
      newErrors.terms = 'Você deve aceitar os termos para continuar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      console.log('Formulário válido! Enviando para o backend...', formData);
      // TODO: Implementar lógica de criação de conta
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

        {/* Card de Cadastro */}
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
            <h2 
              className="text-2xl font-semibold tracking-tight mt-6 font-geist animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              Crie sua Conta
            </h2>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col mt-6">
            <div className="space-y-4">
              {/* Campo Nome */}
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
                  className={`form-input w-full rounded-xl px-4 py-2.5 text-sm text-white ${errors.name ? 'input-error' : ''}`}
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className={`error-message text-rose-400 text-xs ${errors.name ? 'show' : ''}`}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Campo E-mail */}
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
                  className={`form-input w-full rounded-xl px-4 py-2.5 text-sm text-white ${errors.email ? 'input-error' : ''}`}
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className={`error-message text-rose-400 text-xs ${errors.email ? 'show' : ''}`}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Campo Senha */}
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
                  className={`form-input w-full rounded-xl px-4 py-2.5 text-sm text-white ${errors.password ? 'input-error' : ''}`}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className={`error-message text-rose-400 text-xs ${errors.password ? 'show' : ''}`}>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Campo Termos */}
            <div 
              className="mt-6 animate-fade-in-up"
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="custom-checkbox h-4 w-4 mt-0.5 rounded-sm shrink-0"
                  required
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <label htmlFor="terms" className="ml-3 text-xs text-white/70">
                  Eu aceito os{' '}
                  <a href="#" className="font-semibold text-white hover:underline">
                    Termos de Serviço
                  </a>
                  {' '}e a{' '}
                  <a href="#" className="font-semibold text-white hover:underline">
                    Política de Privacidade
                  </a>
                  .
                </label>
              </div>
              {errors.terms && (
                <p className={`error-message text-rose-400 text-xs ml-7 ${errors.terms ? 'show' : ''}`}>
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Botão de Ação */}
            <div className="mt-auto pt-4">
              <button 
                type="submit"
                className="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up"
                style={{ animationDelay: '800ms' }}
              >
                Criar Conta
              </button>
            </div>
          </form>

          {/* Footer */}
          <div 
            className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up"
            style={{ animationDelay: '900ms' }}
          >
            <Lock className="w-3 h-3" />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;