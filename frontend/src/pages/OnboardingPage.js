import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackground } from '../contexts/BackgroundContext';
import OnboardingSlider from '../components/onboarding/OnboardingSlider';
import '../styles/onboarding.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { changeBackground, availableBackgrounds } = useBackground();
  
  const [state, setState] = useState({
    currentSlide: 1,
    selectedTheme: 'default',
    isCompleted: false
  });

  // Dados dos slides
  const slides = [
    {
      id: 1,
      title: 'A tela em branco. O maior inimigo da criatividade.',
      description: 'Por anos, as ferramentas nos deram mais botões, mas nunca uma direção. Elas nos deixaram sozinhos com o nosso maior desafio.',
      backgroundImage: 'https://i.ibb.co/602fn0G5/tela-1.webp'
    },
    {
      id: 2,
      title: 'E se você tivesse um gênio como co-piloto?',
      description: 'Apresentando Salina, sua mente estratégica pessoal. Ela não te dá ferramentas. Ela conversa, guia e co-cria com você, transformando intenção em excelência.',
      backgroundImage: 'https://i.ibb.co/0j3FZ1fm/tela-2.webp'
    },
    {
      id: 3,
      title: 'Defina a energia do seu estúdio.',
      description: 'Escolha o ambiente que inspira seu trabalho hoje.'
    },
    {
      id: 4,
      title: 'Bem-vindo ao seu novo estúdio criativo.',
      description: 'Explore trilhas de aprendizado, domine ferramentas de precisão e converse com a Salina para transformar qualquer ideia em seu próximo grande projeto. O poder é seu.',
      backgroundImage: 'https://i.ibb.co/zTV6nP2q/tela-4.webp'
    }
  ];

  const handleNext = () => {
    if (state.currentSlide < slides.length) {
      setState(prev => ({ ...prev, currentSlide: prev.currentSlide + 1 }));
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleDotClick = (slideIndex) => {
    setState(prev => ({ ...prev, currentSlide: slideIndex }));
  };

  const handleThemeSelect = (themeId) => {
    setState(prev => ({ ...prev, selectedTheme: themeId }));
    changeBackground(themeId);
  };

  const handleComplete = () => {
    // Salvar que o onboarding foi concluído
    localStorage.setItem('trendlyai-onboarding-completed', 'true');
    
    // Aplicar tema selecionado
    changeBackground(state.selectedTheme);
    
    console.log(`Onboarding concluído! Tema selecionado: ${state.selectedTheme}`);
    
    // Navegar para a próxima página (será definida futuramente)
    navigate('/home'); // ou rota apropriada
  };

  return (
    <div className="onboarding-container">
      <OnboardingSlider
        slides={slides}
        themes={availableBackgrounds}
        currentSlide={state.currentSlide}
        selectedTheme={state.selectedTheme}
        onNext={handleNext}
        onSkip={handleSkip}
        onDotClick={handleDotClick}
        onThemeSelect={handleThemeSelect}
      />
    </div>
  );
};

export default OnboardingPage;