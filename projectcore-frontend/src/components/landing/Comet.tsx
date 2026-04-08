'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function Comet() {
  // Generar partículas de fuego para el cometa
  const fireParticles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 60,
      y: Math.random() * 80 - 40,
      size: Math.random() * 6 + 3,
      delay: Math.random() * 1.2,
    })),
    []
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <motion.div
        className="absolute z-10"
        initial={{ x: -300, y: -150 }}
        animate={{ 
          x: [300, -300],
          y: [150, -150]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: 'linear',
          y: {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'reverse'
          }
        }}
        style={{ 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%) rotate(45deg) scale(2.5)' 
        }}
      >
        {/* Halo de combustión en la cabeza del cometa */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-white/80 via-yellow-300/60 to-orange-400/40 blur-3xl"
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        
        <motion.div
          className="absolute left-1/2 top-1/2 w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-yellow-200/70 via-orange-300/50 to-red-400/30 blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />

        {/* Cometa principal */}
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        >
          {/* Cuerpo del cometa - mucho más grande y luminoso */}
          <div className="w-16 h-16 bg-gradient-to-r from-white via-yellow-200 to-orange-300 rounded-full shadow-[0_0_60px_rgba(255,255,255,0.9),0_0_120px_rgba(251,191,36,0.8),0_0_180px_rgba(251,146,60,0.6)]" />
          
          {/* Cola del cometa - roja y de fuego */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-80 h-4 bg-gradient-to-r from-white via-yellow-300 via-orange-400 via-red-500 to-transparent"
            style={{ 
              transform: 'translate(-50%, -50%) rotate(45deg)',
              transformOrigin: 'left center',
              filter: 'blur(2px)'
            }}
            animate={{ 
              scaleX: [1, 1.4, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          />
          
          {/* Cola secundaria más brillante */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-60 h-2 bg-gradient-to-r from-white via-yellow-200 to-transparent"
            style={{ 
              transform: 'translate(-50%, -50%) rotate(45deg)',
              transformOrigin: 'left center'
            }}
            animate={{ 
              scaleX: [1, 1.6, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 0.3
            }}
          />

          {/* Cola terciaria de fuego intenso */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-40 h-1 bg-gradient-to-r from-yellow-100 via-orange-200 to-transparent"
            style={{ 
              transform: 'translate(-50%, -50%) rotate(45deg)',
              transformOrigin: 'left center'
            }}
            animate={{ 
              scaleX: [1, 1.8, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 0.6
            }}
          />
        </motion.div>

        {/* Partículas de fuego detrás del cometa - en la cola */}
        {fireParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              filter: 'blur(1px)',
              boxShadow: `0 0 ${particle.size * 4}px rgba(251, 146, 60, 1), 0 0 ${particle.size * 6}px rgba(239, 68, 68, 0.8)`
            }}
            animate={{
              x: [0, -50 - particle.x],
              y: [0, -30 - particle.y],
              opacity: [1, 0],
              scale: [1, 0.2]
            }}
            transition={{
              duration: 4 + Math.random(),
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut'
            }}
          />
        ))}

        {/* Destellos de fuego más intensos y grandes en la cola */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute bg-yellow-100 rounded-full"
            style={{
              left: `${Math.random() * 100 - 50}px`,
              top: `${Math.random() * 60 - 30}px`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              filter: 'blur(1.5px)',
              boxShadow: '0 0 20px rgba(251, 191, 36, 1), 0 0 30px rgba(251, 146, 60, 0.8)'
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 60],
              y: [0, (Math.random() - 0.5) * 35],
              opacity: [1, 0],
              scale: [1, 0.1]
            }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeOut'
            }}
          />
        ))}

        {/* Efectos de fuego adicionales más grandes en la cola */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-60 h-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-orange-400/30 via-red-500/25 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.7, 1],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />

        {/* Halo de fuego específico en la cola */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-red-500/20 via-orange-400/15 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      </motion.div>

      {/* Efectos de fondo para el cometa */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-orange-500/20 via-red-500/15 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      </div>
    </div>
  )
} 