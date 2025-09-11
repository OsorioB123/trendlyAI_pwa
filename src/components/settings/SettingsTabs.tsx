'use client'

import { useEffect, useRef } from 'react'
import { User, Lock, Bell } from 'lucide-react'
import { SettingsTabsProps, SettingsTab } from '../../types/settings'

const TABS = [
  {
    id: 'profile' as SettingsTab,
    label: 'Perfil',
    icon: User,
    description: 'Gerencie suas informações pessoais'
  },
  {
    id: 'security' as SettingsTab,
    label: 'Segurança',
    icon: Lock,
    description: 'Configurações de segurança da conta'
  },
  {
    id: 'notifications' as SettingsTab,
    label: 'Notificações',
    icon: Bell,
    description: 'Preferências de comunicação'
  }
]

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    updateIndicator()
  }, [activeTab])

  const updateIndicator = () => {
    if (!indicatorRef.current || !tabsRef.current) return

    const activeTabElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
    if (!activeTabElement) return

    const tabRect = activeTabElement.getBoundingClientRect()
    const containerRect = tabsRef.current.getBoundingClientRect()

    const scrollLeft = tabsRef.current.scrollLeft
    const position = (tabRect.left - containerRect.left) + scrollLeft
    const width = tabRect.width

    indicatorRef.current.style.transform = `translateX(${position}px)`
    indicatorRef.current.style.width = `${width}px`
  }

  const handleTabClick = (tabId: SettingsTab) => {
    onTabChange(tabId)
    
    // Scroll tab into view on mobile
    if (window.innerWidth < 768) {
      const activeTabElement = tabsRef.current?.querySelector(`[data-tab="${tabId}"]`) as HTMLElement
      if (activeTabElement) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }

  return (
    <div className="w-full overflow-x-auto hide-scrollbar mb-10">
      <div 
        ref={tabsRef}
        className="relative inline-flex p-1 bg-white/5 border border-white/10 rounded-xl min-w-full md:min-w-0"
      >
        {/* Active tab indicator */}
        <div
          ref={indicatorRef}
          className="absolute top-1 left-0 h-[calc(100%-8px)] bg-white/10 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ zIndex: 1 }}
        />
        
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                relative z-10 flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-lg
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                whitespace-nowrap
                ${isActive 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white/90'
                }
                sm:px-4 sm:gap-2
              `}
            >
              <Icon 
                size={18} 
                strokeWidth={1.5}
                className="flex-shrink-0"
              />
              <span className="hidden sm:inline">{tab.label}</span>
              
              {/* Mobile-only tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-opacity duration-200 sm:hidden group-hover:opacity-100 whitespace-nowrap z-50">
                {tab.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Add these styles to your global CSS or use a style tag
const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @media (max-width: 639px) {
    .settings-tabs-responsive {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
    }
    
    .settings-tab-mobile {
      padding: 12px;
      justify-content: center;
      gap: 0;
    }
    
    .settings-tab-mobile .tab-label {
      display: none;
    }
  }
`