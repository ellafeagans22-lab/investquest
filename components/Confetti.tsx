'use client'

import { useState, useEffect } from 'react'

const COLORS = ['#F5A623', '#ffffff', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa']
const ANIMATIONS = ['confetti-fall', 'confetti-fall-l', 'confetti-fall-r']

const pieces = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  width: 6 + Math.random() * 8,
  height: 4 + Math.random() * 10,
  color: COLORS[i % COLORS.length],
  duration: 2 + Math.random() * 1.5,
  delay: Math.random() * 1,
  rounded: i % 3 === 0,
  animation: ANIMATIONS[i % 3],
}))

export default function Confetti() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-20px',
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: p.rounded ? '50%' : '2px',
            animation: `${p.animation} ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
