'use client'

import { useState } from 'react'
import { Copy, Star } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { DashboardToolSummary } from '@/types/dashboard'

interface ToolbeltProps {
  tools: DashboardToolSummary[]
}

export function Toolbelt({ tools }: ToolbeltProps) {
  const [selected, setSelected] = useState<DashboardToolSummary | null>(null)

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Ferramentas recomendadas</CardTitle>
        <CardDescription className="text-white/70">
          Prompts e automações para acelerar sua produção.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setSelected(tool)}
              className="flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-white/20 hover:bg-black/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{tool.title}</h3>
                  <p className="mt-1 text-xs text-white/60 line-clamp-2">{tool.description}</p>
                </div>
                {tool.isFavorite && (
                  <Star className="h-4 w-4 text-amber-300" />
                )}
              </div>
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="border-white/20 text-white/60">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center justify-between text-xs text-white/50">
                <span>{tool.usageCount ? tool.usageCount + ' usos' : 'Novo'}</span>
                <span>Toque para detalhar</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 text-white">
          {selected && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2 text-left">
                <DialogTitle className="text-xl text-white">{selected.title}</DialogTitle>
                <DialogDescription className="text-white/70">
                  {selected.description}
                </DialogDescription>
              </DialogHeader>
              {selected.tags && selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="space-y-2 rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Prompt</p>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-sm text-white/90">
                  {selected.content ?? 'Conteúdo do prompt não disponível ainda.'}
                </pre>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  className="rounded-full bg-white text-slate-900 hover:bg-white/90"
                  onClick={() => {
                    if (selected?.content) {
                      void navigator.clipboard.writeText(selected.content)
                    }
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copiar prompt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
