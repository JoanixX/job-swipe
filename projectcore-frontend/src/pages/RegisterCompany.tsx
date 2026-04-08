'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaBuilding, FaIdCard, FaMapMarkerAlt, FaIndustry, FaUserTie, FaEnvelope, FaKey, FaArrowLeft, FaRegSmile, FaRegFileAlt } from 'react-icons/fa'

interface CompanyData {
  ruc: string
  name: string
  location: string
  industry: string
  area_id: number
  contact_name: string
  contact_dni: string
  email: string
  password: string
  confirmPassword: string
  company_culture: string
}

const industries = [
  'Tecnología',
  'Manufactura',
  'Servicios',
  'Comercio',
  'Salud',
  'Educación',
  'Finanzas',
  'Turismo',
  'Construcción',
  'Otros'
]

const peruvianCities = [
  "Lima",
  "Arequipa",
  "Trujillo",
  "Chiclayo",
  "Piura",
  "Iquitos",
  "Cusco",
  "Chimbote",
  "Huancayo",
  "Tacna",
  "Ica",
  "Cajamarca",
  "Pucallpa",
  "Sullana",
  "Chincha Alta",
  "Huaraz",
  "Ayacucho",
  "Tarapoto",
  "Huánuco",
  "Puno",
  "Tumbes",
  "Talara",
  "Moquegua",
  "Huacho",
  "Chosica",
  "Barranca",
  "Cañete",
  "Chancay",
  "Huaral",
  "Ilo",
  "Juliaca",
  "Lambayeque",
  "Mollendo",
  "Nasca",
  "Oxapampa",
  "Paita",
  "Pisco",
  "Puerto Maldonado",
  "Salaverry",
  "San Vicente de Cañete",
  "Sechura",
  "Sicuani",
  "Tingo María",
  "Ventanilla",
  "Villa El Salvador",
  "Villa María del Triunfo"
]

