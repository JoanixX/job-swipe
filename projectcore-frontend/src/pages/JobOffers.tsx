'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface JobOffer {
  id: string
  title: string
  description: string
  area: string
  modality: string
  required_hours: number
  duration: number
  start_date: string
  approximated_salary: number
  company_name: string
  company_location: string
  created_at: string
}

interface MatchResult {
  score: number
  message: string
}

export default function JobOffers() {
  const [, setLocation] = useLocation()
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null)
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false)

  useEffect(() => {
    fetchJobOffers()
  }, [])

  const fetchJobOffers = async () => {
    try {
      const response = await fetch('/api/job-offers')
      if (response.ok) {
        const data = await response.json()
        setJobOffers(data)
      } else {
        console.error('Error fetching job offers')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCompatibility = async (jobOfferId: string) => {
    try {
      // Obtener el ID del estudiante actual (esto debería venir del contexto de autenticación)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const studentId = currentUser.id

      if (!studentId) {
        alert('Debes iniciar sesión como estudiante para calcular compatibilidad')
        return
      }

      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          job_offer_id: jobOfferId
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setMatchResult(result)
        setIsMatchDialogOpen(true)
      } else {
        alert('Error al calcular la compatibilidad')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al calcular la compatibilidad')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(salary)
  }

  const getModalityColor = (modality: string) => {
    switch (modality.toLowerCase()) {
      case 'presencial':
        return 'bg-blue-500'
      case 'remoto':
        return 'bg-green-500'
      case 'híbrido':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF258D] mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando ofertas...</p>
        </div>
      </div>
    )
  }

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

      <div className="relative z-10 px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#FF258D] bg-clip-text text-transparent">
              Ofertas Activas
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explora oportunidades laborales y encuentra tu próxima experiencia profesional
            </p>
          </div>

          {jobOffers.length === 0 ? (
            <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-white mb-2">No hay ofertas disponibles</h3>
                <p className="text-gray-300 mb-6">
                  Aún no se han publicado ofertas laborales. ¡Vuelve pronto!
                </p>
                <Button
                  onClick={() => setLocation('/chambea-ya-home')}
                  className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white"
                >
                  Volver al Inicio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-[#1a0b3d] backdrop-blur-sm border-[#FF258D]/30 hover:border-[#FF258D]/50 transition-all duration-300 hover:shadow-[#FF258D]/20 hover:shadow-xl h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getModalityColor(offer.modality)} text-white`}>
                          {offer.modality}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {formatDate(offer.created_at)}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-white mb-2">
                        {offer.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {offer.company_name} • {offer.company_location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {offer.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Área:</span>
                          <p className="text-white font-medium">{offer.area}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Horas:</span>
                          <p className="text-white font-medium">{offer.required_hours}h/semana</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Duración:</span>
                          <p className="text-white font-medium">{offer.duration} semanas</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Salario:</span>
                          <p className="text-white font-medium">{formatSalary(offer.approximated_salary)}</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          onClick={() => calculateCompatibility(offer.id)}
                          className="w-full bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#390062] hover:to-[#FF258D] text-white"
                        >
                          🌟 Calcular Compatibilidad
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Match Result Dialog */}
      <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
        <DialogContent className="bg-[#1a0b3d] border-[#FF258D]/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Resultado de Compatibilidad
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Tu perfil vs {selectedOffer?.title}
            </DialogDescription>
          </DialogHeader>
          
          {matchResult && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🌟</div>
              <div className="text-4xl font-bold text-[#FF258D] mb-4">
                {matchResult.score}%
              </div>
              <p className="text-xl text-white mb-6">
                {matchResult.message}
              </p>
              <div className="bg-[#FF258D]/10 border border-[#FF258D]/30 rounded-lg p-4">
                <p className="text-gray-300">
                  {matchResult.score >= 80 ? 
                    "¡Excelente compatibilidad! Te recomendamos aplicar." :
                    matchResult.score >= 60 ?
                    "Buena compatibilidad. Considera aplicar si te interesa el área." :
                    "Compatibilidad moderada. Revisa si el perfil se ajusta a tus intereses."
                  }
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}