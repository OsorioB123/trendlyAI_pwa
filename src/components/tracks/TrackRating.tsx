'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, Send, Edit3 } from 'lucide-react'
import { TrackRatingProps } from '../../types/track'

export default function TrackRating({ 
  trackId, 
  currentRating, 
  onSubmitRating 
}: TrackRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (currentRating) {
      setRating(currentRating.rating)
      setComment(currentRating.comment || '')
    }
  }, [currentRating])

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
    if (!showCommentForm && !currentRating) {
      setShowCommentForm(true)
    }
  }

  const handleStarHover = (starRating: number) => {
    setHoverRating(starRating)
  }

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmitRating(rating, comment.trim() || undefined)
      setShowCommentForm(false)
      setIsEditing(false)
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setShowCommentForm(true)
  }

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1:
        return 'Muito insatisfeito'
      case 2:
        return 'Insatisfeito'
      case 3:
        return 'Neutro'
      case 4:
        return 'Satisfeito'
      case 5:
        return 'Muito satisfeito'
      default:
        return 'Avaliar trilha'
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      {/* Current Rating Display */}
      {currentRating && !isEditing ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Sua Avaliação</h3>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg text-sm transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= currentRating.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/80">
              {getRatingText(currentRating.rating)}
            </span>
          </div>

          {currentRating.comment && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-white/80">Seu comentário:</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed pl-6">
                {currentRating.comment}
              </p>
            </div>
          )}

          <p className="text-xs text-white/40 mt-3">
            Avaliado em {new Date(currentRating.createdAt).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      ) : (
        <div>
          {/* Rating Form */}
          <h3 className="text-lg font-semibold text-white mb-4">
            {currentRating ? 'Editar Avaliação' : 'Avaliar Trilha'}
          </h3>

          {/* Star Rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-200 ${
                      star <= displayRating
                        ? 'text-yellow-400 fill-yellow-400 scale-110'
                        : 'text-gray-400 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <p className={`text-sm transition-colors duration-200 ${
              displayRating > 0 ? 'text-yellow-300' : 'text-white/60'
            }`}>
              {getRatingText(displayRating)}
            </p>
          </div>

          {/* Comment Section */}
          {(showCommentForm || currentRating?.comment) && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-white/60" />
                <span className="text-sm font-medium text-white/80">
                  Comentário (opcional)
                </span>
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência com esta trilha..."
                disabled={isSubmitting}
                className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-white/40">
                  {comment.length}/500 caracteres
                </span>
                
                {!currentRating && (
                  <button
                    onClick={() => {
                      setShowCommentForm(false)
                      setComment('')
                    }}
                    className="text-xs text-white/60 hover:text-white/80 transition-colors"
                  >
                    Pular comentário
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {rating > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!showCommentForm && !currentRating?.comment && (
                  <button
                    onClick={() => setShowCommentForm(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    + Adicionar comentário
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setShowCommentForm(false)
                      if (currentRating) {
                        setRating(currentRating.rating)
                        setComment(currentRating.comment || '')
                      }
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSubmitting 
                    ? 'Enviando...' 
                    : currentRating 
                      ? 'Atualizar Avaliação' 
                      : 'Enviar Avaliação'
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rating Guidelines */}
      {!currentRating && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-white/80 mb-2">Como avaliar:</h4>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1].map((star) => (
                  <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span>Muito insatisfeito - Trilha não atendeu às expectativas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((star) => (
                  <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span>Neutro - Trilha mediana, algumas melhorias necessárias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span>Muito satisfeito - Trilha excelente, recomendo!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}