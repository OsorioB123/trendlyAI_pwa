# TrendlyAI Onboarding UI Design Specification

## Design Overview

The TrendlyAI onboarding experience is a sophisticated 4-slide flow that combines storytelling, visual impact, and user personalization. The design recreates a cinematic presentation with advanced visual effects including liquid glass components, 3D sphere animations, and dynamic background persistence for the theme selection system.

### Visual Design Approach
- **Cinematic Storytelling**: Progressive narrative that introduces TrendlyAI's value proposition through compelling visuals and copy
- **Advanced Material Design**: Liquid glass effects, backdrop blur, and sophisticated transparency layers
- **3D Visual Enhancement**: Sphere animations with hover effects and zoom transitions for theme selection
- **Mobile-First Responsive**: Seamless adaptation from mobile scroll gallery to desktop grid layout

### Key Design Decisions
- **Background Persistence**: Selected theme background must persist across all PWA pages after onboarding
- **Progressive Disclosure**: Each slide reveals information incrementally with fade-in animations
- **Accessibility First**: All animations respect user preferences and provide fallback experiences
- **Performance Optimized**: Effects implemented with CSS transforms and hardware acceleration

## Component Architecture

### Primary Components Structure

```typescript
// Main onboarding component hierarchy
OnboardingContainer
├── SlideBackgroundManager    // Handles background transitions
├── OnboardingSlides
│   ├── SlideOne             // Value proposition introduction
│   ├── SlideTwo             // Salina AI introduction
│   ├── SlideThree           // Theme selection system
│   └── SlideFour            // Welcome and completion
├── OnboardingControls
│   ├── ProgressDots         // Visual progress indicator
│   ├── NavigationButtons    // Next/Skip buttons with effects
│   └── HomeIndicator        // iOS-style home indicator
└── ThemeManagement
    ├── ThemeProvider        // Global theme state management
    ├── ThemeSphereGrid      // Desktop grid layout
    ├── ThemeSphereGallery   // Mobile scroll layout
    └── ThemePersistence     // Background persistence logic
```

## State Management Strategy

### Core State Interface
```typescript
interface OnboardingState {
  currentSlide: number;
  selectedTheme: ThemeOption;
  isTransitioning: boolean;
  slideDirection: 'forward' | 'backward';
  hasCompletedOnboarding: boolean;
  userIntent?: 'creator' | 'learner' | 'business';
}

interface ThemeOption {
  id: string;
  name: string;
  value: string; // Background image URL
  isDefault?: boolean;
}
```

### State Management Implementation
```typescript
// useOnboarding.tsx
export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    currentSlide: 1,
    selectedTheme: THEMES[0], // Default theme
    isTransitioning: false,
    slideDirection: 'forward',
    hasCompletedOnboarding: false,
  });

  const nextSlide = useCallback(() => {
    if (state.currentSlide < 4) {
      setState(prev => ({
        ...prev,
        currentSlide: prev.currentSlide + 1,
        slideDirection: 'forward',
        isTransitioning: true,
      }));
    }
  }, [state.currentSlide]);

  const selectTheme = useCallback((theme: ThemeOption) => {
    setState(prev => ({ ...prev, selectedTheme: theme }));
    // Persist theme globally
    document.documentElement.setAttribute('data-theme-bg', theme.value);
    localStorage.setItem('trendly-theme', JSON.stringify(theme));
  }, []);

  return { state, nextSlide, selectTheme, /* other actions */ };
};
```

## CSS/Styling Strategy

### Design Token System
```css
/* Custom CSS properties for onboarding */
:root {
  /* Brand Colors */
  --brand-glow-color: white;
  --brand-primary: #efd135;
  --bg-main: #101014;
  
  /* Glass Effect */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.14);
  --glass-backdrop: blur(12px);
  
  /* Animation Timing */
  --transition-smooth: 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-bounce: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-quick: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
}
```

### Advanced Visual Effects Implementation

#### Liquid Glass Button Component
```css
.primary-button-glow {
  position: relative;
  overflow: hidden;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  padding: 0.875rem 2rem;
  transition: all var(--transition-quick);
  backdrop-filter: var(--glass-backdrop);
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
}

.primary-button-glow:hover {
  transform: translateY(-3px) scale(1.03);
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.primary-button-glow:active {
  transform: scale(0.98);
  transition-duration: 0.1s;
}

/* Animated border glow effect */
.border-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.primary-button-glow:hover .border-glow {
  opacity: 1;
}

.border-glow::before {
  content: '';
  position: absolute;
  inset: -150%;
  background: conic-gradient(
    from 180deg at 50% 50%, 
    var(--brand-glow-color), 
    rgba(255, 255, 255, 0.5), 
    var(--brand-glow-color)
  );
  animation: spin 4s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### 3D Theme Sphere Component
```css
.theme-sphere {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  cursor: pointer;
  border: 2px solid transparent;
  overflow: hidden;
  transition: transform var(--transition-bounce), 
              opacity var(--transition-bounce), 
              border-color var(--transition-quick), 
              box-shadow var(--transition-quick);
  background-color: #1a1a1a;
}

