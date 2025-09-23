'use client'

import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DashboardTask } from '@/types/dashboard'

interface ActionQueueProps {
  tasks: DashboardTask[]
}

const STATUS_COPY: Record<DashboardTask['status'], { label: string; icon: typeof Clock; tone: string }> = {
  pending: { label: 'Pendente', icon: Clock, tone: 'text-amber-300' },
  completed: { label: 'Concluído', icon: CheckCircle2, tone: 'text-emerald-300' },
  overdue: { label: 'Atrasado', icon: AlertCircle, tone: 'text-rose-300' }
}

export function ActionQueue({ tasks }: ActionQueueProps) {
  const router = useRouter()
  const hasTasks = tasks.length > 0

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Próximas ações</CardTitle>
        <CardDescription className="text-white/70">
          Priorize o que traz impacto agora: finalize tarefas, responda comunidade, avance nas trilhas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasTasks ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const meta = STATUS_COPY[task.status]
                const Icon = meta.icon
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium text-white">{task.title}</TableCell>
                    <TableCell className="text-sm text-white/60">{formatDate(task.dueAt)}</TableCell>
                    <TableCell className="text-sm">
                      <span className={cn('flex items-center gap-2 font-medium', meta.tone)}>
                        <Icon className={cn('h-4 w-4', meta.tone)} />
                        {meta.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full bg-white/10 text-white hover:bg-white/15"
                        onClick={() => {
                          if (task.ctaHref) router.push(task.ctaHref)
                        }}
                      >
                        {task.ctaLabel ?? 'Abrir'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/60">
            <Clock className="mb-4 h-10 w-10 text-white/30" />
            <p className="font-medium text-white">Você está em dia!</p>
            <p className="text-sm">
              Nenhuma tarefa pendente agora. Aproveite para avançar nas trilhas ou criar um novo conteúdo.
            </p>
            <Button
              variant="secondary"
              className="mt-4 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => router.push('/tracks')}
            >
              Ver trilhas recomendadas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(value?: string) {
  if (!value) return 'Sem prazo'
  const date = new Date(value)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}
