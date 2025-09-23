'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DebugAuthPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (type: string, data: any) => {
    setResults(prev => [...prev, {
      type,
      timestamp: new Date().toISOString(),
      data
    }])
  }

  const testDirectSupabaseCall = async () => {
    setLoading(true)
    try {
      addResult('info', 'Testing direct Supabase signup...')
      
      const testEmail = `debug-${Date.now()}@gmail.com`
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            display_name: 'Debug Test User'
          }
        }
      })

      addResult('signup_result', {
        success: !signupError,
        email: testEmail,
        data: signupData,
        error: signupError?.message,
        user_id: signupData?.user?.id,
        user_created_at: signupData?.user?.created_at,
        user_confirmed_at: signupData?.user?.confirmed_at,
        session_exists: !!signupData?.session,
        user_metadata: signupData?.user?.user_metadata
      })

      if (signupData?.user?.id) {
        // Try to fetch the user immediately after creation using admin API
        addResult('info', 'Trying to fetch user from auth.users via admin API...')
        
        const adminResponse = await fetch('/api/auth/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getUserById', userId: signupData.user.id })
        })
        
        const adminResult = await adminResponse.json()
        addResult('admin_fetch', adminResult)
      }

    } catch (err) {
      addResult('error', `Exception: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const testListAllUsers = async () => {
    setLoading(true)
    try {
      addResult('info', 'Testing list all users via admin API...')
      
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'listUsers' })
      })
      
      const usersResult = await response.json()
      addResult('list_users', usersResult)

    } catch (err) {
      addResult('error', `Exception: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSupabaseConfig = async () => {
    setLoading(true)
    try {
      // Test server-side config via API
      const configResponse = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'testConfig' })
      })
      
      const serverConfig = await configResponse.json()
      
      addResult('config', {
        client_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        client_anon_key_prefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20),
        server_config: serverConfig
      })

      // Test basic connection
      addResult('info', 'Testing basic connection...')
      const { error } = await supabase.from('profiles').select('count').limit(1)
      
      addResult('connection_test', {
        success: !error,
        error: error?.message,
        can_access_profiles: !error
      })

    } catch (err) {
      addResult('error', `Exception: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Autenticação Supabase</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testSupabaseConfig}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50 mr-4"
          >
            {loading ? 'Testando...' : '🔧 Testar Configuração'}
          </button>
          
          <button
            onClick={testDirectSupabaseCall}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50 mr-4"
          >
            {loading ? 'Testando...' : '✅ Criar Usuário de Teste'}
          </button>

          <button
            onClick={testListAllUsers}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded disabled:opacity-50 mr-4"
          >
            {loading ? 'Testando...' : '📋 Listar Todos os Usuários'}
          </button>

          <button
            onClick={clearResults}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            🗑️ Limpar Resultados
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  result.type === 'error' ? 'bg-red-600' :
                  result.type === 'info' ? 'bg-blue-600' :
                  result.type === 'signup_result' ? 'bg-green-600' :
                  result.type === 'config' ? 'bg-purple-600' :
                  'bg-gray-600'
                }`}>
                  {result.type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {typeof result.data === 'string' ? (
                <p className="text-sm">{result.data}</p>
              ) : (
                <pre className="text-xs overflow-auto bg-gray-900 p-3 rounded">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400">Nenhum resultado ainda. Execute um teste acima.</p>
          </div>
        )}
      </div>
    </div>
  )
}
