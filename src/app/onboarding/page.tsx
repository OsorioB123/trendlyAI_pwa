'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { useBackground } from '../../contexts/BackgroundContext'
import { useAuth } from '../../contexts/AuthContext'
import { hasCompletedOnboarding } from '../../lib/onboarding'
import OnboardingButton from '../../components/onboarding/OnboardingButton'

interface OnboardingSlide {
  id: number
  title: string
  description: string
  backgroundImage?: string
}

const SLIDES: OnboardingSlide[] = [
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
]

// Themes array - exact from HTML reference
const THEMES = [
  { id: 'default', name: 'Padrão Trendly', value: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
  { id: 'theme-2', name: 'Ambiente 2', value: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
  { id: 'theme-3', name: 'Ambiente 3', value: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
  { id: 'theme-4', name: 'Ambiente 4', value: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
  { id: 'theme-5', name: 'Ambiente 5', value: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
  { id: 'theme-6', name: 'Ambiente 6', value: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
  { id: 'theme-7', name: 'Ambiente 7', value: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
  { id: 'theme-8', name: 'Ambiente 8', value: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
  { id: 'theme-9', name: 'Ambiente 9', value: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
  { id: 'theme-10', name: 'Ambiente 10', value: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
  { id: 'theme-11', name: 'Ambiente 11', value: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
  { id: 'theme-12', name: 'Ambiente 12', value: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' },
]

interface ThemeSphereProps {
  theme: {
    id: string
    name: string
    value: string
  }
  isSelected: boolean
  onSelect: (themeId: string) => void
  isInView?: boolean
}

function ThemeSphere({ theme, isSelected, onSelect, isInView = true }: ThemeSphereProps) {
  return (
    <div className="flex-shrink-0 snap-center relative flex justify-center p-4">
      {theme.id === 'default' && (
        <div className="liquid-glass-tag absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          Padrão Trendly
        </div>
      )}
      
      <button
        data-theme-id={theme.id}
        onClick={() => onSelect(theme.id)}
        className={`
          theme-sphere
          ${isSelected ? 'is-selected' : ''}
          ${isInView ? 'is-in-view' : ''}
        `}
        style={{
          '--sphere-bg': `url(${theme.value})`
        } as React.CSSProperties}
        aria-label={`Selecionar tema ${theme.name}`}
      >
        <div className="check-icon">
          <Check className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
      </button>
    </div>
  )
}

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [isLoading, setIsLoading] = useState(false)
  const [themesInitialized, setThemesInitialized] = useState(false)
  
  const router = useRouter()
  const { changeBackground } = useBackground()
  const { isAuthenticated, user, completeOnboarding } = useAuth()
  
  const themesGalleryRef = useRef<HTMLDivElement>(null)
  const themesTrackRef = useRef<HTMLOListElement>(null)

  // Redirect if not authenticated or already completed onboarding
  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/login')
      return
    }
    
    // If user has already completed onboarding, redirect to dashboard
    if (isAuthenticated && hasCompletedOnboarding()) {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, user, router])

  // Setup intersection observer for mobile theme selection (exact from HTML)
  useEffect(() => {
    if (currentSlide !== 3 || !themesTrackRef.current || window.innerWidth >= 1024) return

    const spheres = themesTrackRef.current.querySelectorAll('.theme-sphere')
    const options = {
      root: themesGalleryRef.current,
      rootMargin: '0px',
      threshold: 0.8
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentSphere = entry.target as HTMLElement
          const themeId = currentSphere.dataset.themeId
          if (themeId) {
            setSelectedTheme(themeId)
            // Update sphere states
            spheres.forEach(s => s.classList.remove('is-in-view', 'is-selected'))
            currentSphere.classList.add('is-in-view', 'is-selected')
          }
        }
      })
    }, options)

    spheres.forEach(sphere => observer.observe(sphere))

    return () => observer.disconnect()
  }, [currentSlide, themesInitialized])

  const showSlide = useCallback((slideNumber: number) => {
    setCurrentSlide(slideNumber)
    
    // Initialize theme selector when slide 3 is shown
    if (slideNumber === 3 && !themesInitialized) {
      setThemesInitialized(true)
      // Scroll to selected theme on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const selectedElement = document.querySelector(`[data-theme-id="${selectedTheme}"]`)?.parentElement
          if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: 'auto', inline: 'center' })
          }
        }, 100)
      }
    }
  }, [selectedTheme, themesInitialized])

  const handleNext = useCallback(async () => {
    if (currentSlide < SLIDES.length) {
      showSlide(currentSlide + 1)
    } else {
      // Complete onboarding
      setIsLoading(true)
      
      try {
        console.log(`Onboarding concluído! Tema selecionado: ${selectedTheme}`)
        // Save selected theme
        await changeBackground(selectedTheme)
        
        // Complete onboarding using AuthContext method
        completeOnboarding()
        
        // Navigate to dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Error completing onboarding:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [currentSlide, selectedTheme, changeBackground, completeOnboarding, router, showSlide])

  const handleSkip = useCallback(async () => {
    try {
      console.log("Navegar para a próxima página (pulou)")
      // Set default theme
      await changeBackground('default')
      
      // Complete onboarding using AuthContext method
      completeOnboarding()
      
      // Navigate to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      router.push('/dashboard')
    }
  }, [changeBackground, completeOnboarding, router])

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    
    // Update visual states for all spheres
    document.querySelectorAll('.theme-sphere').forEach(sphere => {
      sphere.classList.remove('is-selected')
    })
    document.querySelector(`[data-theme-id="${themeId}"]`)?.classList.add('is-selected')
    
    if (window.innerWidth < 1024 && themesTrackRef.current) {
      const selectedElement = themesTrackRef.current.querySelector(`[data-theme-id="${themeId}"]`)?.parentElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }

  const handleDotClick = (slideNumber: number) => {
    if (currentSlide !== slideNumber) {
      showSlide(slideNumber)
    }
  }

  const renderSlideContent = () => {
    const slide = SLIDES.find(s => s.id === currentSlide)
    if (!slide) return null

    if (currentSlide === 3) {
      // Theme selection slide
      return (
        <div className="slide-content-theme">
          <section className="text-center pt-8 pb-4 flex-shrink-0">
            <h2 className="text-3xl font-semibold tracking-tight animate-entry font-geist">
              {slide.title}
            </h2>
            <p className="mt-2 text-white/80 animate-entry delay-1">
              {slide.description}
            </p>
          </section>
          
          <section className="flex-grow flex flex-col items-center justify-center min-h-0 py-8 animate-entry delay-2">
            <div 
              id="themes-gallery"
              ref={themesGalleryRef}
              className="w-full hide-scrollbar overflow-x-auto lg:overflow-x-visible pb-4"
            >
              <ol 
                id="themes-track"
                ref={themesTrackRef}
                className="flex items-center gap-6 lg:p-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:max-w-3xl lg:mx-auto"
                style={window.innerWidth < 1024 ? { 
                  scrollSnapType: 'x mandatory',
                  padding: '0 calc(50vw - 60px)'
                } : {}}
              >
                {THEMES.map((theme) => (
                  <li key={theme.id}>
                    <ThemeSphere
                      theme={theme}
                      isSelected={selectedTheme === theme.id}
                      onSelect={handleThemeSelect}
                      isInView={true}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      )
    }

    // Regular slide
    return (
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 fade-in-up font-geist">
          {slide.title}
        </h1>
        <p className="text-base text-white/80 max-w-md fade-in-up" style={{ animationDelay: '0.15s' }}>
          {slide.description}
        </p>
      </div>
    )
  }

  const getSlideBackground = (slideNumber: number) => {
    if (slideNumber === 3) {
      const selectedBg = THEMES.find(bg => bg.id === selectedTheme)
      return selectedBg?.value
    }
    
    const slide = SLIDES.find(s => s.id === slideNumber)
    return slide?.backgroundImage
  }

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Background placeholders for slides 1, 2, 4 - exact from HTML */}
      <div 
        className={`slide-background ${currentSlide === 1 ? 'active' : ''}`} 
        style={{ backgroundImage: `url('${getSlideBackground(1)}')` }}
      />
      <div 
        className={`slide-background ${currentSlide === 2 ? 'active' : ''}`} 
        style={{ backgroundImage: `url('${getSlideBackground(2)}')` }}
      />
      <div 
        className={`slide-background ${currentSlide === 4 ? 'active' : ''}`} 
        style={{ backgroundImage: `url('${getSlideBackground(4)}')` }}
      />

      {/* Background container for theme slides */}
      <div className={currentSlide === 3 ? '' : 'hidden'}>
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className={`background-layer ${selectedTheme === theme.id ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${theme.value})` }}
          />
        ))}
      </div>
      
      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

      <main className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-8 pb-10">
        <div id="slides-container" className="relative flex-1 min-h-0">
          {/* Slide 1 */}
          <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
            {currentSlide === 1 && renderSlideContent()}
          </div>
          
          {/* Slide 2 */}
          <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
            {currentSlide === 2 && renderSlideContent()}
          </div>
          
          {/* Slide 3 - Theme Selection */}
          <div className={`slide ${currentSlide === 3 ? 'active' : ''}`}>
            {currentSlide === 3 && renderSlideContent()}
          </div>

          {/* Slide 4 */}
          <div className={`slide ${currentSlide === 4 ? 'active' : ''}`}>
            {currentSlide === 4 && renderSlideContent()}
          </div>
        </div>
        
        {/* Navigation Controls - exact from HTML */}
        <div className="flex-shrink-0 mt-8">
          {/* Dots indicator */}
          <div className="flex items-center space-x-2 mb-10 fade-in-up" style={{ animationDelay: '0.3s' }}>
            {SLIDES.map((_, index) => (
              <div
                key={index}
                className="slide-dot"
                style={{
                  width: currentSlide === index + 1 ? '24px' : '6px',
                  backgroundColor: currentSlide === index + 1 ? 'white' : 'rgba(255, 255, 255, 0.3)'
                }}
                onClick={() => handleDotClick(index + 1)}
              />
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between fade-in-up" style={{ animationDelay: '0.45s' }}>
            <OnboardingButton 
              variant="secondary"
              onClick={handleSkip}
            >
              Pular
            </OnboardingButton>
            
            <OnboardingButton 
              variant="primary"
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Carregando...
                </>
              ) : currentSlide === SLIDES.length ? (
                <>
                  Começar
                  <Check className="ml-2 h-5 w-5" strokeWidth={1.75} />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={1.75} />
                </>
              )}
            </OnboardingButton>
          </div>
          
          {/* Home indicator */}
          <div className="w-[134px] h-[5px] bg-white/40 rounded-full mx-auto mt-8" />
        </div>
      </main>
    </div>
  )
}