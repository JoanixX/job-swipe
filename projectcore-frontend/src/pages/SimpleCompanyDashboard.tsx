import React, { useState } from 'react';
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
  Building, 
  Users, 
  MapPin,
  Crown,
  LogOut,
  Calendar,
  Briefcase,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { useUser } from '@/lib/user-context';

const industries = [
  "Tecnología", "Finanzas", "Salud", "Educación", "Retail", "Manufactura",
  "Construcción", "Turismo", "Gastronomía", "Marketing", "Consultoría",
  "Logística", "Energía", "Telecomunicaciones", "Otra"
];

const companySizes = [
  "1-10 empleados", "11-50 empleados", "51-200 empleados", 
  "201-500 empleados", "501-1000 empleados", "1000+ empleados"
];

const peruvianCities = [
  "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco",
  "Chimbote", "Huancayo", "Tacna", "Ica", "Cajamarca", "Pucallpa", "Sullana"
];

export default function SimpleCompanyDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, updateProfile } = useUser();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    location: '',
    website: '',
    description: '',
    company_culture: ''
  });

  if (!user) {
    setLocation('/register');
    return null;
  }

  if (user.userType !== 'company') {
    setLocation('/student-dashboard');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const profileData = user.profileData || {};

  // Calculate profile completion percentage
  const requiredFields = ['company_name', 'industry', 'company_size', 'location', 'website', 'description'];
  const completedFields = requiredFields.filter(field => profileData[field]);
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setFormData({
      company_name: profileData.company_name || '',
      industry: profileData.industry || '',
      company_size: profileData.company_size || '',
      location: profileData.location || '',
      website: profileData.website || '',
      description: profileData.description || '',
      company_culture: profileData.company_culture || ''
    });
  };

  const handleSave = (section: string) => {
    updateProfile(formData);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({
      company_name: '',
      industry: '',
      company_size: '',
      location: '',
      website: '',
      description: '',
      company_culture: ''
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'professional': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'enterprise': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Dashboard Empresa</h1>
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
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
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
                    <div className="mt-2">
                      <Badge className={getPlanColor(profileData.subscription_plan)}>
                        Plan {profileData.subscription_plan || 'No especificado'}
                      </Badge>
                    </div>
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

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Company Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Información de la Empresa
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit('company')}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === 'company' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company_name" className="text-white">Nombre de la Empresa</Label>
                      <Input
                        value={formData.company_name}
                        onChange={(e) => updateFormData('company_name', e.target.value)}
                        placeholder="Ej: TechCorp SAC"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry" className="text-white">Industria</Label>
                      <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona industria" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company_size" className="text-white">Tamaño de la Empresa</Label>
                      <Select value={formData.company_size} onValueChange={(value) => updateFormData('company_size', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecciona tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleSave('company')} className="bg-green-600 hover:bg-green-700">
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
                      <strong>Empresa:</strong> 
                      <span className={!profileData.company_name ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.company_name || 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                    <p>
                      <strong>Industria:</strong> 
                      <span className={!profileData.industry ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.industry || 'No especificada - Haz clic en editar'}
                      </span>
                    </p>
                    <p>
                      <strong>Tamaño:</strong> 
                      <span className={!profileData.company_size ? 'text-yellow-400 ml-1' : 'ml-1'}>
                        {profileData.company_size || 'No especificado - Haz clic en editar'}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contacto Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>DNI:</strong> {profileData.contact_dni || 'No especificado'}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{profileData.location || 'No especificada'}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Company Culture */}
        {profileData.company_culture && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Cultura Empresarial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{profileData.company_culture}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                    Gestión de Ofertas Laborales
                  </h3>
                  <p className="text-sm text-gray-300">
                    Crear y gestionar ofertas de trabajo para estudiantes
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Matching con IA
                  </h3>
                  <p className="text-sm text-gray-300">
                    Encuentra los mejores candidatos usando inteligencia artificial
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
