'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

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
            className={`glass-outline transition ${isFocused ? 'is-active' : ''} ${loading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
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
                className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_12px_26px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(15,23,42,0.45)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                aria-label="Enviar comando"
                disabled={loading || !commandValue.trim()}
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="absolute inset-[1px] rounded-full bg-white" />
                <ArrowUpRight
                  className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
