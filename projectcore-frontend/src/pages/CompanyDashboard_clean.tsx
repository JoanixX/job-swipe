import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  CheckCircle,
  Star,
  User,
  GraduationCap,
  FileText,
  Send,
  MessageCircle,
  Brain,
  FolderOpen
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

interface Project {
  id: string
  title: string
  description: string
  budget: number
  skills: string[]
  status: 'active' | 'completed' | 'draft'
  created_at: string
  updated_at: string
}

interface Student {
  id: string
  name: string
  university: string
  skills: string[]
  experience_level: string
}

interface Application {
  id: string
  project_id: string
  student_id: string
  cover_letter: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  project?: Project
  student?: Student
}

interface CompanyData {
  contact_name: string
  company_name: string
}

const CompanyDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [isMobile, setIsMobile] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [showJobOfferForm, setShowJobOfferForm] = useState(false)

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
        ease: "easeOut"
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] text-white">
      {/* Mobile Header */}
      {isMobile && (
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-30 bg-[#0f0f1a]/95 backdrop-blur-md border-b border-white/10 p-4"
        >
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
        </motion.header>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : isMobile ? -280 : -256,
          opacity: isSidebarOpen ? 1 : isMobile ? 0 : 0.3
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full w-64 bg-[#0f0f1a]/90 backdrop-blur-xl border-r border-white/10 z-40 p-6 ${
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
                  setActiveSection(item.id)
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  activeSection === item.id 
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
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      } ${isMobile ? 'w-full pt-20' : 'max-w-full'}`}>
        <AnimatePresence mode="wait">
          {activeSection === 'inicio' && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
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

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#0f0f1a] border border-white/5 rounded-xl p-6 transition-all duration-300 hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Proyectos Activos</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#6a00f4] to-[#ff1cf7] bg-clip-text text-transparent">
                        0
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-[#6a00f4]/20 to-[#ff1cf7]/20 rounded-lg">
                      <Briefcase className="w-6 h-6 text-[#6a00f4]" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#0f0f1a] border border-white/5 rounded-xl p-6 transition-all duration-300 hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Estudiantes Conectados</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#f72585] to-[#b5179e] bg-clip-text text-transparent">
                        0
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-[#f72585]/20 to-[#b5179e]/20 rounded-lg">
                      <Users className="w-6 h-6 text-[#f72585]" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#0f0f1a] border border-white/5 rounded-xl p-6 transition-all duration-300 hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Proyectos Completados</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
                        0
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-[#4ade80]/20 to-[#22c55e]/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-[#4ade80]" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#0f0f1a] border border-white/5 rounded-xl p-6 transition-all duration-300 hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Nuevas Aplicaciones</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
                        0
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 rounded-lg">
                      <Star className="w-6 h-6 text-[#fbbf24]" />
                    </div>
                  </div>
                </motion.div>
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
                    onClick={() => setActiveSection('aplicaciones')}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#f72585] to-[#b5179e] rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#f72585]/25"
                  >
                    <Users className="w-5 h-5" />
                    <span>Ver Aplicaciones</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection('proyectos')}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#4ade80]/25"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Gestionar Proyectos</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === 'proyectos' && (
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
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No tienes proyectos activos</p>
                  </div>
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

          {activeSection === 'aplicaciones' && (
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
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No hay aplicaciones pendientes</p>
                  </div>
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

          {activeSection === 'configuracion' && (
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
                  <CardTitle className="text-white">Configuración de la Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6a00f4]"
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-[#6a00f4] to-[#ff1cf7] rounded-lg text-white font-medium"
                  >
                    Guardar Cambios
                  </motion.button>
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
