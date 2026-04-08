import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  Briefcase, 
  MapPin,
  GraduationCap,
  LogOut,
  Calendar,
  Clock,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useUser } from '@/lib/user-context';

const careers = [
  "Ingeniería de Sistemas", "Administración", "Contabilidad", "Marketing", "Psicología",
  "Derecho", "Medicina", "Enfermería", "Arquitectura", "Diseño Gráfico",
  "Comunicaciones", "Economía", "Ingeniería Civil", "Ingeniería Industrial",
  "Educación", "Turismo", "Gastronomía", "Otra"
];

const peruvianCities = [
  "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco",
  "Chimbote", "Huancayo", "Tacna", "Ica", "Cajamarca", "Pucallpa", "Sullana"
];

const modalities = ["Presencial", "Remoto", "Híbrido"];

const motivations = [
  "Ganar experiencia laboral",
  "Aplicar conocimientos teóricos", 
  "Explorar diferentes industrias",
  "Desarrollar habilidades profesionales",
  "Construir una red de contactos",
  "Contribuir a proyectos reales"
];

export default function SimpleStudentDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, updateProfile } = useUser();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    career: '',
    academic_cycle: '',
    location: '',
    weekly_availability: '',
    preferred_modality: '',
    main_motivation: '',
    description: ''
  });

  useEffect(() => {
    if (!user) {
      setLocation('/register');
      return;
    }

    if (user.userType !== 'student') {
      setLocation('/company-dashboard');
      return;
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  if (user.userType !== 'student') {
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const profileData = user.profileData || {};

  // Calculate profile completion percentage
  const requiredFields = ['career', 'academic_cycle', 'location', 'weekly_availability', 'preferred_modality', 'main_motivation'];
  const completedFields = requiredFields.filter(field => profileData[field]);
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setFormData({
      career: profileData.career || '',
      academic_cycle: profileData.academic_cycle || '',
      location: profileData.location || '',
      weekly_availability: profileData.weekly_availability || '',
      preferred_modality: profileData.preferred_modality || '',
      main_motivation: profileData.main_motivation || '',
      description: profileData.description || ''
    });
  };

  const handleSave = (section: string) => {
    updateProfile(formData);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({
      career: '',
      academic_cycle: '',
      location: '',
      weekly_availability: '',
      preferred_modality: '',
      main_motivation: '',
      description: ''
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Dashboard Estudiante</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">¡Bienvenido, {user.name}!</CardTitle>
                    <CardDescription className="text-gray-300">
                      {user.email}
                      {user.isGoogleAuth && (
                        <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30">
                          Cuenta Google
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Profile Completion Indicator */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    {completionPercentage === 100 ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-sm font-medium">
                      Perfil {completionPercentage}% completo
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="w-32" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Academic Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Información Académica
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('academic')}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === 'academic' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="career" className="text-white">Carrera</Label>
                      <Select value={formData.career} onValueChange={(value) => updateFormData('career', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona tu carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          {careers.map((career) => (
                            <SelectItem key={career} value={career}>{career}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="academic_cycle" className="text-white">Ciclo Académico</Label>
                      <Select value={formData.academic_cycle} onValueChange={(value) => updateFormData('academic_cycle', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona tu ciclo" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}° ciclo</SelectItem>
                          ))}
                          <SelectItem value="0">Ya terminé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleSave('academic')} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="border-white/20 text-white hover:bg-white/10">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Carrera:</strong> 
                      <span className={!profileData.career ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.career || 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                    <p>
                      <strong>Ciclo:</strong> 
                      <span className={!profileData.academic_cycle ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.academic_cycle ? `${profileData.academic_cycle}° ciclo` : 'No especificado - Haz clic en editar'}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Location and Availability Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Ubicación y Disponibilidad
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('location')}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === 'location' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location" className="text-white">Ubicación</Label>
                      <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona tu ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          {peruvianCities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weekly_availability" className="text-white">Disponibilidad (horas/semana)</Label>
                      <Input
                        type="number"
                        value={formData.weekly_availability}
                        onChange={(e) => updateFormData('weekly_availability', e.target.value)}
                        placeholder="Ej: 20"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred_modality" className="text-white">Modalidad Preferida</Label>
                      <Select value={formData.preferred_modality} onValueChange={(value) => updateFormData('preferred_modality', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {modalities.map((modality) => (
                            <SelectItem key={modality} value={modality}>{modality}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleSave('location')} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="border-white/20 text-white hover:bg-white/10">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Ubicación:</strong> 
                      <span className={!profileData.location ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.location || 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                    <p>
                      <strong>Disponibilidad:</strong> 
                      <span className={!profileData.weekly_availability ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.weekly_availability ? `${profileData.weekly_availability} horas/semana` : 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                    <p>
                      <strong>Modalidad:</strong> 
                      <span className={!profileData.preferred_modality ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.preferred_modality || 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivations and Goals Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Motivaciones y Objetivos
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('motivation')}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === 'motivation' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="main_motivation" className="text-white">Motivación Principal</Label>
                      <Select value={formData.main_motivation} onValueChange={(value) => updateFormData('main_motivation', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona tu motivación" />
                        </SelectTrigger>
                        <SelectContent>
                          {motivations.map((motivation) => (
                            <SelectItem key={motivation} value={motivation}>{motivation}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Descripción Personal (Opcional)</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Cuéntanos un poco sobre ti, tus intereses y objetivos..."
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleSave('motivation')} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="border-white/20 text-white hover:bg-white/10">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Motivación principal:</strong> 
                      <span className={!profileData.main_motivation ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.main_motivation || 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                    {profileData.description ? (
                      <div>
                        <strong>Descripción personal:</strong>
                        <p className="text-gray-300 mt-1">{profileData.description}</p>
                      </div>
                    ) : (
                      <p className="text-yellow-400">
                        <strong>Descripción personal:</strong> No agregada - Haz clic en editar para añadir
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle>Próximamente</CardTitle>
              <CardDescription className="text-gray-300">
                Funcionalidades que estarán disponibles pronto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Recomendaciones de Trabajo
                  </h3>
                  <p className="text-sm text-gray-300">
                    IA personalizada para encontrar las mejores oportunidades laborales
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Gestión de Aplicaciones
                  </h3>
                  <p className="text-sm text-gray-300">
                    Seguimiento de tus postulaciones y entrevistas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
