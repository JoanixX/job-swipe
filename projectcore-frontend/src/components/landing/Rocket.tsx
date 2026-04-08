'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function Rocket() {
  // Generar ángulos únicos para las líneas de velocidad
  const speedLines = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => ({
      angle: (i * 360) / 36,
    })),
    []
  );
  const sparkParticles = useMemo(() =>
    Array.from({ length: 3 }, () =>
      Array.from({ length: 36 }, () => ({
        x: (Math.random() - 0.5) * 120,
        delay: Math.random() * 0.7,
      }))
    ),
    []
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <motion.div
        className="absolute z-10"
        initial={{ x: 0, rotate: 0 }}
        animate={{ x: [-8, 8, -8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: '35%', top: '-15%', transform: 'translate(-50%, -50%) rotate(30deg) scale(0.85)' }}
      >
        {/* Flame halo */}
        <motion.div 
          className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-orange-400/30 via-orange-600/20 to-transparent blur-3xl" 
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }} 
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }} 
        />
        {/* Additional flame glow */}
        <motion.div 
          className="absolute left-1/2 top-1/2 w-[380px] h-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-red-500/20 via-orange-500/10 to-transparent blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <svg viewBox="0 0 120 320" width="260" height="700" className="drop-shadow-[0_10px_25px_rgba(138,83,255,0.35)]">
          <defs>
            <radialGradient id="rocketPurple" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#7b50ff" />
              <stop offset="100%" stopColor="#322772" />
            </radialGradient>
            <linearGradient id="flameGradNew" x1="60" y1="240" x2="60" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" />
              <stop offset="0.15" stopColor="#ffd977" />
              <stop offset="0.45" stopColor="#ff8a00" />
              <stop offset="1" stopColor="#ff4500" stopOpacity="0" />
            </linearGradient>
            <filter id="flameBlur">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Unified cone + body */}
          <path d="M60 0 C80 10 95 35 95 60 L95 240 C95 260 25 260 25 240 L25 60 C25 35 40 10 60 0 Z" fill="url(#rocketPurple)" />
          {/* Window */}
          <circle cx="60" cy="130" r="18" fill="#884dff" stroke="#1e1a3f" strokeWidth="4" />
          {/* Center pipe */}
          <rect x="57" y="180" width="6" height="70" rx="3" fill="#1e1a3f" />
          {/* Side fins */}
          <path d="M20 190 Q5 240 30 270 L30 230 Q25 205 20 190 Z" fill="#1e1a3f" />
          <path d="M100 190 Q115 240 90 270 L90 230 Q95 205 100 190 Z" fill="#1e1a3f" />
          {/* Nozzle */}
          <rect x="45" y="240" width="30" height="28" rx="6" fill="#1e1a3f" />
          {/* Flame (flickering) */}
          <motion.g filter="url(#flameBlur)">
            <motion.path
              d="M60 268 C75 290 80 310 60 320 C40 310 45 290 60 268 Z"
              fill="url(#flameGradNew)"
              animate={{ 
                scaleY: [1, 1.2, 0.9, 1], 
                scaleX: [1, 1.1, 0.95, 1], 
                opacity: [0.9, 1, 0.8, 0.9], 
                y: [0, -3, 0] 
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            {/* Additional flame layers for more realism */}
            <motion.path
              d="M60 268 C70 285 75 300 60 315 C45 300 50 285 60 268 Z"
              fill="url(#flameGradNew)"
              animate={{ 
                scaleY: [1, 1.15, 0.95, 1], 
                scaleX: [1, 1.05, 0.98, 1], 
                opacity: [0.7, 0.9, 0.6, 0.7], 
                y: [0, -2, 0] 
              }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.1 }}
            />
          </motion.g>
          {/* Spark particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.circle
              key={i}
              cx="60"
              cy="300"
              r="1.8"
              fill="#ffb347"
              animate={{
                x: [0, (Math.random() - 0.5) * 26],
                y: [0, (Math.random() - 0.2) * 40],
                opacity: [1, 0]
              }}
              transition={{ duration: 0.8 + Math.random()*0.4, repeat: Infinity, delay: i*0.15 }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  )
} 