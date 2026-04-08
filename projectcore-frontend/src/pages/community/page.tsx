'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Stars from '@/components/Stars'
import Planet from '@/components/Planet'

const testimonials = [
  {
    name: 'Diego Flores',
    role: 'Estudiante de Ingeniería',
    university: 'Universidad Nacional Mayor de San Marcos',
    quote: 'Gracias a Project Core conseguí mi primera práctica en una startup tecnológica.',
    image: '/testimonials/diego.jpg'
  },
  {
    name: 'Valentina Torres',
    role: 'Estudiante de Administración',
    university: 'Universidad de Lima',
    quote: 'La plataforma me ayudó a encontrar oportunidades que realmente se alinean con mis intereses.',
    image: '/testimonials/valentina.jpg'
  },
  {
    name: 'Jorge Mendoza',
    role: 'Estudiante de Sistemas',
    university: 'UNCP',
    quote: 'El proceso de matching con IA hace que encontrar prácticas sea mucho más eficiente.',
    image: '/testimonials/jorge.jpg'
  }
]

const communityStats = [
  { number: '5,000+', text: 'Estudiantes Activos' },
  { number: '200+', text: 'Empresas Asociadas' },
  { number: '50+', text: 'Universidades Aliadas' },
  { number: '1,000+', text: 'Conexiones Exitosas' }
]

const events = [
  {
    title: 'Tech Talks',
    description: 'Charlas mensuales con líderes de la industria tecnológica.',
    date: 'Último jueves de cada mes',
    icon: '🎤'
  },
  {
    title: 'Hackathons',
    description: 'Competencias trimestrales para resolver desafíos reales.',
    date: 'Cada 3 meses',
    icon: '💻'
  },
  {
    title: 'Mentorías',
    description: 'Sesiones personalizadas con profesionales experimentados.',
    date: 'Semanal',
    icon: '🎯'
  },
  {
    title: 'Networking',
    description: 'Eventos para conectar con otros miembros de la comunidad.',
    date: 'Mensual',
    icon: '🤝'
  }
]

export default function Community() {
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
                ÚNETE A NUESTRA
                <br />
                <span className="gradient-text">COMUNIDAD</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400">
                Forma parte de una red de estudiantes, profesionales y empresas 
                comprometidos con el futuro del trabajo en Latinoamérica.
              </p>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Únete Ahora
              </motion.button>
            </motion.div>

            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
              <Planet />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <div className="absolute inset-0 connection-lines" />
        
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
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

      {/* Testimonials Section */}
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
              HISTORIAS DE
              <br />
              <span className="gradient-text">ÉXITO</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Conoce las experiencias de quienes ya son parte de nuestra comunidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-violet-900/20" />
                </div>
                <blockquote className="text-gray-400 mb-4">"{testimonial.quote}"</blockquote>
                <h3 className="text-lg font-bold">{testimonial.name}</h3>
                <p className="text-violet-400 text-sm">{testimonial.role}</p>
                <p className="text-gray-500 text-sm">{testimonial.university}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
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
              PRÓXIMOS
              <br />
              <span className="gradient-text">EVENTOS</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Participa en nuestras actividades y crece junto a la comunidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{event.icon}</div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <p className="text-sm text-violet-400">{event.date}</p>
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
              ¿LISTO PARA
              <br />
              <span className="gradient-text">DESPEGAR?</span>
            </h2>
            <p className="text-gray-400">
              Únete a una comunidad que está transformando el futuro del trabajo
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Registrarse
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explorar Eventos
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 