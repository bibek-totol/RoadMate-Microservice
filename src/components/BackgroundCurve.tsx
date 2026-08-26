'use client'
import React from 'react'

interface BackgroundCurveProps {
  height?: string
  position?: 'top' | 'bottom'
}

export const BackgroundCurve = ({
  height = 'clamp(3rem, 8vw, 8rem)',
  position = 'bottom',
}: BackgroundCurveProps) => {
  const isTop = position === 'top'

  return (
    <svg
      viewBox="0 0 800 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 w-full z-20 ${isTop ? '-top-px' : '-bottom-px'}`}
      style={{ height: `calc(${height} + 1px)` }}
      aria-hidden="true"
    >
      <path
        fill="#0b0c10"
        d={isTop ? 'M 0 0 L 800 0 L 800 100 Q 400 20 0 100 Z' : 'M 0 100 L 0 0 Q 400 80 800 0 L 800 100 Z'}
      />
    </svg>
  )
}

export default BackgroundCurve
