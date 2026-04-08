'use client'

import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChambeaYaHome() {
  const [, setLocation] = useLocation()

  const features = [
    {
      title: "Registro de Estudiantes",
      description: "Completa tu perfil y conecta con oportunidades reales",
      icon: "🎓",
      path: "/register-student"
    },
    {
      title: "Registro de Empresas",
      description: "Publica ofertas y encuentra talento universitario",
      icon: "🏭",
      path: "/register-company"
    }
  ]

  const studentBenefits = [
    {
      title: "Experiencia Real",
      description: "Trabaja en proyectos reales con empresas peruanas",
      icon: "💼"
    },
    {
      title: "Remuneración",
      description: "La mayoría de proyectos incluyen pago por tu trabajo",
      icon: "💰"
    },
    {
      title: "Networking",
      description: "Conecta con profesionales y amplía tu red de contactos",
      icon: "🤝"
    },
    {
      title: "Portafolio",
      description: "Fortalece tu CV con experiencias profesionales",
      icon: "📁"
    },
    {
      title: "Habilidades",
      description: "Desarrolla competencias clave para el mundo laboral",
      icon: "🚀"
    },
    {
      title: "Flexibilidad",
      description: "Proyectos de 2-8 semanas que se adaptan a tu tiempo",
      icon: "⏰"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF258D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#390062] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setLocation('/')}
        >
          <img
            src="/images/logoCircular.png"
            alt="Chambea Ya Logo"
            className="w-10 h-10"
          />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF258D] to-white bg-clip-text text-transparent">
            Chambea Ya
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:flex space-x-4"
        >
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setLocation('/register-student')}
          >
            Registro Estudiantes
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setLocation('/register-company')}
          >
            Registro Empresas
          </Button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="sm:hidden bg-white/10 rounded-lg p-2"
          onClick={() => {
            // Mobile menu functionality can be added here
            setLocation('/register-student')
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-[#FF258D] to-white bg-clip-text text-transparent leading-tight">
            ROMPE BARRERAS
            <br />
            CONECTA PERSONAS
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Estamos registrando a los usuarios de nuestra primera generación. Conectamos talento universitario 
            con empresas que necesitan soluciones reales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 px-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-[#FF258D]/50 transition-all duration-300 w-full sm:w-auto"
              onClick={() => setLocation('/register-student')}
            >
              🎓 Registrarse como Estudiante
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto"
              onClick={() => setLocation('/register-company')}
            >
              🏭 Registrarse como Empresa
            </Button>
          </div>

          <div className="flex justify-center px-4">
            <Button
              size="lg"
              className="bg-white text-[#1a0b3d] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg w-full sm:w-auto"
              onClick={() => setLocation('/pronto-disponible')}
            >
              🔐 Iniciar Sesión
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 bg-gradient-to-r from-white to-[#FF258D] bg-clip-text text-transparent">
            ¿Qué puedes hacer aquí?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 hover:border-[#FF258D]/50 transition-all duration-300 hover:shadow-[#FF258D]/20 hover:shadow-xl cursor-pointer"
                      onClick={() => setLocation(feature.path)}>
                  <CardHeader className="text-center">
                    <div className="text-3xl sm:text-4xl mb-4">{feature.icon}</div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-200 text-center text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Student Benefits Section */}
      <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 bg-gradient-to-r from-white to-[#FF258D] bg-clip-text text-transparent">
            Beneficios para Universitarios
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {studentBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              >
                <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 hover:border-[#FF258D]/50 transition-all duration-300 hover:shadow-[#FF258D]/20 hover:shadow-xl">
                  <CardHeader className="text-center">
                    <div className="text-3xl sm:text-4xl mb-4">{benefit.icon}</div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-white">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-200 text-center text-sm sm:text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Company Benefits Section */}
      <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16 bg-gradient-to-r from-white to-[#FF258D] bg-clip-text text-transparent">
            Beneficios para Empresa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#FF258D] mb-2">50%</div>
              <div className="text-gray-200 text-sm sm:text-base">Menor costo vs. consultoría tradicional</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#FF258D] mb-2">2-8</div>
              <div className="text-gray-200 text-sm sm:text-base">Semanas de entrega por proyecto</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#FF258D] mb-2">100%</div>
              <div className="text-gray-200 text-sm sm:text-base">Talentos verificados y calificados</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-300 text-sm sm:text-base">
          <p>&copy; 2025 Chambea Ya. Conectando talento universitario con oportunidades reales.</p>
        </div>
      </footer>
    </div>
  )
} 