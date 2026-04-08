'use client'

import { motion } from 'framer-motion'

export default function Capybara() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ y: 0 }}
      animate={{ y: [-6, 6, -6] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ethereal effects layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main luminous halo */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[380px] h-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-purple-500/25 via-fuchsia-500/15 to-transparent blur-3xl"
          animate={{ scale:[1,1.12,1], opacity:[0.8,1,0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease:'easeInOut' }}
        />
        
        {/* Blue ethereal glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-blue-400/20 via-blue-500/10 to-transparent blur-[64px]"
          animate={{ scale:[1.1,0.9,1.1], opacity:[0.6,0.8,0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease:'easeInOut' }}
        />

        {/* Contour glow effect */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-cyan-400/30 via-blue-500/20 to-transparent blur-[32px]"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.9, 0.7],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Additional contour blur */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[340px] h-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-indigo-400/20 via-purple-500/10 to-transparent blur-[24px]"
          animate={{ 
            scale: [0.95, 1.05, 0.95],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: `${45 + Math.random() * 10}%`,
              top: `${45 + Math.random() * 10}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 40],
              y: [0, (Math.random() - 0.5) * 40],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <img
        src="/images/capybara.png"
        alt="Capybara astronaut"
        style={{ width: 'auto', height: '100%', maxHeight: '340px', objectFit: 'contain' }}
        className="relative z-10"
      />
    </motion.div>
  )
} 