'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'

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
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [chipsVisible, setChipsVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const combinedGreeting = useMemo(() => `${greeting}, ${userName}`, [greeting, userName])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!commandValue.trim()) return
    onSubmit(commandValue.trim())
    setChipsVisible(false)
  }

  const handleFocus = () => {
    setIsFocused(true)
    setChipsVisible(true)
  }

  const handleBlur = () => {
    window.setTimeout(() => {
      const active = document.activeElement
      if (!formRef.current || !active) {
        setChipsVisible(false)
        setIsFocused(false)
        return
      }
      if (!formRef.current.contains(active)) {
        setChipsVisible(false)
        setIsFocused(false)
      }
    }, 120)
  }

  const handleChipClick = (value: string) => {
    onCommandChange(value)
    requestAnimationFrame(() => inputRef.current?.focus())
    setChipsVisible(false)
  }

  return (
    <section className="w-full text-white">
      <div className="min-h-[40vh] flex flex-col items-center justify-center mt-12 mb-6">
        <div className="mb-6 text-center animate-entry">
          <h2
            id="dashboard-greeting"
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            aria-label={`${greeting}, ${userName}`}
          >
            {combinedGreeting.split('').map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="greeting-char"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
        </div>

        <div className="w-full max-w-2xl mx-auto animate-entry delay-1">
          {quickActions.length > 0 && (
            <div
              className={`hs-chip-container flex flex-wrap justify-center gap-2 mb-4 transition-opacity ${chipsVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}
              aria-hidden={!chipsVisible}
            >
              {quickActions.slice(0, 4).map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className="hs-chip"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleChipClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`hs-outline transition ${isFocused ? 'is-active' : ''} ${loading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <input
                ref={inputRef}
                type="text"
                placeholder="O que vamos criar hoje?"
                value={commandValue}
                onChange={(event) => onCommandChange(event.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                className="liquid-glass-pill flex h-10 w-10 items-center justify-center"
                aria-label="Enviar comando"
                disabled={loading || !commandValue.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
