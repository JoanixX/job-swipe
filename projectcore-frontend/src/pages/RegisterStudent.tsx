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
import { FaUserGraduate, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaBook, FaRegLightbulb, FaRegClock, FaKey, FaArrowLeft, FaUserEdit, FaLink, FaListAlt, FaStar, FaRegSmile, FaRegFileAlt } from 'react-icons/fa'
import { useUser } from '@/lib/user-context'

interface StudentFormData {
  name: string
  email: string
  date_of_birth: string
  password: string
  experience_id: number
  location: string
  weekly_availability: number
  preferred_modality: number
  career: string
  academic_cycle: number
  main_motivation: string
  description: string
}

const universities = [
  "Pontificia Universidad Católica del Perú",
  "Universidad Nacional Mayor de San Marcos",
  "Universidad Peruana Cayetano Heredia",
  "Universidad de Lima",
  "Universidad del Pacífico",
  "Universidad Nacional de Ingeniería",
  "Universidad San Ignacio de Loyola",
  "Universidad ESAN",
  "Universidad de Piura",
  "Universidad Científica del Sur",
  "Universidad Nacional Agraria La Molina",
  "Universidad Ricardo Palma",
  "Universidad Privada del Norte",
  "Universidad Nacional Federico Villarreal",
  "Universidad Nacional San Agustín de Arequipa",
  "Universidad Nacional de Trujillo",
  "Universidad Nacional San Antonio Abad del Cusco",
  "Universidad Católica San Pablo",
  "Universidad Nacional de la Amazonía Peruana",
  "Universidad Nacional Jorge Basadre Grohmann",
  "Universidad Nacional del Altiplano",
  "Universidad Nacional de San Martín",
  "Universidad Nacional de Ucayali",
  "Universidad Nacional de Tumbes",
  "Universidad Nacional de Moquegua",
  "Universidad Nacional de Huancavelica",
  "Universidad Nacional de Jaén",
  "Universidad Nacional de Barranca",
  "Universidad Nacional Autónoma de Alto Amazonas",
  "Otra"
];

const careers = [
  "Ingeniería de Sistemas",
  "Ingeniería Industrial",
  "Administración de Empresas",
  "Contabilidad",
  "Marketing",
  "Derecho",
  "Medicina",
  "Psicología",
  "Comunicaciones",
  "Arquitectura",
  "Ingeniería Civil",
  "Ingeniería Mecánica",
  "Ingeniería Eléctrica",
  "Ingeniería Química",
  "Ingeniería Ambiental",
  "Economía",
  "Finanzas",
  "Recursos Humanos",
  "Turismo y Hotelería",
  "Educación",
  "Ciencias Políticas",
  "Relaciones Internacionales",
  "Ingeniería Electrónica",
  "Ingeniería de Telecomunicaciones",
  "Ingeniería Biomédica",
  "Ingeniería de Software",
  "Ingeniería Agroindustrial",
  "Ingeniería de Alimentos",
  "Ingeniería Forestal",
  "Ingeniería Geológica",
  "Ingeniería de Minas",
  "Ingeniería Pesquera",
  "Ingeniería Textil",
  "Ingeniería Naval",
  "Ingeniería Mecatrónica",
  "Ingeniería de Materiales",
  "Ingeniería Sanitaria",
  "Ingeniería de Petróleo",
  "Ingeniería Metalúrgica",
  "Ingeniería Estadística",
  "Matemáticas",
  "Física",
  "Química",
  "Biología",
  "Ciencias de la Computación",
  "Ciencias de la Información",
  "Sociología",
  "Antropología",
  "Historia",
  "Filosofía",
  "Arte",
  "Música",
  "Otra"
];

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

const modalities = [
  "Presencial",
  "Remoto",
  "Híbrido"
]

const motivations = [
  "Ganar experiencia laboral",
  "Aplicar conocimientos teóricos",
  "Explorar diferentes industrias",
  "Desarrollar habilidades profesionales",
  "Construir una red de contactos",
  "Contribuir a proyectos reales"
]

const weeklyHoursOptions = [
  { value: 20, label: "20 horas" },
  { value: 25, label: "25 horas" },
  { value: 30, label: "30 horas" },
  { value: 35, label: "35 horas" },
  { value: 40, label: "40 horas" },
  { value: 45, label: "45 horas" },
  { value: 50, label: "Más de 45 horas" }
]

