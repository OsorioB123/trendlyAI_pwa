'use client'

import { FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface DashboardHeroProps {
  greeting: string
  userName: string
  commandValue: string
  onCommandChange: (value: string) => void
  onSubmit: (value: string) => void
  quickActions: string[]
  loading?: boolean
}

export function DashboardHero({
  greeting,
  userName,
  commandValue,
  onCommandChange,
  onSubmit,
  quickActions,
  loading = false
}: DashboardHeroProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!commandValue.trim()) return
    onSubmit(commandValue.trim())
  }

  return (
    <section className="relative z-10 flex flex-col items-center text-center text-white">
      <div className="mb-6 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-white/50">TrendlyAI Dashboard</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {greeting.split('').map((char, index) => (
            <span
              key={'greeting-' + index}
              className="inline-block animate-dashboard-greeting"
              style={{ animationDelay: String(index * 45) + 'ms' }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
          <span
            className="inline-block animate-dashboard-greeting"
            style={{ animationDelay: String(greeting.length * 45) + 'ms' }}
          >
            ,
          </span>
          {' '}
          {userName.split('').map((char, index) => (
            <span
              key={'name-' + index}
              className="inline-block animate-dashboard-greeting text-brand-yellow"
              style={{ animationDelay: String((greeting.length + index + 1) * 45) + 'ms' }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-white/70">
          Acompanhe seus números, finalize trilhas e descubra ferramentas criadas para acelerar sua próxima grande ideia.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn('dashboard-command-form relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/12 bg-white/10 backdrop-blur-2xl transition focus-within:border-white/25',
          loading && 'pointer-events-none opacity-70'
        )}
      >
        <input
          type="text"
          value={commandValue}
          onChange={(event) => onCommandChange(event.target.value)}
          placeholder="Descreva o que quer criar hoje..."
          className="w-full bg-transparent py-4 pl-6 pr-14 text-left text-base placeholder:text-white/60 focus:outline-none"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center justify-center">
          <div className="pointer-events-auto">
            <Button type="submit" size="icon" className="h-11 w-11 rounded-full bg-brand-yellow text-black hover:bg-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {quickActions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {quickActions.slice(0, 4).map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => onCommandChange(item)}
              className="dashboard-chip"
              style={{ animationDelay: String(index * 80) + 'ms' }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
