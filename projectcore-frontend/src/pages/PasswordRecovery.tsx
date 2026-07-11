import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react'
import { API_BASE_URL } from '@/services/backend-api'

export default function PasswordRecovery() {
  const [, setLocation] = useLocation()
  const [type, setType] = useState<'student' | 'company'>('student')
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlType = params.get('type')
    if (urlType === 'student' || urlType === 'company') {
      setType(urlType)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      alert('Por favor ingresa tu correo')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulamos la llamada a la API si el endpoint no existe aún, 
      // o la hacemos real si /api/recover-password existe.
      // await fetch(`${API_BASE_URL}/recover-password`, {
      //   method: 'POST',
      //   body: JSON.stringify({ email })
      // })
      
      // Simulación de carga:
      await new Promise(resolve => setTimeout(resolve, 800))

      setIsSuccess(true)
    } catch (error) {
      console.error('Error al recuperar contraseña:', error)
      alert('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D4A9F] to-[#4F6CDB] text-white flex flex-col relative font-sans">
      
      {!isSuccess && (
        <div className="p-6 relative z-20">
          <button 
            onClick={() => setLocation(`/login?type=${type}`)}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                {type === 'company' && (
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-[#1E3A8A]" />
                  </div>
                )}
                
                <h1 className="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
                <p className="text-white/80">
                  {type === 'company' 
                    ? 'Ingresa tu correo corporativo para recibir un enlace'
                    : 'Ingresa tu correo para recibir un enlace de recuperación'}
                </p>
              </div>

              <div className="bg-white w-full rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
                      {type === 'company' ? 'Correo Corporativo' : 'Correo Electrónico'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={type === 'company' ? 'reclutamiento@empresa.com' : 'estudiante@universidad.edu'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-gray-200 text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB]"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-6 rounded-xl font-medium text-base transition-colors mt-2"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
            >
              <div className="bg-white w-full rounded-3xl p-10 shadow-2xl text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Correo Enviado</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Hemos enviado un enlace de recuperación a <strong className="text-gray-900">{email}</strong>. 
                  Revisa tu bandeja de entrada{type === 'company' ? ' corporativa' : ''}.
                </p>

                <Button 
                  onClick={() => setLocation(`/login?type=${type}`)}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-6 rounded-xl font-medium text-base transition-colors"
                >
                  Volver al Inicio de Sesión
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
