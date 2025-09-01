import React, { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import SlideContent from './SlideContent';
import OnboardingControls from './OnboardingControls';

const OnboardingSlider = ({
  slides,
  themes,
  currentSlide,
  selectedTheme,
  currentBackground,
  onNext,
  onSkip,
  onDotClick,
  onThemeSelect
}) => {
  const [themesInitialized, setThemesInitialized] = useState(false);

  // Inicializar tema selector quando chegar no slide 3
  useEffect(() => {
    if (currentSlide === 3 && !themesInitialized) {
      setThemesInitialized(true);
    }
  }, [currentSlide, themesInitialized]);

  // Determinar o background atual baseado no slide
  const getCurrentBackground = () => {
    const currentSlideData = slides.find(s => s.id === currentSlide);
    
    if (currentSlide === 3) {
      // No slide 3, usar o background selecionado
      return currentBackground?.value || 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp';
    } else if (currentSlideData?.backgroundImage) {
      // Slides 1, 2, 4 usam imagens específicas
      return currentSlideData.backgroundImage;
    }
    
    // Fallback para o background padrão
    return 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp';
  };

  return (
    <div
      className="onboarding-slider fixed inset-0 z-10"
      style={{ 
        backgroundImage: `url('${getCurrentBackground()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay gradiente */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Conteúdo principal */}
      <main className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-8 pb-10">
        <div className="relative flex-1 min-h-0">
          {/* Slides */}
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`slide ${currentSlide === slide.id ? 'active' : ''}`}
            >
              {slide.id === 3 ? (
                <ThemeSelector
                  themes={themes}
                  selectedTheme={selectedTheme}
                  onThemeSelect={onThemeSelect}
                />
              ) : (
                <SlideContent slide={slide} isActive={currentSlide === slide.id} />
              )}
            </div>
          ))}
        </div>

        {/* Controles */}
        <OnboardingControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onNext={onNext}
          onSkip={onSkip}
          onDotClick={onDotClick}
          isLastSlide={currentSlide === slides.length}
        />
      </main>
    </>
  );
};

export default OnboardingSlider;