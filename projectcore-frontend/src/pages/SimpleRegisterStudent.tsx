import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { API_BASE_URL } from '@/services/backend-api'

import { useUser } from '@/lib/user-context'
import { authAPI } from '@/services/backend-api'

export default function SimpleRegisterStudent() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (!formData.termsAccepted) {
      alert('Debes aceptar los términos y condiciones')
      return
    }

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
      localStorage.setItem('jobswipe_user', JSON.stringify(userContextData))
      if (userDetails.role === 'student') {
        localStorage.setItem('studentId', userDetails.related_id?.toString())
      }

      setLocation('/student-cv-upload')
    } catch (error: any) {
      console.error('Error durante el registro:', error)
      alert(`Ocurrió un error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D4A9F] to-[#4F6CDB] text-white flex flex-col relative font-sans">
      
      <div className="p-6 relative z-20">
        <button 
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p className="text-white/80">Completa tus datos para registrarte</p>
          </div>

          <div className="bg-white w-full rounded-3xl p-8 shadow-2xl text-gray-900">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-800">Nombre Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                  required
                />
              </div>

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
                  placeholder="Crea una contraseña segura"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="university" className="text-sm font-semibold text-gray-800">Universidad</Label>
                <Input
                  id="university"
                  type="text"
                  placeholder="Ej. Universidad de Lima"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-800">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej. +51 999 999 999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-800">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/tu-perfil"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="portfolio" className="text-sm font-semibold text-gray-800">Portafolio</Label>
                <Input
                  id="portfolio"
                  type="url"
                  placeholder="https://tuportafolio.com"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2 pb-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="w-4 h-4 text-[#4F6CDB] bg-gray-100 border-gray-300 rounded focus:ring-[#4F6CDB]"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Acepto los <Link href="/terminos-servicio" className="text-[#4F6CDB] hover:underline">Términos y Condiciones</Link> y la <Link href="/politica-privacidad" className="text-[#4F6CDB] hover:underline">Política de Privacidad</Link>
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-6 rounded-xl font-medium text-base transition-colors"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setLocation('/login?type=student')}
                  className="text-[#4F6CDB] hover:underline text-sm font-medium"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
