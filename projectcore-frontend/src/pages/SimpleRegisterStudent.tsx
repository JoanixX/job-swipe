import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { API_BASE_URL, authAPI } from '@/services/backend-api'
import { useUser } from '@/lib/user-context'
import AuthLayout, { AuthCard, FieldError, ErrorBanner } from '@/components/auth/AuthLayout'
import PasswordInput from '@/components/auth/PasswordInput'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Indicador simple de fuerza de contraseña */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const levels = [
    { label: 'Muy débil', color: 'bg-red-400', width: 'w-1/4' },
    { label: 'Débil', color: 'bg-orange-400', width: 'w-2/4' },
    { label: 'Buena', color: 'bg-yellow-400', width: 'w-3/4' },
    { label: 'Fuerte', color: 'bg-green-500', width: 'w-full' }
  ]
  const level = levels[Math.max(0, score - 1)]
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${level.color} ${level.width}`} />
      </div>
      <p className="text-xs text-gray-400 mt-1">Seguridad: {level.label}</p>
    </div>
  )
}

interface FieldErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  university?: string
  phone?: string
  terms?: string
}

export default function SimpleRegisterStudent() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    termsAccepted: false
  })

  const validate = () => {
    const errors: FieldErrors = {}
    if (!formData.fullName.trim()) errors.fullName = 'Ingresa tu nombre completo'
    if (!formData.email) errors.email = 'Ingresa tu correo electrónico'
    else if (!EMAIL_REGEX.test(formData.email)) errors.email = 'El formato del correo no es válido'
    if (!formData.password) errors.password = 'Crea una contraseña'
    else if (formData.password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirma tu contraseña'
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    if (!formData.university.trim()) errors.university = 'Ingresa tu universidad'
    if (!formData.phone.trim()) errors.phone = 'Ingresa tu teléfono'
    if (!formData.termsAccepted) errors.terms = 'Debes aceptar los Términos y Condiciones para continuar'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setIsLoading(true)

    try {
      // 1. Registrar el perfil del estudiante base
      const studentRes = await fetch(`${API_BASE_URL}/register/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: 'General',
          academic_cycle: 1,
          weekly_availability: 20,
          preferred_modality: 1,
          university: formData.university || 'No especificada',
          portfolio: formData.portfolio || ''
        })
      })

      if (!studentRes.ok) {
        const errorText = await studentRes.text();
        throw new Error(`Error al crear perfil de estudiante: ${errorText}`)
      }
      const studentData = await studentRes.json()

      // 2. Registrar el usuario general
      const userRes = await fetch(`${API_BASE_URL}/register/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'student',
          name: formData.fullName,
          dni: '00000000', // Valor por defecto
          location: 'Lima, Perú', // Valor por defecto
          related_id: studentData.student_id,
          date_of_birth: '2000-01-01',
          main_motivation: 'Encontrar prácticas',
          description: 'Estudiante universitario',
          phone: formData.phone || '',
          linkedin: formData.linkedin || ''
        })
      })

      if (!userRes.ok) {
        const errorText = await userRes.text();
        if (errorText.toLowerCase().includes('exist') || userRes.status === 409 || userRes.status === 400) {
          throw new Error('Este correo ya está registrado. Intenta iniciar sesión.')
        }
        throw new Error(`Error al registrar usuario: ${errorText}`)
      }

      // 3. Auto-login para tener la sesión activa en el CV upload
      const loginData = await authAPI.login({ email: formData.email, password: formData.password })
      const userDetails = await authAPI.getUserByEmail(formData.email)

      const userContextData = {
        id: userDetails.id,
        name: userDetails.name || '',
        email: userDetails.email || '',
        userType: userDetails.role,
        isGoogleAuth: false,
        phone: userDetails.phone || formData.phone || '',
        linkedin: userDetails.linkedin || formData.linkedin || '',
        portfolio: userDetails.portfolio || formData.portfolio || '',
        profileData: userDetails.role === 'student' ? {
          student_id: userDetails.related_id,
          related_id: userDetails.related_id,
          user_id: userDetails.id,
          university: formData.university || 'No especificada',
          academic_cycle: 1,
          weekly_availability: 20,
          preferred_modality: 1,
          career: 'General'
        } : {}
      }
      setUser(userContextData)
      localStorage.setItem('authToken', loginData?.access_token || 'demo_token')
      localStorage.setItem('userRole', userDetails.role)
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userId', userDetails.id?.toString())
      if (userDetails.role === 'student') {
        localStorage.setItem('studentId', userDetails.related_id?.toString())
      }

      setLocation('/student-cv-upload')
    } catch (error: any) {
      setApiError(error.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError?: string) =>
    `bg-transparent text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB] ${hasError ? 'border-red-300' : 'border-gray-200'}`

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Completa tus datos para registrarte"
      onBack={() => setLocation('/')}
    >
      <AuthCard className="text-gray-900">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <ErrorBanner message={apiError} />

          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-semibold text-gray-800">Nombre Completo *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={inputClass(fieldErrors.fullName)}
            />
            <FieldError message={fieldErrors.fullName} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="estudiante@universidad.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
              className={inputClass(fieldErrors.email)}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Contraseña *</Label>
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              placeholder="Crea una contraseña segura"
              hasError={!!fieldErrors.password}
              autoComplete="new-password"
            />
            <FieldError message={fieldErrors.password} />
            <PasswordStrength password={formData.password} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">Confirmar Contraseña *</Label>
            <PasswordInput
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              placeholder="Repite tu contraseña"
              hasError={!!fieldErrors.confirmPassword}
              autoComplete="new-password"
            />
            <FieldError message={fieldErrors.confirmPassword} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="university" className="text-sm font-semibold text-gray-800">Universidad *</Label>
            <Input
              id="university"
              type="text"
              placeholder="Ej. Universidad de Lima"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className={inputClass(fieldErrors.university)}
            />
            <FieldError message={fieldErrors.university} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-800">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ej. +51 999 999 999"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClass(fieldErrors.phone)}
            />
            <FieldError message={fieldErrors.phone} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-800">LinkedIn <span className="font-normal text-gray-400">(opcional)</span></Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/tu-perfil"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className={inputClass()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="portfolio" className="text-sm font-semibold text-gray-800">Portafolio <span className="font-normal text-gray-400">(opcional)</span></Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://tuportafolio.com"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className={inputClass()}
            />
          </div>

          <div className="pt-2 pb-2">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-[#6366F1] bg-gray-100 border-gray-300 rounded focus:ring-[#4F6CDB]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los <Link href="/terminos-servicio" className="text-[#6366F1] hover:underline">Términos y Condiciones</Link> y la <Link href="/politica-privacidad" className="text-[#6366F1] hover:underline">Política de Privacidad</Link>
              </label>
            </div>
            <FieldError message={fieldErrors.terms} />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base transition-colors disabled:opacity-70"
          >
            {isLoading
              ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</span>
              : 'Crear Cuenta'}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setLocation('/login?type=student')}
              className="text-[#6366F1] hover:underline text-sm font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
