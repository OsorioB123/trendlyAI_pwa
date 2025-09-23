'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface UpgradeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PLANS = [
  {
    id: 'maestro',
    name: 'Maestro',
    description: 'Acesso ilimitado à Salina, prompts avançados e suporte prioritário.',
    price: 'R$ 89/mês',
    features: [
      'Conexões ilimitadas com a Salina',
      'Biblioteca premium de prompts',
      'Planilhas de marketing exclusivas'
    ],
    recommended: true
  },
  {
    id: 'visionario',
    name: 'Visionário',
    description: 'Ferramentas de planejamento editorial e automações de conteúdo.',
    price: 'R$ 129/mês',
    features: [
      'Planejamento editorial guiado',
      'Templates dinâmicos para vídeos curtos',
      'Integração com Notion e Airtable'
    ]
  },
  {
    id: 'executivo',
    name: 'Executivo',
    description: 'Suite completa para equipes de conteúdo e relatórios avançados.',
    price: 'R$ 219/mês',
    features: [
      'Até 5 assentos incluídos',
      'Relatórios de performance semanais',
      'Suporte dedicado 24/7'
    ]
  }
]

export function UpgradeSheet({ open, onOpenChange }: UpgradeSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-white/15 bg-black/85 text-white backdrop-blur-3xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">Eleve seu estúdio com o Maestro</DialogTitle>
          <DialogDescription className="text-sm text-white/70">
            Desbloqueie recursos avançados para acelerar a criação do seu conteúdo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 pt-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              className={`group flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition-transform hover:-translate-y-1 hover:bg-white/10 ${plan.recommended ? 'border-white/30 bg-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.45)]' : ''}`}
            >
              {plan.recommended && (
                <span className="inline-flex w-max items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Recomendado
                </span>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="text-sm text-white/60">{plan.description}</p>
              </div>
              <p className="text-xl font-semibold text-white">{plan.price}</p>
              <ul className="space-y-2 text-sm text-white/70">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-auto w-full rounded-full border border-white/20 bg-white text-sm font-semibold text-black transition-all hover:scale-[1.02]">
                Escolher plano
              </Button>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
