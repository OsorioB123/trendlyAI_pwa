'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Home, Sparkles, MessageSquare, Bookmark, User, Settings, HelpCircle, LayoutDashboard, ListChecks, CreditCard, Wand2 } from 'lucide-react'

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    if (pathname !== href) router.push(href)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden bg-black/90 border border-white/10 backdrop-blur-xl">
        <Command label="Explorar navegação e ações" shouldFilter>
          <CommandInput placeholder="Ir para... (⌘K)" />
          <CommandList>
            <CommandEmpty>Nada encontrado.</CommandEmpty>

            <CommandGroup heading="Navegação">
              <CommandItem onSelect={() => go('/')}> <Home className="mr-2 h-4 w-4" /> Início </CommandItem>
              <CommandItem onSelect={() => go('/dashboard')}> <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard </CommandItem>
              <CommandItem onSelect={() => go('/tools')}> <Sparkles className="mr-2 h-4 w-4" /> Ferramentas </CommandItem>
              <CommandItem onSelect={() => go('/tracks')}> <ListChecks className="mr-2 h-4 w-4" /> Trilhas </CommandItem>
              <CommandItem onSelect={() => go('/chat')}> <MessageSquare className="mr-2 h-4 w-4" /> Chat </CommandItem>
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Conta">
              <CommandItem onSelect={() => go('/favorites')}> <Bookmark className="mr-2 h-4 w-4" /> Favoritos </CommandItem>
              <CommandItem onSelect={() => go('/profile')}> <User className="mr-2 h-4 w-4" /> Perfil </CommandItem>
              <CommandItem onSelect={() => go('/settings')}> <Settings className="mr-2 h-4 w-4" /> Configurações </CommandItem>
              <CommandItem onSelect={() => go('/subscription')}> <CreditCard className="mr-2 h-4 w-4" /> Assinatura </CommandItem>
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Ajuda">
              <CommandItem onSelect={() => go('/onboarding')}> <Wand2 className="mr-2 h-4 w-4" /> Onboarding </CommandItem>
              <CommandItem onSelect={() => go('/help')}> <HelpCircle className="mr-2 h-4 w-4" /> Ajuda </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

