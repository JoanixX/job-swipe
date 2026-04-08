import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, ArrowLeft, Mail, Hash } from "lucide-react";

// Esquema de validación para login de estudiante
const studentLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

// Esquema de validación para login de PYME (empresa):
const pymeLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

// Tipos para los formularios
type StudentLoginFormValues = z.infer<typeof studentLoginSchema>;
type PymeLoginFormValues = z.infer<typeof pymeLoginSchema>;

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const { toast } = useToast();
  const [authStep, setAuthStep] = useState<"select" | "student" | "pyme">("select");

  // Redireccionar si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      if (user.userType === 'business') {
        setLocation("/company-dashboard");
      } else {
        setLocation("/student-dashboard");
      }
    }
  }, [user, setLocation]);

  // Formulario de login de estudiante
  const studentLoginForm = useForm<StudentLoginFormValues>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Formulario de login de PYME
  const pymeLoginForm = useForm<PymeLoginFormValues>({
    resolver: zodResolver(pymeLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onStudentLoginSubmit = async (data: StudentLoginFormValues) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      if (true) {
        const resData = {
          access_token: 'fake_access_token_student',
          role: 'student'
        };
        localStorage.setItem('token', resData.access_token);
        localStorage.setItem('role', resData.role);
      toast({
          title: '¡Inicio de sesión exitoso!',
          description: 'Bienvenido a Project Core',
        });
        setLocation('/student-dashboard');
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Email o contraseña incorrectos');
      }
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Email o contraseña incorrectos',
        variant: 'destructive',
      });
    }
  };

  const onPymeLoginSubmit = async (data: PymeLoginFormValues) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      if (true) {
        const resData = {
          access_token: 'fake_access_token_pyme',
          role: 'company'
        };
        localStorage.setItem('token', resData.access_token);
        localStorage.setItem('role', resData.role);
      toast({
          title: '¡Inicio de sesión exitoso!',
          description: 'Bienvenido a Project Core',
        });
        if (resData.role === 'company') {
          setLocation('/company-dashboard');
        } else if (resData.role === 'student') {
          setLocation('/student-dashboard');
        } else {
          setLocation('/home');
        }
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Email o contraseña incorrectos');
      }
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Email o contraseña incorrectos',
        variant: 'destructive',
      });
    }
  };

  const handleStudentRegistration = () => {
    setLocation("/register-student");
  };

  const handleCompanyRegistration = () => {
    setLocation("/register-company");
  };

  const goBack = () => {
    if (authStep === "select") {
      setLocation("/chambea-ya");
    } else {
      setAuthStep("select");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0b3d] to-[#0a0a0a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF258D' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF258D] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#390062] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-[#1a0b3d]/80 backdrop-blur-sm border-b border-[#FF258D]/20 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-[#FF258D] to-[#390062] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">CY</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#FF258D] to-white bg-clip-text text-transparent">
            Project Core
          </span>
        </div>
        <button
          onClick={goBack}
          className="text-white hover:text-[#FF258D] transition-colors duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {authStep === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-[#1a0b3d]/80 backdrop-blur-md p-8 rounded-xl border border-[#FF258D]/30 shadow-2xl"
              >
            <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold text-white mb-4 font-['League_Spartan']">
                    Bienvenido a Project Core
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Conecta con oportunidades reales
                  </p>
                </div>

                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      ¿Cómo quieres acceder?
                    </h3>
                    <p className="text-gray-300">
                      Selecciona tu tipo de cuenta para continuar
                    </p>
            </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="bg-[#0a0a0a]/50 border-[#FF258D]/30 hover:border-[#FF258D]/50 cursor-pointer transition-all duration-300"
                        onClick={() => setAuthStep("student")}
                      >
                        <CardHeader className="text-center">
                          <div className="w-16 h-16 bg-[#FF258D] rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-white text-xl">Estudiante</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-300 text-center">
                            Accede con tu email y contraseña
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="bg-[#0a0a0a]/50 border-[#FF258D]/30 hover:border-[#FF258D]/50 cursor-pointer transition-all duration-300"
                        onClick={() => setAuthStep("pyme")}
                      >
                        <CardHeader className="text-center">
                          <div className="w-16 h-16 bg-[#FF258D] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-white text-xl">PYME</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-300 text-center">
                            Accede con tu email y contraseña
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#FF258D]/20">
                    <p className="text-gray-400 mb-4">¿No tienes una cuenta?</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white"
                        onClick={handleStudentRegistration}
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Registrarse como Estudiante
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#FF258D] text-[#FF258D] hover:bg-[#FF258D] hover:text-white"
                        onClick={handleCompanyRegistration}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Registrarse como PYME
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {authStep === "student" && (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#1a0b3d]/80 backdrop-blur-md p-8 rounded-xl border border-[#FF258D]/30 shadow-2xl"
              >
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-[#FF258D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2 font-['League_Spartan']">
                    Iniciar Sesión - Estudiante
                  </h1>
                  <p className="text-gray-300">
                    Accede con tu email y contraseña
                  </p>
                </div>

                <Form {...studentLoginForm}>
                  <form onSubmit={studentLoginForm.handleSubmit(onStudentLoginSubmit)} className="space-y-6">
                    <FormField
                      control={studentLoginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-base flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="tuemail@ejemplo.com" 
                              {...field}
                              className="py-6 px-4 bg-[#0a0a0a]/50 border-[#FF258D]/30 text-white placeholder-gray-400 focus:border-[#FF258D] focus:ring-[#FF258D]" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentLoginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-base flex items-center">
                            <Hash className="w-4 h-4 mr-2" />
                            Contraseña
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Tu contraseña" 
                              {...field}
                              className="py-6 px-4 bg-[#0a0a0a]/50 border-[#FF258D]/30 text-white placeholder-gray-400 focus:border-[#FF258D] focus:ring-[#FF258D]" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-bold bg-[#FF258D] hover:bg-[#FF258D]/80 text-white shadow-lg hover:shadow-[#FF258D]/30 transition-all duration-300"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "INICIAR SESIÓN"}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}

            {authStep === "pyme" && (
              <motion.div
                key="pyme"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#1a0b3d]/80 backdrop-blur-md p-8 rounded-xl border border-[#FF258D]/30 shadow-2xl"
              >
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-[#FF258D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2 font-['League_Spartan']">
                    Iniciar Sesión - PYME
                  </h1>
                  <p className="text-gray-300">
                    Accede con tu email y contraseña
                  </p>
                </div>

                <Form {...pymeLoginForm}>
                  <form onSubmit={pymeLoginForm.handleSubmit(onPymeLoginSubmit)} className="space-y-6">
                    <FormField
                      control={pymeLoginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-base flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="tuemail@ejemplo.com" 
                              {...field}
                              className="py-6 px-4 bg-[#0a0a0a]/50 border-[#FF258D]/30 text-white placeholder-gray-400 focus:border-[#FF258D] focus:ring-[#FF258D]" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pymeLoginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-base flex items-center">
                            <Hash className="w-4 h-4 mr-2" />
                            Contraseña
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Tu contraseña" 
                              {...field}
                              className="py-6 px-4 bg-[#0a0a0a]/50 border-[#FF258D]/30 text-white placeholder-gray-400 focus:border-[#FF258D] focus:ring-[#FF258D]" 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-bold bg-[#FF258D] hover:bg-[#FF258D]/80 text-white shadow-lg hover:shadow-[#FF258D]/30 transition-all duration-300"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Iniciando sesión..." : "INICIAR SESIÓN"}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}