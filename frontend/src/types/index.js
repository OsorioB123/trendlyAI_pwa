// TrendlyAI Types

export interface Theme {
  id: string;
  name: string;
  value: string;
}

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  backgroundImage?: string;
}

export interface OnboardingState {
  currentSlide: number;
  selectedTheme: string;
  isCompleted: boolean;
}

export interface SlideProps {
  slide: OnboardingSlide;
  isActive: boolean;
  onNext?: () => void;
}

export interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: string;
  onThemeSelect: (themeId: string) => void;
}

export interface OnboardingControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
  onDotClick: (slideIndex: number) => void;
  isLastSlide: boolean;
}