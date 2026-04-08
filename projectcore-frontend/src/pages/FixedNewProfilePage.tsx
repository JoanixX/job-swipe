import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/lib/userContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/BottomNavigation";
import { getRandomImage } from "@/lib/mockImages";
import { UserWithProfile, Interest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ProfileSection from "@/components/ProfileSection";

export default function NewProfilePage() {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Tabs activos
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  // Estados para editar el perfil
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState<string>("");
  const [addInterestOpen, setAddInterestOpen] = useState(false);
  const [showAddExperienceDialog, setShowAddExperienceDialog] = useState(false);
  const [showAddEducationDialog, setShowAddEducationDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Diálogo de intereses
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [searchInterest, setSearchInterest] = useState("");
  
  // Datos de perfil
  const [profileCompletion, setProfileCompletion] = useState(35);
  const [userWithProfile, setUserWithProfile] = useState<UserWithProfile | null>(null);
  
  // Datos de experiencia/educación (simulados para mockup)
  const [experienceItems, setExperienceItems] = useState([
    {
      id: 1,
      position: "Asistente de Marketing",
      company: "Startup Innovación",
      logo: getRandomImage('business'),
      startDate: "Ene 2023",
      endDate: "Actual",
      description: "Manejo de redes sociales y creación de contenido para campañas digitales. Análisis de KPIs y estrategias de crecimiento."
    }
  ]);
  
  const [educationItems, setEducationItems] = useState([
    {
      id: 1,
      degree: "Ingeniería Informática",
      institution: "Universidad Nacional Mayor de San Marcos",
      logo: "https://replit.com/public/icons/replit-logo-dark.svg",
      startDate: "2020",
      endDate: "2024 (en curso)",
      description: "Especialización en desarrollo de software y sistemas de información. Promedio ponderado 16/20."
    }
  ]);
  
  // Estadísticas de actividad
  const [activityStats, setActivityStats] = useState({
    profileViews: 28,
    matchRequests: 5,
    acceptedMatches: 2,
    completionRate: 75,
    responseRate: 90
  });
  
  // Datos para matches
  const [matchItems, setMatchItems] = useState([
    {
      id: 1,
      name: "Tech Solutions Perú",
      logo: getRandomImage('business'),
      lastMessage: "Hola, nos gustaría conocer más sobre tu experiencia en desarrollo web.",
      timestamp: "Hace 2h",
      status: "online"
    },
    {
      id: 2,
      name: "Innova Consulting",
      logo: getRandomImage('business'),
      lastMessage: "¿Podrías compartir algunas muestras de tu trabajo?",
      timestamp: "Ayer",
      status: "offline"
    }
  ]);

  // Obtener datos de perfil
  useEffect(() => {
    // Simulamos que obtenemos datos del perfil
    setTimeout(() => {
      if (user) {
        setUserWithProfile({
          ...user,
          profile: {
            id: 1,
            userId: user.id,
            fullName: "Juan Pérez",
            bio: "Estudiante de Ingeniería Informática apasionado por el desarrollo web y la inteligencia artificial. Buscando oportunidades para aplicar mis conocimientos y adquirir experiencia en el mundo real.",
            education: "Universidad Nacional Mayor de San Marcos",
            profilePic: getRandomImage('student'),
            userType: "student",
            skills: "JavaScript, React, Node.js, Python, Machine Learning",
            availability: "Part-time",
            location: "Lima, Perú",
            contactEmail: "juan.perez@example.com",
            website: "https://juanperez.dev",
            completedProfile: true
          },
          interests: [
            { id: 1, name: "Desarrollo Web" },
            { id: 2, name: "Inteligencia Artificial" },
            { id: 3, name: "UX/UI Design" },
            { id: 4, name: "Marketing Digital" },
            { id: 5, name: "Emprendimiento" }
          ]
        });
        
        setUserInterests([
          { id: 1, name: "Desarrollo Web" },
          { id: 2, name: "Inteligencia Artificial" },
          { id: 3, name: "UX/UI Design" },
          { id: 4, name: "Marketing Digital" },
          { id: 5, name: "Emprendimiento" }
        ]);
        
        setBio("Estudiante de Ingeniería Informática apasionado por el desarrollo web y la inteligencia artificial. Buscando oportunidades para aplicar mis conocimientos y adquirir experiencia en el mundo real.");
      }
    }, 1000);
    
    // Cargamos algunos intereses para añadir
    setAvailableInterests([
      { id: 6, name: "Blockchain" },
      { id: 7, name: "Data Science" },
      { id: 8, name: "Cloud Computing" },
      { id: 9, name: "IoT" },
      { id: 10, name: "Ciberseguridad" },
      { id: 11, name: "E-commerce" },
      { id: 12, name: "Realidad Aumentada" },
      { id: 13, name: "Desarrollo Móvil" },
      { id: 14, name: "Big Data" },
      { id: 15, name: "Videojuegos" }
    ]);
  }, [user]);

  // Manejo de intereses
  const handleAddInterests = () => {
    if (selectedInterests.length > 0) {
      const newInterests = availableInterests.filter(interest => 
        selectedInterests.includes(interest.id)
      );
      
      setUserInterests(prev => [...prev, ...newInterests]);
      setAvailableInterests(prev => 
        prev.filter(interest => !selectedInterests.includes(interest.id))
      );
      
      toast({
        title: "Intereses añadidos",
        description: "Los intereses seleccionados han sido añadidos a tu perfil.",
      });
      
      setSelectedInterests([]);
      setAddInterestOpen(false);
    } else {
      toast({
        title: "Selecciona al menos un interés",
        description: "Debes seleccionar al menos un interés para añadir.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveInterest = (interestId: number) => {
    const interestToRemove = userInterests.find(i => i.id === interestId);
    
    if (interestToRemove) {
      setUserInterests(prev => prev.filter(i => i.id !== interestId));
      setAvailableInterests(prev => [...prev, interestToRemove]);
      
      toast({
        title: "Interés eliminado",
        description: `"${interestToRemove.name}" ha sido eliminado de tu perfil.`,
      });
    }
  };
  
  const handleSelectInterest = (interestId: number) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };
  
  // Guardar bio
  const handleSaveBio = () => {
    if (bio.trim().length < 10) {
      toast({
        title: "Descripción muy corta",
        description: "Por favor, ingresa una descripción más detallada de al menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulamos guardado
    setTimeout(() => {
      setIsEditingBio(false);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu biografía ha sido actualizada con éxito.",
      });
      
      // Actualizamos el perfil local
      if (userWithProfile && userWithProfile.profile) {
        setUserWithProfile({
          ...userWithProfile,
          profile: {
            ...userWithProfile.profile,
            bio: bio
          }
        });
      }
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10 h-16">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>
          
          <div className="flex items-center">
            <div className="hidden sm:flex items-center mr-6">
              <span className="text-sm text-gray-700 mr-2">Compartir perfil</span>
              <button className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
            
            <button onClick={() => setShowEditDialog(true)} className="bg-[#8A4EFC] hover:bg-[#7A3EEC] text-white rounded-full flex items-center justify-center h-10 px-4 text-sm font-medium shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span className="hidden sm:inline">Editar perfil</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Banner y foto de perfil */}
      <div className="bg-gradient-to-r from-[#8A4EFC]/90 to-[#FF9736]/90 h-40 mt-16">
        <div className="max-w-6xl mx-auto px-4 h-full relative">
          <div className="absolute -bottom-16 left-4 sm:left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group">
              <Avatar className="w-full h-full">
                <AvatarImage src={userWithProfile?.profile?.profilePic} alt={userWithProfile?.profile?.fullName} />
                <AvatarFallback className="text-3xl">
                  {userWithProfile?.profile?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-16 left-40 sm:left-44">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userWithProfile?.profile?.fullName}</h1>
                <p className="text-sm text-gray-600">{userWithProfile?.profile?.education}</p>
              </div>
              
              {!isMobile && (
                <div className="flex mt-2 sm:mt-0 sm:ml-8 space-x-4">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-xs text-gray-600">Disponible para chambas</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="text-xs text-gray-600">Lima, Perú</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs para escritorio */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 px-6 mt-16">
          <div className="w-full max-w-6xl mx-auto">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex justify-start w-full bg-transparent border-b border-gray-200 h-auto p-0">
                <TabsTrigger 
                  value="profile" 
                  className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-[#8A4EFC] data-[state=active]:text-[#8A4EFC] rounded-none bg-transparent hover:bg-transparent"
                >
                  Perfil
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-[#8A4EFC] data-[state=active]:text-[#8A4EFC] rounded-none bg-transparent hover:bg-transparent"
                >
                  Actividad
                </TabsTrigger>
                <TabsTrigger 
                  value="matches" 
                  className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-[#8A4EFC] data-[state=active]:text-[#8A4EFC] rounded-none bg-transparent hover:bg-transparent"
                >
                  Mis Matches
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-[#8A4EFC] data-[state=active]:text-[#8A4EFC] rounded-none bg-transparent hover:bg-transparent"
                >
                  Estadísticas
                </TabsTrigger>
              </TabsList>
      
              <div className="flex-1 overflow-y-auto">
                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                  {isMobile ? (
                    // Mobile layout - no tabs
                    <MobileProfileContent
                      bio={bio}
                      setBio={setBio}
                      isEditingBio={isEditingBio}
                      setIsEditingBio={setIsEditingBio}
                      userInterests={userInterests}
                      handleRemoveInterest={handleRemoveInterest}
                      setAddInterestOpen={setAddInterestOpen}
                      experienceItems={experienceItems}
                      setShowAddExperienceDialog={setShowAddExperienceDialog}
                      educationItems={educationItems}
                      setShowAddEducationDialog={setShowAddEducationDialog}
                      profileCompletion={profileCompletion}
                      activityStats={activityStats}
                      userWithProfile={userWithProfile}
                      handleSaveBio={handleSaveBio}
                    />
                  ) : (
                    // Desktop layout with tabs
                    <>
                      <TabsContent value="profile" className="m-0 p-0">
                        <div className="grid grid-cols-12 gap-6">
                          {/* Columna izquierda - Estadísticas */}
                          <div className="col-span-4">
                            <div className="space-y-6">
                              {/* Tarjeta de Perfil */}
                              <Card className="card-shadow-colored">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg">Progreso del Perfil</CardTitle>
                                  <CardDescription>Completa tu perfil para aumentar tus oportunidades</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600">Completado</span>
                                    <span className="text-sm font-medium text-[#8A4EFC]">{profileCompletion}%</span>
                                  </div>
                                  <Progress value={profileCompletion} className="h-2" />
                                  
                                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-2">Estadísticas de tu perfil</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Vistas de perfil</span>
                                        <span className="text-sm font-medium">{activityStats.profileViews}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Solicitudes de match</span>
                                        <span className="text-sm font-medium">{activityStats.matchRequests}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Matches aceptados</span>
                                        <span className="text-sm font-medium">{activityStats.acceptedMatches}</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              {/* Tarjeta de Intereses */}
                              <Card className="card-fancy">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex items-center justify-between">
                                    <div>Intereses</div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
                                      onClick={() => setAddInterestOpen(true)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                      </svg>
                                    </Button>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {userInterests.length > 0 ? (
                                      userInterests.map((interest) => (
                                        <Badge 
                                          key={interest.id} 
                                          variant="outline" 
                                          className="border-[#8A4EFC] text-[#8A4EFC] py-1 pl-2 pr-1 flex items-center cursor-pointer hover-glow"
                                        >
                                          {interest.name}
                                          <button 
                                            className="ml-1 bg-[#8A4EFC]/10 p-1 rounded-full hover:bg-[#8A4EFC]/20"
                                            onClick={() => handleRemoveInterest(interest.id)}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <line x1="18" y1="6" x2="6" y2="18"></line>
                                              <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                          </button>
                                        </Badge>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 text-sm">Aún no has añadido intereses. Haz clic en + para añadir.</p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                              
                              {/* Detalles de Contacto */}
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg">Detalles de Contacto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                      <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <div>
                                      <p className="text-sm font-medium">Email</p>
                                      <p className="text-sm text-gray-600">{userWithProfile?.profile?.contactEmail}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                      <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <div>
                                      <p className="text-sm font-medium">Ubicación</p>
                                      <p className="text-sm text-gray-600">{userWithProfile?.profile?.location}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                      <polyline points="15 3 21 3 21 9"></polyline>
                                      <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                    <div>
                                      <p className="text-sm font-medium">Website</p>
                                      <p className="text-sm text-[#8A4EFC] hover:underline">
                                        <a href={userWithProfile?.profile?.website} target="_blank" rel="noopener noreferrer">
                                          {userWithProfile?.profile?.website?.replace(/(^\w+:|^)\/\//, '')}
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                          
                          {/* Columna derecha - Información principal */}
                          <div className="col-span-8">
                            <div className="space-y-6">
                              {/* Acerca de mí */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center justify-between">
                                    <span>Sobre mí</span>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
                                      onClick={() => setIsEditingBio(true)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                      </svg>
                                    </Button>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {isEditingBio ? (
                                    <div className="space-y-4">
                                      <Textarea 
                                        value={bio} 
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Cuéntanos sobre ti, tus habilidades, intereses y objetivos..."
                                        className="min-h-[120px]"
                                      />
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setIsEditingBio(false);
                                            setBio(userWithProfile?.profile?.bio || "");
                                          }}
                                        >
                                          Cancelar
                                        </Button>
                                        <Button 
                                          className="bg-[#8A4EFC] hover:bg-[#7A3EEC]"
                                          onClick={handleSaveBio}
                                        >
                                          Guardar cambios
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700">
                                      {bio || "Todavía no has añadido información sobre ti. Haz clic en editar para añadir una descripción."}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                              
                              {/* Experiencia */}
                              <ProfileSection 
                                title="Experiencia" 
                                onEdit={() => setShowAddExperienceDialog(true)}
                                showEdit={true}
                                isEditing={false}
                                onSave={() => {}}
                                onCancel={() => {}}
                              >
                                <div className="space-y-4">
                                  {experienceItems.length > 0 ? (
                                    experienceItems.map((exp) => (
                                      <div key={exp.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mt-1">
                                          <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                          <p className="text-sm text-gray-700">{exp.company}</p>
                                          <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                          </svg>
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500">Todavía no has añadido experiencia. Haz clic en el botón de editar para añadir.</p>
                                  )}
                                </div>
                              </ProfileSection>
                              
                              {/* Educación */}
                              <ProfileSection 
                                title="Educación" 
                                onEdit={() => setShowAddEducationDialog(true)}
                                showEdit={true}
                                isEditing={false}
                                onSave={() => {}}
                                onCancel={() => {}}
                              >
                                <div className="space-y-4">
                                  {educationItems.length > 0 ? (
                                    educationItems.map((edu) => (
                                      <div key={edu.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mt-1">
                                          <img src={edu.logo} alt={edu.institution} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                          <p className="text-sm text-gray-700">{edu.institution}</p>
                                          <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                          <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                          </svg>
                                        </Button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500">Todavía no has añadido educación. Haz clic en el botón de editar para añadir.</p>
                                  )}
                                </div>
                              </ProfileSection>
                              
                              {/* Habilidades */}
                              <ProfileSection 
                                title="Habilidades" 
                                onEdit={() => {}}
                                showEdit={true}
                                isEditing={false}
                                onSave={() => {}}
                                onCancel={() => {}}
                              >
                                <div className="flex flex-wrap gap-2">
                                  {userWithProfile?.profile?.skills?.split(', ').map((skill, index) => (
                                    <Badge 
                                      key={index} 
                                      className="bg-[#8A4EFC]/10 hover:bg-[#8A4EFC]/20 text-[#8A4EFC] border-0"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </ProfileSection>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="activity" className="m-0 p-0">
                        <div className="text-center p-12">
                          <div className="w-24 h-24 bg-[#8A4EFC]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-ring">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="8" r="7"></circle>
                              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-gradient-animated">¡Próximamente!</h3>
                          <p className="text-gray-600 max-w-md mx-auto">
                            Estamos trabajando para traerte un registro detallado de tu actividad en PROJECT CORE.
                            Muy pronto podrás ver tu historial de interacciones, matches y mensajes aquí.
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="matches" className="m-0 p-0">
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-12">
                            <h2 className="text-2xl font-bold mb-6">Mis Matches</h2>
                            
                            {matchItems.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {matchItems.map((match) => (
                                  <Card key={match.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="flex items-start p-4">
                                      <div className="relative mr-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                          <img src={match.logo} alt={match.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${match.status === 'online' ? 'bg-green-500' : 'bg-gray-300'} border-2 border-white`}></div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-semibold text-gray-900 truncate">{match.name}</h4>
                                          <span className="text-xs text-gray-500">{match.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{match.lastMessage}</p>
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 flex justify-between">
                                      <Button variant="outline" size="sm" className="text-gray-700">Ver perfil</Button>
                                      <Button size="sm" className="bg-[#8A4EFC] hover:bg-[#7A3EEC]">Mensaje</Button>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center p-12 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-[#8A4EFC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                                  </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Aún no tienes matches</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                  Explora perfiles y encuentra tu chamba ideal para empezar a conectar con empresas que se ajusten a tus intereses y habilidades.
                                </p>
                                <Button className="mt-4 bg-[#8A4EFC] hover:bg-[#7A3EEC]">Explorar oportunidades</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="stats" className="m-0 p-0">
                        <div className="text-center p-12">
                          <div className="w-24 h-24 bg-[#8A4EFC]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-ring">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="3" y1="9" x2="21" y2="9"></line>
                              <line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-gradient-animated">¡Próximamente!</h3>
                          <p className="text-gray-600 max-w-md mx-auto">
                            Estamos trabajando para traerte estadísticas detalladas de tu actividad en PROJECT CORE.
                            Muy pronto podrás analizar tu rendimiento e interacciones aquí.
                          </p>
                        </div>
                      </TabsContent>
                    </>
                  )}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && <BottomNavigation activePage="profile" />}
      
      {/* Diálogos */}
      <Dialog open={addInterestOpen} onOpenChange={setAddInterestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-[#8A4EFC]">Añadir intereses</DialogTitle>
            <DialogDescription className="text-center">
              Selecciona los intereses que deseas añadir a tu perfil.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="relative">
              <Input
                placeholder="Buscar intereses"
                value={searchInterest}
                onChange={(e) => setSearchInterest(e.target.value)}
                className="pr-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
              {availableInterests
                .filter((interest) =>
                  interest.name.toLowerCase().includes(searchInterest.toLowerCase())
                )
                .length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableInterests
                      .filter((interest) =>
                        interest.name.toLowerCase().includes(searchInterest.toLowerCase())
                      )
                      .map((interest) => (
                        <Badge
                          key={interest.id}
                          variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                          className={`cursor-pointer py-1.5 px-2.5 ${
                            selectedInterests.includes(interest.id)
                              ? "bg-[#8A4EFC] hover:bg-[#7A3EEC]"
                              : "border-[#8A4EFC] text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
                          }`}
                          onClick={() => handleSelectInterest(interest.id)}
                        >
                          {interest.name}
                        </Badge>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-2">
                    No se encontraron intereses. Intenta con otra búsqueda.
                  </p>
                )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setAddInterestOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#8A4EFC] hover:bg-[#7A3EEC]" 
              onClick={handleAddInterests}
              disabled={selectedInterests.length === 0}
            >
              Añadir seleccionados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAddExperienceDialog} onOpenChange={setShowAddExperienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Experiencia</DialogTitle>
            <DialogDescription>
              Ingresa los detalles de tu experiencia laboral.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Puesto
                </Label>
                <Input id="position" className="col-span-3" placeholder="Ej: Desarrollador Frontend" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Empresa
                </Label>
                <Input id="company" className="col-span-3" placeholder="Ej: Tech Solutions SAC" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  Fecha inicio
                </Label>
                <Input id="start-date" className="col-span-3" placeholder="Ej: Enero 2022" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  Fecha fin
                </Label>
                <Input id="end-date" className="col-span-3" placeholder="Ej: Actual o Diciembre 2022" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Descripción
                </Label>
                <Textarea 
                  id="description" 
                  className="col-span-3 min-h-[100px]" 
                  placeholder="Describe brevemente tus responsabilidades y logros en este puesto." 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExperienceDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#8A4EFC] hover:bg-[#7A3EEC]">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAddEducationDialog} onOpenChange={setShowAddEducationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Educación</DialogTitle>
            <DialogDescription>
              Ingresa los detalles de tu formación académica.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="degree" className="text-right">
                  Título
                </Label>
                <Input id="degree" className="col-span-3" placeholder="Ej: Ingeniería de Sistemas" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institution" className="text-right">
                  Institución
                </Label>
                <Input id="institution" className="col-span-3" placeholder="Ej: Universidad Nacional Mayor de San Marcos" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edu-start-date" className="text-right">
                  Año inicio
                </Label>
                <Input id="edu-start-date" className="col-span-3" placeholder="Ej: 2018" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edu-end-date" className="text-right">
                  Año fin
                </Label>
                <Input id="edu-end-date" className="col-span-3" placeholder="Ej: 2023 o En curso" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edu-description" className="text-right pt-2">
                  Descripción
                </Label>
                <Textarea 
                  id="edu-description" 
                  className="col-span-3" 
                  placeholder="Información adicional como promedio, especialización, etc." 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEducationDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#8A4EFC] hover:bg-[#7A3EEC]">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Realiza cambios en tu información personal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={userWithProfile?.profile?.fullName || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="location"
                value={userWithProfile?.profile?.location || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                value={userWithProfile?.profile?.website || ""}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-[#8A4EFC] hover:bg-[#7A3EEC]"
              onClick={() => {
                handleSaveBio();
                setShowEditDialog(false);
                toast({
                  title: "¡Perfil actualizado!",
                  description: "Los cambios en tu perfil han sido guardados con éxito.",
                });
              }}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente para el contenido móvil
function MobileProfileContent({
  bio,
  setBio,
  isEditingBio,
  setIsEditingBio,
  userInterests,
  handleRemoveInterest,
  setAddInterestOpen,
  experienceItems,
  setShowAddExperienceDialog,
  educationItems,
  setShowAddEducationDialog,
  profileCompletion,
  activityStats,
  userWithProfile,
  handleSaveBio
}) {
  return (
    <div className="space-y-6">
      {/* Progreso de perfil */}
      <Card className="card-shadow-colored animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Progreso del perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Completado</span>
            <span className="text-sm font-medium text-[#8A4EFC]">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
          
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#8A4EFC]/10">
              <span className="text-lg font-bold text-[#8A4EFC]">{activityStats.profileViews}</span>
              <span className="text-xs text-gray-600">Vistas</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#FF9736]/10">
              <span className="text-lg font-bold text-[#FF9736]">{activityStats.matchRequests}</span>
              <span className="text-xs text-gray-600">Solicitudes</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#30C971]/10">
              <span className="text-lg font-bold text-[#30C971]">{activityStats.acceptedMatches}</span>
              <span className="text-xs text-gray-600">Matches</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* About Me */}
      <Card className="card-fancy animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Sobre mí
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
              onClick={() => setIsEditingBio(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingBio ? (
            <div className="space-y-4">
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                placeholder="Cuéntanos sobre ti, tus habilidades, intereses y objetivos..."
                className="min-h-[120px]"
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsEditingBio(false);
                    setBio(userWithProfile?.profile?.bio || "");
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveBio}
                  className="bg-[#8A4EFC] hover:bg-[#7A3EEC]"
                >
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">
              {bio || "Todavía no has añadido información sobre ti. Haz clic en editar para añadir una descripción."}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Intereses */}
      <Card className="card-fancy animate-fade-in" style={{animationDelay: '0.1s'}}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Intereses
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
              onClick={() => setAddInterestOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userInterests.length > 0 ? (
              userInterests.map((interest) => (
                <Badge 
                  key={interest.id} 
                  variant="outline" 
                  className="border-[#8A4EFC] text-[#8A4EFC] py-1 pl-2 pr-1 flex items-center cursor-pointer hover-glow"
                >
                  {interest.name}
                  <button 
                    className="ml-1 bg-[#8A4EFC]/10 p-1 rounded-full hover:bg-[#8A4EFC]/20"
                    onClick={() => handleRemoveInterest(interest.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Aún no has añadido intereses. Haz clic en + para añadir.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Experiencia */}
      <Card className="card-shadow-colored animate-fade-in" style={{animationDelay: '0.2s'}}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Experiencia
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
              onClick={() => setShowAddExperienceDialog(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experienceItems.length > 0 ? (
              experienceItems.map((exp) => (
                <div key={exp.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mt-1">
                    <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-sm text-gray-700">{exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Todavía no has añadido experiencia. Haz clic en + para añadir.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Educación */}
      <Card className="card-shadow-colored animate-fade-in" style={{animationDelay: '0.3s'}}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#8A4EFC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
              </svg>
              Educación
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#8A4EFC] hover:bg-[#8A4EFC]/10"
              onClick={() => setShowAddEducationDialog(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {educationItems.length > 0 ? (
              educationItems.map((edu) => (
                <div key={edu.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mt-1">
                    <img src={edu.logo} alt={edu.institution} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Todavía no has añadido educación. Haz clic en + para añadir.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}