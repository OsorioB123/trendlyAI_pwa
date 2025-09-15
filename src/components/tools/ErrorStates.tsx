'use client'

import { motion } from 'framer-motion'
import { 
  AlertCircle, 
  Clock, 
  Wifi, 
  RefreshCw, 
  Server,
  Search,
  ArchiveX
} from 'lucide-react'

interface ErrorStateProps {
  onRetry?: () => void
  className?: string
}

// Network Connection Error
export function NetworkErrorState({ onRetry, className = "" }: ErrorStateProps) {
  return (
    <motion.div 
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Wifi className="w-10 h-10 text-red-400" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">
        Erro de Conexão
      </h3>
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        Não foi possível carregar as ferramentas. Verifique sua conexão com a internet e tente novamente.
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/25 transition-all flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </motion.button>
      )}
    </motion.div>
  )
}

// Server/API Error
export function ServerErrorState({ onRetry, className = "" }: ErrorStateProps) {
  return (
    <motion.div 
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Server className="w-10 h-10 text-orange-400" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">
        Erro no Servidor
      </h3>
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        Nossos servidores estão temporariamente indisponíveis. Estamos trabalhando para resolver isso.
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/25 transition-all flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </motion.button>
      )}
    </motion.div>
  )
}

// Loading Timeout Error
export function TimeoutErrorState({ onRetry, className = "" }: ErrorStateProps) {
  return (
    <motion.div 
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Clock className="w-10 h-10 text-yellow-400" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">
        Carregamento Lento
      </h3>
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        As ferramentas estão demorando mais que o normal para carregar. Você pode aguardar ou tentar novamente.
      </p>
      
      <div className="flex justify-center items-center gap-4">
        {/* Loading dots */}
        <div className="flex justify-center items-center gap-1 mr-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/25 transition-all flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-3 h-3" />
            Tentar Agora
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// Generic Error State
export function GenericErrorState({ onRetry, className = "" }: ErrorStateProps) {
  return (
    <motion.div 
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <AlertCircle className="w-10 h-10 text-red-400" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">
        Algo deu errado
      </h3>
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        Ocorreu um erro inesperado ao carregar as ferramentas. Nossa equipe foi notificada.
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/25 transition-all flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </motion.button>
      )}
    </motion.div>
  )
}

// Empty Search Results State
export function EmptySearchState({ searchTerm, onClearSearch, className = "" }: { 
  searchTerm: string
  onClearSearch: () => void
  className?: string
}) {
  return (
    <motion.div 
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
        animate={{ 
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Search className="w-10 h-10 text-blue-400" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">
        Nenhum resultado encontrado
      </h3>
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        Não encontramos ferramentas para "{searchTerm}". Tente termos diferentes ou explore outras categorias.
      </p>
      
      <div className="flex justify-center gap-3">
        <motion.button
          onClick={onClearSearch}
          className="px-6 py-3 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Limpar Busca
        </motion.button>
      </div>
      
      {/* Search suggestions */}
      <div className="mt-8">
        <p className="text-sm text-white/60 mb-3">Sugestões populares:</p>
        <div className="flex justify-center flex-wrap gap-2">
          {['copywriting', 'seo', 'design', 'marketing'].map((suggestion) => (
            <motion.button
              key={suggestion}
              onClick={() => onClearSearch()}
              className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-white/70 hover:bg-white/10 transition-all border border-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// No Tools Available State (Empty state for when there are genuinely no tools)
export function NoToolsState({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ArchiveX className="w-10 h-10 text-purple-400" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-2">
        Nenhuma ferramenta disponível
      </h3>
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        Ainda não temos ferramentas nesta categoria. Estamos trabalhando para adicionar mais conteúdo em breve.
      </p>
      
      <motion.div
        className="flex justify-center items-center gap-2 text-sm text-white/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-1 h-1 bg-purple-400 rounded-full" />
        <span>Novas ferramentas em breve</span>
        <div className="w-1 h-1 bg-purple-400 rounded-full" />
      </motion.div>
    </motion.div>
  )
}
