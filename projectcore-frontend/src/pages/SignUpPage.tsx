import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/userContext";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const universidades = [
  "Universidad Nacional Mayor de San Marcos",
  "Pontificia Universidad Católica del Perú",
  "Universidad de Lima",
  "Universidad Nacional de Ingeniería",
  "Universidad del Pacífico",
  "Universidad Peruana de Ciencias Aplicadas",
  "Universidad San Ignacio de Loyola",
  "Universidad Nacional Agraria La Molina",
  "Universidad Científica del Sur",
  "Universidad Nacional Federico Villarreal",
  "Otra",
];

const carreras = [
  "Ingeniería de Sistemas",
  "Ingeniería Informática",
  "Ciencias de la Computación",
  "Ingeniería de Software",
  "Administración de Empresas",
  "Contabilidad",
  "Marketing",
  "Economía",
  "Derecho",
  "Medicina",
  "Psicología",
  "Comunicaciones",
  "Diseño Gráfico",
  "Arquitectura",
  "Otra",
];

const signupStudentSchema = z.object({
  fullName: z.string().min(3, "El nombre completo debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  institutionalEmail: z.string().email("Email institucional inválido").optional().or(z.literal("")),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
  university: z.string().min(1, "Selecciona una universidad"),
  career: z.string().min(1, "Selecciona una carrera"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const signupBusinessSchema = z.object({
  fullName: z.string().min(3, "El nombre completo debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
  businessName: z.string().min(3, "El nombre de la empresa debe tener al menos 3 caracteres"),
  businessType: z.string().min(1, "Selecciona un tipo de empresa"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type SignupStudentFormValues = z.infer<typeof signupStudentSchema>;
type SignupBusinessFormValues = z.infer<typeof signupBusinessSchema>;

export default function SignUpPage() {
  const [_, setLocation] = useLocation();
  const { register, setUserType } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("student");
  
  // Detect user type from local storage
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setActiveTab(storedUserType);
    }
  }, []);
  
  const studentForm = useForm<SignupStudentFormValues>({
    resolver: zodResolver(signupStudentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      institutionalEmail: "",
      username: "",
      password: "",
      confirmPassword: "",
      university: "",
      career: "",
    },
  });
  
  const businessForm = useForm<SignupBusinessFormValues>({
    resolver: zodResolver(signupBusinessSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      businessType: "",
    },
  });
  
  const onStudentSubmit = async (data: SignupStudentFormValues) => {
    setIsSubmitting(true);
    
    try {
      await register({
        ...data,
        userType: "student",
      });
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada con éxito.",
      });
      
      // Navigate to loading screen
      setLocation("/loading");
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error al crear tu cuenta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onBusinessSubmit = async (data: SignupBusinessFormValues) => {
    setIsSubmitting(true);
    
    try {
      await register({
        ...data,
        userType: "business",
      });
      
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada con éxito.",
      });
      
      // Navigate to loading screen
      setLocation("/loading");
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error al crear tu cuenta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goBack = () => {
    setLocation("/motivation");
  };

  const handleLoginRedirect = () => {
    setLocation("/login");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={goBack}
            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <Logo size="sm" />
        </div>
        <button 
          onClick={handleLoginRedirect}
          className="text-[#8A4EFC] font-semibold hover:underline"
        >
          Ya tengo una cuenta
        </button>
      </header>
      
      <div className="flex-1 flex py-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row px-6">
          {/* Left side - Form */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl p-8 max-w-xl mx-auto">
              <h1 className="text-3xl font-extrabold mb-8 text-center text-[#8A4EFC]">¡Crea tu cuenta!</h1>
              
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid grid-cols-2 w-full mb-8">
                  <TabsTrigger 
                    value="student" 
                    className="text-base py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#8A4EFC]"
                  >
                    Estudiante
                  </TabsTrigger>
                  <TabsTrigger 
                    value="business" 
                    className="text-base py-3 data-[state=active]:border-b-2 data-[state=active]:border-[#8A4EFC]"
                  >
                    Empresa
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="student" className="mt-0">
                  <Form {...studentForm}>
                    <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-5">
                      <div className="space-y-5">
                        <FormField
                          control={studentForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Nombre completo</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Tu nombre completo" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={studentForm.control}
                            name="university"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Universidad</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3">
                                      <SelectValue placeholder="Selecciona tu universidad" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {universidades.map((uni) => (
                                      <SelectItem key={uni} value={uni}>
                                        {uni}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={studentForm.control}
                            name="career"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Carrera</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3">
                                      <SelectValue placeholder="Selecciona tu carrera" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {carreras.map((carrera) => (
                                      <SelectItem key={carrera} value={carrera}>
                                        {carrera}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={studentForm.control}
                          name="institutionalEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">
                                Correo institucional <span className="text-gray-400 font-normal">(opcional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="tucorreo@universidad.edu.pe" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormDescription>
                                Agrega tu correo institucional para verificar tu estatus de estudiante
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={studentForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Correo electrónico</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="tucorreo@ejemplo.com" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={studentForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Nombre de usuario</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="chambeador123" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={studentForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Contraseña</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Al menos 8 caracteres" 
                                    {...field} 
                                    className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={studentForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Confirmar contraseña</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Confirma tu contraseña" 
                                    {...field} 
                                    className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-6 font-bold text-lg bg-[#8A4EFC] hover:bg-[#7A3EEC] text-white rounded-lg shadow-md hover:shadow-xl transition-all"
                        >
                          <span className="text-white">{isSubmitting ? '¡Creando tu cuenta...' : '¡UNIRSE A PROJECT CORE!'}</span>
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-slate-600">
                        Al registrarte, aceptas nuestros <a href="#" className="text-[#8A4EFC] hover:underline">Términos y Condiciones</a>.
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="business" className="mt-0">
                  <Form {...businessForm}>
                    <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-5">
                      <div className="space-y-5">
                        <FormField
                          control={businessForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Nombre completo del representante</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Tu nombre completo" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={businessForm.control}
                            name="businessName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Nombre de la empresa</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nombre de tu empresa" 
                                    {...field} 
                                    className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={businessForm.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Tipo de empresa</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3">
                                      <SelectValue placeholder="Selecciona el tipo" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="microempresa">Microempresa</SelectItem>
                                    <SelectItem value="pequeña">Pequeña Empresa</SelectItem>
                                    <SelectItem value="mediana">Mediana Empresa</SelectItem>
                                    <SelectItem value="startup">Startup</SelectItem>
                                    <SelectItem value="independiente">Negocio Independiente</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={businessForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Correo electrónico</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="tucorreo@empresa.com" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={businessForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Nombre de usuario</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="empresadigital123" 
                                  {...field} 
                                  className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={businessForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Contraseña</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Al menos 8 caracteres" 
                                    {...field} 
                                    className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={businessForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Confirmar contraseña</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Confirma tu contraseña" 
                                    {...field} 
                                    className="w-full rounded-lg border border-gray-300 focus:border-[#8A4EFC] focus:ring-[#8A4EFC]/10 py-3"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-6 font-bold text-lg bg-[#8A4EFC] hover:bg-[#7A3EEC] text-white rounded-lg shadow-md hover:shadow-xl transition-all"
                        >
                          <span className="text-white">{isSubmitting ? '¡Creando tu cuenta...' : '¡UNIRSE A PROJECT CORE!'}</span>
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-slate-600">
                        Al registrarte, aceptas nuestros <a href="#" className="text-[#8A4EFC] hover:underline">Términos y Condiciones</a>.
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right side - Hero Image */}
          <div className="lg:w-1/2 hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-300 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-300 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#8A4EFC]">
                  {activeTab === "student" ? (
                    "¡Encuentra oportunidades laborales ideales para ti!"
                  ) : (
                    "¡Conecta con talento joven para impulsar tu negocio!"
                  )}
                </h2>
                
                <div className="relative my-8">
                  <svg className="w-full h-auto" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                    {activeTab === "student" ? (
                      // Student illustration
                      <>
                        <circle cx="150" cy="150" r="120" fill="#8A4EFC" opacity="0.1" />
                        <g className="animate-bounce" style={{animationDuration: '3s'}}>
                          <circle cx="150" cy="80" r="40" fill="#8A4EFC" />
                          <rect x="130" y="125" width="40" height="80" rx="20" fill="#8A4EFC" />
                          <rect x="110" y="145" width="80" height="20" rx="10" fill="#8A4EFC" opacity="0.8" />
                          <rect x="130" y="210" width="20" height="50" rx="10" fill="#8A4EFC" />
                          <rect x="150" y="210" width="20" height="50" rx="10" fill="#8A4EFC" />
                          <g>
                            <circle cx="200" cy="100" r="20" fill="white" stroke="#8A4EFC" strokeWidth="4" />
                            <text x="200" y="105" fontSize="18" fontWeight="bold" fill="#8A4EFC" textAnchor="middle">+5</text>
                          </g>
                        </g>
                        <g className="animate-pulse" transform="translate(80, 60)">
                          <rect x="0" y="0" width="60" height="30" rx="15" fill="#FFB800" />
                          <text x="30" y="19" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">CHAMBAZO</text>
                        </g>
                      </>
                    ) : (
                      // Business illustration
                      <>
                        <circle cx="150" cy="150" r="120" fill="#8A4EFC" opacity="0.1" />
                        <rect x="90" y="100" width="120" height="100" rx="10" fill="#6D28D9" />
                        <rect x="110" y="70" width="80" height="30" rx="10" fill="#8A4EFC" />
                        <rect x="100" y="130" width="100" height="10" rx="5" fill="white" opacity="0.7" />
                        <rect x="100" y="150" width="100" height="10" rx="5" fill="white" opacity="0.7" />
                        <rect x="100" y="170" width="60" height="10" rx="5" fill="white" opacity="0.7" />
                        <g className="animate-bounce" style={{animationDuration: '3s'}}>
                          <circle cx="210" cy="120" r="25" fill="#8A4EFC" />
                          <rect x="200" y="150" width="20" height="50" rx="10" fill="#8A4EFC" />
                          <rect x="190" y="160" width="40" height="10" rx="5" fill="#8A4EFC" opacity="0.8" />
                          <rect x="200" y="205" width="10" height="25" rx="5" fill="#8A4EFC" />
                          <rect x="210" y="205" width="10" height="25" rx="5" fill="#8A4EFC" />
                        </g>
                        <g className="animate-pulse" transform="translate(70, 90)">
                          <rect x="0" y="0" width="60" height="30" rx="15" fill="#FFB800" />
                          <text x="30" y="19" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">CHAMBAZO</text>
                        </g>
                      </>
                    )}
                  </svg>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#8A4EFC]/10 text-[#8A4EFC] flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      {activeTab === "student" 
                        ? "Accede a oportunidades exclusivas para estudiantes"
                        : "Encuentra talento joven y fresco para tu negocio"
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#8A4EFC]/10 text-[#8A4EFC] flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      {activeTab === "student" 
                        ? "Crea un perfil que destaque tus habilidades y experiencia"
                        : "Publica tus ofertas y encuentra el match perfecto"
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-[#8A4EFC]/10 text-[#8A4EFC] flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      {activeTab === "student" 
                        ? "Conecta directamente con empresas buscando personas como tú"
                        : "Ahorra tiempo y recursos en el proceso de reclutamiento"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
