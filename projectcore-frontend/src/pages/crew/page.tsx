'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Stars from '@/components/Stars'
import Astronaut from '@/components/Astronaut'

const teamMembers = [
  {
    name: 'Carlos Rodríguez',
    role: 'CEO & Fundador',
    description: 'Visionario tecnológico con experiencia en IA y desarrollo de negocios.',
    image: '/team/carlos.jpg'
  },
  {
    name: 'Ana Martínez',
    role: 'CTO',
    description: 'Experta en IA y sistemas de matching para recursos humanos.',
    image: '/team/ana.jpg'
  },
  {
    name: 'Luis Gómez',
    role: 'Head of Operations',
    description: 'Especialista en procesos y optimización de recursos.',
    image: '/team/luis.jpg'
  },
  {
    name: 'María Sánchez',
    role: 'Head of Growth',
    description: 'Estratega de crecimiento con enfoque en mercados emergentes.',
    image: '/team/maria.jpg'
  }
]

const values = [
  {
    title: 'Innovación',
    description: 'Buscamos constantemente nuevas formas de mejorar la experiencia laboral.',
    icon: '💡'
  },
  {
    title: 'Inclusión',
    description: 'Creemos en la igualdad de oportunidades para todos.',
    icon: '🤝'
  },
  {
    title: 'Impacto',
    description: 'Trabajamos para generar un cambio positivo en la sociedad.',
    icon: '🌍'
  },
  {
    title: 'Excelencia',
    description: 'Nos esforzamos por mantener los más altos estándares.',
    icon: '⭐'
  }
]

export default function Crew() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <Stars />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="absolute inset-0 connection-lines" />
        
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              className="relative z-10 space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider leading-tight">
                CONOCE AL
                <br />
                <span className="gradient-text">EQUIPO</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400">
                Un grupo de apasionados por la tecnología y la educación, 
                trabajando para transformar el futuro del trabajo en Latinoamérica.
              </p>
            </motion.div>

            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
              <Astronaut />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <div className="absolute inset-0 connection-lines" />
        
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              NUESTROS
              <br />
              <span className="gradient-text">EXPLORADORES</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conoce a las mentes brillantes detrás de Project Core
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="card hover-lift hover-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-violet-900/20" />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <div className="text-violet-400 text-sm mb-2">{member.role}</div>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <div className="absolute inset-0 connection-lines" />
        
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              NUESTROS
              <br />
              <span className="gradient-text">VALORES</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo diario
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <div className="absolute inset-0 connection-lines" />
        
        <div className="container mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              ¿QUIERES SER PARTE
              <br />
              <span className="gradient-text">DEL EQUIPO?</span>
            </h2>
            <p className="text-gray-400">
              Estamos en búsqueda constante de talento apasionado por la tecnología y la innovación
            </p>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Posiciones Abiertas
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 