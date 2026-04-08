import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  GraduationCap, 
  MapPin, 
  Clock, 
  Monitor,
  Briefcase,
  Star,
  TrendingUp,
  Users,
  Award,
  Target,
  Zap,
  ChevronRight,
  LogOut,
  Settings,
  FileText,
  Bot
} from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { useLocation } from 'wouter';
import { aiMatchingAPI } from '@/services/backend-api';

interface JobOffer {
  id: number;
  title: string;
  company_name: string;
  location: string;
  modality: string;
  salary_min: number;
  salary_max: number;
  match_score?: number;
}

export default function NewStudentDashboard() {
  const { user, logout } = useUser();
  const [location, setLocation] = useLocation();
  const [jobRecommendations, setJobRecommendations] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const profileData = user?.profileData || {};

  // Debug log to see what user data we have
  console.log('NewStudentDashboard - User data:', user);
  console.log('NewStudentDashboard - Profile data:', profileData);

  useEffect(() => {
    fetchJobRecommendations();
  }, []);

  const fetchJobRecommendations = async () => {
    try {
      // Check if we have user data and related_id (student_id)
      if (user?.profileData?.related_id) {
        console.log('Fetching job recommendations for student_id:', user.profileData.related_id);
        const response = await aiMatchingAPI.getBestJobsForStudent(user.profileData.related_id);
        setJobRecommendations(response.slice(0, 3)); // Show top 3
      } else {
        console.log('No student_id found in user data:', user);
        // Set empty array to show dashboard without recommendations
        setJobRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      // Set empty array to show dashboard even if API fails
      setJobRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const getModalityText = (modality: number | string) => {
    const modalityNum = typeof modality === 'string' ? parseInt(modality) : modality;
    switch (modalityNum) {
      case 1: return 'Presencial';
      case 2: return 'Remoto';
      case 3: return 'Híbrido';
      default: return 'No especificado';
    }
  };

  const stats = [
    { label: 'Perfil Completado', value: '60%', icon: User },
    { label: 'Matches IA', value: '12', icon: Bot },
    { label: 'CV Optimizado', value: 'Pendiente', icon: FileText },
    { label: 'Entrevistas', value: '3', icon: Award },
  ];

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: No se encontraron datos de usuario</p>
          <Button onClick={() => setLocation('/')} className="mt-4">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/logoCircular.png" 
                  alt="ProjectCore" 
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="text-xl font-bold text-white">ProjectCore</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 h-screen relative z-10">
          <div className="p-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-300 bg-purple-500/20"
              >
                <GraduationCap className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setLocation('/student-profile')}
              >
                <User className="w-4 h-4 mr-3" />
                Mi Perfil
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
              >
                <Briefcase className="w-4 h-4 mr-3" />
                Mis Postulaciones
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
              >
                <FileText className="w-4 h-4 mr-3" />
                Mis CVs
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Welcome Section with AI Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                ¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}!
              </h1>
            </div>
            <p className="text-white/80 text-lg mb-4">
              Tu talento conectado con oportunidades reales
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                <h3 className="text-xl font-bold text-white">Matching Inteligente por IA</h3>
              </div>
              <p className="text-white/90 text-center leading-relaxed">
                Nuestro sistema de IA no se basa en el nombre de tu universidad o credenciales tradicionales. 
                <span className="font-semibold text-purple-300">Medimos tu verdadero potencial</span>: habilidades, 
                capacidades, talento y tu impacto real. La tecnología más avanzada para conectar 
                <span className="font-semibold text-blue-300">tu potencial único</span> con empresas que valoran la innovación.
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white/80">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <IconComponent className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Perfil</p>
                        <p className="font-semibold text-gray-900">{profileData.career || 'Carrera no especificada'}</p>
                        <p className="text-sm text-gray-500">{profileData.academic_cycle ? `${profileData.academic_cycle}° ciclo` : 'Ciclo no especificado'}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/student-profile')}
                    >
                      Ver perfil
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Opportunity Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Zap className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Hazte visible hoy: comparte un video presentándote y el puesto que buscas</h3>
                        <p className="text-blue-100 mt-1">
                          Un video breve puede aumentar hasta 50% tus posibilidades de conseguir trabajo.
                        </p>
                      </div>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      Postula ahora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Accede a las herramientas principales de ProjectCore
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/student-profile')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Actualizar perfil
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Subir CV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Buscar empleos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Job Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Bot className="w-5 h-5 mr-2 text-purple-400" />
                  Matches Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-white/80 mt-2">Analizando tu potencial...</p>
                  </div>
                ) : jobRecommendations.length > 0 ? (
                  <div className="space-y-4">
                    {jobRecommendations.map((job, index) => (
                      <div key={index} className="border border-white/20 rounded-lg p-4 hover:border-purple-400/50 transition-all duration-300 bg-white/5">
                        <h4 className="font-semibold text-white">{job.title}</h4>
                        <p className="text-sm text-white/70">{job.company_name}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-white/60">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm text-white/60">
                            <Monitor className="w-4 h-4 mr-1" />
                            {getModalityText(job.modality)}
                          </div>
                        </div>
                        {job.match_score && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/70">Match de Potencial</span>
                              <span className="font-medium text-purple-400">{Math.round(job.match_score * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full" 
                                style={{ width: `${job.match_score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      Ver todos los matches
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-white/80 mb-4">Completa tu perfil para que nuestra IA identifique las mejores oportunidades para tu talento</p>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-center justify-center mb-2">
                        <Bot className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="text-white font-semibold">Consejo de Chamby</span>
                      </div>
                      <p className="text-white/90 text-sm text-center">
                        "¡Escríbeme por WhatsApp! Te ayudo con tips de entrevistas, 
                        mejoras en tu CV y estrategias para destacar tu talento único."
                      </p>
                      <Button 
                        onClick={() => window.open('https://wa.me/51999999999?text=Hola%20Chamby,%20quiero%20consejos%20para%20destacar%20mi%20talento', '_blank')}
                        className="w-full mt-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-sm"
                      >
                        💬 Chatear con Chamby
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* About Chamby Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-600 rounded-full">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Conoce a Chamby, tu asistente IA</h3>
                    <p className="text-gray-700">
                      Chamby utiliza inteligencia artificial avanzada para analizar tu perfil y conectarte con las mejores oportunidades laborales. 
                      Nuestro algoritmo considera tu carrera, experiencia, ubicación y preferencias para ofrecerte recomendaciones personalizadas.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Matching inteligente</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Análisis de compatibilidad</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Red de empresas</span>
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
