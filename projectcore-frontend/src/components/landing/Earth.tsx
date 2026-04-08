'use client'

import { motion } from 'framer-motion'

export default function Earth() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Earth Sphere */}
        <div className="w-80 h-80 rounded-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #4B9CD3 0%, #1B4F72 100%)',
            boxShadow: 'inset -20px -20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(75, 156, 211, 0.3)'
          }}
        >
          {/* Aros azules animados */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-blue-400/60"
              style={{
                left: `${8 + i * 8}px`,
                top: `${8 + i * 8}px`,
                width: `${240 - i * 16}px`,
                height: `${240 - i * 16}px`,
                borderColor: '#60a5fa',
                opacity: 0.5 - i * 0.12
              }}
              animate={{
                scale: [1, 1.2, 0.7, 1],
                opacity: [0.5 - i * 0.12, 0.7 - i * 0.12, 0.2, 0.5 - i * 0.12]
              }}
              transition={{
                duration: 3.5 + i,
                repeat: Infinity,
                delay: i * 0.7
              }}
            />
          ))}
          {/* Cloud Layer */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: [-10, 10, -10]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 30%),
                radial-gradient(circle at 60% 50%, rgba(255,255,255,0.3) 0%, transparent 25%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 35%)
              `
            }}
          />
          {/* Atmosphere Glow */}
          <div className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)'
            }}
          />
          {/* Cyan luminous spheres */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: '-80px',
                top: '-80px',
                width: '420px',
                height: '420px',
                background: `radial-gradient(circle at ${30+i*20}% ${40+i*20}%, rgba(56, 189, 248, 0.25) 0%, transparent 70%)`,
                filter: 'blur(50px)',
                opacity: 0.5 - i*0.1
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 70 + i*12, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Nebulosas alrededor */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: '-60px',
                top: '-60px',
                width: '380px',
                height: '380px',
                background: `radial-gradient(circle at ${20 + i*20}% ${30 + i*15}%, rgba(147,92,246,0.2) 0%, transparent 70%)`,
                filter: 'blur(60px)',
                opacity: 0.6 - i*0.1
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60 + i*10, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Cyan rays */}
          {[...Array(16)].map((_,i)=>(
            <motion.div key={i} className="absolute left-1/2 top-1/2 bg-cyan-400/70" style={{width:2,height:120,borderRadius:'1px',transform:`translate(-50%,-100%) rotate(${i*22.5}deg)`}}
              initial={{scaleY:0,opacity:1}}
              animate={{scaleY:[0,1,0],opacity:[1,0.8,0]}}
              transition={{duration:3,repeat:Infinity,delay:i*0.15,ease:'easeInOut'}}/>
          ))}
        </div>

        {/* Orbiting Satellites */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 120}deg) translateX(150px)`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6
            }}
          >
            <div className="w-4 h-px bg-white/30 absolute right-2 top-1/2 transform -translate-y-1/2" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 