'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { FaGoogle, FaGraduationCap, FaBuilding, FaArrowRight, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa'
import Logo from '@/components/Logo'
import { initializeGoogleAuth, signInWithGoogle, GoogleUser } from '@/lib/google-auth'

interface RegistrationStep {
  id: string
  title: string
  description: string
}

const steps: RegistrationStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenido a ProjectCore',
    description: 'La plataforma que conecta talento con oportunidades reales'
  },
  {
    id: 'profile',
    title: 'Elige tu perfil',
    description: 'Selecciona cómo quieres usar nuestra plataforma'
  },
  {
    id: 'auth',
    title: 'Crea tu cuenta',
    description: 'Regístrate de forma rápida y segura'
  }
]

export default function InnovativeRegister() {
  const [, setLocation] = useLocation()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProfile, setSelectedProfile] = useState<'student' | 'company' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)

  // Initialize Google Auth and auto-advance from welcome screen
  useEffect(() => {
    initializeGoogleAuth().catch(console.error)
    
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      const user = await signInWithGoogle()
      setGoogleUser(user)
      
      // Pre-fill form with Google data
      setFormData(prev => ({
        ...prev,
        email: user.email
      }))
      
      // Store Google user data in localStorage for dashboard use
      localStorage.setItem('googleUser', JSON.stringify(user))
      
      // Redirect to appropriate registration page with Google data
      const params = new URLSearchParams({
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleAuth: 'true'
      })
      
      if (selectedProfile === 'student') {
        setLocation(`/register-student?${params.toString()}`)
      } else if (selectedProfile === 'company') {
        setLocation(`/register-company?${params.toString()}`)
      }
    } catch (error) {
      console.error('Google auth error:', error)
      alert('Error al autenticar con Google. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailRegistration = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      alert('Por favor completa todos los campos')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    
    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    // Redirect to appropriate registration page with pre-filled data
    const params = new URLSearchParams({
      email: formData.email,
      password: formData.password
    })
    
    if (selectedProfile === 'student') {
      setLocation(`/simple-register-student?${params.toString()}`)
    } else if (selectedProfile === 'company') {
      setLocation(`/register-company?${params.toString()}`)
    }
  }

  const renderWelcomeStep = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="text-center space-y-8"
    >
      <div className="relative">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#0EA5FF]/20 to-[#0EA5FF]/10 rounded-full blur-3xl"
        />
        <div className="relative">
          <div className="flex flex-col items-center">
            <img
              src="/images/logoCircular.png"
              alt="ProjectCore Logo"
              width={80}
              height={80}
              className="animate-pulse rounded-full mb-4"
              style={{ animationDuration: '3s' }}
            />
            <div className="flex items-center">
              <span className="font-extrabold text-4xl text-white">CHAMBEA</span>
              <span className="font-extrabold ml-1 text-4xl text-white">YA</span>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Bienvenido a{' '}
          <span className="bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF] bg-clip-text text-transparent">
            ProjectCore
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          La primera plataforma en LATAM que democratiza la experiencia laboral 
          con proyectos reales e inteligencia artificial.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-3 h-3 bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF] rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )

  const renderProfileStep = () => (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          ¿Cómo quieres usar ProjectCore?
        </h2>
        <p className="text-gray-300">
          Elige tu perfil para personalizar tu experiencia
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedProfile === 'student' 
                ? 'bg-gradient-to-br from-[#0EA5FF]/20 to-[#00D4FF]/20 border-[#0EA5FF] shadow-lg shadow-[#0EA5FF]/25' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-[#0EA5FF]/50'
            }`}
            onClick={() => setLocation('/simple-register-student')}
          >
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <motion.div
                  animate={selectedProfile === 'student' ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                    selectedProfile === 'student' 
                      ? 'bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF]' 
                      : 'bg-gray-700'
                  }`}
                >
                  <FaGraduationCap className="text-3xl text-white" />
                </motion.div>
                {selectedProfile === 'student' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <FaCheck className="text-white text-sm" />
                  </motion.div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                Soy Estudiante
              </h3>
              <p className="text-gray-300 mb-4">
                Busco oportunidades de prácticas y experiencia laboral real
              </p>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5FF] rounded-full" />
                  <span>Proyectos reales con empresas</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5FF] rounded-full" />
                  <span>Matching inteligente con IA</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5FF] rounded-full" />
                  <span>Certificaciones verificables</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              selectedProfile === 'company' 
                ? 'bg-gradient-to-br from-[#0EA5FF]/20 to-[#00D4FF]/20 border-[#0EA5FF] shadow-lg shadow-[#0EA5FF]/25' 
                : 'bg-gray-900/50 border-gray-700/50 hover:border-[#0EA5FF]/50'
            }`}
            onClick={() => setLocation('/register-company')}
          >
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <motion.div
                  animate={selectedProfile === 'company' ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                    selectedProfile === 'company' 
                      ? 'bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF]' 
                      : 'bg-gray-700'
                  }`}
                >
                  <FaBuilding className="text-3xl text-white" />
                </motion.div>
                {selectedProfile === 'company' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <FaCheck className="text-white text-sm" />
                  </motion.div>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                Soy Empresa
              </h3>
              <p className="text-gray-300 mb-4">
                Busco talento estudiantil para proyectos y colaboraciones
              </p>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5FF] rounded-full" />
                  <span>Acceso a talento calificado</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5FF] rounded-full" />
                  <span>Herramientas de selección IA</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5FF] rounded-full" />
                  <span>Gestión simplificada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={() => setLocation('/login')}
          variant="outline"
          className="bg-transparent border-[#0EA5FF] text-[#0EA5FF] hover:bg-[#0EA5FF] hover:text-white font-semibold px-8 py-3 text-lg"
        >
          Iniciar Sesión
        </Button>
      </div>
    </motion.div>
  )

  const renderAuthStep = () => (
    <motion.div
      key="auth"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8 max-w-md mx-auto"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Crea tu cuenta
        </h2>
        <p className="text-gray-300">
          {selectedProfile === 'student' ? 'Como estudiante' : 'Como empresa'}, 
          tendrás acceso a todas nuestras funcionalidades
        </p>
      </div>

      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-8 space-y-6">
          {/* Google Authentication */}
          <div>
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 text-lg border-0"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full mr-3"
                />
              ) : (
                <FaGoogle className="mr-3 text-red-500" />
              )}
              {isLoading ? 'Conectando...' : 'Continuar con Google'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">o continúa con email</span>
            </div>
          </div>

          {/* Email Registration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white text-sm font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF] focus:ring-[#0EA5FF]"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF] focus:ring-[#0EA5FF] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirma tu contraseña"
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF] focus:ring-[#0EA5FF]"
              />
            </div>

            <Button
              onClick={handleEmailRegistration}
              className="w-full bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF] hover:from-[#0EA5FF]/90 hover:to-[#00D4FF]/90 text-white font-semibold py-3 text-lg"
            >
              Crear cuenta
              <FaArrowRight className="ml-2" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setLocation('/login')}
                className="text-[#0EA5FF] hover:underline font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0C2C] via-[#0F1724] to-[#0E0C2C] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#0EA5FF]/20 to-[#00D4FF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#0EA5FF]/20 to-[#00D4FF]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      {currentStep > 0 && (
        <div className="relative z-10 p-4 sm:p-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setLocation('/')}
          >
            ← {currentStep > 1 ? 'Atrás' : 'Volver al Inicio'}
          </Button>
        </div>
      )}

      {/* Progress Indicator */}
      {currentStep > 0 && (
        <div className="relative z-10 px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-8">
              {steps.slice(1).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep > index + 1 
                      ? 'bg-green-500 text-white' 
                      : currentStep === index + 1 
                      ? 'bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF] text-white' 
                      : 'bg-gray-600 text-gray-400'
                  }`}>
                    {currentStep > index + 1 ? <FaCheck /> : index + 1}
                  </div>
                  {index < steps.slice(1).length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && renderWelcomeStep()}
            {currentStep === 1 && renderProfileStep()}
            {currentStep === 2 && renderAuthStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
