import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserContext, getUserDashboardData } from '@/services/user-context';
import { jobOfferAPI, aiMatchingAPI, catalogAPI } from '@/services/backend-api';
import type { JobOfferResponse, MatchJobStudentResponse } from '@/services/backend-api';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Settings, 
  Bell,
  User,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  CheckCircle,
  X,
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  Star,
  MapPin,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Save,
  LogOut,
  DollarSign,
  AlertCircle,
  Menu,
  Brain,
  Radar,
  Database,
  Target
} from 'lucide-react';

interface PersonalizedCompanyDashboardProps {}

const PersonalizedCompanyDashboard: React.FC<PersonalizedCompanyDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});
  const [jobOffers, setJobOffers] = useState<JobOfferResponse[]>([]);
  const [aiMatches, setAiMatches] = useState<{[key: number]: MatchJobStudentResponse[]}>({});
  const [loadingMatches, setLoadingMatches] = useState<{[key: number]: boolean}>({});
  const [areas, setAreas] = useState<any[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<any[]>([]);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJobForm, setNewJobForm] = useState<any>({
    title: '',
    description: '',
    required_hours: 40,
    approximated_salary: 0,
    duration: 6,
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    area_id: 1,
    experience_id: 1,
    modality: 1
  });

  useEffect(() => {
    loadUserData();
    loadCatalogData();
  }, []);

  useEffect(() => {
    if (userProfile && userProfile.id) {
      loadJobOffers();
    }
  }, [userProfile]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user data from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const companyId = localStorage.getItem('company_id');
      
      console.log('localStorage values:', {
        userEmail,
        userRole,
        userId,
        companyId
      });
      
      if (!userEmail || userRole !== 'company') {
        console.error('No company user found in localStorage');
        setLoading(false);
        return;
      }

      // First try to load mock user context and dashboard data
      const profile = getUserContext(userEmail);
      const dashboard = getUserDashboardData(userEmail);

      if (profile && dashboard) {
        // Use mock data for personalized experience
        setUserProfile(profile);
        setDashboardData(dashboard);
        setProfileForm({ ...profile });
      } else if (userId || companyId) {
        // Create basic company profile from backend data for non-mock users
        const backendProfile = {
          id: userId || companyId, // Use userId first, fallback to companyId
          name: userEmail.split('@')[0] + ' Company', // Use email prefix as company name
          email: userEmail,
          role: 'company',
          industry: 'Tecnología',
          location: 'Perú',
          size: '1-50 empleados',
          website: '',
          contactEmail: userEmail,
          description: 'Empresa registrada en el sistema'
        };
        
        const basicDashboard = {
          stats: {
            activeJobs: 0,
            totalApplications: 0,
            newApplicationsThisWeek: 0,
            qualifiedCandidates: 0,
            qualificationRate: 0,
            hires: 0,
            hireRate: 0,
            newJobsThisWeek: 0
          },
          recentJobs: [],
          topCandidates: [],
          upcomingInterviews: []
        };
        
        setUserProfile(backendProfile);
        setDashboardData(basicDashboard);
        setProfileForm({ ...backendProfile });
      } else {
        console.error('No user data found for email:', userEmail);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogData = async () => {
    try {
      const [areasData, experienceData] = await Promise.all([
        catalogAPI.getAreas(),
        catalogAPI.getExperienceLevels()
      ]);
      setAreas(areasData);
      setExperienceLevels(experienceData);
    } catch (error) {
      console.error('Error loading catalog data:', error);
    }
  };

  const loadJobOffers = async () => {
    try {
      console.log('userProfile.id:', userProfile.id, 'type:', typeof userProfile.id);
      const companyId = parseInt(userProfile.id);
      console.log('parsed companyId:', companyId, 'isNaN:', isNaN(companyId));
      
      if (isNaN(companyId)) {
        console.log('Invalid company ID, skipping job offers load');
        setJobOffers([]);
        return;
      }
      
      const offers = await jobOfferAPI.getByCompany(companyId);
      setJobOffers(offers);
    } catch (error) {
      console.error('Error loading job offers:', error);
      // Keep empty array for new companies or API errors
      setJobOffers([]);
    }
  };

  const loadAIMatches = async (jobOfferId: number) => {
    if (loadingMatches[jobOfferId] || aiMatches[jobOfferId]) {
      return; // Already loading or loaded
    }

    setLoadingMatches(prev => ({ ...prev, [jobOfferId]: true }));
    
    try {
      const matches = await aiMatchingAPI.getBestStudentsForJob(jobOfferId);
      setAiMatches(prev => ({ ...prev, [jobOfferId]: matches }));
    } catch (error) {
      console.error('Error loading AI matches:', error);
      setAiMatches(prev => ({ ...prev, [jobOfferId]: [] }));
    } finally {
      setLoadingMatches(prev => ({ ...prev, [jobOfferId]: false }));
    }
  };

  const handleCreateJob = async () => {
    try {
      console.log('Creating job - userProfile.id:', userProfile.id, 'type:', typeof userProfile.id);
      const companyId = parseInt(userProfile.id);
      console.log('parsed companyId for job creation:', companyId, 'isNaN:', isNaN(companyId));
      
      if (isNaN(companyId)) {
        alert('Error: Esta funcionalidad requiere un ID de empresa válido del backend. Por favor, contacta al administrador.');
        return;
      }

      const jobData = {
        ...newJobForm,
        company_id: companyId,
        required_hours: parseInt(newJobForm.required_hours),
        approximated_salary: parseInt(newJobForm.approximated_salary),
        duration: parseInt(newJobForm.duration),
        area_id: parseInt(newJobForm.area_id),
        experience_id: parseInt(newJobForm.experience_id),
        modality: parseInt(newJobForm.modality)
      };

      await jobOfferAPI.create(jobData);
      
      // Reset form and reload offers
      setNewJobForm({
        title: '',
        description: '',
        required_hours: 40,
        approximated_salary: 0,
        duration: 6,
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        area_id: 1,
        experience_id: 1,
        modality: 1
      });
      setShowCreateJob(false);
      await loadJobOffers();
      
      alert('Oferta de trabajo creada exitosamente');
    } catch (error) {
      console.error('Error creating job offer:', error);
      alert('Error al crear la oferta de trabajo');
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      return;
    }

    try {
      await jobOfferAPI.delete(jobId);
      await loadJobOffers();
      alert('Oferta eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting job offer:', error);
      alert('Error al eliminar la oferta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...profileForm });
    setEditingProfile(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando dashboard personalizado...</div>
      </div>
    );
  }

  if (!userProfile || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No se encontraron datos del usuario</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback className="bg-blue-600">
                {userProfile.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              <p className="text-gray-400 text-sm">{userProfile.industry}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="jobs">Ofertas</TabsTrigger>
            <TabsTrigger value="candidates">Candidatos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Ofertas Activas
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.stats.activeJobs}
                  </div>
                  <p className="text-xs text-gray-400">
                    +{dashboardData.stats.newJobsThisWeek} esta semana
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Aplicaciones
                  </CardTitle>
                  <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.stats.totalApplications}
                  </div>
                  <p className="text-xs text-gray-400">
                    +{dashboardData.stats.newApplicationsThisWeek} esta semana
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Candidatos Calificados
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.stats.qualifiedCandidates}
                  </div>
                  <p className="text-xs text-gray-400">
                    {dashboardData.stats.qualificationRate}% tasa de calificación
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Contrataciones
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {dashboardData.stats.hires}
                  </div>
                  <p className="text-xs text-gray-400">
                    {dashboardData.stats.hireRate}% tasa de contratación
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Job Offers */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Ofertas Recientes</CardTitle>
                <CardDescription className="text-gray-400">
                  Tus últimas ofertas de trabajo publicadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentJobs.map((job: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{job.title}</h3>
                        <p className="text-sm text-gray-400">{job.department} • {job.location}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="bg-blue-600 text-white">
                            {job.applications} aplicaciones
                          </Badge>
                          <Badge variant="outline" className="border-gray-500 text-gray-300">
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Perfil de la Empresa</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gestiona la información de tu empresa
                  </CardDescription>
                </div>
                <Button
                  onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingProfile ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {editingProfile ? 'Guardar' : 'Editar'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {editingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre de la Empresa
                        </label>
                        <input
                          type="text"
                          value={profileForm.name || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Industria
                        </label>
                        <input
                          type="text"
                          value={profileForm.industry || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ubicación
                        </label>
                        <input
                          type="text"
                          value={profileForm.location || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tamaño de la Empresa
                        </label>
                        <input
                          type="text"
                          value={profileForm.size || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, size: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sitio Web
                        </label>
                        <input
                          type="url"
                          value={profileForm.website || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email de Contacto
                        </label>
                        <input
                          type="email"
                          value={profileForm.contactEmail || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Empresa</p>
                          <p className="text-white font-medium">{userProfile.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Industria</p>
                          <p className="text-white font-medium">{userProfile.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-400">Ubicación</p>
                          <p className="text-white font-medium">{userProfile.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Tamaño</p>
                          <p className="text-white font-medium">{userProfile.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Sitio Web</p>
                          <p className="text-white font-medium">{userProfile.website}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-medium">{userProfile.contactEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab - AI Matching Integration */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestión de Ofertas de Trabajo</h2>
              <Button 
                onClick={() => setShowCreateJob(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Oferta
              </Button>
            </div>

            {/* Create Job Modal */}
            {showCreateJob && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Crear Nueva Oferta de Trabajo
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowCreateJob(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título del Puesto
                      </label>
                      <input
                        type="text"
                        value={newJobForm.title}
                        onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="ej. Desarrollador Frontend React"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Horas Requeridas
                      </label>
                      <input
                        type="number"
                        value={newJobForm.required_hours}
                        onChange={(e) => setNewJobForm({...newJobForm, required_hours: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Salario Aproximado (COP)
                      </label>
                      <input
                        type="number"
                        value={newJobForm.approximated_salary}
                        onChange={(e) => setNewJobForm({...newJobForm, approximated_salary: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duración (meses)
                      </label>
                      <input
                        type="number"
                        value={newJobForm.duration}
                        onChange={(e) => setNewJobForm({...newJobForm, duration: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha de Inicio
                      </label>
                      <input
                        type="date"
                        value={newJobForm.start_date}
                        onChange={(e) => setNewJobForm({...newJobForm, start_date: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Modalidad
                      </label>
                      <select
                        value={newJobForm.modality}
                        onChange={(e) => setNewJobForm({...newJobForm, modality: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      >
                        <option value={1}>Presencial</option>
                        <option value={2}>Remoto</option>
                        <option value={3}>Híbrido</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={newJobForm.description}
                      onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                      rows={4}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="Describe los requisitos, responsabilidades y beneficios del puesto..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateJob(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleCreateJob}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Crear Oferta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Offers List */}
            <div className="space-y-4">
              {jobOffers.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No tienes ofertas de trabajo publicadas</p>
                    <p className="text-gray-500 text-sm">Crea tu primera oferta para comenzar a recibir candidatos</p>
                  </CardContent>
                </Card>
              ) : (
                jobOffers.map((job) => (
                  <Card key={job.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{job.title}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {job.required_hours}h • ${job.approximated_salary.toLocaleString()} COP • {job.duration} meses
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadAIMatches(job.id)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            IA Match
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{job.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Inicio: {new Date(job.start_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.modality === 1 ? 'Presencial' : job.modality === 2 ? 'Remoto' : 'Híbrido'}
                        </span>
                      </div>

                      {/* AI Matching Results */}
                      {aiMatches[job.id] && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <Target className="h-4 w-4 mr-2 text-blue-400" />
                            Candidatos Recomendados por IA
                          </h4>
                          {aiMatches[job.id].length === 0 ? (
                            <p className="text-gray-400 text-sm">No se encontraron candidatos compatibles</p>
                          ) : (
                            <div className="space-y-2">
                              {aiMatches[job.id].slice(0, 3).map((match, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                      #{match.rank}
                                    </div>
                                    <div>
                                      <p className="text-white text-sm">Estudiante ID: {match.student_id}</p>
                                      <p className="text-gray-400 text-xs">Compatibilidad: {(match.score * 100).toFixed(1)}%</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < Math.round(match.score * 5) 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-500'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {loadingMatches[job.id] && (
                        <div className="mt-4 p-4 bg-gray-700 rounded-lg text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Database className="h-4 w-4 text-blue-400 animate-pulse" />
                            <span className="text-gray-300">Analizando candidatos con IA...</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="candidates">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Candidatos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Funcionalidad de candidatos en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Analíticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Funcionalidad de analíticas en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PersonalizedCompanyDashboard;
