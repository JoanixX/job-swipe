import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Building, 
  GraduationCap, 
  ExternalLink,
  Sparkles,
  Users,
  Settings
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function RegistrationDemo() {
  const [, setLocation] = useLocation();

  const demoUsers = [
    {
      id: 'student-001',
      name: 'María González',
      type: 'student',
      university: 'Universidad Nacional Mayor de San Marcos',
      career: 'Ingeniería de Sistemas',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      primaryColor: '#FF258D',
      description: 'Registro personalizado para estudiante de UNMSM con datos pre-cargados'
    },
    {
      id: 'company-001',
      name: 'Jorge Arauco',
      type: 'company',
      company: 'TechCorp Solutions',
      position: 'Director de RRHH',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jorge',
      primaryColor: '#390062',
      description: 'Registro empresarial personalizado con branding corporativo'
    },
    {
      id: 'student-002',
      name: 'Carlos Mendoza',
      type: 'student',
      university: 'Pontificia Universidad Católica del Perú',
      career: 'Administración de Empresas',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      primaryColor: '#4F46E5',
      description: 'Perfil estudiantil PUCP con colores institucionales'
    },
    {
      id: 'unmsm-demo',
      name: 'Ana Quispe',
      type: 'student',
      university: 'Universidad Nacional Mayor de San Marcos',
      career: 'Ingeniería Industrial',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      primaryColor: '#FFD700',
      description: 'Plantilla universitaria con colores San Marcos'
    },
    {
      id: 'pucp-demo',
      name: 'Diego Vargas',
      type: 'student',
      university: 'Pontificia Universidad Católica del Perú',
      career: 'Economía',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
      primaryColor: '#003366',
      description: 'Plantilla PUCP con identidad institucional'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setLocation('/')}
          >
            ← Volver al Inicio
          </Button>
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold">ProjectCore</span>
          </div>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => setLocation('/admin/registrations')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF258D] to-[#390062] rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-[#FF258D] to-[#390062] p-4 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sistema de Registro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF258D] to-[#390062]">Dinámico</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Cada usuario recibe una página de registro personalizada con sus datos únicos, 
            colores institucionales y mensajes personalizados.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="text-white border-white/20 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Registro Personalizado
            </Badge>
            <Badge variant="outline" className="text-white border-white/20 px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              Branding Institucional
            </Badge>
            <Badge variant="outline" className="text-white border-white/20 px-4 py-2">
              <GraduationCap className="w-4 h-4 mr-2" />
              Datos Pre-cargados
            </Badge>
          </div>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 border-2" style={{ borderColor: user.primaryColor }}>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback style={{ backgroundColor: user.primaryColor }}>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white text-lg">{user.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-white/20"
                        style={{ borderColor: user.primaryColor, color: user.primaryColor }}
                      >
                        {user.type === 'student' ? 'Estudiante' : 'Empresa'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardDescription className="text-gray-300 text-sm">
                    {user.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {user.type === 'student' ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <GraduationCap className="w-4 h-4" style={{ color: user.primaryColor }} />
                          <span>{user.university}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <User className="w-4 h-4" style={{ color: user.primaryColor }} />
                          <span>{user.career}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Building className="w-4 h-4" style={{ color: user.primaryColor }} />
                          <span>{user.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <User className="w-4 h-4" style={{ color: user.primaryColor }} />
                          <span>{user.position}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => setLocation(`/register/${user.id}`)}
                    className="w-full group-hover:scale-105 transition-transform duration-200"
                    style={{ backgroundColor: user.primaryColor }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Registro Personalizado
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">
                Características del Sistema Dinámico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#FF258D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Datos Pre-cargados</h3>
                  <p className="text-gray-300 text-sm">
                    Información del usuario ya completada según su perfil institucional
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#390062] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Personalización Visual</h3>
                  <p className="text-gray-300 text-sm">
                    Colores, logos y mensajes adaptados a cada universidad o empresa
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#4F46E5] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Branding Institucional</h3>
                  <p className="text-gray-300 text-sm">
                    Integración con la identidad visual de universidades y empresas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Listo para crear registros personalizados?
          </h2>
          <p className="text-gray-300 mb-6">
            Accede al panel de administración para gestionar registros dinámicos
          </p>
          <Button
            onClick={() => setLocation('/admin/registrations')}
            className="bg-gradient-to-r from-[#FF258D] to-[#390062] hover:from-[#FF258D]/90 hover:to-[#390062]/90 text-white px-8 py-3"
          >
            <Settings className="w-5 h-5 mr-2" />
            Ir al Panel de Administración
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
