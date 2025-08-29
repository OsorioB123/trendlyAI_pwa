import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { OnboardingControlsProps } from '../../types';

const OnboardingControls: React.FC<OnboardingControlsProps> = ({
  currentSlide,
  totalSlides,
  onNext,
  onSkip,
  onDotClick,
  isLastSlide
}) => {
  return (
    <div className="flex-shrink-0 mt-8">
      {/* Dots Indicator */}
      <div className="flex items-center space-x-2 mb-10 fade-in-up" style={{ animationDelay: '0.3s' }}>
        {Array.from({ length: totalSlides }, (_, index) => {
          const slideNumber = index + 1;
          const isActive = currentSlide === slideNumber;
          
          return (
            <div
              key={slideNumber}
              className="slide-dot"
              style={{
                width: isActive ? '24px' : '6px',
                backgroundColor: isActive ? 'white' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer'
              }}
              onClick={() => onDotClick(slideNumber)}
            />
          );
        })}
      </div>

      {/* Botões de Controle */}
      <div className="flex items-center justify-between fade-in-up" style={{ animationDelay: '0.45s' }}>
        <button
          onClick={onSkip}
          className="text-white/70 hover:text-white px-6 py-3.5 rounded-full font-medium transition-colors"
        >
          Pular
        </button>
        
        <button
          onClick={onNext}
          className="primary-button-glow"
        >
          <div className="border-glow" />
          <span className="relative z-10 flex items-center">
            {isLastSlide ? (
              <>
                Começar
                <Check className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </span>
        </button>
      </div>

      {/* Home Indicator */}
      <div className="w-[134px] h-[5px] bg-white/40 rounded-full mx-auto mt-8" />
    </div>
  );
};

export default OnboardingControls;