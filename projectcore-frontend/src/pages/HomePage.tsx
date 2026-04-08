import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import { getRandomImage } from "@/lib/mockImages";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('oportunidades');
  
  // Datos de usuario y coincidencias
  const { data: userWithProfile, isLoading } = useQuery({
    queryKey: ['/api/users', user?.id],
    enabled: !!user?.id,
  });
  
  const { data: matches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ['/api/users', user?.id, 'matches'],
    enabled: !!user?.id,
  });

  // Calcular porcentaje de perfil completado
  useEffect(() => {
    if (userWithProfile) {
      let score = 0;
      const totalFields = 5;
      
      // Verificar de manera segura las propiedades
      const profile = (userWithProfile as any)?.profile || {};
      const interests = (userWithProfile as any)?.interests || [];
      
      if (profile.bio) score++;
      if (interests.length > 0) score++;
      if (user?.userType) score++;

      setProfileCompletion(Math.round((score / totalFields) * 100));
    }
  }, [userWithProfile, user]);
  
  // Asegurar que matches sea un array
  const matchesList = Array.isArray(matches) ? matches : [];
  const hasMatches = matchesList.length > 0;
  
  // Animación para contador de coincidencias
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (hasMatches) {
      const targetCount = matchesList.length;
      const increment = Math.max(1, Math.floor(targetCount / 15));
      const interval = setInterval(() => {
        setCount(c => {
          if (c >= targetCount) {
            clearInterval(interval);
            return targetCount;
          }
          return Math.min(c + increment, targetCount);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [hasMatches, matchesList.length]);
  
  // Funciones de navegación
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const navigateToMatching = () => {
    setLocation("/matching");
  };
  
  const navigateToProfile = () => {
    setLocation("/profile");
  };

  // Datos ficticios para mostrar ejemplos de notificaciones y eventos
  const notifications = [
    { id: 1, type: 'match', message: 'Tienes un nuevo match con Startup Innovadora', time: 'Hace 2 horas', read: false },
    { id: 2, type: 'view', message: 'Tech Solutions vio tu perfil', time: 'Hace 1 día', read: true },
    { id: 3, type: 'event', message: 'Nuevo evento: Feria laboral virtual', time: 'Inicia en 3 días', read: true },
  ];

  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Webinar: Cómo destacar en tus primeras prácticas', 
      date: '10 de diciembre, 2023', 
      time: '18:00 - 19:30',
      image: getRandomImage('networking')
    },
    { 
      id: 2, 
      title: 'Feria de Empleo Virtual', 
      date: '15 de diciembre, 2023', 
      time: '10:00 - 16:00',
      image: getRandomImage('networking')
    }
  ];

  // Lista de posibles proyectos o chambas
  const recommendedOpportunities = [
    { 
      id: 1, 
      title: 'Desarrollador Web Frontend', 
      company: 'Tech Solutions', 
      description: 'Buscamos un estudiante con conocimientos de React para desarrollo web',
      tags: ['React', 'Frontend', 'JavaScript'],
      matchPercentage: 85,
      image: getRandomImage('business')
    },
    { 
      id: 2, 
      title: 'Asistente de Marketing Digital', 
      company: 'Startup Innovadora', 
      description: 'Oportunidad para aprender sobre gestión de redes sociales y marketing digital',
      tags: ['Marketing', 'Redes Sociales', 'Digital'],
      matchPercentage: 78,
      image: getRandomImage('business')
    },
    { 
      id: 3, 
      title: 'Diseñador Gráfico', 
      company: 'Creativa SAC', 
      description: 'Buscamos talento para diseño de materiales publicitarios',
      tags: ['Diseño', 'Illustrator', 'Photoshop'],
      matchPercentage: 92,
      image: getRandomImage('business')
    }
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Fondo galáctico */}
        <div className="fixed inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        </div>
        <motion.div 
          className="flex flex-col items-center relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size="lg" showText={true} color="white" />
          <motion.div 
            className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mt-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.p 
            className="mt-6 text-white text-lg font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Preparando tu experiencia...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Fondo galáctico */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]" />
      </div>
      
      {/* Header moderno */}
      <motion.div 
        className="sticky top-0 z-50 bg-black/50 backdrop-blur-sm border-b border-purple-500/20 py-3 px-4 md:px-6 flex items-center justify-between"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Logo size={isMobile ? "sm" : "md"} />
        
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button 
              onClick={toggleNotifications}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-purple-500/30 bg-black/50 backdrop-blur-sm hover:bg-purple-500/20 relative shadow-lg shadow-purple-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              <motion.span 
                className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
              ></motion.span>
            </button>
            
            {/* Panel de Notificaciones */}
            {showNotifications && (
              <motion.div 
                className="absolute top-full right-0 mt-2 w-80 bg-black/80 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 z-30 overflow-hidden"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-3 border-b border-purple-500/20 flex justify-between items-center bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10">
                  <h3 className="font-semibold text-white">Notificaciones</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-500/20">
                    Marcar todas como leídas
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <motion.div 
                      key={notification.id} 
                      className={`p-3 hover:bg-purple-500/10 border-b border-purple-500/20 ${notification.read ? '' : 'bg-purple-500/20'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'match' ? 'bg-gradient-to-br from-green-400 to-green-500 text-white' : 
                          notification.type === 'view' ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white' : 
                          'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
                        }`}>
                          {notification.type === 'match' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          ) : notification.type === 'view' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-3 text-center bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10">
                  <Button variant="link" className="text-purple-400 text-sm font-medium hover:text-purple-300">
                    Ver todas las notificaciones
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {!isMobile && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="gap-2 hidden md:flex shadow-lg shadow-purple-500/20 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                onClick={navigateToProfile}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
                <span className="text-purple-400">Mi Perfil</span>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Área principal de contenido */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          
          {/* Contenido para versión de escritorio */}
          {!isMobile ? (
            <div className="grid grid-cols-12 gap-6">
              {/* Columna izquierda - Perfil y estadísticas */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <motion.div 
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden sticky top-24"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative h-32 bg-gradient-to-r from-violet-500 via-fuchsia-600 to-violet-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10"></div>
                    <div className="absolute -bottom-16 left-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                      >
                        <img 
                          src={(userWithProfile as any)?.profilePic || getRandomImage(user?.userType as 'student' | 'business')} 
                          alt={user?.fullName || "Usuario"} 
                          className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg shadow-purple-500/30"
                        />
                      </motion.div>
                    </div>
                  </div>
                  <div className="pt-20 pb-6 px-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-xl font-bold text-white">{user?.fullName || "Usuario"}</h2>
                      <p className="text-gray-300 text-sm">{user?.userType === 'student' ? 'Estudiante' : 'Empresa'}</p>
                      
                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Perfil completado</span>
                          <span className="text-sm font-medium text-purple-400">{profileCompletion}%</span>
                        </div>
                        <Progress value={profileCompletion} className="h-2 bg-black/50" />
                        
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            className="w-full mt-4 bg-gradient-to-r from-violet-500 via-fuchsia-600 to-violet-700 text-white border-none shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                            onClick={navigateToProfile}
                          >
                            Completar perfil
                          </Button>
                        </motion.div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-purple-500/20">
                        <h3 className="font-semibold text-white mb-4">Tus estadísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div 
                            className="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-xl p-4 text-center border border-purple-500/30"
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <motion.p 
                              className="text-3xl font-bold text-purple-400"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                            >
                              {count}
                            </motion.p>
                            <p className="text-xs font-medium text-gray-300 mt-1">Matches</p>
                          </motion.div>
                          <motion.div 
                            className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl p-4 text-center border border-yellow-500/30"
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <p className="text-3xl font-bold text-yellow-400">4</p>
                            <p className="text-xs font-medium text-gray-300 mt-1">Vistas de perfil</p>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Columna central - Feed principal */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9">
                {/* Chambazo Call to Action */}
                <motion.div 
                  className="bg-gradient-to-r from-violet-500 via-fuchsia-600 to-violet-700 rounded-xl shadow-2xl shadow-purple-500/30 overflow-hidden text-white mb-8 border border-purple-500/30"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-8 relative">
                    {/* Elementos decorativos animados */}
                    <motion.div 
                      className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mt-20 -mr-20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <motion.div 
                      className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -ml-16"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl font-extrabold mb-3 relative drop-shadow-[0_2px_16px_rgba(139,92,246,0.7)]">¡MYPE MATCH!</h2>
                      <p className="mb-6 opacity-90 max-w-lg relative text-lg">
                        Encuentra el match perfecto para tus habilidades y comienza a ganar experiencia laboral mientras estudias.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 relative">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            className="bg-yellow-500 hover:bg-yellow-600 shadow-lg text-white text-lg px-6 py-6 h-auto"
                            onClick={navigateToMatching}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <path d="m21 21-4.3-4.3"></path>
                            </svg>
                            Buscar oportunidades
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-6 py-6 h-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Ver matches
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Tabs para el contenido */}
                <motion.div 
                  className="bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="border-b border-purple-500/20">
                    <div className="flex">
                      <button
                        className={`py-4 px-6 focus:outline-none transition-colors ${
                          activeTab === 'oportunidades' 
                            ? 'text-purple-400 border-b-2 border-purple-500 font-semibold' 
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('oportunidades')}
                      >
                        Oportunidades
                      </button>
                      <button
                        className={`py-4 px-6 focus:outline-none transition-colors ${
                          activeTab === 'eventos' 
                            ? 'text-purple-400 border-b-2 border-purple-500 font-semibold' 
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('eventos')}
                      >
                        Eventos
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {activeTab === 'oportunidades' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-xl font-bold text-white">Oportunidades recomendadas</h2>
                            <p className="text-gray-300">Basado en tu perfil y preferencias</p>
                          </div>
                          <Button variant="outline" className="text-sm border-purple-500/30 text-purple-400 hover:bg-purple-500/10">Ver todas</Button>
                        </div>
                        
                        <div className="space-y-6">
                          {recommendedOpportunities.map((opportunity, idx) => (
                            <motion.div 
                              key={opportunity.id}
                              className="border border-purple-500/30 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * idx }}
                              whileHover={{ y: -5 }}
                            >
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/4 h-48 md:h-auto bg-gray-800 relative">
                                  <img 
                                    src={opportunity.image} 
                                    alt={opportunity.company} 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-3 left-3">
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-sm shadow-sm">
                                      {opportunity.matchPercentage}% match
                                    </Badge>
                                  </div>
                                </div>
                                <div className="p-5 md:p-6 md:w-3/4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-bold text-xl text-white mb-1">{opportunity.title}</h3>
                                      <p className="text-purple-400 font-medium">{opportunity.company}</p>
                                    </div>
                                    <motion.button 
                                      className="text-gray-400 hover:text-purple-400"
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                      </svg>
                                    </motion.button>
                                  </div>
                                  <p className="text-gray-300 my-4">{opportunity.description}</p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {opportunity.tags.map(tag => (
                                      <Badge key={tag} variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Button variant="outline" className="rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                                      Ver detalles
                                    </Button>
                                    <Button className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-violet-700 text-white shadow-lg shadow-purple-500/30">
                                      Aplicar ahora
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'eventos' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h2 className="text-xl font-bold text-white">Próximos eventos</h2>
                            <p className="text-gray-300">Expande tu red y aprende con profesionales</p>
                          </div>
                          <Button variant="outline" className="text-sm border-purple-500/30 text-purple-400 hover:bg-purple-500/10">Ver calendario</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {upcomingEvents.map((event, idx) => (
                            <motion.div 
                              key={event.id}
                              className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 border border-purple-500/30"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * idx }}
                              whileHover={{ y: -5 }}
                            >
                              <div className="h-48 bg-gradient-to-tr from-violet-500 to-fuchsia-600 relative">
                                <img 
                                  src={event.image} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                  <p className="text-sm font-medium">{event.date}</p>
                                  <p className="text-xs opacity-80">{event.time}</p>
                                </div>
                              </div>
                              <div className="p-5">
                                <h3 className="font-bold text-xl text-white mb-2">{event.title}</h3>
                                <p className="text-gray-300 mb-4">
                                  Únete a este evento para aprender de expertos y ampliar tus oportunidades profesionales.
                                </p>
                                
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                    Online
                                  </Badge>
                                  <Button className="bg-[#8A4EFC] hover:bg-[#7A3EEC]">
                                    Inscribirme
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-8">
                          <h3 className="font-semibold text-gray-800 mb-4">Eventos destacados</h3>
                          <Carousel>
                            <CarouselContent>
                              {[...Array(5)].map((_, idx) => (
                                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                                  <Card className="border-gray-200">
                                    <CardHeader className="p-4">
                                      <CardTitle className="text-lg">Feria de Empleo</CardTitle>
                                      <CardDescription>20 de diciembre</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                      <p className="text-sm text-gray-600">
                                        Conecta con más de 50 empresas en busca de talento joven.
                                      </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                      <Button variant="outline" className="w-full text-[#8A4EFC]">Ver evento</Button>
                                    </CardFooter>
                                  </Card>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            // Contenido para versión móvil
            <div className="space-y-6">
              {/* Banner de bienvenida */}
              <motion.div 
                className="bg-gradient-to-r from-[#8A4EFC] to-[#6D28D9] rounded-xl p-5 text-white relative overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mt-10 -mr-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <h2 className="text-xl font-bold mb-2">¡Hola, {user?.fullName?.split(' ')[0] || 'Usuario'}!</h2>
                <p className="text-sm opacity-90 mb-3">Completa tu perfil para encontrar mejores oportunidades.</p>
                
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Perfil completo al {profileCompletion}%</span>
                  <span>{profileCompletion}%</span>
                </div>
                <div className="w-full bg-white/30 h-1.5 rounded-full mb-3">
                  <motion.div 
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    className="bg-white text-[#8A4EFC] hover:bg-white/90 shadow-md"
                    onClick={navigateToProfile}
                  >
                    Completar perfil
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Acciones rápidas */}
              <motion.div 
                className="bg-white rounded-xl shadow-md p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="font-semibold text-gray-800 mb-3">Acciones rápidas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <motion.div 
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={navigateToMatching}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#8A4EFC]/10 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium">Buscar</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#8A4EFC]/10 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium">Mensajes</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={navigateToProfile}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#8A4EFC]/10 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="5"></circle>
                        <path d="M20 21a8 8 0 0 0-16 0"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium">Perfil</span>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* CHAMBAZO Button */}
              <motion.button
                className="w-full bg-gradient-to-r from-[#FFB800] to-[#FF8A00] text-white font-bold py-4 px-4 rounded-xl shadow-lg flex items-center justify-center"
                onClick={navigateToMatching}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                  </svg>
                </motion.div>
                ¡DAME UN CHAMBAZO!
              </motion.button>
              
              {/* Oportunidades recomendadas - Versión móvil */}
              <motion.div 
                className="bg-white rounded-xl shadow-md p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Oportunidades para ti</h3>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-[#8A4EFC]">Ver todas</Button>
                </div>
                <div className="space-y-4">
                  {recommendedOpportunities.slice(0, 2).map((opportunity, idx) => (
                    <motion.div 
                      key={opportunity.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-center p-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden mr-3">
                          <img 
                            src={opportunity.image} 
                            alt={opportunity.company} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">{opportunity.title}</h4>
                          <p className="text-xs text-[#8A4EFC]">{opportunity.company}</p>
                        </div>
                        <div className="ml-auto">
                          <Badge className="bg-green-500 text-xs">
                            {opportunity.matchPercentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="px-3 pb-3">
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{opportunity.description}</p>
                        <div className="flex gap-2 mb-3">
                          {opportunity.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-[#8A4EFC] text-[#8A4EFC]">
                              {tag}
                            </Badge>
                          ))}
                          {opportunity.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                              +{opportunity.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" className="w-full bg-[#8A4EFC] hover:bg-[#7A3EEC] text-xs h-8">
                          Ver detalles
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Eventos - Versión móvil */}
              <motion.div 
                className="bg-white rounded-xl shadow-md p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h3 className="font-semibold text-gray-800 mb-4">Próximos eventos</h3>
                <Carousel>
                  <CarouselContent>
                    {upcomingEvents.map((event, idx) => (
                      <CarouselItem key={event.id}>
                        <Card className="border-gray-200">
                          <CardHeader className="p-4 pb-0">
                            <div className="h-32 -mx-4 -mt-4 mb-3">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <CardDescription className="text-xs">{event.date} • {event.time}</CardDescription>
                          </CardHeader>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full bg-[#8A4EFC] hover:bg-[#7A3EEC] text-xs">Inscribirme</Button>
                          </CardFooter>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom navigation for mobile */}
      {isMobile && (
        <BottomNavigation activePage="home" />
      )}
    </div>
  );
}