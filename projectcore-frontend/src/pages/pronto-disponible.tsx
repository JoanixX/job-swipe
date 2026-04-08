'use client'

import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'

export default function ProntoDisponible() {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF258D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#390062] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
      >
        <div className="text-8xl mb-8">🚀</div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#FF258D] to-white bg-clip-text text-transparent">
          Pronto Disponible
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Estamos trabajando para traerte la mejor experiencia de login. 
          Muy pronto podrás acceder a tu dashboard personalizado.
        </p>

        <div className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Qué podrás hacer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF258D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-200">Gestionar tu perfil profesional</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF258D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-200">Ver proyectos disponibles</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF258D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-200">Postular a oportunidades</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF258D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-gray-200">Seguir tu progreso</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-[#FF258D]/50 transition-all duration-300"
            onClick={() => setLocation('/chambea-ya')}
          >
            🏠 Volver al Inicio
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            onClick={() => setLocation('/register-student')}
          >
            🎓 Registrarse Ahora
          </Button>
        </div>

        <div className="mt-12 text-gray-400">
          <p className="text-sm">
            ¿Tienes preguntas? Contáctanos en{' '}
            <a 
              href="mailto:projectcoregroup@gmail.com" 
              className="text-[#FF258D] hover:text-[#FF258D]/80 transition-colors"
            >
              projectcoregroup@gmail.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
} 