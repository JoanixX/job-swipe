import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import { API_BASE_URL } from '@/services/backend-api'
import { FieldError, ErrorBanner } from '@/components/auth/AuthLayout'
import PasswordInput from '@/components/auth/PasswordInput'

interface FieldErrors {
  password?: string
  confirmPassword?: string
}

export default function ResetPassword() {
  const [, setLocation] = useLocation()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setToken(params.get('token') || '')
  }, [])

  const validate = () => {
    const errors: FieldErrors = {}
    if (!password) errors.password = 'Ingresa tu nueva contraseña'
    else if (password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
    if (!confirmPassword) errors.confirmPassword = 'Confirma tu nueva contraseña'
    else if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.detail || 'El enlace de recuperación es inválido o ha expirado')
      }

      setIsSuccess(true)
    } catch (error: any) {
      setApiError(error.message || 'Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen auth-gradient text-white flex flex-col relative font-sans">
      <div className="p-6 relative z-20" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          {!token ? (
            <motion.div
              key="no-token"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
            >
              <div className="bg-white w-full rounded-3xl p-10 shadow-2xl text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Enlace inválido</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Este enlace de recuperación no es válido o está incompleto.
                  Solicita uno nuevo desde la pantalla de recuperación de contraseña.
                </p>
                <Button
                  onClick={() => setLocation('/recover-password')}
                  className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base transition-colors"
                >
                  Solicitar nuevo enlace
                </Button>
              </div>
            </motion.div>
          ) : !isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center w-full max-w-md mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Nueva Contraseña</h1>
                <p className="text-white/80">Crea una contraseña segura para tu cuenta</p>
              </div>

              <div className="bg-white w-full rounded-3xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <ErrorBanner message={apiError} />

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Nueva Contraseña</Label>
                    <PasswordInput
                      id="password"
                      value={password}
                      onChange={setPassword}
                      placeholder="Mínimo 8 caracteres"
                      hasError={!!fieldErrors.password}
                      autoComplete="new-password"
                    />
                    <FieldError message={fieldErrors.password} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">Confirmar Contraseña</Label>
                    <PasswordInput
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Repite tu nueva contraseña"
                      hasError={!!fieldErrors.confirmPassword}
                      autoComplete="new-password"
                    />
                    <FieldError message={fieldErrors.confirmPassword} />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base mt-2 transition-colors disabled:opacity-70"
                  >
                    {isLoading
                      ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</span>
                      : 'Restablecer Contraseña'}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Contraseña Actualizada</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Tu contraseña se restableció correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
                <Button
                  onClick={() => setLocation('/login')}
                  className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base transition-colors"
                >
                  Ir al Inicio de Sesión
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
