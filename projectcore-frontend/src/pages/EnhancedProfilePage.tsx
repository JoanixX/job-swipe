import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getRandomImage } from "@/lib/mockImages";
import LogoutButton from "@/components/LogoutButton";
import BottomNavigation from "@/components/BottomNavigation";
import FeatureNotification from "@/components/FeatureNotification";
import CustomizableProfileSection from "@/components/CustomizableProfileSection";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Globe,
  Calendar,
  Activity,
  Tag,
  Plus,
  Clock,
  BookOpen,
  Award,
  Heart,
  Users,
  Settings,
  MessageSquare,
  BellRing
} from "lucide-react";

export default function EnhancedProfilePage() {
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Estados para la UI
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showAddInterestDialog, setShowAddInterestDialog] = useState(false);
  const [showAddExperienceDialog, setShowAddExperienceDialog] = useState(false);
  const [showAddEducationDialog, setShowAddEducationDialog] = useState(false);
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  
  // Estados para la personalización
  const [customSections, setCustomSections] = useState<
    Array<{
      id: string;
      title: string;
      icon: keyof typeof iconMap;
      order: number;
      visible: boolean;
      content?: string;
    }>
  >([]);
  
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionIcon, setNewSectionIcon] = useState<keyof typeof iconMap>("BookOpen");
  
  // Datos de perfil para modo demostración
  const [profileData, setProfileData] = useState({
    fullName: user?.username || "Usuario de PROJECT CORE",
    bio: "Estudiante de Ingeniería apasionado por la tecnología y la innovación.",
    profilePic: getRandomImage('student'),
    userType: user?.userType || "student",
    location: "Lima, Perú",
    education: [],
    experience: [],
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "UX/UI Design"],
    interests: ["Tecnología", "Innovación", "Desarrollo Web", "Startups", "Marketing Digital"],
    website: "https://example.com",
    contactEmail: user?.email || "usuario@example.com",
    completionPercentage: 75
  });
  
  // Mapeo de iconos
  const iconMap = {
    User: <User className="h-5 w-5" />,
    Briefcase: <Briefcase className="h-5 w-5" />,
    GraduationCap: <GraduationCap className="h-5 w-5" />,
    MapPin: <MapPin className="h-5 w-5" />,
    Mail: <Mail className="h-5 w-5" />,
    Globe: <Globe className="h-5 w-5" />,
    Calendar: <Calendar className="h-5 w-5" />,
    Activity: <Activity className="h-5 w-5" />,
    Tag: <Tag className="h-5 w-5" />,
    BookOpen: <BookOpen className="h-5 w-5" />,
    Award: <Award className="h-5 w-5" />,
    Heart: <Heart className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Settings: <Settings className="h-5 w-5" />,
    MessageSquare: <MessageSquare className="h-5 w-5" />,
    BellRing: <BellRing className="h-5 w-5" />
  };
  
  // Educación, experiencia y estadísticas
  const [educationItems, setEducationItems] = useState([
    {
      id: 1,
      title: "Universidad Nacional Mayor de San Marcos",
      degree: "Ingeniería de Sistemas",
      startDate: "2019",
      endDate: "2023",
      description: "Especialización en desarrollo de software y sistemas de información."
    }
  ]);
  
  const [experienceItems, setExperienceItems] = useState([
    {
      id: 1,
      company: "TechStart Peru",
      role: "Desarrollador Web Junior",
      startDate: "2022",
      endDate: "Presente",
      description: "Desarrollo de aplicaciones web utilizando React, Node.js y bases de datos SQL."
    }
  ]);
  
  const [activityStats, setActivityStats] = useState({
    profileViews: 48,
    matchRequests: 5,
    pendingMatches: 3,
    completedProjects: 2
  });
  
  // Funciones para gestionar el perfil
  const handleAddEducation = (education: any) => {
    setEducationItems([...educationItems, { ...education, id: Date.now() }]);
    setShowAddEducationDialog(false);
    toast({
      title: "Educación añadida",
      description: "Se ha añadido la información educativa a tu perfil"
    });
  };
  
  const handleAddExperience = (experience: any) => {
    setExperienceItems([...experienceItems, { ...experience, id: Date.now() }]);
    setShowAddExperienceDialog(false);
    toast({
      title: "Experiencia añadida",
      description: "Se ha añadido la experiencia laboral a tu perfil"
    });
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill("");
      toast({
        title: "Habilidad añadida",
        description: "Se ha añadido la habilidad a tu perfil"
      });
    }
    setShowAddSkillDialog(false);
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
    toast({
      title: "Habilidad eliminada",
      description: "Se ha eliminado la habilidad de tu perfil"
    });
  };
  
  const handleSaveBio = () => {
    setProfileData({
      ...profileData,
      bio: bio
    });
    setIsEditingBio(false);
    toast({
      title: "Biografía actualizada",
      description: "Tu biografía ha sido actualizada exitosamente"
    });
  };
  
  // Función para añadir una nueva sección personalizada
  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      const newSection = {
        id: `section-${Date.now()}`,
        title: newSectionTitle,
        icon: newSectionIcon,
        order: customSections.length,
        visible: true,
        content: ""
      };
      
      setCustomSections([...customSections, newSection]);
      setNewSectionTitle("");
      setShowAddSectionDialog(false);
      
      toast({
        title: "Sección añadida",
        description: "Se ha añadido una nueva sección a tu perfil"
      });
    }
  };
  
  // Gestión de la posición de secciones
  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    const sections = [...customSections];
    const index = sections.findIndex(s => s.id === id);
    
    if (direction === 'up' && index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    }
    
    setCustomSections(sections.map((section, i) => ({ ...section, order: i })));
  };
  
  // Eliminar sección
  const handleDeleteSection = (id: string) => {
    setCustomSections(customSections.filter(section => section.id !== id));
    toast({
      title: "Sección eliminada",
      description: "Se ha eliminado la sección de tu perfil"
    });
  };
  
  // Efectos iniciales
  useEffect(() => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    
    setBio(profileData.bio);
    
    // Verificamos si ya hay secciones personalizadas guardadas
    if (customSections.length === 0) {
      setCustomSections([
        {
          id: 'section-portfolio',
          title: 'Portafolio',
          icon: 'BookOpen',
          order: 0,
          visible: true,
          content: "Agrega enlaces a tus proyectos destacados aquí."
        },
        {
          id: 'section-testimonials',
          title: 'Testimonios',
          icon: 'MessageSquare',
          order: 1,
          visible: true,
          content: "Comparte lo que otros han dicho sobre tu trabajo."
        }
      ]);
    }
  }, [user, setLocation]);
  
  // RENDERIZADO DE LA PÁGINA
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de navegación superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm mr-3">
              <AvatarImage src={profileData.profilePic} alt={profileData.fullName} />
              <AvatarFallback>{profileData.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-slate-800">{profileData.fullName}</h2>
              <p className="text-xs text-slate-500">
                {profileData.userType === 'student' ? 'Estudiante' : 'Empresa'}
              </p>
            </div>
          </div>
          
          {!isMobile && (
            <div className="flex items-center space-x-2">
              <LogoutButton size="sm" />
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 justify-start">
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="settings">Ajustes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            {/* Información básica de Perfil */}
            <CustomizableProfileSection
              title="Información Personal"
              icon={<User className="h-5 w-5" />}
              isEditing={isEditingBio}
              onEditToggle={() => {
                setIsEditingBio(!isEditingBio);
                setBio(profileData.bio);
              }}
              onSave={handleSaveBio}
              onCancel={() => {
                setIsEditingBio(false);
                setBio(profileData.bio);
              }}
            >
              {isEditingBio ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Cuéntanos sobre ti..."
                      className="resize-none"
                      rows={5}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600">{profileData.bio}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                      {profileData.location}
                    </div>
                    
                    {profileData.website && (
                      <div className="flex items-center text-sm text-slate-500">
                        <Globe className="h-4 w-4 mr-1 text-slate-400" />
                        <a 
                          href={profileData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-[hsl(var(--primary))] hover:underline"
                        >
                          {profileData.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-slate-500">
                      <Mail className="h-4 w-4 mr-1 text-slate-400" />
                      {profileData.contactEmail}
                    </div>
                  </div>
                </div>
              )}
            </CustomizableProfileSection>
            
            {/* Habilidades */}
            <CustomizableProfileSection
              title="Habilidades"
              icon={<Award className="h-5 w-5" />}
              onEditToggle={() => setShowAddSkillDialog(true)}
            >
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="group transition-all px-3 py-1 bg-slate-100 hover:bg-slate-200"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-slate-500 border-dashed" 
                  onClick={() => setShowAddSkillDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir
                </Button>
              </div>
            </CustomizableProfileSection>
            
            {/* Intereses */}
            <CustomizableProfileSection
              title="Intereses"
              icon={<Heart className="h-5 w-5" />}
              onEditToggle={() => setShowAddInterestDialog(true)}
            >
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
                  >
                    {interest}
                  </Badge>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-slate-500 border-dashed" 
                  onClick={() => setShowAddInterestDialog(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir
                </Button>
              </div>
              
              <FeatureNotification 
                title="Descubre oportunidades basadas en tus intereses"
                description="Tus intereses nos ayudan a encontrar las mejores oportunidades para ti."
                type="info"
              />
            </CustomizableProfileSection>
            
            {/* Educación */}
            <CustomizableProfileSection
              title="Educación"
              icon={<GraduationCap className="h-5 w-5" />}
              onEditToggle={() => setShowAddEducationDialog(true)}
            >
              {educationItems.length > 0 ? (
                <div className="space-y-4">
                  {educationItems.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-slate-200 pl-4 py-1">
                      <h4 className="font-medium text-slate-800">{edu.title}</h4>
                      <p className="text-slate-600">{edu.degree}</p>
                      <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                      {edu.description && (
                        <p className="text-sm text-slate-600 mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <GraduationCap className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-500 mb-4">Añade información sobre tu educación para destacar tus calificaciones.</p>
                  <Button onClick={() => setShowAddEducationDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir educación
                  </Button>
                </div>
              )}
              
              <FeatureNotification 
                title="¡Destaca tu formación académica!"
                description="Las empresas valoran tu formación. Mantén actualizada esta sección."
                type="info"
              />
            </CustomizableProfileSection>
            
            {/* Experiencia */}
            <CustomizableProfileSection
              title="Experiencia"
              icon={<Briefcase className="h-5 w-5" />}
              onEditToggle={() => setShowAddExperienceDialog(true)}
            >
              {experienceItems.length > 0 ? (
                <div className="space-y-4">
                  {experienceItems.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-slate-200 pl-4 py-1">
                      <h4 className="font-medium text-slate-800">{exp.role}</h4>
                      <p className="text-slate-600">{exp.company}</p>
                      <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</p>
                      {exp.description && (
                        <p className="text-sm text-slate-600 mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Briefcase className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-500 mb-4">Añade tu experiencia laboral para destacar tus habilidades prácticas.</p>
                  <Button onClick={() => setShowAddExperienceDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir experiencia
                  </Button>
                </div>
              )}
              
              <FeatureNotification 
                title="¿Primer trabajo? ¡No te preocupes!"
                description="Si estás buscando tu primera experiencia, destaca proyectos académicos o voluntariados."
                type="info"
              />
            </CustomizableProfileSection>
            
            {/* Secciones personalizadas */}
            {customSections.map((section) => (
              <CustomizableProfileSection
                key={section.id}
                title={section.title}
                icon={iconMap[section.icon]}
                onEditToggle={() => {
                  // Lógica para editar la sección personalizada
                }}
                reorderable
                onMoveUp={() => handleMoveSection(section.id, 'up')}
                onMoveDown={() => handleMoveSection(section.id, 'down')}
                onDelete={() => handleDeleteSection(section.id)}
              >
                {section.content ? (
                  <p className="text-slate-600">{section.content}</p>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
                    <p className="text-slate-500">Esta sección está vacía. Haz clic en Editar para añadir contenido.</p>
                  </div>
                )}
              </CustomizableProfileSection>
            ))}
            
            {/* Botón para añadir nueva sección */}
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full border-dashed border-slate-300 hover:border-slate-400 py-6"
                onClick={() => setShowAddSectionDialog(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Añadir nueva sección personalizada
              </Button>
            </div>
            
            {/* Notificación de funciones próximas */}
            <FeatureNotification
              title="CHAMBEAZO está en desarrollo"
              description="Estamos trabajando para optimizar el algoritmo de matching. Pronto podrás encontrar más oportunidades alineadas con tu perfil."
              type="coming-soon"
              actionLabel="Saber más"
              onAction={() => toast({
                title: "¡Estamos construyendo CHAMBEAZO!",
                description: "Pronto recibirás notificaciones cuando haya un match perfecto para ti."
              })}
            />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6">
            <CustomizableProfileSection
              title="Resumen de actividad"
              icon={<Activity className="h-5 w-5" />}
              editable={false}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Vistas de perfil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{activityStats.profileViews}</span>
                      <span className="text-xs text-green-600 font-medium">+12% esta semana</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Solicitudes de match</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{activityStats.matchRequests}</span>
                      <span className="text-xs text-green-600 font-medium">3 nuevas</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Matches pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{activityStats.pendingMatches}</span>
                      <span className="text-xs text-amber-600 font-medium">Esperando respuesta</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Proyectos completados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{activityStats.completedProjects}</span>
                      <span className="text-xs text-slate-500 font-medium">Total</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <FeatureNotification
                title="Estadísticas en desarrollo"
                description="Estamos trabajando para ofrecerte estadísticas más detalladas sobre tu actividad en la plataforma."
                type="coming-soon"
              />
            </CustomizableProfileSection>
            
            <CustomizableProfileSection
              title="Completitud del perfil"
              icon={<Tag className="h-5 w-5" />}
              editable={false}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Progreso general</span>
                    <span className="text-sm font-medium text-slate-700">{profileData.completionPercentage}%</span>
                  </div>
                  <Progress value={profileData.completionPercentage} className="h-2" />
                </div>
                
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-700">Información personal</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Completo
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-700">Educación</span>
                    </div>
                    <Badge variant="outline" className={`
                      ${educationItems.length > 0 ? 
                        "bg-green-50 text-green-700 border-green-200" : 
                        "bg-amber-50 text-amber-700 border-amber-200"}
                    `}>
                      {educationItems.length > 0 ? "Completo" : "Pendiente"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-700">Experiencia</span>
                    </div>
                    <Badge variant="outline" className={`
                      ${experienceItems.length > 0 ? 
                        "bg-green-50 text-green-700 border-green-200" : 
                        "bg-amber-50 text-amber-700 border-amber-200"}
                    `}>
                      {experienceItems.length > 0 ? "Completo" : "Pendiente"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-sm text-slate-700">Habilidades</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Completo
                    </Badge>
                  </div>
                </div>
              </div>
            </CustomizableProfileSection>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <CustomizableProfileSection
              title="Ajustes de cuenta"
              icon={<Settings className="h-5 w-5" />}
              editable={false}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    value={profileData.contactEmail}
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-1">Para cambiar tu correo, contacta con soporte.</p>
                </div>
                
                <div>
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={user?.username || ""}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="mr-2">
                    Cambiar contraseña
                  </Button>
                  
                  <LogoutButton variant="destructive" />
                </div>
              </div>
              
              <FeatureNotification
                title="Seguridad de cuenta"
                description="Te recomendamos cambiar tu contraseña regularmente para mantener tu cuenta segura."
                type="warning"
              />
            </CustomizableProfileSection>
            
            <CustomizableProfileSection
              title="Configuración de notificaciones"
              icon={<BellRing className="h-5 w-5" />}
              editable={false}
            >
              <FeatureNotification
                title="Sistema de notificaciones en desarrollo"
                description="Pronto podrás personalizar qué notificaciones quieres recibir y cómo."
                type="coming-soon"
              />
            </CustomizableProfileSection>
          </TabsContent>
        </Tabs>
      </main>
      
      {isMobile && <BottomNavigation activePage="profile" />}
      
      {/* Diálogos */}
      <Dialog open={showAddSkillDialog} onOpenChange={setShowAddSkillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir nueva habilidad</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skill">Habilidad</Label>
              <Input
                id="skill"
                placeholder="Ej: Diseño UX/UI, React Native, SEO..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSkillDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddSkill}>Añadir habilidad</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAddExperienceDialog} onOpenChange={setShowAddExperienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir experiencia laboral</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" placeholder="Nombre de la empresa" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input id="role" placeholder="Tu cargo o puesto" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha inicio</Label>
                <Input id="startDate" placeholder="Ej: 2020" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha fin</Label>
                <Input id="endDate" placeholder="Ej: 2022 o Presente" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tus responsabilidades y logros"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddExperienceDialog(false)}>Cancelar</Button>
            <Button onClick={() => handleAddExperience({
              company: (document.getElementById('company') as HTMLInputElement).value,
              role: (document.getElementById('role') as HTMLInputElement).value,
              startDate: (document.getElementById('startDate') as HTMLInputElement).value,
              endDate: (document.getElementById('endDate') as HTMLInputElement).value,
              description: (document.getElementById('description') as HTMLTextAreaElement).value
            })}>Añadir experiencia</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAddEducationDialog} onOpenChange={setShowAddEducationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir educación</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institución</Label>
              <Input id="institution" placeholder="Nombre de la institución educativa" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree">Título o grado</Label>
              <Input id="degree" placeholder="Ej: Licenciatura en Ingeniería" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eduStartDate">Fecha inicio</Label>
                <Input id="eduStartDate" placeholder="Ej: 2018" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eduEndDate">Fecha fin</Label>
                <Input id="eduEndDate" placeholder="Ej: 2022 o Presente" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eduDescription">Descripción</Label>
              <Textarea
                id="eduDescription"
                placeholder="Especialización, logros académicos, etc."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEducationDialog(false)}>Cancelar</Button>
            <Button onClick={() => handleAddEducation({
              title: (document.getElementById('institution') as HTMLInputElement).value,
              degree: (document.getElementById('degree') as HTMLInputElement).value,
              startDate: (document.getElementById('eduStartDate') as HTMLInputElement).value,
              endDate: (document.getElementById('eduEndDate') as HTMLInputElement).value,
              description: (document.getElementById('eduDescription') as HTMLTextAreaElement).value
            })}>Añadir educación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAddSectionDialog} onOpenChange={setShowAddSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir nueva sección</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sectionTitle">Título de la sección</Label>
              <Input
                id="sectionTitle"
                placeholder="Ej: Proyectos destacados, Certificaciones..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sectionIcon">Ícono</Label>
              <select
                id="sectionIcon"
                className="w-full rounded-md border border-slate-300 py-2 px-3"
                value={newSectionIcon}
                onChange={(e) => setNewSectionIcon(e.target.value as keyof typeof iconMap)}
              >
                {Object.keys(iconMap).map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSectionDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddSection}>Añadir sección</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}