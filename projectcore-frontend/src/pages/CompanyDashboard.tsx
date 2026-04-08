import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Building2, 
  Users, 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign,
  TrendingUp,
  Eye,
  Calendar,
  Award,
  Target,
  Zap,
  Brain,
  Radar,
  Home,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { jobOfferAPI, aiMatchingAPI, catalogAPI, type JobOfferCreate, type JobOfferResponse } from '@/services/backend-api'

function CompanyDashboard() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [companyJobOffers, setCompanyJobOffers] = useState<JobOfferResponse[]>([])
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOfferResponse | null>(null)
  const [matchedStudents, setMatchedStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateJob, setShowCreateJob] = useState(false)
  const [showJobOfferForm, setShowJobOfferForm] = useState(false)
  const [editingJob, setEditingJob] = useState<JobOfferResponse | null>(null)
  const [editingJobOffer, setEditingJobOffer] = useState<JobOfferResponse | null>(null)
  const [areas, setAreas] = useState<any[]>([])
  const [experienceLevels, setExperienceLevels] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    required_hours: 40,
    approximated_salary: 0,
    duration: 6,
    start_date: '',
    area_id: 1,
    experience_id: 1,
    modality: 1
  })
  const [companyData, setCompanyData] = useState<any>({
    id: 1,
    name: 'TechCorp Solutions',
    description: 'Empresa líder en desarrollo de software',
    industry: 'Tecnología',
    location: 'Lima, Perú'
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // AI Analytics state
  const [aiAnalytics, setAiAnalytics] = useState({
    talentPoolSize: 1247,
    matchAccuracy: 94,
    applicationRate: 87,
    hiringSuccess: 76,
    aiOptimization: 92
  });

  // Use the job offers hook
  const { 
    jobOffers, 
    loading: jobOffersLoading, 
    error: jobOffersError,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer,
    getAIMatches
  } = useJobOffers();

  // Use the company profile hook - using company ID 1 for demo
  const {
    profile: companyProfile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    createProfile
  } = useCompanyProfile(1);

  // Create a mock mutation object for the UI
  const updateProfileMutation = {
    isPending: false,
    isError: false,
    isSuccess: false
  };

  // Initialize profile form data when company profile loads
  useEffect(() => {
    if (companyProfile) {
      setProfileFormData({
        name: companyProfile.name || '',
        email: companyProfile.email || '',
        university: companyProfile.university || '',
        description: companyProfile.description || '',
        website: companyProfile.website || '',
        location: companyProfile.location || ''
      });
    }
  }, [companyProfile]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const loadDashboardData = async () => {
    // AI Analytics for company
    setAiAnalytics({
      talentPoolSize: 1247,
      matchAccuracy: 92,
      applicationRate: 68,
      hiringSuccess: 85,
      aiOptimization: 89
    })
  }

  const handleCreateJobOffer = async (jobOfferData: JobOfferCreate) => {
    try {
      await createJobOffer(jobOfferData);
      setShowJobOfferForm(false);
    } catch (error) {
      console.error('Error creating job offer:', error);
      throw error;
    }
  }

  const handleEditJobOffer = (jobOffer: any) => {
    setEditingJobOffer(jobOffer);
    setShowJobOfferForm(true);
  }

  const handleSaveProfile = async () => {
    if (!editingProfile) return;
    
    try {
      await updateProfile(1, editingProfile); // Using company ID 1 for demo
      setEditingProfile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSubmitJobOffer = async (data: JobOfferCreate) => {
    try {
      if (editingJobOffer && editingJobOffer.id) {
        await updateJobOffer(editingJobOffer.id, data);
      } else {
        await createJobOffer(data);
      }
      setEditingJobOffer(null);
      setShowJobOfferForm(false);
    } catch (error) {
      console.error('Error submitting job offer:', error);
      alert('Error al guardar el proyecto');
    }
  }

  const handleDeleteJobOffer = async (jobOfferId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await deleteJobOffer(jobOfferId);
      } catch (error) {
        console.error('Error deleting job offer:', error);
        alert('Error al eliminar el proyecto');
      }
    }
  }

  const transformMatchData = (match: any): any => {
    return {
      ...match,
      name: match.student_name,
      career: match.student_career,
      matchScore: match.match_score,
      skills: match.student_skills,
      experience: match.student_experience,
      location: match.student_location,
      availability: 'Disponible', // Default value since not in API
      aiReason: match.ai_reason,
      profileStrength: Math.round(match.embedding_similarity * 100),
      isNew: true // Default value for new matches
    };
  };

  const handleGetAIMatches = async (jobOfferId: number) => {
    try {
      const matches = await getAIMatches(jobOfferId);
      const transformedMatches = matches.map(transformMatchData);
      setAiMatches(transformedMatches);
      setSelectedJobOfferId(jobOfferId);
      setActiveTab('aplicaciones'); // Switch to applications tab to show matches
    } catch (error) {
      console.error('Error getting AI matches:', error);
      alert('Error al obtener matches de IA. Asegúrate de que el backend esté ejecutándose.');
    }
  }

  const closeJobOfferForm = () => {
    setShowJobOfferForm(false);
    setEditingJobOffer(null);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const sidebarItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'proyectos', label: 'Mis Proyectos', icon: Briefcase },
    { id: 'aplicaciones', label: 'Aplicaciones', icon: Users },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-blue-900/80 backdrop-blur-sm border-b border-blue-700/50 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#6a00f4] to-[#ff1cf7] bg-clip-text text-transparent">
              ProjectCore
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-[#6a00f4] text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : isMobile ? -280 : -256,
          opacity: isSidebarOpen ? 1 : isMobile ? 0 : 0.3
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full w-64 bg-blue-900/95 backdrop-blur-sm border-r border-blue-700/50 transition-all duration-300 ease-in-out z-40 p-6 ${
          isMobile ? 'shadow-2xl' : ''
        }`}
      >
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                onClick={() => {
                  setActiveTab(item.id)
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-[#6a00f4]/30 to-[#ff1cf7]/30 border border-[#6a00f4]/40' 
                    : 'hover:bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Logout clicked')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      } ${isMobile ? 'w-full pt-20' : 'max-w-full'}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* AI Recruitment Header */}
              <div className="bg-gradient-to-r from-[#390062] to-[#8A4EFC] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-6 h-6" />
                      <h2 className="text-xl font-bold">Chamby AI Recruiter</h2>
                    </div>
                    <p className="text-white/90">Inteligencia artificial para encontrar el talento perfecto</p>
                  </div>
                  <motion.div 
                    className="bg-white/20 p-3 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Radar className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>

              {/* AI Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">Pool Talento</p>
                        <p className="text-2xl font-bold text-indigo-800">{aiAnalytics.talentPoolSize}</p>
                      </div>
                      <Database className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-xs text-indigo-600 mt-1">Candidatos disponibles</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Precisión IA</p>
                        <p className="text-2xl font-bold text-green-800">{aiAnalytics.matchAccuracy}%</p>
                      </div>
                      <Target className="w-8 h-8 text-green-500" />
                    </div>
                    <Progress value={aiAnalytics.matchAccuracy} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Aplicaciones</p>
                        <p className="text-2xl font-bold text-blue-800">{aiAnalytics.applicationRate}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                    <Progress value={aiAnalytics.applicationRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Éxito Contrat.</p>
                        <p className="text-2xl font-bold text-purple-800">{aiAnalytics.hiringSuccess}%</p>
                      </div>
                      <UserCheck className="w-8 h-8 text-purple-500" />
                    </div>
                    <Progress value={aiAnalytics.hiringSuccess} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Optimización</p>
                        <p className="text-2xl font-bold text-orange-800">{aiAnalytics.aiOptimization}%</p>
                      </div>
                      <Cpu className="w-8 h-8 text-orange-500" />
                    </div>
                    <Progress value={aiAnalytics.aiOptimization} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* AI Candidate Matches */}
              <Card className="border-2 border-[#390062]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-6 h-6 text-[#390062]" />
                      <CardTitle className="text-xl">Candidatos IA Recomendados</CardTitle>
                      <Badge variant="secondary" className="bg-[#390062]/10 text-[#390062]">
                        Powered by Chamby AI
                      </Badge>
                    </div>
                    <Button variant="outline" className="border-[#390062] text-[#390062] hover:bg-[#390062] hover:text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Buscar Más Talento
                    </Button>
                  </div>
                  <CardDescription>
                    Candidatos seleccionados por IA basándose en tus ofertas laborales y criterios de contratación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiMatches.map((candidate, index) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative p-4 border rounded-lg hover:shadow-lg transition-all duration-300 bg-blue-900/95 backdrop-blur-sm border-r border-blue-700/50"
                      >
                        {candidate.isNew && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-[#FF6B6B] text-white animate-pulse">
                              ¡Nuevo!
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name || candidate.student_name || 'user'}`} />
                              <AvatarFallback>{(candidate.name || candidate.student_name || 'U').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{candidate.name || candidate.student_name || 'Usuario Desconocido'}</h3>
                                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                  <Sparkles className="w-3 h-3 text-green-600" />
                                  <span className="text-xs font-medium text-green-600">{Math.round((candidate.matchScore || candidate.match_score || 0) * 100)}% Match</span>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-2">{candidate.career || candidate.student_career || 'Carrera no especificada'} • {candidate.experience || candidate.student_experience || 'Experiencia no especificada'}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{candidate.location || candidate.student_location || 'Ubicación no especificada'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Disponible: {candidate.availability || 'Disponible'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>Perfil: {candidate.profileStrength || Math.round((candidate.embedding_similarity || 0) * 100)}%</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {(candidate.skills || candidate.student_skills || []).map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="bg-purple-50 p-3 rounded-lg mb-3">
                                <div className="flex items-start gap-2">
                                  <Brain className="w-4 h-4 text-purple-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-purple-600 mb-1">Análisis IA:</p>
                                    <p className="text-sm text-purple-800">{candidate.aiReason}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-[#390062] hover:bg-[#2A0047]">
                                  <Send className="w-4 h-4 mr-2" />
                                  Contactar
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Perfil
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#390062] mb-1">{candidate.matchScore}%</div>
                            <div className="text-xs text-gray-500">Compatibilidad IA</div>
                            <div className="text-xs text-gray-400 mt-1">Embedding: {candidate.embedding_similarity}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Welcome Section */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={0}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ¡Bienvenido! 👋
                </h1>
                <p className="text-white/70">
                  Gestiona tus proyectos y encuentra el mejor talento estudiantil
                </p>
              </motion.div>

              {/* Enhanced Quick Stats with AI Insights */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Ofertas Activas</p>
                        <p className="text-3xl font-bold">{jobOffers.length}</p>
                        <p className="text-xs text-blue-200 mt-1">+2 esta semana</p>
                      </div>
                      <div className="relative">
                        <Briefcase className="h-8 w-8 text-blue-200" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Sparkles className="w-16 h-16" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Aplicaciones IA</p>
                        <p className="text-3xl font-bold">{aiMatches.length}</p>
                        <p className="text-xs text-green-200 mt-1">92% precisión</p>
                      </div>
                      <div className="relative">
                        <Users className="h-8 w-8 text-green-200" />
                        <Bot className="absolute -bottom-1 -right-1 w-4 h-4 text-green-300" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Network className="w-16 h-16" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Pool Talento</p>
                        <p className="text-3xl font-bold">{aiAnalytics.talentPoolSize || 1247}</p>
                        <p className="text-xs text-purple-200 mt-1">Candidatos disponibles</p>
                      </div>
                      <div className="relative">
                        <Star className="h-8 w-8 text-purple-200" />
                        <Radar className="absolute -bottom-1 -right-1 w-4 h-4 text-purple-300 animate-spin" style={{animationDuration: '3s'}} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Database className="w-16 h-16" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Éxito IA</p>
                        <p className="text-3xl font-bold">{aiAnalytics.hiringSuccess || 85}%</p>
                        <p className="text-xs text-orange-200 mt-1">Contrataciones exitosas</p>
                      </div>
                      <div className="relative">
                        <TrendingUp className="h-8 w-8 text-orange-200" />
                        <Brain className="absolute -bottom-1 -right-1 w-4 h-4 text-orange-300" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-10">
                      <Target className="w-16 h-16" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={1}
                className="bg-[#0f0f1a] border border-white/5 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowJobOfferForm(true)}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#6a00f4] to-[#ff1cf7] rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#6a00f4]/25"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Crear Proyecto</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('aplicaciones')}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#f72585] to-[#b5179e] rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#f72585]/25"
                  >
                    <Users className="w-5 h-5" />
                    <span>Ver Aplicaciones</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('proyectos')}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#4ade80]/25"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Gestionar Proyectos</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'proyectos' && (
            <motion.div
              key="proyectos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Mis Proyectos</h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJobOfferForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#6a00f4] to-[#ff1cf7] rounded-lg text-white font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Proyecto</span>
                </motion.button>
              </div>

              <Tabs defaultValue="activos" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#0f0f1a] border border-white/10">
                  <TabsTrigger value="activos" className="data-[state=active]:bg-[#6a00f4] data-[state=active]:text-white">
                    Activos
                  </TabsTrigger>
                  <TabsTrigger value="completados" className="data-[state=active]:bg-[#6a00f4] data-[state=active]:text-white">
                    Completados
                  </TabsTrigger>
                  <TabsTrigger value="borradores" className="data-[state=active]:bg-[#6a00f4] data-[state=active]:text-white">
                    Borradores
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activos" className="space-y-4">
                  {jobOffersLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white/60">Cargando proyectos...</p>
                    </div>
                  ) : jobOffersError ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400">Error al cargar proyectos: {jobOffersError}</p>
                    </div>
                  ) : jobOffers.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">No tienes proyectos activos</p>
                      <p className="text-white/40 text-sm mt-2">Crea tu primer proyecto para empezar</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {jobOffers.map((jobOffer, index) => (
                        <motion.div
                          key={jobOffer.id}
                          custom={index}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-white text-lg mb-2">{jobOffer.title}</CardTitle>
                                  <CardDescription className="text-gray-300 text-sm line-clamp-2">
                                    {jobOffer.description}
                                  </CardDescription>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditJobOffer(jobOffer)}
                                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteJobOffer(jobOffer.id)}
                                    className="text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <DollarSign className="w-4 h-4 text-green-400" />
                                  <span>S/ {jobOffer.approximated_salary}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Clock className="w-4 h-4 text-blue-400" />
                                  <span>{jobOffer.required_hours}h/sem</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Calendar className="w-4 h-4 text-purple-400" />
                                  <span>{jobOffer.duration} meses</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <MapPin className="w-4 h-4 text-orange-400" />
                                  <span>
                                    {jobOffer.modality === 1 ? 'Presencial' : 
                                     jobOffer.modality === 2 ? 'Remoto' : 'Híbrido'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleGetAIMatches(jobOffer.id)}
                                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                  disabled={jobOffersLoading}
                                >
                                  <Brain className="w-4 h-4 mr-2" />
                                  Match IA
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completados" className="space-y-4">
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No tienes proyectos completados</p>
                  </div>
                </TabsContent>

                <TabsContent value="borradores" className="space-y-4">
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No tienes borradores guardados</p>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {activeTab === 'aplicaciones' && (
            <motion.div
              key="aplicaciones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Aplicaciones de Estudiantes</h1>

              <Tabs defaultValue="pendientes" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#0f0f1a] border border-white/10">
                  <TabsTrigger value="pendientes" className="data-[state=active]:bg-[#6a00f4] data-[state=active]:text-white">
                    Pendientes
                  </TabsTrigger>
                  <TabsTrigger value="aceptadas" className="data-[state=active]:bg-[#6a00f4] data-[state=active]:text-white">
                    Aceptadas
                  </TabsTrigger>
                  <TabsTrigger value="rechazadas" className="data-[state=active]:bg-[#6a00f4] data-[state=active]:text-white">
                    Rechazadas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pendientes" className="space-y-4">
                  {aiMatches.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">No hay aplicaciones pendientes</p>
                      <p className="text-white/40 text-sm mt-2">
                        Usa el botón "Match IA" en tus proyectos para encontrar candidatos
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-white/80">
                          Mostrando {aiMatches.length} candidatos encontrados por IA
                        </p>
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                          Matches IA
                        </Badge>
                      </div>
                      <div className="grid gap-4">
                        {aiMatches.map((candidate, index) => (
                          <motion.div
                            key={candidate.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 ${
                              candidate.isNew ? 'ring-2 ring-purple-500/30' : ''
                            }`}>
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                      {(candidate.name || candidate.student_name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-white">
                                        {candidate.name || candidate.student_name || 'Usuario Desconocido'}
                                      </h3>
                                      <p className="text-gray-300 text-sm">
                                        {candidate.career || candidate.student_career || 'Carrera no especificada'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant="secondary" 
                                      className="bg-green-600/20 text-green-300"
                                    >
                                      {Math.round((candidate.matchScore || candidate.match_score || 0) * 100)}% Match
                                    </Badge>
                                    {candidate.isNew && (
                                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                                        Nuevo
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center space-x-2 text-gray-300">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                    <span>{candidate.experience || candidate.student_experience || 'No especificado'}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-300">
                                    <MapPin className="w-4 h-4 text-orange-400" />
                                    <span>{candidate.location || candidate.student_location || 'Ubicación no especificada'}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-300">
                                    <Clock className="w-4 h-4 text-green-400" />
                                    <span>{candidate.availability || 'Disponible'}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-gray-300">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                    <span>Perfil: {candidate.profileStrength || Math.round((candidate.embedding_similarity || 0) * 100)}%</span>
                                  </div>
                                </div>
                                
                                {(candidate.skills || candidate.student_skills) && (
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-300">Habilidades:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {(candidate.skills || candidate.student_skills || []).slice(0, 4).map((skill, skillIndex) => (
                                        <Badge 
                                          key={skillIndex} 
                                          variant="outline" 
                                          className="border-gray-600 text-gray-300 text-xs"
                                        >
                                          {skill}
                                        </Badge>
                                      ))}
                                      {(candidate.skills || candidate.student_skills || []).length > 4 && (
                                        <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                          +{(candidate.skills || candidate.student_skills || []).length - 4} más
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {(candidate.aiReason || candidate.ai_reason) && (
                                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                                    <p className="text-sm text-purple-200">
                                      <strong>Razón de Match IA:</strong> {candidate.aiReason || candidate.ai_reason}
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex gap-2">
                                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Aceptar
                                  </Button>
                                  <Button variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                                    <Users className="w-4 h-4 mr-2" />
                                    Contactar
                                  </Button>
                                  <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="aceptadas" className="space-y-4">
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No hay aplicaciones aceptadas</p>
                  </div>
                </TabsContent>

                <TabsContent value="rechazadas" className="space-y-4">
                  <div className="text-center py-12">
                    <X className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No hay aplicaciones rechazadas</p>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {activeTab === 'configuracion' && (
            <motion.div
              key="configuracion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">Configuración</h1>
              
              <Card className="bg-[#0f0f1a] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información de la Empresa
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Actualiza la información de tu empresa y perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        value={editingProfile?.name || profile?.name || ''}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                        placeholder="Ingresa el nombre de tu empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Nombre del Contacto
                      </label>
                      <input
                        type="text"
                        value={editingProfile?.contact_name || profile?.contact_name || ''}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev, contact_name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                        placeholder="Ingresa tu nombre"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingProfile?.email || profile?.email || ''}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                        placeholder="empresa@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={editingProfile?.phone || profile?.phone || ''}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Industria
                      </label>
                      <input
                        type="text"
                        value={editingProfile?.industry || profile?.industry || ''}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                        placeholder="Tecnología, Finanzas, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={editingProfile?.location || profile?.location || ''}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                        placeholder="Lima, Perú"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Descripción de la Empresa
                    </label>
                    <textarea
                      value={editingProfile?.description || profile?.description || ''}
                      onChange={(e) => setEditingProfile(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4] resize-none"
                      placeholder="Describe tu empresa, cultura y valores..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      value={editingProfile?.website || profile?.website || ''}
                      onChange={(e) => setEditingProfile(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                      placeholder="https://www.tuempresa.com"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="px-6 py-2 bg-gradient-to-r from-[#6a00f4] to-[#ff1cf7] rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Guardar Cambios
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingProfile(null)}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium border border-white/20"
                    >
                      Cancelar
                    </motion.button>
                  </div>

                  {updateProfileMutation.isError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-200 text-sm">
                        Error al actualizar el perfil. Por favor, intenta nuevamente.
                      </p>
                    </div>
                  )}

                  {updateProfileMutation.isSuccess && (
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-200 text-sm">
                        Perfil actualizado exitosamente.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="bg-[#0f0f1a] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Notificaciones por Email</h3>
                      <p className="text-white/60 text-sm">Recibe notificaciones sobre nuevos candidatos</p>
                    </div>
                    <button className="w-12 h-6 bg-[#6a00f4] rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Perfil Público</h3>
                      <p className="text-white/60 text-sm">Permite que los estudiantes vean tu empresa</p>
                    </div>
                    <button className="w-12 h-6 bg-[#6a00f4] rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => console.log('Logout')}
                      className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-200 font-medium flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CompanyDashboard
