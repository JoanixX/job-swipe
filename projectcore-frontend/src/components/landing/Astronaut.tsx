'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Astronaut() {
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const createShootingStar = () => {
      const id = Date.now()
      const x = Math.random() * 200
      const y = Math.random() * 200
      setShootingStars(prev => [...prev, { id, x, y }])

      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id))
      }, 1000)
    }

    const interval = setInterval(createShootingStar, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glow y partículas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute left-1/2 top-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-blue-500/20 via-purple-500/20 to-transparent blur-3xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              filter: 'drop-shadow(0 0 12px #fff)'
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.7, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.11 }}
          />
        ))}
      </div>
      {/* Astronauta SVG NASA realista, animación sutil */}
      <motion.div
        className="relative w-[900px] h-[1350px] md:w-[1200px] md:h-[1800px] z-10"
        initial={{ y: 0 }}
        animate={{ y: [0, -32, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/images/astronaut.png"
          alt="Astronaut"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {/* Efectos de estrellas/destellos sutiles solo contorneando */}
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full pointer-events-none"
            style={{
              left: `${48 + 38 * Math.cos((i / 7) * 2 * Math.PI)}%`,
              top: `${50 + 43 * Math.sin((i / 7) * 2 * Math.PI)}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              filter: 'drop-shadow(0 0 16px #fff)'
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.21 }}
          />
        ))}
        {/* Rotating dotted ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 rounded-full border border-blue-400/40"
          style={{ width: '140%', height: '140%', translateX: '-50%', translateY: '-50%', boxShadow: '0 0 25px 8px rgba(96,165,250,0.15)' }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  )
} 