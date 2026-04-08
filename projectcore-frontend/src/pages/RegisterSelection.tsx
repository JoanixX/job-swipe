import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserGraduate, FaBuilding, FaArrowRight } from 'react-icons/fa';
import Logo from '@/components/Logo';

export default function RegisterSelection() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E0C2C] via-[#0F1724] to-[#0E0C2C] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0EA5FF] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => setLocation('/')}
        >
          ← Volver al Inicio
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Logo and Title */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¡Únete a ProjectCore!
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Conectamos talento estudiantil con oportunidades reales. 
              Elige tu perfil para comenzar tu registro.
            </p>
          </div>

          {/* Registration Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Registration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-[#0B1226]/80 to-[#0B1226]/60 backdrop-blur-sm border-[#0EA5FF]/30 hover:border-[#0EA5FF]/50 transition-all duration-300 h-full cursor-pointer group"
                onClick={() => setLocation('/register-student')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-[#0EA5FF]/20 to-[#7C3AED]/20 rounded-full w-20 h-20 flex items-center justify-center group-hover:from-[#0EA5FF]/30 group-hover:to-[#7C3AED]/30 transition-colors">
                    <FaUserGraduate className="text-[#0EA5FF] text-3xl" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Soy Estudiante
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    Busco prácticas profesionales y oportunidades de crecimiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#0EA5FF] rounded-full"></div>
                      <span>Acceso a oportunidades de prácticas</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#0EA5FF] rounded-full"></div>
                      <span>Conexión directa con empresas</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#0EA5FF] rounded-full"></div>
                      <span>Desarrollo de habilidades profesionales</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#0EA5FF] rounded-full"></div>
                      <span>Construcción de red profesional</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] hover:from-[#0EA5FF]/90 hover:to-[#7C3AED]/90 text-white font-semibold py-3 group-hover:scale-105 transition-transform"
                    onClick={() => setLocation('/register-student')}
                  >
                    Registrarme como Estudiante
                    <FaArrowRight className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Registration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-[#0B1226]/80 to-[#0B1226]/60 backdrop-blur-sm border-[#7C3AED]/30 hover:border-[#7C3AED]/50 transition-all duration-300 h-full cursor-pointer group"
                onClick={() => setLocation('/register-company')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-[#7C3AED]/20 to-[#0EA5FF]/20 rounded-full w-20 h-20 flex items-center justify-center group-hover:from-[#7C3AED]/30 group-hover:to-[#0EA5FF]/30 transition-colors">
                    <FaBuilding className="text-[#7C3AED] text-3xl" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Soy Empresa
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    Busco talento estudiantil para mi organización
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                      <span>Acceso a talento estudiantil calificado</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                      <span>Publicación de oportunidades de prácticas</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                      <span>Herramientas de selección eficientes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                      <span>Contribución al desarrollo educativo</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#0EA5FF] hover:from-[#7C3AED]/90 hover:to-[#0EA5FF]/90 text-white font-semibold py-3 group-hover:scale-105 transition-transform"
                    onClick={() => setLocation('/register-company')}
                  >
                    Registrarme como Empresa
                    <FaArrowRight className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Capybara Mascot Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="flex justify-center items-center gap-4 mb-4">
              <img
                src="/images/capybara.png"
                alt="Chamby - Nuestro Capybara Mascota"
                className="w-16 h-16 object-contain"
              />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">¡Conoce a Chamby!</h3>
                <p className="text-gray-300 text-sm">
                  Nuestro capybara mascota te acompañará en tu experiencia ProjectCore
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Los capibaras son conocidos por su naturaleza colaborativa y tranquila, 
              perfectos para representar nuestra misión de conectar estudiantes y empresas 
              de manera armoniosa y efectiva.
            </p>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setLocation('/login')}
                className="text-[#FF258D] hover:underline font-semibold"
              >
                Inicia sesión aquí
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
