'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ArrowRight } from 'lucide-react'
import { useBackground } from '../../contexts/BackgroundContext'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/layout/Header'
import { HeaderVariant } from '../../types/header'
import TrackCard from '../../components/cards/TrackCard'
import ToolCard from '../../components/cards/ToolCard'
import ToolModal from '../../components/modals/ToolModal'
import Carousel from '../../components/common/Carousel'
import ProtectedRoute from '../../components/auth/ProtectedRoute'
import { Track } from '../../types/track'
import { Tool } from '../../types/tool'

// Mock data - será substituído por dados reais futuramente
const MOCK_TRACKS: Track[] = [
  {
    id: 1,
    title: 'Marketing Digital para Iniciantes',
    progress: 70,
    backgroundImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80'
  },
  {
    id: 2,
    title: 'Análise de Dados com Google Analytics',
    progress: 35,
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
  },
  {
    id: 3,
    title: 'Gestão de Redes Sociais',
    progress: 55,
    backgroundImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80'
  },
  {
    id: 4,
    title: 'Planejamento Estratégico Digital',
    progress: 90,
    backgroundImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  }
]

const MOCK_RECOMMENDED_TRACKS: Track[] = [
  {
    id: 5,
    title: 'Funil de Vendas para E-commerce',
    tags: ['Vendas', 'Intermediário'],
    backgroundImage: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80'
  },
  {
    id: 6,
    title: 'Email Marketing Efetivo',
    tags: ['Email', 'Iniciante'],
    backgroundImage: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80'
  },
  {
    id: 7,
    title: 'SEO para Negócios Locais',
    tags: ['SEO', 'Intermediário'],
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
  }
]

