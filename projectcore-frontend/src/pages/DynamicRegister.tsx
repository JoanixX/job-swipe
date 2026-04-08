import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  GraduationCap, 
  Briefcase,
  Camera,
  Check,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Logo from '@/components/Logo';

interface UserTemplate {
  id: string;
  type: 'student' | 'company';
  name: string;
  email: string;
  phone?: string;
  university?: string;
  career?: string;
  semester?: number;
  company_name?: string;
  position?: string;
  industry?: string;
  location: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    welcomeMessage: string;
    companyLogo?: string;
  };
}

// Mock data - In real app, this would come from URL params or API
const getUserTemplate = (userId: string): UserTemplate | null => {
  const templates: Record<string, UserTemplate> = {
    'student-001': {
      id: 'student-001',
      type: 'student',
      name: 'María González',
      email: 'maria.gonzalez@unmsm.edu.pe',
      phone: '+51 987 654 321',
      university: 'Universidad Nacional Mayor de San Marcos',
      career: 'Ingeniería de Sistemas',
      semester: 8,
      location: 'Lima, Perú',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      bio: 'Estudiante apasionada por la tecnología y el desarrollo de software.',
      skills: ['JavaScript', 'React', 'Python', 'SQL'],
      interests: ['Desarrollo Web', 'Inteligencia Artificial', 'UX/UI'],
      customization: {
        primaryColor: '#FF258D',
        secondaryColor: '#390062',
        welcomeMessage: '¡Hola María! Completa tu perfil para encontrar las mejores oportunidades de prácticas.'
      }
    },
    'company-001': {
      id: 'company-001',
      type: 'company',
      name: 'Jorge Arauco',
      email: 'jorge@techcorp.com',
      phone: '+51 999 888 777',
      company_name: 'TechCorp Solutions',
      position: 'Director de Recursos Humanos',
      industry: 'Tecnología',
      location: 'San Isidro, Lima',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jorge',
      bio: 'Líder en recursos humanos enfocado en encontrar y desarrollar talento joven.',
      customization: {
        primaryColor: '#390062',
        secondaryColor: '#FF258D',
        welcomeMessage: '¡Bienvenido Jorge! Configura tu perfil empresarial para conectar con el mejor talento estudiantil.'
      }
    },
    'student-002': {
      id: 'student-002',
      type: 'student',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@pucp.edu.pe',
      university: 'Pontificia Universidad Católica del Perú',
      career: 'Administración de Empresas',
      semester: 6,
      location: 'Miraflores, Lima',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      skills: ['Excel', 'PowerBI', 'Marketing Digital'],
      interests: ['Finanzas', 'Marketing', 'Emprendimiento'],
      customization: {
        primaryColor: '#4F46E5',
        secondaryColor: '#06B6D4',
        welcomeMessage: '¡Hola Carlos! Tu perfil está casi listo. Completa los datos para acceder a oportunidades exclusivas.'
      }
    },
    'unmsm-demo': {
      id: 'unmsm-demo',
      type: 'student',
      name: 'Ana Quispe',
      email: 'ana.quispe@unmsm.edu.pe',
      university: 'Universidad Nacional Mayor de San Marcos',
      career: 'Ingeniería Industrial',
      semester: 7,
      location: 'Lima, Perú',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      skills: ['Lean Manufacturing', 'Six Sigma', 'AutoCAD'],
      interests: ['Optimización de Procesos', 'Calidad', 'Logística'],
      customization: {
        primaryColor: '#FFD700',
        secondaryColor: '#8B0000',
        welcomeMessage: '¡Bienvenida estudiante de San Marcos! Tu universidad te ha invitado a ProjectCore.'
      }
    },
    'pucp-demo': {
      id: 'pucp-demo',
      type: 'student',
      name: 'Diego Vargas',
      email: 'diego.vargas@pucp.edu.pe',
      university: 'Pontificia Universidad Católica del Perú',
      career: 'Economía',
      semester: 9,
      location: 'San Miguel, Lima',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
      skills: ['Econometría', 'R', 'Stata', 'Python'],
      interests: ['Análisis Económico', 'Finanzas', 'Data Science'],
      customization: {
        primaryColor: '#003366',
        secondaryColor: '#FFD700',
        welcomeMessage: '¡Hola Diego! La PUCP y ProjectCore te dan la bienvenida a nuevas oportunidades.'
      }
    }
  };

  return templates[userId] || null;
};

