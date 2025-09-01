import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Settings, Crown, Calendar, Target, Award, ChevronRight } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant, User } from '../types/header';
import TrackCard from '../components/cards/TrackCard';
import ThemeSelector from '../components/onboarding/ThemeSelector';

// Mock data for user progress
const USER_TRACKS = [
  {
    id: 1,
    title: 'Marketing Digital para Iniciantes',
    progress: 70,
    backgroundImage: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    lastAccessed: '2 dias atrás'
  },
  {
    id: 2,
    title: 'Análise de Dados com Google Analytics',
    progress: 35,
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    lastAccessed: '5 dias atrás'
  },
  {
    id: 3,
    title: 'Gestão de Redes Sociais',
    progress: 55,
    backgroundImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02711?w=800&q=80',
    lastAccessed: '1 semana atrás'
  }
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Primeiro Passo', description: 'Completou a primeira trilha', icon: '🎯', unlocked: true },
  { id: 2, title: 'Explorador', description: 'Iniciou 3 trilhas diferentes', icon: '🧭', unlocked: true },
  { id: 3, title: 'Dedicado', description: 'Acessou a plataforma por 7 dias consecutivos', icon: '🔥', unlocked: false },
  { id: 4, title: 'Especialista', description: 'Completou 5 trilhas', icon: '🏆', unlocked: false }
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentBackground, setCurrentBackground } = useBackground();
  const [activeTab, setActiveTab] = useState('overview');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleTrackClick = (track) => {
    console.log('Track clicked:', track);
    navigate(`/track/${track.id}`);
  };

  const handleThemeChange = (theme) => {
    setCurrentBackground(theme);
    setShowThemeSelector(false);
    console.log('Theme changed to:', theme.name);
  };

  const stats = {
    completedTracks: USER_TRACKS.filter(t => t.progress === 100).length,
    inProgressTracks: USER_TRACKS.filter(t => t.progress > 0 && t.progress < 100).length,
    totalHours: 45,
    streakDays: 12
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Profile Header */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white/20">
                    <img 
                      src={User.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{User.name}</h1>
                    <p className="text-white/70 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      {User.title}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      Membro desde Janeiro 2024
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 sm:ml-auto">
                  <button 
                    onClick={() => setShowThemeSelector(!showThemeSelector)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors backdrop-blur-md"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Personalizar</span>
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors backdrop-blur-md"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Configurações</span>
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              {showThemeSelector && (
                <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Escolha seu tema</h3>
                  <ThemeSelector 
                    onThemeSelect={handleThemeChange}
                    selectedTheme={currentBackground}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.completedTracks}</p>
                  <p className="text-white/60 text-sm">Trilhas Concluídas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.inProgressTracks}</p>
                  <p className="text-white/60 text-sm">Em Andamento</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalHours}h</p>
                  <p className="text-white/60 text-sm">Tempo Total</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-400 text-lg">🔥</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.streakDays}</p>
                  <p className="text-white/60 text-sm">Dias de Sequência</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex gap-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-1">
              {[
                { id: 'overview', label: 'Visão Geral' },
                { id: 'tracks', label: 'Minhas Trilhas' },
                { id: 'achievements', label: 'Conquistas' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Atividade Recente</h3>
                <div className="space-y-3">
                  {USER_TRACKS.slice(0, 3).map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-500 to-emerald-400"></div>
                        <div>
                          <p className="text-white font-medium">{track.title}</p>
                          <p className="text-white/60 text-sm">Progresso: {track.progress}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-sm">{track.lastAccessed}</p>
                        <ChevronRight className="w-4 h-4 text-white/40 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('tracks')}
                  className="w-full mt-4 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors"
                >
                  Ver Todas as Trilhas
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tracks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Minhas Trilhas</h3>
                <button 
                  onClick={() => navigate('/tracks')}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors backdrop-blur-md"
                >
                  Explorar Mais Trilhas
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {USER_TRACKS.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    variant="compact"
                    onClick={handleTrackClick}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Conquistas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-xl border backdrop-blur-md ${
                      achievement.unlocked
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/5 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{achievement.title}</h4>
                        <p className="text-white/70 text-sm">{achievement.description}</p>
                        {achievement.unlocked && (
                          <span className="inline-block mt-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Desbloqueada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;