const MOCK_TOOLS: Tool[] = [
  {
    id: 1,
    title: 'Crie um Roteiro Viral em 30 Segundos',
    description: 'Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.',
    tags: ['roteiro', 'storytelling'],
    compatibility: ['ChatGPT', 'Claude', 'Gemini'],
    content: 'Você é um especialista em storytelling viral para redes sociais.\n\nCONTEXTO:\n- Tema: [TEMA]\n- Público-alvo: [PÚBLICO-ALVO]\n- Tom de voz: [TOM DE VOZ]\n- Duração: 30-60 segundos\n\nESTRUTURA OBRIGATÓRIA:\n1. GANCHO (0-3s): Uma frase impactante que pare o scroll\n2. DESENVOLVIMENTO (3-45s): Apresente o problema/solução/história\n3. CALL TO ACTION (45-60s): Convide para ação específica\n\nCRITÉRIOS DE SUCESSO:\n- Use linguagem simples e direta\n- Inclua elementos de curiosidade ou surpresa\n- Termine com uma pergunta ou convite à interação\n- Mantenha o ritmo acelerado\n\nCrie o roteiro seguindo exatamente esta estrutura.',
    how_to_use: 'Substitua [TEMA], [PÚBLICO-ALVO] e [TOM DE VOZ] pelos seus dados específicos antes de usar o prompt.'
  },
  {
    id: 2,
    title: 'Crie Títulos Otimizados para SEO',
    description: 'Use este prompt para gerar títulos magnéticos e otimizados para mecanismos de busca.',
    tags: ['seo', 'títulos'],
    compatibility: ['ChatGPT', 'Claude'],
    content: 'Você é um especialista em SEO e copywriting.\n\nCrie 5 títulos SEO-otimizados para o seguinte conteúdo:\n\n[CONTEÚDO]: {seu_conteudo_aqui}\n[PALAVRA-CHAVE]: {palavra_chave_principal}\n\nDIRETRIZES:\n- Máximo 60 caracteres\n- Inclua a palavra-chave principal no início\n- Use power words (como \'definitivo\', \'completo\', \'secreto\')\n- Crie urgência ou curiosidade\n- Seja específico com números quando possível\n\nRetorne 5 opções numeradas com explicação do por que cada uma funciona.',
    how_to_use: 'Substitua {seu_conteudo_aqui} e {palavra_chave_principal} pelas suas informações específicas.'
  },
  {
    id: 3,
    title: 'Copy de Vendas Irresistível',
    description: 'Crie textos persuasivos que convertem usando gatilhos mentais comprovados.',
    tags: ['copywriting', 'vendas'],
    compatibility: ['ChatGPT', 'Claude'],
    content: 'Você é um copywriter experiente especializado em vendas.\n\nEscreva uma copy de vendas persuasiva usando o framework AIDA:\n\n[PRODUTO/SERVIÇO]: {seu_produto_aqui}\n[PÚBLICO-ALVO]: {sua_persona_aqui}\n\nESTRUTURA AIDA:\n🎯 ATENÇÃO\n- Headline impactante\n- Estatística ou pergunta provocativa\n- Promessa específica\n\n🔥 INTERESSE\n- Desenvolva o problema\n- Conte uma história relacionável\n- Apresente credibilidade\n\n💎 DESEJO\n- Benefícios transformadores\n- Prova social (depoimentos)\n- Urgência/escassez\n\n⚡ AÇÃO\n- Call-to-action claro\n- Garantia/redução de risco\n- Instruções específicas\n\nCopy completa otimizada para conversão.',
    how_to_use: 'Substitua {seu_produto_aqui} e {sua_persona_aqui} pelas informações do seu negócio.'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { profile } = useAuth()
  const [greeting, setGreeting] = useState('Boa tarde')
  const [commandInput, setCommandInput] = useState('')
  const [showIcebreakers, setShowIcebreakers] = useState(false)
  const [isCommandFocused, setIsCommandFocused] = useState(false)
  const [showToolModal, setShowToolModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<number[]>([])
  const [favoriteToolIds, setFavoriteToolIds] = useState<number[]>([])

  const icebreakers = [
    'Me dê ideias para um vídeo',
    'Monte um roteiro para Reels', 
    'Crie um plano de estudos'
  ]

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours()
    let greetingText = "Boa noite"
    if (hour >= 5 && hour < 12) greetingText = "Bom dia"
    else if (hour >= 12 && hour < 18) greetingText = "Boa tarde"
    setGreeting(greetingText)
  }, [])

  const handleCommandFocus = () => {
    setIsCommandFocused(true)
    setShowIcebreakers(true)
  }

  const handleCommandBlur = () => {
    setTimeout(() => {
      setIsCommandFocused(false)
      setShowIcebreakers(false)
    }, 150)
  }

  const handleIcebreakerClick = (text: string) => {
    setCommandInput(text)
    setShowIcebreakers(false)
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commandInput.trim()) {
      // Navigate to chat with the message
      router.push(`/chat?message=${encodeURIComponent(commandInput.trim())}`)
    }
  }

  const handleTrackClick = (track: Track) => {
    console.log('Track clicked:', track)
    // Navegar para página da trilha específica
    router.push(`/track/${track.id}`)
  }

  const handleToolClick = (tool: Tool) => {
    console.log('Tool clicked:', tool)
    setSelectedTool(tool)
    setShowToolModal(true)
  }

  const handleTrackFavorite = async (track: Track) => {
    console.log('Track favorite toggled:', track)
    setFavoriteTrackIds(prev => 
      prev.includes(track.id) 
        ? prev.filter(id => id !== track.id)
        : [...prev, track.id]
    )
    // TODO: Integrar com backend/localStorage para persistir favoritos
  }

  const handleToolFavorite = async (tool: Tool) => {
    console.log('Tool favorite toggled:', tool)
    setFavoriteToolIds(prev => 
      prev.includes(tool.id) 
        ? prev.filter(id => id !== tool.id)
        : [...prev, tool.id]
    )
    // TODO: Integrar com backend/localStorage para persistir favoritos
  }

  const handleToolCopy = (tool: Tool) => {
    if (tool.content) {
      navigator.clipboard.writeText(tool.content)
      console.log('Tool content copied:', tool.title)
      // TODO: Mostrar toast de confirmação
    }
  }

  const closeToolModal = () => {
    setShowToolModal(false)
    setSelectedTool(null)
  }

  const userName = profile?.display_name || 'Usuário'

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white/10 selection:text-white"
        style={{
          backgroundImage: `url("${currentBackground.value}?w=800&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
        
        {/* Header */}
        <Header variant={HeaderVariant.PRIMARY} />
        
        {/* Header spacer */}
        <div style={{ height: '80px' }}></div>

        <main className="w-full mx-auto">
          <div className="max-w-5xl relative mr-auto ml-auto px-4">
            
            {/* Hero Section */}
            <div className="min-h-[40vh] flex flex-col items-center justify-center mt-12 mb-6">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-semibold text-white tracking-tight font-sans">
                  {greeting.split('').map((char, index) => (
                    <span
                      key={index}
                      className="inline-block animate-fade-in"
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}, {userName}
                </h2>
              </div>
              
              <div className="w-full max-w-2xl mr-auto ml-auto">
                {/* Icebreakers */}
                {showIcebreakers && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {icebreakers.map((text, index) => (
                      <button
                        key={text}
                        className="px-4 py-2 text-sm font-medium rounded-full backdrop-blur-lg bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handleIcebreakerClick(text)}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* FIXED: Search/Command Bar - Exact match to HTML reference */}
                <div className={`enhanced-search-bar search-glow fluid-motion transition-all duration-[400ms] ${isCommandFocused ? 'scale-[1.02]' : ''}`}>
                  <form onSubmit={handleCommandSubmit}>
                    <div className={`flex gap-3 backdrop-blur-md border rounded-2xl p-4 items-center transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isCommandFocused ? 'border-white/30 bg-white/15' : 'border-white/15 bg-white/10'}`}>
                      <input
                        type="text"
                        placeholder="O que vamos criar hoje?"
                        className="w-full bg-transparent border-none text-white placeholder-white/60 focus:outline-none text-base"
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        onFocus={handleCommandFocus}
                        onBlur={handleCommandBlur}
                      />
                      <button 
                        type="submit" 
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/15 hover:bg-white/15 backdrop-blur-lg transition-all duration-300 fluid-motion hover:scale-110 active:scale-95"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-10 mb-32">
              
              {/* Continue Sua Trilha Section */}
              <section className="mb-20">
                <div className="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                  <h2 className="text-xl font-medium tracking-tight font-sans">Continue sua Trilha</h2>
                  <button 
                    onClick={() => router.push('/tracks')}
                    className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Carousel id="continue-tracks-carousel" className="pb-2">
                  {MOCK_TRACKS.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      variant="compact"
                      onClick={handleTrackClick}
                      onFavorite={handleTrackFavorite}
                      isFavorited={favoriteTrackIds.includes(track.id)}
                    />
                  ))}
                </Carousel>
              </section>

              {/* Recommended Tracks Section */}
              <section className="mb-20">
                <div className="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                  <h2 className="text-xl font-medium tracking-tight font-sans">Trilhas recomendadas pra você</h2>
                  <button 
                    onClick={() => router.push('/tracks')}
                    className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Carousel id="recommended-tracks-carousel" className="pb-2">
                  {MOCK_RECOMMENDED_TRACKS.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      variant="full"
                      onClick={handleTrackClick}
                      onFavorite={handleTrackFavorite}
                      isFavorited={favoriteTrackIds.includes(track.id)}
                    />
                  ))}
                </Carousel>
              </section>

              {/* Tools Section */}
              <section className="mb-20">
                <div className="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                  <h2 className="text-xl font-medium tracking-tight font-sans">Ferramentas recomendadas pra você</h2>
                  <button 
                    onClick={() => router.push('/tools')}
                    className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Carousel id="recommended-tools-carousel" className="pb-2">
                  {MOCK_TOOLS.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      variant="full"
                      onClick={handleToolClick}
                      onFavorite={handleToolFavorite}
                      onCopy={handleToolCopy}
                      isFavorited={favoriteToolIds.includes(tool.id)}
                    />
                  ))}
                </Carousel>
              </section>

            </div>
          </div>
        </main>

        {/* Tool Modal */}
        <ToolModal 
          tool={selectedTool}
          isOpen={showToolModal}
          onClose={closeToolModal}
        />

        <style jsx>{`
          @keyframes fade-in {
            from { 
              opacity: 0; 
              transform: translateY(10px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}