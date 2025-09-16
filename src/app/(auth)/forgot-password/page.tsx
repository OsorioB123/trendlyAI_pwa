'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BackgroundOverlay from '../../../components/common/BackgroundOverlay'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, MailCheck, Lock } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.')
      setIsLoading(false)
      return
    }

    try {
      const { error: resetError } = await resetPassword(email)
      
      if (resetError) {
        console.error('Reset password error:', resetError)
        
        // Handle specific error types
        if (resetError.message.includes('user not found')) {
          setError('Não encontramos uma conta com este e-mail.')
        } else if (resetError.message.includes('rate limit')) {
          setError('Muitas tentativas. Tente novamente em alguns minutos.')
        } else {
          setError(resetError.message || 'Erro ao enviar e-mail. Tente novamente.')
        }
        return
      }

      console.log('Password reset email sent successfully')
      setIsEmailSent(true)
      
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Success state
  if (isEmailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-white p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 antialiased selection:bg-white/10 selection:text-white">
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
          <div className="w-full rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-2xl bg-white/10 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
              <MailCheck className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight mb-4 font-sans">
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
                href="/login"
                className="w-full flex items-center justify-center text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
              >
                Voltar para Login
              </Link>

              <button
                onClick={() => {
                  setIsEmailSent(false)
                  setEmail('')
                  setError('')
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
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans text-white p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 antialiased selection:bg-white/10 selection:text-white">
      {/* Background overlay */}
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

        {/* Reset Password Card */}
        <div className="w-full rounded-3xl p-8 flex flex-col animate-fade-in-up backdrop-blur-2xl bg-white/10 shadow-2xl">
          <div>
            <Link 
              href="/login"
              className="flex items-center text-white/60 hover:text-white text-sm font-medium gap-1.5 -ml-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Voltar para o login
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight mt-6 animate-fade-in-up font-sans">
              Recuperar Senha
            </h2>
            <p className="text-white/70 text-sm mt-2 animate-fade-in-up">
              Digite seu e-mail e enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div id="forgot-error" role="alert" className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            {/* Email Input */}
            <div className="animate-fade-in-up">
              <Label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                E-mail cadastrado
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-black/20 text-white placeholder-white/50 focus:bg-black/25"
                placeholder="seu@email.com"
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'forgot-error' : undefined}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full text-white text-[15px] font-semibold py-3 rounded-xl bg-white/10 shadow-lg hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl active:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none animate-fade-in-up"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar Instruções'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col items-center gap-3 text-center mt-6">
            <Link 
              href="/register"
              className="text-white/60 hover:text-white text-xs transition-colors duration-300 animate-fade-in-up"
            >
              Não tem uma conta?{' '}
              <span className="font-semibold text-white">Crie uma aqui</span>
            </Link>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-6 animate-fade-in-up">
            <Lock className="w-3 h-3" strokeWidth={1.5} />
            <span>Protegido por Supabase</span>
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
  )
}
