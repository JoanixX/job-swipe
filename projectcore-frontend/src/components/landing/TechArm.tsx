'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function TechArm() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-full"
      initial={{ opacity: 0, x: 100 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="relative w-96 h-[600px]">
        {/* Main Arm */}
        <motion.div
          className="absolute bottom-0 right-0 w-48 h-[500px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl"
          style={{
            transformOrigin: "bottom right",
          }}
          animate={{
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {/* Tech Details */}
          <motion.div
            className="absolute inset-x-4 top-8 bottom-8 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #1E293B 0%, #0F172A 100%)",
            }}
          >
            {/* Glowing Lines */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(139, 92, 246, 0.1) 100%)",
                  "linear-gradient(90deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(139, 92, 246, 0.3) 100%)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Circuit Lines */}
            <div className="absolute inset-4 flex flex-col space-y-4">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 bg-violet-500 rounded"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 4,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Joints */}
          {[0.2, 0.5, 0.8].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 w-12 h-12 transform -translate-x-1/2"
              style={{ top: `${pos * 100}%` }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gray-700 rounded-full" />
                <motion.div
                  className="absolute inset-2 bg-violet-500 rounded-full opacity-75"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hand */}
        <motion.div
          className="absolute bottom-0 right-12 w-24 h-32"
          animate={{
            rotate: [-20, 0, -20],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {/* Fingers */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 w-4 h-24 bg-gray-800 rounded-full"
              style={{
                left: `${i * 25}%`,
                transformOrigin: "bottom",
              }}
              animate={{
                rotate: [-10 - i * 5, 10 + i * 5, -10 - i * 5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            >
              <motion.div
                className="absolute inset-x-1 h-1/2 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, rgba(139, 92, 246, 0.3), transparent)",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
} 