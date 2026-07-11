import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, ArrowLeft } from 'lucide-react'
import { useUser } from '@/lib/user-context'

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
    address: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.ruc || !formData.email || !formData.password || !formData.confirmPassword) {
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

    try {
      setIsLoading(true)
      
      const API_URL = import.meta.env.PROD 
        ? 'http://localhost:8000/api'
        : '/api';
        
      console.log('Registrando empresa...');

      // 1. Crear la empresa base
      const companyRes = await fetch(`${API_URL}/register/company`, {
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
      const userRes = await fetch(`${API_URL}/register/user`, {
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
        throw new Error(`Error en usuario: ${errorText}`);
      }
      const registrationResult = await userRes.json();

      console.log('Registro exitoso:', registrationResult);

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

      alert('¡Empresa registrada exitosamente!');
      setLocation('/company-dashboard');

    } catch (error: any) {
      console.error('Error al registrar:', error);
      alert(`Error al registrar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D4A9F] to-[#4F6CDB] text-white flex flex-col relative font-sans">
      
      {/* Botón Volver */}
      <div className="p-6">
        <button 
          onClick={() => setLocation('/login?type=company')}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Registrar Empresa</h1>
          <p className="text-white/80">Comienza a reclutar talento con IA</p>
        </div>

        {/* Formulario */}
        <Card className="w-full max-w-[480px] bg-white text-gray-900 border-none shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-800">Nombre de la Empresa</Label>
                <Input
                  id="name"
                  placeholder="Tech Solutions SAC"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ruc" className="text-sm font-semibold text-gray-800">RUC</Label>
                <Input
                  id="ruc"
                  placeholder="20123456789"
                  maxLength={11}
                  value={formData.ruc}
                  onChange={(e) => setFormData(prev => ({ ...prev, ruc: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Correo Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="reclutamiento@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-800">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+51 987 654 321"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm font-semibold text-gray-800">Sitio Web</Label>
                <Input
                  id="website"
                  placeholder="https://www.empresa.com"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-800">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Av. Principal 123, Lima"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crea una contraseña segura"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-transparent border-gray-200 focus:border-[#2D4A9F] focus:ring-[#2D4A9F]"
                  required
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600 text-center mb-5">
                  Acepto los términos legales sobre <a href="#" className="text-[#4F6CDB] hover:underline">protección de datos</a> y <a href="#" className="text-[#4F6CDB] hover:underline">uso de IA</a>
                </p>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-6 rounded-xl font-medium text-base transition-colors"
                >
                  {isLoading ? 'Registrando...' : 'Registrar Empresa'}
                </Button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setLocation('/login')}
                  className="text-[#4F6CDB] hover:underline text-sm font-medium"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}