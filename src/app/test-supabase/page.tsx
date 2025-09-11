'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      console.log('🔄 Testing Supabase connection...')
      
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      setResult({
        success: !error,
        data: data,
        error: error?.message,
        timestamp: new Date().toISOString()
      })
      
      console.log('✅ Supabase test result:', { data, error })
    } catch (err) {
      console.error('❌ Supabase test failed:', err)
      setResult({
        success: false,
        error: (err as Error).message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    try {
      console.log('🔄 Testing signup with dummy data...')
      
      const testEmail = `test-${Date.now()}@gmail.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            display_name: 'Test User'
          }
        }
      })
      
      setResult({
        type: 'signup',
        success: !error,
        data: data,
        error: error?.message,
        email: testEmail,
        timestamp: new Date().toISOString()
      })
      
      console.log('✅ Signup test result:', { data, error })
    } catch (err) {
      console.error('❌ Signup test failed:', err)
      setResult({
        type: 'signup',
        success: false,
        error: (err as Error).message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Teste de Conexão Supabase</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testando...' : 'Testar Conexão'}
          </button>
          
          <button
            onClick={testSignup}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50 ml-4"
          >
            {loading ? 'Testando...' : 'Testar Signup'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Resultado:</h2>
            <pre className="text-sm overflow-auto bg-gray-900 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-400">
          <h3 className="font-semibold mb-2">Configurações atuais:</h3>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  )
}