/* Background image with zoom effect */
.theme-sphere::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: inherit;
  background-image: var(--sphere-bg);
  background-size: cover;
  background-position: center;
  transition: transform var(--transition-bounce);
  z-index: 1;
}

/* Hover zoom effect */
.theme-sphere:hover::before {
  transform: scale(1.1);
}

/* 3D lighting effect */
.theme-sphere::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at 35% 35%, 
    rgba(255, 255, 255, 0.35) 0%, 
    rgba(255, 255, 255, 0) 60%
  );
  box-shadow: inset 0 0 25px 5px rgba(0, 0, 0, 0.3);
  mix-blend-mode: overlay;
  z-index: 3;
}

/* Selected state */
.theme-sphere.is-selected {
  border-color: white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* Check icon overlay */
.check-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 9999px;
  opacity: 0;
  transform: scale(0.8);
  transition: all var(--transition-quick);
  pointer-events: none;
  z-index: 2;
}

.theme-sphere.is-selected .check-icon {
  opacity: 1;
  transform: scale(1);
}
```

## Animation Implementation

### Slide Transition System
```css
/* Base slide animation */
.fade-in-up, .animate-entry {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-entry.delay-1 { animation-delay: 0.15s; }
.animate-entry.delay-2 { animation-delay: 0.3s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide container transitions */
.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity var(--transition-smooth);
  visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.slide.active {
  opacity: 1;
  visibility: visible;
}

/* Background transitions */
.slide-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -10;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity var(--transition-smooth);
}

.slide-background.active {
  opacity: 1;
}
```

### Progress Dot Animation
```css
.slide-dot {
  height: 6px;
  border-radius: 9999px;
  cursor: pointer;
  transition: width var(--transition-bounce), 
              background-color var(--transition-bounce);
  background-color: rgba(255, 255, 255, 0.3);
}

.slide-dot.active {
  width: 24px;
  background-color: white;
}
```

## Mobile vs Desktop Responsive Behavior

### Mobile-First Implementation (375px)
```css
/* Mobile theme gallery */
@media (max-width: 1023px) {
  #themes-track {
    scroll-snap-type: x mandatory;
    padding: 0 calc(50vw - 60px); /* Center active item */
  }
  
  .theme-sphere {
    transform: scale(0.9);
    opacity: 0.5;
    transition: transform var(--transition-bounce), 
                opacity var(--transition-bounce);
  }
  
  .theme-sphere.is-in-view {
    transform: scale(1);
    opacity: 1;
  }
  
  /* Touch-friendly spacing */
  .onboarding-container {
    padding: 1rem;
  }
  
  /* Larger touch targets */
  .primary-button-glow {
    min-height: 48px;
    padding: 1rem 2rem;
  }
}
```

### Desktop Enhancement (1024px+)
```css
@media (min-width: 1024px) {
  /* Desktop grid layout */
  #themes-track {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 48rem;
    margin: 0 auto;
    padding: 0;
  }
  
  /* Enhanced hover effects */
  .theme-sphere:hover {
    transform: translateY(-8px) scale(1.05);
  }
  
  /* Multi-column content layout */
  .slide-content {
    max-width: 42rem;
    margin: 0 auto;
  }
  
  /* Keyboard navigation hints */
  .keyboard-hint {
    display: block;
    opacity: 0.7;
    font-size: 0.875rem;
  }
}
```

### Tablet Adaptation (768px)
```css
@media (min-width: 768px) and (max-width: 1023px) {
  /* Hybrid layout - 2 column grid with scroll */
  #themes-track {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 0 2rem;
  }
  
  /* Balanced text sizing */
  .slide h1 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .slide p {
    font-size: 1.125rem;
    max-width: 32rem;
  }
}
```

## Component Specifications

### OnboardingContainer Component
```typescript
interface OnboardingContainerProps {
  onComplete: (selectedTheme: ThemeOption) => void;
  initialSlide?: number;
  themes?: ThemeOption[];
}

