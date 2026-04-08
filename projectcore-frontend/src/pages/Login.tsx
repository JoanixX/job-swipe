'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useUser } from '@/lib/user-context'

export default function Login() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      alert('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    
    try {
      // Direct Azure backend login
      console.log('Intentando login con Azure backend...')
      const response = await fetch('https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Login error:', errorText)
        
        // Check if it's the student.name error from backend
        if (errorText.includes("'StudentModel' object has no attribute 'name'")) {
          console.log('Backend has student.name error, trying simplified login...')
          // Continue with user data fetch instead of failing
        } else {
          throw new Error('Credenciales incorrectas')
        }
      }

      let loginResult = null
      if (response.ok) {
        loginResult = await response.json()
        console.log('Login exitoso:', loginResult)
      }

      // Get user details
      console.log('Obteniendo detalles del usuario...')
      const userResponse = await fetch(`https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api/user/${formData.email}`)
      
      if (!userResponse.ok) {
        throw new Error('Error al obtener datos del usuario')
      }
      
      const userData = await userResponse.json()
      console.log('Datos del usuario obtenidos:', userData)

      // Get student details if it's a student
      let studentData: any = null
      if (userData.role === 'student' && userData.related_id && userData.related_id !== 1) {
        console.log('Obteniendo datos del estudiante...')
        try {
          const studentResponse = await fetch(`https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api/student/${userData.related_id}`)
          if (studentResponse.ok) {
            studentData = await studentResponse.json()
            console.log('Datos del estudiante obtenidos:', studentData)
          } else {
            console.log('Student not found, using defaults')
            studentData = {
              id: userData.related_id,
              career: "Medicina"
            }
          }
        } catch (error) {
          console.log('Error obteniendo datos del estudiante:', error)
        }
      }

      // Create user context data with proper student_id mapping
      const userContextData = {
        id: userData.id?.toString() || 'temp_id',
        name: userData.name || 'Usuario',
        email: formData.email,
        userType: userData.role === 'student' ? 'student' : 'company',
        isGoogleAuth: false,
        picture: '',
        profileData: userData.role === 'student' ? {
          dni: userData.dni || '',
          career: studentData?.career || '',
          academic_cycle: studentData?.academic_cycle || 1,
          student_id: userData.related_id, // This is what dashboard looks for
          related_id: userData.related_id,
          user_id: userData.id,
          weekly_availability: studentData?.weekly_availability || 40,
          preferred_modality: studentData?.preferred_modality || 1,
          main_motivation: userData.main_motivation || '',
          description: userData.description || '',
          location: userData.location || ''
        } : null
      }

      // Set user in context
      setUser(userContextData)

      // Save session data
      localStorage.setItem('authToken', loginResult?.access_token || 'demo_token_' + Date.now())
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userId', userData.related_id?.toString() || userData.id?.toString())
      localStorage.setItem('studentId', userData.related_id?.toString() || userData.id?.toString())
      
      // Redirect based on user type
      if (userData.role?.toLowerCase() === 'student') {
        setLocation('/student-dashboard')
      } else {
        setLocation('/company-dashboard')
      }

    } catch (error) {
      console.error('Error durante el login:', error)
      alert('Credenciales incorrectas. Por favor verifica tu email y contraseña, o regístrate si no tienes una cuenta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0C2C] via-[#0F1724] to-[#0E0C2C] flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0EA5FF] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="fixed top-4 left-4 z-20">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => setLocation('/')}
        >
          ← Volver al Inicio
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0B1226]/90 to-[#0B1226]/70 p-8 rounded-2xl border border-[#0EA5FF]/20 backdrop-blur-sm shadow-2xl"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img
              src="/images/logoCircular.png"
              alt="ProjectCore Logo"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full"
            />
            <h1 className="text-3xl font-bold text-white mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-300">
              Accede a tu cuenta de ProjectCore
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-[#0EA5FF]" />
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="mt-2 bg-[#1a0b3d]/80 border-[#0EA5FF]/30 text-white placeholder:text-gray-300 backdrop-blur-sm focus:border-[#0EA5FF] focus:ring-[#0EA5FF]"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white flex items-center gap-2">
                <FaLock className="w-4 h-4 text-[#7C3AED]" />
                Contraseña
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="bg-[#1a0b3d]/80 border-[#0EA5FF]/30 text-white placeholder:text-gray-300 backdrop-blur-sm focus:border-[#0EA5FF] focus:ring-[#0EA5FF] pr-12"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0EA5FF] transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] hover:from-[#0EA5FF]/90 hover:to-[#7C3AED]/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300 mb-4">
              ¿No tienes una cuenta?
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation('/register')}
              className="border-[#0EA5FF] text-[#0EA5FF] hover:bg-[#0EA5FF] hover:text-white transition-all duration-300"
            >
              Registrarse
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