const academicCycles = [
  { value: 0, label: "Ya terminé" },
  { value: 1, label: "1° ciclo" },
  { value: 2, label: "2° ciclo" },
  { value: 3, label: "3° ciclo" },
  { value: 4, label: "4° ciclo" },
  { value: 5, label: "5° ciclo" },
  { value: 6, label: "6° ciclo" },
  { value: 7, label: "7° ciclo" },
  { value: 8, label: "8° ciclo" },
  { value: 9, label: "9° ciclo" },
  { value: 10, label: "10° ciclo" },
  { value: 11, label: "11° ciclo" },
  { value: 12, label: "12° ciclo" }
];

export default function RegisterStudent() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [showCustomCareer, setShowCustomCareer] = useState(false)
  const [customCareer, setCustomCareer] = useState('')
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    career: '',
    academic_cycle: ''
  })
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Auto-fill form with Google data if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const googleAuth = urlParams.get('googleAuth')
    const email = urlParams.get('email')
    const name = urlParams.get('name')
    const picture = urlParams.get('picture')

    if (googleAuth === 'true' && email && name) {
      setFormData(prev => ({
        ...prev,
        email: email,
        name: name
      }))
    }
  }, [])

  const updateFormData = (field: keyof typeof formData, value: string | number) => {
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

  const handleCareerChange = (value: string) => {
    if (value === 'Otra') {
      setShowCustomCareer(true)
      setCustomCareer('')
    } else {
      setShowCustomCareer(false)
      setCustomCareer('')
      updateFormData('career', value)
    }
  }

  const handleCustomCareerChange = (value: string) => {
    setCustomCareer(value)
    updateFormData('career', value)
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
      // Validar que todos los campos requeridos estén completos
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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
      
      // Validar carrera personalizada si se seleccionó "Otra"
      if (formData.career === 'Otra' && !customCareer.trim()) {
        alert('Por favor especifica tu carrera')
        return
      }
      
      // Usar carrera personalizada si se especificó
      const finalCareer = formData.career === 'Otra' ? customCareer : formData.career
      
      // PASO 1: Registrar el estudiante
      const studentPayload = {
        name: formData.name,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        experience_id: formData.experience_id,
        location: formData.location,
        weekly_availability: formData.weekly_availability,
        preferred_modality: formData.preferred_modality,
        career: finalCareer,
        academic_cycle: formData.academic_cycle,
        main_motivation: formData.main_motivation,
        description: formData.description
      }
      
      console.log('Paso 1: Registrando estudiante...', studentPayload)
      
      const studentResponse = await fetch('https://backendcy-dce4dqceb2ech0a2.westus3-01.azurewebsites.net/api/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(studentPayload),
      })
      
      if (!studentResponse.ok) {
        const errorText = await studentResponse.text()
        console.error('Error al registrar estudiante:', errorText)
        let errorMessage = 'Error al crear perfil de estudiante'
        try {
          const err = JSON.parse(errorText)
          errorMessage = err.detail || err.message || errorMessage
        } catch (e) {
          console.error('Error parsing error response:', e)
        }
        throw new Error(errorMessage)
      }
      
      const studentData = await studentResponse.json()
      console.log('Estudiante registrado exitosamente:', studentData)
      
      // PASO 2: Registrar el usuario para login
      const userPayload = {
        email: formData.email,
        password: formData.password,
        role: "student",
        related_id: studentData.id || studentData.student_id || 0,
        dni: formData.dni || "00000000" // Using DNI field for students
      }
      
      console.log('Paso 2: Registrando usuario para login...', { ...userPayload, password: '[HIDDEN]' })
      
      const userResponse = await fetch('https://backendcy-dce4dqceb2ech0a2.westus3-01.azurewebsites.net/api/register/user', {
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
        console.warn('El estudiante fue creado pero no se pudo crear el usuario para login')
        alert('El perfil de estudiante fue creado, pero hubo un problema al configurar el acceso. Contacta al administrador.')
        return
      }
      
      const userData = await userResponse.json()
      console.log('Usuario registrado exitosamente:', userData)
      
      // Guardar datos de sesión
      localStorage.setItem('token', userData.access_token || 'temp_token')
      
      // Save user data to context and localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const googleAuth = urlParams.get('googleAuth') === 'true'
      const picture = urlParams.get('picture')
      
      const userDataToSave = {
        id: userData.student_id,
        name: formData.name,
        email: formData.email,
        picture: picture || undefined,
        userType: 'student' as const,
        isGoogleAuth: googleAuth,
        profileData: {
          career: finalCareer,
          location: formData.location,
          academic_cycle: formData.academic_cycle,
          weekly_availability: formData.weekly_availability,
          preferred_modality: formData.preferred_modality,
          main_motivation: formData.main_motivation,
          description: formData.description
        }
      }
      
      setUser(userDataToSave)
      setRegistrationSuccess(true)
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        setLocation('/student-dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('Error en el registro:', error)
      alert('Error al registrar. Por favor intenta de nuevo.')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-4"><FaIdCard className="text-fuchsia-400 w-6 h-6" /><h2 className="text-lg font-bold text-white">Datos Personales y Académicos</h2></div>
            
            {/* Datos Personales */}
            <div className="space-y-4">
              <Label htmlFor="name" className="text-white">Nombre completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Ingresa tu nombre completo"
                className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
              />
              
              <Label htmlFor="email" className="text-white">Correo *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="tuemail@ejemplo.com"
                className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
              />
              
              <Label htmlFor="date_of_birth" className="text-white">Fecha de nacimiento *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
              />
              
              <Label htmlFor="password" className="text-white">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Ingresa tu contraseña (mínimo 6 caracteres)"
                className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
              />
              
              <Label htmlFor="confirmPassword" className="text-white">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                placeholder="Confirma tu contraseña"
                className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
              />
            </div>

            {/* Datos Académicos */}
            <div className="space-y-4 pt-4 border-t border-[#FF258D]/20">
              <Label htmlFor="career" className="text-white">Carrera *</Label>
              <Select value={formData.career} onValueChange={(value) => handleCareerChange(value)}>
                <SelectTrigger className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Selecciona tu carrera" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
                  {careers.map((career) => (
                    <SelectItem key={career} value={career} className="text-white hover:bg-[#FF258D]/20">
                      {career}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {showCustomCareer && (
                <div className="mt-4">
                  <Label htmlFor="custom_career" className="text-white">Especifica tu carrera *</Label>
                  <Input
                    id="custom_career"
                    value={customCareer}
                    onChange={(e) => handleCustomCareerChange(e.target.value)}
                    placeholder="Escribe tu carrera"
                    className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
                  />
                </div>
              )}

              <Label htmlFor="academic_cycle" className="text-white">Ciclo académico *</Label>
              <Select value={formData.academic_cycle.toString()} onValueChange={(value) => updateFormData('academic_cycle', parseInt(value))}>
                <SelectTrigger className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Selecciona tu ciclo" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
                  {academicCycles.map((cycle) => (
                    <SelectItem key={cycle.value} value={cycle.value.toString()} className="text-white hover:bg-[#FF258D]/20">
                      {cycle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-4"><FaMapMarkerAlt className="text-fuchsia-400 w-6 h-6" /><h2 className="text-lg font-bold text-white">Perfil y Experiencia</h2></div>
            
            {/* Ubicación e Intereses */}
            <div className="space-y-4">
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
                  className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
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
              

            </div>

            {/* Motivación y Experiencia */}
            <div className="space-y-4 pt-4 border-t border-[#FF258D]/20">
              <Label htmlFor="main_motivation" className="text-white">Motivación principal *</Label>
              <Select value={formData.main_motivation} onValueChange={(value) => updateFormData('main_motivation', value)}>
                <SelectTrigger className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="¿Qué te motiva a buscar prácticas?" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
                  {motivations.map((motivation) => (
                    <SelectItem key={motivation} value={motivation} className="text-white hover:bg-[#FF258D]/20">
                      {motivation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Label htmlFor="description" className="text-white">Descripción personal *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Cuéntanos sobre ti, hobbies, personalidad..."
                className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
              />
              

              

            </div>

            {/* Disponibilidad y Modalidad */}
            <div className="space-y-4 pt-4 border-t border-[#FF258D]/20">
              <Label htmlFor="weekly_availability" className="text-white">Horas semanales disponibles *</Label>
              <Select value={formData.weekly_availability.toString()} onValueChange={(value) => updateFormData('weekly_availability', parseInt(value))}>
                <SelectTrigger className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Selecciona tu disponibilidad" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
                  {weeklyHoursOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()} className="text-white hover:bg-[#FF258D]/20">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Label htmlFor="preferred_modality" className="text-white">Modalidad preferida *</Label>
              <Select value={formData.preferred_modality.toString()} onValueChange={(value) => updateFormData('preferred_modality', parseInt(value))}>
                <SelectTrigger className="mt-1 bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Selecciona tu modalidad preferida" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
                  <SelectItem value="1" className="text-white hover:bg-[#FF258D]/20">
                    Presencial
                  </SelectItem>
                  <SelectItem value="2" className="text-white hover:bg-[#FF258D]/20">
                    Remoto
                  </SelectItem>
                  <SelectItem value="3" className="text-white hover:bg-[#FF258D]/20">
                    Híbrido
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-4"><FaRegFileAlt className="text-fuchsia-400 w-6 h-6" /><h2 className="text-lg font-bold text-white">Revisión de Datos</h2></div>
            
            <div className="bg-[#0a0520]/50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#FF258D] mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Nombre completo</label>
                  <p className="text-white font-medium">{formData.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Correo electrónico</label>
                  <p className="text-white font-medium">{formData.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Fecha de nacimiento</label>
                  <p className="text-white font-medium">{formData.date_of_birth ? new Date(formData.date_of_birth).toLocaleDateString('es-ES') : 'No especificada'}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#FF258D] mb-4 mt-6">Datos Académicos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Carrera</label>
                  <p className="text-white font-medium">{formData.career === 'Otra' ? customCareer : formData.career}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Ciclo académico</label>
                  <p className="text-white font-medium">{formData.academic_cycle === 0 ? 'Ya terminé' : `${formData.academic_cycle}° ciclo`}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#FF258D] mb-4 mt-6">Ubicación</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Ubicación</label>
                  <p className="text-white font-medium">{formData.location}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#FF258D] mb-4 mt-6">Motivación y Experiencia</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Motivación principal</label>
                  <p className="text-white font-medium">{formData.main_motivation}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Descripción personal</label>
                  <p className="text-white font-medium">{formData.description}</p>
                </div>

              </div>

              <h3 className="text-lg font-semibold text-[#FF258D] mb-4 mt-6">Disponibilidad y Modalidad</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Horas semanales disponibles</label>
                  <p className="text-white font-medium">{formData.weekly_availability === 50 ? 'Más de 45 horas' : `${formData.weekly_availability} horas`}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Modalidad preferida</label>
                  <p className="text-white font-medium">{formData.preferred_modality === 1 ? 'Presencial' : formData.preferred_modality === 2 ? 'Remoto' : 'Híbrido'}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#FF258D]/10 border border-[#FF258D]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaRegSmile className="text-[#FF258D] w-5 h-5 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">¡Casi listo!</h4>
                  <p className="text-sm text-gray-300">
                    Revisa que toda la información sea correcta. Una vez enviado, podrás acceder a tu perfil 
                    y comenzar a conectar con oportunidades reales.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  const steps = [
    { title: 'Registro', description: 'Información básica y académica' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#390062] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => setLocation('/')}
        >
          ← Volver
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                Registro de Estudiante
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base">
                Crea tu perfil y conecta con oportunidades reales
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8">
              {registrationSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                  <FaRegSmile className="text-[#FF258D] w-16 h-16 mb-4" />
                  <h2 className="text-2xl font-bold text-white text-center">¡Gracias por completar tu registro!</h2>
                  <p className="text-center text-gray-300 max-w-xs">
                    Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión con tu correo y contraseña.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Button
                      onClick={() => setLocation('/login')}
                      className="flex-1 bg-gradient-to-r from-[#0EA5FF] to-[#00D4FF] hover:from-[#0EA5FF]/90 hover:to-[#00D4FF]/90 text-white font-semibold py-3 text-lg"
                    >
                      Iniciar Sesión
                    </Button>
                    
                    <a
                      href="https://chat.whatsapp.com/EmA7S7Xblqf1eaVrAzPiiB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#128C7E] transition-colors text-lg"
                    >
                      WhatsApp
                    </a>
                  </div>
                  
                  <p className="text-center text-gray-400 text-sm max-w-xs">
                    También puedes unirte a nuestra comunidad de WhatsApp para estar al tanto de oportunidades.
                  </p>
                </div>
              ) : (
                <>
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
                    {renderStep()}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 sm:pt-6">
                    <Button
                      variant="outline"
                      onClick={currentStep === 1 ? () => setLocation('/register') : prevStep}
                      className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white text-sm sm:text-base"
                    >
                      <FaArrowLeft className="mr-2" /> Volver
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        onClick={nextStep}
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
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}