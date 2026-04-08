import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  BookOpen, 
  Briefcase, 
  Target, 
  Calendar,
  MapPin,
  GraduationCap,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Edit,
  LogOut
} from 'lucide-react';
import { useUser } from '@/lib/user-context';

export default function PersonalizedStudentDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('inicio');
  const [aiRecommendations, setAiRecommendations] = useState<MatchJobStudentResponse[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [allJobOffers, setAllJobOffers] = useState<JobOfferResponse[]>([]);

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

  useEffect(() => {
    if (user && user.id) {
      loadAIRecommendations();
      loadAllJobOffers();
    }
  }, [user]);

  const loadUserData = async () => {
    // Load user from context or localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (userEmail && userRole === 'student') {
      // First try to get mock user data
      const user = getUserContext(userEmail);
      const dashboard = getUserDashboardData(userEmail);
      
      if (user && dashboard) {
        // Use mock data for personalized experience
        setCurrentUser(user);
        setDashboardData(dashboard);
      } else if (userId) {
        // Create basic user profile from backend data for non-mock users
        const backendUser = {
          id: userId,
          name: userEmail.split('@')[0], // Use email prefix as name
          email: userEmail,
          role: 'student',
          location: 'Perú',
          bio: 'Usuario registrado en el sistema',
          career: 'Estudiante',
          university: 'Universidad',
          semester: 5,
          skills: ['JavaScript', 'React', 'Node.js']
        };
        
        const basicDashboard = {
          stats: {
            applicationsCount: 0,
            projectsCount: 0,
            skillsCount: 3,
            matchesCount: 0
          },
          recentApplications: [],
          recommendedJobs: [],
          projects: [],
          upcomingEvents: []
        };
        
        setCurrentUser(backendUser);
        setDashboardData(basicDashboard);
      } else {
        // Redirect to login if no user data found
        setLocation('/login');
      }
    } else {
      // Redirect to login if no email or wrong role
      setLocation('/login');
    }
  };

  const loadAIRecommendations = async () => {
    try {
      const studentId = parseInt(currentUser.id);
      if (isNaN(studentId)) {
        console.log('Invalid student ID, using mock data');
        return;
      }

      setLoadingRecommendations(true);
      const recommendations = await aiMatchingAPI.getBestJobsForStudent(studentId);
      setAiRecommendations(recommendations);
      
      // Update dashboard stats
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          matchesCount: recommendations.length
        }
      }));
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      setAiRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const loadAllJobOffers = async () => {
    try {
      const offers = await jobOfferAPI.getAll();
      setAllJobOffers(offers);
    } catch (error) {
      console.error('Error loading job offers:', error);
      setAllJobOffers([]);
    }
  };

  const getJobOfferDetails = (jobOfferId: number) => {
    return allJobOffers.find(job => job.id === jobOfferId);
  };

  const handleLogout = () => {
    localStorage.clear();
    setLocation('/');
  };

  if (!currentUser || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando tu dashboard personalizado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#1a0b3d] to-[#2d0a4a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 border-2 border-[#FF258D]">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-[#FF258D] text-white">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">¡Hola, {currentUser.name}!</h1>
                <p className="text-gray-300 text-sm">
                  {currentUser.career} - {currentUser.university}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setActiveTab('perfil')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-300 hover:bg-red-500/20"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-[#1a0b3d] border-white/10 mb-8">
            <TabsTrigger value="inicio" className="data-[state=active]:bg-[#FF258D]">
              Inicio
            </TabsTrigger>
            <TabsTrigger value="trabajos" className="data-[state=active]:bg-[#FF258D]">
              Trabajos
            </TabsTrigger>
            <TabsTrigger value="proyectos" className="data-[state=active]:bg-[#FF258D]">
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="perfil" className="data-[state=active]:bg-[#FF258D]">
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="inicio" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Aplicaciones</p>
                      <p className="text-2xl font-bold text-white">{dashboardData.stats.applicationsCount}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-[#FF258D]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Proyectos</p>
                      <p className="text-2xl font-bold text-white">{dashboardData.stats.projectsCount}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-[#390062]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Habilidades</p>
                      <p className="text-2xl font-bold text-white">{dashboardData.stats.skillsCount}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Matches IA</p>
                      <p className="text-2xl font-bold text-white">{dashboardData.stats.matchesCount}</p>
                    </div>
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personalized Content Based on User */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommended Jobs */}
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#FF258D]" />
                    Trabajos Recomendados para {currentUser.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Basado en tu perfil de {currentUser.career}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.recommendedJobs.map((job: any) => (
                    <div key={job.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{job.title}</h3>
                          <p className="text-gray-300 text-sm">{job.company}</p>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {job.matchPercentage}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{job.location}</span>
                        <span className="text-gray-300 text-sm">• {job.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs border-[#FF258D] text-[#FF258D]">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full bg-[#FF258D] hover:bg-[#FF258D]/90">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#390062]" />
                    Mis Aplicaciones Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.recentApplications.map((app: any) => (
                    <div key={app.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{app.position}</h3>
                        <Badge 
                          variant="outline" 
                          className={
                            app.status === 'accepted' ? 'text-green-400 border-green-400' :
                            app.status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                            'text-red-400 border-red-400'
                          }
                        >
                          {app.status === 'accepted' ? 'Aceptada' : 
                           app.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{app.company}</p>
                      <p className="text-gray-400 text-xs">Aplicado: {app.applied_date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* User-specific Projects */}
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#FF258D]" />
                  Proyectos de {currentUser.name}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tus proyectos académicos y personales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.projects.map((project: any) => (
                    <div key={project.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{project.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={
                            project.status === 'completed' ? 'text-green-400 border-green-400' :
                            'text-yellow-400 border-yellow-400'
                          }
                        >
                          {project.status === 'completed' ? 'Completado' : 'En Progreso'}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech: string) => (
                            <Badge key={tech} variant="outline" className="text-xs border-[#390062] text-[#390062]">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI-Powered Job Recommendations Tab */}
          <TabsContent value="trabajos" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Trabajos Recomendados por IA</h2>
              <Button 
                onClick={loadAIRecommendations}
                disabled={loadingRecommendations}
                className="bg-[#FF258D] hover:bg-[#FF258D]/90"
              >
                {loadingRecommendations ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Target className="h-4 w-4 mr-2" />
                )}
                Actualizar Recomendaciones
              </Button>
            </div>

            {loadingRecommendations ? (
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF258D] mx-auto mb-4"></div>
                  <p className="text-gray-300">Analizando ofertas con IA...</p>
                  <p className="text-gray-400 text-sm">Encontrando los mejores matches para tu perfil</p>
                </CardContent>
              </Card>
            ) : aiRecommendations.length === 0 ? (
              <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-300">No se encontraron recomendaciones</p>
                  <p className="text-gray-400 text-sm">Intenta actualizar tu perfil o verifica que haya ofertas disponibles</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiRecommendations.map((match, index) => {
                  const jobDetails = getJobOfferDetails(match.job_offer_id);
                  return (
                    <Card key={index} className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10 hover:border-[#FF258D]/50 transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">
                              {jobDetails?.title || `Oferta #${match.job_offer_id}`}
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                              {jobDetails ? (
                                <>
                                  ${jobDetails.approximated_salary.toLocaleString()} COP • {jobDetails.required_hours}h • {jobDetails.duration} meses
                                </>
                              ) : (
                                'Cargando detalles...'
                              )}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-2xl font-bold text-[#FF258D]">#{match.rank}</span>
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
                            <p className="text-xs text-gray-400 mt-1">
                              {(match.score * 100).toFixed(1)}% compatibilidad
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {jobDetails && (
                          <>
                            <p className="text-gray-300 mb-4 text-sm">
                              {jobDetails.description.length > 150 
                                ? `${jobDetails.description.substring(0, 150)}...` 
                                : jobDetails.description
                              }
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(jobDetails.start_date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {jobDetails.modality === 1 ? 'Presencial' : 
                                 jobDetails.modality === 2 ? 'Remoto' : 'Híbrido'}
                              </span>
                            </div>

                            <div className="mb-4">
                              <p className="text-xs text-gray-400 mb-2">Fecha de match: {new Date(match.match_date).toLocaleDateString()}</p>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-[#FF258D] to-[#390062] h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${match.score * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-[#FF258D] hover:bg-[#FF258D]/90"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-[#390062] text-[#390062] hover:bg-[#390062]/20"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Aplicar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* All Available Jobs Section */}
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10 mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#FF258D]" />
                  Todas las Ofertas Disponibles
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Explora todas las oportunidades laborales disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allJobOffers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No hay ofertas disponibles en este momento</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allJobOffers.slice(0, 6).map((job) => (
                      <div key={job.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#FF258D]/30 transition-colors">
                        <h3 className="text-white font-semibold mb-2">{job.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">
                          ${job.approximated_salary.toLocaleString()} COP
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
                          <span>{job.required_hours}h</span>
                          <span>•</span>
                          <span>{job.duration} meses</span>
                          <span>•</span>
                          <span>{job.modality === 1 ? 'Presencial' : job.modality === 2 ? 'Remoto' : 'Híbrido'}</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D]/20">
                          Ver Más
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proyectos" className="space-y-6">
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Gestión de Proyectos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Gestión completa de proyectos próximamente...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card className="bg-[#1a0b3d]/80 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Mi Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-20 h-20 border-4 border-[#FF258D]">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-[#FF258D] text-white text-xl">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
                    <p className="text-gray-300">{currentUser.career}</p>
                    <p className="text-gray-400">{currentUser.university}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3">Información Personal</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300"><strong>Email:</strong> {currentUser.email}</p>
                      <p className="text-gray-300"><strong>Ubicación:</strong> {currentUser.location}</p>
                      <p className="text-gray-300"><strong>Semestre:</strong> {currentUser.semester}°</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Habilidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills?.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-[#FF258D] text-[#FF258D]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Biografía</h3>
                  <p className="text-gray-300">{currentUser.bio}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
