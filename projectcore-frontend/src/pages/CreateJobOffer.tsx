'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface JobOfferData {
  title: string
  description: string
  area: string
  modality: string
  required_hours: number
  duration: number
  start_date: string
  approximated_salary: number
}

const areas = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Administración de Empresas',
  'Contabilidad',
  'Marketing',
  'Derecho',
  'Medicina',
  'Psicología',
  'Comunicaciones',
  'Arquitectura',
  'Logística',
  'Recursos Humanos',
  'Finanzas',
  'Comercio Internacional',
  'Otros'
]

const modalities = [
  'Presencial',
  'Remoto',
  'Híbrido'
]

const hourOptions = [10, 15, 20, 25, 30, 35, 40]
const durationOptions = [4, 8, 12, 16, 20, 24]

export default function CreateJobOffer() {
  const [, setLocation] = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<JobOfferData>({
    title: '',
    description: '',
    area: '',
    modality: '',
    required_hours: 20,
    duration: 12,
    start_date: '',
    approximated_salary: 0
  })

  const updateFormData = (field: keyof JobOfferData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
      if (!formData.title || !formData.description || !formData.area || !formData.modality || !formData.start_date || formData.approximated_salary <= 0) {
        alert('Por favor completa todos los campos requeridos')
        return
      }

      const response = await fetch('/api/job-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('¡Oferta laboral publicada exitosamente!')
        setLocation('/job-offers')
      } else {
        throw new Error('Error al publicar la oferta')
      }
    } catch (error) {
      console.error('Error al publicar oferta:', error)
      alert('Error al publicar la oferta. Inténtalo de nuevo.')
    }
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="title" className="text-white">Título del Puesto *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
          placeholder="Ej: Desarrollador Frontend Junior"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-white">Descripción del Puesto *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
          placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="area" className="text-white">Área del Puesto *</Label>
        <Select value={formData.area} onValueChange={(value) => updateFormData('area', value)}>
          <SelectTrigger className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
            <SelectValue placeholder="Selecciona el área" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
            {areas.map((area) => (
              <SelectItem key={area} value={area} className="text-white hover:bg-[#FF258D]/20">
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="modality" className="text-white">Modalidad de Trabajo *</Label>
        <Select value={formData.modality} onValueChange={(value) => updateFormData('modality', value)}>
          <SelectTrigger className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
            <SelectValue placeholder="Selecciona la modalidad" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
            {modalities.map((modality) => (
              <SelectItem key={modality} value={modality} className="text-white hover:bg-[#FF258D]/20">
                {modality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="required_hours" className="text-white">Horas Semanales Requeridas *</Label>
        <Select value={formData.required_hours.toString()} onValueChange={(value) => updateFormData('required_hours', parseInt(value))}>
          <SelectTrigger className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
            <SelectValue placeholder="Selecciona las horas" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
            {hourOptions.map((hours) => (
              <SelectItem key={hours} value={hours.toString()} className="text-white hover:bg-[#FF258D]/20">
                {hours} horas por semana
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="duration" className="text-white">Duración (en semanas) *</Label>
        <Select value={formData.duration.toString()} onValueChange={(value) => updateFormData('duration', parseInt(value))}>
          <SelectTrigger className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm">
            <SelectValue placeholder="Selecciona la duración" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0b3d] border-[#FF258D]/30">
            {durationOptions.map((weeks) => (
              <SelectItem key={weeks} value={weeks.toString()} className="text-white hover:bg-[#FF258D]/20">
                {weeks} semanas
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="start_date" className="text-white">Fecha de Inicio *</Label>
        <Input
          id="start_date"
          type="date"
          value={formData.start_date}
          onChange={(e) => updateFormData('start_date', e.target.value)}
          className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white backdrop-blur-sm"
        />
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="approximated_salary" className="text-white">Salario Aproximado (S/) *</Label>
        <Input
          id="approximated_salary"
          type="number"
          value={formData.approximated_salary}
          onChange={(e) => updateFormData('approximated_salary', parseFloat(e.target.value) || 0)}
          className="bg-[#1a0b3d]/80 border-[#FF258D]/30 text-white placeholder:text-gray-300 backdrop-blur-sm"
          placeholder="Ej: 1500"
          min="0"
          step="100"
        />
      </div>

      <div className="bg-[#1a0b3d]/60 p-4 rounded-lg border border-[#FF258D]/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Resumen de la Oferta</h3>
        <div className="space-y-2 text-gray-200">
          <p><strong>Título:</strong> {formData.title || 'No especificado'}</p>
          <p><strong>Área:</strong> {formData.area || 'No especificado'}</p>
          <p><strong>Modalidad:</strong> {formData.modality || 'No especificado'}</p>
          <p><strong>Horas:</strong> {formData.required_hours} horas/semana</p>
          <p><strong>Duración:</strong> {formData.duration} semanas</p>
          <p><strong>Fecha inicio:</strong> {formData.start_date ? new Date(formData.start_date).toLocaleDateString('es-ES') : 'No especificado'}</p>
          <p><strong>Salario:</strong> {formData.approximated_salary > 0 ? `S/ ${formData.approximated_salary.toLocaleString()}` : 'No especificado'}</p>
        </div>
      </div>
    </motion.div>
  )

  const steps = [
    { title: 'Información Básica', description: 'Título y descripción' },
    { title: 'Condiciones', description: 'Modalidad y duración' },
    { title: 'Compensación', description: 'Salario y revisión' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#390062] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => setLocation('/chambea-ya-home')}
        >
          ← Volver
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white">
                Publicar Oferta Laboral
              </CardTitle>
              <CardDescription className="text-gray-300">
                Crea una oferta atractiva para encontrar el talento que necesitas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Progress Steps */}
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep > index + 1 
                        ? 'bg-[#FF258D] text-white' 
                        : currentStep === index + 1 
                        ? 'bg-[#FF258D] text-white' 
                        : 'bg-white/20 text-gray-400'
                    }`}>
                      {currentStep > index + 1 ? '✓' : index + 1}
                    </div>
                    <div className="text-xs text-center mt-2 max-w-20">
                      <div className={`font-semibold ${currentStep === index + 1 ? 'text-[#FF258D]' : 'text-gray-400'}`}>
                        {step.title}
                      </div>
                      <div className="text-gray-500 text-xs">
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
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white"
                >
                  Anterior
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white"
                  >
                    Publicar Oferta
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