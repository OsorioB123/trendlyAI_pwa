'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { Loader } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireEmailConfirmed?: boolean
}

const ProtectedRoute = ({ children, requireEmailConfirmed = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login')
    return null
  }

  // Check email confirmation if required
  if (requireEmailConfirmed && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-4">Confirme seu E-mail</h2>
          <p className="text-white/70 mb-6">
            Por favor, confirme seu e-mail antes de acessar esta página. 
            Verifique sua caixa de entrada.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
