'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

interface PlanetProps {
  variant?: 'default' | 'earth'
}

export default function Planet({ variant = 'default' }: PlanetProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const size = isMobile ? 200 : 320

  // Generar estrellas fugaces solo una vez
  const shootingStars = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      angle: 30 + i * 60,
      delay: i * 1.2
    })),
    []
  );

  const satellites = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      angle: (i * 120) % 360,
      delay: i * 0.6
    })),
    []
  );

  // Asteroids
  const asteroids = useMemo(() =>
    Array.from({ length: 5 }, () => ({
      angle: Math.random()*360,
      distance: Math.random()*0.4 + 0.6,
    })),
  []);

  return (
    <div className="relative flex items-center justify-center" style={{width: size, height: size}}>
      {/* Planeta Tierra realista */}
      {variant === 'earth' && (
        <motion.svg
          viewBox="0 0 320 320"
          width={size}
          height={size}
          className="absolute"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {/* Atmósfera */}
          <ellipse cx="160" cy="160" rx="150" ry="150" fill="#60a5fa" opacity="0.18" />
          {/* Océano */}
          <ellipse cx="160" cy="160" rx="130" ry="130" fill="#2563eb" />
          {/* Continentes (simplificados) */}
          <path d="M120 140 Q140 120 180 140 Q200 180 160 200 Q120 180 120 140 Z" fill="#a3e635" />
          <path d="M200 100 Q220 120 210 160 Q190 170 180 130 Q190 110 200 100 Z" fill="#a3e635" />
          {/* Nubes */}
          <ellipse cx="180" cy="110" rx="30" ry="10" fill="#fff" opacity="0.5" />
          <ellipse cx="140" cy="180" rx="20" ry="8" fill="#fff" opacity="0.4" />
        </motion.svg>
      )}
      {/* Planeta morado con estrellas fugaces */}
      {variant === 'default' && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{ width: size, height: size, background: 'radial-gradient(circle at 60% 40%, #a78bfa 0%, #6d28d9 100%)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Esferas de luz violeta animadas */}
          {Array.from({length:6}).map((_,i)=>(
            <motion.div key={i} className="absolute left-1/2 top-1/2"
              style={{width:8,height:8,borderRadius:'50%',background:'#d8b4fe',translateX:-4,translateY:-4}}
              animate={{
                x:[0, Math.cos((i/6)*2*Math.PI)*size*0.5,0],
                y:[0, Math.sin((i/6)*2*Math.PI)*size*0.5,0],
                opacity:[1,0.3,1]
              }}
              transition={{duration:3.5+i*0.3,repeat:Infinity,ease:'easeInOut'}} />
          ))}
          {/* Satélites animados */}
          {satellites.map((sat, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full"
              style={{
                transform: `rotate(${sat.angle}deg) translateX(${size * 0.5}px)`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: sat.delay
              }}
            >
              <div className="w-4 h-px bg-white/30 absolute right-2 top-1/2 transform -translate-y-1/2" />
            </motion.div>
          ))}
          {/* Estrellas fugaces */}
          {shootingStars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ width: size, height: size, pointerEvents: 'none' }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, Math.cos((star.angle * Math.PI) / 180) * size * 0.5],
                y: [0, Math.sin((star.angle * Math.PI) / 180) * size * 0.5],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            >
              <div className="w-32 h-1 bg-gradient-to-r from-white via-purple-200 to-transparent rounded-full opacity-80 blur-sm" />
            </motion.div>
          ))}
          {/* Asteroides morados animados */}
          {asteroids.map((ast, i) => (
            <motion.div
              key={i}
              className="absolute bg-purple-400 rounded-full"
              style={{ width: 18, height: 18, left: '50%', top: '50%', translateX: -9, translateY: -9 }}
              animate={{
                x: [0, Math.cos(ast.angle*Math.PI/180)*size*ast.distance*1.3, 0],
                y: [0, Math.sin(ast.angle*Math.PI/180)*size*ast.distance*1.3, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 4 + i*0.3, repeat: Infinity, ease: 'easeInOut', delay: i*0.5 }}
            />
          ))}
          {/* Glowing ring */}
          <motion.div className="absolute left-1/2 top-1/2 rounded-full border border-purple-300/60" style={{width:size*1.4,height:size*1.4,translateX:'-50%',translateY:'-50%',boxShadow:'0 0 25px 10px rgba(167,139,250,0.15)'}} animate={{rotate:[0,360]}} transition={{duration:18,repeat:Infinity,ease:'linear'}} />
        </>
      )}
    </div>
  )
} 