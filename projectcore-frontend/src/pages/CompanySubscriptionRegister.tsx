'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FaBuilding, FaCheck, FaCrown, FaStar, FaArrowRight, FaShieldAlt, FaCreditCard, FaRocket } from 'react-icons/fa'
import { useUser } from '@/lib/user-context'
import Logo from '@/components/Logo'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  recommended?: boolean
  icon: React.ReactNode
  color: string
}

interface CompanyFormData {
  ruc: string
  name: string
  location: string
  industry: string
  contact_name: string
  contact_dni: string
  email: string
  password: string
  confirmPassword: string
  company_culture: string
  selectedPlan: string
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    period: 'mes',
    description: 'Perfecto para startups y pequeñas empresas',
    features: [
      'Hasta 5 publicaciones de proyectos al mes',
      'Acceso básico al matching con IA',
      'Dashboard básico de candidatos',
      'Soporte por email',
      'Certificaciones básicas'
    ],
    icon: <FaBuilding className="text-2xl" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 599,
    period: 'mes',
    description: 'Ideal para empresas en crecimiento',
    features: [
      'Hasta 15 publicaciones de proyectos al mes',
      'Matching avanzado con IA + filtros personalizados',
      'Dashboard completo con analytics',
      'Soporte prioritario por chat y email',
      'Certificaciones verificadas blockchain',
      'Gestión de equipos y colaboradores',
      'Reportes de desempeño detallados'
    ],
    recommended: true,
    icon: <FaRocket className="text-2xl" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1299,
    period: 'mes',
    description: 'Para grandes empresas con necesidades avanzadas',
    features: [
      'Publicaciones ilimitadas de proyectos',
      'IA personalizada para tu empresa',
      'Dashboard enterprise con BI avanzado',
      'Soporte 24/7 + Account Manager dedicado',
      'Certificaciones premium + integración API',
      'Gestión avanzada de equipos y roles',
      'Reportes personalizados y exportables',
      'Integración con sistemas HR existentes',
      'Onboarding personalizado'
    ],
    icon: <FaCrown className="text-2xl" />,
    color: 'from-yellow-500 to-orange-500'
  }
]

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
  "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco",
  "Chimbote", "Huancayo", "Tacna", "Ica", "Cajamarca", "Pucallpa", "Sullana"
]

