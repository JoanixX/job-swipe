import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Building2, GraduationCap, Loader2 } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { API_BASE_URL } from '@/services/backend-api'
import { AuthCard, FieldError, ErrorBanner } from '@/components/auth/AuthLayout'
import PasswordInput from '@/components/auth/PasswordInput'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const errors: typeof fieldErrors = {}
    if (!formData.email) errors.email = 'Ingresa tu correo electrónico'
    else if (!EMAIL_REGEX.test(formData.email)) errors.email = 'El formato del correo no es válido'
    if (!formData.password) errors.password = 'Ingresa tu contraseña'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
        throw new Error('invalid_credentials')
      }

      const loginResult = await response.json()

      // Obtener datos del usuario
      const userResponse = await fetch(`${API_BASE_URL}/user/${formData.email}`)
      if (!userResponse.ok) {
        throw new Error('user_fetch_failed')
      }
      const userData = await userResponse.json()

      // Obtener datos específicos si es estudiante
      let studentData: any = null
      if (userData.role === 'student' && userData.related_id) {
        try {
          const studentResponse = await fetch(`${API_BASE_URL}/student/${userData.related_id}`)
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

    } catch (error: any) {
      if (error?.message === 'user_fetch_failed') {
        setApiError('No pudimos obtener tus datos. Inténtalo de nuevo en unos minutos.')
      } else {
        setApiError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderSelection = () => (
    <motion.div
      key="selection"
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
          className="bg-white hover:bg-gray-50 text-[#1E3A8A] p-6 rounded-2xl shadow-lg transition-all flex items-center gap-4 group hover:-translate-y-0.5"
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
          className="bg-white hover:bg-gray-50 text-[#1E3A8A] p-6 rounded-2xl shadow-lg transition-all flex items-center gap-4 group hover:-translate-y-0.5"
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

  const renderLoginForm = (type: 'student' | 'company') => {
    const isCompany = type === 'company'
    return (
      <motion.div
        key={type}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isCompany ? 'Portal Empresarial' : 'Bienvenido'}
          </h1>
          <p className="text-white/80">
            {isCompany ? 'Accede a tu panel de reclutamiento' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <AuthCard>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <ErrorBanner message={apiError} />

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
                {isCompany ? 'Correo Corporativo' : 'Correo Electrónico'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={isCompany ? 'reclutamiento@empresa.com' : 'estudiante@universidad.edu'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
                className={`bg-transparent text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB] ${fieldErrors.email ? 'border-red-300' : 'border-gray-200'}`}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Contraseña</Label>
              <PasswordInput
                id="password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                hasError={!!fieldErrors.password}
              />
              <FieldError message={fieldErrors.password} />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLocation(`/recover-password?type=${type}`)}
                className="text-sm text-[#6366F1] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base mt-2 transition-colors disabled:opacity-70"
            >
              {isLoading
                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Iniciando...</span>
                : 'Iniciar Sesión'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setLocation(isCompany ? '/register-company' : '/simple-register-student')}
                className="text-[#6366F1] hover:underline text-sm font-medium"
              >
                {isCompany ? '¿Tu empresa no está registrada? Crear cuenta' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </form>
        </AuthCard>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen auth-gradient text-white flex flex-col relative font-sans">
      <div className="p-6 relative z-20">
        <button
          onClick={() => {
            if (loginType !== 'selection') {
              setLoginType('selection')
              setFormData({ email: '', password: '' })
              setFieldErrors({})
              setApiError('')
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
          {loginType === 'student' && renderLoginForm('student')}
          {loginType === 'company' && renderLoginForm('company')}
        </AnimatePresence>
      </div>
    </div>
  )
}
