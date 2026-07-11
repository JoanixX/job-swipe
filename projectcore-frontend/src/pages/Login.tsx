import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Building2, GraduationCap } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { API_BASE_URL } from '@/services/backend-api'

export default function Login() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [loginType, setLoginType] = useState<'selection' | 'student' | 'company'>('selection')
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type')
    if (type === 'student' || type === 'company') {
      setLoginType(type)
    }
  }, [])

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      alert('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    
    try {
      const API_URL = import.meta.env.PROD ? 'http://localhost:8000/api' : '/api'
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      if (!response.ok) {
        throw new Error('Credenciales incorrectas')
      }

      const loginResult = await response.json()
      
      // Obtener datos del usuario
      const userResponse = await fetch(`${API_URL}/user/${formData.email}`)
      if (!userResponse.ok) {
        throw new Error('Error al obtener datos del usuario')
      }
      const userData = await userResponse.json()

      // Validar que el rol coincida con el portal elegido (opcional, pero buena práctica)
      if (loginType === 'student' && userData.role !== 'student') {
        alert('Esta cuenta pertenece a una empresa. Serás redirigido al portal correspondiente.')
      } else if (loginType === 'company' && userData.role === 'student') {
        alert('Esta cuenta pertenece a un estudiante. Serás redirigido al portal correspondiente.')
      }

      // Obtener datos específicos si es estudiante
      let studentData: any = null
      if (userData.role === 'student' && userData.related_id) {
        try {
          const studentResponse = await fetch(`${API_URL}/student/${userData.related_id}`)
          if (studentResponse.ok) {
            studentData = await studentResponse.json()
          }
        } catch (error) {
          console.error('Error al obtener perfil de estudiante', error)
        }
      }

      const userContextData = {
        id: userData.id?.toString() || 'temp_id',
        name: userData.name || 'Usuario',
        email: formData.email,
        userType: userData.role === 'student' ? 'student' : 'company',
        isGoogleAuth: false,
        picture: '',
        phone: userData.phone || '',
        linkedin: userData.linkedin || '',
        portfolio: userData.portfolio || '',
        profileData: userData.role === 'student' ? {
          dni: userData.dni || '',
          career: studentData?.career || '',
          academic_cycle: studentData?.academic_cycle || 1,
          student_id: userData.related_id,
          related_id: userData.related_id,
          user_id: userData.id,
          weekly_availability: studentData?.weekly_availability || 40,
          preferred_modality: studentData?.preferred_modality || 1,
          main_motivation: userData.main_motivation || '',
          description: userData.description || '',
          location: userData.location || ''
        } : {
          company_id: userData.related_id,
          user_id: userData.id,
          related_id: userData.related_id,
        }
      }

      setUser(userContextData as any)

      localStorage.setItem('authToken', loginResult.access_token || 'demo_token')
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userId', userData.id?.toString())
      if (userData.role === 'student') {
        localStorage.setItem('studentId', userData.related_id?.toString())
      } else {
        localStorage.setItem('companyId', userData.related_id?.toString())
      }
      
      // Redirigir según el rol real del usuario
      if (userData.role === 'student') {
        setLocation('/student-profile')
      } else {
        setLocation('/company-dashboard')
      }

    } catch (error) {
      console.error('Error durante el login:', error)
      alert('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
    >
      <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
      <p className="text-white/80 mb-8">Elige cómo deseas ingresar a la plataforma</p>
      
      <div className="grid grid-cols-1 gap-4 w-full">
        <button 
          onClick={() => setLoginType('student')}
          className="bg-white hover:bg-gray-50 text-[#1E3A8A] p-6 rounded-2xl shadow-lg transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 bg-[#2D4A9F]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <GraduationCap className="w-8 h-8 text-[#2D4A9F]" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">Soy Estudiante</h2>
            <p className="text-sm text-gray-500">Accede a tus proyectos y postulaciones</p>
          </div>
        </button>

        <button 
          onClick={() => setLoginType('company')}
          className="bg-white hover:bg-gray-50 text-[#1E3A8A] p-6 rounded-2xl shadow-lg transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 bg-[#2D4A9F]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-8 h-8 text-[#2D4A9F]" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">Soy Empresa</h2>
            <p className="text-sm text-gray-500">Accede a tu panel de reclutamiento</p>
          </div>
        </button>
      </div>
    </motion.div>
  )

  const renderStudentLogin = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
        <p className="text-white/80">Inicia sesión para continuar</p>
      </div>

      <div className="bg-white w-full rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="estudiante@universidad.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
              required
            />
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setLocation('/recover-password?type=student')}
              className="text-sm text-[#4F6CDB] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-6 rounded-xl font-medium text-base transition-colors mt-2"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setLocation('/simple-register-student')}
              className="text-[#4F6CDB] hover:underline text-sm font-medium"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )

  const renderCompanyLogin = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-[#1E3A8A]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Portal Empresarial</h1>
        <p className="text-white/80">Accede a tu panel de reclutamiento</p>
      </div>

      <div className="bg-white w-full rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Correo Corporativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="reclutamiento@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
              required
            />
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setLocation('/recover-password?type=company')}
              className="text-sm text-[#4F6CDB] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-6 rounded-xl font-medium text-base transition-colors mt-2"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setLocation('/register-company')}
              className="text-[#4F6CDB] hover:underline text-sm font-medium"
            >
              ¿Tu empresa no está registrada? Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D4A9F] to-[#4F6CDB] text-white flex flex-col relative font-sans">
      <div className="p-6 relative z-20">
        <button 
          onClick={() => {
            if (loginType !== 'selection') {
              setLoginType('selection')
              setFormData({ email: '', password: '' })
            } else {
              setLocation('/')
            }
          }}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          {loginType === 'selection' && renderSelection()}
          {loginType === 'student' && renderStudentLogin()}
          {loginType === 'company' && renderCompanyLogin()}
        </AnimatePresence>
      </div>
    </div>
  )
}
