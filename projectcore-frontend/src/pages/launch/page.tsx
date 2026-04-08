'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Stars from '@/components/Stars'
import Rocket from '@/components/Rocket'

const launchStats = [
  { number: '24/7', text: 'Soporte continuo para estudiantes y empresas' },
  { number: '15min', text: 'Tiempo promedio de respuesta' },
  { number: '100%', text: 'Compromiso con la calidad' },
  { number: '0', text: 'Costo para estudiantes' },
]

const features = [
  {
    title: 'Registro Rápido',
    description: 'Crea tu perfil profesional en minutos y comienza tu viaje.',
    icon: '🚀'
  },
  {
    title: 'IA Matching',
    description: 'Nuestro algoritmo encuentra las mejores oportunidades para ti.',
    icon: '🧠'
  },
  {
    title: 'Seguimiento Real',
    description: 'Monitorea tu progreso y recibe retroalimentación constante.',
    icon: '📊'
  },
  {
    title: 'Mentoría',
    description: 'Conecta con profesionales que guiarán tu desarrollo.',
    icon: '👥'
  }
]

export default function Launch() {
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
                INICIA TU
                <br />
                <span className="gradient-text">VIAJE PROFESIONAL</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400">
                Project Core te conecta con las mejores oportunidades laborales. 
                Comienza tu carrera profesional con el respaldo de la tecnología y mentores expertos.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Comienza Ahora
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Demo
                </motion.button>
              </div>
            </motion.div>

            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
              <Rocket />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              CARACTERÍSTICAS
              <br />
              <span className="gradient-text">PRINCIPALES</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Descubre las herramientas que te ayudarán a alcanzar tus metas profesionales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <div className="absolute inset-0 connection-lines" />
        
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {launchStats.map((stat, index) => (
              <motion.div
                key={stat.number}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">
                  {stat.number}
                </div>
                <p className="text-gray-400">{stat.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              ¿LISTO PARA
              <br />
              <span className="gradient-text">DESPEGAR?</span>
            </h2>
            <p className="text-gray-400">
              Únete a la comunidad de profesionales que están transformando el futuro del trabajo
            </p>
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Comienza Tu Viaje
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 