'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import { Loader, Sparkles, TrendingUp, Users, Zap } from 'lucide-react'

export default function Home() {
  const { user, loading, needsOnboarding } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      // Redirect authenticated users to appropriate destination
      const destination = needsOnboarding ? '/onboarding' : '/dashboard'
      console.log(`Redirecting authenticated user to ${destination}`)
      router.push(destination)
    }
  }, [user, loading, needsOnboarding, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, let the useEffect handle redirection
  // Show loading state while redirection happens to avoid flash
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Sparkles className="w-8 h-8 text-purple-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Crie Conteúdo
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Viral</span>
              <br />
              com IA
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              A plataforma brasileira de criação de conteúdo com inteligência artificial. 
              Transforme suas ideias em posts virais, stories envolventes e muito mais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Começar Gratuitamente
              </Link>
              <Link 
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/15 transition-all duration-300"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Por que escolher a TrendlyAI?
          </h2>
          <p className="text-xl text-white/70">
            Ferramentas poderosas para criadores brasileiros
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              IA Avançada
            </h3>
            <p className="text-white/70">
              Algoritmos de última geração treinados especialmente para o mercado brasileiro
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Conteúdo Viral
            </h3>
            <p className="text-white/70">
              Crie posts que engajam e conquistam sua audiência nas redes sociais
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Comunidade
            </h3>
            <p className="text-white/70">
              Aprenda com outros criadores e compartilhe suas experiências
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-12 border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/70 mb-8">
            Junte-se a milhares de criadores que já estão usando a TrendlyAI
          </p>
          <Link 
            href="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 TrendlyAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}