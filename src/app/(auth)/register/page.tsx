'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BackgroundOverlay from '../../../components/common/BackgroundOverlay'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../../../contexts/AuthContext'
import { ArrowLeft, Lock } from 'lucide-react'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface Errors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
  general?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, loading: authLoading, user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const hasCompletedOnboarding = localStorage.getItem('trendlyai-onboarding-completed')
      if (hasCompletedOnboarding) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    }
  }, [user, authLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): Errors => {
    const newErrors: Errors = {}

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres.'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.'
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres.'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.'
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = 'Você deve aceitar os termos para continuar.'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Starting registration process...')
      console.log('📋 Form data:', {
        name: formData.name,
        email: formData.email,
        passwordLength: formData.password.length,
        termsAccepted: formData.terms
      })

      // CORREÇÃO: Passar os dados do usuário corretamente
      const userData = {
        display_name: formData.name.trim()
      }
      
      console.log('📤 Calling signUp with userData:', userData)
      
      const { data, error } = await signUp(
        formData.email.trim(), 
        formData.password,
        userData // Agora está estruturado corretamente
      )
      
      console.log('📊 SignUp response:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        userEmail: data?.user?.email,
        userMetadata: data?.user?.user_metadata,
        needsConfirmation: data?.user && !data?.session,
        error: error?.message
      })
      
      if (error) {
        console.error('❌ Signup error details:', error)
        
        // Handle specific error types
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setErrors({ email: 'Este e-mail já está cadastrado. Tente fazer login.' })
        } else if (error.message.includes('Password should be at least')) {
          setErrors({ password: 'A senha deve ter no mínimo 6 caracteres.' })
        } else if (error.message.includes('Invalid email')) {
          setErrors({ email: 'E-mail inválido.' })
        } else if (error.message.includes('weak password')) {
          setErrors({ password: 'Senha muito fraca. Use uma senha mais forte.' })
        } else if (error.message.includes('signup_disabled')) {
          setErrors({ general: 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.' })
        } else {
          setErrors({ general: error.message || 'Erro ao criar conta. Tente novamente.' })
        }
        return
      }

      if (data?.user) {
        console.log('✅ User created successfully!')
        console.log('📧 Email confirmation required:', !data.user.email_confirmed_at)
        console.log('🔑 User ID:', data.user.id)
        console.log('📝 User metadata:', data.user.user_metadata)
        
        if (!data.user.email_confirmed_at) {
          // Email confirmation required
          console.log('📧 Showing email confirmation screen')
          setSuccess(true)
        } else {
          // Email already confirmed, redirect to onboarding
          console.log('🎉 Email already confirmed, redirecting to onboarding')
          localStorage.setItem('trendlyai-user-authenticated', 'true')
          router.push('/onboarding')
        }
      } else {
        console.error('❌ No user data returned from signup')
        setErrors({ general: 'Erro inesperado ao criar conta. Tente novamente.' })
      }
      
    } catch (error) {
      console.error('❌ Signup exception:', error)
      setErrors({ general: 'Erro inesperado. Tente novamente.' })
    } finally {
      console.log('✅ Registration process complete')
      setIsLoading(false)
    }
  }

  // Show loading spinner while checking authentication state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    )
  }

  // Success state - email confirmation required
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-white p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <BackgroundOverlay />

        <main className="w-full max-w-md flex flex-col items-center">
          {/* Logo */}
          <Image 
            src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
            alt="Logo da TrendlyAI" 
            width={800}
            height={200}
            className="w-48 mb-10 animate-fade-in-up object-cover"
          />

          {/* Success Card */}
        <div className="w-full liquid-glass rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-2xl bg-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Verifique seu E-mail
            </h2>

            <p className="text-white/70 mb-6 leading-relaxed">
              Enviamos um link de confirmação para{' '}
              <span className="font-semibold text-white">{formData.email}</span>.
              <br />
              Clique no link para ativar sua conta.
            </p>

            <div className="w-full space-y-4">
              <button
                onClick={() => router.push('/login')}
              className="w-full text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
              >
                Ir para Login
              </button>

              <p className="text-sm text-white/50">
                Não recebeu o e-mail? Verifique sua caixa de spam.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans text-white p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

      <main className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <Image 
          src="https://i.ibb.co/DfMChfL8/Trendly-AI-branco.webp?w=800&q=80" 
          alt="Logo da TrendlyAI" 
          width={800}
          height={200}
          className="w-48 mb-10 animate-fade-in-up object-cover"
        />

        {/* Signup Card */}
        <div className="w-full liquid-glass rounded-3xl p-8 flex flex-col animate-fade-in-up backdrop-blur-2xl bg-white/10 shadow-2xl">
          <div>
            <Link 
              href="/login"
              className="flex items-center text-white/60 hover:text-white text-sm font-medium gap-1.5 -ml-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Voltar para o login
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight mt-6 animate-fade-in-up">
              Crie sua Conta
            </h2>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div id="register-error" role="alert" className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-grow flex flex-col mt-6" noValidate>
            <div className="space-y-4">
              {/* Name Field */}
              <div className="animate-fade-in-up">
                <Label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">
                  Seu nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-black/20 text-white placeholder-white/50 focus:bg-black/25"
                  placeholder="Como devemos te chamar?"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="error-message show text-rose-400 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="animate-fade-in-up">
                <Label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">
                  Seu e-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-black/20 text-white placeholder-white/50 focus:bg-black/25"
                  placeholder="seu@email.com"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="error-message show text-rose-400 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-up">
                <Label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1.5">
                  Crie uma senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-black/20 text-white placeholder-white/50 focus:bg-black/25"
                  placeholder="Mínimo 6 caracteres"
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="error-message show text-rose-400 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="animate-fade-in-up">
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1.5">
                  Confirme a senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-black/20 text-white placeholder-white/50 focus:bg-black/25"
                  placeholder="Digite a senha novamente"
                  required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirm-error" className="error-message show text-rose-400 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="mt-6 animate-fade-in-up">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="custom-checkbox h-4 w-4 mt-0.5 rounded-sm shrink-0 appearance-none bg-black/20 transition-all duration-200 cursor-pointer checked:bg-white disabled:opacity-50"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-xs text-white/70">
                  Eu aceito os{' '}
                  <Link href="/terms" className="font-semibold text-white hover:underline">
                    Termos de Serviço
                  </Link>{' '}
                  e a{' '}
                  <Link href="/privacy" className="font-semibold text-white hover:underline">
                    Política de Privacidade
                  </Link>
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
                disabled={isLoading || !formData.email || !formData.password || !formData.name || !formData.terms}
                className="primary-action-btn w-full text-white text-[15px] font-semibold py-3 rounded-xl shadow-lg animate-fade-in-up bg-white/10 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando Conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40 animate-fade-in-up">
            <Lock className="w-3 h-3" strokeWidth={1.5} />
            <span>Protegido por Supabase</span>
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Efeito Liquid Glass para o card */
        .liquid-glass {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Estilo customizado para os inputs */
        .form-input {
          background-color: rgba(0, 0, 0, 0.2);
          border: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .form-input:focus {
          outline: none;
          background-color: rgba(0, 0, 0, 0.25);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        /* Botão de Ação Principal */
        .primary-action-btn {
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .primary-action-btn:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        .primary-action-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* Estilo para o checkbox customizado */
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

        /* Animação de entrada */
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
  )
}
