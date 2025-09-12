'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  Bookmark, 
  User, 
  Settings,
  Search,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
}

const navItems: NavItem[] = [
  {
    id: 'home',
    icon: <Home className="w-5 h-5" />,
    label: 'Início',
    href: '/',
  },
  {
    id: 'tools',
    icon: <Sparkles className="w-5 h-5" />,
    label: 'Ferramentas',
    href: '/tools',
  },
  {
    id: 'chat',
    icon: <MessageSquare className="w-5 h-5" />,
    label: 'Chat',
    href: '/chat',
  },
  {
    id: 'favorites',
    icon: <Bookmark className="w-5 h-5" />,
    label: 'Favoritos',
    href: '/favorites',
  },
  {
    id: 'profile',
    icon: <User className="w-5 h-5" />,
    label: 'Perfil',
    href: '/profile',
  },
]

const MobileBottomNav = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [pressedTab, setPressedTab] = useState<string | null>(null)

  const handleTabPress = (item: NavItem) => {
    setPressedTab(item.id)
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    
    setTimeout(() => {
      setPressedTab(null)
      router.push(item.href)
    }, 150)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20 md:hidden" />
      
      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      >
        {/* Background with glassmorphism */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-t border-white/10" />
        
        {/* Safe area padding for iOS */}
        <div className="relative px-4 pt-2 pb-safe">
          <div className="flex items-center justify-around">
            {navItems.map((item, index) => {
              const active = isActive(item.href)
              const pressed = pressedTab === item.id
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabPress(item)}
                  className={cn(
                    'relative flex flex-col items-center justify-center min-w-[60px] min-h-[60px] p-2 rounded-2xl transition-all duration-200',
                    active
                      ? 'text-yellow-400'
                      : 'text-white/60 hover:text-white/80 active:text-white'
                  )}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: pressed ? 0.9 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  {/* Active indicator */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Icon container with bounce animation */}
                  <motion.div
                    className="relative mb-1"
                    animate={{
                      y: active ? -2 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    {item.icon}
                    
                    {/* Badge */}
                    {item.badge && item.badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <motion.span
                    className="text-xs font-medium"
                    animate={{
                      opacity: active ? 1 : 0.8,
                      scale: active ? 1.05 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Ripple effect */}
                  <AnimatePresence>
                    {pressed && (
                      <motion.div
                        className="absolute inset-0 bg-white/10 rounded-2xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* Gradient fade at edges */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.nav>
    </>
  )
}

export default MobileBottomNav