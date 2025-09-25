'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Send, Bolt, Plus, MessageSquare } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface CommandHubProps {
  commandValue: string
  onChange: (value: string) => void
  quickActions: string[]
  savedPrompts: string[]
  onSubmit?: (value: string) => void
}

export function CommandHub({ commandValue, onChange, quickActions, savedPrompts, onSubmit }: CommandHubProps) {
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!commandValue.trim()) return

    if (onSubmit) {
      onSubmit(commandValue)
    } else {
      router.push('/chat?message=' + encodeURIComponent(commandValue.trim()))
    }
  }

  return (
    <Card className="h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-semibold">O que vamos criar hoje?</CardTitle>
            <CardDescription className="text-white/70">Peça ideias, gere roteiros ou peça análises rápidas.</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-white/15 text-white">
            <Sparkles className="mr-2 h-4 w-4" /> IA assistida
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="dashboard-command" className="sr-only">
            Campo de comando do dashboard
          </label>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-inner shadow-black/40 focus-within:border-white/20 focus-silent">
            <Input
              id="dashboard-command"
              value={commandValue}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Exemplo: gere um roteiro para lançamento de curso"
              className="h-14 border-0 bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white" onClick={() => onChange('')}
                aria-label="Limpar comando">
                <Plus className="h-4 w-4 rotate-45" />
              </Button>
              <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-white text-slate-950 shadow-lg hover:bg-white/90" aria-label="Enviar comando">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {quickActions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/70">Ações rápidas</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action}
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-white/10 text-sm text-white hover:bg-white/20"
                  type="button"
                  onClick={() => onChange(action)}
                >
                  <Bolt className="mr-2 h-4 w-4" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {savedPrompts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/70">Prompts salvos</p>
              <Button variant="link" className="h-auto p-0 text-xs text-white/60 hover:text-white" onClick={() => router.push('/tools')}>
                Ver biblioteca
              </Button>
            </div>
            <div className="space-y-2">
              {savedPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onChange(prompt)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-left text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 text-white/40" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-white/10" />

        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Pressione Enter para enviar • Shift + Enter para quebrar linha</span>
          <span>Precisa de inspiração? Explore as ferramentas recomendadas.</span>
        </div>
      </CardContent>
    </Card>
  )
}


