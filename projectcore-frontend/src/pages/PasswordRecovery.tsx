import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '@/services/backend-api'
import { FieldError, ErrorBanner } from '@/components/auth/AuthLayout'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function PasswordRecovery() {
  const [, setLocation] = useLocation()
  const [type, setType] = useState<'student' | 'company'>('student')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [apiError, setApiError] = useState('')
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
    setApiError('')
    setEmailError('')

    if (!email) {
      setEmailError('Ingresa tu correo electrónico')
      return
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError('El formato del correo no es válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/recover-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('request_failed')
      }

      setIsSuccess(true)
    } catch (error) {
      setApiError('No pudimos procesar tu solicitud. Verifica tu conexión e inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen auth-gradient text-white flex flex-col relative font-sans">
      <div className="p-6 relative z-20">
        {!isSuccess && (
          <button
            onClick={() => setLocation(`/login?type=${type}`)}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        )}
      </div>

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
                <h1 className="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
                <p className="text-white/80">
                  {type === 'company'
                    ? 'Ingresa tu correo corporativo para recibir un enlace'
                    : 'Ingresa tu correo para recibir un enlace de recuperación'}
                </p>
              </div>

              <div className="bg-white w-full rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <ErrorBanner message={apiError} />

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
                      autoComplete="email"
                      className={`bg-transparent text-gray-900 focus:border-[#4F6CDB] focus:ring-[#4F6CDB] ${emailError ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    <FieldError message={emailError} />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base mt-2 transition-colors disabled:opacity-70"
                  >
                    {isLoading
                      ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</span>
                      : 'Enviar Enlace de Recuperación'}
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

                <h2 className="text-2xl font-bold text-gray-900 mb-3">Revisa tu correo</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Si <strong className="text-gray-900">{email}</strong> está registrado, recibirás un enlace
                  para restablecer tu contraseña. Revisa tu bandeja de entrada{type === 'company' ? ' corporativa' : ''} y
                  la carpeta de spam. El enlace expira en 30 minutos.
                </p>

                <Button
                  onClick={() => setLocation(`/login?type=${type}`)}
                  className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base transition-colors"
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
