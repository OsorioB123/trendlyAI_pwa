'use client'

import { useEffect, useMemo, useState } from 'react'
import { Star, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TrackRatingProps } from '../../types/track'

const MAX_COMMENT_LENGTH = 500

export default function TrackRating({ currentRating, onSubmitRating }: TrackRatingProps) {
  const [rating, setRating] = useState<number>(currentRating?.rating || 0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState<string>(currentRating?.comment || '')
  const [showComment, setShowComment] = useState<boolean>(Boolean(currentRating?.comment))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (currentRating) {
      setRating(currentRating.rating)
      setComment(currentRating.comment || '')
      setShowComment(Boolean(currentRating.comment))
    }
  }, [currentRating])

  const displayRating = useMemo(() => {
    return hoverRating || rating
  }, [hoverRating, rating])

  const handleStarClick = (value: number) => {
    setRating(value)
    setShowComment(true)
  }

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmitRating(rating, comment.trim() ? comment.trim() : undefined)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error submitting rating', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="content-card rounded-2xl p-6 relative">
      <h2 className="text-xl font-semibold mb-4 tracking-tight text-center">
        Avalie esta trilha
      </h2>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating
          return (
            <button
              key={star}
              type="button"
              className={cn('rating-star', isFilled ? 'star-filled' : null)}
              aria-label={`Avaliar com ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleStarClick(star)}
              disabled={isSubmitting}
            >
              <Star className="w-7 h-7" />
            </button>
          )
        })}
      </div>

      <div className={cn('rating-comment-section', showComment && 'is-visible')}>
        <div>
          <textarea
            className="w-full rounded-lg p-3 mb-4 text-white/90 placeholder-white/40 focus:outline-none liquid-glass-input"
            rows={3}
            placeholder="Deixe um comentario (opcional)..."
            value={comment}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(event) => setComment(event.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between text-xs text-white/50 mb-3">
            <span>{comment.length}/{MAX_COMMENT_LENGTH}</span>
            {currentRating && (
              <span>Sua avaliacao pode ser atualizada a qualquer momento.</span>
            )}
          </div>
          <button
            type="button"
            className="w-full btn-primary px-4 py-3"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar avaliacao'}
          </button>
        </div>
      </div>

      <div className={cn('rating-success-overlay', showSuccess && 'show')}>
        <div className="rating-success-popup">
          <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 border border-white/10">
            <Check className="w-8 h-8 text-brand-green" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Avaliacao enviada!</h3>
          <p className="text-white/70 text-sm">Obrigado pelo feedback.</p>
        </div>
      </div>
    </div>
  )
}