const OnboardingContainer: FC<OnboardingContainerProps> = ({
  onComplete,
  initialSlide = 1,
  themes = DEFAULT_THEMES,
}) => {
  const { state, nextSlide, previousSlide, selectTheme, goToSlide } = useOnboarding({
    initialSlide,
    themes,
  });

  return (
    <div className="onboarding-container min-h-screen overflow-hidden relative">
      <SlideBackgroundManager currentSlide={state.currentSlide} selectedTheme={state.selectedTheme} />
      <OnboardingSlides 
        currentSlide={state.currentSlide}
        onThemeSelect={selectTheme}
        selectedTheme={state.selectedTheme}
        themes={themes}
      />
      <OnboardingControls
        currentSlide={state.currentSlide}
        totalSlides={4}
        onNext={nextSlide}
        onPrevious={previousSlide}
        onSkip={() => onComplete(state.selectedTheme)}
        onDotClick={goToSlide}
        isTransitioning={state.isTransitioning}
      />
    </div>
  );
};
```

### ThemeSphere Component
```typescript
interface ThemeSphereProps {
  theme: ThemeOption;
  isSelected: boolean;
  isInView?: boolean;
  onSelect: (theme: ThemeOption) => void;
  showLabel?: boolean;
}

const ThemeSphere: FC<ThemeSphereProps> = ({
  theme,
  isSelected,
  isInView = true,
  onSelect,
  showLabel = false,
}) => {
  const handleClick = useCallback(() => {
    onSelect(theme);
  }, [theme, onSelect]);

  return (
    <li className="flex-shrink-0 snap-center relative flex justify-center p-4">
      <button
        id={`theme-${theme.id}`}
        className={cn(
          "theme-sphere",
          isSelected && "is-selected",
          isInView && "is-in-view"
        )}
        data-theme-id={theme.id}
        style={{ '--sphere-bg': `url(${theme.value})` } as CSSProperties}
        onClick={handleClick}
        aria-label={`Select ${theme.name} theme`}
      >
        <div className="check-icon">
          <Check className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
      </button>
      
      {showLabel && theme.isDefault && (
        <div className="liquid-glass-tag absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          {theme.name}
        </div>
      )}
    </li>
  );
};
```

### PrimaryButton Component
```typescript
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  glowEffect?: boolean;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  glowEffect = true,
  className,
  ...props
}) => {
  return (
    <button
      className={cn("primary-button-glow", className)}
      disabled={isLoading}
      {...props}
    >
      {glowEffect && <div className="border-glow" />}
      <span className="relative z-10 flex items-center">
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        {children}
      </span>
    </button>
  );
};
```

## Background Persistence Integration

### Theme Provider Implementation
```typescript
interface ThemeContextType {
  selectedTheme: ThemeOption;
  setSelectedTheme: (theme: ThemeOption) => void;
  applyThemeBackground: (theme: ThemeOption) => void;
}

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(DEFAULT_THEME);

  const applyThemeBackground = useCallback((theme: ThemeOption) => {
    // Apply to document root for global persistence
    document.documentElement.style.setProperty('--global-bg-image', `url(${theme.value})`);
    document.documentElement.setAttribute('data-theme-id', theme.id);
    
    // Persist in localStorage
    localStorage.setItem('trendly-selected-theme', JSON.stringify(theme));
    
    setSelectedTheme(theme);
  }, []);

  // Load persisted theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('trendly-selected-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme) as ThemeOption;
        applyThemeBackground(theme);
      } catch (error) {
        console.warn('Failed to load saved theme:', error);
      }
    }
  }, [applyThemeBackground]);

  return (
    <ThemeContext.Provider value={{
      selectedTheme,
      setSelectedTheme,
      applyThemeBackground,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Global Background CSS
```css
/* Global background that persists across pages */
body {
  background-color: var(--bg-main);
  background-image: var(--global-bg-image, none);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: 'Inter', sans-serif;
  -webkit-tap-highlight-color: transparent;
  color: white;
}

/* Ensure background persists on route changes */
.page-container {
  min-height: 100vh;
  position: relative;
}

.page-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: -1;
  pointer-events: none;
}
```

## Accessibility Features

### WCAG 2.1 AA Compliance
```typescript
// Screen reader announcements for slide transitions
const announceSlideChange = (slideNumber: number, totalSlides: number) => {
  const announcement = `Slide ${slideNumber} of ${totalSlides}`;
  const srElement = document.getElementById('sr-announcements');
  if (srElement) {
    srElement.textContent = announcement;
  }
};

// Keyboard navigation support
const useKeyboardNavigation = (onNext: () => void, onPrevious: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'Escape':
          // Allow skipping onboarding
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious]);
};
```

### Color Contrast and Focus Management
```css
/* High contrast focus indicators */
.theme-sphere:focus-visible,
.primary-button-glow:focus-visible,
.slide-dot:focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
}

/* Ensure text meets contrast requirements */
.slide h1, .slide p {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .fade-in-up, .animate-entry {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .theme-sphere::before {
    transition: none;
  }
  
  .theme-sphere:hover::before {
    transform: none;
  }
}
```

## Performance Optimization

### Image Loading Strategy
```typescript
// Preload background images for smooth transitions
const preloadImages = (themes: ThemeOption[]) => {
  useEffect(() => {
    themes.forEach(theme => {
      const img = new Image();
      img.src = theme.value;
    });
  }, [themes]);
};

// Lazy load non-critical slide backgrounds
const LazySlideBackground: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={cn(
        "slide-background transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0"
      )}
    />
  );
};
```

### Animation Performance
```css
/* Hardware acceleration for smooth animations */
.theme-sphere,
.primary-button-glow,
.slide {
  will-change: transform;
  transform: translateZ(0);
}

/* Optimize backdrop filters */
.primary-button-glow,
.liquid-glass-tag {
  will-change: backdrop-filter;
}

/* Reduce paint operations */
.theme-sphere::before,
.theme-sphere::after {
  will-change: transform;
}
```

## Integration Points

### Next.js App Router Integration
```typescript
// app/onboarding/page.tsx
export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleOnboardingComplete = useCallback(
    (selectedTheme: ThemeOption) => {
      // Persist onboarding completion
      updateUserOnboardingStatus(user.id, {
        completed: true,
        selectedTheme: selectedTheme.id,
        completedAt: new Date().toISOString(),
      });

      // Apply theme globally
      applyThemeBackground(selectedTheme);

      // Redirect to dashboard
      router.push('/dashboard');
    },
    [user, router]
  );

  // Redirect if already completed
  if (user?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <ThemeProvider>
      <OnboardingContainer onComplete={handleOnboardingComplete} />
    </ThemeProvider>
  );
}
```

### Routing and State Persistence
```typescript
// middleware.ts integration
export function middleware(request: NextRequest) {
  const user = getUser(request);
  const url = request.nextUrl.clone();

  // Onboarding routing logic
  if (user && !user.onboarding_completed && url.pathname !== '/onboarding') {
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  if (user && user.onboarding_completed && url.pathname === '/onboarding') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
```

## Quality Assurance Checklist

### Visual Fidelity Validation
- [ ] All animations match reference timing and easing
- [ ] Liquid glass effects render correctly across browsers
- [ ] 3D sphere lighting effects display properly
- [ ] Background persistence works across page transitions
- [ ] Theme selection updates immediately and consistently

### Responsive Design Verification
- [ ] Mobile scroll gallery functions smoothly
- [ ] Desktop grid layout displays correctly
- [ ] Tablet hybrid layout works as intended
- [ ] Touch targets meet minimum 44px requirement
- [ ] Responsive typography scales appropriately

### Accessibility Compliance
- [ ] All interactive elements are keyboard accessible
- [ ] Screen reader announcements work correctly
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Focus indicators are clearly visible
- [ ] Reduced motion preferences are respected

### Performance Validation
- [ ] Slide transitions maintain 60fps
- [ ] Background image loading doesn't block interaction
- [ ] Memory usage remains stable during theme switching
- [ ] CSS animations use hardware acceleration
- [ ] Bundle size impact is minimal

### Integration Testing
- [ ] Theme persistence works across browser sessions
- [ ] Onboarding completion updates user state correctly
- [ ] Route protection prevents re-entry after completion
- [ ] Error states provide clear recovery paths
- [ ] Analytics events fire correctly for each interaction

## Implementation Timeline

### Phase 1: Core Components (Week 1)
- Implement basic slide structure and navigation
- Create theme sphere component with basic styling
- Set up state management and routing integration
- Add primary button component with glass effects

### Phase 2: Advanced Effects (Week 2)
- Implement 3D sphere animations and hover effects
- Add liquid glass styling and backdrop filters
- Create smooth slide transitions and background management
- Integrate keyboard navigation and accessibility features

### Phase 3: Responsive and Polish (Week 3)
- Implement mobile scroll gallery with intersection observer
- Add desktop grid layout and responsive breakpoints
- Integrate theme persistence across application
- Perform cross-browser testing and optimization

### Phase 4: Integration and Testing (Week 4)
- Complete Next.js App Router integration
- Add comprehensive error handling and loading states
- Implement analytics tracking and user feedback collection
- Conduct accessibility audit and performance optimization

This specification provides a complete blueprint for recreating the TrendlyAI onboarding experience with 100% visual and functional fidelity while following modern React and Next.js best practices. The implementation maintains the sophisticated visual effects while ensuring accessibility, performance, and maintainability.