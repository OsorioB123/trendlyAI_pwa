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

  return (
    <>
      {/* Background Images para slides 1, 2 e 4 */}
      {slides.map((slide) => (
        slide.backgroundImage && slide.id !== 3 && (
          <div
            key={`slide-bg-${slide.id}`}
            className={`slide-background ${currentSlide === slide.id ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
          />
        )
      ))}

      {/* Container de backgrounds para slide 3 */}
      <div className={`background-container ${currentSlide === 3 ? '' : 'hidden'}`}>
        {currentSlide === 3 && themes.map((theme) => (
          <div
            key={`bg-${theme.id}`}
            className={`background-layer ${selectedTheme === theme.id ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${theme.value})` }}
          />
        ))}
      </div>

      {/* Overlay gradiente */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

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