export default function DynamicRegister() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/register/:userId');
  const [userTemplate, setUserTemplate] = useState<UserTemplate | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params?.userId) {
      const template = getUserTemplate(params.userId);
      if (template) {
        setUserTemplate(template);
        // Pre-fill form with template data
        setFormData({
          name: template.name,
          email: template.email,
          phone: template.phone || '',
          university: template.university || '',
          career: template.career || '',
          semester: template.semester || '',
          company_name: template.company_name || '',
          position: template.position || '',
          industry: template.industry || '',
          location: template.location,
          bio: template.bio || '',
          skills: template.skills || [],
          interests: template.interests || []
        });
      } else {
        // Redirect to general registration if user template not found
        setLocation('/register');
      }
    }
  }, [params?.userId, setLocation]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect based on user type
      if (userTemplate?.type === 'student') {
        setLocation('/student-dashboard');
      } else {
        setLocation('/company-dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userTemplate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando tu perfil personalizado...</p>
        </div>
      </div>
    );
  }

  const { customization } = userTemplate;

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${customization.primaryColor}20 0%, ${customization.secondaryColor}20 100%), linear-gradient(to br, #0a0520, #1a0b3d, #2d0a4a)`
      }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ backgroundColor: customization.primaryColor }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"
          style={{ backgroundColor: customization.secondaryColor }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => setLocation('/register')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold">ProjectCore</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mx-auto"
        >
          {/* Personalized Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Avatar className="w-20 h-20 border-4" style={{ borderColor: customization.primaryColor }}>
                <AvatarImage src={userTemplate.avatar} />
                <AvatarFallback style={{ backgroundColor: customization.primaryColor }}>
                  {userTemplate.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {customization.welcomeMessage}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" style={{ color: customization.primaryColor }} />
              <Badge 
                variant="outline" 
                className="text-white border-white/20"
                style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
              >
                {userTemplate.type === 'student' ? 'Perfil Estudiantil' : 'Perfil Empresarial'}
              </Badge>
            </div>
          </div>

          {/* Registration Form */}
          <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" style={{ color: customization.primaryColor }} />
                Completa tu Perfil
              </CardTitle>
              <CardDescription className="text-gray-300">
                Algunos datos ya están pre-cargados. Revisa y completa la información faltante.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-white">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="+51 999 999 999"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-white">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Student-specific fields */}
              {userTemplate.type === 'student' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="university" className="text-white">Universidad</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="career" className="text-white">Carrera</Label>
                      <Input
                        id="career"
                        value={formData.career}
                        onChange={(e) => handleInputChange('career', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="semester" className="text-white">Semestre Actual</Label>
                    <Select value={formData.semester?.toString()} onValueChange={(value) => handleInputChange('semester', parseInt(value))}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecciona tu semestre" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>{sem}° Semestre</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Company-specific fields */}
              {userTemplate.type === 'company' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name" className="text-white">Nombre de la Empresa</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position" className="text-white">Cargo</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="industry" className="text-white">Industria</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </>
              )}

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-white">Descripción Personal</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Cuéntanos un poco sobre ti..."
                  rows={3}
                />
              </div>

              {/* Skills/Interests */}
              <div>
                <Label className="text-white">
                  {userTemplate.type === 'student' ? 'Habilidades' : 'Áreas de Interés'}
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.skills || formData.interests || []).map((item, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-white border-white/20"
                      style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 font-semibold"
                style={{ 
                  backgroundColor: customization.primaryColor,
                  color: 'white'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completando registro...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Completar Registro
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Personalized Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Tu perfil está siendo configurado especialmente para{' '}
              <span style={{ color: customization.primaryColor }} className="font-semibold">
                {userTemplate.type === 'student' ? userTemplate.university : userTemplate.company_name}
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
