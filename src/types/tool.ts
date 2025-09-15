// Tool/Prompt categories based on HTML reference
export type ToolCategory = 
  | 'Copywriting' 
  | 'SEO' 
  | 'Imagem' 
  | 'Análise' 
  | 'Negócios' 
  | 'Marketing' 
  | 'Design'

// Tool types for filtering
export type ToolType = 
  | 'text-generation' 
  | 'image-generation' 
  | 'data-analysis' 
  | 'research'

// AI model compatibility
export type AICompatibility = 
  | 'ChatGPT' 
  | 'Claude' 
  | 'Gemini' 
  | 'Midjourney' 
  | 'DALL-E' 
  | 'Stable Diffusion'

// Sort options
export type ToolSortOption = 'relevance' | 'recent'

// Main Tool interface
export interface Tool {
  id: string
  title: string
  description: string
  category: ToolCategory
  type: ToolType
  compatibility: AICompatibility[]
  tags: string[]
  content: string
  how_to_use?: string
  isFavorite: boolean
  isEdited: boolean
  usageCount?: number
  createdAt?: Date
  updatedAt?: Date
}

// Advanced filters for tools
export interface ToolsFilters {
  search: string
  category: 'all' | ToolCategory
  sort: ToolSortOption
  type: ToolType[]
  compatibility: AICompatibility[]
  activity: ('isFavorite' | 'isEdited')[]
}

// Filter count for UI
export interface FilterCounts {
  total: number
  type: number
  compatibility: number
  activity: number
}

// Tool card props
export interface ToolCardProps {
  tool: Tool
  onClick: (tool: Tool) => void
  onFavorite: (tool: Tool) => void
}

// Tool modal props
export interface ToolModalProps {
  tool: Tool | null
  isOpen: boolean
  onClose: () => void
  onCopy: (content: string) => void
  onSave: (toolId: string, content: string) => void
}

// Tools filters drawer props
export interface ToolsFiltersDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ToolsFilters
  onFiltersChange: (filters: Partial<ToolsFilters>) => void
}
