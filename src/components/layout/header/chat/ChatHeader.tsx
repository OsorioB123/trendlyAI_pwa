'use client'

import Image from 'next/image'
import { Menu, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatHeaderProps {
  onToggleSidebar: () => void
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  const router = useRouter()

  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 pt-3 md:px-6" data-testid="chat-header">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-4 py-3 text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                onToggleSidebar()
                return
              }
              router.push('/dashboard')
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-colors hover:bg-white/15"
            aria-label="Abrir menu"
            data-testid="chat-menu-button"
          >
            <Menu className="h-5 w-5 md:hidden" />
            <ChevronLeft className="hidden h-5 w-5 md:block" />
          </button>
          <button onClick={() => router.push('/dashboard')} className="hidden items-center transition-opacity hover:opacity-80 md:flex">
            <Image
              src="https://i.ibb.co/6JghTg2R/Sem-nome-Apresenta-o-43-64-x-40-px-cone-para-You-Tube.png"
              alt="TrendlyAI"
              width={140}
              height={36}
              className="h-7 w-auto"
            />
          </button>
        </div>

        <span className="text-sm uppercase tracking-[0.3em] text-white/60 md:text-white/40">
          Salina · Co-Piloto Criativo
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/settings')}
            className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 md:inline-flex"
          >
            Configurações
          </button>
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
            <Image
              src="https://i.ibb.co/Tx5Xxb2P/grad-1.webp"
              alt="Ambiente"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
