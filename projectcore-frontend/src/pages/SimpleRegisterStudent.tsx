'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FaIdCard, FaEye, FaEyeSlash, FaRegSmile } from 'react-icons/fa'
import { useUser } from '@/lib/user-context'
import Logo from '@/components/Logo'

const careers = [
  "Ingeniería de Sistemas", "Administración", "Contabilidad", "Marketing", "Psicología",
  "Derecho", "Medicina", "Enfermería", "Arquitectura", "Diseño Gráfico",
  "Comunicaciones", "Economía", "Ingeniería Civil", "Ingeniería Industrial",
  "Educación", "Turismo", "Gastronomía", "Otra"
]

export default function SimpleRegisterStudent() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    career: '',
    academic_cycle: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: 'Lima, Perú',
    date_of_birth: '',
    main_motivation: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Auto-fill form with Google data if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const googleAuth = urlParams.get('googleAuth')
    const email = urlParams.get('email')
    const name = urlParams.get('name')

    if (googleAuth === 'true' && email && name) {
      setFormData(prev => ({
        ...prev,
        email: email,
        name: name
      }))
    }
  }, [])

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      if (!formData.name || !formData.dni || !formData.email || !formData.password || !formData.confirmPassword || !formData.career || !formData.academic_cycle) {
        alert('Por favor completa todos los campos obligatorios')
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden')
        setIsLoading(false)
        return
      }

      if (formData.dni.length !== 8) {
        alert('El DNI debe tener exactamente 8 dígitos')
        setIsLoading(false)
        return
      }

      if (!acceptedPrivacy) {
        alert('Debes aceptar la Política de Privacidad para continuar')
        setIsLoading(false)
        return
      }

      if (!acceptedTerms) {
        alert('Debes aceptar los Términos & Condiciones para continuar')
        setIsLoading(false)
        return
      }

      // Register with Azure backend
      console.log('Registrando usuario en Azure backend...')
      
      try {
        const registrationData = {
          email: formData.email,
          password: formData.password,
          dni: formData.dni,
          name: formData.name,
          location: formData.location,
          role: 'student',
          related_id: 1, // Will be updated by backend
          date_of_birth: formData.date_of_birth || '2000-01-01',
          main_motivation: formData.main_motivation || 'Desarrollo profesional',
          description: formData.description || 'Estudiante motivado en busca de oportunidades laborales'
        }

        const response = await fetch(`https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api/register/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Registration error:', errorText)
          throw new Error('Error en el registro')
        }

        const registrationResult = await response.json()
        console.log('Registro exitoso en Azure:', registrationResult)

        // Create user data for context
        const contextUserData = {
          id: registrationResult.id?.toString(),
          name: formData.name,
          email: formData.email,
          userType: 'student' as const,
          isGoogleAuth: false,
          picture: '',
          profileData: {
            dni: formData.dni,
            career: formData.career, // Use actual selected career
            academic_cycle: parseInt(formData.academic_cycle) || 1,
            student_id: registrationResult.related_id,
            user_id: registrationResult.id,
            related_id: registrationResult.related_id, // Add for dashboard compatibility
            weekly_availability: 40,
            preferred_modality: 1,
            main_motivation: formData.main_motivation || 'Desarrollo profesional',
            description: formData.description || 'Estudiante motivado en busca de oportunidades laborales',
            location: formData.location
          }
        }

        setUser(contextUserData)

        // Save to localStorage for session persistence
        localStorage.setItem('authToken', 'registered_' + Date.now())
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userRole', 'student')
        localStorage.setItem('userId', registrationResult.id?.toString())
        localStorage.setItem('studentId', registrationResult.related_id?.toString())

        alert('¡Registro exitoso! Serás redirigido al dashboard de estudiante.')
        setLocation('/student-dashboard')

      } catch (error) {
        console.error('Error durante el registro:', error)
        alert('Error en el registro. Por favor intenta nuevamente.')
      } finally {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error en el registro:', error)
      alert('Error al registrar. Por favor intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0C2C] via-[#0F1724] to-[#0E0C2C] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-[#0EA5FF]/20 to-[#00D4FF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-[#0EA5FF]/10 to-[#00D4FF]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#0EA5FF]/5 to-[#00D4FF]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => setLocation('/register')}
        >
          ← Volver
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">
                Registro de Estudiante
              </CardTitle>
              <CardDescription className="text-gray-300">
                Completa tu información básica
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8">
              {registrationSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                  <FaRegSmile className="text-[#0EA5FF] w-16 h-16 mb-4" />
                  <h2 className="text-2xl font-bold text-white text-center">¡Registro completado!</h2>
                  <p className="text-center text-gray-300 max-w-xs">
                    Tu cuenta ha sido creada exitosamente. Regresando a la página principal...
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaIdCard className="text-[#0EA5FF] w-6 h-6" />
                    <h2 className="text-lg font-bold text-white">Información Personal</h2>
                  </div>
                  
                  {/* Datos Personales */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Nombre completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        placeholder="Tu nombre completo"
                        className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF] focus:ring-[#0EA5FF]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dni" className="text-white">DNI *</Label>
                      <Input
                        id="dni"
                        value={formData.dni}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                          updateFormData('dni', value)
                        }}
                        placeholder="12345678"
                        maxLength={8}
                        className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF] focus:ring-[#0EA5FF]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="tu@email.com"
                        className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF] focus:ring-[#0EA5FF]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="career" className="text-white">Carrera *</Label>
                      <Select value={formData.career} onValueChange={(value) => updateFormData('career', value)}>
                        <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white focus:border-[#0EA5FF] focus:ring-[#0EA5FF]">
                          <SelectValue placeholder="Selecciona tu carrera" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60 overflow-y-auto z-50">
                          {careers.map((career) => (
                            <SelectItem 
                              key={career} 
                              value={career}
                              className="hover:bg-gray-700 focus:bg-gray-700 text-white cursor-pointer data-[highlighted]:text-white data-[highlighted]:bg-gray-700"
                            >
                              {career}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="academic_cycle" className="text-white">Ciclo académico *</Label>
                      <Select value={formData.academic_cycle} onValueChange={(value) => updateFormData('academic_cycle', value)}>
                        <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white focus:border-[#0EA5FF] focus:ring-[#0EA5FF]">
                          <SelectValue placeholder="Selecciona tu ciclo" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white max-h-60 overflow-y-auto z-50">
                          {[...Array(12)].map((_, i) => (
                            <SelectItem 
                              key={i + 1} 
                              value={(i + 1).toString()}
                              className="hover:bg-gray-700 focus:bg-gray-700 text-white cursor-pointer data-[highlighted]:text-white data-[highlighted]:bg-gray-700"
                            >
                              {i + 1}° ciclo
                            </SelectItem>
                          ))}
                          <SelectItem 
                            value="0"
                            className="hover:bg-gray-700 focus:bg-gray-700 text-white cursor-pointer data-[highlighted]:text-white data-[highlighted]:bg-gray-700"
                          >
                            Ya terminé
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-white">Contraseña *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#FF258D] focus:ring-[#FF258D] pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-white">Confirmar contraseña *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                          placeholder="Confirma tu contraseña"
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#FF258D] focus:ring-[#FF258D] pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-start space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="privacy-checkbox"
                        checked={acceptedPrivacy}
                        onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#0EA5FF] focus:ring-[#0EA5FF] border-gray-600 rounded bg-gray-800"
                      />
                      <label htmlFor="privacy-checkbox" className="text-sm text-gray-300 leading-5">
                        Acepto la{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-[#0EA5FF] hover:text-[#0066CC] underline font-medium"
                        >
                          Política de Privacidad
                        </button>
                        {' '}de PROJECT CORE!
                      </label>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="flex items-start space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="terms-checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#0EA5FF] focus:ring-[#0EA5FF] border-gray-600 rounded bg-gray-800"
                      />
                      <label htmlFor="terms-checkbox" className="text-sm text-gray-300 leading-5">
                        Acepto los{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-[#0EA5FF] hover:text-[#0066CC] underline font-medium"
                        >
                          Términos & Condiciones
                        </button>
                        {' '}de PROJECT CORE!
                      </label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#0EA5FF] to-[#0066CC] hover:from-[#0066CC] hover:to-[#004499] text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Crear cuenta
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Términos & Condiciones</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
                <p>
                  Bienvenido(a) a PROJECT CORE, una plataforma digital desarrollada por PROJECT CORE CORP., sociedad constituida conforme a las leyes del Estado de Delaware, Estados Unidos.
                </p>
                <p>
                  Al acceder o utilizar nuestros servicios, usted declara haber leído, comprendido y aceptado expresamente los presentes Términos & Condiciones.
                </p>
                
                <h3 className="text-lg font-semibold text-white mt-6">Naturaleza del servicio</h3>
                <p>
                  El servicio que ofrece PROJECT CORE CORP. es la intermediación publicitaria de ofertas laborales, conectando organizaciones con jóvenes que buscan oportunidades laborales en el mercado peruano.
                </p>
                
                <h3 className="text-lg font-semibold text-white mt-6">Responsabilidad</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>PROJECT CORE CORP. actúa exclusivamente como intermediario tecnológico.</li>
                  <li>No interviene en procesos de selección ni contratación.</li>
                  <li>No garantiza la obtención de empleo.</li>
                  <li>No forma parte de contratos laborales entre empresas y postulantes.</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-white mt-6">Registro y cuenta</h3>
                <p>El usuario es responsable de:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Proporcionar información precisa y actualizada</li>
                  <li>Ser mayor de edad (18 años en Perú)</li>
                  <li>Mantener la confidencialidad de su cuenta</li>
                  <li>Utilizar el servicio para actividades legales</li>
                </ul>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setAcceptedTerms(true)
                    setShowTermsModal(false)
                  }}
                  className="bg-gradient-to-r from-[#0EA5FF] to-[#0066CC] hover:from-[#0066CC] hover:to-[#004499] text-white px-6 py-2 rounded-lg mr-3"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Política de Privacidad</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
                <p>
                  Al registrarse y utilizar PROJECT CORE!, usted declara haber leído y aceptado la presente Política de Privacidad, de acuerdo con la Ley N.° 29733 – Ley de Protección de Datos Personales.
                </p>
                
                <h3 className="text-lg font-semibold text-white mt-6">Compromiso</h3>
                <p>
                  Nos comprometemos a utilizar sus datos única y exclusivamente para el servicio de intermediación publicitaria de ofertas de empleo.
                </p>
                
                <h3 className="text-lg font-semibold text-white mt-6">Datos recopilados para estudiantes:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombres y apellidos</li>
                  <li>Correo electrónico</li>
                  <li>DNI y datos de identificación</li>
                  <li>Universidad/Instituto de educación</li>
                  <li>Nivel de estudios y semestre</li>
                  <li>Intereses profesionales</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-white mt-6">Sus derechos</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Acceso:</strong> Solicitar información sobre sus datos</li>
                  <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
                  <li><strong>Cancelación:</strong> Eliminar sus datos</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento</li>
                </ul>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setAcceptedPrivacy(true)
                    setShowPrivacyModal(false)
                  }}
                  className="bg-gradient-to-r from-[#0EA5FF] to-[#0066CC] hover:from-[#0066CC] hover:to-[#004499] text-white px-6 py-2 rounded-lg mr-3"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
