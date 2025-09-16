'use client'

import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center glass-light rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-3">Você está offline</h1>
        <p className="text-white/70 mb-6">
          Sem conexão com a internet. Algumas funcionalidades podem não estar disponíveis.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => location.reload()} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">
            Tentar novamente
          </button>
          <Link href="/" className="bg-white text-black px-4 py-2 rounded-lg font-medium">
            Ir para início
          </Link>
        </div>
      </div>
    </div>
  )
}

