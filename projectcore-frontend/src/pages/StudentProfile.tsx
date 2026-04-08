import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  Clock, 
  Monitor,
  Edit,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { useLocation } from 'wouter';

const careers = [
  "Ingeniería de Sistemas", "Administración", "Contabilidad", "Marketing", "Psicología",
  "Derecho", "Medicina", "Enfermería", "Arquitectura", "Diseño Gráfico",
  "Comunicaciones", "Economía", "Ingeniería Civil", "Ingeniería Industrial",
  "Ingeniería Electrónica", "Turismo", "Gastronomía", "Educación"
];

const cycles = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const availabilityOptions = Array.from({ length: 40 }, (_, i) => `${i + 1}`);

export default function StudentProfile() {
  const { user, updateProfile } = useUser();
  const [location, setLocation] = useLocation();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    career: '',
    academic_cycle: '',
    location: '',
    weekly_availability: '',
    preferred_modality: '',
    main_motivation: '',
    description: ''
  });

  const profileData = user?.profileData || {};

  useEffect(() => {
    // Load profile data when component mounts or user changes
    console.log('StudentProfile - Loading profile data:', profileData);
    setFormData({
      career: profileData.career || '',
      academic_cycle: profileData.academic_cycle?.toString() || '',
      location: profileData.location || '',
      weekly_availability: profileData.weekly_availability?.toString() || '',
      preferred_modality: profileData.preferred_modality?.toString() || '',
      main_motivation: profileData.main_motivation || '',
      description: profileData.description || ''
    });
  }, [user, profileData]);

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setFormData({
      career: profileData.career || '',
      academic_cycle: profileData.academic_cycle?.toString() || '',
      location: profileData.location || '',
      weekly_availability: profileData.weekly_availability?.toString() || '',
      preferred_modality: profileData.preferred_modality?.toString() || '',
      main_motivation: profileData.main_motivation || '',
      description: profileData.description || ''
    });
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      await updateProfile(formData);
      setEditingSection(null);
      // Show success message with better UX
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.textContent = '✅ Perfil actualizado correctamente';
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = '❌ Error al actualizar el perfil';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setSaving(false);
    }
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

  const getModalityText = (modality: number) => {
    switch (modality) {
      case 1: return 'Presencial';
      case 2: return 'Remoto';
      case 3: return 'Híbrido';
      default: return 'No especificado';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Aura Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation('/student-dashboard')}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/logoCircular.png" 
                  alt="ProjectCore" 
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="text-2xl font-bold text-white">Potencia tu Perfil</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{user?.name || 'Usuario'}</CardTitle>
                  <p className="text-gray-300">{user?.email}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Information */}
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
                          {cycles.map((cycle) => (
                            <SelectItem key={cycle} value={cycle}>{cycle}° ciclo</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleSave('academic')} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-300 text-sm">Carrera</p>
                      <p className="text-white font-medium">{profileData.career || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Ciclo Académico</p>
                      <p className="text-white font-medium">{profileData.academic_cycle ? `${profileData.academic_cycle}° ciclo` : 'No especificado'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Information */}
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
                    Información Personal
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('personal')}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === 'personal' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location" className="text-white">Ubicación</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Lima, Perú"
                      />
                    </div>
                    <div>
                      <Label htmlFor="main_motivation" className="text-white">Motivación Principal</Label>
                      <Input
                        id="main_motivation"
                        value={formData.main_motivation}
                        onChange={(e) => updateFormData('main_motivation', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Desarrollo profesional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Cuéntanos sobre ti..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleSave('personal')} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-300 text-sm">Ubicación</p>
                      <p className="text-white font-medium">{profileData.location || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Motivación Principal</p>
                      <p className="text-white font-medium">{profileData.main_motivation || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Descripción</p>
                      <p className="text-white font-medium">{profileData.description || 'No especificado'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Work Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Preferencias Laborales
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('work')}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === 'work' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="weekly_availability" className="text-white">Disponibilidad Semanal (horas)</Label>
                      <Select value={formData.weekly_availability} onValueChange={(value) => updateFormData('weekly_availability', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona las horas" />
                        </SelectTrigger>
                        <SelectContent>
                          {availabilityOptions.map((hours) => (
                            <SelectItem key={hours} value={hours}>{hours} horas</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preferred_modality" className="text-white">Modalidad Preferida</Label>
                      <Select value={formData.preferred_modality} onValueChange={(value) => updateFormData('preferred_modality', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona la modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Presencial</SelectItem>
                          <SelectItem value="2">Remoto</SelectItem>
                          <SelectItem value="3">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleSave('work')} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-300 text-sm">Disponibilidad Semanal</p>
                      <p className="text-white font-medium">{profileData.weekly_availability ? `${profileData.weekly_availability} horas` : 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Modalidad Preferida</p>
                      <p className="text-white font-medium">{getModalityText(profileData.preferred_modality)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300 text-sm">Nombre</p>
                    <p className="text-white font-medium">{user?.name || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Email</p>
                    <p className="text-white font-medium">{user?.email || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">DNI</p>
                    <p className="text-white font-medium">{profileData.dni || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Tipo de Usuario</p>
                    <p className="text-white font-medium">Estudiante</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
