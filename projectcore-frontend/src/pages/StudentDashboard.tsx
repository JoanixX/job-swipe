'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Briefcase, 
  Star, 
  MessageCircle, 
  Settings, 
  Bell,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  Zap,
  Brain,
  Users,
  BookOpen,
  ChevronRight,
  Eye,
  Heart,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Bot,
  Activity,
  BarChart3,
  Layers,
  Network,
  Cpu,
  Gauge,
  GraduationCap,
  LogOut,
  Building2
} from 'lucide-react';

interface Match {
  id: string
  company_name: string
  similarity_percentage: number
  job_title: string
  match_date: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface JobOffer {
  id: string
  title: string
  company_name: string
  modality: string
  duration: string
  salary?: string
  location: string
  requirements: string[]
  description: string
  similarity_percentage?: number
}

interface AiMatch {
  id: number
  company: string
  position: string
  matchScore: number
  salary: string
  location: string
  skills: string[]
  aiReason: string
  isNew: boolean
  embedding_similarity: number
}

interface AiAnalytics {
  profileStrength: number
  matchAccuracy: number
  responseRate: number
  skillsOptimization: number
  marketDemand: number
}

interface Application {
  id: number
  company: string
  position: string
  status: string
  appliedDate: string
  salary: string
  location: string
}

export default function StudentDashboard() {
  const { user, logoutMutation } = useAuth()
  const [studentData, setStudentData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('inicio')
  const [matches, setMatches] = useState<Match[]>([])
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([])
  const [aiMatches, setAiMatches] = useState<AiMatch[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [aiAnalytics, setAiAnalytics] = useState<AiAnalytics>({
    profileStrength: 85,
    matchAccuracy: 92,
    responseRate: 78,
    skillsOptimization: 88,
    marketDemand: 95
  });

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Simular datos de matches
    setMatches([
      {
        id: '1',
        company_name: 'TechCorp Solutions',
        similarity_percentage: 92,
        job_title: 'Desarrollador Frontend',
        match_date: '2024-01-20',
        status: 'pending'
      },
      {
        id: '2',
        company_name: 'DataFlow Inc',
        similarity_percentage: 87,
        job_title: 'Analista de Datos',
        match_date: '2024-01-18',
        status: 'accepted'
      }
    ])

    // Simular ofertas laborales
    setJobOffers([
      {
        id: '1',
        title: 'Desarrollador Full Stack',
        company_name: 'InnovateTech',
        modality: 'Híbrido',
        duration: '6 meses',
        salary: 'S/ 1500',
        location: 'Lima',
        requirements: ['React', 'Node.js', 'MongoDB'],
        description: 'Buscamos un desarrollador full stack'
      },
      {
        id: '2',
        title: 'Analista de Marketing',
        company_name: 'Growth Marketing',
        modality: 'Remoto',
        duration: '4 meses',
        salary: 'S/ 1200',
        location: 'Remoto',
        requirements: ['Google Analytics', 'Facebook Ads'],
        description: 'Analista para campañas de marketing'
      }
    ])

    // AI Matching data
    setAiMatches([
      {
        id: 1,
        company: 'TechCorp',
        position: 'Frontend Developer Intern',
        matchScore: 95,
        salary: '$800/month',
        location: 'Lima, Perú',
        skills: ['React', 'TypeScript', 'Tailwind'],
        aiReason: 'Perfect match for your React expertise and frontend focus',
        isNew: true,
        embedding_similarity: 0.94
      },
      {
        id: 2,
        company: 'AI Startup',
        position: 'ML Engineer Intern',
        matchScore: 88,
        salary: '$900/month',
        location: 'Remoto',
        skills: ['Python', 'TensorFlow', 'Data Science'],
        aiReason: 'Your programming skills align with ML requirements',
        isNew: false,
        embedding_similarity: 0.87
      },
      {
        id: 3,
        company: 'FinTech Solutions',
        position: 'Backend Developer Intern',
        matchScore: 82,
        salary: '$750/month',
        location: 'Híbrido - Lima',
        skills: ['Node.js', 'PostgreSQL', 'API Design'],
        aiReason: 'Strong technical foundation matches backend requirements',
        isNew: true,
        embedding_similarity: 0.81
      }
    ])

    // Mock data - replace with actual API calls
    setApplications([
      {
        id: 1,
        company: 'TechCorp',
        position: 'Frontend Developer Intern',
        status: 'pending',
        appliedDate: '2024-01-15',
        salary: '$800/month',
        location: 'Lima, Perú'
      },
      {
        id: 2,
        company: 'StartupXYZ',
        position: 'UI/UX Design Intern',
        status: 'accepted',
        appliedDate: '2024-01-10',
        salary: '$600/month',
        location: 'Remoto'
      },
      {
        id: 3,
        company: 'DataCorp',
        position: 'Data Analyst Intern',
        status: 'rejected',
        appliedDate: '2024-01-05',
        salary: '$700/month',
        location: 'Arequipa, Perú'
      }
    ])

    // AI Analytics data
    setAiAnalytics({
      profileStrength: 87,
      matchAccuracy: 94,
      responseRate: 76,
      skillsOptimization: 91,
      marketDemand: 88
    })
  }

  const handleTestMatch = async (jobId: string) => {
    try {
      const similarity = Math.floor(Math.random() * 40) + 60 // 60-100%
      setJobOffers(prev => prev.map(offer => 
        offer.id === jobId 
          ? { ...offer, similarity_percentage: similarity }
          : offer
      ))

      alert(`Match calculado: ${similarity}% de similitud con esta oferta`)
    } catch (error) {
      alert('Error: No se pudo calcular el match')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-500' },
      accepted: { label: 'Aceptado', color: 'bg-green-500' },
      rejected: { label: 'Rechazado', color: 'bg-red-500' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-[#1a0b3d]/80 backdrop-blur-sm border-b border-[#FF258D]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF258D] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-['League_Spartan']">
                  Project Core
                </h1>
                <p className="text-gray-300 text-sm">Dashboard Estudiante</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Bienvenido, {studentData?.name || 'Estudiante'}
              </span>
              <Button 
                variant="outline" 
                className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1a0b3d] border border-[#FF258D]/20">
            <TabsTrigger value="inicio" className="text-white data-[state=active]:bg-[#FF258D]">
              <Target className="w-4 h-4 mr-2" />
              Inicio
            </TabsTrigger>
            <TabsTrigger value="matches" className="text-white data-[state=active]:bg-[#FF258D]">
              <Briefcase className="w-4 h-4 mr-2" />
              Mis Matches
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-white data-[state=active]:bg-[#FF258D]">
              <User className="w-4 h-4 mr-2" />
              Ofertas Laborales
            </TabsTrigger>
          </TabsList>

          {/* Inicio Tab */}
          <TabsContent value="inicio" className="mt-6">
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* AI Insights Header */}
              <div className="bg-gradient-to-r from-[#8A4EFC] to-[#BA45F0] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-6 h-6" />
                      <h2 className="text-xl font-bold">Chamby AI Assistant</h2>
                    </div>
                    <p className="text-white/90">Tu asistente inteligente para encontrar la chamba perfecta</p>
                  </div>
                  <motion.div 
                    className="bg-white/20 p-3 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeOut" as const }}
                  >
                    <Sparkles className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>

              {/* AI Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Perfil IA</p>
                        <p className="text-2xl font-bold text-blue-800">{aiAnalytics.profileStrength}%</p>
                      </div>
                      <Gauge className="w-8 h-8 text-blue-500" />
                    </div>
                    <Progress value={aiAnalytics.profileStrength} className="mt-2" />
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

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Respuesta</p>
                        <p className="text-2xl font-bold text-purple-800">{aiAnalytics.responseRate}%</p>
                      </div>
                      <Activity className="w-8 h-8 text-purple-500" />
                    </div>
                    <Progress value={aiAnalytics.responseRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Skills IA</p>
                        <p className="text-2xl font-bold text-orange-800">{aiAnalytics.skillsOptimization}%</p>
                      </div>
                      <Layers className="w-8 h-8 text-orange-500" />
                    </div>
                    <Progress value={aiAnalytics.skillsOptimization} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-pink-600">Demanda</p>
                        <p className="text-2xl font-bold text-pink-800">{aiAnalytics.marketDemand}%</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-pink-500" />
                    </div>
                    <Progress value={aiAnalytics.marketDemand} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* AI Matches Section */}
              <Card className="border-2 border-[#8A4EFC]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-6 h-6 text-[#8A4EFC]" />
                      <CardTitle className="text-xl">Matches IA Personalizados</CardTitle>
                      <Badge variant="secondary" className="bg-[#8A4EFC]/10 text-[#8A4EFC]">
                        Powered by Chamby AI
                      </Badge>
                    </div>
                    <Button variant="outline" className="border-[#8A4EFC] text-[#8A4EFC] hover:bg-[#8A4EFC] hover:text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Actualizar IA
                    </Button>
                  </div>
                  <CardDescription>
                    Oportunidades seleccionadas por nuestra IA basada en tu perfil, habilidades y preferencias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiMatches.map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative p-4 border rounded-lg hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                      >
                        {match.isNew && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-[#FF6B6B] text-white animate-pulse">
                              ¡Nuevo!
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{match.position}</h3>
                              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                <Sparkles className="w-3 h-3 text-green-600" />
                                <span className="text-xs font-medium text-green-600">{match.matchScore}% Match</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-2">{match.company}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{match.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{match.salary}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {match.skills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="bg-blue-50 p-3 rounded-lg mb-3">
                              <div className="flex items-start gap-2">
                                <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-xs font-medium text-blue-600 mb-1">Análisis IA:</p>
                                  <p className="text-sm text-blue-800">{match.aiReason}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="bg-[#8A4EFC] hover:bg-[#7A3EEC]">
                                <Send className="w-4 h-4 mr-2" />
                                Aplicar Ahora
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#8A4EFC] mb-1">{match.matchScore}%</div>
                            <div className="text-xs text-gray-500">Compatibilidad IA</div>
                            <div className="text-xs text-gray-400 mt-1">Embedding: {match.embedding_similarity}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="mt-6">
            <Card className="bg-[#1a0b3d] border-[#FF258D]/20">
              <CardHeader>
                <CardTitle className="text-white font-['League_Spartan']">Mis Matches con Empresas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {matches.map((match) => (
                    <div key={match.id} className="p-6 bg-[#0a0a0a]/50 rounded-lg border border-[#FF258D]/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-[#FF258D] rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white text-lg font-semibold">{match.company_name}</h3>
                            <p className="text-gray-400">{match.job_title}</p>
                            <p className="text-gray-500 text-sm">{new Date(match.match_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#FF258D] mb-1">
                            {match.similarity_percentage}%
                          </div>
                          <div className="text-sm text-gray-400">Similitud</div>
                          {getStatusBadge(match.status)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400 text-sm">Nivel de coincidencia</span>
                          <span className="text-[#FF258D] text-sm">{match.similarity_percentage}%</span>
                        </div>
                        <Progress value={match.similarity_percentage} className="h-2 bg-[#0a0a0a]" />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button 
                          className="bg-[#FF258D] hover:bg-[#FF258D]/80 text-white"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {matches.length === 0 && (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Aún no tienes matches</p>
                      <p className="text-gray-500 text-sm">Explora las ofertas laborales y prueba el match</p>
                      <Button 
                        className="mt-4 bg-[#FF258D] hover:bg-[#FF258D]/80 text-white"
                        onClick={() => setActiveTab('offers')}
                      >
                        Ver Ofertas
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Offers Tab */}
          <TabsContent value="offers" className="mt-6">
            <Card className="bg-[#1a0b3d] border-[#FF258D]/20">
              <CardHeader>
                <CardTitle className="text-white font-['League_Spartan']">Ofertas Laborales Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobOffers.map((job) => (
                    <div key={job.id} className="p-6 bg-[#0a0a0a]/50 rounded-lg border border-[#FF258D]/10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white text-lg font-semibold">{job.title}</h3>
                          <p className="text-gray-400">{job.company_name}</p>
                        </div>
                        <Badge className="bg-[#FF258D]">
                          {job.modality}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{job.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{job.location}</span>
                          </div>
                        </div>
                        
                        {job.salary && (
                          <div className="text-[#FF258D] font-semibold">
                            {job.salary}
                          </div>
                        )}

                        {job.similarity_percentage && (
                          <div className="bg-[#FF258D]/10 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm font-semibold">Similitud con tu perfil</span>
                              <span className="text-[#FF258D] font-bold">{job.similarity_percentage}%</span>
                            </div>
                            <Progress value={job.similarity_percentage} className="h-2 bg-[#0a0a0a]" />
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-white text-sm font-semibold mb-2">Requisitos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1 bg-[#FF258D] hover:bg-[#FF258D]/80 text-white"
                          onClick={() => handleTestMatch(job.id)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Probar MATCH
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Oferta
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-[#1a0b3d] border-[#FF258D]/20">
              <CardHeader>
                <CardTitle className="text-white font-['League_Spartan']">Mi Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-[#FF258D] rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">{studentData?.name?.charAt(0) || 'E'}</span>
                      </div>
                      <div>
                        <p className="text-gray-400">Email: {studentData?.email}</p>
                        <p className="text-gray-400">Carrera: {studentData?.career}</p>
                        <p className="text-gray-400">Ubicación: {studentData?.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-400 text-sm">Carrera</Label>
                        <p className="text-white">Ingeniería de Sistemas</p>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Universidad</Label>
                        <p className="text-white">Universidad Nacional</p>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Semestre</Label>
                        <p className="text-white">8°</p>
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Ubicación</Label>
                        <p className="text-white">Lima, Perú</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-4">Habilidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Python', 'SQL', 'TypeScript'].map((skill, index) => (
                        <Badge key={index} className="bg-[#FF258D]/20 text-[#FF258D] border-[#FF258D]/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 