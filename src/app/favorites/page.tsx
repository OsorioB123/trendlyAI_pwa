'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Search, Filter } from 'lucide-react'
import Header from '../../components/layout/Header'
import ToolCard from '../../components/tools/ToolCard'
import TrackCard from '../../components/cards/TrackCard'
import { HeaderVariant } from '../../types/header'
import { Tool } from '../../types/tool'
import { Track } from '../../types/track'
import { useBackground } from '../../contexts/BackgroundContext'
import { useAuth } from '../../contexts/AuthContext'
import ProtectedRoute from '../../components/auth/ProtectedRoute'

const MOCK_FAVORITE_TOOLS: Tool[] = [
  {
    id: "p01",
    title: "Roteiro Viral em 30 Segundos",
    description: "Transforme qualquer ideia em uma estrutura de roteiro de 3 atos para engajamento máximo.",
    category: "Copywriting",
    type: "text-generation",
    compatibility: ["chatgpt", "claude", "gemini"],
    tags: ["roteiro", "storytelling", "reels"],
    content: "Prompt content here...",
    isFavorite: true,
    isEdited: false
  },
  {
    id: "p02",
    title: "Copy de Vendas Irresistível",
    description: "Crie textos persuasivos que convertem usando gatilhos mentais comprovados.",
    category: "Marketing",
    type: "text-generation",
    compatibility: ["chatgpt", "claude"],
    tags: ["copywriting", "vendas", "conversão"],
    content: "Prompt content here...",
    isFavorite: true,
    isEdited: false
  }
]

const MOCK_FAVORITE_TRACKS: Track[] = [
  {
    id: 1,
    title: 'Marketing Digital para Iniciantes',
    progress: 70,
    backgroundImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    tags: ['Marketing', 'Iniciante'],
    categories: ['Marketing'],
    level: 'Iniciante'
  },
  {
    id: 2,
    title: 'Gestão de Redes Sociais',
    progress: 55,
    backgroundImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    tags: ['Social Media', 'Intermediário'],
    categories: ['Social Media'],
    level: 'Intermediário'
  }
]

export default function FavoritesPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<'tools' | 'tracks'>('tools')
  const [searchTerm, setSearchTerm] = useState('')
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>(MOCK_FAVORITE_TOOLS)
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>(MOCK_FAVORITE_TRACKS)

  const handleToolFavorite = (tool: Tool) => {
    setFavoriteTools(prev => prev.filter(t => t.id !== tool.id))
  }

  const handleTrackFavorite = (track: Track) => {
    setFavoriteTracks(prev => prev.filter(t => t.id !== track.id))
  }

  const handleToolClick = (tool: Tool) => {
    // Open tool modal or navigate to tool detail
    console.log('Tool clicked:', tool)
  }

  const handleTrackClick = (track: Track) => {
    router.push(`/tracks/${track.id}`)
  }

  const filteredTools = favoriteTools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredTracks = favoriteTracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        {/* Header */}
        <Header variant={HeaderVariant.SECONDARY} />

        {/* Main Content */}
        <main className="pt-20 pb-24 md:pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-400 fill-red-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Meus Favoritos</h1>
                  <p className="text-white/70">Suas ferramentas e trilhas favoritas em um só lugar</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-white/5 backdrop-blur-xl rounded-xl mb-8 w-fit">
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'tools'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Ferramentas ({favoriteTools.length})
              </button>
              <button
                onClick={() => setActiveTab('tracks')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'tracks'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Trilhas ({favoriteTracks.length})
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Buscar favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>

            {/* Content */}
            {activeTab === 'tools' && (
              <div>
                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        onClick={handleToolClick}
                        onFavorite={handleToolFavorite}
                        isFavorited={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchTerm ? 'Nenhuma ferramenta encontrada' : 'Nenhuma ferramenta favorita'}
                    </h3>
                    <p className="text-white/70 max-w-md mx-auto">
                      {searchTerm 
                        ? 'Tente ajustar os termos da pesquisa'
                        : 'Comece explorando as ferramentas e adicione suas favoritas aqui'
                      }
                    </p>
                    {!searchTerm && (
                      <button 
                        onClick={() => router.push('/tools')}
                        className="mt-6 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all"
                      >
                        Explorar Ferramentas
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tracks' && (
              <div>
                {filteredTracks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTracks.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        onClick={() => handleTrackClick(track)}
                        onFavorite={() => handleTrackFavorite(track)}
                        isFavorited={true}
                        variant="full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchTerm ? 'Nenhuma trilha encontrada' : 'Nenhuma trilha favorita'}
                    </h3>
                    <p className="text-white/70 max-w-md mx-auto">
                      {searchTerm 
                        ? 'Tente ajustar os termos da pesquisa'
                        : 'Comece explorando as trilhas e adicione suas favoritas aqui'
                      }
                    </p>
                    {!searchTerm && (
                      <button 
                        onClick={() => router.push('/tracks')}
                        className="mt-6 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all"
                      >
                        Explorar Trilhas
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
