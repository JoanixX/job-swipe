import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Copy, 
  Send, 
  Users, 
  Building, 
  Link, 
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { userRegistrationService, UserRegistrationTemplate } from '@/services/user-registration';

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<UserRegistrationTemplate[]>([]);
  const [newRegistration, setNewRegistration] = useState<Partial<UserRegistrationTemplate>>({
    type: 'student',
    customization: {
      primaryColor: '#FF258D',
      secondaryColor: '#390062',
      welcomeMessage: ''
    }
  });
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await userRegistrationService.getRegistrationAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleCreateRegistration = async () => {
    setIsLoading(true);
    try {
      const link = await userRegistrationService.generateRegistrationLink(newRegistration);
      setGeneratedLinks(prev => [...prev, link]);
      
      // Reset form
      setNewRegistration({
        type: 'student',
        customization: {
          primaryColor: '#FF258D',
          secondaryColor: '#390062',
          welcomeMessage: ''
        }
      });
    } catch (error) {
      console.error('Error creating registration:', error);
      alert('Error al crear el registro personalizado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    const bulkData = [
      userRegistrationService.getStudentTemplate({
        name: 'María González',
        email: 'maria.gonzalez@unmsm.edu.pe',
        university: 'Universidad Nacional Mayor de San Marcos',
        career: 'Ingeniería de Sistemas'
      }),
      userRegistrationService.getStudentTemplate({
        name: 'Carlos Mendoza',
        email: 'carlos.mendoza@pucp.edu.pe',
        university: 'Pontificia Universidad Católica del Perú',
        career: 'Administración de Empresas'
      }),
      userRegistrationService.getCompanyTemplate({
        name: 'Jorge Arauco',
        email: 'jorge@techcorp.com',
        company_name: 'TechCorp Solutions',
        position: 'Director de RRHH'
      })
    ];

    setIsLoading(true);
    try {
      const links = await userRegistrationService.createBulkRegistrations(bulkData);
      setGeneratedLinks(prev => [...prev, ...links]);
    } catch (error) {
      console.error('Error creating bulk registrations:', error);
      alert('Error al crear registros masivos');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Enlace copiado al portapapeles');
  };

  const sendInvitation = async (email: string, template: Partial<UserRegistrationTemplate>) => {
    try {
      await userRegistrationService.sendRegistrationInvitation(email, template);
      alert('Invitación enviada exitosamente');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Error al enviar la invitación');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestión de Registros Dinámicos
          </h1>
          <p className="text-gray-300">
            Crea registros personalizados para usuarios específicos con plantillas únicas
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1a0b3d] border-white/10">
            <TabsTrigger value="create" className="data-[state=active]:bg-[#FF258D]">
              Crear Registro
            </TabsTrigger>
            <TabsTrigger value="bulk" className="data-[state=active]:bg-[#FF258D]">
              Registro Masivo
            </TabsTrigger>
            <TabsTrigger value="links" className="data-[state=active]:bg-[#FF258D]">
              Enlaces Generados
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#FF258D]">
              Analíticas
            </TabsTrigger>
          </TabsList>

          {/* Create Individual Registration */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#FF258D]" />
                  Crear Registro Personalizado
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configura un registro único para un usuario específico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Tipo de Usuario</Label>
                    <Select 
                      value={newRegistration.type} 
                      onValueChange={(value: 'student' | 'company') => 
                        setNewRegistration(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Estudiante</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Nombre</Label>
                    <Input
                      value={newRegistration.name || ''}
                      onChange={(e) => setNewRegistration(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Nombre del usuario"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input
                      type="email"
                      value={newRegistration.email || ''}
                      onChange={(e) => setNewRegistration(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Ubicación</Label>
                    <Input
                      value={newRegistration.location || ''}
                      onChange={(e) => setNewRegistration(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Lima, Perú"
                    />
                  </div>
                </div>

                {newRegistration.type === 'student' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Universidad</Label>
                      <Input
                        value={newRegistration.university || ''}
                        onChange={(e) => setNewRegistration(prev => ({ ...prev, university: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Universidad Nacional..."
                      />
                    </div>
                    <div>
                      <Label className="text-white">Carrera</Label>
                      <Input
                        value={newRegistration.career || ''}
                        onChange={(e) => setNewRegistration(prev => ({ ...prev, career: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Ingeniería de Sistemas"
                      />
                    </div>
                  </div>
                )}

                {newRegistration.type === 'company' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Empresa</Label>
                      <Input
                        value={newRegistration.company_name || ''}
                        onChange={(e) => setNewRegistration(prev => ({ ...prev, company_name: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="TechCorp Solutions"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Cargo</Label>
                      <Input
                        value={newRegistration.position || ''}
                        onChange={(e) => setNewRegistration(prev => ({ ...prev, position: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white"
                        placeholder="Director de RRHH"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-white">Mensaje de Bienvenida</Label>
                  <Textarea
                    value={newRegistration.customization?.welcomeMessage || ''}
                    onChange={(e) => setNewRegistration(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization!,
                        welcomeMessage: e.target.value
                      }
                    }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="¡Bienvenido! Completa tu perfil personalizado..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Color Primario</Label>
                    <Input
                      type="color"
                      value={newRegistration.customization?.primaryColor || '#FF258D'}
                      onChange={(e) => setNewRegistration(prev => ({
                        ...prev,
                        customization: {
                          ...prev.customization!,
                          primaryColor: e.target.value
                        }
                      }))}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Color Secundario</Label>
                    <Input
                      type="color"
                      value={newRegistration.customization?.secondaryColor || '#390062'}
                      onChange={(e) => setNewRegistration(prev => ({
                        ...prev,
                        customization: {
                          ...prev.customization!,
                          secondaryColor: e.target.value
                        }
                      }))}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCreateRegistration}
                    disabled={isLoading || !newRegistration.name || !newRegistration.email}
                    className="bg-[#FF258D] hover:bg-[#FF258D]/90 text-white"
                  >
                    {isLoading ? 'Creando...' : 'Crear Registro Personalizado'}
                  </Button>
                  
                  {newRegistration.email && (
                    <Button
                      onClick={() => sendInvitation(newRegistration.email!, newRegistration)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Invitación
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Registration */}
          <TabsContent value="bulk" className="space-y-6">
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF258D]" />
                  Registro Masivo
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Crea múltiples registros personalizados de una vez
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => {
                      const template = userRegistrationService.getUniversityTemplate('Universidad Nacional Mayor de San Marcos');
                      setGeneratedLinks(prev => [...prev, `/register/unmsm-${Date.now()}`]);
                    }}
                    className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
                  >
                    Plantilla UNMSM
                  </Button>
                  <Button
                    onClick={() => {
                      const template = userRegistrationService.getUniversityTemplate('Pontificia Universidad Católica del Perú');
                      setGeneratedLinks(prev => [...prev, `/register/pucp-${Date.now()}`]);
                    }}
                    className="bg-[#003366] hover:bg-[#003366]/90 text-white"
                  >
                    Plantilla PUCP
                  </Button>
                  <Button
                    onClick={() => {
                      const template = userRegistrationService.getCompanyBrandTemplate('TechCorp Solutions');
                      setGeneratedLinks(prev => [...prev, `/register/techcorp-${Date.now()}`]);
                    }}
                    className="bg-[#390062] hover:bg-[#390062]/90 text-white"
                  >
                    Plantilla Empresa
                  </Button>
                </div>

                <Button
                  onClick={handleBulkCreate}
                  disabled={isLoading}
                  className="w-full bg-[#FF258D] hover:bg-[#FF258D]/90 text-white"
                >
                  {isLoading ? 'Creando...' : 'Crear Registros de Ejemplo'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generated Links */}
          <TabsContent value="links" className="space-y-6">
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Link className="w-5 h-5 text-[#FF258D]" />
                  Enlaces de Registro Generados
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enlaces únicos para registro personalizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedLinks.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No hay enlaces generados aún
                  </p>
                ) : (
                  <div className="space-y-3">
                    {generatedLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white font-mono text-sm truncate flex-1 mr-4">
                          {link}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(link)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(link, '_blank')}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Registros Creados</p>
                      <p className="text-2xl font-bold text-white">{generatedLinks.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#FF258D]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Tasa de Conversión</p>
                      <p className="text-2xl font-bold text-white">85%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#390062]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Registros Activos</p>
                      <p className="text-2xl font-bold text-white">{Math.floor(generatedLinks.length * 0.85)}</p>
                    </div>
                    <Building className="w-8 h-8 text-[#FF258D]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
