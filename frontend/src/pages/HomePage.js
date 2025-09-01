import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight } from 'lucide-react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';
import TrackCard from '../components/cards/TrackCard';
import ToolCard from '../components/cards/ToolCard';
import ToolModal from '../components/modals/ToolModal';
import Carousel from '../components/common/Carousel';
import '../styles/home.css';

// Mock data - será substituído por dados reais futuramente
const MOCK_TRACKS = [
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
];

const MOCK_RECOMMENDED_TRACKS = [
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
];

const MOCK_TOOLS = [
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
];

const HomePage = () => {
  const navigate = useNavigate();
  const { currentBackground } = useBackground();
  const [greeting, setGreeting] = useState('Boa tarde, Sofia');
  const [commandInput, setCommandInput] = useState('');
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [isCommandFocused, setIsCommandFocused] = useState(false);
  const [showToolModal, setShowToolModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const icebreakers = [
    'Me dê ideias para um vídeo',
    'Monte um roteiro para Reels', 
    'Crie um plano de estudos'
  ];

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = "Boa noite, Sofia";
    if (hour >= 5 && hour < 12) greetingText = "Bom dia, Sofia";
    else if (hour >= 12 && hour < 18) greetingText = "Boa tarde, Sofia";
    setGreeting(greetingText);
  }, []);

  const handleCommandFocus = () => {
    setIsCommandFocused(true);
    setShowIcebreakers(true);
  };

  const handleCommandBlur = () => {
    setTimeout(() => {
      setIsCommandFocused(false);
      setShowIcebreakers(false);
    }, 150);
  };

  const handleIcebreakerClick = (text) => {
    setCommandInput(text);
    setShowIcebreakers(false);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (commandInput.trim()) {
      console.log('Command submitted:', commandInput);
      // TODO: Implementar lógica de comando
    }
  };

  const handleTrackClick = (track) => {
    console.log('Track clicked:', track);
    // Navegar para página da trilha específica
    navigate(`/track/${track.id}`);
  };

  const handleToolClick = (tool) => {
    console.log('Tool clicked:', tool);
    setSelectedTool(tool);
    setShowToolModal(true);
  };

  const handleToolFavorite = (tool) => {
    console.log('Tool favorited:', tool);
    // TODO: Implementar sistema de favoritos
  };

  const handleToolCopy = (tool) => {
    if (tool.content) {
      navigator.clipboard.writeText(tool.content);
      console.log('Tool content copied:', tool.title);
      // TODO: Mostrar toast de confirmação
    }
  };

  const closeToolModal = () => {
    setShowToolModal(false);
    setSelectedTool(null);
  };

  return (
    <div 
      className="home-container"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
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
            <div className="mb-6 text-center animate-entry">
              <h2 className="text-3xl font-semibold text-white tracking-tight font-geist">
                {greeting.split('').map((char, index) => (
                  <span
                    key={index}
                    className="greeting-char"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h2>
            </div>
            
            <div className="w-full max-w-2xl mr-auto ml-auto animate-entry delay-1">
              {/* Icebreakers */}
              {showIcebreakers && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {icebreakers.map((text, index) => (
                    <button
                      key={text}
                      className="hs-chip"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleIcebreakerClick(text)}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Search/Command Bar */}
              <div className={`hs-outline ${isCommandFocused ? 'is-active' : ''}`}>
                <form onSubmit={handleCommandSubmit}>
                  <div className="flex gap-3 bg-white/10 border-white/14 border rounded-2xl p-4 backdrop-blur-md items-center">
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
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/14 hover:bg-white/15 liquid-glass-pill"
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
            <section className="animate-entry delay-2 mb-20">
              <div className="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                <h2 className="text-xl font-medium tracking-tight font-geist">Continue sua Trilha</h2>
                <button 
                  onClick={() => navigate('/tracks')}
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <span>Ver todos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <Carousel>
                {MOCK_TRACKS.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    variant="compact"
                    onClick={handleTrackClick}
                  />
                ))}
              </Carousel>
            </section>

            {/* Recommended Tracks Section */}
            <section className="animate-entry delay-3 mb-20">
              <div className="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                <h2 className="text-xl font-medium tracking-tight font-geist">Trilhas recomendadas pra você</h2>
                <button 
                  onClick={() => navigate('/tracks')}
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <span>Ver todos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <Carousel>
                {MOCK_RECOMMENDED_TRACKS.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    variant="full"
                    onClick={handleTrackClick}
                  />
                ))}
              </Carousel>
            </section>

            {/* Tools Section */}
            <section className="animate-entry delay-4 mb-20">
              <div className="flex flex-wrap justify-between items-baseline mb-4 gap-y-2">
                <h2 className="text-xl font-medium tracking-tight font-geist">Ferramentas recomendadas pra você</h2>
                <button 
                  onClick={() => navigate('/tools')}
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <span>Ver todos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <Carousel>
                {MOCK_TOOLS.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    variant="full"
                    onClick={handleToolClick}
                    onFavorite={handleToolFavorite}
                    onCopy={handleToolCopy}
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
    </div>
  );
};

export default HomePage;