export default function CompanySubscriptionRegister() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [formData, setFormData] = useState<CompanyFormData>({
    ruc: '',
    name: '',
    location: '',
    industry: '',
    contact_name: '',
    contact_dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_culture: '',
    selectedPlan: ''
  })

  // Pre-fill email and password if coming from InnovativeRegister
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const googleAuth = urlParams.get('googleAuth')
    const emailParam = urlParams.get('email')
    const nameParam = urlParams.get('name')
    const passwordParam = urlParams.get('password')
    
    if (googleAuth === 'true' && emailParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam,
        contact_name: nameParam || ''
      }))
    } else if (emailParam && passwordParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam,
        password: passwordParam,
        confirmPassword: passwordParam
      }))
    }
  }, [])

  const updateFormData = (field: keyof CompanyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const handleCityChange = (value: string) => {
    updateFormData('location', value)
    setShowCityDropdown(false)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = ['ruc', 'name', 'location', 'industry', 'contact_name', 'contact_dni', 'email', 'password', 'selectedPlan']
      const missingFields = requiredFields.filter(field => !formData[field as keyof CompanyFormData])
      
      if (missingFields.length > 0) {
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

      // Submit company registration with subscription
      const payload = {
        ...formData,
        subscription_plan: formData.selectedPlan
      }
      
      console.log('Registering company with subscription:', payload)
      
      // Save user data to context and localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const googleAuth = urlParams.get('googleAuth') === 'true'
      const picture = urlParams.get('picture')
      
      const userData = {
        id: `company_${Date.now()}`, // Temporary ID until backend integration
        name: formData.contact_name,
        email: formData.email,
        picture: picture || undefined,
        userType: 'company' as const,
        isGoogleAuth: googleAuth,
        profileData: {
          companyName: formData.name,
          ruc: formData.ruc,
          location: formData.location,
          industry: formData.industry,
          contact_dni: formData.contact_dni,
          company_culture: formData.company_culture,
          subscription_plan: formData.selectedPlan
        }
      }
      
      setUser(userData)
      
      // Here you would make the API call to register the company
      // For now, we'll simulate success
      setRegistrationSuccess(true)
      
      // Redirect to login after a delay
      setTimeout(() => {
        setLocation('/login')
      }, 5000)
      
    } catch (error) {
      console.error('Error during company registration:', error)
      alert('Error al registrar la empresa. Por favor intenta nuevamente.')
    }
  }

  const renderPlanSelection = () => (
    <motion.div
      key="plans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Elige tu Plan de Suscripción
        </h2>
        <p className="text-gray-300 text-lg">
          Selecciona el plan que mejor se adapte a las necesidades de tu empresa
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 relative ${
                formData.selectedPlan === plan.id
                  ? `bg-gradient-to-br ${plan.color.replace('from-', 'from-').replace('to-', 'to-')}/20 border-2 shadow-lg`
                  : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
              } ${plan.recommended ? 'ring-2 ring-purple-500/50' : ''}`}
              onClick={() => updateFormData('selectedPlan', plan.id)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FaStar className="text-xs" />
                    Recomendado
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {plan.name}
                </CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">S/. {plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <CardDescription className="text-gray-300">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {formData.selectedPlan === plan.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-sm" />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {formData.selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            onClick={nextStep}
            className="bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] hover:from-[#0EA5FF]/90 hover:to-[#7C3AED]/90 text-white px-8 py-3 text-lg font-semibold"
          >
            Continuar con {subscriptionPlans.find(p => p.id === formData.selectedPlan)?.name}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )

  const renderCompanyInfo = () => (
    <motion.div
      key="company-info"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Información de la Empresa
        </h2>
        <p className="text-gray-300">
          Completa los datos de tu empresa para crear tu perfil
        </p>
      </div>

      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ruc" className="text-white text-sm font-medium">
                RUC *
              </Label>
              <Input
                id="ruc"
                value={formData.ruc}
                onChange={(e) => updateFormData('ruc', e.target.value)}
                placeholder="20123456789"
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-white text-sm font-medium">
                Nombre de la empresa *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Mi Empresa S.A.C."
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-white text-sm font-medium">
                Industria *
              </Label>
              <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue placeholder="Selecciona una industria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700">
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Label htmlFor="location" className="text-white text-sm font-medium">
                Ubicación *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleCityInput(e.target.value)}
                placeholder="Lima"
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
              />
              {showCityDropdown && filteredCities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCityChange(city)}
                      className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="contact_name" className="text-white text-sm font-medium">
                Nombre del contacto *
              </Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => updateFormData('contact_name', e.target.value)}
                placeholder="Juan Pérez"
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
              />
            </div>

            <div>
              <Label htmlFor="contact_dni" className="text-white text-sm font-medium">
                DNI del contacto *
              </Label>
              <Input
                id="contact_dni"
                value={formData.contact_dni}
                onChange={(e) => updateFormData('contact_dni', e.target.value)}
                placeholder="12345678"
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company_culture" className="text-white text-sm font-medium">
              Cultura empresarial
            </Label>
            <Textarea
              id="company_culture"
              value={formData.company_culture}
              onChange={(e) => updateFormData('company_culture', e.target.value)}
              placeholder="Describe la cultura y valores de tu empresa..."
              className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
              rows={4}
            />
          </div>

          {!formData.email && (
            <>
              <div>
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="contacto@empresa.com"
                  className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password" className="text-white text-sm font-medium">
                    Contraseña *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                    Confirmar contraseña *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Confirma tu contraseña"
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-[#0EA5FF]"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={nextStep}
          className="bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] hover:from-[#0EA5FF]/90 hover:to-[#7C3AED]/90 text-white px-8 py-3 text-lg font-semibold"
        >
          Continuar al Pago
        </Button>
      </div>
    </motion.div>
  )

  const renderPaymentStep = () => {
    const selectedPlan = subscriptionPlans.find(p => p.id === formData.selectedPlan)
    
    return (
      <motion.div
        key="payment"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8 max-w-2xl mx-auto"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Confirmar Suscripción
          </h2>
          <p className="text-gray-300">
            Revisa tu selección y completa el registro
          </p>
        </div>

        {selectedPlan && (
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${selectedPlan.color} flex items-center justify-center text-white mb-4`}>
                {selectedPlan.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Plan {selectedPlan.name}
              </CardTitle>
              <div className="text-center">
                <span className="text-4xl font-bold text-white">S/. {selectedPlan.price}</span>
                <span className="text-gray-400">/{selectedPlan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Resumen de la empresa:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><strong>Empresa:</strong> {formData.name}</div>
                  <div><strong>RUC:</strong> {formData.ruc}</div>
                  <div><strong>Industria:</strong> {formData.industry}</div>
                  <div><strong>Ubicación:</strong> {formData.location}</div>
                  <div><strong>Contacto:</strong> {formData.contact_name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <FaShieldAlt className="text-blue-400 text-lg" />
                <div>
                  <div className="font-semibold text-white">Pago seguro</div>
                  <div>Tu información está protegida con encriptación SSL</div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 text-lg"
              >
                <FaCreditCard className="mr-2" />
                Confirmar y Proceder al Pago
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Al confirmar, aceptas nuestros términos de servicio y política de privacidad.
                Podrás cancelar tu suscripción en cualquier momento.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    )
  }

  const steps = [
    { title: 'Plan', description: 'Selecciona tu suscripción' },
    { title: 'Empresa', description: 'Información de la empresa' },
    { title: 'Pago', description: 'Confirmar y pagar' }
  ]

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
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#0EA5FF]/20 to-[#7C3AED]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#7C3AED]/20 to-[#0EA5FF]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => currentStep > 1 ? prevStep() : setLocation('/register')}
        >
          ← {currentStep > 1 ? 'Atrás' : 'Volver'}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-gradient-to-r from-[#0EA5FF] to-[#7C3AED] text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {currentStep > index + 1 ? <FaCheck /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {registrationSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center space-y-6 py-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8"
              >
                <FaCheck className="text-green-400 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-white text-center">¡Empresa registrada exitosamente!</h2>
                <p className="text-center text-gray-300 max-w-md">
                  Tu cuenta empresarial ha sido creada. Ahora puedes iniciar sesión con tu correo y contraseña para acceder a tu dashboard.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <Button
                    onClick={() => setLocation('/login')}
                    className="flex-1 bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF] hover:from-[#0EA5FF]/90 hover:to-[#00D4FF]/90 text-white font-semibold py-3 text-lg"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
                
                <p className="text-center text-gray-400 text-sm">
                  Redirigiendo automáticamente en 5 segundos...
                </p>
              </motion.div>
            ) : (
              <>
                {currentStep === 1 && renderPlanSelection()}
                {currentStep === 2 && renderCompanyInfo()}
                {currentStep === 3 && renderPaymentStep()}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
