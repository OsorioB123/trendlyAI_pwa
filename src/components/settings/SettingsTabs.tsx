'use client'

import { useCallback, useEffect, useRef } from 'react'
import { User, Lock, Bell } from 'lucide-react'
import { SettingsTabsProps, SettingsTab } from '../../types/settings'
import { cn } from '@/lib/utils'

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

  const updateIndicator = useCallback(() => {
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
  }, [activeTab])

  useEffect(() => {
    updateIndicator()
    const rafId = requestAnimationFrame(() => updateIndicator())
    return () => cancelAnimationFrame(rafId)
  }, [activeTab, updateIndicator])

  useEffect(() => {
    const handleResize = () => updateIndicator()
    window.addEventListener('resize', handleResize)

    const tabsElement = tabsRef.current
    const handleScroll = () => updateIndicator()
    tabsElement?.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      tabsElement?.removeEventListener('scroll', handleScroll)
    }
  }, [updateIndicator])

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
    <div
      className="w-full overflow-x-auto hide-scrollbar mb-10 opacity-0 animate-fade-in"
      style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
    >
      <div
        ref={tabsRef}
        className={cn(
          'settings-tabs-list relative inline-flex min-w-full md:min-w-0'
        )}
      >
        <div
          ref={indicatorRef}
          id="active-tab-indicator"
          className="absolute top-1 left-1 h-[calc(100%-8px)] rounded-lg bg-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ zIndex: 1 }}
        />

        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              data-tab={tab.id}
              onClick={() => handleTabClick(tab.id)}
              aria-pressed={isActive}
              className={cn(
                'settings-tab-trigger group relative z-10 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap sm:px-4',
                isActive ? 'is-active text-white' : 'text-white/70 hover:text-white/90'
              )}
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                className="flex-shrink-0"
              />
              <span className="tab-label hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


