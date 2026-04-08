'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3
      }))
      setStars(newStars)
    }

    generateStars()
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-black via-indigo-950 to-purple-900">
      {stars.map((star, i) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * (1 + Math.sin(i))}px`,
            height: `${star.size * (1 + Math.cos(i))}px`,
            boxShadow: `0 0 ${6 + star.size * 4}px ${star.size > 2 ? '#a78bfa' : '#fff'}`
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{
            duration: 2.5 + (i % 5) * 0.7,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
} 