export default function RegisterCompany() {
  const [, setLocation] = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [formData, setFormData] = useState<CompanyData>({
    ruc: '',
    name: '',
    location: '',
    industry: '',
    area_id: 1,
    contact_name: '',
    contact_dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_culture: ''
  })

  const updateFormData = (field: keyof CompanyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCityChange = (value: string) => {
    updateFormData('location', value)
    setShowCityDropdown(false)
  }

  const handleCityInput = (value: string) => {
    updateFormData('location', value)
    if (value.length > 0) {
      const filtered = peruvianCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(filtered)
      setShowCityDropdown(true)
    } else {
      setFilteredCities([])
      setShowCityDropdown(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validar que todos los campos requeridos estén completos
      if (!formData.ruc || !formData.name || !formData.location || !formData.contact_name || !formData.contact_dni || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Por favor completa todos los campos obligatorios')
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
      
      // PASO 1: Registrar la empresa
      const companyPayload = {
        ruc: formData.ruc,
        name: formData.name,
        location: formData.location,
        industry: formData.industry,
        area_id: formData.area_id,
        contact_name: formData.contact_name,
        email: formData.email,
        company_culture: formData.company_culture
      }
      
      console.log('Paso 1: Registrando empresa...', companyPayload)
      
      const companyResponse = await fetch('https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api/register/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(companyPayload),
      })
      
      if (!companyResponse.ok) {
        const errorText = await companyResponse.text()
        console.error('Error al registrar empresa:', errorText)
        let errorMessage = 'Error al registrar la empresa'
        try {
          const err = JSON.parse(errorText)
          errorMessage = err.detail || err.message || errorMessage
        } catch (e) {
          console.error('Error parsing error response empresa:', e)
        }
        throw new Error(errorMessage)
      }
      
      const companyData = await companyResponse.json()
      console.log('Empresa registrada exitosamente:', companyData)
      
      // PASO 2: Registrar el usuario para login
      const userPayload = {
        email: formData.email,
        password: formData.password,
        role: "company",
        related_id: companyData.id || companyData.company_id || 0,
        dni: formData.contact_dni // Using contact representative's DNI
      }
      
      console.log('Paso 2: Registrando usuario para login...', { ...userPayload, password: '[HIDDEN]' })
      
      const userResponse = await fetch('https://cy-backend-ch-b8f4h8bqh9epepcr.chilecentral-01.azurewebsites.net/api/register/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(userPayload),
      })
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error('Error al registrar usuario:', errorText)
        console.warn('La empresa fue creada pero no se pudo crear el usuario para login')
        alert('El perfil de empresa fue creado, pero hubo un problema al configurar el acceso. Contacta al administrador.')
        return
      }
      
      const userData = await userResponse.json()
      console.log('Usuario registrado exitosamente:', userData)
      
      // Guardar datos de sesión
      localStorage.setItem('token', userData.access_token || 'temp_token')
      localStorage.setItem('role', 'company')
      localStorage.setItem('company_id', companyData.id || companyData.company_id)
      localStorage.setItem('user_id', userData.user_id || userData.id)
      
      console.log('✅ Registro completo: Empresa y usuario creados exitosamente')
      alert('¡Empresa registrada exitosamente!')
      setLocation('/company-dashboard')
      
    } catch (error) {
      console.error('Error durante el proceso de registro:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Error al registrar la empresa. Inténtalo de nuevo.'}`)
    }
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4"><FaIdCard className="text-fuchsia-400 w-6 h-6" /><h2 className="text-lg font-bold text-white">Datos de la Empresa</h2></div>
      <Label htmlFor="ruc" className="text-white">RUC *</Label>
      <Input
        id="ruc"
        value={formData.ruc}
        onChange={(e) => updateFormData('ruc', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="11 dígitos"
        maxLength={11}
      />

      <Label htmlFor="name" className="text-white">Nombre de la Empresa *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => updateFormData('name', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="Ej: TechSolutions Perú"
      />

      <Label htmlFor="location" className="text-white">Ubicación *</Label>
      <div className="relative city-dropdown-container">
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleCityInput(e.target.value)}
          onFocus={() => {
            if (formData.location.length > 0) {
              const filtered = peruvianCities.filter(city => 
                city.toLowerCase().includes(formData.location.toLowerCase())
              )
              setFilteredCities(filtered)
              setShowCityDropdown(true)
            }
          }}
          placeholder="Escribe tu ciudad"
          className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        />
        {showCityDropdown && filteredCities.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-[#1a0b3d] border border-[#FF258D]/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleCityChange(city)}
                className="w-full px-4 py-2 text-left text-white hover:bg-[#FF258D]/20 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <Label htmlFor="industry" className="text-white">Sector *</Label>
      <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
        <SelectTrigger className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
          <SelectValue placeholder="Selecciona tu sector" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry} className="text-white hover:bg-[#FF258D]/20">
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4"><FaUserTie className="text-fuchsia-400 w-6 h-6" /><h2 className="text-lg font-bold text-white">Contacto y Acceso</h2></div>
      <Label htmlFor="contact_name" className="text-white">Persona de Contacto *</Label>
      <Input
        id="contact_name"
        value={formData.contact_name}
        onChange={(e) => updateFormData('contact_name', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="Nombre completo del representante"
      />

      <Label htmlFor="contact_dni" className="text-white">DNI del Representante *</Label>
      <Input
        id="contact_dni"
        value={formData.contact_dni}
        onChange={(e) => updateFormData('contact_dni', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="DNI del representante legal"
        maxLength={8}
      />

      <Label htmlFor="email" className="text-white">Correo de Contacto *</Label>
      <Input
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData('email', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="contacto@empresa.com"
      />

      <Label htmlFor="password" className="text-white">Contraseña *</Label>
      <Input
        id="password"
        type="password"
        value={formData.password}
        onChange={(e) => updateFormData('password', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="Ingresa tu contraseña (mínimo 6 caracteres)"
      />

      <Label htmlFor="confirmPassword" className="text-white">Confirmar Contraseña *</Label>
      <Input
        id="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="Confirma tu contraseña"
      />

    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4"><FaRegSmile className="text-fuchsia-400 w-6 h-6" /><h2 className="text-lg font-bold text-white">Cultura Organizacional</h2></div>
      <Label htmlFor="company_culture" className="text-white">Cultura Organizacional</Label>
      <Textarea
        id="company_culture"
        value={formData.company_culture}
        onChange={(e) => updateFormData('company_culture', e.target.value)}
        className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
        placeholder="Describe la cultura de tu empresa, valores, ambiente de trabajo..."
        rows={6}
      />

      <div className="bg-[#1a0b3d]/60 p-4 rounded-lg border border-[#FF258D]/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Resumen de la Empresa</h3>
        <div className="space-y-2 text-gray-200">
          <p><strong>RUC:</strong> {formData.ruc || 'No especificado'}</p>
          <p><strong>Nombre:</strong> {formData.name || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> {formData.location || 'No especificado'}</p>
          <p><strong>Sector:</strong> {formData.industry || 'No especificado'}</p>
          <p><strong>Contacto:</strong> {formData.contact_name || 'No especificado'}</p>
          <p><strong>Email:</strong> {formData.email || 'No especificado'}</p>
        </div>
      </div>
    </motion.div>
  )

  const steps = [
    { title: 'Información Básica', description: 'Datos de la empresa' },
    { title: 'Contacto', description: 'Información de contacto' },
    { title: 'Cultura', description: 'Cultura organizacional' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDuration: '2.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED] rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDuration: '3.2s', animationDelay: '1.2s'}}></div>
      </div>

      {/* Header */}
      <div className="fixed top-4 left-4 z-20">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 shadow-lg"
          onClick={() => setLocation('/')}
        >
          ← Volver
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                Registro de Empresa
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Únete a Project Core y conecta con talento universitario
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8">
              {/* Progress Steps */}
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                      currentStep > index + 1 
                        ? 'bg-[#FF258D] text-white' 
                        : currentStep === index + 1 
                        ? 'bg-[#FF258D] text-white' 
                        : 'bg-white/20 text-gray-400'
                    }`}>
                      {currentStep > index + 1 ? '✓' : index + 1}
                    </div>
                    <div className="text-xs text-center mt-2 max-w-16 sm:max-w-20">
                      <div className={`font-semibold ${currentStep === index + 1 ? 'text-[#FF258D]' : 'text-gray-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-gray-500 text-xs hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 sm:pt-6">
                <Button
                  variant="outline"
                  className="text-sm sm:text-base"
                  onClick={currentStep === 1 ? () => setLocation('/register') : handlePrevious}
                >
                  <FaArrowLeft className="mr-2" /> Volver
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white text-sm sm:text-base"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white text-sm sm:text-base"
                  >
                    Completar Registro
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}