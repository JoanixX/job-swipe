import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { API_BASE_URL } from '@/services/backend-api'
import AuthLayout, { AuthCard, FieldError, ErrorBanner } from '@/components/auth/AuthLayout'
import PasswordInput from '@/components/auth/PasswordInput'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FieldErrors {
  name?: string
  ruc?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function RegisterCompany() {
  const [, setLocation] = useLocation()
  const { setUser } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    address: '',
    termsAccepted: false
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const errors: FieldErrors = {}
    if (!formData.name.trim()) errors.name = 'Ingresa el nombre de la empresa'
    if (!formData.ruc) errors.ruc = 'Ingresa el RUC'
    else if (!/^\d{11}$/.test(formData.ruc)) errors.ruc = 'El RUC debe tener 11 dígitos numéricos'
    if (!formData.email) errors.email = 'Ingresa el correo corporativo'
    else if (!EMAIL_REGEX.test(formData.email)) errors.email = 'El formato del correo no es válido'
    if (!formData.password) errors.password = 'Crea una contraseña'
    else if (formData.password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirma la contraseña'
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    if (!formData.termsAccepted) errors.terms = 'Debes aceptar los Términos y Condiciones para registrar tu empresa'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    try {
      setIsLoading(true)

      // 1. Crear la empresa base
      const companyRes = await fetch(`${API_BASE_URL}/register/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          industry: 'Tecnología',
          company_culture: 'Innovación',
          contact_email: formData.email,
          phone: formData.phone,
          website: formData.website,
          location: formData.address
        })
      });

      if (!companyRes.ok) {
        const errorText = await companyRes.text();
        throw new Error(`Error en empresa: ${errorText}`);
      }
      const companyData = await companyRes.json();

      // 2. Crear el usuario asociado
      const userRes = await fetch(`${API_BASE_URL}/register/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'company',
          name: formData.name,
          ruc: formData.ruc,
          dni: formData.ruc.substring(0, 8),
          location: formData.address || 'Lima, Perú',
          related_id: companyData.company_id
        })
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        if (errorText.toLowerCase().includes('exist') || userRes.status === 409 || userRes.status === 400) {
          throw new Error('Este correo corporativo ya está registrado. Intenta iniciar sesión.')
        }
        throw new Error(`Error en usuario: ${errorText}`);
      }
      const registrationResult = await userRes.json();

      // Guardar datos en el estado y localStorage
      const contextUserData = {
        id: registrationResult.id?.toString(),
        name: formData.name,
        email: formData.email,
        userType: 'company' as const,
        isGoogleAuth: false,
        picture: '',
        profileData: {
          ruc: formData.ruc,
          company_id: companyData.company_id,
          user_id: registrationResult.id,
          related_id: companyData.company_id,
          location: formData.address || 'Lima, Perú',
          industry: 'Tecnología'
        }
      };

      setUser(contextUserData);
      localStorage.setItem('authToken', registrationResult.access_token || 'temp_token');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', 'company');
      localStorage.setItem('userId', registrationResult.id?.toString());
      localStorage.setItem('companyId', companyData.company_id?.toString());

      setLocation('/company-dashboard');

    } catch (error: any) {
      setApiError(error.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = (hasError?: string) =>
    `bg-transparent text-gray-900 focus:border-[#2D4A9F] focus:ring-[#2D4A9F] ${hasError ? 'border-red-300' : 'border-gray-200'}`

  return (
    <AuthLayout
      title="Registrar Empresa"
      subtitle="Comienza a reclutar talento con IA"
      onBack={() => setLocation('/login?type=company')}
      maxWidth="max-w-[480px]"
    >
      <AuthCard className="text-gray-900">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <ErrorBanner message={apiError} />

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-800">Nombre de la Empresa *</Label>
            <Input
              id="name"
              placeholder="Tech Solutions SAC"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={inputClass(fieldErrors.name)}
            />
            <FieldError message={fieldErrors.name} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ruc" className="text-sm font-semibold text-gray-800">RUC *</Label>
            <Input
              id="ruc"
              placeholder="20123456789"
              maxLength={11}
              inputMode="numeric"
              value={formData.ruc}
              onChange={(e) => setFormData(prev => ({ ...prev, ruc: e.target.value.replace(/\D/g, '') }))}
              className={inputClass(fieldErrors.ruc)}
            />
            <FieldError message={fieldErrors.ruc} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Correo Corporativo *</Label>
            <Input
              id="email"
              type="email"
              placeholder="reclutamiento@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              autoComplete="email"
              className={inputClass(fieldErrors.email)}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-800">Teléfono <span className="font-normal text-gray-400">(opcional)</span></Label>
            <Input
              id="phone"
              placeholder="+51 987 654 321"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={inputClass()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website" className="text-sm font-semibold text-gray-800">Sitio Web <span className="font-normal text-gray-400">(opcional)</span></Label>
            <Input
              id="website"
              placeholder="https://www.empresa.com"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className={inputClass()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-semibold text-gray-800">Dirección <span className="font-normal text-gray-400">(opcional)</span></Label>
            <Input
              id="address"
              placeholder="Av. Principal 123, Lima"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={inputClass()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Contraseña *</Label>
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
              placeholder="Crea una contraseña segura"
              hasError={!!fieldErrors.password}
              autoComplete="new-password"
            />
            <FieldError message={fieldErrors.password} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">Confirmar Contraseña *</Label>
            <PasswordInput
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
              placeholder="Repite tu contraseña"
              hasError={!!fieldErrors.confirmPassword}
              autoComplete="new-password"
            />
            <FieldError message={fieldErrors.confirmPassword} />
          </div>

          <div className="pt-2">
            <div className="flex items-start space-x-3 mb-5">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                className="w-4 h-4 mt-0.5 text-[#6366F1] bg-gray-100 border-gray-300 rounded focus:ring-[#4F6CDB]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los <Link href="/terminos-servicio" className="text-[#6366F1] hover:underline">Términos y Condiciones para empleadores</Link> y la <Link href="/politica-privacidad" className="text-[#6366F1] hover:underline">Política de Privacidad</Link>, incluyendo el tratamiento de datos de postulantes y el uso de IA
              </label>
            </div>
            <FieldError message={fieldErrors.terms} />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E3A8A] hover:bg-[#27479E] text-white py-6 rounded-lg font-medium text-base transition-colors disabled:opacity-70"
            >
              {isLoading
                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</span>
                : 'Registrar Empresa'}
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setLocation('/login?type=company')}
              className="text-[#6366F1] hover:underline text-sm font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
