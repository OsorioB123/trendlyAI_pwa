'use client'

import { useEffect } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LockedModalProps {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
}

export function LockedModal({ open, title, description, onClose }: LockedModalProps) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={cn('locked-modal-overlay', open && 'locked-modal-overlay--visible')}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="locked-modal-content">
        <div className="icon-wrapper">
          <Lock className="w-7 h-7 text-white/70" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title || 'Etapa bloqueada'}</h3>
        <p className="text-white/70 mb-6">
          {description || 'Conclua as etapas anteriores para desbloquear esta.'}
        </p>
        <button type="button" className="btn-secondary w-full py-2.5" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  )
}

export default LockedModal
