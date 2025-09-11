'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBackground } from '../../contexts/BackgroundContext'
import { useAuth } from '../../contexts/AuthContext'
import { completeOnboarding, hasCompletedOnboarding } from '../../lib/onboarding'
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
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          <div className="backdrop-blur-xl bg-white/12 border border-white/16 shadow-lg rounded-full px-3 py-1 text-xs font-medium text-white">
            Padrão Trendly
          </div>
        </div>
      )}
      
      <button
        data-theme-id={theme.id}
        onClick={() => onSelect(theme.id)}
        className={`
          relative w-[120px] h-[120px] rounded-full cursor-pointer
          border-2 overflow-hidden transition-all duration-400
          ${isSelected ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'border-transparent'}
          ${isInView ? 'transform scale-100 opacity-100' : 'transform scale-90 opacity-50'}
          hover:scale-105 hover:border-white/50
        `}
        style={{
          background: `url(${theme.value}) center/cover`,
        }}
        aria-label={`Selecionar tema ${theme.name}`}
      >
        {/* 3D glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/35 via-transparent to-transparent opacity-60 mix-blend-overlay pointer-events-none" />
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_25px_5px_rgba(0,0,0,0.3)] pointer-events-none" />
        
        {/* Check icon overlay */}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm transition-all duration-300">
            <Check className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
        )}
      </button>
    </div>
  )
}

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { availableBackgrounds, changeBackground } = useBackground()
  const { isAuthenticated, user } = useAuth()
  
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

  // Setup intersection observer for mobile theme selection
  useEffect(() => {
    if (currentSlide !== 3 || !themesTrackRef.current || window.innerWidth >= 1024) return

    const spheres = themesTrackRef.current.querySelectorAll('button')
    const options = {
      root: themesGalleryRef.current,
      rootMargin: '0px',
      threshold: 0.8
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const themeId = entry.target.getAttribute('data-theme-id')
          if (themeId) {
            setSelectedTheme(themeId)
          }
        }
      })
    }, options)

    spheres.forEach(sphere => observer.observe(sphere))

    return () => observer.disconnect()
  }, [currentSlide])

  const handleNext = useCallback(async () => {
    if (currentSlide < SLIDES.length) {
      setCurrentSlide(prev => prev + 1)
    } else {
      // Complete onboarding
      setIsLoading(true)
      
      try {
        // Save selected theme
        await changeBackground(selectedTheme)
        
        // Complete onboarding and get redirect path
        const redirectPath = await completeOnboarding()
        
        // Navigate to appropriate page
        router.push(redirectPath)
      } catch (error) {
        console.error('Error completing onboarding:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [currentSlide, selectedTheme, changeBackground, router])

  const handleSkip = useCallback(async () => {
    try {
      // Set default theme
      await changeBackground('default')
      
      // Complete onboarding and get redirect path
      const redirectPath = await completeOnboarding()
      
      // Navigate to appropriate page
      router.push(redirectPath)
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      router.push('/dashboard')
    }
  }, [changeBackground, router])

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    if (window.innerWidth < 1024 && themesTrackRef.current) {
      const selectedElement = themesTrackRef.current.querySelector(`[data-theme-id="${themeId}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }

  const handleDotClick = (slideNumber: number) => {
    setCurrentSlide(slideNumber)
  }

  const renderSlideContent = () => {
    const slide = SLIDES.find(s => s.id === currentSlide)
    if (!slide) return null

    if (currentSlide === 3) {
      // Theme selection slide
      return (
        <div className="slide-content-theme flex flex-col h-full">
          <section className="text-center pt-8 pb-4 flex-shrink-0">
            <h2 className="text-3xl font-semibold tracking-tight animate-fade-in-up font-geist">
              {slide.title}
            </h2>
            <p className="mt-2 text-white/80 animate-fade-in-up [animation-delay:150ms]">
              {slide.description}
            </p>
          </section>
          
          <section className="flex-grow flex flex-col items-center justify-center min-h-0 py-8 animate-fade-in-up [animation-delay:300ms]">
            <div 
              ref={themesGalleryRef}
              className="w-full scrollbar-hide overflow-x-auto lg:overflow-x-visible pb-4"
            >
              <ol 
                ref={themesTrackRef}
                className="flex items-center gap-6 lg:p-0 lg:grid lg:grid-cols-4 lg:gap-8 lg:max-w-3xl lg:mx-auto"
                style={{ 
                  scrollSnapType: 'x mandatory',
                  padding: window.innerWidth < 1024 ? '0 calc(50vw - 60px)' : undefined
                }}
              >
                {availableBackgrounds.map((theme) => (
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
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 animate-fade-in-up font-geist">
          {slide.title}
        </h1>
        <p className="text-base text-white/80 max-w-md animate-fade-in-up [animation-delay:150ms]">
          {slide.description}
        </p>
      </div>
    )
  }

  const getBackgroundImage = () => {
    if (currentSlide === 3) {
      const selectedBg = availableBackgrounds.find(bg => bg.id === selectedTheme)
      return selectedBg?.value
    }
    
    const slide = SLIDES.find(s => s.id === currentSlide)
    return slide?.backgroundImage
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background System */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-600 ease-in-out"
        style={{ 
          backgroundImage: `url(${getBackgroundImage()})`,
          zIndex: -10
        }}
      />
      
      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />

      <main className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-8 pb-10">
        <div className="relative flex-1 min-h-0 flex items-end">
          <div className="w-full max-w-2xl">
            {renderSlideContent()}
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex-shrink-0 mt-8">
          {/* Dots indicator */}
          <div className="flex items-center space-x-2 mb-10 animate-fade-in-up [animation-delay:300ms]">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-400 ${
                  currentSlide === index + 1 
                    ? 'w-6 bg-white' 
                    : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => handleDotClick(index + 1)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between animate-fade-in-up [animation-delay:450ms]">
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