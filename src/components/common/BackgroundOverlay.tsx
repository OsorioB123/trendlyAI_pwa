import React from 'react'

type BackgroundOverlayProps = {
  position?: 'fixed' | 'absolute'
  behind?: boolean
  className?: string
}

export default function BackgroundOverlay({
  position = 'fixed',
  behind = true,
  className = '',
}: BackgroundOverlayProps) {
  const zIndex = behind ? '-z-10' : ''
  return (
    <div className={`${position} inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent ${zIndex} ${className}`} />
  )
}

