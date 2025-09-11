export interface Track {
  id: number | string
  title: string
  progress: number
  backgroundImage: string
  categories: string[]
  level: 'Iniciante' | 'Intermediário' | 'Avançado'
  status: 'nao_iniciado' | 'em_andamento' | 'concluido'
  tags?: string[] // manter compatibilidade
}

export interface TracksFilters {
  search: string
  categories: string[]
  levels: string[]
  status: string[]
  sort: 'top' | 'recent'
}